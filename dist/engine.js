(function(root){
'use strict';
const ACTIONS=['AW','BGS','STR','DEM','SA','PB'];
const CHECKS=['AW','PB','BGS','STR'];
const copy=x=>JSON.parse(JSON.stringify(x));
const deckNumbers=()=>Array.from({length:30},(_,i)=>String(i+1));
function randomDeck(random=Math.random){const deck=deckNumbers();for(let i=deck.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[deck[i],deck[j]]=[deck[j],deck[i]];}return deck;}
function validDeck(deck){return Array.isArray(deck)&&deck.every(x=>/^([1-9]|[12]\d|30)$/.test(String(x)))&&new Set(deck.map(String)).size===deck.length;}
function drawAutomaCard(s,providedDeck){if(!validDeck(s.aiDeck)){s.aiDeck=validDeck(providedDeck)?providedDeck.map(String):deckNumbers();s.aiDiscard=[];}requireThat(s.aiDeck.length,'AIカードの山札が空です');const number=String(s.aiDeck.shift()),c=root.WCAJudge?.CARD_DATA?.[number];requireThat(c,'AIカードの登録データがありません');s.aiDiscard??=[];s.aiDiscard.push(number);s.card={number,order:[...c.order],policies:c.policies.map(String),bonus:c.bonus};s.phase='checks';s.index=0;return number;}
// Each row array is stored from nearest to farthest from its marker. The UI
// reverses Action rows because Action cards sit on the marker's left side.
const initial=()=>({version:1,round:1,turn:1,phase:'start',index:0,actions:{0:['SA','STR','DEM'],1:['AW','BGS','PB']},policies:{0:['2','4','6'],1:['1','5']},aside:{actions:{},policies:{3:'initial',7:'initial'}},positions:{1:'B',2:'B',3:'A',4:'B',5:'B',6:'B',7:'B'},proposals:{},card:null,facts:'',log:[]});
function rows(s,k){return Object.keys(s[k]).map(Number).filter(r=>s[k][r].length).sort((a,b)=>b-a);}
function rank(s,k){return rows(s,k).flatMap(r=>s[k][r]);}
function locate(s,k,id){return rows(s,k).find(r=>s[k][r].includes(id));}
function remove(s,k,id){const r=locate(s,k,id);if(r!==undefined)s[k][r]=s[k][r].filter(x=>x!==id);}
function place(s,k,id,r){remove(s,k,id);delete s.aside[k][id];(s[k][r]??=[]).push(id);}
function move(s,k,id,n){const r=locate(s,k,id);if(r===undefined)return false;place(s,k,id,r+n);return true;}
function compress(s,k){s[k]=Object.fromEntries(rows(s,k).reverse().map((r,i)=>[i,s[k][r]]));}
function aside(s,k,id,reason){remove(s,k,id);s.aside[k][id]=reason;}
function requireThat(ok,msg){if(!ok)throw Error(msg);}
const VOTE_CLASSES=['Working','Middle','Capitalist','State'],CUBE_KEYS={Working:'workingVotesOutside',Middle:'middleVotesOutside',Capitalist:'capitalistVotesOutside'},DESIRED={Working:{1:'A',2:'A',3:'A',4:'A',5:'A',6:'C',7:'B'},Middle:{1:'B',2:'B',3:'B',4:'B',5:'B',6:'B',7:'B'},Capitalist:{1:'C',2:'C',3:'C',4:'C',5:'C',6:'C',7:'C'}};
function voters(s){return VOTE_CLASSES.filter(id=>s.records?.participants?.[id]!=='absent');}
function automaStance(s,p,id){if(p.proposer===id)return 'favor';const desired=DESIRED[id]?.[p.id];if(!desired)return null;const distance=x=>Math.abs(x.charCodeAt(0)-desired.charCodeAt(0));return distance(p.target)<distance(p.from)?'favor':'against';}
function refillPlan(s){const r=s.records,working=Math.ceil(Number(r.personal.Working.values.population||0)/2),operating=id=>Object.entries(r.companies).filter(([companyId,c])=>{const d=[...(root.WCA_COMPANIES||[]),...(root.WCA_EXTRA_COMPANIES||[])].find(x=>x.id===companyId);return d?.class===id&&c.status==='built'&&c.operating==='yes';}).length,capitalist=Math.ceil(operating('Capitalist')/2);let middle=5;if(r.participants.Middle!=='absent'){const population=Number(r.personal.Middle?.values?.population||0);middle=Math.max(Math.ceil(population/2),Math.ceil(operating('Middle')/2));}return {Working:Math.min(working,Number(r.common.values.workingVotesOutside||0)),Capitalist:Math.min(capitalist,Number(r.common.values.capitalistVotesOutside||0)),Middle:Math.min(middle,Number(r.common.values.middleVotesOutside||0))};}
function bagCount(s){return ['Working','Middle','Capitalist'].reduce((n,id)=>n+25-Number(s.records.common.values[CUBE_KEYS[id]]||0),0);}
function drawCubes(s,count,random=Math.random,classes=['Working','Middle','Capitalist']){const pool=[];for(const id of classes){const inside=25-Number(s.records.common.values[CUBE_KEYS[id]]||0);for(let i=0;i<inside;i++)pool.push(id);}requireThat(Number.isSafeInteger(count)&&count>=0&&pool.length>=count,`袋から${count}個引けません`);const drawn={Working:0,Middle:0,Capitalist:0};for(let n=0;n<count;n++){const at=Math.min(pool.length-1,Math.floor(Math.max(0,Math.min(.999999,Number(random()))) * pool.length)),id=pool.splice(at,1)[0];drawn[id]++;}return drawn;}
function drawOtherCubes(s,count,random=Math.random){return drawCubes(s,count,random,['Middle','Capitalist']);}
function emergencyRefillPlan(s){const temp=copy(s),passes=[];for(let i=0;i<2;i++){const plan=refillPlan(temp);passes.push(plan);for(const id of ['Working','Middle','Capitalist'])temp.records.common.values[CUBE_KEYS[id]]-=plan[id];}return {passes,totals:Object.fromEntries(['Working','Middle','Capitalist'].map(id=>[id,passes.reduce((n,p)=>n+p[id],0)])),bagAfter:bagCount(temp)};}
function beginElection(s,queue,mode,returnPhase){delete s.lastElection;delete s.lastElections;s.phase='election';s.election={mode,step:mode==='phase'?'refill':'declare',queue:copy(queue),current:0,returnPhase,results:[]};}
function currentElection(s){return s.election.queue[s.election.current];}
function voteTotals(s,sides,cubes,spends={}){let favor=0,against=0;for(const id of voters(s)){const votes=Number(cubes[id]||0)+Number(spends[id]||0);if(sides[id]==='favor')favor+=votes;else against+=votes;}return {favor,against};}
function influencePlan(s,id,sides,cubes){const values=s.records.personal[id]?.values||{},available=Number(values.influence||0);if(!available)return {type:'none',spend:0,cards:0,reason:'影響力なし'};if(s.round===5&&s.election.mode==='phase'&&s.election.current===s.election.queue.length-1)return {type:'all',spend:available,cards:0,reason:'最終ラウンドの最後の投票'};const base=voteTotals(s,sides,cubes),side=sides[id],winning=side==='favor'?base.favor>=base.against:base.against>base.favor,needed=(which)=>which==='favor'?Math.max(0,base.against-base.favor):Math.max(0,base.favor-base.against+1),otherSide=side==='favor'?'against':'favor',others=voters(s).filter(x=>sides[x]===otherSide).reduce((n,x)=>n+Number(s.records.personal[x]?.values?.influence||0),0),ownSide=voters(s).filter(x=>sides[x]===side).reduce((n,x)=>n+Number(s.records.personal[x]?.values?.influence||0),0);
 if(winning){const otherNeed=needed(otherSide);if(others<otherNeed)return {type:'none',spend:0,cards:0,reason:'勝っており、相手陣営の影響力だけでは逆転不能'};if(others===otherNeed)return {type:'draw',spend:0,cards:1,reason:'相手陣営が逆転にちょうど必要な影響力を所持'};return {type:'draw',spend:0,cards:Math.min(available,others-otherNeed),reason:'勝っており、相手陣営に逆転余力あり'};}
 const need=needed(side);if(ownSide<need)return {type:'none',spend:0,cards:0,reason:'自陣営の影響力を全て使っても逆転不能'};if(!others)return {type:'necessary',spend:Math.min(available,need),cards:0,reason:'相手陣営に影響力がないため必要数を使用'};if(ownSide===need)return {type:'drawAll',spend:0,cards:1,reason:'自陣営が逆転にちょうど必要な影響力を所持'};const spend=Math.min(available,need),cards=Math.min(Math.max(0,available-spend),others);return cards?{type:'necessaryDraw',spend,cards,reason:'必要数を使用後、相手陣営の影響力数だけカードを引く'}:{type:'necessary',spend,cards:0,reason:'必要数を使用し、残りの影響力なし'};
}
function validate(s){
 requireThat(s?.version===1,'保存形式に対応していません');
 if(s.records!==undefined){requireThat(root.WCARecords,'盤面記録モジュールが必要です');root.WCARecords.validate(s.records);}
 requireThat(Number.isInteger(s.round)&&s.round>=1&&s.round<=5,'ラウンドが不正です');
 requireThat(['start','card','checks','action','end','player','production','election','scoring','preparation','roundEnd','gameEnd','finished'].includes(s.phase),'手番状態が不正です');
 if(s.phase==='production')requireThat(s.production&&['produce','needs','imf','taxes'].includes(s.production.step)&&['A','B','C'].includes(s.production.laborPolicy),'生産フェイズの状態が不正です');
 if(s.phase==='election')requireThat(s.election&&['refill','declare','influence'].includes(s.election.step)&&Array.isArray(s.election.queue)&&s.election.queue.length,'投票フェイズの状態が不正です');
 for(const [k,all] of [['actions',ACTIONS],['policies',['1','2','3','4','5','6','7']]]){
  requireThat(s[k]&&s.aside?.[k],'優先順位がありません');
  requireThat(Object.entries(s[k]).every(([r,v])=>Number.isSafeInteger(Number(r))&&Array.isArray(v)),'段データが不正です');
  const ids=[...rank(s,k),...Object.keys(s.aside[k])];
  requireThat(ids.length===all.length&&new Set(ids).size===all.length&&all.every(x=>ids.includes(x)),'カードに重複・欠落があります');
 }
 requireThat(typeof s.facts==='string'&&Array.isArray(s.log),'記録が不正です');
 if(s.aiDeck!==undefined){requireThat(validDeck(s.aiDeck)&&validDeck(s.aiDiscard||[])&&!s.aiDeck.some(x=>(s.aiDiscard||[]).includes(String(x))),'AIカードの山札が不正です');}
 requireThat(s.positions&&Object.values(s.positions).every(x=>['A','B','C'].includes(x)),'政策位置が不正です');
 if(s.proposals!==undefined){requireThat(s.proposals&&typeof s.proposals==='object'&&!Array.isArray(s.proposals),'法案記録が不正です');for(const [id,p] of Object.entries(s.proposals)){requireThat(/^[1-7]$/.test(id)&&p&&['Working','Capitalist','other'].includes(p.proposer)&&['A','B','C'].includes(p.from)&&['A','B','C'].includes(p.target),'法案記録が不正です');}}
 requireThat(Number.isInteger(s.index)&&s.index>=0&&s.index<=4,'チェック位置が不正です');
 if(['checks','action','end'].includes(s.phase))requireThat(s.card&&s.card.order?.length===4&&new Set(s.card.order).size===4&&s.card.order.every(x=>CHECKS.includes(x)),'AIカードが不正です');
 return s;
}
function reduce(state,e){let s=copy(state);s.proposals??={};let note=e.note||'';
 switch(e.type){
 case 'setup':{
  requireThat(e.confirmed===true,'初期状態への置き換えを確認してください');
  const prepared=root.WCARecords.createSetup(e.players,e.immigrant,e.market||[]);
  s={...initial(),records:prepared,positions:{1:'C',2:'B',3:'A',4:'B',5:'C',6:'B',7:'B'},aiDeck:validDeck(e.deck)?e.deck.map(String):deckNumbers(),aiDiscard:[]};
  note='2人ゲームの初期状態を適用（準備フェイズ前の追加労働者は加算しない）';break;
 }
 case 'record':
  requireThat(root.WCARecords,'盤面記録モジュールが必要です');
  {const hadDemo=!!s.records?.common?.tokens?.demonstration;s.records=root.WCARecords.update(s.records,e);if(hadDemo&&e.section==='establish'&&e.value?.slots?.some(x=>x.owner==='Working')&&!root.WCARecords.demonstrationStatus(s.records).eligible){s.records.common.tokens.demonstration=false;if(s.aside.actions.DEM==='demonstration')place(s,'actions','DEM',0);note+='（条件解消によりデモトークンを除去）';}}break;
 case 'facts':s.facts=e.value;break;
 case 'start':requireThat(s.phase==='start','手番開始ではありません');if(s.records)s.records=root.WCARecords.applyStart(s.records);if(s.records&&root.WCAJudge?.CARD_DATA){const number=drawAutomaCard(s,e.deck);note=`開始時処理後、AIカード#${number}を自動ドロー`;}else s.phase='card';break;
 case 'drawCard':{requireThat(s.phase==='card'&&s.records,'AIカードを引く段階ではありません');const number=drawAutomaCard(s,e.deck);note=`AIカード#${number}を自動ドロー`;break;}
 case 'card':
  requireThat(s.phase==='card'||s.phase==='checks'&&s.index===0,'カード入力ではありません');
  requireThat(e.order.length===4&&new Set(e.order).size===4&&e.order.every(x=>CHECKS.includes(x)),'4種類を一度ずつ指定してください');
  requireThat(e.policies.length===2&&new Set(e.policies).size===2&&e.policies.every(x=>/^[1-7]$/.test(x)),'異なる政策2つを指定してください');
  requireThat(!e.number||(/^\d+$/.test(e.number)&&+e.number>=1&&+e.number<=30),'カード番号は1〜30です');
  s.card={number:e.number,order:e.order,policies:e.policies,bonus:e.bonus};s.phase='checks';s.index=0;break;
 case 'check':
  requireThat(s.phase==='checks','チェック中ではありません');
  requireThat(note.trim(),'判定の根拠を入力してください');
  requireThat(e.confirmed===true,'現物での確認が必要です');
  for(const m of e.movements){requireThat(['actions','policies'].includes(m.series)&&Number.isInteger(m.up)&&m.up>=1&&m.up<=100,'移動段数は1〜100です');requireThat((m.series==='actions'?ACTIONS:['1','2','3','4','5','6','7']).includes(m.card),'カードが不正です');m.applied=move(s,m.series,m.card,m.up);}
  s.index++;if(s.index===4){compress(s,'actions');compress(s,'policies');s.phase='action';}break;
 case 'action':{
  requireThat(s.phase==='action','行動選択ではありません');
  const top=rank(s,'actions').slice(0,2);
  requireThat(['yes','no'].includes(e.first),'最優先行動の可否を確認してください');
  if(e.first==='no')requireThat(['yes','no'].includes(e.second),'次点行動の可否を確認してください');
 const selected=e.first==='yes'?top[0]:e.second==='yes'?top[1]:'PRESSURE';
  const immediate=[];
  requireThat(selected,'実行できるカードがありません');
  if(selected==='PB')requireThat(e.policyReviewed===true,'政策の提議可否・最終ラウンド制限を確認してください');
  if(s.records){requireThat(root.WCARecords&&e.plan?.action===selected,'盤面へ反映する実行計画が不正です');s.records=root.WCARecords.applyAction(s.records,e.plan);}
  if(selected==='PB'&&e.plan)for(const p of e.plan.proposals||[]){
   if(!p.immediate){aside(s,'policies',p.id,'bill:Working');s.proposals[p.id]={proposer:'Working',from:p.from,target:p.target,round:s.round,turn:s.turn};continue;}
   immediate.push({id:p.id,proposer:'Working',from:p.from,target:p.target,immediate:true});
  }
  if(selected==='DEM')aside(s,'actions','DEM','demonstration');
  else if(selected==='STR'&&Object.values(s.records?.companies||{}).filter(c=>c.status==='built'&&c.strike).length>=7)aside(s,'actions','STR','strikeTokens');
  else if(selected!=='PRESSURE'){
   const destination=Math.max(0,locate(s,'actions',selected)-2);
   place(s,'actions',selected,destination);
  }
  if(e.first==='no'&&selected!=='PRESSURE')compress(s,'actions');
  if(immediate.length)beginElection(s,immediate,'immediate','end');else s.phase='end';note=`${selected} 実行。${note}`;break;}
 case 'freeAction':requireThat(s.phase==='end'&&s.records,'終了時の無償行動ではありません');s.records=root.WCARecords.applyFreeAction(s.records,e.resource,e.upgrade);note=`${e.resource}を使用して繁栄度を上昇`;break;
 case 'end':requireThat(s.phase==='end','終了処理ではありません');requireThat(!s.records||!root.WCARecords.nextFreeResource(s.records),'終了時の資源使用を完了してください');s.phase='player';s.card=null;s.index=0;note='労働者オートマの手番を終了';break;
 case 'playerPolicy':{
  requireThat(s.phase==='player'&&s.records,'資本家の手番ではありません');const id=e.id,current=s.positions[id],target=e.position,cap=s.records.personal.Capitalist.values;requireThat(/^[1-7]$/.test(id)&&!s.proposals[id]&&!String(s.aside.policies[id]||'').startsWith('bill:'),'この政策には提議できません');requireThat(['A','B','C'].includes(target)&&target!==current,'現在と異なる提議先を選んでください');
  if(e.immediate){requireThat(cap.influence>0,'即時投票に必要な影響力がありません');cap.influence--;beginElection(s,[{id,proposer:'Capitalist',from:current,target,immediate:true}],'immediate','player');note=`資本家が政策${id}を${target}へ提議し即時投票を開始`;
  }else{requireThat(cap.billMarkers>0,'法案マーカーがありません');cap.billMarkers--;s.proposals[id]={proposer:'Capitalist',from:current,target,round:s.round,turn:s.turn};aside(s,'policies',id,'bill:Capitalist');note=`資本家が政策${id}を${target}へ提議`;}
  break;}
 case 'playerPurchase':{requireThat(s.phase==='player'&&s.records,'資本家の手番ではありません');const result=root.WCARecords.applyCapitalistPurchase(s.records,e.plan,s.positions['6']);s.records=result.records;note=`資本家が${result.food?`食料${result.food}`:''}${result.food&&result.luxury?'・':''}${result.luxury?`ぜいたく品${result.luxury}`:''}を購入（本体${result.base}・関税${result.tariff}・合計${result.total}）`;break;}
 case 'playerBuild':requireThat(s.phase==='player'&&s.records,'資本家の手番ではありません');s.records=root.WCARecords.applyCapitalistBuild(s.records,e.id,e.value,e.common);note=`資本家が${e.id}を設立`;break;
 case 'playerWage':{requireThat(s.phase==='player'&&s.records,'資本家の手番ではありません');const result=root.WCARecords.applyCapitalistWageIncrease(s.records,e.id,e.wage);s.records=result.records;note=`資本家が${e.id}の賃金を${e.wage}へ上げ、労働者${result.committed}人を誓約`;break;}
 case 'playerSell':requireThat(s.phase==='player'&&s.records,'資本家の手番ではありません');s.records=root.WCARecords.applyCapitalistSell(s.records,e.id);note='資本家が企業を売却';break;
 case 'playerExport':requireThat(s.phase==='player'&&s.records,'資本家の手番ではありません');s.records=root.WCARecords.applyCapitalistExport(s.records,e.resource,e.qty,e.revenue);note=`資本家が海外市場へ${e.qty}個を売却し${e.revenue}を獲得`;break;
 case 'playerLobby':requireThat(s.phase==='player'&&s.records,'資本家の手番ではありません');s.records=root.WCARecords.applyCapitalistLobby(s.records);note='資本家がロビー（30支払い・影響力3獲得）';break;
 case 'playerPressure':requireThat(s.phase==='player'&&s.records,'資本家の手番ではありません');s.records.common.values.capitalistVotesOutside=Math.max(0,Number(s.records.common.values.capitalistVotesOutside||0)-3);note='資本家が政治的圧力（投票駒3個を袋へ）';break;
 case 'playerEnd':requireThat(s.phase==='player','資本家の手番ではありません');if(s.turn<5){s.turn++;s.phase='start';note='資本家の手番を終了';}else{s.phase='production';s.production={step:'produce',laborPolicy:s.positions[2]};note='第5手番を終了し、生産フェイズへ';}break;
 case 'productionProduce':{requireThat(s.phase==='production'&&s.production.step==='produce'&&s.records,'生産ステップではありません');let demo='';if(s.aside.actions.DEM==='demonstration'&&s.records.common.tokens?.demonstration){const result=root.WCARecords.resolveDemonstration(s.records);s.records=result.records;place(s,'actions','DEM',0);demo=`、デモ解決${Object.values(result.losses).reduce((a,b)=>a+b,0)}VP減少`;}const result=root.WCARecords.applyProduction(s.records);s.records=result.records;s.production.step='needs';note=`生産・賃金を反映${demo}`;break;}
 case 'productionNeeds':{requireThat(s.phase==='production'&&s.production.step==='needs'&&s.records,'需要充足ステップではありません');const result=root.WCARecords.applyFoodNeeds(s.records,e.plan||{},s.positions[6]);s.records=result.records;s.production.step='imf';note=`労働者の食料需要を充足（支払${result.total}）`;break;}
 case 'productionImf':{requireThat(s.phase==='production'&&s.production.step==='imf'&&s.records,'IMF確認ステップではありません');const result=root.WCARecords.applyImf(s.records,s.positions[1],e.manual===true);s.records=result.records;s.production.step='taxes';note=result.mode==='safe'?'IMF介入なし':result.mode==='repaid'?`国家が貸付金${result.preview.repay}枚を返済`:'IMF介入を手動処理済み';break;}
 case 'productionTaxes':{requireThat(s.phase==='production'&&s.production.step==='taxes'&&s.records,'納税ステップではありません');const result=root.WCARecords.applyTaxes(s.records,s.positions,s.production.laborPolicy);s.records=result.records;const queue=Object.entries(s.proposals).sort(([a],[b])=>Number(a)-Number(b)).map(([id,p])=>({id,...p,immediate:false}));if(queue.length)beginElection(s,queue,'phase','scoring');else s.phase='scoring';note=`納税（労働者${result.preview.working}・資本家${result.preview.capitalist}）${queue.length?'、投票フェイズ開始':'、得点計算へ'}`;break;}
 case 'electionRefill':{requireThat(s.phase==='election'&&s.election.step==='refill','投票バッグ補充ではありません');const plan=refillPlan(s);for(const id of ['Working','Middle','Capitalist'])s.records.common.values[CUBE_KEYS[id]]-=plan[id];s.election.refill=plan;s.election.step='declare';note=`投票バッグを補充（労働者${plan.Working}・中産${plan.Middle}・資本家${plan.Capitalist}）`;break;}
 case 'electionEmergencyRefill':{requireThat(s.phase==='election'&&s.election.step==='declare'&&bagCount(s)<5,'投票キューブの緊急補充は不要です');const extra=emergencyRefillPlan(s);for(const plan of extra.passes)for(const id of ['Working','Middle','Capitalist'])s.records.common.values[CUBE_KEYS[id]]-=plan[id];requireThat(bagCount(s)>=5,'2回補充しても投票キューブが5個に足りません。盤面記録を確認してください');s.election.emergencyRefill=extra;note=`投票バッグ不足のため補充を2回実行（労働者${extra.totals.Working}・中産${extra.totals.Middle}・資本家${extra.totals.Capitalist}）`;break;}
 case 'electionDeclare':{requireThat(s.phase==='election'&&s.election.step==='declare','投票の意思表示ではありません');const proposal=currentElection(s),present=voters(s),sides={};for(const id of present){const mode=s.records.participants[id],expected=mode==='automa'?automaStance(s,proposal,id):null,supplied=e.sides?.[id];if(id===proposal.proposer)sides[id]='favor';else if(mode==='automa'){requireThat(expected&&supplied===expected,`${id}オートマの賛否が不正です`);sides[id]=expected;}else{requireThat(['favor','against'].includes(supplied),`${id}の賛否を選んでください`);sides[id]=supplied;}}const cubes={};let total=0;for(const id of ['Working','Middle','Capitalist']){const n=Number(e.cubes?.[id]||0),inside=25-Number(s.records.common.values[CUBE_KEYS[id]]||0);requireThat(Number.isSafeInteger(n)&&n>=0&&n<=inside,`${id}の投票キューブ数が不正です`);cubes[id]=n;total+=n;}requireThat(total===5,'袋から出た投票キューブは合計5個です');for(const id of ['Working','Middle','Capitalist'])s.records.common.values[CUBE_KEYS[id]]+=cubes[id];s.election.sides=sides;s.election.cubes=cubes;s.election.autoPlans=Object.fromEntries(present.filter(id=>s.records.participants[id]==='automa').map(id=>[id,influencePlan(s,id,sides,cubes)]));s.election.step='influence';note=`政策${proposal.id}の賛否と投票キューブを記録`;break;}
 case 'electionResolve':{requireThat(s.phase==='election'&&s.election.step==='influence','影響力の決定ではありません');const election=s.election,proposal=currentElection(s),present=voters(s),spends={},coinResults={};for(const id of present){const values=s.records.personal[id]?.values,available=Number(values?.influence||0),mode=s.records.participants[id];let amount;if(mode==='automa'){const plan=election.autoPlans[id],successes=Number(e.autoCoinSuccesses?.[id]??e.autoSymbols?.[id]??0);requireThat(Number.isSafeInteger(successes)&&successes>=0&&successes<=plan.cards,'50%影響力判定の成功数が不正です');coinResults[id]={attempts:plan.cards,successes};amount=plan.type==='all'?plan.spend:plan.type==='necessary'?plan.spend:plan.type==='draw'?successes:plan.type==='drawAll'?(successes?available:0):plan.type==='necessaryDraw'?plan.spend+successes:0;}else amount=Number(e.spends?.[id]||0);requireThat(Number.isSafeInteger(amount)&&amount>=0&&amount<=available,`${id}の使用影響力が不正です`);spends[id]=Math.min(available,amount);values.influence=available-spends[id];}
  const totals=voteTotals(s,election.sides,election.cubes,spends),passed=totals.favor>=totals.against,winning=passed?'favor':'against',vp={};if(passed){const proposer=s.records.personal[proposal.proposer]?.values;if(proposer){proposer.vp=Number(proposer.vp||0)+3;vp[proposal.proposer]=3;}for(const id of present)if(id!==proposal.proposer&&election.sides[id]==='favor'&&(Number(election.cubes[id]||0)>0||spends[id]>0)){s.records.personal[id].values.vp=Number(s.records.personal[id].values.vp||0)+1;vp[id]=1;}const hadDemo=!!s.records.common?.tokens?.demonstration;s.records=root.WCARecords.applyPolicyChange(s.records,proposal.id,s.positions[proposal.id],proposal.target,s.positions);s.positions[proposal.id]=proposal.target;if(hadDemo&&!s.records.common.tokens.demonstration&&s.aside.actions.DEM==='demonstration')place(s,'actions','DEM',0);const desired=proposal.id==='6'?'C':proposal.id==='7'?'B':'A',distance=Math.abs(proposal.target.charCodeAt(0)-desired.charCodeAt(0));if(!distance)aside(s,'policies',proposal.id,'desired');else place(s,'policies',proposal.id,distance-1);}
  for(const id of ['Working','Middle','Capitalist'])if(election.sides[id]&&election.sides[id]!==winning)s.records.common.values[CUBE_KEYS[id]]-=Number(election.cubes[id]||0);if(!proposal.immediate){const owner=s.records.personal[proposal.proposer]?.values;if(owner)owner.billMarkers=Math.min(3,Number(owner.billMarkers||0)+1);delete s.proposals[proposal.id];if(!passed)s.aside.policies[proposal.id]='bill:resolved';}election.lastResult={proposal:copy(proposal),sides:copy(election.sides),cubes:copy(election.cubes),spends,coinResults,totals,passed,vp};election.results??=[];election.results.push(copy(election.lastResult));election.current++;if(election.current<election.queue.length){election.step='declare';delete election.sides;delete election.cubes;delete election.autoPlans;}else{s.lastElection=copy(election.lastResult);s.lastElections=copy(election.results);s.phase=election.returnPhase;delete s.election;}note=`政策${proposal.id}は${passed?'可決':'否決'}（賛成${totals.favor}・反対${totals.against}）`;break;}
 case 'scoringApply':{requireThat(s.phase==='scoring'&&s.records,'得点計算フェイズではありません');const result=root.WCARecords.applyScoring(s.records);s.records=result.records;s.lastScoring=result.preview;s.phase=s.round===5?'gameEnd':'preparation';note=`得点計算（労働者+${result.preview.Working.vp}VP・資本家+${result.preview.Capitalist.vp}VP）`;break;}
 case 'gameEndApply':{requireThat(s.phase==='gameEnd'&&s.round===5&&s.records,'ゲーム終了時得点ではありません');const result=root.WCARecords.applyGameEnd(s.records,s.positions);s.records=result.records;s.finalScoring=result.preview;s.phase='finished';note=`最終得点を確定（労働者${result.preview.scores.Working}・資本家${result.preview.scores.Capitalist}）`;break;}
 case 'policy':{
  requireThat(['start','card','end','player','production','preparation','roundEnd'].includes(s.phase),'チェック・行動選択中は政策を変更できません');
  const id=e.id;requireThat(/^[1-7]$/.test(id)&&['A','B','C'].includes(e.position),'政策入力が不正です');
 requireThat(['pending','failed','passed','position'].includes(e.result),'投票結果が不正です');const proposal=s.proposals[id];
 if(e.result==='pending'){requireThat(!proposal,'この政策には既に法案があります');requireThat(Math.abs(e.position.charCodeAt(0)-s.positions[id].charCodeAt(0))===1,'法案は現在位置の隣を指定してください');s.proposals[id]={proposer:['Working','Capitalist'].includes(e.proposer)?e.proposer:'other',from:s.positions[id],target:e.position,round:s.round,turn:s.turn};}
  if(e.result==='pending'&&e.proposer==='Working'&&s.records){requireThat(s.records.personal.Working.values.billMarkers>0,'法案マーカーが足りません');s.records.personal.Working.values.billMarkers--;}
  if(['position','passed'].includes(e.result)){const target=e.result==='passed'?(proposal?.target||e.position):e.position,hadDemo=!!s.records?.common?.tokens?.demonstration;if(s.records)s.records=root.WCARecords.applyPolicyChange(s.records,id,s.positions[id],target,s.positions);s.positions[id]=target;if(hadDemo&&!s.records.common.tokens.demonstration&&s.aside.actions.DEM==='demonstration')place(s,'actions','DEM',0);}
  const owner=proposal?.proposer,ownPending=['Working','Capitalist'].includes(owner);if(ownPending&&['failed','passed'].includes(e.result)&&s.records){const values=s.records.personal[owner].values;values.billMarkers=Math.min(3,Number(values.billMarkers||0)+1);if(e.result==='passed'){values.vp=Number(values.vp||0)+3;if(e.supporter){const supporter=owner==='Working'?'Capitalist':'Working';s.records.personal[supporter].values.vp=Number(s.records.personal[supporter].values.vp||0)+1;}}if(e.result==='failed')s.aside.policies[id]='bill:resolved';}
  if(['failed','passed'].includes(e.result))delete s.proposals[id];
  if(s.round===5&&id==='7'){aside(s,'policies',id,'finalRound');break;}
  if(e.result==='pending')aside(s,'policies',id,['Working','Capitalist'].includes(e.proposer)?`bill:${e.proposer}`:'bill:other');
  if(e.result==='passed'){
   const desired=id==='6'?'C':id==='7'?'B':'A';const distance=Math.abs(e.position.charCodeAt(0)-desired.charCodeAt(0));
   if(!distance)aside(s,'policies',id,'desired');else place(s,'policies',id,distance-1);
  }break;}
 case 'demResolve':{requireThat(['start','card','end'].includes(s.phase),'チェック中は変更できません');requireThat(s.aside.actions.DEM==='demonstration'&&s.records?.common?.tokens?.demonstration,'解決するデモがありません');const result=root.WCARecords.resolveDemonstration(s.records);s.records=result.records;place(s,'actions','DEM',0);note=`生産フェイズのデモ解決（${Object.entries(result.losses).map(([k,v])=>`${k} -${v}VP`).join('、')||'VP減少なし'}${result.unapplied?`、上限により未適用${result.unapplied}VP`:''}）`;break;}
 case 'demReturn':requireThat(['start','card','end'].includes(s.phase),'チェック中は変更できません');requireThat(s.aside.actions.DEM==='demonstration','DEMは除外されていません');if(s.records){s.records.common.tokens??={demonstration:false};s.records.common.tokens.demonstration=false;}place(s,'actions','DEM',0);break;
 case 'strikeAside':requireThat(['start','card','end'].includes(s.phase),'チェック中は変更できません');aside(s,'actions','STR','strikeTokens');break;
 case 'round':
  requireThat(!s.records&&['start','roundEnd'].includes(s.phase)&&s.round<5,'盤面記録があるゲームでは準備フェイズを完了してください');s.round++;s.turn=1;s.phase='start';if(s.aside.actions.STR==='strikeTokens')place(s,'actions','STR',0);for(let i=1;i<=7;i++){const id=String(i);if(s.round===5&&i===7){aside(s,'policies',id,'finalRound');continue;}if(!(id in s.aside.policies))continue;const desired=i===6?'C':i===7?'B':'A',d=Math.abs(s.positions[id].charCodeAt(0)-desired.charCodeAt(0));if(d)place(s,'policies',id,d-1);}note=`ラウンド${s.round}へ`;break;
 case 'preparationApply':
  requireThat(['preparation','roundEnd'].includes(s.phase)&&s.round<5&&s.records,'準備フェイズではありません');requireThat(!Object.keys(s.proposals).length,'投票待ちの法案を解決してください');requireThat(e.confirmed===true,'実物カードと全政策の現在位置を確認してください');{const result=root.WCARecords.applyPreparation(s.records,s.positions,e.plan||{});s.records=result.records;s.lastPreparation={...result.preview,market:result.market,immigration:result.immigration};}s.round++;s.turn=1;s.phase='start';delete s.production;
  if(s.aside.actions.STR==='strikeTokens')place(s,'actions','STR',0);
  for(let i=1;i<=7;i++){const id=String(i);if(s.round===5&&i===7){aside(s,'policies',id,'finalRound');continue;}if(!(id in s.aside.policies))continue;if(String(s.aside.policies[id]).startsWith('bill:')&&s.records){const owner=String(s.aside.policies[id]).slice(5);if(['Working','Capitalist'].includes(owner))s.records.personal[owner].values.billMarkers=Math.min(3,Number(s.records.personal[owner].values.billMarkers||0)+1);}
   const desired=i===6?'C':i===7?'B':'A',d=Math.abs(s.positions[id].charCodeAt(0)-desired.charCodeAt(0));if(d)place(s,'policies',id,d-1);
  }note=`ラウンド${s.round}の準備を反映（利息・繁栄度・新規労働者・市場・カード・優先順位）`;break;
 default:throw Error('不明な操作です');
 }
 s.log.push({at:new Date().toISOString(),turn:s.turn,type:e.type,note,event:copy(e)});validate(s);return s;
}
const api={ACTIONS,CHECKS,initial,copy,rows,rank,locate,move,compress,validate,reduce,refillPlan,emergencyRefillPlan,bagCount,drawCubes,drawOtherCubes,automaStance,voters,voteTotals,currentElection,randomDeck};root.WCA=api;if(typeof module!=='undefined')module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
