(function(root){
'use strict';
const ACTIONS=['AW','BGS','STR','DEM','SA','PB'];
const CHECKS=['AW','PB','BGS','STR'];
const copy=x=>JSON.parse(JSON.stringify(x));
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
function validate(s){
 requireThat(s?.version===1,'保存形式に対応していません');
 if(s.records!==undefined){requireThat(root.WCARecords,'盤面記録モジュールが必要です');root.WCARecords.validate(s.records);}
 requireThat(Number.isInteger(s.round)&&s.round>=1&&s.round<=5,'ラウンドが不正です');
 requireThat(['start','card','checks','action','end','player'].includes(s.phase),'手番状態が不正です');
 for(const [k,all] of [['actions',ACTIONS],['policies',['1','2','3','4','5','6','7']]]){
  requireThat(s[k]&&s.aside?.[k],'優先順位がありません');
  requireThat(Object.entries(s[k]).every(([r,v])=>Number.isSafeInteger(Number(r))&&Array.isArray(v)),'段データが不正です');
  const ids=[...rank(s,k),...Object.keys(s.aside[k])];
  requireThat(ids.length===all.length&&new Set(ids).size===all.length&&all.every(x=>ids.includes(x)),'カードに重複・欠落があります');
 }
 requireThat(typeof s.facts==='string'&&Array.isArray(s.log),'記録が不正です');
 requireThat(s.positions&&Object.values(s.positions).every(x=>['A','B','C'].includes(x)),'政策位置が不正です');
 if(s.proposals!==undefined){requireThat(s.proposals&&typeof s.proposals==='object'&&!Array.isArray(s.proposals),'法案記録が不正です');for(const [id,p] of Object.entries(s.proposals)){requireThat(/^[1-7]$/.test(id)&&p&&['Working','Capitalist','other'].includes(p.proposer)&&['A','B','C'].includes(p.from)&&['A','B','C'].includes(p.target),'法案記録が不正です');}}
 requireThat(Number.isInteger(s.index)&&s.index>=0&&s.index<=4,'チェック位置が不正です');
 if(['checks','action','end'].includes(s.phase))requireThat(s.card&&s.card.order?.length===4&&new Set(s.card.order).size===4&&s.card.order.every(x=>CHECKS.includes(x)),'AIカードが不正です');
 return s;
}
function reduce(state,e){const s=copy(state);s.proposals??={};let note=e.note||'';
 switch(e.type){
 case 'setup':{
  requireThat(e.confirmed===true,'初期状態への置き換えを確認してください');
  const prepared=root.WCARecords.createSetup(e.players,e.immigrant,e.market||[]);
  const fresh=initial();Object.assign(s,fresh,{log:copy(state.log),records:prepared,positions:{1:'C',2:'B',3:'A',4:'B',5:'C',6:'B',7:'B'}});
  note='2人ゲームの初期状態を適用（準備フェイズ前の追加労働者は加算しない）';break;
 }
 case 'record':
  requireThat(root.WCARecords,'盤面記録モジュールが必要です');
  {const hadDemo=!!s.records?.common?.tokens?.demonstration;s.records=root.WCARecords.update(s.records,e);if(hadDemo&&e.section==='establish'&&e.value?.slots?.some(x=>x.owner==='Working')&&!root.WCARecords.demonstrationStatus(s.records).eligible){s.records.common.tokens.demonstration=false;if(s.aside.actions.DEM==='demonstration')place(s,'actions','DEM',0);note+='（条件解消によりデモトークンを除去）';}}break;
 case 'facts':s.facts=e.value;break;
 case 'start':requireThat(s.phase==='start','手番開始ではありません');if(s.records)s.records=root.WCARecords.applyStart(s.records);s.phase='card';break;
 case 'card':
  requireThat(s.phase==='card','カード入力ではありません');
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
  requireThat(selected,'実行できるカードがありません');
  if(selected==='PB')requireThat(e.policyReviewed===true,'政策の提議可否・最終ラウンド制限を確認してください');
  if(s.records){requireThat(root.WCARecords&&e.plan?.action===selected,'盤面へ反映する実行計画が不正です');if(selected==='PB')for(const p of e.plan.proposals||[])if(p.immediate)requireThat(['passed','failed'].includes(p.result),'即時投票の結果を入力してください');s.records=root.WCARecords.applyAction(s.records,e.plan);}
  if(selected==='PB'&&e.plan)for(const p of e.plan.proposals||[]){
   if(!p.immediate){aside(s,'policies',p.id,'bill:Working');s.proposals[p.id]={proposer:'Working',from:p.from,target:p.target,round:s.round,turn:s.turn};continue;}
   if(p.result==='failed')continue;if(s.records){s.records.personal.Working.values.vp=Number(s.records.personal.Working.values.vp||0)+3;if(p.supporterCapitalist)s.records.personal.Capitalist.values.vp=Number(s.records.personal.Capitalist.values.vp||0)+1;}
   {const hadDemo=!!s.records?.common?.tokens?.demonstration;if(s.records)s.records=root.WCARecords.applyPolicyChange(s.records,p.id,s.positions[p.id],p.target,s.positions);s.positions[p.id]=p.target;if(hadDemo&&!s.records.common.tokens.demonstration&&s.aside.actions.DEM==='demonstration')place(s,'actions','DEM',0);}const desired=p.id==='6'?'C':p.id==='7'?'B':'A',distance=Math.abs(p.target.charCodeAt(0)-desired.charCodeAt(0));if(!distance)aside(s,'policies',p.id,'desired');else place(s,'policies',p.id,distance-1);
  }
  if(selected==='DEM')aside(s,'actions','DEM','demonstration');
  else if(selected==='STR'&&e.strExhausted)aside(s,'actions','STR','strikeTokens');
  else if(selected!=='PRESSURE'){
   const destination=Math.max(0,locate(s,'actions',selected)-2);
   place(s,'actions',selected,destination);
  }
  if(e.first==='no'&&selected!=='PRESSURE')compress(s,'actions');
  s.phase='end';note=`${selected} 実行。${note}`;break;}
 case 'freeAction':requireThat(s.phase==='end'&&s.records,'終了時の無償行動ではありません');s.records=root.WCARecords.applyFreeAction(s.records,e.resource,e.upgrade);note=`${e.resource}を使用して繁栄度を上昇`;break;
 case 'end':requireThat(s.phase==='end','終了処理ではありません');requireThat(!s.records||!root.WCARecords.nextFreeResource(s.records),'終了時の資源使用を完了してください');s.phase='player';s.card=null;s.index=0;note='労働者オートマの手番を終了';break;
 case 'playerPolicy':{
  requireThat(s.phase==='player'&&s.records,'資本家の手番ではありません');const id=e.id,current=s.positions[id],target=e.position,cap=s.records.personal.Capitalist.values;requireThat(/^[1-7]$/.test(id)&&!s.proposals[id]&&!String(s.aside.policies[id]||'').startsWith('bill:'),'この政策には提議できません');requireThat(['A','B','C'].includes(target)&&target!==current,'現在と異なる提議先を選んでください');
  if(e.immediate){requireThat(cap.influence>0,'即時投票に必要な影響力がありません');requireThat(['passed','failed'].includes(e.result),'即時投票の結果を選んでください');cap.influence--;if(e.result==='passed'){cap.vp=Number(cap.vp||0)+3;if(e.supporterWorking)s.records.personal.Working.values.vp=Number(s.records.personal.Working.values.vp||0)+1;const hadDemo=!!s.records.common?.tokens?.demonstration;s.records=root.WCARecords.applyPolicyChange(s.records,id,current,target,s.positions);s.positions[id]=target;if(hadDemo&&!s.records.common.tokens.demonstration&&s.aside.actions.DEM==='demonstration')place(s,'actions','DEM',0);const desired=id==='6'?'C':id==='7'?'B':'A',distance=Math.abs(target.charCodeAt(0)-desired.charCodeAt(0));if(!distance)aside(s,'policies',id,'desired');else place(s,'policies',id,distance-1);}note=`資本家が政策${id}を${target}へ提議・即時投票${e.result==='passed'?'可決':'否決'}`;
  }else{requireThat(cap.billMarkers>0,'法案マーカーがありません');cap.billMarkers--;s.proposals[id]={proposer:'Capitalist',from:current,target,round:s.round,turn:s.turn};aside(s,'policies',id,'bill:Capitalist');note=`資本家が政策${id}を${target}へ提議`;}
  break;}
 case 'playerPurchase':{requireThat(s.phase==='player'&&s.records,'資本家の手番ではありません');const result=root.WCARecords.applyCapitalistPurchase(s.records,e.plan,s.positions['6']);s.records=result.records;note=`資本家が${result.food?`食料${result.food}`:''}${result.food&&result.luxury?'・':''}${result.luxury?`ぜいたく品${result.luxury}`:''}を購入（本体${result.base}・関税${result.tariff}・合計${result.total}）`;break;}
 case 'playerBuild':requireThat(s.phase==='player'&&s.records,'資本家の手番ではありません');s.records=root.WCARecords.applyCapitalistBuild(s.records,e.id,e.value,e.common);note=`資本家が${e.id}を設立`;break;
 case 'playerSell':requireThat(s.phase==='player'&&s.records,'資本家の手番ではありません');s.records=root.WCARecords.applyCapitalistSell(s.records,e.id);note='資本家が企業を売却';break;
 case 'playerExport':requireThat(s.phase==='player'&&s.records,'資本家の手番ではありません');s.records=root.WCARecords.applyCapitalistExport(s.records,e.resource,e.qty,e.revenue);note=`資本家が海外市場へ${e.qty}個を売却し${e.revenue}を獲得`;break;
 case 'playerLobby':requireThat(s.phase==='player'&&s.records,'資本家の手番ではありません');s.records=root.WCARecords.applyCapitalistLobby(s.records);note='資本家がロビー（30支払い・影響力3獲得）';break;
 case 'playerPressure':requireThat(s.phase==='player'&&s.records,'資本家の手番ではありません');s.records.common.values.capitalistVotesOutside=Math.max(0,Number(s.records.common.values.capitalistVotesOutside||0)-3);note='資本家が政治的圧力（投票駒3個を袋へ）';break;
 case 'playerEnd':requireThat(s.phase==='player','資本家の手番ではありません');s.turn++;s.phase='start';note='資本家の手番を終了';break;
 case 'policy':{
  requireThat(['start','card','end','player'].includes(s.phase),'チェック・行動選択中は政策を変更できません');
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
  requireThat(s.phase==='start'&&s.round<5,'手番開始時のみ次ラウンドへ進めます');requireThat(!Object.keys(s.proposals).length,'投票待ちの法案を解決してください');requireThat(e.confirmed===true,'全政策の現在位置を確認してください');s.round++;
  if(s.aside.actions.STR==='strikeTokens')place(s,'actions','STR',0);
  for(let i=1;i<=7;i++){const id=String(i);if(s.round===5&&i===7){aside(s,'policies',id,'finalRound');continue;}if(!(id in s.aside.policies))continue;if(String(s.aside.policies[id]).startsWith('bill:')&&s.records){const owner=String(s.aside.policies[id]).slice(5);if(['Working','Capitalist'].includes(owner))s.records.personal[owner].values.billMarkers=Math.min(3,Number(s.records.personal[owner].values.billMarkers||0)+1);}
   const desired=i===6?'C':i===7?'B':'A',d=Math.abs(s.positions[id].charCodeAt(0)-desired.charCodeAt(0));if(d)place(s,'policies',id,d-1);
  }break;
 default:throw Error('不明な操作です');
 }
 s.log.push({at:new Date().toISOString(),turn:s.turn,type:e.type,note,event:copy(e)});validate(s);return s;
}
const api={ACTIONS,CHECKS,initial,copy,rows,rank,locate,move,compress,validate,reduce};root.WCA=api;if(typeof module!=='undefined')module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);

