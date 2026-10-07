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
   if(form.querySelector('#effectPurchase')?.checked)result.purchase={resource:form.querySelector('#effectPurchaseResource').value,purchases:[...form.querySelectorAll('[data-effect-source]')].map(x=>({source:x.dataset.effectSource,qty:Number(x.value)})).filter(x=>x.qty!==0)};
   return result;
  };
  const preview=()=>{const box=form.querySelector('#cardEffectPreview'),button=form.querySelector('#playCardEffect');try{
   const after=P.applyEffect(JSON.parse(JSON.stringify(s)),owner,c,plan()),changes=[];
   for(const id of ['Working','Capitalist','State'])for(const [key,label] of Object.entries({cash:'資金',revenue:'収入',capital:'資本',vp:'VP',influence:'影響力',loans:'貸付金',food:'食料',health:'医療',education:'教育',luxury:'贅沢品'})){const b=s.records.personal[id].values[key],n=after.records.personal[id].values[key];if(b!==n&&Number.isSafeInteger(b)&&Number.isSafeInteger(n))changes.push(`${labels[id]||'国家'}の${label} ${b} → ${n}`);}
   for(const [id,key] of Object.entries({Working:'workingVotesOutside',Capitalist:'capitalistVotesOutside'})){const b=s.records.common.values[key],n=after.records.common.values[key];if(b!==n)changes.push(`${labels[id]}の投票駒を袋へ${b-n}個追加`);}
   for(const [id,n] of Object.entries(after.records.companies)){const b=s.records.companies[id];if(b.status!==n.status)changes.push(`${[...root.WCA_COMPANIES,...root.WCA_EXTRA_COMPANIES].find(d=>d.id===id).name_jp}：${n.status==='built'?'設立':'売却'}`);}
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
