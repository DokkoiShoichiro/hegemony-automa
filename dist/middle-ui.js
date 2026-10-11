(function(root){
'use strict';
const S=root.GameSymbols,M=root.MiddleClass,R=root.WCARecords,$=id=>document.getElementById(id),esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const labels={food:'食料',health:'医療',education:'教育',luxury:'ぜいたく品',influence:'影響力'},skill={Gray:'未熟練',Green:'食料',Blue:'ぜいたく品',White:'医療',Orange:'教育',Purple:'メディア'},classes={Working:'労働者',Middle:'中産階級',Capitalist:'資本家',State:'国家',Foreign:'海外市場'};
const defs=()=>Object.fromEntries([...root.WCA_COMPANIES,...root.WCA_EXTRA_COMPANIES].map(d=>[d.id,d]));
const options=items=>items.map(([id,label])=>`<option value="${esc(id)}">${esc(label)}</option>`).join('');
const select=(id,label,items)=>`<label>${label}<select id="${id}">${options(items)}</select></label>`;
const number=(id,label,value=0)=>`<label>${label}<input id="${id}" type="number" min="0" step="1" value="${value}"></label>`;
const skilled=()=>Object.entries(skill).filter(([id])=>id!=='Gray');
const n=id=>Number($(id).value);
function decorate(s){if(!M.isThree(s.records))return;if(s.phase==='player'){document.querySelector('header h1').textContent='中産階級プレイヤーの手番';document.querySelector('header .badge').textContent='PLAYER';}if(s.phase==='end'&&$('next'))$('next').textContent='終了処理を反映して中産階級プレイヤーへ';const step=document.querySelector('#steps [aria-current="step"]');if(s.phase==='player'&&step)step.textContent='中産階級';}
function render(s,flow,act){if(!M.isThree(s.records))return false;const r=s.records,m=r.personal.Middle.values,d=defs(),own=Object.entries(r.companies).filter(([id,c])=>d[id].class==='Middle'&&c.status==='built');
 if(s.phase==='player'){
  const locked=!!s.middleBasicUsed,disabled=locked?'disabled':'';
  flow.innerHTML=`<h2>中産階級プレイヤーの手番</h2><p>資金 ${m.cash}${S.icon('vardis')}／人口 ${m.population}（労働者${m.workerCount}人）／繁栄度 ${m.prosperity}（${m.prosperityStep}/10段階）／${S.icon('vp',m.vp)}</p><div class="production-summary resource-stock-summary"><article><span>販売用倉庫</span><strong>${Object.keys(labels).filter(k=>k!=='influence').map(k=>`<span class="resource-quantity">${S.icon(k)} ${m[k]}</span>`).join('')}</strong></article><article><span>購入済み商品・サービス</span><strong>${Object.keys(labels).filter(k=>k!=='influence').map(k=>`<span class="resource-quantity">${S.icon(k)} ${m['consumed'+k[0].toUpperCase()+k.slice(1)]}</span>`).join('')}</strong></article></div><p class="notice">${locked?'メインアクションは実行済みです。フリーアクションを行い、手番を終了できます。':'手札から1枚を選び、カード効果または基本アクションを1つ実行してください。基本用のカードは効果未対応です。'}</p>
  <fieldset class="basic-actions" ${disabled}><legend>基本アクション</legend>
  <details><summary>労働者を割り当て（最大3人）</summary><p class="muted">必要な全スロットを同時に埋めます。在職者の移動では、移動元に誓約中の労働者を残せません。</p><div id="middleMoves"></div><button id="middleAssign">割り当てる</button></details>
  <details><summary>企業を設立</summary><div id="middleBuildFields"></div><button id="middleBuild">選んだ企業を設立</button></details>
  <details><summary>商品・サービスを購入</summary><div id="middleBuyFields"></div><button id="middleBuy">購入する</button></details>
  <details><summary>法案を提議</summary><div id="middlePolicyFields"></div></details>
  <details><summary>企業を売却</summary><div id="middleSaleCards"></div><button id="middleSell" disabled>選んだ企業を売却</button></details>
  <details><summary>追加シフト</summary>${select('middleCompany','企業',own.map(([id])=>[id,d[id].name_jp]))}<button id="middleShift">追加シフト</button></details>
  <details><summary>海外市場へ販売</summary><div id="middleExportFields"></div><button id="middleExport">選んだ取引を実行</button></details><details><summary>政治的圧力</summary><p>自分の投票駒を最大3個、サプライから袋へ入れます。</p><button id="middlePressure">投票駒3個を袋へ</button></details></fieldset>
  <details id="middleFreeSection" class="free-actions" open><summary>フリーアクション</summary><p class="free-action-status"></p>
  <details><summary>資源の使用</summary><fieldset data-free-action="USE"><div id="middleUseFields"></div></fieldset></details>
  <details><summary>販売価格の変更</summary><fieldset data-free-action="PRICE">${R.freePricesMarkup(r,'Middle')}<button id="middlePrice" data-free-submit="PRICE">選んだ価格をまとめて変更</button></fieldset></details>
  <details><summary>賃金の変更</summary><fieldset data-free-action="WAGE"><p class="muted">賃金を上げると労働者階級の従業員が誓約中になります。労働者階級の誓約中の従業員がいる企業の賃金は下げられません。</p>${R.freeWagesMarkup(r,'Middle',s.positions)}<button id="middleWage" data-free-submit="WAGE">選んだ賃金をまとめて変更</button></fieldset></details>
  <details><summary>労働者の入れ替え</summary><fieldset data-free-action="SWAP"><div id="middleSwapFields"></div><button id="middleSwap">入れ替える</button></fieldset></details>
  <details><summary>貸付金の返済</summary><fieldset data-free-action="LOAN"><div id="middleLoanFields"></div><button id="middleLoan">貸付金1枚を返済</button></fieldset></details></details>
  <p class="source">基本ルール v1.2 印刷p.22–25：中産階級の基本・フリーアクション。販売用倉庫と購入済み商品・サービスは別管理です。</p><button id="playerEnd" ${locked?'':'disabled'}>中産階級の手番を終了</button>`;
  const basic=plan=>act({type:'middleBasic',plan}),free=plan=>act({type:'middleFree',plan});
  root.WorkerAssignmentUi.mount(s,'Middle',$('middleMoves'),$('middleAssign'),basic);
  root.PlayerActionUi.build(s,'Middle',$('middleBuildFields'),$('middleBuild'),basic);
  root.PlayerActionUi.purchase(s,'Middle',$('middleBuyFields'),$('middleBuy'),basic);
  root.PlayerActionUi.policy(s,$('middlePolicyFields'),{policy:'middlePolicyId',target:'middlePolicyTarget',immediate:'middleImmediate',button:'middlePropose'},p=>act({type:'middlePolicy',...p}));
  R.mountCompanySale(s,'Middle',$('middleSaleCards'),$('middleSell'),id=>basic({action:'SC',id}));$('middleShift').onclick=()=>basic({action:'SHIFT',id:$('middleCompany').value});root.PlayerActionUi.exports(s,'Middle',$('middleExportFields'),$('middleExport'),transactions=>basic({action:'SFM',transactions}));$('middlePressure').onclick=()=>basic({action:'PRESSURE'});
  root.PlayerActionUi.use(s,'Middle',$('middleUseFields'),p=>free({action:'USE',...p}));
  R.bindFreeBatches(s,'Middle',$('middleFreeSection'),free);
  root.PlayerActionUi.loan(s,'Middle',$('middleLoanFields'),$('middleLoan'),()=>free({action:'LOAN'}));
  root.PlayerActionUi.swap(s,'Middle',$('middleSwapFields'),$('middleSwap'),p=>{const [id,index]=p.worker.split(':');free({action:'SWAP',id,index:Number(index),skill:p.skill});});$('playerEnd').onclick=()=>act({type:'playerEnd'});return true;
 }
 if(s.phase==='production'&&s.production.step==='needs'){const p=R.foodNeedPlan(r,s.positions[6]);flow.innerHTML=`<h2>労働者オートマの食料需要</h2><p>${p.reason}</p><p>資本家 ${p.capitalist}／中産階級 ${p.middle}／国家 ${p.state}／海外 ${p.foreign}、合計支払 ${p.total}</p><button id="productionNeeds">需要を充足</button>`;$('productionNeeds').onclick=()=>act({type:'productionNeeds',plan:p});return true;}
 if(s.phase==='production'&&s.production.step==='middleNeeds'){const p=M.foodPreview(r,s.positions);flow.innerHTML=`<h2>中産階級の食料需要</h2><p>人口 ${p.population}／販売用・購入済みの食料から ${p.own}消費／不足 ${p.shortage}</p><p>資本家の在庫 ${p.capitalistStock}・単価 ${p.capitalistPrice}／海外単価 ${p.foreignPrice}。資金不足時は貸付金で支払います。</p>${number('middleNeedCap','資本家から購入',0)}${number('middleNeedForeign','海外から購入',p.shortage)}<button id="middleNeeds">食料需要を充足</button>`;$('middleNeeds').onclick=()=>act({type:'middleNeeds',plan:{Capitalist:n('middleNeedCap'),Foreign:n('middleNeedForeign')}});return true;}
 if(s.phase==='production'&&s.production.step==='taxes'){const p=R.taxPreview(r,s.positions,s.production.laborPolicy);flow.innerHTML=`<h2>納税</h2><p>労働者 ${p.working}／資本家 ${p.capitalist}</p><p>中産階級：外部企業${p.Middle.external}社の所得税 ${p.Middle.income}＋自社の操業${p.Middle.operating}社の雇用税 ${p.Middle.employment}＝${p.Middle.total}</p><p>資金不足は貸付金で支払います。所得税の政策2は生産開始時点を使います。</p><button id="productionTaxes">納税を反映</button>`;$('productionTaxes').onclick=()=>act({type:'productionTaxes'});return true;}
 if(s.phase==='scoring'){const p=R.scoringPreview(r);flow.innerHTML=`<h2>得点計算</h2><p>中産階級：従業員込みで全枠が埋まった自社企業 ${p.Middle.fully}社／繁栄度 ${p.Middle.prosperityBefore} → ${p.Middle.prosperityAfter}／${S.icon('vp',p.Middle.vp)}</p><p>労働者・資本家の得点も同時に反映します。</p><button id="scoringApply">得点を反映</button>`;$('scoringApply').onclick=()=>act({type:'scoringApply'});return true;}
 if(s.phase==='preparation'){const current=Object.entries(r.companies).filter(([id,c])=>d[id].class==='Middle'&&c.status==='market');flow.innerHTML=`<h2>次のラウンドの準備</h2><p>中産階級：貸付金1枚につき利息5、繁栄度は2段階戻り、未熟練者1人と選んだ熟練者1人を追加します。各階級の移民カードは別々に引きます。</p>${select('middlePrepSkill','中産階級に追加する技能',skilled())}<h3>中産階級の市場</h3><p>保持するカードを選択。残りを捨て、3枚まで補充します。</p>${current.map(([id])=>`<label><input data-middle-keep="${id}" type="checkbox" checked>${esc(d[id].name_jp)}</label>`).join('')}<p>資本家の市場4枚・輸出入カード・プレイヤー手札5枚も補充します。両オートマの優先順位を復帰します。</p><label><input id="prepConfirmed" type="checkbox">準備内容を確認した</label><button id="preparationApply">準備を反映してラウンド${s.round+1}へ</button>`;$('preparationApply').onclick=()=>{const keep=[...flow.querySelectorAll('[data-middle-keep]:checked')].map(x=>x.dataset.middleKeep);act({type:'preparationApply',confirmed:$('prepConfirmed').checked,plan:{market:R.randomMarket(r),middleKeep:keep,middleMarket:M.randomMarket(r,3-keep.length),middleSkill:$('middlePrepSkill').value}});};return true;}
 if(s.phase==='gameEnd'){const p=R.gameEndPreview(r,s.positions);flow.innerHTML=`<h2>最終得点</h2><p>中産階級：政策 ${p.Middle.policyVp}／販売用資源 ${p.Middle.stockVp}／資金 ${p.Middle.cashVp}／貸付金の減点 ${p.Middle.loanPenalty}</p><p>${Object.entries(p.scores).map(([id,score])=>`${classes[id]} ${S.icon('vp',score)}`).join('・')}</p><button id="gameEndApply">最終得点を確定</button>`;$('gameEndApply').onclick=()=>act({type:'gameEndApply'});return true;}
 return false;
}
root.MiddleClassUi={render,decorate};
})(globalThis);
