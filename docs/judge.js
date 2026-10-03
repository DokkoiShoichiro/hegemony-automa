(function(root){
'use strict';
const SKILLS=['Gray','Green','Blue','White','Orange','Purple'];
const DESIRED={1:'A',2:'A',3:'A',4:'A',5:'A',6:'C',7:'B'};
const CARD_DATA={
 '1':{order:['AW','BGS','PB','STR'],policies:['1','2'],bonus:'失業労働者を4人まで割り当て、企業へ置いた1人ごとに所有者から4ヴァルディスを得る',bonusType:'assign4Paid',special:'他階級の投票駒を3個引くまで引き、その3個を労働者の駒と交換する',specialType:'replaceVotes',influenceIcons:1},
 '2':{order:['AW','PB','BGS','STR'],policies:['3','1'],bonus:'AW前に可能なら共同農場を1つ設立して労働者を割り当てる',bonusType:'coopFarm',special:'国家から影響力を3個まで各5で購入し、不足1個につき投票駒2個を袋へ入れる',specialType:'buyInfluence',specialLegitimacy:1},
 '3':{order:['BGS','AW','PB','STR'],policies:['1','7'],bonus:'政策4A/Bなら公共サービスだけを購入し、購入前に失業者1人につき国家から5を得る',bonusType:'publicOnlyUnemployedCash',bonusLegitimacy:1,special:'6個引き、労働者の駒を戻し、他階級の駒を除外する',specialType:'removeDrawnVotes',influenceIcons:1},
 '4':{order:['BGS','PB','AW','STR'],policies:['1','6'],bonus:'国家の教育価格を半額（切り上げ）にする',bonusType:'halfEducation',bonusLegitimacy:1,special:'人口と同数の投票駒を袋へ入れる',specialType:'populationVotes'},
 '5':{order:['PB','AW','BGS','STR'],policies:['2','3'],bonus:'法案提議前に投票駒2個を袋へ入れる',bonusType:'proposalVotes',special:'最も多く労働者を雇用する他プレイヤーが15を支払う',specialType:'largestEmployerPays',influenceIcons:1},
 '6':{order:['PB','BGS','AW','STR'],policies:['2','3'],bonus:'影響力を支払わず即時投票を要求する',bonusType:'freeImmediate',special:'可能なら資本家階級に20を支払い5VPを得る',specialType:'payForVp'},
 '7':{order:['AW','BGS','PB','STR'],policies:['2','4'],bonus:'政策7B/CならAW前にサプライから熟練労働者1人を得る',bonusType:'gainSkilled',special:'他階級の投票駒を3個引くまで引き、その3個を労働者の駒と交換する',specialType:'replaceVotes',influenceIcons:1},
 '8':{order:['AW','PB','BGS','STR'],policies:['2','5'],bonus:'政策2Bなら失業者、2Cなら任意の労働者を任意数割り当てる',bonusType:'unlimitedAssign',special:'6個引き、労働者の駒を戻し、他階級の駒を除外する',specialType:'removeDrawnVotes'},
 '9':{order:['BGS','AW','PB','STR'],policies:['2','4'],bonus:'労働者がいる国有教育企業が購入前に1回生産する',bonusType:'publicEducationProduction',special:'国家から影響力を3個まで各5で購入し、不足1個につき投票駒2個を袋へ入れる',specialType:'buyInfluence',specialLegitimacy:1,influenceIcons:1},
 '10':{order:['BGS','PB','AW','STR'],policies:['2','5'],bonus:'国家の健康価格を半額（切り上げ）にする',bonusType:'halfHealth',bonusLegitimacy:1,special:'失業者が4人以上なら2人を取り除いて10を得る',specialType:'removeWorkers'},
 '11':{order:['PB','AW','BGS','STR'],policies:['2','6'],bonus:'希望区画へ直接提議でき、隣接提議の場合だけ即時投票できる',bonusType:'desiredProposal',special:'人口と同数の投票駒を袋へ入れる',specialType:'populationVotes',influenceIcons:1},
 '12':{order:['PB','BGS','AW','STR'],policies:['6','3'],bonus:'法案提議前に投票駒2個を袋へ入れる',bonusType:'proposalVotes',special:'失業者が4人以上なら2人を取り除いて10を得る',specialType:'removeWorkers'},
 '13':{order:['BGS','AW','PB','STR'],policies:['7','2'],bonus:'政策2B/Cなら購入前に雇用中の労働者1人につき国家から1を得る',bonusType:'employedCash',bonusLegitimacy:1,special:'最も多く労働者を雇用する他プレイヤーが15を支払う',specialType:'largestEmployerPays',influenceIcons:1},
 '14':{order:['AW','PB','BGS','STR'],policies:['2','7'],bonus:'AW前に可能なら共同農場を1つ設立して労働者を割り当てる',bonusType:'coopFarm',special:'可能なら資本家階級に20を支払い5VPを得る',specialType:'payForVp'},
 '15':{order:['BGS','AW','PB','STR'],policies:['4','1'],bonus:'政策1A/Bなら他プレイヤーから買う贅沢品費用の半分を国家が支払う',bonusType:'halfLuxury',bonusLegitimacy:1,special:'6個引き、労働者の駒を戻し、他階級の駒を除外する',specialType:'removeDrawnVotes',influenceIcons:1},
 '16':{order:['BGS','PB','AW','STR'],policies:['4','2'],bonus:'労働者がいる国有医療企業が購入前に1回生産する',bonusType:'publicHealthProduction',special:'国家から影響力を3個まで各5で購入し、不足1個につき投票駒2個を袋へ入れる',specialType:'buyInfluence',specialLegitimacy:1},
 '17':{order:['PB','AW','BGS','STR'],policies:['2','6'],bonus:'影響力を支払わず即時投票を要求する',bonusType:'freeImmediate',special:'失業者が4人以上なら2人を取り除いて10を得る',specialType:'removeWorkers',influenceIcons:1},
 '18':{order:['PB','BGS','AW','STR'],policies:['4','5'],bonus:'希望区画へ直接提議でき、隣接提議の場合だけ即時投票できる',bonusType:'desiredProposal',special:'最も多く労働者を雇用する他プレイヤーが15を支払う',specialType:'largestEmployerPays'},
 '19':{order:['AW','BGS','PB','STR'],policies:['4','6'],bonus:'政策2Bなら失業者、2Cなら任意の労働者を任意数割り当てる',bonusType:'unlimitedAssign',special:'可能なら資本家階級に20を支払い5VPを得る',specialType:'payForVp',influenceIcons:1},
 '20':{order:['AW','PB','BGS','STR'],policies:['4','7'],bonus:'政策7B/CならAW前にサプライから熟練労働者1人を得る',bonusType:'gainSkilled',special:'人口と同数の投票駒を袋へ入れる',specialType:'populationVotes'},
 '21':{order:['BGS','AW','PB','STR'],policies:['5','1'],bonus:'国家の健康価格を半額（切り上げ）にする',bonusType:'halfHealth',bonusLegitimacy:1,special:'他階級の投票駒を3個引くまで引き、その3個を労働者の駒と交換する',specialType:'replaceVotes',influenceIcons:1},
 '22':{order:['BGS','PB','AW','STR'],policies:['5','2'],bonus:'政策2B/Cなら購入前に雇用中の労働者1人につき国家から1を得る',bonusType:'employedCash',bonusLegitimacy:1,special:'失業者が4人以上なら2人を取り除いて10を得る',specialType:'removeWorkers'},
 '23':{order:['PB','AW','BGS','STR'],policies:['5','3'],bonus:'法案提議前に投票駒2個を袋へ入れる',bonusType:'proposalVotes',special:'国家から影響力を3個まで各5で購入し、不足1個につき投票駒2個を袋へ入れる',specialType:'buyInfluence',specialLegitimacy:1,influenceIcons:1},
 '24':{order:['PB','BGS','AW','STR'],policies:['5','4'],bonus:'可能なら法案を2つ提議する',bonusType:'twoProposals',special:'最も多く労働者を雇用する他プレイヤーが15を支払う',specialType:'largestEmployerPays'},
 '25':{order:['BGS','AW','PB','STR'],policies:['5','6'],bonus:'政策4A/Bなら公共サービスだけを購入し、購入前に失業者1人につき国家から5を得る',bonusType:'publicOnlyUnemployedCash',bonusLegitimacy:1,special:'失業者が4人以上なら2人を取り除いて10を得る',specialType:'removeWorkers',influenceIcons:1},
 '26':{order:['AW','PB','BGS','STR'],policies:['5','7'],bonus:'失業労働者を4人まで割り当て、企業へ置いた1人ごとに所有者から4ヴァルディスを得る',bonusType:'assign4Paid',special:'6個引き、労働者の駒を戻し、他階級の駒を除外する',specialType:'removeDrawnVotes'},
 '27':{order:['BGS','AW','PB','STR'],policies:['4','3'],bonus:'国家の教育価格を半額（切り上げ）にする',bonusType:'halfEducation',bonusLegitimacy:1,special:'他階級の投票駒を3個引くまで引き、その3個を労働者の駒と交換する',specialType:'replaceVotes',influenceIcons:1},
 '28':{order:['BGS','PB','AW','STR'],policies:['6','1'],bonus:'政策1A/Bなら他プレイヤーから買う贅沢品費用の半分を国家が支払う',bonusType:'halfLuxury',bonusLegitimacy:1,special:'人口と同数の投票駒を袋へ入れる',specialType:'populationVotes'},
 '29':{order:['PB','AW','BGS','STR'],policies:['6','2'],bonus:'可能なら法案を2つ提議する',bonusType:'twoProposals',special:'可能なら資本家階級に20を支払い5VPを得る',specialType:'payForVp',influenceIcons:1},
 '30':{order:['PB','BGS','AW','STR'],policies:['6','7'],bonus:'法案提議前に投票駒2個を袋へ入れる',bonusType:'proposalVotes',special:'国家から影響力を3個まで各5で購入し、不足1個につき投票駒2個を袋へ入れる',specialType:'buyInfluence',specialLegitimacy:1}
};
const SAMPLE_CARDS=Object.fromEntries(Object.entries(CARD_DATA).map(([id,c])=>[id,{order:c.order,policies:c.policies}]));
const fresh=()=>({status:'ready',movements:[],reasons:[],questions:[],warnings:[],source:'Word転記「各チェック」'});
const LABELS={AW:'労働者の割り当て',BGS:'商品・サービスの購入',STR:'ストライキ',DEM:'デモ',SA:'特殊アクション',PB:'法案の提議'};
const FOREIGN_BASE={food:10,luxury:6},FOREIGN_TARIFF={A:{food:10,luxury:6},B:{food:5,luxury:3},C:{food:0,luxury:0}};
const foreignMarketPrice=(resource,policy6)=>FOREIGN_BASE[resource]+FOREIGN_TARIFF[policy6][resource];
const add=(o,series,card,up,why)=>{if(up>0){o.movements.push({series,card,up});o.reasons.push(`${series==='policies'?'政策'+card:LABELS[card]}を${up}段上げる：${why}`);}};
const ask=(o,id,label,type='number',extra={})=>{if(!o.questions.some(q=>q.id===id))o.questions.push({id,label,type,...extra});o.status='needsInput';};
const warn=(o,message)=>{o.warnings.push(message);if(o.status==='ready')o.status='needsReview';};
const defs=()=>Object.fromEntries([...(root.WCA_COMPANIES||[]),...(root.WCA_EXTRA_COMPANIES||[])].map(d=>[d.id,d]));
function immediateVote2P(s,alreadySpent=0){
 const r=s.records,w=r?.personal?.Working?.values||{},opponent=r?.personal?.Capitalist?.values||{},outside=r?.common?.values||{};
 const card=CARD_DATA[String(s.card?.number||'')];
 if(card?.bonusType==='freeImmediate')return {possible:true,cost:0,reason:`カード#${s.card.number}のボーナスにより、影響力を支払わず即時投票を要求`};
 const values=[w.influence,opponent.influence,outside.workingVotesOutside,outside.capitalistVotesOutside];
 if(values.some(x=>x==null))return {possible:null,reason:'両階級の影響力と袋の外の投票駒が未確認'};
 const bonus=card?.bonusType==='proposalVotes'?2:0,workingBag=25-Math.max(0,Number(outside.workingVotesOutside)-bonus),opponentBag=25-Number(outside.capitalistVotesOutside);
 const callCost=1,after=Number(w.influence)-Number(alreadySpent)-callCost,influenceOk=after>Number(opponent.influence),votesOk=workingBag>=opponentBag;
 return {possible:influenceOk&&votesOk,cost:callCost,reason:`即時投票費用${callCost}の支払い後の影響力 ${after} 対 ${Number(opponent.influence)}、袋内投票駒 ${workingBag} 対 ${opponentBag}${bonus?`（カード#${s.card.number}の2個を反映）`:''}`};
}
function inspectCard(s,o){const number=String(s.card?.number||''),c=SAMPLE_CARDS[number];if(c&&(c.order.join()!==s.card.order.join()||c.policies.join()!==s.card.policies.join()))warn(o,`カード#${s.card.number}の転記と入力内容が一致しません。`);if(s.index===0&&!CARD_DATA[number]&&s.card?.bonus?.trim()&&!/^(なし|無し|none|-|－)$/i.test(s.card.bonus.trim()))warn(o,'入力されたボーナスの判定への影響は未対応です。');}
function policyCheck(s,a){const o=fresh(),r=s.records,card=CARD_DATA[String(s.card?.number||'')]||{},freeImmediate=card.bonusType==='freeImmediate';let markers=r?.personal?.Working?.values?.billMarkers;if(markers==null&&a.billMarkers===undefined&&!freeImmediate)ask(o,'billMarkers','利用可能な政策マーカー','number',{min:0,max:3});else markers=Number(markers??a.billMarkers??0);const eligible={};for(const id of s.card.policies){eligible[id]=!(id in s.aside.policies)&&(markers>0||freeImmediate);if(s.round===5&&id==='7')eligible[id]=false;if(s.round===5&&id==='6'){const iv=immediateVote2P(s);if(iv.possible===null&&a.immediateVote===undefined)ask(o,'immediateVote','政策6で即時投票を行える','boolean');else eligible[id]=eligible[id]&&(iv.possible??a.immediateVote);o.reasons.push(`政策6の即時投票：${iv.reason}`);}}if(o.questions.length){inspectCard(s,o);return o;}let any=false;for(const id of s.card.policies){if(!eligible[id]){o.reasons.push(`政策${id}：提議不可または優先カードが脇`);continue;}any=true;const distance=Math.abs(s.positions[id].charCodeAt(0)-DESIRED[id].charCodeAt(0));let up=distance===1?1:distance===2?2:0;if(id==='2')up++;if(up){add(o,'actions','PB',up,`政策${id} ${s.positions[id]}、希望${DESIRED[id]}`);add(o,'policies',id,up,'PBと同じ段数');}else o.reasons.push(`政策${id}：希望位置のため移動なし`);}if(!any)add(o,'actions','SA',1,'2政策とも提議できない');inspectCard(s,o);return o;}
function wage(def,c,s){return def?.wages&&s.records.participants?.[def.class]!=='human'?({A:'L3',B:'L2',C:'L1'})[s.positions[2]]:c.wage;}
function strikeCheck(s){const o=fresh(),r=s.records,map=defs();let eligible=0;const unknown=[];for(const [id,c] of Object.entries(r.companies||{})){if(c.status!=='built')continue;const d=map[id];if(!d||!c.slots.some(x=>x.owner==='Working'))continue;const w=wage(d,c,s);if(c.slots.some(x=>x.owner==='unknown')||w==='unknown'){unknown.push(d.name_jp);continue;}const stateAllowed=d.class!=='State'||r.participants.State==='human';if(stateAllowed&&!c.strike&&!c.slots.some(x=>x.committed)&&w!=='L3')eligible++;}if(unknown.length)warn(o,`企業情報が未確認です：${[...new Set(unknown)].join('、')}`);const unions=Object.values(r.personal?.Working?.unions||{}).filter(Boolean).length,pos=s.positions[2];o.reasons.push(`労働市場${pos}、組合${unions}、ストライキ可能企業${eligible}`);if(pos==='B'&&unions>=2)add(o,'actions','STR',Math.floor(eligible/3),'可能企業3社ごと');if(pos==='C'){add(o,'actions','STR',Math.floor(eligible/2),'可能企業2社ごと');add(o,'policies','2',1,'労働市場がC');}inspectCard(s,o);return o;}
function purchase(source,qty){const cost=qty*Number(source.sellerPrice??source.price),subsidy=source.halfSubsidy?Math.floor(cost/2):0;return {source:source.source,key:source.key,qty,cost,workerCost:cost-subsidy,...(source.tariff?{stateTariff:qty*source.tariff}:{})};}
function cheapest(sources,qty){let best=null;for(let i=0;i<sources.length;i++)for(let j=i;j<sources.length;j++){if(i===j){if(sources[i].stock<qty)continue;const purchases=[purchase(sources[i],qty)],cost=purchases[0].cost,workerCost=purchases[0].workerCost,candidate={cost,workerCost,from:[`${sources[i].name} ${qty}`],purchases};if(!best||workerCost<best.workerCost)best=candidate;continue;}for(let x=Math.min(qty,sources[i].stock);x>=0;x--){const y=qty-x;if(y<0||y>sources[j].stock)continue;const purchases=[purchase(sources[i],x),purchase(sources[j],y)].filter(v=>v.qty),cost=purchases.reduce((n,p)=>n+p.cost,0),workerCost=purchases.reduce((n,p)=>n+p.workerCost,0),candidate={cost,workerCost,from:[`${sources[i].name} ${x}`,`${sources[j].name} ${y}`].filter(v=>!v.endsWith(' 0')),purchases};if(!best||workerCost<best.workerCost)best=candidate;}}return best;}
const employed=r=>Object.values(r.companies||{}).reduce((n,c)=>n+(c.status==='built'?c.slots.filter(x=>x.owner==='Working').length:0),0);
function goodsCheck(s,a){
 const o=fresh(),r=JSON.parse(JSON.stringify(s.records)),w=r.personal?.Working?.values||{};
 for(const [id,label] of [['population','人口'],['cash','資金'],['health','所持する健康'],['education','所持する教育'],['luxury','所持する贅沢品']]){if(w[id]==null&&a[id]===undefined)ask(o,id,label,'number',{min:0});else if(w[id]==null)w[id]=Number(a[id]);}
 if(r.participants.Middle!=='absent')warn(o,'中産階級の在庫と価格はまだ自動判定に対応していません。');if(o.questions.length){inspectCard(s,o);return o;}
 const result=goodsPlans({...s,records:r});if(result.publicBonus)o.reasons.push(`カード#${s.card.number}：対象国有企業${result.publicBonus.items.length}社の生産と賃金${result.publicBonus.wages}を判定に反映`);let possible=0;
 for(const p of result.plans){possible++;const effective=Math.max(0,p.workerCost-p.bonusCash),unit=p.qty?effective/p.qty:Infinity,up=effective===0?3:unit<=6?2:1;add(o,'actions','BGS',up,`${p.label}${p.qty}個、${p.from.join('＋')}、実質${effective}（単価${unit.toFixed(2)}）`);}
 if(!possible)add(o,'actions','SA',1,'購入条件を満たす商品・サービスがない');inspectCard(s,o);return o;
}
function pool(r){return Object.fromEntries(SKILLS.map(k=>[k,Number(r.common?.unemployed?.Working?.[k]||0)]));}
function fill(d,p){if(d.workers.some(x=>x.type==='MiddleClass'))return null;function walk(i,left){if(i===d.workers.length)return left;const slot=d.workers[i],choices=slot.type==='Skilled'?[slot.color]:SKILLS;for(const skill of choices)if(left[skill]>0){const done=walk(i+1,{...left,[skill]:left[skill]-1});if(done)return done;}return null;}return walk(0,{...p});}
function fillOptions(d,p){if(d.workers.some(x=>x.type==='MiddleClass'))return [];const found=[];function walk(i,left){if(i===d.workers.length){found.push(left);return;}const slot=d.workers[i],choices=slot.type==='Skilled'?[slot.color]:SKILLS;for(const skill of choices)if(left[skill]>0)walk(i+1,{...left,[skill]:left[skill]-1});}walk(0,{...p});return [...new Map(found.map(x=>[JSON.stringify(x),x])).values()];}
const UNION_SKILL={Food:'Green',Luxury:'Blue',Health:'White',Education:'Orange',Media:'Purple'};
function unionRange(r,map,p,candidates){const counts=Object.fromEntries(Object.keys(UNION_SKILL).map(k=>[k,0]));for(const [id,c] of Object.entries(r.companies||{})){const d=map[id];if(c.status==='built'&&d)counts[d.industry]=(counts[d.industry]||0)+c.slots.filter(x=>x.owner==='Working').length;}let lower=0;function score(left,added,used){const eligible=Object.entries(UNION_SKILL).filter(([industry,skill])=>!r.personal?.Working?.unions?.[industry]&&(counts[industry]||0)+(added[industry]||0)>=4&&left[skill]>0).length;lower=Math.max(lower,Math.min(eligible,3-used));}function plans(start,left,used,added){score(left,added,used);for(let i=start;i<candidates.length;i++){const d=candidates[i],cost=d.workers.length;if(used+cost>2)continue;for(const next of fillOptions(d,left))plans(i+1,next,used+cost,{...added,[d.industry]:(added[d.industry]||0)+cost});}}plans(0,p,0,{});
 const available=Object.values(p).reduce((n,x)=>n+Number(x||0),0),costs=[];for(const [industry,skill] of Object.entries(UNION_SKILL)){if(r.personal?.Working?.unions?.[industry])continue;const empty=candidates.filter(d=>d.industry===industry).reduce((n,d)=>n+d.workers.length,0),need=Math.max(0,4-(counts[industry]||0));let skilled=p[skill]>0;if(!skilled&&p.Gray>0)skilled=Object.entries(r.companies||{}).some(([id,c])=>{const d=map[id];return c.status==='built'&&d&&c.slots.some((x,i)=>x.owner==='Working'&&x.skill===skill&&d.workers[i]?.type==='Unskilled');});if(need<=2&&empty>=need&&skilled&&need+1<=available)costs.push(need+1);}let upper=0;function choose(i,total,n){upper=Math.max(upper,n);for(let k=i;k<costs.length;k++)if(total+costs[k]<=3&&total+costs[k]<=available)choose(k+1,total+costs[k],n+1);}choose(0,0,0);return {lower,upper};}
function workersCheck(s,a){
 const o=fresh(),base=s.records,map=defs(),card=CARD_DATA[String(s.card?.number||'')]||{},active=s.index===0&&s.card.order[0]==='AW',unlimited=card.bonusType==='unlimitedAssign'&&active&&['B','C'].includes(s.positions[2]),paidFour=card.bonusType==='assign4Paid'&&active&&['B','C'].includes(s.positions[2]),limit=unlimited?Infinity:paidFour?4:3,scenarios=[];
 const addScenario=(records,note='')=>scenarios.push({records,p:pool(records),note});
 if(active&&card.bonusType==='gainSkilled'&&['B','C'].includes(s.positions[7])){
  for(const skill of SKILLS.filter(x=>x!=='Gray')){const r=JSON.parse(JSON.stringify(base));r.common.unemployed.Working[skill]=Number(r.common.unemployed.Working[skill]||0)+1;addScenario(r,`熟練${skill}を1人追加`);}
 }else if(active&&card.bonusType==='coopFarm'){
  const farm=Object.values(map).find(d=>d.class==='Working'&&d.tags?.includes('Card_Effect_Build')&&['unbuilt','discarded'].includes(base.companies[d.id]?.status)),start=pool(base),options=farm?fillOptions(farm,start):[];
  for(const left of options){const r=JSON.parse(JSON.stringify(base)),used=Object.fromEntries(SKILLS.map(skill=>[skill,start[skill]-left[skill]]));r.common.unemployed.Working={...left};const c=r.companies[farm.id];c.status='built';c.operating='yes';c.strike=false;const placed=[];for(const skill of SKILLS)for(let n=0;n<used[skill];n++)placed.push(skill);c.slots=placed.map(skill=>({owner:'Working',skill,committed:true}));addScenario(r,'共同農場を設立・配置');}
  if(!scenarios.length)addScenario(base,'共同農場を設立できない');
 }else addScenario(base);
 let maxHire=0,unionLower=0,unionUpper=0,unemployed=0,slots=0,swaps=0;
 for(const scenario of scenarios){const r=scenario.records,p=scenario.p,candidates=[];let scenarioSlots=0,scenarioSwaps=0;for(const [id,c] of Object.entries(r.companies||{})){if(c.status!=='built')continue;const d=map[id];if(!d)continue;for(let i=0;i<c.slots.length;i++)if(d.workers[i]?.type==='Unskilled'&&c.slots[i].owner==='Working'&&c.slots[i].skill!=='Gray')scenarioSwaps++;if(c.slots.every(x=>x.owner==='empty')&&d.workers.every(x=>x.type!=='MiddleClass')){scenarioSlots+=c.slots.length;if(c.slots.length<=3&&fill(d,p))candidates.push(d);}}
  let scenarioHire=0;function choose(i,left,total){scenarioHire=Math.max(scenarioHire,total);for(let k=i;k<candidates.length;k++){const d=candidates[k];if(total+d.workers.length>limit)continue;const next=fill(d,left);if(next)choose(k+1,next,total+d.workers.length);}}choose(0,p,0);const unions=unionRange(r,map,p,candidates);maxHire=Math.max(maxHire,scenarioHire);unionLower=Math.max(unionLower,unions.lower);unionUpper=Math.max(unionUpper,unions.upper);unemployed=Math.max(unemployed,Object.values(p).reduce((x,y)=>x+y,0));slots=Math.max(slots,scenarioSlots);swaps=Math.max(swaps,scenarioSwaps);
 }
 const bonusApplied=active&&['gainSkilled','coopFarm'].includes(card.bonusType);if(swaps&&scenarios.some(x=>x.p.Gray>0))warn(o,`Swap Workersの候補が${Math.min(swaps,Math.max(...scenarios.map(x=>x.p.Gray)))}人います。入れ替え後の盤面を記録してください。`);if(maxHire>=2)add(o,'actions','AW',maxHire,`失業者を最大${maxHire}人雇用できる${unlimited||paidFour||bonusApplied?`（カード#${s.card.number}のボーナス反映後）`:''}`);const unions={lower:unionLower,upper:unionUpper};if(unions.lower===unions.upper){if(unions.lower)add(o,'actions','AW',2*unions.lower,`1回の割り当てで設立できる組合${unions.lower}個`);else o.reasons.push('設立できる労働組合なし');}else if(a.simultaneousUnions===undefined)ask(o,'simultaneousUnions','再配置を含めて設立できる労働組合の最大数','number',{min:unions.lower,max:unions.upper});else{const n=Math.max(unions.lower,Math.min(unions.upper,Number(a.simultaneousUnions)));if(n)add(o,'actions','AW',2*n,`設立できる労働組合${n}個`);}const gap=Math.max(0,unemployed-slots);if(gap)add(o,'actions','DEM',gap,`失業者${unemployed}－空きスロット${slots}`);if(!o.questions.length&&!o.movements.some(x=>x.card==='AW')&&o.status==='ready')add(o,'actions','SA',1,'AW条件なし');o.reasons.push(`${bonusApplied?'ボーナス反映後：':''}失業者${unemployed}、空きスロット${slots}、最大雇用${maxHire}`);inspectCard(s,o);return o;
}

const actionResult=(action,feasible,summary,targets=[],reasons=[],warnings=[],plan=null)=>({action,feasible,status:feasible===null?'needsReview':feasible?'ready':'infeasible',summary,targets,reasons,warnings,plan,source:'Word転記「アクションの詳細」'});
function policyAction(s){
 const r=s.records,w=r.personal?.Working?.values||{},markers=w.billMarkers,card=CARD_DATA[String(s.card?.number||'')]||{};
 const freeImmediate=card.bonusType==='freeImmediate';
 if(markers==null&&!freeImmediate)return actionResult('PB',null,'利用可能な法案マーカーを記録してください。');
 if(markers<1&&!freeImmediate)return actionResult('PB',false,'利用可能な法案マーカーがありません。');
 const candidates=[],warnings=[];
 for(const id of root.WCA.rank(s,'policies')){
  if(id in s.aside.policies)continue;
  const current=s.positions[id],desired=DESIRED[id],distance=Math.abs(current.charCodeAt(0)-desired.charCodeAt(0));
  if(!distance)continue;
  if(s.round===5&&id==='7')continue;
  const target=card.bonusType==='desiredProposal'?desired:String.fromCharCode(current.charCodeAt(0)+(desired>current?1:-1));
  candidates.push({id,current,target,distance});
 }
 if(!candidates.length)return actionResult('PB',false,'提議できる政策がありません。',[],['政策優先カード、法案マーカー、第5ラウンド制限を確認']);
 const limit=card.bonusType==='twoProposals'?2:1,chosen=[];let available=Number(markers??0),spent=0;
 for(const candidate of candidates){if(chosen.length>=limit||available<1&&!freeImmediate)break;const iv=immediateVote2P(s,spent),canImmediate=card.bonusType!=='desiredProposal'||candidate.distance===1;if(s.round===5&&candidate.id==='6'){if(iv.possible===null)return actionResult('PB',null,`政策6の即時投票条件を判定できません：${iv.reason}`);if(!iv.possible||!canImmediate)continue;}if(iv.possible===null&&canImmediate)warnings.push(`政策${candidate.id}の即時投票は未判定：${iv.reason}`);const selected={...candidate,immediate:canImmediate&&iv.possible===true,immediateCost:canImmediate&&iv.possible===true?iv.cost:0,immediateReason:canImmediate?iv.reason:'希望区画が隣接していないため即時投票不可'};chosen.push(selected);if(selected.immediate)spent+=selected.immediateCost;else available--;}
 if(!chosen.length)return actionResult('PB',false,'提議できる政策がありません。',[],['法案マーカーと即時投票条件を確認']);
 const targets=chosen.map(x=>`政策${x.id}：${x.current} → ${x.target}${x.immediate?'（即時投票）':''}`);
 if(limit===2&&chosen.length<2)warnings.push(`カード#${s.card.number}の2件目は提議可能な政策または法案マーカーがありません。`);
 if(card.bonusType==='proposalVotes')warnings.push('提議前に労働者の投票駒2個を袋へ追加します。');
 const plan={action:'PB',bonusVotes:card.bonusType==='proposalVotes'?2:0,proposals:chosen.map(x=>({id:x.id,from:x.current,target:x.target,immediate:x.immediate,immediateCost:x.immediateCost}))};
 return actionResult('PB',true,`${targets.join('、')}を提議します。`,targets,['政策優先順の上から選択',...chosen.filter(x=>x.immediate).map(x=>`即時投票：${x.immediateReason}`)],warnings,plan);
}
function goodsPlans(s){
 const number=String(s.card?.number||''),card=CARD_DATA[number]||{},industry=card.bonusType==='publicEducationProduction'?'Education':card.bonusType==='publicHealthProduction'?'Health':null,publicBonus=industry&&s.card?.order?.[0]==='BGS'?root.WCARecords?.applyPublicCompanyBonus?.(s.records,industry):null,r=publicBonus?.records||s.records,w=r.personal?.Working?.values||{},cap=r.personal?.Capitalist?.values||{},population=w.population,cash=w.cash,publicOnly=card.bonusType==='publicOnlyUnemployedCash'&&['A','B'].includes(s.positions[4]),unemployed=Object.values(r.common.unemployed?.Working||{}).reduce((n,x)=>n+Number(x||0),0),bonusCash=card.bonusType==='employedCash'&&['B','C'].includes(s.positions[2])?employed(r):publicOnly?unemployed*5:0;
 if([population,cash,w.health,w.education,w.luxury,w.workerCount].some(x=>x==null))return {unknown:true,plans:[]};
 const plans=[];
 for(const [key,label,resource] of [['health','健康','Health'],['education','教育','Education'],['luxury','贅沢品','Luxury']]){
  if(publicOnly&&resource==='Luxury')continue;
  const held=Number(w[key]),qty=held===Number(population)?Number(population):Math.max(0,Number(population)-held),sources=[];
  if(!qty)continue;
  if(resource!=='Luxury'){let price=({A:0,B:5,C:10})[s.positions[resource==='Health'?4:5]];if(card.bonusType===`half${resource}`)price=Math.ceil(price/2);sources.push({name:'国家',source:'State',key,stock:Number(r.common.values?.[key]||0),price});}
  if(resource==='Luxury')sources.push({name:`海外市場（基本6＋関税${FOREIGN_TARIFF[s.positions[6]].luxury}）`,source:'Foreign',key,stock:Infinity,price:foreignMarketPrice('luxury',s.positions[6]),tariff:FOREIGN_TARIFF[s.positions[6]].luxury});
  if(!publicOnly&&cap[key]!=null&&cap[`${key}Price`]!=null){const full=Number(cap[`${key}Price`]),half=resource==='Luxury'&&card.bonusType==='halfLuxury'&&['A','B'].includes(s.positions[1]);sources.push({name:'資本家',source:'Capitalist',key,stock:Number(cap[key]),price:full,halfSubsidy:half});}
  if(publicOnly)for(let i=sources.length-1;i>=0;i--)if(sources[i].source!=='State')sources.splice(i,1);
  const plan=cheapest(sources,qty);if(plan&&plan.workerCost<=Number(cash)+bonusCash){const subsidy=plan.cost-plan.workerCost,usesState=plan.purchases.some(p=>p.source==='State'),legitimacy=card.bonusLegitimacy&&(bonusCash>0||publicOnly||subsidy>0||card.bonusType==='halfHealth'&&resource==='Health'&&usesState||card.bonusType==='halfEducation'&&resource==='Education'&&usesState)?card.bonusLegitimacy:0;plans.push({key,label,qty,bonusCash,sources,...plan,stateSubsidy:subsidy,bonusLegitimacy:legitimacy,unit:Math.max(0,plan.workerCost-bonusCash)/qty});}
 }
 return {unknown:false,plans,publicBonus:publicBonus?.preview||null,publicProductionIndustry:industry};
}
function goodsAction(s){
 const r=s.records,w=r.personal?.Working?.values||{},result=goodsPlans(s);
 if(result.unknown)return actionResult('BGS',null,'人口・資金・所持資源を個人ボードへ記録してください。');
 if(r.participants.Middle!=='absent')return actionResult('BGS',null,'中産階級の販売在庫・価格が未対応です。',[],[],['現物で購入先を確認してください。']);
 let plans=result.plans;
 if(!plans.length)return actionResult('BGS',false,'繁栄度上昇に必要な商品・サービスを購入できません。');
 const gray=Number(r.common.unemployed?.Working?.Gray||0),healthRaisesPopulation=w.workerCount!=null&&Math.ceil((Number(w.workerCount)+1)/4)>Number(w.population);
 if(healthRaisesPopulation&&plans.some(x=>x.key!=='health'))plans=plans.filter(x=>x.key!=='health');
 const order={health:0,education:1,luxury:2};
 plans.sort((a,b)=>(a.workerCost===0?0:1)-(b.workerCost===0?0:1)||(gray>=3&&a.key==='education'?-1:gray>=3&&b.key==='education'?1:0)||a.unit-b.unit||order[a.key]-order[b.key]);
 let p={...plans[0],from:[...plans[0].from],purchases:plans[0].purchases.map(x=>({...x}))};
 if(p.purchases.length===1){
  const used=p.purchases[0].source,remaining=Number(w.cash)+p.bonusCash-p.workerCost,extra=p.sources.find(x=>x.source!==used&&x.stock>=Number(w.population)&&purchase(x,Number(w.population)).workerCost<=remaining);
  if(extra){const qty=Number(w.population),added=purchase(extra,qty);p={...p,qty:p.qty+qty,cost:p.cost+added.cost,workerCost:p.workerCost+added.workerCost,stateSubsidy:p.stateSubsidy+added.cost-added.workerCost,from:[...p.from,`${extra.name} ${qty}`],purchases:[...p.purchases,added]};}
 }
 const target=`${p.label}${p.qty}個：${p.from.join('＋')}、支払${p.workerCost}${p.stateSubsidy?`（国家負担${p.stateSubsidy}）`:''}`;
 const plan={action:'BGS',resource:p.key,qty:p.qty,cost:p.cost,workerCost:p.workerCost,stateSubsidy:p.stateSubsidy||0,bonusCash:p.bonusCash||0,bonusLegitimacy:(p.bonusLegitimacy||p.stateSubsidy)?CARD_DATA[String(s.card.number)]?.bonusLegitimacy||0:0,purchases:p.purchases,publicProduction:!!result.publicBonus,publicProductionIndustry:result.publicProductionIndustry};
 const bonusNotes=[];if(p.bonusCash)bonusNotes.push(`カード#${s.card.number}により購入前に${p.bonusCash}を受け取ります。`);if(p.stateSubsidy)bonusNotes.push(`国家が購入費のうち${p.stateSubsidy}を負担します。`);if(result.publicBonus)bonusNotes.push(`カード#${s.card.number}により対象国有企業${result.publicBonus.items.length}社が先に生産し、賃金${result.publicBonus.wages}と公共サービスを反映します。`);
 return actionResult('BGS',true,`${target}を購入します。`,[target],[healthRaisesPopulation?'人口増加につながる健康を候補から除外':'購入優先順を適用'],bonusNotes,plan);
}
function strikeCandidates(s){
 const r=s.records,map=defs(),counts={};
 for(const [id,c] of Object.entries(r.companies||{})){const d=map[id];if(c.status==='built'&&d&&c.operating==='yes')counts[`${d.class}|${d.industry}`]=(counts[`${d.class}|${d.industry}`]||0)+1;}
 const industry={Media:0,Health:1,Education:2,Luxury:3,Food:4},wages={L1:1,L2:2,L3:3},list=[];
 for(const [id,c] of Object.entries(r.companies||{})){const d=map[id];if(c.status!=='built'||!d||!c.slots.some(x=>x.owner==='Working'))continue;const level=wage(d,c,s),unknown=c.slots.some(x=>x.owner==='unknown')||level==='unknown';if(unknown)return {unknown:true,list:[]};const allowed=d.class!=='State'||r.participants.State==='human';if(allowed&&!c.strike&&!c.slots.some(x=>x.committed)&&level!=='L3')list.push({id,name:d.name_jp,machinery:c.machinery,only:counts[`${d.class}|${d.industry}`]===1,wage:level,industry:d.industry,production:Number(d.production?.amount||0)});}
 const compare=(a,b)=>Number(b.machinery)-Number(a.machinery)||Number(b.only)-Number(a.only)||wages[a.wage]-wages[b.wage]||industry[a.industry]-industry[b.industry]||b.production-a.production,randomRank=id=>{let h=2166136261;for(const ch of `${s.round}|${s.turn}|${s.card?.number}|STR|${id}`){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;};list.sort((a,b)=>compare(a,b)||randomRank(a.id)-randomRank(b.id));
 return {unknown:false,list,compare};
}
function strikeAction(s){
 const r=s.records,pos=s.positions[2],unions=Object.values(r.personal?.Working?.unions||{}).filter(Boolean).length,c=strikeCandidates(s);
 if(c.unknown)return actionResult('STR',null,'労働者がいる企業の賃金または労働者情報が未確認です。');
 if(!(pos==='C'||pos==='B'&&unions>=2))return actionResult('STR',false,`労働市場${pos}・労働組合${unions}個のため実行できません。`);
 if(c.list.length<2)return actionResult('STR',false,`ストライキ可能企業は${c.list.length}社です（2社必要）。`,c.list.map(x=>x.name));
 const targets=c.list.slice(0,2).map(x=>x.name);
 return actionResult('STR',true,`${targets.join('、')}にストライキします。`,targets,[`ストライキ可能企業${c.list.length}社から優先基準で選択`,`全基準で同点の場合はアプリが保存中の手番情報から抽選`],[],{action:'STR',companyIds:c.list.slice(0,2).map(x=>x.id)});
}
function fillPlan(d,p){if(d.workers.some(x=>x.type==='MiddleClass'))return null;function walk(i,left,slots){if(i===d.workers.length)return {left,slots};const slot=d.workers[i],choices=slot.type==='Skilled'?[slot.color]:SKILLS;for(const skill of choices)if(left[skill]>0){const done=walk(i+1,{...left,[skill]:left[skill]-1},[...slots,{index:i,skill}]);if(done)return done;}return null;}return walk(0,{...p},[]);}
function unlimitedWorkerAction(s,standard=false){
 const r=s.records,map=defs(),policy=standard?'B':s.positions[2];
 if(!standard&&!['B','C'].includes(policy))return null;
 if(r.participants?.Middle!=='absent')return actionResult('AW',null,`${standard?'通常の割り当て':`カード#${s.card.number}の再配置`}は、現在の自動処理では2人用盤面だけに対応しています。`);
 const companies=[];let serial=0;
 const tokens=[];
 for(const skill of SKILLS)for(let i=0;i<Number(r.common.unemployed.Working?.[skill]||0);i++)tokens.push({id:`u${serial++}`,skill,origin:'unemployed'});
 for(const [id,c] of Object.entries(r.companies||{})){
  const d=map[id];if(c.status!=='built'||!d||d.workers.some(x=>x.type==='MiddleClass')||c.slots.some(x=>!['Working','empty'].includes(x.owner)))continue;
  const fixed={};
  for(let i=0;i<c.slots.length;i++)if(c.slots[i].owner==='Working'){
   if(policy==='B'||c.slots[i].committed)fixed[i]=c.slots[i].skill;
   else tokens.push({id:`c${serial++}`,skill:c.slots[i].skill,origin:'company',companyId:id,index:i});
  }
  companies.push({id,c,d,fixed});
 }
 const available=Object.fromEntries(SKILLS.map(skill=>[skill,tokens.filter(t=>t.skill===skill).length]));
 let considerLayout=()=>{};
 function options(x,left){
  const result=[];if(!Object.keys(x.fixed).length)result.push(Array(x.c.slots.length).fill(null));
  function fillSlots(i,next,slots){
   if(i===x.c.slots.length){result.push(slots);return;}
   if(x.fixed[i]){fillSlots(i+1,next,[...slots,x.fixed[i]]);return;}
   const req=x.d.workers[i],choices=req?.type==='Skilled'?[req.color]:SKILLS;
   for(const skill of choices)if(next[skill]>0){next[skill]--;fillSlots(i+1,next,[...slots,skill]);next[skill]++;}
  }
  fillSlots(0,{...left},[]);
  return [...new Map(result.map(v=>[JSON.stringify(v),v])).values()];
 }
 function walk(i,left,chosen){
  if(i===companies.length){considerLayout({left:{...left},chosen});return;}
  const x=companies[i];for(const slots of options(x,left)){
   const next={...left};let ok=true;for(let k=0;k<slots.length;k++)if(slots[k]&&!x.fixed[k]&&--next[slots[k]]<0){ok=false;break;}
   if(ok)walk(i+1,next,[...chosen,slots]);
  }
 }
 const beforeIndustry=Object.fromEntries(Object.keys(UNION_SKILL).map(k=>[k,0]));for(const x of companies)beforeIndustry[x.d.industry]+=x.c.slots.filter(v=>v.owner==='Working').length;
 const wageRank={unknown:0,L1:1,L2:2,L3:3},industryRank={Food:3,Media:2,Luxury:1};
 const stableRandom=id=>{let h=2166136261;for(const ch of `${s.round}|${s.turn}|${s.card.number}|${id}`){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;};
 function companyPriority(item){const {x,unemployed}=item,industry=x.d.industry,service=['Health','Education'].includes(industry),key=industry.toLowerCase(),price=service?({A:0,B:5,C:10})[s.positions[industry==='Health'?4:5]]:0,notProduced=service&&Number(r.common.values?.[key]||0)===0,after=item.slots.filter(Boolean).length;return [unemployed,beforeIndustry[industry]<4&&beforeIndustry[industry]-x.c.slots.filter(v=>v.owner==='Working').length+after>=4?1:0,wageRank[wage(x.d,x.c,s)]||0,x.d.class==='State'?1:0,x.d.class==='Capitalist'?1:0,service?1:0,notProduced?1:0,price,industryRank[industry]||0,stableRandom(x.id)];}
 const compareVector=(a,b)=>{for(let i=0;i<Math.max(a.length,b.length);i++){const d=Number(a[i]||0)-Number(b[i]||0);if(d)return d;}return 0;};
 function makeCandidate(layout){
  const free=tokens.map(t=>({...t})),states={},targets=[],changes=[];let unemployedAssigned=0,moved=0;
  for(let n=0;n<companies.length;n++){
   const x=companies[n],skills=layout.chosen[n],slots=[];let companyUnemployed=0;
   for(let i=0;i<skills.length;i++){
    const skill=skills[i];if(!skill){slots.push({owner:'empty',skill:x.c.slots[i]?.skill||x.d.workers[i]?.color||'Gray',committed:false});continue;}
    if(x.fixed[i]){slots.push({...x.c.slots[i]});continue;}
    let at=free.findIndex(t=>t.origin==='company'&&t.companyId===x.id&&t.index===i&&t.skill===skill);
    if(at<0)at=free.findIndex(t=>t.origin==='unemployed'&&t.skill===skill);
    if(at<0)at=free.findIndex(t=>t.skill===skill);
    if(at<0)return null;const token=free.splice(at,1)[0],stayed=token.origin==='company'&&token.companyId===x.id&&token.index===i;
    if(!stayed){moved++;if(token.origin==='unemployed'){unemployedAssigned++;companyUnemployed++;}}
    slots.push({owner:'Working',skill,committed:stayed?Boolean(x.c.slots[i].committed):true});
   }
   const full=slots.every(v=>v.owner==='Working'),next={...x.c,slots,operating:full?'yes':'no',strike:full?x.c.strike:false};states[x.id]=next;
   const before=x.c.slots.map(v=>v.owner==='Working'?v.skill:'-').join('|'),after=slots.map(v=>v.owner==='Working'?v.skill:'-').join('|');if(before!==after)changes.push(`${x.d.name_jp}：${full?slots.map(v=>v.skill).join('・'):'空にする'}`);
   if(companyUnemployed||slots.some((v,i)=>v.owner==='Working'&&(x.c.slots[i]?.owner!=='Working'||x.c.slots[i]?.skill!==v.skill)))targets.push({x,slots,unemployed:companyUnemployed});
  }
  const unions={...r.personal.Working.unions},industryCounts=Object.fromEntries(Object.keys(UNION_SKILL).map(k=>[k,0]));for(let n=0;n<companies.length;n++)industryCounts[companies[n].d.industry]+=layout.chosen[n].filter(Boolean).length;
  const dissolved=[];for(const [industry,skill] of Object.entries(UNION_SKILL))if(unions[industry]&&industryCounts[industry]<4){unions[industry]=false;dissolved.push(skill);}
  let newUnions=0;for(const [industry,skill] of Object.entries(UNION_SKILL))if(!unions[industry]&&industryCounts[industry]>=4){const at=free.findIndex(t=>t.skill===skill);if(at>=0){free.splice(at,1);unions[industry]=true;newUnions++;moved++;}}
  if(unemployedAssigned<2&&!newUnions||standard&&moved>3)return null;
  const unemployed=Object.fromEntries(SKILLS.map(skill=>[skill,free.filter(t=>t.skill===skill).length+dissolved.filter(x=>x===skill).length]));
  const ranked=targets.map(item=>({name:item.x.d.name_jp,key:companyPriority(item)})).sort((a,b)=>compareVector(b.key,a.key));
  return {newUnions,unemployedAssigned,moved,ranked,changes,reassignment:{companies:states,unemployed,unions}};
 }
 function compare(a,b){let d=a.newUnions-b.newUnions;if(d)return d;for(let i=0;i<Math.max(a.ranked.length,b.ranked.length);i++){d=compareVector(a.ranked[i]?.key||[],b.ranked[i]?.key||[]);if(d)return d;}return a.unemployedAssigned-b.unemployedAssigned||a.moved-b.moved;}
 let best=null,candidateCount=0;considerLayout=layout=>{const candidate=makeCandidate(layout);if(!candidate)return;candidateCount++;if(!best||compare(candidate,best)>0)best=candidate;};walk(0,available,[]);
 if(!best)return actionResult('AW',false,'2人以上の失業労働者を企業へ配置することも、労働組合を設立することもできません。');
 const targets=[...(best.newUnions?[`労働組合${best.newUnions}個を設立`]:[]),...best.changes];
 return actionResult('AW',true,`${standard?'通常AW':`カード#${s.card.number}`}：${best.unemployedAssigned}人の失業労働者を配置${best.newUnions?`し、労働組合を${best.newUnions}個設立`:''}します。`,targets,[`${standard?'最大3個を使う通常割り当て':`政策2${policy}：${policy==='C'?'誓約中でない在職者を含む':'失業者のみ'}`}の全合法案${candidateCount}件を比較`,`優先順：労働組合 → 最多の失業者を雇う企業 → 組合条件 → 賃金 → 国家 → 資本家 → 健康・教育 → 食料・メディア・ぜいたく品 → ランダム`],[],{action:'AW',reassignment:best.reassignment});
}
function workerAction(s){
 const card=CARD_DATA[String(s.card?.number||'')]||{},unlimited=card.bonusType==='unlimitedAssign'?unlimitedWorkerAction(s):null;if(unlimited)return unlimited;const specialWorkerBonus=card.bonusType==='coopFarm'||card.bonusType==='assign4Paid'&&['B','C'].includes(s.positions[2])||card.bonusType==='gainSkilled'&&['B','C'].includes(s.positions[7]);if(!specialWorkerBonus){const standard=unlimitedWorkerAction(s,true);if(standard)return standard;}
 const r=s.records,map=defs(),unemployed=pool(r),candidates=[];
 let farmAllocation=null,farmId=null;if(card.bonusType==='coopFarm'){const farm=(root.WCA_EXTRA_COMPANIES||root.WCA_COMPANIES||[]).find(d=>d.class==='Working'&&d.tags?.includes('Card_Effect_Build')&&['unbuilt','discarded'].includes(r.companies[d.id]?.status));if(farm){const filled=fillPlan(farm,unemployed);if(filled){for(const skill of SKILLS)unemployed[skill]=filled.left[skill];farmId=farm.id;farmAllocation={companyId:farm.id,slots:filled.slots};}}}
 const gainSkilled=card.bonusType==='gainSkilled'&&['B','C'].includes(s.positions[7]);for(const [id,c] of Object.entries(r.companies||{})){const d=map[id];if(c.status==='built'&&d&&c.slots.every(x=>x.owner==='empty')&&d.workers.length<=3&&(gainSkilled||fill(d,unemployed)))candidates.push(d);}
 const paidFour=card.bonusType==='assign4Paid'&&['B','C'].includes(s.positions[2]),limit=paidFour?4:3;let maxHire=0,bestPlans=[];function choose(start,left,total,names,alloc,gainedSkill){if(total>maxHire){maxHire=total;bestPlans=[];}if(total===maxHire)bestPlans.push({names,alloc,gainedSkill});for(let i=start;i<candidates.length;i++){const d=candidates[i],filled=fillPlan(d,left);if(filled&&total+d.workers.length<=limit)choose(i+1,filled.left,total+d.workers.length,[...names,d.name_jp],[...alloc,{companyId:d.id,slots:filled.slots}],gainedSkill);}}for(const skill of gainSkilled?SKILLS.filter(x=>x!=='Gray'):[null]){const start={...unemployed};if(skill)start[skill]++;choose(0,start,0,[],[],skill);}bestPlans=[...new Map(bestPlans.map(x=>[`${x.gainedSkill}|${JSON.stringify(x.alloc)}`,x])).values()];
 const industryCounts=Object.fromEntries(Object.keys(UNION_SKILL).map(k=>[k,0]));for(const [id,c] of Object.entries(r.companies||{})){const d=map[id];if(d&&c.status==='built')industryCounts[d.industry]+=c.slots.filter(x=>x.owner==='Working').length;}const wageRank={unknown:0,L1:1,L2:2,L3:3},industryRank={Food:3,Media:2,Luxury:1},hash=id=>{let h=2166136261;for(const ch of `${s.round}|${s.turn}|${s.card.number}|${id}`){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;},score=id=>{const d=map[id],c=r.companies[id],service=['Health','Education'].includes(d.industry),key=d.industry.toLowerCase(),price=service?({A:0,B:5,C:10})[s.positions[d.industry==='Health'?4:5]]:0;return [d.workers.length,industryCounts[d.industry]<4&&industryCounts[d.industry]+d.workers.length>=4?1:0,wageRank[wage(d,c,s)]||0,d.class==='State'?1:0,d.class==='Capitalist'?1:0,service?1:0,service&&Number(r.common.values?.[key]||0)===0?1:0,price,industryRank[d.industry]||0,hash(id)];},cmp=(a,b)=>{for(let i=0;i<Math.max(a.length,b.length);i++){const d=Number(a[i]||0)-Number(b[i]||0);if(d)return d;}return 0;};bestPlans.sort((a,b)=>{const aa=a.alloc.map(x=>score(x.companyId)).sort((x,y)=>cmp(y,x)),bb=b.alloc.map(x=>score(x.companyId)).sort((x,y)=>cmp(y,x));for(let i=0;i<Math.max(aa.length,bb.length);i++){const d=cmp(aa[i]||[],bb[i]||[]);if(d)return -d;}return 0;});const selectedPlan=bestPlans[0]||{},best=selectedPlan.names||[],bestAlloc=selectedPlan.alloc||[];
 const unions=unionRange(r,map,unemployed,candidates);
 const bonusHire=farmAllocation?.slots.length||0,totalHire=maxHire+bonusHire,rearrangement=Object.entries(r.companies||{}).some(([id,c])=>c.status==='built'&&map[id]&&(c.slots.some(x=>x.owner==='empty')&&!c.slots.every(x=>x.owner==='empty')||c.slots.some(x=>x.owner==='Working'&&!x.committed)));
 if(totalHire<2&&unions.upper===0&&rearrangement)return actionResult('AW',null,'失業者だけでは条件を満たしません。企業間の再配置を含む合法手を現物で確認してください。');
 if(totalHire<2&&unions.upper===0)return actionResult('AW',false,'2人以上の配置も労働組合の設立もできません。');
 if(unions.upper>0)return actionResult('AW',null,`失業者は最大${maxHire}人配置できます。労働組合を優先する配置は現物確認が必要です。`,best);
 const targets=[...(farmAllocation?[`共同農場を設立して全${bonusHire}スロットに配置`]:[]),...(unions.lower?[`労働組合 ${unions.lower}個を設立`]:[]),...(bestAlloc.length?[`配置先：${bestAlloc.map(a=>`${map[a.companyId].name_jp}（全${a.slots.length}スロット）`).join('、')}`]:[])],allocations=[...(farmAllocation?[farmAllocation]:[]),...bestAlloc];
 const ownerPayments={};if(paidFour)for(const a of bestAlloc){const owner=map[a.companyId]?.class;if(owner&&owner!=='Working')ownerPayments[owner]=Number(ownerPayments[owner]||0)+a.slots.length*4;}
 return actionResult('AW',true,targets.join('。')||`失業者を${totalHire}人配置します。`,targets,[`失業者から最大${totalHire}人の配置を計算${paidFour?`（カード#${s.card.number}は4人まで）`:''}${selectedPlan.gainedSkill?`、サプライから${selectedPlan.gainedSkill}の熟練労働者を追加`:''}`,'対象候補はInstructionカードの優先順で確定'],[],{action:'AW',allocations,ownerPayments,gainedSkill:selectedPlan.gainedSkill||null,buildCompanyId:farmId});
}
function demonstrationAction(s){
 const r=s.records,status=root.WCARecords?.demonstrationStatus?.(r),unemployed=status?.unemployed??Object.values(pool(r)).reduce((a,b)=>a+b,0),slots=status?.slots??Object.values(r.companies||{}).reduce((n,c)=>n+(c.status==='built'?c.slots.filter(x=>x.owner==='empty').length:0),0),ok=status?.eligible??unemployed>=slots+2;
 const participants=['Capitalist','Middle','State'].filter(x=>r.participants[x]!=='absent'),labels={Capitalist:'資本家階級',Middle:'中産階級',State:'国家'};
 return actionResult('DEM',ok,ok?`デモを行います。VP減少は${participants.map(x=>labels[x]).join(' → ')||'対象なし'}の順です。`:`失業者${unemployed}人、空きスロット${slots}個のため実行できません。`,participants.map(x=>labels[x]),[`条件：失業者${unemployed} > 空きスロット${slots}＋2`],ok?['VP減少は生産フェイズのデモ解決時に処理します。']:[],ok?{action:'DEM'}:null);
}
function specialAction(s){const number=String(s.card?.number||''),card=CARD_DATA[number],r=s.records,w=r.personal.Working.values;if(!card){const o=actionResult('SA',null,'未登録カードのため、実物AIカード下部の特殊アクションを確認してください。');o.reasons.push('実行不能なら、最優先の場合は次点行動へ進み、次点の場合は政治的圧力を行います。');return o;}
 if(card.specialType==='payForVp'){const ok=Number(w.cash||0)>=20;return actionResult('SA',ok,ok?'資本家階級に20を支払い、5VPを得ます。':'資金が20未満のため実行できません。',['資本家階級'],[`労働者の資金 ${w.cash}`],[],ok?{action:'SA',effect:'payCapitalistForVp',cost:20,vp:5}:null);}
 if(card.specialType==='largestEmployerPays'){const owners=['Capitalist','Middle','State'].filter(id=>r.participants[id]!=='absent'),counts=Object.fromEntries(owners.map(id=>[id,Object.entries(r.companies).reduce((n,[companyId,c])=>n+(defs()[companyId]?.class===id&&c.status==='built'?c.slots.filter(x=>x.owner==='Working').length:0),0)])),max=Math.max(...Object.values(counts)),top=owners.filter(id=>counts[id]===max),labels={Capitalist:'資本家階級',Middle:'中産階級',State:'国家'},rank=id=>{let h=2166136261;for(const ch of `${s.round}|${s.turn}|${s.card?.number}|EMPLOYER|${id}`){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;},payer=[...top].sort((a,b)=>rank(a)-rank(b))[0];return actionResult('SA',true,`${labels[payer]}が労働者階級へ15を支払います。`,[labels[payer]],[`雇用数：${owners.map(id=>`${labels[id]} ${counts[id]}`).join('、')}`,top.length>1?'最多雇用者が同数のためアプリが抽選':'最多雇用者を選択'],[],{action:'SA',effect:'largestEmployerPays',payer,amount:15});}
 if(card.specialType==='buyInfluence'){const buy=Math.min(3,Math.floor(Number(w.cash||0)/5),Number(r.common.values.influence||0)),missing=3-buy,targets=[`影響力${buy}個を${buy*5}で購入`,...(missing?[`投票駒${missing*2}個を袋へ追加`]:[])];return actionResult('SA',true,targets.join('。'),targets,[`資金${w.cash}、国家の影響力在庫${r.common.values.influence}`],[],{action:'SA',effect:'buyInfluenceOrVotes',buy,legitimacy:card.specialLegitimacy||0});}
 if(card.specialType==='removeWorkers'){const total=Object.values(r.common.unemployed.Working||{}).reduce((n,x)=>n+Number(x||0),0),ok=total>=4;return actionResult('SA',ok,ok?'失業労働者2人を取り除き、10を得ます。未熟練を優先し、残りは確定時にランダム選択します。':`失業労働者が${total}人のため実行できません。`,[],[`失業労働者 ${total}人`],[],ok?{action:'SA',effect:'removeWorkersForCash'}:null);}
 if(card.specialType==='populationVotes'){const amount=Math.min(Number(w.population||0),Number(r.common.values.workingVotesOutside||0));return actionResult('SA',true,`労働者の投票駒${amount}個を袋へ追加します。`,[`袋へ${amount}個`],[`人口${w.population}、袋外${r.common.values.workingVotesOutside}`],[],{action:'SA',effect:'addWorkingVotes',amount});}
 if(card.specialType==='replaceVotes'){const other=(25-Number(r.common.values.capitalistVotesOutside||0))+(25-Number(r.common.values.middleVotesOutside||0)),workingOutside=Number(r.common.values.workingVotesOutside||0),ok=other>=3&&workingOutside>=3;return actionResult('SA',ok,ok?'袋の構成から他階級の投票駒が3個出るまで自動抽選し、労働者の駒と交換します。':`交換に必要な駒がありません（袋内の他階級${other}個、袋外の労働者${workingOutside}個）。`,[],['労働者の駒は抽選中に出ても袋へ戻します。'],[],ok?{action:'SA',effect:'replaceOtherVotes',autoCubeDraw:true,total:3}:null);}
 if(card.specialType==='removeDrawnVotes'){const inside=['workingVotesOutside','middleVotesOutside','capitalistVotesOutside'].reduce((n,k)=>n+25-Number(r.common.values[k]||0),0),ok=inside>=6;return actionResult('SA',ok,ok?'袋の構成から投票駒6個を自動抽選し、他階級の駒を取り除きます。':`袋内が${inside}個のため6個引けません。`,[],['労働者の駒だけを袋へ戻します。'],[],ok?{action:'SA',effect:'removeDrawnVotes',autoCubeDraw:true,total:6}:null);}
 return actionResult('SA',null,'特殊アクションの登録内容を確認してください。');}
function evaluateAction(s,action){if(!s?.records)return actionResult(action,null,'盤面の初期設定が必要です。');if(action==='PB')return policyAction(s);if(action==='BGS')return goodsAction(s);if(action==='STR')return strikeAction(s);if(action==='AW')return workerAction(s);if(action==='DEM')return demonstrationAction(s);if(action==='SA')return specialAction(s);throw Error('未知の行動です');}
function evaluate(s,check,answers={}){if(!s?.records)return {status:'needsReview',movements:[],reasons:[],questions:[],warnings:['盤面の初期設定が必要です。'],source:'Word転記'};if(check==='PB')return policyCheck(s,answers);if(check==='STR')return strikeCheck(s);if(check==='BGS')return goodsCheck(s,answers);if(check==='AW')return workersCheck(s,answers);throw Error('未知のチェックです');}
root.WCAJudge={evaluate,evaluateAction,SAMPLE_CARDS,CARD_DATA,foreignMarketPrice,immediateVote2P};if(typeof module!=='undefined')module.exports=root.WCAJudge;
})(typeof globalThis!=='undefined'?globalThis:this);
