(function(root){
'use strict';
// Shared interaction widgets. Class adapters send plans to the existing rule engines.
const S=root.GameSymbols,M=root.MiddleClass,R=root.WCARecords,esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const labels={food:'食料',health:'医療',education:'教育',luxury:'ぜいたく品',influence:'影響力'},skill={Gray:'未熟練',Green:'農業',Blue:'ぜいたく品',White:'医療',Orange:'教育',Purple:'メディア'},classes={Working:'労働者',Middle:'中産階級',Capitalist:'資本家',State:'国家',Foreign:'海外市場'};
const defs=()=>Object.fromEntries([...root.WCA_COMPANIES,...root.WCA_EXTRA_COMPANIES].map(d=>[d.id,d]));
const select=(id,label,items)=>`<label>${label}<select id="${id}">${items.map(([id,name])=>`<option value="${esc(id)}">${esc(name)}</option>`).join('')}</select></label>`;
function policy(s,container,ids,commit){
 const available=Object.keys(s.positions).filter(id=>!s.proposals[id]);
 container.innerHTML=available.length?`<div class="shared-action-fields">${select(ids.policy,'政策',available.map(id=>[id,`政策${id}（現在${s.positions[id]}）`]))}${select(ids.target,'提議先',[])}</div><p class="muted">${ids.radical?'2区画先にも提議できます。即時投票は行いません。':'現在位置に隣接する区画へ提議します。'}</p><label><input id="${ids.immediate}" type="checkbox">${S.icon('influence')}1を支払い即時投票</label><button id="${ids.button}">法案を提議</button>`:'<p class="muted">提議できる政策がありません。</p>';
 if(!available.length)return;
 const policy=container.querySelector('#'+ids.policy),target=container.querySelector('#'+ids.target),immediate=container.querySelector('#'+ids.immediate);
 const update=()=>{const from=s.positions[policy.value];target.innerHTML=['A','B','C'].filter(x=>(ids.radical?x!==from:Math.abs(x.charCodeAt(0)-from.charCodeAt(0))===1)).map(x=>`<option>${x}</option>`).join('');};policy.onchange=update;update();
 container.querySelector('#'+ids.button).onclick=()=>commit({id:policy.value,target:target.value,immediate:immediate.checked});
}
function exports(s,owner,container,button,commit){
 const v=s.records.personal[owner].values,offers=s.records.trade.exportCard.offers,attribute=owner==='Middle'?'data-middle-export':'data-player-export';
 container.innerHTML=`<p class="muted">輸出カードの取引を選択します。各取引は1回までです。${owner==='Capitalist'?'自由貿易区の在庫から先に販売します。':''}</p><div class="export-choice-grid">${offers.map((o,i)=>owner==='State'&&!['food','luxury'].includes(o.resource)?'':`<label class="export-choice"><input type="checkbox" ${attribute}="${i}" data-export-choice="${i}"><span>${S.icon(o.resource)} ${o.quantity} → ${o.revenue}${S.icon('vardis')}${owner==='Middle'?' ＋'+S.icon('vp',1):''}<small>在庫 ${v[o.resource]}${owner==='Capitalist'&&['food','luxury'].includes(o.resource)?` ＋ 自由貿易区 ${v['freeTrade'+o.resource[0].toUpperCase()+o.resource.slice(1)]||0}`:''}</small></span></label>`).join('')}</div><p class="export-total" aria-live="polite"></p><p class="notice export-error" role="alert" hidden></p>`;
 const inputs=[...container.querySelectorAll('[data-export-choice]')],read=()=>inputs.filter(x=>x.checked).map(x=>Number(x.dataset.exportChoice));
 const update=()=>{let r=s.records,error='',revenue=0;const transactions=read();for(const i of transactions){const o=offers[i];revenue+=o.revenue;try{if(owner==='Capitalist')r=R.applyCapitalistExport(r,o.resource,o.quantity,o.revenue);}catch(e){error=e.message;}}
 if(owner==='State'&&transactions.length)try{const next=root.StatePlayer.copy(s);root.StatePlayer.basic(next,{action:'SFM',transactions});}catch(e){error=e.message;}
 if(owner==='Middle'&&transactions.length)try{M.basic(s.records,s.positions,{action:'SFM',transactions});}catch(e){error=e.message;}
 container.querySelector('.export-total').innerHTML=`${transactions.length}件 ／ 収入合計 ${revenue}${S.icon('vardis')}${owner==='Middle'?' ／ '+S.icon('vp',transactions.length):''}`;
 const box=container.querySelector('.export-error');box.textContent=error;box.hidden=!error;button.disabled=!transactions.length||!!error||!!(owner==='Middle'?s.middleBasicUsed:s.playerCards?.used);};
 inputs.forEach(x=>x.onchange=update);button.onclick=()=>{update();if(!button.disabled)commit(read());};update();
}
function loan(s,owner,container,button,commit){const v=s.records.personal[owner].values,key=owner==='Capitalist'?'capital':'cash',name=key==='capital'?'資本':'資金';container.innerHTML=`<p>貸付金 ${v.loans}枚 ／ ${name} ${v[key]}${S.icon('vardis')}</p><p class="muted">${name}50${S.icon('vardis')}で1枚返済します。返済のために新しい貸付金は利用できません。</p>`;button.textContent='貸付金1枚を返済';button.disabled=!(v.loans>0&&v[key]>=50);button.onclick=commit;}
function swap(s,owner,container,button,commit){
 const r=s.records,d=defs(),middle=owner==='Middle',prefix=middle?'middle':'working',counts=r.common.unemployed[owner];
 const targets=middle?Object.entries(r.companies).flatMap(([id,c])=>c.status!=='built'?[]:c.slots.flatMap((x,i)=>x.owner==='Middle'&&x.skill!=='Gray'&&M.definition(r,id).workers[i].type==='Unskilled'?[{worker:`${id}:${i}`,skill:x.skill,label:`${classes[d[id].class]}・${d[id].name_jp}・${skill[x.skill]}`}]:[])):R.workingSwapCandidates(r).map(t=>({...t,label:classes[d[t.worker.split(':')[1]].class]+'・'+t.label.replace(/ \d+枠/,'')}));
 container.innerHTML=`<p class="muted">未熟練スロットの熟練労働者を失業労働者と交代します。誓約状態を引き継ぎます。この手番は入れ替えだけを何度でも実行できます。</p>${targets.length?select(prefix+'SwapWorker','戻す熟練労働者',targets.map(t=>[t.worker,t.label]))+select(prefix+'SwapSkill','交代する失業労働者',[]):'<p class="muted">入れ替えできる在職熟練者がいません。</p>'}<p id="${prefix}SwapNotice" class="muted"></p>`;
 const worker=container.querySelector('#'+prefix+'SwapWorker'),replacement=container.querySelector('#'+prefix+'SwapSkill');
 const update=()=>{const t=targets.find(x=>x.worker===worker?.value),available=t?Object.entries(skill).filter(([k])=>k!==t.skill&&counts[k]>0):[];if(replacement)replacement.innerHTML=available.map(([k,l])=>`<option value="${k}">${l}（失業${counts[k]}人）</option>`).join('');button.disabled=!available.length;container.querySelector('#'+prefix+'SwapNotice').textContent=available.length?'':'交代できる失業労働者がいません。';};if(worker)worker.onchange=update;update();button.onclick=()=>{if(!button.disabled)commit({worker:worker.value,skill:replacement.value});};
}
function use(s,owner,container,commit){
 const r=s.records,v=r.personal[owner].values,middle=owner==='Middle',prefix=middle?'middle':'working',d=defs(),stock=k=>v[middle?'consumed'+k[0].toUpperCase()+k.slice(1):k],next=middle?M.prosperity[Math.min(M.prosperity.length-1,v.prosperityStep+1)]:Math.min(10,Number(v.prosperity)+1);
 const targets=middle?[...Object.entries(skill).filter(([k])=>r.common.unemployed.Middle[k]>0).map(([k,l])=>({id:'u:'+k,skill:k,label:'失業者・'+l})),...Object.entries(r.companies).flatMap(([id,c])=>c.status!=='built'?[]:c.slots.flatMap((x,i)=>x.owner==='Middle'&&x.skill==='Gray'&&M.definition(r,id).workers[i].type==='Unskilled'?[{id:`c:${id}:${i}`,skill:x.skill,label:`${classes[d[id].class]}・${d[id].name_jp}・未熟練`}]:[]))]:R.educationCandidates(r).map(t=>({...t,label:t.id.startsWith('c:')?classes[d[t.id.split(':')[1]].class]+'・'+t.label.replace(/ \d+枠/,''):t.label}));
 container.innerHTML=`<div class="use-resource-grid">${['health','luxury','education'].map(k=>`<article class="use-resource-card"><h4>${S.icon(k)} <small>所持 ${stock(k)}</small></h4><p>人口 ${v.population}人 → ${v.population}個使用</p><p>繁栄度 ${v.prosperity} → ${next} ／ ${S.icon('vp',next)}${k==='health'?' ＋ '+S.icon('vp',2)+'・未熟練者1人':k==='education'?'・技能を変更':''}</p>${k==='education'?select(middle?'middleEducateWorker':'workingEducationWorker','教育対象',targets.map(t=>[t.id,t.label]))+select(middle?'middleEducateSkill':'workingEducationSkill','新しい技能',[]):''}<button id="${prefix}Use${k[0].toUpperCase()+k.slice(1)}" data-use-resource="${k}" ${v.population>0&&stock(k)>=v.population&&(k!=='education'||targets.length)?'':'disabled'}>この資源を使用</button></article>`).join('')}</div>`;
 const worker=container.querySelector('#'+(middle?'middleEducateWorker':'workingEducationWorker')),newSkill=container.querySelector('#'+(middle?'middleEducateSkill':'workingEducationSkill'));
 const refresh=()=>{const target=targets.find(x=>x.id===worker.value);newSkill.innerHTML=Object.entries(skill).filter(([k])=>k!=='Gray'&&k!==target?.skill).map(([k,l])=>`<option value="${k}">${l}</option>`).join('');};worker.onchange=refresh;refresh();
 container.querySelectorAll('[data-use-resource]').forEach(button=>button.onclick=()=>{const key=button.dataset.useResource,target=targets.find(x=>x.id===worker.value);if(!button.disabled)commit({resource:key,...(key==='education'?{worker:target.id,workerLabel:target.label,skill:newSkill.value}:{})});});
}
function purchase(s,owner,container,button,commit){
 const r=s.records,m=r.personal[owner].values, middle=owner==='Middle', prefix=middle?'middle':'working',resourceLabels=middle?labels:Object.fromEntries(Object.entries(labels).filter(([k])=>k!=='influence')); let selectedResource='food';
 const entries=owner=>Object.entries(resourceLabels).map(([key,label])=>({key,label,...M.source(r,s.positions,key,owner)})).filter(x=>x.price!=null&&(x.key!=='influence'||owner==='State'));
 const card=owner=>{const items=entries(owner);return `<article class="purchase-source-card purchase-${owner.toLowerCase()}" data-purchase-owner="${owner}"><h4>${classes[owner]}</h4>${owner==='Middle'&&middle?'<p class="purchase-note">自家購入の支払額は0V。販売用倉庫から購入済みエリアへ移します。</p>':''}<table><caption class="visually-hidden">${classes[owner]}の商品価格と在庫</caption><thead><tr><th>商品・サービス</th><th>単価</th><th>在庫</th></tr></thead><tbody>${items.map(x=>`<tr data-purchase-product="${x.key}"><th scope="row">${S.icon(x.key)}</th><td>${x.price}${S.icon('vardis')}</td><td>${x.stock===Infinity?'無制限':x.stock??'未確認'}</td></tr>`).join('')}</tbody></table><div class="purchase-source-controls"><label>資源<select data-buy-resource="${owner}" ${middle?`data-middle-buy-resource="${owner}"`:owner==='Capitalist'?'id="workingResource"':''}>${Object.entries(resourceLabels).map(([key,label])=>`<option value="${key}">${label}${items.some(x=>x.key===key)?'':'（取扱なし）'}</option>`).join('')}</select></label><label>個数 <small data-purchase-limit="${owner}"></small><input id="${prefix}BuyQty${owner}" data-buy-source="${owner}" ${middle?`data-middle-buy-source="${owner}"`:`data-working-source="${owner}"`} type="number" min="0" step="1" value="0" aria-label="${classes[owner]}から購入する個数"></label></div><p class="purchase-subtotal" data-purchase-subtotal="${owner}"></p></article>`;};
 container.innerHTML=`<p class="purchase-limit">購入上限：<strong>1か所につき人口${m.population}個まで</strong>。同じ資源を最大2か所から購入できます。</p><div class="purchase-source-grid">${(middle||M.hasMiddle(r)?['Capitalist','Middle','State']:['Capitalist','State']).map(card).join('')}</div><details class="purchase-foreign"><summary>海外市場から購入</summary>${card('Foreign')}</details><p id="${middle?'middleBuyTotal':'workingCost'}" class="setup-summary" aria-live="polite"></p><p id="${prefix}BuyError" class="notice purchase-error" role="alert" hidden></p>`;
 const controls=[...container.querySelectorAll('[data-buy-source]')],read=()=>controls.map(el=>({source:el.dataset.buySource,resource:container.querySelector(`[data-buy-resource="${el.dataset.buySource}"]`).value,qty:Number(el.value)})).filter(x=>x.qty!==0);
 const update=()=>{
  const purchases=read(),resources=new Set(purchases.map(x=>x.resource));let total=0,cost=0,error='';
  for(const el of controls){const owner=el.dataset.buySource,key=container.querySelector(`[data-buy-resource="${owner}"]`).value,x=M.source(r,s.positions,key,owner),qty=Number(el.value),available=entries(owner).some(item=>item.key===key),max=available?Math.min(m.population,x.stock??0):0,price=available?(owner==='Middle'&&middle?0:x.price):undefined;
   el.max=String(max);el.disabled=!Number.isFinite(price)||max===0;
   container.querySelector(`[data-purchase-limit="${owner}"]`).textContent=available?`（最大${max}個）`:'（取扱なし）';
   container.querySelector(`[data-purchase-subtotal="${owner}"]`).innerHTML=`小計 ${Number.isFinite(qty)?qty:0}個・${Number.isFinite(qty*price)?qty*price:0}${S.icon('vardis')}`;
   container.querySelectorAll(`[data-purchase-owner="${owner}"] [data-purchase-product]`).forEach(row=>row.classList.toggle('selected',row.dataset.purchaseProduct===key));
   if(el.validity.badInput||!Number.isSafeInteger(qty)||qty<0)error='個数は0以上の整数で入力してください。';
   if(qty>0&&Number.isFinite(qty)){total+=qty;cost+=qty*price;}
  }
  container.querySelector('#'+(middle?'middleBuyTotal':'workingCost')).innerHTML=`合計 ${total}個 ／ 支払合計 ${Number.isFinite(cost)?cost:0}${S.icon('vardis')} ／ 所持資金 ${m.cash}${S.icon('vardis')}`;
  if(!error&&purchases.length>2)error='購入先は最大2か所です。数量を入力する購入先を2か所以下にしてください。';
  if(!error&&resources.size>1)error='1回に購入できる資源は1種類です。各カードで同じ資源を選んでください。';
  if(!error&&purchases.length)try{const plan={action:'BGS',resource:purchases[0].resource,purchases:purchases.map(({source,qty})=>({source,qty}))};if(middle)M.purchase(r,s.positions,plan.resource,plan.purchases);else R.applyWorkingBasic(r,plan,s.positions);}catch(e){error=e.message;}
  const box=container.querySelector('#'+prefix+'BuyError');box.textContent=error;box.hidden=!error;button.disabled=!!(middle?s.middleBasicUsed:s.workingBasicUsed)||!!error||!purchases.length;
 };
 const synchronize=key=>{const changed=selectedResource!==key;selectedResource=key;for(const el of controls){container.querySelector(`[data-buy-resource="${el.dataset.buySource}"]`).value=key;if(changed)el.value='0';}update();};
 for(const el of controls){el.oninput=update;const select=container.querySelector(`[data-buy-resource="${el.dataset.buySource}"]`);select.onchange=()=>synchronize(select.value);}
 button.onclick=()=>{update();if(button.disabled)return;const purchases=read();commit({action:'BGS',resource:purchases[0].resource,purchases:purchases.map(({source,qty})=>({source,qty}))});};synchronize(selectedResource);
}
function companyPicker(s,owner,container,onselect){
 const d=defs(),items=Object.entries(s.records.companies).filter(([id,c])=>d[id].class===owner&&c.status==='market');let selected=items[0]?.[0];
 container.innerHTML=`<div class="build-choice-grid">${items.map(([id])=>`<label class="build-choice"><input type="radio" name="build-${owner}" data-build-choice="${esc(id)}" value="${esc(id)}" ${id===selected?'checked':''}>${R.buildCompanyCard(d[id],s.records)}</label>`).join('')}</div>${items.length?'':'<p class="muted">市場に企業がありません。</p>'}`;
 const update=()=>{container.querySelectorAll('.build-choice').forEach(x=>x.classList.toggle('selected',x.querySelector('input').checked));onselect(selected);};container.querySelectorAll('[data-build-choice]').forEach(x=>x.onchange=()=>{selected=x.value;update();});update();
}
function build(s,owner,container,button,commit){
 const r=s.records,d=defs(),middle=owner==='Middle',prefix=middle?'middle':'cap';let selected;
 container.innerHTML=`<div class="build-picker"></div><div class="build-fields"></div>`;
 companyPicker(s,owner,container.querySelector('.build-picker'),id=>{selected=id;const def=d[id],fields=container.querySelector('.build-fields');button.disabled=!def||!!s.playerCards?.used||!!s.middleBasicUsed;if(!def){fields.innerHTML='';return;}
 const wages=Object.keys(def.wages||{}).length?select(prefix+'BuildWage','賃金',['L1','L2','L3'].filter(x=>({L1:1,L2:2,L3:3})[x]>=({A:3,B:2,C:1})[s.positions[2]]).map(x=>[x,`${x}（${def.wages[x]}V）`])):'';
 if(middle){const available=M.workers(r);fields.innerHTML=wages+def.workers.filter(w=>w.type==='MiddleClass').map((w,i)=>select(`middleBuildWorker${i}`,`${skill[w.color]}・中産階級（必須）`,available.filter(x=>R.workerFits(w,'Middle',x.skill,def.class)).map(x=>[x.ref,`${x.ref.startsWith('u:')?'失業者':classes[d[x.ref.split(':')[1]].class]+'・'+d[x.ref.split(':')[1]].name_jp}・${skill[x.skill]}（${x.count}人）`]))).join('')+(Object.keys(def.wages||{}).length?select('middleBuildEmployee','労働者階級（任意）',[['','雇わない'],...Object.entries(skill).filter(([k])=>r.common.unemployed.Working[k]>0&&def.workers.some(w=>w.type!=='MiddleClass'&&R.workerFits(w,'Working',k,def.class)&&(w.type!=='Unskilled'||k==='Gray'||r.common.unemployed.Working.Gray===0)))]):'');
 }else{const plan=R.staffingPlan(def,r);fields.innerHTML=wages+(def.workers.length?select('capBuildStaffAll','設立時の配置',[['no','配置しない'],...(plan?[['yes','全スロットへ配置（全員誓約中）']]:[])])+`<p class="muted">${plan?plan.map(x=>`${classes[x.owner]}・${skill[x.skill]}`).join(' ／ '):'全スロットを埋められる失業労働者がいません。'}</p>`:'<p class="muted">自動化企業：ワーカー不要</p>');}
 });
 button.textContent='選んだ企業を設立';button.onclick=()=>{const def=d[selected];if(!def||button.disabled)return;const fields=container.querySelector('.build-fields'),wage=fields.querySelector('#'+prefix+'BuildWage')?.value;
 if(middle){commit({action:'BC',id:selected,workers:def.workers.filter(w=>w.type==='MiddleClass').map((w,i)=>fields.querySelector('#middleBuildWorker'+i).value),wage,employee:fields.querySelector('#middleBuildEmployee')?.value});}
 else{const slots=fields.querySelector('#capBuildStaffAll')?.value==='yes'?R.staffingPlan(def,r):def.workers.map(w=>({owner:'empty',skill:w.color,committed:false})),common=root.WCA.copy(r.common);for(const x of slots)if(x.owner!=='empty')common.unemployed[x.owner][x.skill]--;commit({id:selected,common,value:{status:'built',wage:wage||'unknown',operating:slots.every(x=>x.owner!=='empty')?'yes':'no',machinery:false,strike:false,note:'',slots}});}
 };
}
root.PlayerActionUi={purchase,policy,exports,use,swap,loan,build,companyPicker};
})(globalThis);
