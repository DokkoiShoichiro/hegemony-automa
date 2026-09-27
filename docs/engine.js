(function(root){
'use strict';
const ACTIONS=['AW','BGS','STR','DEM','SA','PB'];
const CHECKS=['AW','PB','BGS','STR'];
const copy=x=>JSON.parse(JSON.stringify(x));
// Each row array is stored from nearest to farthest from its marker. The UI
// reverses Action rows because Action cards sit on the marker's left side.
const initial=()=>({version:1,round:1,turn:1,phase:'start',index:0,actions:{0:['SA','STR','DEM'],1:['AW','BGS','PB']},policies:{0:['2','4','6'],1:['1','5']},aside:{actions:{},policies:{3:'initial',7:'initial'}},positions:{1:'B',2:'B',3:'A',4:'B',5:'B',6:'B',7:'B'},card:null,facts:'',log:[]});
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
 requireThat(['start','card','checks','action','end'].includes(s.phase),'手番状態が不正です');
 for(const [k,all] of [['actions',ACTIONS],['policies',['1','2','3','4','5','6','7']]]){
  requireThat(s[k]&&s.aside?.[k],'優先順位がありません');
  requireThat(Object.entries(s[k]).every(([r,v])=>Number.isSafeInteger(Number(r))&&Array.isArray(v)),'段データが不正です');
  const ids=[...rank(s,k),...Object.keys(s.aside[k])];
  requireThat(ids.length===all.length&&new Set(ids).size===all.length&&all.every(x=>ids.includes(x)),'カードに重複・欠落があります');
 }
 requireThat(typeof s.facts==='string'&&Array.isArray(s.log),'記録が不正です');
 requireThat(s.positions&&Object.values(s.positions).every(x=>['A','B','C'].includes(x)),'政策位置が不正です');
 requireThat(Number.isInteger(s.index)&&s.index>=0&&s.index<=4,'チェック位置が不正です');
 if(['checks','action','end'].includes(s.phase))requireThat(s.card&&s.card.order?.length===4&&new Set(s.card.order).size===4&&s.card.order.every(x=>CHECKS.includes(x)),'AIカードが不正です');
 return s;
}
function reduce(state,e){const s=copy(state);let note=e.note||'';
 switch(e.type){
 case 'setup':{
  requireThat(e.confirmed===true,'初期状態への置き換えを確認してください');
  const prepared=root.WCARecords.createSetup(e.players,e.immigrant,e.market||[]);
  const fresh=initial();Object.assign(s,fresh,{log:copy(state.log),records:prepared,positions:{1:'C',2:'B',3:'A',4:'B',5:'C',6:'B',7:'B'}});
  note='2人ゲームの初期状態を適用（準備フェイズ前の追加労働者は加算しない）';break;
 }
 case 'record':
  requireThat(root.WCARecords,'盤面記録モジュールが必要です');
  s.records=root.WCARecords.update(s.records,e);break;
 case 'facts':s.facts=e.value;break;
 case 'start':requireThat(s.phase==='start','手番開始ではありません');s.phase='card';break;
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
  if(selected==='DEM')aside(s,'actions','DEM','demonstration');
  else if(selected==='STR'&&e.strExhausted)aside(s,'actions','STR','strikeTokens');
  else if(selected!=='PRESSURE'){
   const destination=Math.max(0,locate(s,'actions',selected)-2);
   place(s,'actions',selected,destination);
  }
  if(e.first==='no'&&selected!=='PRESSURE')compress(s,'actions');
  s.phase='end';note=`${selected} 実行。${note}`;break;}
 case 'end':requireThat(s.phase==='end','終了処理ではありません');s.turn++;s.phase='start';s.card=null;s.index=0;break;
 case 'policy':{
  requireThat(['start','card','end'].includes(s.phase),'チェック・行動選択中は政策を変更できません');
  const id=e.id;requireThat(/^[1-7]$/.test(id)&&['A','B','C'].includes(e.position),'政策入力が不正です');
  requireThat(['pending','failed','passed','position'].includes(e.result),'投票結果が不正です');s.positions[id]=e.position;
  if(s.round===5&&id==='7'){aside(s,'policies',id,'finalRound');break;}
  if(e.result==='pending')aside(s,'policies',id,'bill');
  if(e.result==='passed'){
   const desired=id==='6'?'C':id==='7'?'B':'A';const distance=Math.abs(e.position.charCodeAt(0)-desired.charCodeAt(0));
   if(!distance)aside(s,'policies',id,'desired');else place(s,'policies',id,distance-1);
  }break;}
 case 'demReturn':requireThat(['start','card','end'].includes(s.phase),'チェック中は変更できません');requireThat(s.aside.actions.DEM==='demonstration','DEMは除外されていません');place(s,'actions','DEM',0);break;
 case 'strikeAside':requireThat(['start','card','end'].includes(s.phase),'チェック中は変更できません');aside(s,'actions','STR','strikeTokens');break;
 case 'round':
  requireThat(s.phase==='start'&&s.round<5,'手番開始時のみ次ラウンドへ進めます');requireThat(e.confirmed===true,'全政策の現在位置を確認してください');s.round++;
  if(s.aside.actions.STR==='strikeTokens')place(s,'actions','STR',0);
  for(let i=1;i<=7;i++){const id=String(i);if(s.round===5&&i===7){aside(s,'policies',id,'finalRound');continue;}if(!(id in s.aside.policies))continue;
   const desired=i===6?'C':i===7?'B':'A',d=Math.abs(s.positions[id].charCodeAt(0)-desired.charCodeAt(0));if(d)place(s,'policies',id,d-1);
  }break;
 default:throw Error('不明な操作です');
 }
 s.log.push({at:new Date().toISOString(),turn:s.turn,type:e.type,note,event:copy(e)});validate(s);return s;
}
const api={ACTIONS,CHECKS,initial,copy,rows,rank,locate,move,compress,validate,reduce};root.WCA=api;if(typeof module!=='undefined')module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);

