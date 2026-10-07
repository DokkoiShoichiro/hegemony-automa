(function(root){
'use strict';
const ACTIONS=['AW','BGS','STR','DEM','SA','PB'];
const CHECKS=['AW','PB','BGS','STR'];
const actionIds=s=>s.automaClass==='Capitalist'?['BC','SC','SFM','LOB','SA','PB']:['AW','BGS','STR','DEM','SA','PB'];
const checkIds=s=>s.automaClass==='Capitalist'?['PB','BC','SFM','LOB','SA']:['AW','PB','BGS','STR'];
const catalog=s=>s.automaClass==='Capitalist'?root.CCAJudge:root.WCAJudge;
const copy=x=>JSON.parse(JSON.stringify(x));
const deckNumbers=()=>Array.from({length:30},(_,i)=>String(i+1));
function randomDeck(random=Math.random){const deck=deckNumbers();for(let i=deck.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[deck[i],deck[j]]=[deck[j],deck[i]];}return deck;}
function validDeck(deck){return Array.isArray(deck)&&deck.every(x=>/^([1-9]|[12]\d|30)$/.test(String(x)))&&new Set(deck.map(String)).size===deck.length;}
const IMMIGRATION_SKILLS=['Blue','Green','White','Orange','Purple'];
const IMMIGRATION_CARD_DATA=Object.fromEntries(IMMIGRATION_SKILLS.flatMap(skill=>[
 ...Array.from({length:2},(_,i)=>{const id=`W-${skill}-${i+1}`;return[id,{id,Working:skill,Middle:'Gray'}];}),
 ...Array.from({length:3},(_,i)=>{const id=`M-${skill}-${i+1}`;return[id,{id,Working:'Gray',Middle:skill}];})
]));
const immigrationDeckIds=()=>Object.keys(IMMIGRATION_CARD_DATA);
function validImmigrationDeck(deck){const ids=immigrationDeckIds();return Array.isArray(deck)&&deck.length===ids.length&&new Set(deck).size===ids.length&&deck.every(id=>IMMIGRATION_CARD_DATA[id]);}
function randomImmigrationDeck(random=Math.random){const deck=immigrationDeckIds();for(let i=deck.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[deck[i],deck[j]]=[deck[j],deck[i]];}return deck;}
function drawImmigrationCards(s,count){requireThat(Number.isSafeInteger(count)&&count>=0&&count<=2,'移民カードの枚数が不正です');if(!validImmigrationDeck(s.immigrationDeck))s.immigrationDeck=randomImmigrationDeck();const drawn=[];for(let i=0;i<count;i++){const id=s.immigrationDeck.shift();s.immigrationDeck.push(id);drawn.push(copy(IMMIGRATION_CARD_DATA[id]));}return drawn;}
const exportRows=[
 [[2,25],[6,65],[4,20],[7,35],[3,20],[7,40],[3,25],[6,45]],
 [[3,25],[6,50],[3,20],[7,50],[3,20],[7,40],[2,15],[7,55]],
 [[3,25],[7,55],[4,25],[8,45],[2,10],[6,35],[3,20],[5,35]],
 [[3,30],[7,70],[4,30],[6,40],[3,20],[5,35],[2,15],[6,35]],
 [[2,15],[6,45],[3,20],[7,50],[3,20],[5,30],[4,25],[8,45]],
 [[2,20],[6,55],[4,30],[8,55],[3,25],[5,40],[3,15],[7,35]],
 [[4,45],[7,80],[3,20],[5,30],[2,15],[6,40],[3,20],[7,50]],
 [[4,45],[8,85],[2,15],[6,40],[3,15],[5,25],[3,15],[7,35]],
 [[3,35],[7,75],[2,10],[6,35],[3,20],[5,35],[4,25],[7,40]],
 [[3,30],[5,50],[3,25],[7,55],[3,20],[6,50],[3,20],[7,50]],
 [[2,15],[6,50],[3,25],[5,40],[4,25],[8,45],[3,15],[7,35]],
 [[4,40],[7,70],[3,25],[6,50],[2,15],[7,50],[3,20],[5,30]],
 [[3,30],[5,50],[2,10],[6,35],[3,25],[7,55],[4,25],[8,45]],
 [[3,35],[7,80],[3,15],[5,25],[4,20],[8,40],[2,15],[6,45]],
 [[2,15],[6,50],[3,15],[7,35],[4,30],[7,50],[3,20],[5,35]],
 [[4,50],[8,95],[3,20],[5,30],[3,15],[7,35],[2,15],[6,40]]
];
const tradeResourceOrder=['food','food','luxury','luxury','health','health','education','education'];
const EXPORT_CARD_DATA=Object.fromEntries(exportRows.map((row,i)=>{const id=`E${String(i+1).padStart(2,'0')}`;return[id,{id,name:'',offers:row.map(([quantity,revenue],j)=>({resource:tradeResourceOrder[j],quantity,revenue}))}];}));
const businessRows=[[0,10,40],[8,4,75],[5,6,60],[4,8,60],[7,0,50],[0,12,50],[7,5,70],[8,0,55],[6,0,40],[0,8,30]];
const BUSINESS_DEAL_DATA=Object.fromEntries(businessRows.flatMap((row,i)=>[1,2].map(copyNo=>{const id=`B${String(i+1).padStart(2,'0')}-${copyNo}`,food=row[0],luxury=row[1],cost=row[2],tariffB=food+luxury;return[id,{id,name:'',food,luxury,cost,tariffB,tariffA:tariffB*2}];})));
const tradeDeckIds=()=>({export:Object.keys(EXPORT_CARD_DATA),business:Object.keys(BUSINESS_DEAL_DATA)});
function validTradeDecks(decks){const ids=tradeDeckIds();return decks&&['export','business'].every(type=>Array.isArray(decks[type])&&decks[type].length===ids[type].length&&new Set(decks[type]).size===ids[type].length&&decks[type].every(id=>(type==='export'?EXPORT_CARD_DATA:BUSINESS_DEAL_DATA)[id]));}
function randomTradeDecks(random=Math.random){const decks=tradeDeckIds();for(const deck of Object.values(decks))for(let i=deck.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[deck[i],deck[j]]=[deck[j],deck[i]];}return decks;}
function drawTradeCards(s,dealCount){requireThat(Number.isSafeInteger(dealCount)&&dealCount>=0&&dealCount<=2,'商取引カードの枚数が不正です');if(!validTradeDecks(s.tradeDecks))s.tradeDecks=randomTradeDecks();const exportId=s.tradeDecks.export.shift();s.tradeDecks.export.push(exportId);const businessDeals=[];for(let i=0;i<dealCount;i++){const id=s.tradeDecks.business.shift();s.tradeDecks.business.push(id);businessDeals.push(copy(BUSINESS_DEAL_DATA[id]));}return {exportCard:copy(EXPORT_CARD_DATA[exportId]),businessDeals};}
function drawAutomaCard(s,providedDeck){const fallback=s.automaClass==='Capitalist'?Object.keys(root.CCAJudge?.CARD_DATA||{}):deckNumbers();if(!validDeck(s.aiDeck)){s.aiDeck=validDeck(providedDeck)?providedDeck.map(String):fallback;s.aiDiscard=[];}if(!s.aiDeck.length&&s.automaMode==='Both'){requireThat(s.aiDiscard?.length,'AIカードの山札と捨て札が空です');s.aiDeck=[...s.aiDiscard];for(let i=s.aiDeck.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[s.aiDeck[i],s.aiDeck[j]]=[s.aiDeck[j],s.aiDeck[i]];}s.aiDiscard=[];}requireThat(s.aiDeck.length,'AIカードの山札が空です');const number=String(s.aiDeck.shift()),c=catalog(s)?.CARD_DATA?.[number];requireThat(c,'AIカードの登録データがありません');s.aiDiscard??=[];s.aiDiscard.push(number);s.card={number,order:[...c.order],policies:c.policies.map(String),bonus:c.bonus};s.phase='checks';s.index=0;return number;}
// Each row array is stored from nearest to farthest from its marker. The UI
// reverses Action rows because Action cards sit on the marker's left side.
const initial=()=>({version:1,automaClass:'Working',round:1,turn:1,phase:'start',index:0,actions:{0:['SA','STR','DEM'],1:['AW','BGS','PB']},policies:{0:['2','4','6'],1:['1','5']},aside:{actions:{},policies:{3:'initial',7:'initial'}},positions:{1:'B',2:'B',3:'A',4:'B',5:'B',6:'B',7:'B'},proposals:{},card:null,facts:'',log:[]});
function capitalistInitial(){return {...initial(),automaClass:'Capitalist',actions:{0:['SA','LOB','SC'],1:['BC','SFM','PB']},policies:{0:['2','4','6','7'],1:['3']},aside:{actions:{},policies:{1:'initial',5:'initial'}}};}
const automaKeys=['actions','policies','aside','aiDeck','aiDiscard','card','index'];
function automaSnapshot(s){return Object.fromEntries(automaKeys.map(key=>[key,copy(s[key]??(key==='index'?0:null))]));}
function storeAutoma(s){if(s.automaMode==='Both'&&s.automaStates)s.automaStates[s.automaClass]=automaSnapshot(s);}
function activateAutoma(s,id){requireThat(['Working','Capitalist'].includes(id),'切り替えるオートマが不正です');storeAutoma(s);const saved=s.automaStates?.[id];requireThat(saved,'オートマ別の優先順位がありません');for(const key of automaKeys)s[key]=copy(saved[key]);s.automaClass=id;}
function withAutoma(s,id,work){if(s.automaMode!=='Both')return work();const current=s.automaClass;activateAutoma(s,id);const result=work();storeAutoma(s);if(current!==id)activateAutoma(s,current);return result;}
function drawIndicatorCard(s){if(!s.aiDeck.length){requireThat(s.aiDiscard?.length,'AIカードの山札と捨て札が空です');s.aiDeck=[...s.aiDiscard];for(let i=s.aiDeck.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[s.aiDeck[i],s.aiDeck[j]]=[s.aiDeck[j],s.aiDeck[i]];}s.aiDiscard=[];}const number=String(s.aiDeck.shift());s.aiDiscard??=[];s.aiDiscard.push(number);return {number,influence:Number(catalog(s)?.CARD_DATA?.[number]?.influenceIcons||0)>0};}
function applyCapitalistStrikeWages(s){if(s.records?.participants?.Capitalist!=='automa')return[];const defs=Object.fromEntries([...(root.WCA_COMPANIES||[]),...(root.WCA_EXTRA_COMPANIES||[])].map(d=>[d.id,d])),operating={};for(const [id,c] of Object.entries(s.records.companies||{})){const d=defs[id];if(d&&c.status==='built'&&c.operating==='yes')operating[d.industry]=(operating[d.industry]||0)+1;}const results=[];for(const [id,c] of Object.entries(s.records.companies||{})){const d=defs[id];if(d?.class!=='Capitalist'||c.status!=='built'||!c.strike)continue;const draws=[drawIndicatorCard(s)];if(!draws[0].influence&&(c.machinery||operating[d.industry]===1))draws.push(drawIndicatorCard(s));const raised=draws.some(x=>x.influence);if(raised){c.wage='L3';for(const slot of c.slots)if(['Working','Middle'].includes(slot.owner))slot.committed=true;}results.push({id,name:d.name_jp,draws,raised});}return results;}
function enterProduction(s){const wageDraws=applyCapitalistStrikeWages(s);s.phase='production';s.production={step:'produce',laborPolicy:s.positions[2],wageDraws};}
function advanceDualTurn(s){requireThat(s.automaMode==='Both'&&s.automaClass==='Capitalist','両オートマの手番終了状態が不正です');s.card=null;s.index=0;if(s.turn<5){s.turn++;activateAutoma(s,'Working');s.phase='start';}else enterProduction(s);}
function advanceCapitalistSingleTurn(s){requireThat(s.automaMode==='Single'&&s.automaClass==='Capitalist','資本家オートマの手番終了状態が不正です');s.card=null;s.index=0;if(s.turn<5){s.turn++;s.phase='player';}else enterProduction(s);}
const roundOpeningPhase=s=>s.automaMode==='Single'&&s.automaClass==='Capitalist'?'player':'start';
function updatePolicyPriorities(s,id,target,reason='desired'){const apply=()=>{if(s.round===5&&id==='7'){aside(s,'policies',id,'finalRound');return;}const desired=priorityDesired(s,id),distance=Math.abs(target.charCodeAt(0)-desired.charCodeAt(0));if(!distance)aside(s,'policies',id,reason);else place(s,'policies',id,distance-1);};if(s.automaMode==='Both'){const current=s.automaClass;for(const owner of ['Working','Capitalist'])withAutoma(s,owner,apply);activateAutoma(s,current);}else apply();}
function applyCapitalistStart(s){const c=s.records.personal.Capitalist.values;c.foodPrice=s.positions[6]==='A'?15:12;c.luxuryPrice=s.positions[6]==='A'?10:8;c.healthPrice=s.positions[4]==='C'?10:8;c.educationPrice=s.positions[5]==='C'?10:8;if(s.turn===1){const minimum=({A:'L3',B:'L2',C:'L1'})[s.positions[2]],defs=[...(root.WCA_COMPANIES||[]),...(root.WCA_EXTRA_COMPANIES||[])];for(const [id,company] of Object.entries(s.records.companies||{})){const d=defs.find(x=>x.id===id);if(d?.class==='Capitalist'&&company.status==='built'&&Object.keys(d.wages||{}).length)company.wage=minimum;}}if(Number(c.loans||0)>0&&Number(c.capital||0)>=100){c.capital-=50;c.loans--;}return s.records;}
function rows(s,k){return Object.keys(s[k]).map(Number).filter(r=>s[k][r].length).sort((a,b)=>b-a);}
function rank(s,k){return rows(s,k).flatMap(r=>s[k][r]);}
function locate(s,k,id){return rows(s,k).find(r=>s[k][r].includes(id));}
function remove(s,k,id){const r=locate(s,k,id);if(r!==undefined)s[k][r]=s[k][r].filter(x=>x!==id);}
function place(s,k,id,r){remove(s,k,id);delete s.aside[k][id];(s[k][r]??=[]).push(id);}
function move(s,k,id,n){const r=locate(s,k,id);if(r===undefined)return false;place(s,k,id,r+n);return true;}
function compress(s,k){s[k]=Object.fromEntries(rows(s,k).reverse().map((r,i)=>[i,s[k][r]]));}
function aside(s,k,id,reason){remove(s,k,id);s.aside[k][id]=reason;}
function requireThat(ok,msg){if(!ok)throw Error(msg);}
const VOTE_CLASSES=['Working','Middle','Capitalist','State'],CUBE_KEYS={Working:'workingVotesOutside',Middle:'middleVotesOutside',Capitalist:'capitalistVotesOutside'},DESIRED={Working:{1:'A',2:'A',3:'A',4:'A',5:'A',6:'C',7:'B'},Middle:{1:'B',2:'B',3:'B',4:'B',5:'B',6:'B',7:'B'},Capitalist:{1:'C',2:'C',3:'C',4:'C',5:'C',6:'A',7:'C'}};
function priorityDesired(s,id){if(s.automaClass==='Capitalist')return id==='6'?'A':'C';return id==='6'?'C':id==='7'?'B':'A';}
function voters(s){return VOTE_CLASSES.filter(id=>s.records?.participants?.[id]!=='absent');}
function automaStance(s,p,id){if(p.proposer===id)return 'favor';const desired=DESIRED[id]?.[p.id];if(!desired)return null;const distance=x=>Math.abs(x.charCodeAt(0)-desired.charCodeAt(0));return distance(p.target)<distance(p.from)?'favor':'against';}
function refillPlan(s){const r=s.records,working=Math.ceil(Number(r.personal.Working.values.population||0)/2),operating=id=>Object.entries(r.companies).filter(([companyId,c])=>{const d=[...(root.WCA_COMPANIES||[]),...(root.WCA_EXTRA_COMPANIES||[])].find(x=>x.id===companyId);return d?.class===id&&c.status==='built'&&c.operating==='yes';}).length,capitalist=Math.ceil(operating('Capitalist')/2);let middle=5;if(r.participants.Middle!=='absent'){const population=Number(r.personal.Middle?.values?.population||0);middle=Math.max(Math.ceil(population/2),Math.ceil(operating('Middle')/2));}return {Working:Math.min(working,Number(r.common.values.workingVotesOutside||0)),Capitalist:Math.min(capitalist,Number(r.common.values.capitalistVotesOutside||0)),Middle:Math.min(middle,Number(r.common.values.middleVotesOutside||0))};}
function bagCount(s){return ['Working','Middle','Capitalist'].reduce((n,id)=>n+25-Number(s.records.common.values[CUBE_KEYS[id]]||0),0);}
function emergencyRefillPlan(s){const temp=copy(s),passes=[];for(let i=0;i<2;i++){const plan=refillPlan(temp);passes.push(plan);for(const id of ['Working','Middle','Capitalist'])temp.records.common.values[CUBE_KEYS[id]]-=plan[id];}return {passes,totals:Object.fromEntries(['Working','Middle','Capitalist'].map(id=>[id,passes.reduce((n,p)=>n+p[id],0)])),bagAfter:bagCount(temp)};}
function beginElection(s,queue,mode,returnPhase){delete s.lastElection;delete s.lastElections;s.phase='election';s.election={mode,step:mode==='phase'?'refill':'declare',queue:copy(queue),current:0,returnPhase,results:[]};}
function currentElection(s){return s.election.queue[s.election.current];}
function voteTotals(s,sides,cubes,spends={}){let favor=0,against=0;for(const id of voters(s)){const votes=Number(cubes[id]||0)+Number(spends[id]||0);if(sides[id]==='favor')favor+=votes;else against+=votes;}return {favor,against};}
function influencePlan(s,id,sides,cubes){const values=s.records.personal[id]?.values||{},available=Number(values.influence||0);if(!available)return {type:'none',spend:0,cards:0,reason:'影響力なし'};if(s.round===5&&s.election.mode==='phase'&&s.election.current===s.election.queue.length-1)return {type:'all',spend:available,cards:0,reason:'最終ラウンドの最後の投票'};const base=voteTotals(s,sides,cubes),side=sides[id],winning=side==='favor'?base.favor>=base.against:base.against>base.favor,needed=(which)=>which==='favor'?Math.max(0,base.against-base.favor):Math.max(0,base.favor-base.against+1),otherSide=side==='favor'?'against':'favor',others=voters(s).filter(x=>sides[x]===otherSide).reduce((n,x)=>n+Number(s.records.personal[x]?.values?.influence||0),0),ownSide=voters(s).filter(x=>sides[x]===side).reduce((n,x)=>n+Number(s.records.personal[x]?.values?.influence||0),0);
 if(winning){const otherNeed=needed(otherSide);if(others<otherNeed)return {type:'none',spend:0,cards:0,reason:'勝っており、相手陣営の影響力だけでは逆転不能'};if(others===otherNeed)return {type:'draw',spend:0,cards:1,reason:'相手陣営が逆転にちょうど必要な影響力を所持'};return {type:'draw',spend:0,cards:Math.min(available,others-otherNeed),reason:'勝っており、相手陣営に逆転余力あり'};}
 const need=needed(side);if(ownSide<need)return {type:'none',spend:0,cards:0,reason:'自陣営の影響力を全て使っても逆転不能'};if(!others)return {type:'necessary',spend:Math.min(available,need),cards:0,reason:'相手陣営に影響力がないため必要数を使用'};if(ownSide===need)return {type:'drawAll',spend:0,cards:1,reason:'自陣営が逆転にちょうど必要な影響力を所持'};const spend=Math.min(available,need),cards=Math.min(Math.max(0,available-spend),others);return cards?{type:'necessaryDraw',spend,cards,reason:'必要数を使用後、相手陣営の影響力数だけカードを引く'}:{type:'necessary',spend,cards:0,reason:'必要数を使用し、残りの影響力なし'};
}
// Political card continuations keep revealed cubes out of the bag until a choice is final.
const POLITICAL_CLASSES=['Working','Middle','Capitalist'];
const movementPolicies={wc_workers_movement:'2',wc_healthcare_movement:'4',wc_student_movement:'5',wc_immigration_reform:'7',cc_tap_into_new_markets:'6',cc_taxed_enough_already:'3'};
function politicalEffect(id){return root.PlayerCards?.effects[id]?.startsWith('politics');}
function politicalOptions(s,owner,cardId,exclude){const fixed=movementPolicies[cardId];return Object.keys(s.positions).filter(id=>/^[1-7]$/.test(id)&&(!fixed||id===fixed)&&id!==exclude&&!s.proposals?.[id]&&!String(s.aside.policies[id]||'').startsWith('bill:'));}
function validatePlayerPolitics(s){
 const p=s.pendingPlayerCard,effect=root.PlayerCards.effects[p.cardId];
 requireThat(p.kind==='politics'&&politicalEffect(p.cardId)&&root.PlayerCards.definition(p.owner,p.cardId)&&root.PlayerCards.card(p.owner,p.uid)?.id===p.cardId&&s.playerCards.used&&s.playerCards.classes[p.owner]?.discard.includes(p.uid),'継続中の政治カードが不正です');
 const allowed=effect==='politicsFake'?['remove']:effect==='politicsPolling'?['poll','vote']:effect==='politicsDouble'?['second','firstVote','finalVote']:[];
 requireThat(allowed.includes(p.step)&&s.phase===(['vote','firstVote','finalVote'].includes(p.step)?'election':'player'),'政治カードの継続段階が不正です');
 if(p.drawn){requireThat(Object.keys(p.drawn).length===3&&POLITICAL_CLASSES.every(id=>Number.isSafeInteger(p.drawn[id])&&p.drawn[id]>=0&&p.drawn[id]<=s.records.common.values[CUBE_KEYS[id]]),'公開した投票駒が不正です');requireThat(Object.values(p.drawn).reduce((a,b)=>a+b,0)===(effect==='politicsFake'?6:5),'公開した投票駒の合計が不正です');}
 if(effect==='politicsFake'||effect==='politicsPolling'&&p.step==='poll')requireThat(p.drawn,'公開した投票駒がありません');
 if(effect==='politicsDouble')requireThat(/^[1-7]$/.test(p.firstPolicy),'最初の法案が不正です');
 if(effect==='politicsPolling'){requireThat(p.proposal&&(p.step==='vote'?currentElection(s)?.id===p.proposal.id: s.proposals[p.proposal.id]?.proposer===p.owner&&s.proposals[p.proposal.id]?.target===p.proposal.target),'世論調査の法案が不正です');requireThat(p.priorityBefore?.policies&&p.priorityBefore?.aside,'世論調査の優先順位が不正です');if(p.step==='vote')requireThat(JSON.stringify(s.election?.reservedCubes)===JSON.stringify(p.drawn),'世論調査の投票駒が不正です');}
 if(s.phase==='election')requireThat(s.election.returnPhase==='player'&&s.election.queue.length===1&&currentElection(s).proposer===p.owner,'政治カードの投票復帰先が不正です');
}
function drawPoliticalCubes(s,total,provided){
 // Unlike normal elections, these cards can reveal six cubes. No speculative refill rule is added.
 requireThat(bagCount(s)>=total,`袋内の投票駒が${total}個に足りません。カード用の補充規則は未確認です`);
 const remaining=Object.fromEntries(POLITICAL_CLASSES.map(id=>[id,25-s.records.common.values[CUBE_KEYS[id]]])),drawn=Object.fromEntries(POLITICAL_CLASSES.map(id=>[id,0]));
 if(provided){for(const id of POLITICAL_CLASSES){const n=provided[id];requireThat(Number.isSafeInteger(n)&&n>=0&&n<=remaining[id],'公開する投票駒の内訳が不正です');drawn[id]=n;}requireThat(Object.values(drawn).reduce((a,b)=>a+b,0)===total,'公開する投票駒の合計が不正です');}
 else for(let i=0;i<total;i++){let pick=Math.floor(Math.random()*Object.values(remaining).reduce((a,b)=>a+b,0));for(const id of POLITICAL_CLASSES){if(pick<remaining[id]){drawn[id]++;remaining[id]--;break;}pick-=remaining[id];}}
 for(const id of POLITICAL_CLASSES)s.records.common.values[CUBE_KEYS[id]]+=drawn[id];return drawn;
}
function proposePolitical(s,owner,cardId,plan,exclude){
 const id=String(plan.id),from=s.positions[id],target=plan.position,radical=root.PlayerCards.effects[cardId]==='politicsRadical';
 requireThat(politicalOptions(s,owner,cardId,exclude).includes(id),'この政策には提議できません（2つ目は異なる政策です）');
 requireThat(['A','B','C'].includes(target)&&target!==from&&(radical||Math.abs(target.charCodeAt(0)-from.charCodeAt(0))===1),'提議先が不正です。通常は隣接する区画を選んでください');
 requireThat(!radical||!plan.immediate,'急進的改革では即時投票を行えません');
 const values=s.records.personal[owner].values,proposal={id,proposer:owner,from,target,round:s.round,turn:s.turn};
 if(plan.immediate){requireThat(values.influence>0,'即時投票に必要な影響力がありません');values.influence--;beginElection(s,[{...proposal,immediate:true}],'immediate','player');}
 else{requireThat(values.billMarkers>0,'法案マーカーがありません');values.billMarkers--;s.proposals[id]={proposer:owner,from,target,round:s.round,turn:s.turn};aside(s,'policies',id,'bill:'+owner);}
 return proposal;
}
function applyPlayerPolitics(s,played,plan={},continuing=false){
 const owner=played.owner,id=played.definition.id,effect=root.PlayerCards.effects[id],values=s.records.personal[owner].values;
 requireThat(s.phase==='player'&&politicalEffect(id)&&s.records.participants[owner]==='human','政治カードを使用できません');
 if(continuing){validatePlayerPolitics(s);const p=s.pendingPlayerCard;
  if(p.step==='remove'){const removed={},total=POLITICAL_CLASSES.reduce((sum,id)=>{const n=plan.remove?.[id]??0;requireThat(Number.isSafeInteger(n)&&n>=0&&n<=p.drawn[id],'サプライへ戻す投票駒が不正です');removed[id]=n;return sum+n;},0);requireThat(total<=4,'サプライへ戻せる投票駒は最大4個です');for(const id of POLITICAL_CLASSES)s.records.common.values[CUBE_KEYS[id]]-=p.drawn[id]-removed[id];s.lastPlayerCard.politics={...s.lastPlayerCard.politics,removed};delete s.pendingPlayerCard;return;}
  if(p.step==='poll'){requireThat(typeof plan.immediate==='boolean','即時投票を行うか選んでください');if(plan.immediate){p.step='vote';s.policies=copy(p.priorityBefore.policies);s.aside.policies=copy(p.priorityBefore.aside);beginElection(s,[{...p.proposal,immediate:true,returnBillMarker:true}],'immediate','player');s.election.reservedCubes=copy(p.drawn);}else{for(const id of POLITICAL_CLASSES)s.records.common.values[CUBE_KEYS[id]]-=p.drawn[id];delete s.pendingPlayerCard;}return;}
  requireThat(p.step==='second','2つ目の法案を選択する段階ではありません');proposePolitical(s,owner,id,plan,p.firstPolicy);if(plan.immediate)p.step='finalVote';else delete s.pendingPlayerCard;return;
 }
 requireThat(!s.pendingPlayerCard,'継続中のカードを先に完了してください');
 s.lastPlayerCard={id,owner,legitimacy:0,legitimacyApplied:false,source:'ユーザー提供v6 JSON／公式v1.2 FAQ 印刷p.37',politics:{type:effect}};
 const pending={kind:'politics',owner,uid:played.uid,cardId:id};
 if(effect==='politicsFake'){pending.step='remove';pending.drawn=drawPoliticalCubes(s,6,plan.draw);s.lastPlayerCard.politics.drawn=copy(pending.drawn);s.pendingPlayerCard=pending;return;}
 if(effect==='politicsInterest'){
  const remaining=Object.fromEntries(POLITICAL_CLASSES.map(id=>[id,25-s.records.common.values[CUBE_KEYS[id]]])),drawn=Object.fromEntries(POLITICAL_CLASSES.map(id=>[id,0]));
  requireThat(POLITICAL_CLASSES.filter(id=>id!==owner).reduce((n,id)=>n+remaining[id],0)>=3,'袋内に他階級の投票駒が3個ありません。カード用の補充規則は未確認です');
  let others=0;while(others<3){let pick=Math.floor(Math.random()*Object.values(remaining).reduce((a,b)=>a+b,0));for(const id of POLITICAL_CLASSES){if(pick<remaining[id]){remaining[id]--;drawn[id]++;if(id!==owner)others++;break;}pick-=remaining[id];}}
  const added=Math.min(3,s.records.common.values[CUBE_KEYS[owner]]);for(const id of POLITICAL_CLASSES)if(id!==owner)s.records.common.values[CUBE_KEYS[id]]+=drawn[id];s.records.common.values[CUBE_KEYS[owner]]-=added;s.lastPlayerCard.politics={type:effect,drawn,added};return;
 }
 if(effect==='politicsDouble'){
  requireThat(politicalOptions(s,owner,id).length>=2,'異なる政策に2つの法案を提出できません');requireThat(values.billMarkers+values.influence>=2,'2つの法案に必要な法案マーカー・影響力が足りません');
  if(id==='cc_push_political_agenda'){requireThat(['revenue','capital','loans'].every(key=>Number.isSafeInteger(values[key])&&values[key]>=0),'資金を確認してください');while(values.revenue+values.capital<25){values.capital+=50;values.loans++;}const paid=Math.min(values.revenue,25);values.revenue-=paid;values.capital-=25-paid;}
  proposePolitical(s,owner,id,plan);requireThat(values.billMarkers+values.influence>=1,'2つ目の法案に必要な法案マーカー・影響力がありません');pending.firstPolicy=String(plan.id);pending.step=plan.immediate?'firstVote':'second';s.pendingPlayerCard=pending;return;
 }
 if(effect==='politicsMovement'){const key=CUBE_KEYS[owner],added=Math.min(2,s.records.common.values[key]);s.records.common.values[key]-=added;s.lastPlayerCard.politics.added=added;}
 const priorityBefore={policies:copy(s.policies),aside:copy(s.aside.policies)};
 const proposal=proposePolitical(s,owner,id,effect==='politicsPolling'?{...plan,immediate:false}:plan);
 if(effect==='politicsPolling'){pending.step='poll';pending.proposal=proposal;pending.priorityBefore=priorityBefore;pending.drawn=drawPoliticalCubes(s,5,plan.draw);s.lastPlayerCard.politics.drawn=copy(pending.drawn);s.pendingPlayerCard=pending;}
}
function validate(s){
 requireThat(!s.pendingPlayerCard||s.playerCards,'継続中のカードには手札管理が必要です');
 if(s.playerCards!==undefined){requireThat(root.PlayerCards,'プレイヤーカードモジュールが必要です');root.PlayerCards.validate(s);}
 requireThat(s?.version===1,'保存形式に対応していません');
 if(s.records!==undefined){requireThat(root.WCARecords,'盤面記録モジュールが必要です');root.WCARecords.validate(s.records);}
 requireThat(Number.isInteger(s.round)&&s.round>=1&&s.round<=5,'ラウンドが不正です');
 requireThat(['start','card','checks','action','end','player','production','election','scoring','preparation','roundEnd','gameEnd','finished'].includes(s.phase),'手番状態が不正です');
 if(s.phase==='production')requireThat(s.production&&['produce','needs','imf','taxes'].includes(s.production.step)&&['A','B','C'].includes(s.production.laborPolicy),'生産フェイズの状態が不正です');
 if(s.phase==='election')requireThat(s.election&&['refill','declare','influence'].includes(s.election.step)&&Array.isArray(s.election.queue)&&s.election.queue.length,'投票フェイズの状態が不正です');
 requireThat(['Working','Capitalist'].includes(s.automaClass||'Working'),'オートマ階級が不正です');
 for(const [k,all] of [['actions',actionIds(s)],['policies',['1','2','3','4','5','6','7']]]){
  requireThat(s[k]&&s.aside?.[k],'優先順位がありません');
  requireThat(Object.entries(s[k]).every(([r,v])=>Number.isSafeInteger(Number(r))&&Array.isArray(v)),'段データが不正です');
  const ids=[...rank(s,k),...Object.keys(s.aside[k])];
  requireThat(ids.length===all.length&&new Set(ids).size===all.length&&all.every(x=>ids.includes(x)),'カードに重複・欠落があります');
 }
 requireThat(typeof s.facts==='string'&&Array.isArray(s.log),'記録が不正です');
 if(s.preparationTrade!==undefined){requireThat(s.phase==='preparation','準備フェイズ外に輸出入カードの下書きがあります');root.WCARecords.tradeData(s.preparationTrade,({A:0,B:1,C:2})[s.positions[6]],true);}
 if(s.aiDeck!==undefined){requireThat(validDeck(s.aiDeck)&&validDeck(s.aiDiscard||[])&&!s.aiDeck.some(x=>(s.aiDiscard||[]).includes(String(x))),'AIカードの山札が不正です');}
 if(s.immigrationDeck!==undefined)requireThat(validImmigrationDeck(s.immigrationDeck),'移民カードの山札が不正です');
 if(s.tradeDecks!==undefined)requireThat(validTradeDecks(s.tradeDecks),'輸出入カードの山札が不正です');
 if(s.automaMode==='Both'){requireThat(s.automaStates&&s.records?.participants?.Working==='automa'&&s.records?.participants?.Capitalist==='automa','両オートマの保存状態が不正です');for(const id of ['Working','Capitalist']){const saved=s.automaStates[id],shadow={...s,...saved,automaClass:id};requireThat(saved&&saved.actions&&saved.policies&&saved.aside,'オートマ別の優先順位がありません');for(const [key,all] of [['actions',actionIds(shadow)],['policies',['1','2','3','4','5','6','7']]]){const ids=[...rank(shadow,key),...Object.keys(shadow.aside[key]||{})];requireThat(ids.length===all.length&&new Set(ids).size===all.length&&all.every(x=>ids.includes(x)),'オートマ別カードに重複・欠落があります');}requireThat(validDeck(saved.aiDeck)&&validDeck(saved.aiDiscard||[])&&!saved.aiDeck.some(x=>(saved.aiDiscard||[]).includes(String(x))),'オートマ別AI山札が不正です');}const active=s.automaStates[s.automaClass];for(const key of automaKeys)requireThat(JSON.stringify(active[key])===JSON.stringify(s[key]),'有効なオートマ状態が同期されていません');}
 requireThat(s.positions&&Object.values(s.positions).every(x=>['A','B','C'].includes(x)),'政策位置が不正です');
 if(s.proposals!==undefined){requireThat(s.proposals&&typeof s.proposals==='object'&&!Array.isArray(s.proposals),'法案記録が不正です');for(const [id,p] of Object.entries(s.proposals)){requireThat(/^[1-7]$/.test(id)&&p&&['Working','Capitalist','other'].includes(p.proposer)&&['A','B','C'].includes(p.from)&&['A','B','C'].includes(p.target),'法案記録が不正です');}}
 requireThat(Number.isInteger(s.index)&&s.index>=0&&s.index<=4,'チェック位置が不正です');
 if(['checks','action','end'].includes(s.phase))requireThat(s.card&&s.card.order?.length===4&&new Set(s.card.order).size===4&&s.card.order.every(x=>checkIds(s).includes(x)),'AIカードが不正です');
 return s;
}
function reduce(state,e){if(state.pendingPlayerCard?.kind==='politics')root.PlayerCards.validate(state);requireThat(!state.pendingPlayerCard||['playerCardContinue','setup'].includes(e.type)||state.pendingPlayerCard.kind==='politics'&&state.phase==='election'&&['electionDeclare','electionResolve','electionEmergencyRefill'].includes(e.type),'継続中のカード効果を先に完了してください');let s=copy(state);s.proposals??={};let note=e.note||'',played=null;
 if(s.playerCards&&root.PlayerCards.mainEvents.has(e.type))played=root.PlayerCards.consume(s,e);
 if(s.playerCards&&e.type==='playerEnd'){requireThat(s.playerCards.used,'カード効果か基本アクションを1つ実行してください');s.playerCards.used=false;}
 if(s.playerCards&&e.type==='playerWage')requireThat(s.phase==='player'&&root.PlayerCards.activeOwner(s)==='Capitalist','資本家プレイヤーの手番ではありません');
 switch(e.type){
 case 'setup':{
  requireThat(e.confirmed===true,'初期状態への置き換えを確認してください');
  const both=e.automaClass==='Both',automaClass=e.automaClass==='Capitalist'?'Capitalist':'Working',automaticImmigration=validImmigrationDeck(e.immigrationDeck),migrationState=automaticImmigration?{immigrationDeck:[...e.immigrationDeck]}:null,initialCards=automaticImmigration?drawImmigrationCards(migrationState,1):[],initialImmigrant=initialCards[0]?.Working||e.immigrant||'',prepared=root.WCARecords.createSetup(e.players,initialImmigrant,e.market||[]),base=automaClass==='Capitalist'?capitalistInitial():initial(),tradeState={tradeDecks:validTradeDecks(e.tradeDecks)?copy(e.tradeDecks):randomTradeDecks()};prepared.participants.Working=both||automaClass==='Working'?'automa':'human';prepared.participants.Capitalist=both||automaClass==='Capitalist'?'automa':'human';if(initialCards.length){prepared.setup.immigrationCard=initialCards[0];prepared.setup.immigrationAutomatic=true;prepared.setup.pending=prepared.setup.pending.filter(x=>!x.includes('移民カード'));}prepared.trade=root.WCARecords.tradeData(e.trade||drawTradeCards(tradeState,1),1,true);
  s={...base,automaMode:both?'Both':'Single',records:prepared,positions:{1:'C',2:'B',3:'A',4:'B',5:'C',6:'B',7:'B'},aiDeck:validDeck(e.deck)?e.deck.map(String):(automaClass==='Capitalist'?Object.keys(root.CCAJudge?.CARD_DATA||{}):deckNumbers()),aiDiscard:[],tradeDecks:tradeState.tradeDecks,...(automaticImmigration?{immigrationDeck:migrationState.immigrationDeck}:{})};
  if(both){const working={...initial(),aiDeck:validDeck(e.workingDeck)?e.workingDeck.map(String):deckNumbers(),aiDiscard:[]},capitalist={...capitalistInitial(),aiDeck:validDeck(e.capitalistDeck)?e.capitalistDeck.map(String):Object.keys(root.CCAJudge?.CARD_DATA||{}),aiDiscard:[]};s.automaClass='Working';s.automaStates={Working:automaSnapshot(working),Capitalist:automaSnapshot(capitalist)};for(const key of automaKeys)s[key]=copy(s.automaStates.Working[key]);}
  else s.phase=roundOpeningPhase(s);
  if(e.managePlayerCards===true){requireThat(root.PlayerCards,'プレイヤーカードモジュールが必要です');s.playerCards=root.PlayerCards.create(prepared,e.playerCardDecks);}
  note=`2人ゲームの初期状態を適用（${both?'労働者オートマ対資本家オートマ':automaClass==='Capitalist'?'資本家':'労働者'}）`;break;
 }
 case 'record':
  requireThat(root.WCARecords,'盤面記録モジュールが必要です');
  {const hadDemo=!!s.records?.common?.tokens?.demonstration;s.records=root.WCARecords.update(s.records,e);if(hadDemo&&e.section==='establish'&&e.value?.slots?.some(x=>x.owner==='Working')&&!root.WCARecords.demonstrationStatus(s.records).eligible){s.records.common.tokens.demonstration=false;if(s.aside.actions.DEM==='demonstration')place(s,'actions','DEM',0);note+='（条件解消によりデモトークンを除去）';}}break;
 case 'facts':s.facts=e.value;break;
 case 'start':requireThat(s.phase==='start','手番開始ではありません');if(s.records)s.records=s.automaClass==='Capitalist'?applyCapitalistStart(s):root.WCARecords.applyStart(s.records);if(s.records&&catalog(s)?.CARD_DATA){const number=drawAutomaCard(s,e.deck);note=`開始時処理後、AIカード#${number}を自動ドロー`;}else s.phase='card';break;
 case 'drawCard':{requireThat(s.phase==='card'&&s.records,'AIカードを引く段階ではありません');const number=drawAutomaCard(s,e.deck);note=`AIカード#${number}を自動ドロー`;break;}
 case 'card':
  requireThat(s.phase==='card'||s.phase==='checks'&&s.index===0,'カード入力ではありません');
  requireThat(e.order.length===4&&new Set(e.order).size===4&&e.order.every(x=>checkIds(s).includes(x)),'4種類を一度ずつ指定してください');
  requireThat(e.policies.length===2&&new Set(e.policies).size===2&&e.policies.every(x=>/^[1-7]$/.test(x)),'異なる政策2つを指定してください');
  requireThat(!e.number||(/^\d+$/.test(e.number)&&+e.number>=1&&+e.number<=30),'カード番号は1〜30です');
  s.card={number:e.number,order:e.order,policies:e.policies,bonus:e.bonus};s.phase='checks';s.index=0;break;
 case 'check':
  requireThat(s.phase==='checks','チェック中ではありません');
  requireThat(note.trim(),'判定の根拠を入力してください');
  requireThat(e.confirmed===true,'現物での確認が必要です');
  for(const m of e.movements){requireThat(['actions','policies'].includes(m.series)&&Number.isInteger(m.up)&&m.up>=1&&m.up<=100,'移動段数は1〜100です');requireThat((m.series==='actions'?actionIds(s):['1','2','3','4','5','6','7']).includes(m.card),'カードが不正です');m.applied=move(s,m.series,m.card,m.up);}
  s.index++;if(s.index===4){compress(s,'actions');compress(s,'policies');s.phase='action';}break;
 case 'action':{
  requireThat(s.phase==='action','行動選択ではありません');
  const top=rank(s,'actions').slice(0,2);
  requireThat(['yes','no'].includes(e.first),'最優先行動の可否を確認してください');
  if(e.first==='no')requireThat(['yes','no'].includes(e.second),'次点行動の可否を確認してください');
 const selected=e.first==='yes'?top[0]:e.second==='yes'?top[1]:'PRESSURE';
 const immediate=[];
  requireThat(selected,'実行できるカードがありません');
  if(s.automaClass==='Capitalist'){
   if(selected==='PB'){
     requireThat(e.plan?.action==='PB'&&e.policyReviewed===true,'法案の提議計画が不正です');
     s.records=root.WCARecords.applyCapitalistAutomaPolicy(s.records,e.plan);
     const cap=s.records.personal.Capitalist.values;
    for(const p of e.plan.proposals||[]){if(p.immediate){requireThat(Number(cap.influence)>=Number(p.immediateCost||0),'即時投票の影響力が足りません');cap.influence-=Number(p.immediateCost||0);immediate.push({id:p.id,proposer:'Capitalist',from:p.from,target:p.target,immediate:true});}else{requireThat(Number(cap.billMarkers)>0,'法案マーカーがありません');cap.billMarkers--;aside(s,'policies',p.id,'bill:Capitalist');s.proposals[p.id]={proposer:'Capitalist',from:p.from,target:p.target,round:s.round,turn:s.turn};}}
    }else if(selected==='BC'){requireThat(e.plan?.action==='BC','企業の設立計画が不正です');const bonusType=e.plan.bonusType||null;s.records=root.WCARecords.applyCapitalistAutomaBuild(s.records,e.plan,s.positions[2],bonusType);}
    else if(selected==='SC'){requireThat(e.plan?.action==='SC','企業の売却計画が不正です');const bonusType=catalog(s)?.CARD_DATA?.[String(s.card?.number||'')]?.bonusType;s.records=root.WCARecords.applyCapitalistAutomaSell(s.records,e.plan,bonusType);}
    else if(selected==='SFM'){requireThat(e.plan?.action==='SFM','海外市場への販売計画が不正です');s.records=root.WCARecords.applyCapitalistAutomaExport(s.records,e.plan,e.plan.bonusType||null);}
    else if(selected==='LOB'){requireThat(e.plan?.action==='LOB','ロビー活動の計画が不正です');s.records=root.WCARecords.applyCapitalistAutomaLobby(s.records,e.plan);}
    else if(selected==='SA'){requireThat(e.plan?.action==='SA','特殊アクションの計画が不正です');s.records=root.WCARecords.applyCapitalistAutomaSpecial(s.records,e.plan,s.positions,s.round);}
   else if(selected!=='PRESSURE')requireThat(e.confirmed===true,'資本家オートマの行動を盤面へ反映したことを確認してください');
   if(selected==='PRESSURE')s.records.common.values.capitalistVotesOutside=Math.max(0,Number(s.records.common.values.capitalistVotesOutside||0)-3);
   else{const destination=Math.max(0,locate(s,'actions',selected)-2);place(s,'actions',selected,destination);}
   if(e.first==='no'&&selected!=='PRESSURE')compress(s,'actions');s.card=null;s.index=0;if(s.automaMode==='Both'){if(immediate.length)beginElection(s,immediate,'immediate','automaNext');else advanceDualTurn(s);}else if(immediate.length)beginElection(s,immediate,'immediate','capitalistSingleNext');else advanceCapitalistSingleTurn(s);note=`資本家オートマ：${selected}を実行`;break;
  }
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
 case 'freeAction':requireThat(s.records&&(s.phase==='end'||s.phase==='player'&&s.automaClass==='Capitalist'&&s.records.participants.Working==='human'),'労働者のフリーアクションを実行できる手番ではありません');s.records=root.WCARecords.applyFreeAction(s.records,e.resource,e.upgrade);note=`${e.resource}を使用して繁栄度を上昇`;break;
 case 'end':requireThat(s.phase==='end','終了処理ではありません');requireThat(!s.records||!root.WCARecords.nextFreeResource(s.records),'終了時の資源使用を完了してください');s.card=null;s.index=0;if(s.automaMode==='Both'){activateAutoma(s,'Capitalist');s.phase='start';note='労働者オートマの手番を終了し、資本家オートマへ';}else{s.phase='player';note='労働者オートマの手番を終了';}break;
 case 'workingBasic':{
  requireThat(s.phase==='player'&&s.automaClass==='Capitalist'&&s.records?.participants.Working==='human','労働者プレイヤーの手番ではありません');requireThat(!s.workingBasicUsed,'この手番の基本アクションは実行済みです');
  s.records=root.WCARecords.applyWorkingBasic(s.records,e.plan,s.positions);s.workingBasicUsed=true;note=`労働者が基本アクション ${e.plan.action} を実行`;break;}
 case 'workingPolicy':{
  requireThat(s.phase==='player'&&s.automaClass==='Capitalist'&&s.records?.participants.Working==='human','労働者プレイヤーの手番ではありません');requireThat(!s.workingBasicUsed,'この手番の基本アクションは実行済みです');
  const id=e.id,from=s.positions[id],target=e.position,w=s.records.personal.Working.values;requireThat(/^[1-7]$/.test(id)&&!s.proposals[id],'この政策には提議できません');requireThat(['A','B','C'].includes(target)&&Math.abs(target.charCodeAt(0)-from.charCodeAt(0))===1,'基本アクションでは隣接する区画へ提議してください');
  if(e.immediate){requireThat(w.influence>0,'即時投票に必要な影響力がありません');w.influence--;beginElection(s,[{id,proposer:'Working',from,target,immediate:true}],'immediate','player');}
  else {requireThat(w.billMarkers>0,'法案マーカーがありません');w.billMarkers--;s.proposals[id]={proposer:'Working',from,target,round:s.round,turn:s.turn};aside(s,'policies',id,'bill:Working');}
  s.workingBasicUsed=true;note=`労働者が政策${id}を${target}へ提議`;break;}
 case 'playerCardReveal':{requireThat(played,'アプリ内の手札管理が必要です');root.PlayerCards.revealExport(s,played);note='輸出カード2枚を公開（交換・売却を選んで継続）';break;}
 case 'playerCardContinue':{const pending=s.pendingPlayerCard;requireThat(pending&&s.phase==='player','継続中のカード効果がありません');if(pending.kind==='politics')applyPlayerPolitics(s,{owner:pending.owner,uid:pending.uid,definition:root.PlayerCards.definition(pending.owner,pending.cardId)},e.plan,true);else root.PlayerCards.applyEffect(s,pending.owner,root.PlayerCards.definition(pending.owner,pending.cardId),e.plan);note='カード効果を継続';break;}
 case 'playerCardEffect':{requireThat(played,'アプリ内の手札管理が必要です');const hadDemo=!!s.records.common.tokens.demonstration;if(politicalEffect(played.definition.id))applyPlayerPolitics(s,played,e.plan);else root.PlayerCards.applyEffect(s,played.owner,played.definition,e.plan);if(hadDemo&&!s.records.common.tokens.demonstration&&s.aside.actions.DEM==='demonstration')place(s,'actions','DEM',0);note=`${played.definition.name}の効果を実行`;break;}
 case 'playerPolicy':{
  requireThat(s.phase==='player'&&s.records,'資本家の手番ではありません');const id=e.id,current=s.positions[id],target=e.position,cap=s.records.personal.Capitalist.values;requireThat(/^[1-7]$/.test(id)&&!s.proposals[id]&&!String(s.aside.policies[id]||'').startsWith('bill:'),'この政策には提議できません');requireThat(['A','B','C'].includes(target)&&target!==current,'現在と異なる提議先を選んでください');
  if(s.playerCards)requireThat(Math.abs(target.charCodeAt(0)-current.charCodeAt(0))===1,'基本アクションでは隣接する区画へ提議してください');
  if(e.immediate){requireThat(cap.influence>0,'即時投票に必要な影響力がありません');cap.influence--;beginElection(s,[{id,proposer:'Capitalist',from:current,target,immediate:true}],'immediate','player');note=`資本家が政策${id}を${target}へ提議し即時投票を開始`;
  }else{requireThat(cap.billMarkers>0,'法案マーカーがありません');cap.billMarkers--;s.proposals[id]={proposer:'Capitalist',from:current,target,round:s.round,turn:s.turn};aside(s,'policies',id,'bill:Capitalist');note=`資本家が政策${id}を${target}へ提議`;}
  break;}
 case 'playerPurchase':{requireThat(s.phase==='player'&&s.records,'資本家の手番ではありません');if(s.playerCards)requireThat(e.plan?.source==='BusinessDeal','資本家の基本アクションでは商取引カードを選んでください');const result=root.WCARecords.applyCapitalistPurchase(s.records,e.plan,s.positions['6']);s.records=result.records;note=`資本家が${result.food?`食料${result.food}`:''}${result.food&&result.luxury?'・':''}${result.luxury?`ぜいたく品${result.luxury}`:''}を購入（本体${result.base}・関税${result.tariff}・合計${result.total}）`;break;}
 case 'playerBuild':requireThat(s.phase==='player'&&s.records,'資本家の手番ではありません');s.records=root.WCARecords.applyCapitalistBuild(s.records,e.id,e.value,e.common);note=`資本家が${e.id}を設立`;break;
 case 'playerWage':{requireThat(s.phase==='player'&&s.records,'資本家の手番ではありません');const result=root.WCARecords.applyCapitalistWageIncrease(s.records,e.id,e.wage);s.records=result.records;note=`資本家が${e.id}の賃金を${e.wage}へ上げ、労働者${result.committed}人を誓約`;break;}
 case 'playerSell':requireThat(s.phase==='player'&&s.records,'資本家の手番ではありません');s.records=root.WCARecords.applyCapitalistSell(s.records,e.id);note='資本家が企業を売却';break;
 case 'playerExport':{requireThat(s.phase==='player'&&s.records,'資本家の手番ではありません');if(s.playerCards){const indices=e.transactions,offers=s.records.trade.exportCard.offers;requireThat(Array.isArray(indices)&&indices.length>0&&new Set(indices).size===indices.length,'輸出カードの取引を選んでください');for(const index of indices){requireThat(Number.isSafeInteger(index)&&offers[index],'輸出カードの取引が不正です');const o=offers[index];s.records=root.WCARecords.applyCapitalistExport(s.records,o.resource,o.quantity,o.revenue);}note=`資本家が海外市場へ${indices.length}件の取引を実行`;}else{s.records=root.WCARecords.applyCapitalistExport(s.records,e.resource,e.qty,e.revenue);note=`資本家が海外市場へ${e.qty}個を売却し${e.revenue}を獲得`;}break;}
 case 'playerLobby':requireThat(s.phase==='player'&&s.records,'資本家の手番ではありません');s.records=root.WCARecords.applyCapitalistLobby(s.records);note='資本家がロビー（30支払い・影響力3獲得）';break;
 case 'playerPressure':requireThat(s.phase==='player'&&s.records,'資本家の手番ではありません');s.records.common.values.capitalistVotesOutside=Math.max(0,Number(s.records.common.values.capitalistVotesOutside||0)-3);note='資本家が政治的圧力（投票駒3個を袋へ）';break;
 case 'playerEnd':s.workingBasicUsed=false;requireThat(s.phase==='player','プレイヤーの手番ではありません');if(s.automaClass==='Capitalist'){s.phase='start';note='労働者の手番を終了し、資本家オートマへ';}else if(s.turn<5){s.turn++;s.phase='start';note='資本家の手番を終了';}else{enterProduction(s);note=`第5手番を終了し、生産フェイズへ${s.production.wageDraws.length?`（資本家オートマのストライキ企業${s.production.wageDraws.length}社を判定）`:''}`;}break;
 case 'productionProduce':{requireThat(s.phase==='production'&&s.production.step==='produce'&&s.records,'生産ステップではありません');let demo='';if(s.records.common.tokens?.demonstration)withAutoma(s,'Working',()=>{if(s.aside.actions.DEM==='demonstration'){const result=root.WCARecords.resolveDemonstration(s.records);s.records=result.records;place(s,'actions','DEM',0);demo=`、デモ解決${Object.values(result.losses).reduce((a,b)=>a+b,0)}VP減少`;}});const result=root.WCARecords.applyProduction(s.records);s.records=result.records;s.production.step='needs';note=`生産・賃金を反映${demo}`;break;}
 case 'productionNeeds':{requireThat(s.phase==='production'&&s.production.step==='needs'&&s.records,'需要充足ステップではありません');const result=root.WCARecords.applyFoodNeeds(s.records,e.plan||{},s.positions[6]);s.records=result.records;s.production.step='imf';note=`労働者の食料需要を充足（支払${result.total}）`;break;}
 case 'productionImf':{requireThat(s.phase==='production'&&s.production.step==='imf'&&s.records,'IMF確認ステップではありません');const result=root.WCARecords.applyImf(s.records,s.positions[1],e.manual===true);s.records=result.records;s.production.step='taxes';note=result.mode==='safe'?'IMF介入なし':result.mode==='repaid'?`国家が貸付金${result.preview.repay}枚を返済`:'IMF介入を手動処理済み';break;}
 case 'productionTaxes':{requireThat(s.phase==='production'&&s.production.step==='taxes'&&s.records,'納税ステップではありません');const result=root.WCARecords.applyTaxes(s.records,s.positions,s.production.laborPolicy);s.records=result.records;const queue=Object.entries(s.proposals).sort(([a],[b])=>Number(a)-Number(b)).map(([id,p])=>({id,...p,immediate:false}));if(queue.length)beginElection(s,queue,'phase','scoring');else s.phase='scoring';note=`納税（労働者${result.preview.working}・資本家${result.preview.capitalist}）${queue.length?'、投票フェイズ開始':'、得点計算へ'}`;break;}
 case 'electionRefill':{requireThat(s.phase==='election'&&s.election.step==='refill','投票バッグ補充ではありません');const plan=refillPlan(s);for(const id of ['Working','Middle','Capitalist'])s.records.common.values[CUBE_KEYS[id]]-=plan[id];s.election.refill=plan;s.election.step='declare';note=`投票バッグを補充（労働者${plan.Working}・中産${plan.Middle}・資本家${plan.Capitalist}）`;break;}
 case 'electionEmergencyRefill':{requireThat(s.phase==='election'&&s.election.step==='declare'&&bagCount(s)<5,'投票キューブの緊急補充は不要です');const extra=emergencyRefillPlan(s);for(const plan of extra.passes)for(const id of ['Working','Middle','Capitalist'])s.records.common.values[CUBE_KEYS[id]]-=plan[id];requireThat(bagCount(s)>=5,'2回補充しても投票キューブが5個に足りません。盤面記録を確認してください');s.election.emergencyRefill=extra;note=`投票バッグ不足のため補充を2回実行（労働者${extra.totals.Working}・中産${extra.totals.Middle}・資本家${extra.totals.Capitalist}）`;break;}
 case 'electionDeclare':{requireThat(s.phase==='election'&&s.election.step==='declare','投票の意思表示ではありません');const proposal=currentElection(s),present=voters(s),sides={};for(const id of present){const mode=s.records.participants[id],expected=mode==='automa'?automaStance(s,proposal,id):null,supplied=e.sides?.[id];if(id===proposal.proposer)sides[id]='favor';else if(mode==='automa'){requireThat(expected&&supplied===expected,`${id}オートマの賛否が不正です`);sides[id]=expected;}else{requireThat(['favor','against'].includes(supplied),`${id}の賛否を選んでください`);sides[id]=supplied;}}const cubes={};let total=0;for(const id of ['Working','Middle','Capitalist']){const n=Number(e.cubes?.[id]||0),inside=25-Number(s.records.common.values[CUBE_KEYS[id]]||0);requireThat(Number.isSafeInteger(n)&&n>=0&&(s.election.reservedCubes?n===s.election.reservedCubes[id]:n<=inside),`${id}の投票キューブ数が不正です`);cubes[id]=n;total+=n;}requireThat(total===5,'袋から出た投票キューブは合計5個です');if(!s.election.reservedCubes)for(const id of ['Working','Middle','Capitalist'])s.records.common.values[CUBE_KEYS[id]]+=cubes[id];s.election.sides=sides;s.election.cubes=cubes;s.election.autoPlans=Object.fromEntries(present.filter(id=>s.records.participants[id]==='automa').map(id=>[id,influencePlan(s,id,sides,cubes)]));s.election.step='influence';note=`政策${proposal.id}の賛否と投票キューブを記録`;break;}
 case 'electionResolve':{requireThat(s.phase==='election'&&s.election.step==='influence','影響力の決定ではありません');const election=s.election,proposal=currentElection(s),present=voters(s),spends={},coinResults={};for(const id of present){const values=s.records.personal[id]?.values,available=Number(values?.influence||0),mode=s.records.participants[id];let amount;if(mode==='automa'){const plan=election.autoPlans[id],successes=Number(e.autoCoinSuccesses?.[id]??e.autoSymbols?.[id]??0);requireThat(Number.isSafeInteger(successes)&&successes>=0&&successes<=plan.cards,'50%影響力判定の成功数が不正です');coinResults[id]={attempts:plan.cards,successes};amount=plan.type==='all'?plan.spend:plan.type==='necessary'?plan.spend:plan.type==='draw'?successes:plan.type==='drawAll'?(successes?available:0):plan.type==='necessaryDraw'?plan.spend+successes:0;}else amount=Number(e.spends?.[id]||0);requireThat(Number.isSafeInteger(amount)&&amount>=0&&amount<=available,`${id}の使用影響力が不正です`);spends[id]=Math.min(available,amount);values.influence=available-spends[id];}
  const totals=voteTotals(s,election.sides,election.cubes,spends),passed=totals.favor>=totals.against,winning=passed?'favor':'against',vp={};if(passed){const proposer=s.records.personal[proposal.proposer]?.values;if(proposer){proposer.vp=Number(proposer.vp||0)+3;vp[proposal.proposer]=3;}for(const id of present)if(id!==proposal.proposer&&election.sides[id]==='favor'&&(Number(election.cubes[id]||0)>0||spends[id]>0)){s.records.personal[id].values.vp=Number(s.records.personal[id].values.vp||0)+1;vp[id]=1;}const hadDemo=!!s.records.common?.tokens?.demonstration;s.records=root.WCARecords.applyPolicyChange(s.records,proposal.id,s.positions[proposal.id],proposal.target,s.positions);s.positions[proposal.id]=proposal.target;if(hadDemo&&!s.records.common.tokens.demonstration)withAutoma(s,'Working',()=>{if(s.aside.actions.DEM==='demonstration')place(s,'actions','DEM',0);});updatePolicyPriorities(s,proposal.id,proposal.target);}
  for(const id of ['Working','Middle','Capitalist'])if(election.sides[id]&&election.sides[id]!==winning)s.records.common.values[CUBE_KEYS[id]]-=Number(election.cubes[id]||0);if(!proposal.immediate||proposal.returnBillMarker){const owner=s.records.personal[proposal.proposer]?.values;if(owner)owner.billMarkers=Math.min(3,Number(owner.billMarkers||0)+1);delete s.proposals[proposal.id];if(!passed&&!proposal.immediate)withAutoma(s,proposal.proposer,()=>{s.aside.policies[proposal.id]='bill:resolved';});}election.lastResult={proposal:copy(proposal),sides:copy(election.sides),cubes:copy(election.cubes),spends,coinResults,totals,passed,vp};election.results??=[];election.results.push(copy(election.lastResult));election.current++;if(election.current<election.queue.length){election.step='declare';delete election.sides;delete election.cubes;delete election.autoPlans;}else{const returnPhase=election.returnPhase;s.lastElection=copy(election.lastResult);s.lastElections=copy(election.results);s.phase=returnPhase;delete s.election;if(s.pendingPlayerCard?.kind==='politics'){if(s.pendingPlayerCard.step==='firstVote')s.pendingPlayerCard.step='second';else delete s.pendingPlayerCard;}if(returnPhase==='automaNext')advanceDualTurn(s);else if(returnPhase==='capitalistSingleNext')advanceCapitalistSingleTurn(s);}note=`政策${proposal.id}は${passed?'可決':'否決'}（賛成${totals.favor}・反対${totals.against}）`;break;}
 case 'scoringApply':{requireThat(s.phase==='scoring'&&s.records,'得点計算フェイズではありません');const result=root.WCARecords.applyScoring(s.records);s.records=result.records;s.lastScoring=result.preview;s.phase=s.round===5?'gameEnd':'preparation';note=`得点計算（労働者+${result.preview.Working.vp}VP・資本家+${result.preview.Capitalist.vp}VP）`;break;}
 case 'gameEndApply':{requireThat(s.phase==='gameEnd'&&s.round===5&&s.records,'ゲーム終了時得点ではありません');const result=root.WCARecords.applyGameEnd(s.records,s.positions);s.records=result.records;s.finalScoring=result.preview;s.phase='finished';note=`最終得点を確定（労働者${result.preview.scores.Working}・資本家${result.preview.scores.Capitalist}）`;break;}
 case 'policy':{
  requireThat(['start','card','end','player','production','preparation','roundEnd'].includes(s.phase),'チェック・行動選択中は政策を変更できません');
  const id=e.id;requireThat(/^[1-7]$/.test(id)&&['A','B','C'].includes(e.position),'政策入力が不正です');
 requireThat(['pending','failed','passed','position'].includes(e.result),'投票結果が不正です');const proposal=s.proposals[id];
 if(e.result==='pending'){requireThat(!proposal,'この政策には既に法案があります');requireThat(Math.abs(e.position.charCodeAt(0)-s.positions[id].charCodeAt(0))===1,'法案は現在位置の隣を指定してください');s.proposals[id]={proposer:['Working','Capitalist'].includes(e.proposer)?e.proposer:'other',from:s.positions[id],target:e.position,round:s.round,turn:s.turn};}
  if(e.result==='pending'&&['Working','Capitalist'].includes(e.proposer)&&s.records){const values=s.records.personal[e.proposer].values;requireThat(values.billMarkers>0,'法案マーカーが足りません');values.billMarkers--;}
  if(['position','passed'].includes(e.result)){const target=e.result==='passed'?(proposal?.target||e.position):e.position,hadDemo=!!s.records?.common?.tokens?.demonstration;if(s.records)s.records=root.WCARecords.applyPolicyChange(s.records,id,s.positions[id],target,s.positions);s.positions[id]=target;if(hadDemo&&!s.records.common.tokens.demonstration&&s.aside.actions.DEM==='demonstration')place(s,'actions','DEM',0);}
  const owner=proposal?.proposer,ownPending=['Working','Capitalist'].includes(owner);if(ownPending&&['failed','passed'].includes(e.result)&&s.records){const values=s.records.personal[owner].values;values.billMarkers=Math.min(3,Number(values.billMarkers||0)+1);if(e.result==='passed'){values.vp=Number(values.vp||0)+3;if(e.supporter){const supporter=owner==='Working'?'Capitalist':'Working';s.records.personal[supporter].values.vp=Number(s.records.personal[supporter].values.vp||0)+1;}}if(e.result==='failed')s.aside.policies[id]='bill:resolved';}
  if(['failed','passed'].includes(e.result))delete s.proposals[id];
  if(s.round===5&&id==='7'){aside(s,'policies',id,'finalRound');break;}
  if(e.result==='pending')aside(s,'policies',id,['Working','Capitalist'].includes(e.proposer)?`bill:${e.proposer}`:'bill:other');
  if(e.result==='passed'){
   const desired=priorityDesired(s,id);const distance=Math.abs(e.position.charCodeAt(0)-desired.charCodeAt(0));
   if(!distance)aside(s,'policies',id,'desired');else place(s,'policies',id,distance-1);
  }break;}
 case 'demResolve':{requireThat(['start','card','end'].includes(s.phase),'チェック中は変更できません');requireThat(s.aside.actions.DEM==='demonstration'&&s.records?.common?.tokens?.demonstration,'解決するデモがありません');const result=root.WCARecords.resolveDemonstration(s.records);s.records=result.records;place(s,'actions','DEM',0);note=`生産フェイズのデモ解決（${Object.entries(result.losses).map(([k,v])=>`${k} -${v}VP`).join('、')||'VP減少なし'}${result.unapplied?`、上限により未適用${result.unapplied}VP`:''}）`;break;}
 case 'demReturn':requireThat(['start','card','end'].includes(s.phase),'チェック中は変更できません');requireThat(s.aside.actions.DEM==='demonstration','DEMは除外されていません');if(s.records){s.records.common.tokens??={demonstration:false};s.records.common.tokens.demonstration=false;}place(s,'actions','DEM',0);break;
 case 'strikeAside':requireThat(['start','card','end'].includes(s.phase),'チェック中は変更できません');aside(s,'actions','STR','strikeTokens');break;
 case 'round':
  requireThat(!s.records&&['start','roundEnd'].includes(s.phase)&&s.round<5,'盤面記録があるゲームでは準備フェイズを完了してください');s.round++;s.turn=1;s.phase='start';if(s.aside.actions.STR==='strikeTokens')place(s,'actions','STR',0);for(let i=1;i<=7;i++){const id=String(i);if(s.round===5&&i===7){aside(s,'policies',id,'finalRound');continue;}if(!(id in s.aside.policies))continue;const desired=priorityDesired(s,id),d=Math.abs(s.positions[id].charCodeAt(0)-desired.charCodeAt(0));if(d)place(s,'policies',id,d-1);}note=`ラウンド${s.round}へ`;break;
 case 'preparationTrade':{requireThat(s.phase==='preparation'&&s.round<5&&s.records,'準備フェイズではありません');const count=({A:0,B:1,C:2})[s.positions[6]];s.preparationTrade=root.WCARecords.tradeData(e.value,count,true);note=`輸出カードと商取引カード${count}枚を記録`;break;}
 case 'preparationApply':
  requireThat(['preparation','roundEnd'].includes(s.phase)&&s.round<5&&s.records,'準備フェイズではありません');requireThat(!Object.keys(s.proposals).length,'投票待ちの法案を解決してください');requireThat(e.confirmed===true,'実物カードと全政策の現在位置を確認してください');{const immigrationCount=({A:0,B:1,C:2})[s.positions[7]],dealCount=({A:0,B:1,C:2})[s.positions[6]],automaticImmigration=!!s.immigrationDeck||!Array.isArray(e.plan?.immigration),immigrationCards=automaticImmigration?drawImmigrationCards(s,immigrationCount):null,immigration=immigrationCards?immigrationCards.map(card=>card.Working):e.plan?.immigration||[],trade=s.preparationTrade||drawTradeCards(s,dealCount),result=root.WCARecords.applyPreparation(s.records,s.positions,{...(e.plan||{}),immigration,immigrationCards,trade});s.records=result.records;s.lastPreparation={...result.preview,market:result.market,immigration:result.immigration,immigrationCards:result.immigrationCards,trade:copy(trade)};}if(s.playerCards)root.PlayerCards.replenish(s);s.round++;s.turn=1;s.phase=roundOpeningPhase(s);delete s.production;delete s.preparationTrade;
  {const restore=()=>{if(s.aside.actions.STR==='strikeTokens')place(s,'actions','STR',0);for(let i=1;i<=7;i++){const id=String(i);if(s.round===5&&i===7){aside(s,'policies',id,'finalRound');continue;}if(!(id in s.aside.policies))continue;const desired=priorityDesired(s,id),d=Math.abs(s.positions[id].charCodeAt(0)-desired.charCodeAt(0));if(d)place(s,'policies',id,d-1);}};if(s.automaMode==='Both'){for(const owner of ['Working','Capitalist'])withAutoma(s,owner,restore);activateAutoma(s,'Working');}else restore();}note=`ラウンド${s.round}の準備を反映（利息・繁栄度・新規労働者・市場・カード・優先順位）`;break;
 default:throw Error('不明な操作です');
 }
 if(played){if(played.owner==='Working')s.workingBasicUsed=true;note+=`（${played.definition.name}を手札から捨て札へ）`;}
 s.log.push({at:new Date().toISOString(),turn:s.turn,type:e.type,note,event:copy(e)});storeAutoma(s);validate(s);return s;
}
const api={ACTIONS,CHECKS,initial,capitalistInitial,actionIds,checkIds,copy,rows,rank,locate,move,compress,validate,reduce,refillPlan,emergencyRefillPlan,politicalOptions,validatePlayerPolitics,bagCount,automaStance,voters,voteTotals,currentElection,randomDeck,IMMIGRATION_CARD_DATA,validImmigrationDeck,randomImmigrationDeck,drawImmigrationCards,EXPORT_CARD_DATA,BUSINESS_DEAL_DATA,validTradeDecks,randomTradeDecks,drawTradeCards};root.WCA=api;if(typeof module!=='undefined')module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
