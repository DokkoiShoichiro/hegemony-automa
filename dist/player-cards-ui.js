(function(root){
'use strict';
let selected=null;
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const labels={Working:'労働者',Capitalist:'資本家'},resources={food:'食料',health:'医療',education:'教育',luxury:'ぜいたく品'},industries={Food:'食料',Luxury:'贅沢品',Health:'医療',Education:'教育',Media:'影響力'},skills={Gray:'未熟練',Green:'農業',Blue:'贅沢品',White:'医療',Orange:'教育',Purple:'メディア'};
function selection(s){const owner=root.PlayerCards.activeOwner(s),hand=s.playerCards?.classes[owner]?.hand||[];return hand.includes(selected)?selected:hand[0];}
function render(s,flow,commit){
 const P=root.PlayerCards,owner=Object.keys(s.playerCards?.classes||{}).find(id=>s.records?.participants[id]==='human');
 if(!owner){if(!s.playerCards&&s.phase==='player'){const note=document.createElement('p');note.className='muted';note.textContent='このゲームは実物の手札管理を使用しています。アプリ内のカード引き・効果を使うには「新しいゲーム」から開始してください。';flow.append(note);}return;}
 const pile=s.playerCards.classes[owner],active=s.phase==='player',used=s.playerCards.used;
 if(!pile.hand.includes(selected))selected=pile.hand[0];
 const panel=document.createElement('section');panel.className='player-hand';panel.id='playerHand';
 const hand=pile.hand.map(uid=>{const c=P.card(owner,uid),a=P.availability(s,owner,uid);return `<label class="hand-choice ${uid===selected?'selected':''}"><input type="radio" name="playerCard" value="${esc(uid)}" ${uid===selected?'checked':''} ${!active||used?'disabled':''}><span>${esc(c.name)}<small>${a.ready?'効果対応済み':P.effects[c.id]?'条件未成立':'基本アクション用・効果未対応'}</small></span></label>`;}).join('');
 panel.innerHTML=`<details ${active?'open':''}><summary>${labels[owner]}の手札 ${pile.hand.length}枚 · 山札 ${pile.deck.length}枚 · 捨て札 ${pile.discard.length}枚</summary>${active?`<p>${used?'この手番のメインアクションは実行済みです。フリーアクションを行うか手番を終了してください。':'使用するカードを選び、カード効果または下の基本アクションを1つ実行してください。'}</p>`:''}<div class="hand-grid">${hand}</div><div id="playerCardDetails"></div><details class="discard-cards"><summary>捨て札を見る</summary><ol>${pile.discard.map(uid=>`<li>${esc(P.card(owner,uid).name)}</li>`).join('')||'<li>なし</li>'}</ol></details></details>`;
 const heading=flow.querySelector('h2');if(heading)heading.after(panel);else flow.append(panel);
 const details=panel.querySelector('#playerCardDetails');
 const show=()=>{
  panel.querySelectorAll('.hand-choice').forEach(el=>el.classList.toggle('selected',el.querySelector('input').value===selected));
  const c=P.card(owner,selected);if(!c){details.innerHTML='';return;}
  const a=P.availability(s,owner,selected);
  details.innerHTML=`<h3>${esc(c.name)}</h3><p>${esc(c.effect)}</p>${c.requirement?`<p class="muted">使用条件：${esc(c.requirement)}</p>`:''}${c.bonus?`<p class="muted">正当性：${esc(c.bonus.detail||'+'+c.bonus.amount)}。2人戦は国家不参加のため適用しません。</p>`:''}${!a.ready?`<p class="notice">${esc(a.reason)}</p>`:''}${active&&!used&&a.ready?'<form id="playerCardEffectForm"><div id="cardEffectFields"></div><p id="cardEffectPreview" class="setup-summary" aria-live="polite"></p><button id="playCardEffect" type="submit">このカードの効果を使う</button></form>':''}`;
  if(!active||used||!a.ready)return;
  const form=details.querySelector('form'),fields=form.querySelector('#cardEffectFields'),w=s.records.personal.Working.values,cap=s.records.personal.Capitalist.values;
  const qtyField=(title,max)=>`<label>${title}<input id="effectQty" type="number" min="0" max="${max}" value="${Math.min(1,max)}"></label>`;
  if(['discountHealth','discountEducation','tourism'].includes(a.effect)){const key={discountHealth:'health',discountEducation:'education',tourism:'luxury'}[a.effect],stock=a.effect==='tourism'?cap[key]:s.records.common.values[key];fields.innerHTML=qtyField(`${resources[key]}の購入数（人口${w.population}・在庫${stock??'未確認'}）`,Math.min(w.population,stock||0));}
  else if(['sellHealth','sellEducation','sellLuxury'].includes(a.effect)){const key={sellHealth:'health',sellEducation:'education',sellLuxury:'luxury'}[a.effect];fields.innerHTML=qtyField(`${resources[key]}の売却数（1個10V・在庫${cap[key]??'未確認'}）`,Math.min(key==='luxury'?6:9,cap[key]||0));}
  else if(a.effect==='accident')fields.innerHTML=`<label>対象産業<select id="effectIndustry">${Object.entries(industries).map(([id,label])=>`<option value="${id}">${label}</option>`).join('')}</select></label>`;
  else if(['immigration','farm'].includes(a.effect)){const count=a.effect==='farm'?3:2;fields.innerHTML=Array.from({length:count},(_,i)=>`<label>${i+1}人目<select data-effect-worker>${a.effect==='immigration'?'<option value="">取り除かない</option>':''}${Object.entries(skills).filter(([id])=>s.records.common.unemployed.Working[id]>0).map(([id,label])=>`<option value="${id}">${label}（失業${s.records.common.unemployed.Working[id]}人）</option>`).join('')}</select></label>`).join('');}
  else if(a.effect==='exit'){const defs=[...root.WCA_COMPANIES,...root.WCA_EXTRA_COMPANIES];fields.innerHTML=`<label>売却する企業<select id="effectCompany">${Object.entries(s.records.companies).filter(([id,c])=>{const d=defs.find(d=>d.id===id);return d?.class==='Capitalist'&&c.status==='built'&&d.workers.length&&!d.tags?.includes('Automated')&&!c.slots.some(x=>x.committed);}).map(([id])=>{const d=defs.find(d=>d.id===id);return `<option value="${id}">${esc(d.name_jp)}（売却額${d.cost*2}V）</option>`;}).join('')}</select></label>`;}
  else if(['specialization','signingBonus'].includes(a.effect)){
   const specialization=a.effect==='specialization',limit=specialization?3:4;
   fields.innerHTML=`${specialization?`<label>獲得する熟練労働者<select id="effectSkill">${Object.entries(skills).filter(([id])=>id!=='Gray').map(([id,label])=>`<option value="${id}">${label}</option>`).join('')}</select></label>`:''}<p>${specialization?'獲得した熟練労働者も、この配置で使用できます。誓約中でない在職者は別の企業や組合へ移動できます。':'失業労働者だけを配置します。企業へ配置した1人につき所有者から4Vを受け取ります。'}企業・組合へ合わせて最大${limit}人。配置を省略することもできます。</p><div id="effectAssignments"></div>`;
   const assignments=()=>{
    const box=form.querySelector('#effectAssignments'),saved=new Map([...box.querySelectorAll('input,select')].map(el=>[el.dataset.assignmentKey,el.type==='checkbox'?el.checked:el.value]));
    const virtual=JSON.parse(JSON.stringify(s.records));if(specialization)virtual.common.unemployed.Working[form.querySelector('#effectSkill').value]++;
    const choices=P.workerChoices(virtual,specialization),workerLabel=worker=>worker.companyId?`${P.companyDefinition(virtual,worker.companyId).name_jp}・${worker.index+1}枠の${skills[worker.skill]}`:`${skills[worker.skill]}（失業${worker.count}人）`;
    const options=(req,companyId,keep=false)=>`${keep?'<option value="keep">現在の労働者を残す</option>':''}${choices.filter(worker=>(!companyId||worker.companyId!==companyId)&&(req.type!=='Skilled'||req.color===worker.skill)).map(worker=>`<option value="${esc(worker.ref)}">${esc(workerLabel(worker))}</option>`).join('')}`;
    const companies=Object.entries(virtual.companies).filter(([id,c])=>c.status==='built'&&c.slots.length>0&&c.slots.length<=limit&&!c.slots.some(slot=>slot.committed||slot.owner==='unknown'||slot.owner==='Middle')&&(specialization||c.slots.every(slot=>slot.owner==='empty')));
    box.innerHTML=companies.map(([id,company])=>{const d=P.companyDefinition(virtual,id);return `<fieldset><label><input type="checkbox" data-assign-company="${id}" data-assignment-key="company:${id}">${esc(d.name_jp)}</label><div class="card-assignment-slots" hidden>${company.slots.map((slot,index)=>`<label>${index+1}枠：${d.workers[index].type==='Skilled'?skills[d.workers[index].color]+'が必要':'任意の技能'}<select data-assign-slot="${id}" data-index="${index}" data-assignment-key="slot:${id}:${index}">${options(d.workers[index],id,slot.owner==='Working')}</select></label>`).join('')}</div></fieldset>`;}).join('')+(companies.length?'':'<p class="muted">現在、配置先として選べる企業はありません。</p>')+Object.entries(industries).filter(([industry])=>!virtual.personal.Working.unions[industry]).map(([industry,label])=>`<fieldset><label><input type="checkbox" data-assign-union="${industry}" data-assignment-key="union:${industry}">${label}の労働組合を設立（配置後に同産業で4人以上勤務、+2VP）</label><div class="card-assignment-slots" hidden><label>組合へ配置する熟練労働者<select data-union-worker="${industry}" data-assignment-key="union-worker:${industry}">${options({type:'Skilled',color:({Food:'Green',Luxury:'Blue',Health:'White',Education:'Orange',Media:'Purple'})[industry]})}</select></label></div></fieldset>`).join('');
    box.querySelectorAll('input,select').forEach(el=>{const previous=saved.get(el.dataset.assignmentKey);if(el.type==='checkbox'){el.checked=previous===true;const slots=el.closest('fieldset').querySelector('.card-assignment-slots');slots.hidden=!el.checked;el.onchange=()=>{slots.hidden=!el.checked;};}else if([...el.options].some(option=>option.value===previous))el.value=previous;});
   };
   if(specialization)form.querySelector('#effectSkill').onchange=assignments;assignments();
  }
  else if(a.effect==='industrialization'){
   const companies=[...root.WCA_COMPANIES,...root.WCA_EXTRA_COMPANIES].filter(d=>d.class==='Capitalist'&&['Food','Luxury'].includes(d.industry)&&s.records.companies[d.id]?.status==='market');
   fields.innerHTML=`<label>設立する企業<select id="effectBuildCompany">${companies.map(d=>`<option value="${d.id}">${esc(d.name_jp)}（資本家${Math.ceil(d.cost/2)}V・国家${Math.floor(d.cost/2)}V）</option>`).join('')}</select></label><div id="effectBuildDetails"></div>`;
   const buildDetails=()=>{
    const d=companies.find(d=>d.id===form.querySelector('#effectBuildCompany').value),box=form.querySelector('#effectBuildDetails');
    if(!d){box.innerHTML='<p class="muted">企業市場に食料・贅沢品の企業がありません。</p>';return;}
    const min=({A:3,B:2,C:1})[s.positions[2]],hasWages=Object.keys(d.wages||{}).length>0;
    box.innerHTML=`<p>設立費用${d.cost}V：資本家${Math.ceil(d.cost/2)}V、国家${Math.floor(d.cost/2)}V。${d.workers.length?'労働者を配置せず、停止中で設立することもできます。':'自動化企業なので労働者・賃金は不要です。'}</p>${hasWages?`<label>賃金<select id="effectBuildWage">${Object.entries(d.wages).filter(([level])=>Number(level.slice(1))>=min).map(([level,amount])=>`<option value="${level}">${level}（${amount}V）</option>`).join('')}</select></label>`:''}${d.workers.length?`<label><input id="effectBuildStaff" type="checkbox">失業労働者を全スロットへ配置して設立する</label><div id="effectBuildWorkers" hidden>${d.workers.map((req,index)=>`<label>${index+1}枠：${req.type==='Skilled'?skills[req.color]+'が必要':'未熟練失業者を優先'}<select data-build-worker="${index}">${Object.entries(skills).filter(([skill])=>(req.type!=='Skilled'||req.color===skill)&&s.records.common.unemployed.Working[skill]>0).map(([skill,label])=>`<option value="${skill}">${label}（失業${s.records.common.unemployed.Working[skill]}人）</option>`).join('')}</select></label>`).join('')}</div>`:''}`;
    if(d.workers.length)form.querySelector('#effectBuildStaff').onchange=()=>{form.querySelector('#effectBuildWorkers').hidden=!form.querySelector('#effectBuildStaff').checked;};
   };
   form.querySelector('#effectBuildCompany').onchange=buildDetails;buildDetails();
  }
  else if(['unemploymentIncome','employmentIncome'].includes(a.effect)){
   fields.innerHTML='<label><input id="effectPurchase" type="checkbox">給付後に商品・サービスを購入する</label><div id="effectPurchaseFields" hidden><label>資源<select id="effectPurchaseResource"><option value="health">医療</option><option value="education">教育</option><option value="food">食料</option><option value="luxury">ぜいたく品</option></select></label><div id="effectPurchaseSources"></div></div>';
   if(a.effect==='unemploymentIncome')form.querySelectorAll('#effectPurchaseResource option[value="food"],#effectPurchaseResource option[value="luxury"]').forEach(o=>o.remove());
   const sources=()=>{const key=form.querySelector('#effectPurchaseResource').value,ids=a.effect==='unemploymentIncome'?(['health','education'].includes(key)?['State']:[]):['Capitalist',...(['health','education'].includes(key)?['State']:['Foreign'])];form.querySelector('#effectPurchaseSources').innerHTML=ids.map(id=>`<label>${{State:'国家',Capitalist:'資本家',Foreign:'海外市場'}[id]}から買う数量<input data-effect-source="${id}" type="number" min="0" max="${w.population}" value="0"></label>`).join('')||'<p class="muted">国家から購入できるのは医療・教育です。</p>';};
   form.querySelector('#effectPurchase').onchange=()=>{form.querySelector('#effectPurchaseFields').hidden=!form.querySelector('#effectPurchase').checked;};form.querySelector('#effectPurchaseResource').onchange=sources;sources();
  }
  const plan=()=>{
   const result={};if(form.querySelector('#effectQty'))result.qty=Number(form.querySelector('#effectQty').value);
   if(form.querySelector('#effectIndustry'))result.industry=form.querySelector('#effectIndustry').value;
   if(form.querySelector('[data-effect-worker]'))result.workers=[...form.querySelectorAll('[data-effect-worker]')].map(x=>x.value).filter(Boolean);
   if(form.querySelector('#effectCompany'))result.companyId=form.querySelector('#effectCompany').value;
   if(form.querySelector('#effectSkill'))result.skill=form.querySelector('#effectSkill').value;
   if(form.querySelector('#effectAssignments')){
    result.allocations=[...form.querySelectorAll('[data-assign-company]:checked')].map(el=>({companyId:el.dataset.assignCompany,slots:[...form.querySelectorAll('[data-assign-slot]')].filter(slot=>slot.dataset.assignSlot===el.dataset.assignCompany&&slot.value!=='keep').map(slot=>({index:Number(slot.dataset.index),worker:slot.value}))})).filter(allocation=>allocation.slots.length);
    result.unions=[...form.querySelectorAll('[data-assign-union]:checked')].map(el=>({industry:el.dataset.assignUnion,worker:[...form.querySelectorAll('[data-union-worker]')].find(worker=>worker.dataset.unionWorker===el.dataset.assignUnion).value}));
   }
   if(form.querySelector('#effectBuildCompany')){result.companyId=form.querySelector('#effectBuildCompany').value;result.wage=form.querySelector('#effectBuildWage')?.value||'unknown';result.workers=form.querySelector('#effectBuildStaff')?.checked?[...form.querySelectorAll('[data-build-worker]')].map(el=>el.value):[];}
   if(form.querySelector('#effectPurchase')?.checked)result.purchase={resource:form.querySelector('#effectPurchaseResource').value,purchases:[...form.querySelectorAll('[data-effect-source]')].map(x=>({source:x.dataset.effectSource,qty:Number(x.value)})).filter(x=>x.qty!==0)};
   return result;
  };
  const preview=()=>{const box=form.querySelector('#cardEffectPreview'),button=form.querySelector('#playCardEffect');try{
   const after=P.applyEffect(JSON.parse(JSON.stringify(s)),owner,c,plan()),changes=[];
   for(const id of ['Working','Capitalist','State'])for(const [key,label] of Object.entries({cash:'資金',revenue:'収入',capital:'資本',vp:'VP',influence:'影響力',loans:'貸付金',food:'食料',health:'医療',education:'教育',luxury:'贅沢品'})){const b=s.records.personal[id].values[key],n=after.records.personal[id].values[key];if(b!==n&&Number.isSafeInteger(b)&&Number.isSafeInteger(n))changes.push(`${labels[id]||'国家'}の${label} ${b} → ${n}`);}
   for(const [id,key] of Object.entries({Working:'workingVotesOutside',Capitalist:'capitalistVotesOutside'})){const b=s.records.common.values[key],n=after.records.common.values[key];if(b!==n)changes.push(`${labels[id]}の投票駒を袋へ${b-n}個追加`);}
   for(const [id,n] of Object.entries(after.records.companies)){const b=s.records.companies[id],name=P.companyDefinition(after.records,id).name_jp;if(b.status!==n.status)changes.push(`${name}：${n.status==='built'?'設立':'売却'}`);if(['specialization','signingBonus','industrialization'].includes(a.effect)&&JSON.stringify(b.slots)!==JSON.stringify(n.slots))changes.push(`${name}：${n.operating==='yes'?'操業・':'停止・'}${n.slots.map((slot,index)=>slot.owner==='empty'?`${index+1}枠は空き`:`${index+1}枠は${skills[slot.skill]}${slot.committed?'（誓約中）':''}`).join('、')}`);}
   if(['specialization','signingBonus','industrialization'].includes(a.effect))for(const [skill,n] of Object.entries(after.records.common.unemployed.Working)){const b=s.records.common.unemployed.Working[skill];if(b!==n)changes.push(`失業${skills[skill]}労働者 ${b} → ${n}`);}
   for(const [industry,n] of Object.entries(after.records.personal.Working.unions)){const b=s.records.personal.Working.unions[industry];if(b!==n)changes.push(`${industries[industry]}の労働組合：${n?'設立':'解散'}`);}
   const beforeWorkers=s.records.personal.Working.values.workerCount,afterWorkers=after.records.personal.Working.values.workerCount;if(beforeWorkers!==afterWorkers)changes.push(`労働者総数 ${beforeWorkers} → ${afterWorkers}`);
   box.textContent=changes.join(' ／ ')||'選択した効果を盤面へ反映します。';button.disabled=false;
  }catch(error){box.textContent=error.message;button.disabled=true;}};
  form.addEventListener('input',preview);form.addEventListener('change',preview);
  form.onsubmit=e=>{e.preventDefault();commit({type:'playerCardEffect',cardUid:selected,plan:plan(),source:'ユーザー提供 hegemony_action_cards_full_v6_bonus_fixed.json'});};preview();
 };
 panel.querySelectorAll('[name="playerCard"]').forEach(input=>input.onchange=()=>{selected=input.value;show();});show();
 if(active){
  const intro=flow.querySelector('h2 + .setup-summary')||flow.querySelector(':scope > .setup-summary');
  if(intro)intro.textContent='カード効果と基本アクションは、どちらか1つをメインアクションとして実行します。';
  const basicIds=owner==='Working'?['workingAssign','workingBuy','workingPropose','workingStrike','workingDem','workingPressure']:['capBuild','capPressure','capLobby','capPropose','capPurchase','capSell','capExport'];
  if(used)basicIds.forEach(id=>{const button=flow.querySelector('#'+id);if(button)button.disabled=true;});
  const end=flow.querySelector('#playerEnd');if(end)end.disabled=!used;
  if(owner==='Capitalist'){
   const source=flow.querySelector('#capPurchaseSource');if(source){source.querySelector('[value="Foreign"]')?.remove();source.value='BusinessDeal';source.dispatchEvent(new Event('change'));}
   const policy=flow.querySelector('#capPolicy'),target=flow.querySelector('#capPolicyTarget');
   if(policy&&target){const trim=()=>{const from=s.positions[policy.value];[...target.options].filter(o=>Math.abs(o.value.charCodeAt(0)-from.charCodeAt(0))!==1).forEach(o=>o.remove());};policy.addEventListener('change',trim);trim();const note=target.closest('details').querySelector('.muted');if(note)note.textContent='基本アクションでは、現在位置に隣接する区画へ提議します。';}
   const exportButton=flow.querySelector('#capExport');if(exportButton){const container=exportButton.closest('details'),offers=s.records.trade.exportCard.offers;container.innerHTML=`<summary>海外市場へ売却</summary><p>輸出カードの取引を任意の数選びます。各取引は1回までです。</p>${offers.map((o,i)=>`<label><input type="checkbox" data-player-export="${i}" ${used?'disabled':''}>${resources[o.resource]}${o.quantity}個 → ${o.revenue}V</label>`).join('')}<button id="capExport" ${used?'disabled':''}>選んだ取引を実行</button>`;container.querySelector('button').onclick=()=>commit({type:'playerExport',transactions:[...container.querySelectorAll('[data-player-export]:checked')].map(x=>Number(x.dataset.playerExport)),cardUid:selection(s)});}
  }
 }
}
root.PlayerCardsUi={render,selection,reset(){selected=null;}};
})(globalThis);
