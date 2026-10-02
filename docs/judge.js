(function(root){
'use strict';
const SKILLS=['Gray','Green','Blue','White','Orange','Purple'];
const DESIRED={1:'A',2:'A',3:'A',4:'A',5:'A',6:'C',7:'B'};
const CARD_DATA={
 '6':{order:['PB','BGS','AW','STR'],policies:['2','3'],bonus:'法案を提議する場合、影響力を支払わず即時投票を要求する',special:'可能なら資本家階級に20を支払い5VPを得る'},
 '13':{order:['BGS','AW','PB','STR'],policies:['7','2'],bonus:'労働市場2B/2Cなら、購入前に雇用中の労働者1人につき国家から1を得る',special:'他プレイヤーのうち労働者を最も多く雇用している者から15を得る'},
 '16':{order:['BGS','PB','AW','STR'],policies:['4','2'],bonus:'購入前に、労働者がいる国有企業が1回生産する',special:'国家から影響力を3個まで各5で購入し、購入できない1個につき投票駒2個を袋へ入れる',specialLegitimacy:1},
 '19':{order:['AW','BGS','PB','STR'],policies:['4','6'],bonus:'労働市場2Bなら失業労働者を、2Cなら任意の労働者を任意数割り当てる',special:'可能なら資本家階級に20を支払い5VPを得る'},
 '22':{order:['BGS','PB','AW','STR'],policies:['5','2'],bonus:'労働市場2B/2Cなら、購入前に雇用中の労働者1人につき国家から1を得る',special:'失業労働者が4人以上なら2人を取り除いて10を得る'},
 '30':{order:['PB','BGS','AW','STR'],policies:['6','7'],bonus:'法案を提議する前に投票駒2個を袋へ入れる',special:'国家から影響力を3個まで各5で購入し、購入できない1個につき投票駒2個を袋へ入れる',specialLegitimacy:1}
};
const SAMPLE_CARDS={...Object.fromEntries(Object.entries(CARD_DATA).map(([id,c])=>[id,{order:c.order,policies:c.policies}])),
 '14':{order:['AW','PB','BGS','STR'],policies:['2','7']},
 '29':{order:['PB','AW','BGS','STR'],policies:['6','2']}
};
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
 const values=[w.influence,opponent.influence,outside.workingVotesOutside,outside.capitalistVotesOutside];
 if(values.some(x=>x==null))return {possible:null,reason:'両階級の影響力と袋の外の投票駒が未確認'};
 const bonus=String(s.card?.number)==='30'?2:0,workingBag=25-Math.max(0,Number(outside.workingVotesOutside)-bonus),opponentBag=25-Number(outside.capitalistVotesOutside);
 const callCost=String(s.card?.number)==='6'?0:1,after=Number(w.influence)-Number(alreadySpent)-callCost,influenceOk=after>Number(opponent.influence),votesOk=workingBag>=opponentBag;
 return {possible:influenceOk&&votesOk,cost:callCost,reason:`即時投票費用${callCost}の支払い後の影響力 ${after} 対 ${Number(opponent.influence)}、袋内投票駒 ${workingBag} 対 ${opponentBag}${bonus?'（カード#30の2個を反映）':''}`};
}
function inspectCard(s,o){const number=String(s.card?.number||''),c=SAMPLE_CARDS[number];if(c&&(c.order.join()!==s.card.order.join()||c.policies.join()!==s.card.policies.join()))warn(o,`カード#${s.card.number}の転記と入力内容が一致しません。`);if(s.index===0&&['14','29'].includes(number))warn(o,`カード#${number}のボーナスが最初のチェックへ与える影響は確認待ちです。`);if(s.index===0&&!CARD_DATA[number]&&s.card?.bonus?.trim()&&!/^(なし|無し|none|-|－)$/i.test(s.card.bonus.trim()))warn(o,'入力されたボーナスの判定への影響は未対応です。');}
function policyCheck(s,a){const o=fresh(),r=s.records;let markers=r?.personal?.Working?.values?.billMarkers;if(markers==null&&a.billMarkers===undefined)ask(o,'billMarkers','利用可能な政策マーカー','number',{min:0,max:3});else markers=Number(markers??a.billMarkers);const eligible={};for(const id of s.card.policies){eligible[id]=!(id in s.aside.policies)&&markers>0;if(s.round===5&&id==='7')eligible[id]=false;if(s.round===5&&id==='6'){const iv=immediateVote2P(s);if(iv.possible===null&&a.immediateVote===undefined)ask(o,'immediateVote','政策6で即時投票を行える','boolean');else eligible[id]=eligible[id]&&(iv.possible??a.immediateVote);o.reasons.push(`政策6の即時投票：${iv.reason}`);}}if(o.questions.length){inspectCard(s,o);return o;}let any=false;for(const id of s.card.policies){if(!eligible[id]){o.reasons.push(`政策${id}：提議不可または優先カードが脇`);continue;}any=true;const distance=Math.abs(s.positions[id].charCodeAt(0)-DESIRED[id].charCodeAt(0));let up=distance===1?1:distance===2?2:0;if(id==='2')up++;if(up){add(o,'actions','PB',up,`政策${id} ${s.positions[id]}、希望${DESIRED[id]}`);add(o,'policies',id,up,'PBと同じ段数');}else o.reasons.push(`政策${id}：希望位置のため移動なし`);}if(!any)add(o,'actions','SA',1,'2政策とも提議できない');inspectCard(s,o);return o;}
function wage(def,c,s){return def?.wages&&s.records.participants?.[def.class]!=='human'?({A:'L3',B:'L2',C:'L1'})[s.positions[2]]:c.wage;}
function strikeCheck(s){const o=fresh(),r=s.records,map=defs();let eligible=0;const unknown=[];for(const [id,c] of Object.entries(r.companies||{})){if(c.status!=='built')continue;const d=map[id];if(!d||!c.slots.some(x=>x.owner==='Working'))continue;const w=wage(d,c,s);if(c.slots.some(x=>x.owner==='unknown')||w==='unknown'){unknown.push(d.name_jp);continue;}const stateAllowed=d.class!=='State'||r.participants.State==='human';if(stateAllowed&&!c.strike&&!c.slots.some(x=>x.committed)&&w!=='L3')eligible++;}if(unknown.length)warn(o,`企業情報が未確認です：${[...new Set(unknown)].join('、')}`);const unions=Object.values(r.personal?.Working?.unions||{}).filter(Boolean).length,pos=s.positions[2];o.reasons.push(`労働市場${pos}、組合${unions}、ストライキ可能企業${eligible}`);if(pos==='B'&&unions>=2)add(o,'actions','STR',Math.floor(eligible/3),'可能企業3社ごと');if(pos==='C'){add(o,'actions','STR',Math.floor(eligible/2),'可能企業2社ごと');add(o,'policies','2',1,'労働市場がC');}inspectCard(s,o);return o;}
function purchase(source,qty){return {source:source.source,key:source.key,qty,cost:qty*source.price,...(source.tariff?{stateTariff:qty*source.tariff}:{})};}
function cheapest(sources,qty){let best=null;for(let i=0;i<sources.length;i++)for(let j=i;j<sources.length;j++){if(i===j){if(sources[i].stock<qty)continue;const cost=qty*sources[i].price,candidate={cost,from:[`${sources[i].name} ${qty}`],purchases:[purchase(sources[i],qty)]};if(!best||cost<best.cost)best=candidate;continue;}for(let x=Math.min(qty,sources[i].stock);x>=0;x--){const y=qty-x;if(y<0||y>sources[j].stock)continue;const cost=x*sources[i].price+y*sources[j].price,candidate={cost,from:[`${sources[i].name} ${x}`,`${sources[j].name} ${y}`].filter(v=>!v.endsWith(' 0')),purchases:[purchase(sources[i],x),purchase(sources[j],y)].filter(v=>v.qty)};if(!best||cost<best.cost)best=candidate;}}return best;}
const employed=r=>Object.values(r.companies||{}).reduce((n,c)=>n+(c.status==='built'?c.slots.filter(x=>x.owner==='Working').length:0),0);
function goodsCheck(s,a){const o=fresh(),base=s.records,publicBonus=String(s.card.number)==='16'&&s.index===0&&s.card.order[0]==='BGS'?root.WCARecords?.applyPublicCompanyBonus?.(base):null,r=publicBonus?.records||base,w=r.personal?.Working?.values||{},cap=r.personal?.Capitalist?.values||{},items=[['health','健康','Health'],['education','教育','Education'],['luxury','贅沢品','Luxury']];if(publicBonus)o.reasons.push(`カード#16：国有企業${publicBonus.preview.items.length}社の生産と賃金${publicBonus.preview.wages}を判定に反映`);for(const [id,label] of [['population','人口'],['cash','資金'],['health','所持する健康'],['education','所持する教育'],['luxury','所持する贅沢品']])if(w[id]==null)ask(o,id,label,'number',{min:0});if(r.participants.Middle!=='absent')warn(o,'中産階級の在庫と価格はまだ自動判定に対応していません。');if(o.questions.length){inspectCard(s,o);return o;}const population=Number(w.population??a.population),cash=Number(w.cash??a.cash);let bonus=0;if(['13','22'].includes(String(s.card.number))&&s.index===0&&s.card.order[0]==='BGS'&&['B','C'].includes(s.positions[2])){bonus=employed(r);o.reasons.push(`カード#${s.card.number}：雇用中${bonus}人分を判定用収入として考慮`);}let possible=0;for(const [key,label,resource] of items){const held=Number(w[key]??a[key]),qty=held>=population?population:population-held,sources=[];if(resource!=='Luxury')sources.push({name:'国家',stock:Number(r.common.values?.[key]||0),price:({A:0,B:5,C:10})[s.positions[resource==='Health'?4:5]]});if(cap[key]!=null&&cap[`${key}Price`]!=null)sources.push({name:'資本家',stock:Number(cap[key]),price:Number(cap[`${key}Price`])});if(resource==='Luxury')sources.push({name:`海外市場（基本6＋関税${FOREIGN_TARIFF[s.positions[6]].luxury}）`,stock:Infinity,price:foreignMarketPrice('luxury',s.positions[6])});const plan=cheapest(sources,qty);if(!plan||plan.cost>cash+bonus){o.reasons.push(`${label}：必要${qty}、購入不可`);continue;}possible++;const effective=Math.max(0,plan.cost-bonus),unit=qty?effective/qty:Infinity,up=effective===0?3:unit<=6?2:1;add(o,'actions','BGS',up,`${label}${qty}個、${plan.from.join('＋')}、実質${effective}（単価${unit.toFixed(2)}）`);if(bonus>=plan.cost&&bonus>0)warn(o,'ボーナスで実質費用が0以下になる扱いは現物確認が必要です。');}if(!possible)add(o,'actions','SA',1,'3資源をどれも必要数購入できない');inspectCard(s,o);return o;}
function pool(r){return Object.fromEntries(SKILLS.map(k=>[k,Number(r.common?.unemployed?.Working?.[k]||0)]));}
function fill(d,p){if(d.workers.some(x=>x.type==='MiddleClass'))return null;function walk(i,left){if(i===d.workers.length)return left;const slot=d.workers[i],choices=slot.type==='Skilled'?[slot.color]:SKILLS;for(const skill of choices)if(left[skill]>0){const done=walk(i+1,{...left,[skill]:left[skill]-1});if(done)return done;}return null;}return walk(0,{...p});}
function fillOptions(d,p){if(d.workers.some(x=>x.type==='MiddleClass'))return [];const found=[];function walk(i,left){if(i===d.workers.length){found.push(left);return;}const slot=d.workers[i],choices=slot.type==='Skilled'?[slot.color]:SKILLS;for(const skill of choices)if(left[skill]>0)walk(i+1,{...left,[skill]:left[skill]-1});}walk(0,{...p});return [...new Map(found.map(x=>[JSON.stringify(x),x])).values()];}
const UNION_SKILL={Food:'Green',Luxury:'Blue',Health:'White',Education:'Orange',Media:'Purple'};
function unionRange(r,map,p,candidates){const counts=Object.fromEntries(Object.keys(UNION_SKILL).map(k=>[k,0]));for(const [id,c] of Object.entries(r.companies||{})){const d=map[id];if(c.status==='built'&&d)counts[d.industry]=(counts[d.industry]||0)+c.slots.filter(x=>x.owner==='Working').length;}let lower=0;function score(left,added,used){const eligible=Object.entries(UNION_SKILL).filter(([industry,skill])=>!r.personal?.Working?.unions?.[industry]&&(counts[industry]||0)+(added[industry]||0)>=4&&left[skill]>0).length;lower=Math.max(lower,Math.min(eligible,3-used));}function plans(start,left,used,added){score(left,added,used);for(let i=start;i<candidates.length;i++){const d=candidates[i],cost=d.workers.length;if(used+cost>2)continue;for(const next of fillOptions(d,left))plans(i+1,next,used+cost,{...added,[d.industry]:(added[d.industry]||0)+cost});}}plans(0,p,0,{});
 const costs=[];for(const [industry,skill] of Object.entries(UNION_SKILL)){if(r.personal?.Working?.unions?.[industry])continue;const empty=candidates.filter(d=>d.industry===industry).reduce((n,d)=>n+d.workers.length,0),need=Math.max(0,4-(counts[industry]||0));let skilled=p[skill]>0;if(!skilled&&p.Gray>0)skilled=Object.entries(r.companies||{}).some(([id,c])=>{const d=map[id];return c.status==='built'&&d&&c.slots.some((x,i)=>x.owner==='Working'&&x.skill===skill&&d.workers[i]?.type==='Unskilled');});if(need<=2&&empty>=need&&skilled)costs.push(need+1);}let upper=0;function choose(i,total,n){upper=Math.max(upper,n);for(let k=i;k<costs.length;k++)if(total+costs[k]<=3)choose(k+1,total+costs[k],n+1);}choose(0,0,0);return {lower,upper};}
function workersCheck(s,a){const o=fresh(),r=s.records,map=defs(),p=pool(r),candidates=[];let slots=0,swaps=0;for(const [id,c] of Object.entries(r.companies||{})){if(c.status!=='built')continue;const d=map[id];if(!d)continue;for(let i=0;i<c.slots.length;i++)if(d.workers[i]?.type==='Unskilled'&&c.slots[i].owner==='Working'&&c.slots[i].skill!=='Gray')swaps++;if(c.slots.every(x=>x.owner==='empty')&&d.workers.every(x=>x.type!=='MiddleClass')){slots+=c.slots.length;if(c.slots.length<=3&&fill(d,p))candidates.push(d);}}if(swaps&&p.Gray>0)warn(o,`Swap Workersの候補が${Math.min(swaps,p.Gray)}人います。入れ替え後の盤面を記録してください。`);const unlimited=String(s.card?.number)==='19'&&s.index===0&&s.card.order[0]==='AW'&&['B','C'].includes(s.positions[2]),limit=unlimited?Infinity:3;let maxHire=0;function choose(i,left,total){maxHire=Math.max(maxHire,total);for(let k=i;k<candidates.length;k++){const d=candidates[k];if(total+d.workers.length>limit)continue;const next=fill(d,left);if(next)choose(k+1,next,total+d.workers.length);}}choose(0,p,0);if(maxHire>=2)add(o,'actions','AW',maxHire,`失業者を最大${maxHire}人雇用できる${unlimited?'（カード#19）':''}`);const unions=unionRange(r,map,p,candidates);if(unions.lower===unions.upper){if(unions.lower)add(o,'actions','AW',2*unions.lower,`1回の割り当てで設立できる組合${unions.lower}個`);else o.reasons.push('設立できる労働組合なし');}else if(a.simultaneousUnions===undefined)ask(o,'simultaneousUnions','再配置を含めて設立できる労働組合の最大数','number',{min:unions.lower,max:unions.upper});else{const n=Math.max(unions.lower,Math.min(unions.upper,Number(a.simultaneousUnions)));if(n)add(o,'actions','AW',2*n,`設立できる労働組合${n}個`);}const unemployed=Object.values(p).reduce((x,y)=>x+y,0),gap=Math.max(0,unemployed-slots);if(gap)add(o,'actions','DEM',gap,`失業者${unemployed}－空きスロット${slots}`);if(!o.questions.length&&!o.movements.some(x=>x.card==='AW')&&o.status==='ready')add(o,'actions','SA',1,'AW条件なし');o.reasons.push(`失業者${unemployed}、空きスロット${slots}、最大雇用${maxHire}`);inspectCard(s,o);return o;}

const actionResult=(action,feasible,summary,targets=[],reasons=[],warnings=[],plan=null)=>({action,feasible,status:feasible===null?'needsReview':feasible?'ready':'infeasible',summary,targets,reasons,warnings,plan,source:'Word転記「アクションの詳細」'});
function policyAction(s){
 const r=s.records,w=r.personal?.Working?.values||{},markers=w.billMarkers;
 if(markers==null)return actionResult('PB',null,'利用可能な法案マーカーを記録してください。');
 if(markers<1)return actionResult('PB',false,'利用可能な法案マーカーがありません。');
 const candidates=[],warnings=[];
 for(const id of root.WCA.rank(s,'policies')){
  if(id in s.aside.policies)continue;
  const current=s.positions[id],desired=DESIRED[id],distance=Math.abs(current.charCodeAt(0)-desired.charCodeAt(0));
  if(!distance)continue;
  if(s.round===5&&id==='7')continue;
  const target=String.fromCharCode(current.charCodeAt(0)+(desired>current?1:-1));
  candidates.push({id,current,target});
 }
 if(!candidates.length)return actionResult('PB',false,'提議できる政策がありません。',[],['政策優先カード、法案マーカー、第5ラウンド制限を確認']);
 const limit=String(s.card?.number)==='29'?2:1,chosen=[];let available=Number(markers),spent=0;
 for(const candidate of candidates){if(chosen.length>=limit||available<1)break;const iv=immediateVote2P(s,spent);if(s.round===5&&candidate.id==='6'){if(iv.possible===null)return actionResult('PB',null,`政策6の即時投票条件を判定できません：${iv.reason}`);if(!iv.possible)continue;}if(iv.possible===null)warnings.push(`政策${candidate.id}の即時投票は未判定：${iv.reason}`);const selected={...candidate,immediate:iv.possible===true,immediateCost:iv.possible===true?iv.cost:0,immediateReason:iv.reason};chosen.push(selected);if(selected.immediate)spent+=selected.immediateCost;else available--;}
 if(!chosen.length)return actionResult('PB',false,'提議できる政策がありません。',[],['法案マーカーと即時投票条件を確認']);
 const targets=chosen.map(x=>`政策${x.id}：${x.current} → ${x.target}${x.immediate?'（即時投票）':''}`);
 if(String(s.card?.number)==='29'&&chosen.length<2)warnings.push('カード#29の2件目は提議可能な政策または法案マーカーがありません。');
 if(String(s.card?.number)==='30')warnings.push('提議前に労働者の投票駒2個を袋へ追加します。');
 const plan={action:'PB',bonusVotes:String(s.card?.number)==='30'?2:0,proposals:chosen.map(x=>({id:x.id,from:x.current,target:x.target,immediate:x.immediate,immediateCost:x.immediateCost}))};
 return actionResult('PB',true,`${targets.join('、')}を提議します。`,targets,['政策優先順の上から選択',...chosen.filter(x=>x.immediate).map(x=>`即時投票：${x.immediateReason}`)],warnings,plan);
}
function goodsPlans(s){
 const number=String(s.card?.number||''),publicBonus=number==='16'&&s.card?.order?.[0]==='BGS'?root.WCARecords?.applyPublicCompanyBonus?.(s.records):null,r=publicBonus?.records||s.records,w=r.personal?.Working?.values||{},cap=r.personal?.Capitalist?.values||{},population=w.population,cash=w.cash;
 if([population,cash,w.health,w.education,w.luxury,w.workerCount].some(x=>x==null))return {unknown:true,plans:[]};
 const plans=[];
 for(const [key,label,resource] of [['health','健康','Health'],['education','教育','Education'],['luxury','贅沢品','Luxury']]){
  const held=Number(w[key]),qty=held===Number(population)?Number(population):Math.max(0,Number(population)-held),sources=[];
  if(!qty)continue;
  if(resource!=='Luxury')sources.push({name:'国家',source:'State',key,stock:Number(r.common.values?.[key]||0),price:({A:0,B:5,C:10})[s.positions[resource==='Health'?4:5]]});
  if(resource==='Luxury')sources.push({name:'海外市場',source:'Foreign',key,stock:Infinity,price:foreignMarketPrice('luxury',s.positions[6]),tariff:FOREIGN_TARIFF[s.positions[6]].luxury});
  if(cap[key]!=null&&cap[`${key}Price`]!=null)sources.push({name:'資本家',source:'Capitalist',key,stock:Number(cap[key]),price:Number(cap[`${key}Price`])});
  const plan=cheapest(sources,qty),bonusCash=['13','22'].includes(number)&&['B','C'].includes(s.positions[2])?employed(r):0;if(plan&&plan.cost<=Number(cash)+bonusCash)plans.push({key,label,qty,bonusCash,sources,...plan,unit:Math.max(0,plan.cost-bonusCash)/qty});
 }
 return {unknown:false,plans,publicBonus:publicBonus?.preview||null};
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
 plans.sort((a,b)=>(a.cost===0?0:1)-(b.cost===0?0:1)||(gray>=3&&a.key==='education'?-1:gray>=3&&b.key==='education'?1:0)||a.unit-b.unit||order[a.key]-order[b.key]);
 let p={...plans[0],from:[...plans[0].from],purchases:plans[0].purchases.map(x=>({...x}))};
 if(p.purchases.length===1){
  const used=p.purchases[0].source,remaining=Number(w.cash)+p.bonusCash-p.cost,extra=p.sources.find(x=>x.source!==used&&x.stock>=Number(w.population)&&x.price*Number(w.population)<=remaining);
  if(extra){const qty=Number(w.population),cost=extra.price*qty;p={...p,qty:p.qty+qty,cost:p.cost+cost,from:[...p.from,`${extra.name} ${qty}`],purchases:[...p.purchases,purchase(extra,qty)]};}
 }
 const target=`${p.label}${p.qty}個：${p.from.join('＋')}、合計${p.cost}`;
 const plan={action:'BGS',resource:p.key,qty:p.qty,cost:p.cost,bonusCash:p.bonusCash||0,purchases:p.purchases,publicProduction:!!result.publicBonus};
 const bonusNotes=[];if(p.bonusCash)bonusNotes.push(`カード#${s.card.number}により購入前に${p.bonusCash}を受け取ります。`);if(result.publicBonus)bonusNotes.push(`カード#16により国有企業${result.publicBonus.items.length}社が先に生産し、賃金${result.publicBonus.wages}と公共サービスを反映します。`);
 return actionResult('BGS',true,`${target}を購入します。`,[target],[healthRaisesPopulation?'人口増加につながる健康を候補から除外':'購入優先順を適用'],bonusNotes,plan);
}
function strikeCandidates(s){
 const r=s.records,map=defs(),counts={};
 for(const [id,c] of Object.entries(r.companies||{})){const d=map[id];if(c.status==='built'&&d&&c.operating==='yes')counts[`${d.class}|${d.industry}`]=(counts[`${d.class}|${d.industry}`]||0)+1;}
 const industry={Media:0,Health:1,Education:2,Luxury:3,Food:4},wages={L1:1,L2:2,L3:3},list=[];
 for(const [id,c] of Object.entries(r.companies||{})){const d=map[id];if(c.status!=='built'||!d||!c.slots.some(x=>x.owner==='Working'))continue;const level=wage(d,c,s),unknown=c.slots.some(x=>x.owner==='unknown')||level==='unknown';if(unknown)return {unknown:true,list:[]};const allowed=d.class!=='State'||r.participants.State==='human';if(allowed&&!c.strike&&!c.slots.some(x=>x.committed)&&level!=='L3')list.push({id,name:d.name_jp,machinery:c.machinery,only:counts[`${d.class}|${d.industry}`]===1,wage:level,industry:d.industry,production:Number(d.production?.amount||0)});}
 const compare=(a,b)=>Number(b.machinery)-Number(a.machinery)||Number(b.only)-Number(a.only)||wages[a.wage]-wages[b.wage]||industry[a.industry]-industry[b.industry]||b.production-a.production;list.sort((a,b)=>compare(a,b)||a.name.localeCompare(b.name,'ja'));
 return {unknown:false,list,compare};
}
function strikeAction(s){
 const r=s.records,pos=s.positions[2],unions=Object.values(r.personal?.Working?.unions||{}).filter(Boolean).length,c=strikeCandidates(s);
 if(c.unknown)return actionResult('STR',null,'労働者がいる企業の賃金または労働者情報が未確認です。');
 if(!(pos==='C'||pos==='B'&&unions>=2))return actionResult('STR',false,`労働市場${pos}・労働組合${unions}個のため実行できません。`);
 if(c.list.length<2)return actionResult('STR',false,`ストライキ可能企業は${c.list.length}社です（2社必要）。`,c.list.map(x=>x.name));
 if(c.list[2]&&c.compare(c.list[1],c.list[2])===0)return actionResult('STR',null,'2社目の対象が最終基準まで同点です。現物の指示どおりランダムに選んでください。',c.list.filter(x=>c.compare(c.list[1],x)===0).map(x=>x.name));
 const targets=c.list.slice(0,2).map(x=>x.name);
 return actionResult('STR',true,`${targets.join('、')}にストライキします。`,targets,[`ストライキ可能企業${c.list.length}社から優先基準で選択`],[],{action:'STR',companyIds:c.list.slice(0,2).map(x=>x.id)});
}
function fillPlan(d,p){if(d.workers.some(x=>x.type==='MiddleClass'))return null;function walk(i,left,slots){if(i===d.workers.length)return {left,slots};const slot=d.workers[i],choices=slot.type==='Skilled'?[slot.color]:SKILLS;for(const skill of choices)if(left[skill]>0){const done=walk(i+1,{...left,[skill]:left[skill]-1},[...slots,{index:i,skill}]);if(done)return done;}return null;}return walk(0,{...p},[]);}
function workerAction(s){
 const r=s.records,map=defs(),unemployed=pool(r),candidates=[];
 for(const [id,c] of Object.entries(r.companies||{})){const d=map[id];if(c.status==='built'&&d&&c.slots.every(x=>x.owner==='empty')&&d.workers.length<=3&&fill(d,unemployed))candidates.push(d);}
 const unlimited=String(s.card?.number)==='19'&&['B','C'].includes(s.positions[2]),limit=unlimited?Infinity:3;let maxHire=0,bestPlans=[];function choose(start,left,total,names,alloc){if(total>maxHire){maxHire=total;bestPlans=[];}if(total===maxHire)bestPlans.push({names,alloc});for(let i=start;i<candidates.length;i++){const d=candidates[i],filled=fillPlan(d,left);if(filled&&total+d.workers.length<=limit)choose(i+1,filled.left,total+d.workers.length,[...names,d.name_jp],[...alloc,{companyId:d.id,slots:filled.slots}]);}}choose(0,unemployed,0,[],[]);bestPlans=[...new Map(bestPlans.map(x=>[JSON.stringify(x.alloc),x])).values()];const best=bestPlans[0]?.names||[],bestAlloc=bestPlans[0]?.alloc||[];
 const unions=unionRange(r,map,unemployed,candidates);
 const rearrangement=Object.entries(r.companies||{}).some(([id,c])=>c.status==='built'&&map[id]&&(c.slots.some(x=>x.owner==='empty')&&!c.slots.every(x=>x.owner==='empty')||c.slots.some(x=>x.owner==='Working'&&!x.committed)));
 if(maxHire<2&&unions.upper===0&&rearrangement)return actionResult('AW',null,'失業者だけでは条件を満たしません。企業間の再配置を含む合法手を現物で確認してください。');
 if(maxHire<2&&unions.upper===0)return actionResult('AW',false,'2人以上の配置も労働組合の設立もできません。');
 if(unions.upper>0)return actionResult('AW',null,`失業者は最大${maxHire}人配置できます。労働組合を優先する配置は現物確認が必要です。`,best);
 if(String(s.card?.number)==='19'&&s.positions[2]==='C'&&rearrangement)return actionResult('AW',null,`カード#19では雇用中の労働者も任意数移動できます。失業者だけなら最大${maxHire}人ですが、企業間移動を含む対象は現物確認が必要です。`,best);
 if(bestPlans.length>1)return actionResult('AW',null,`最大${maxHire}人を配置できる案が複数あります。Instructionカードの残りの基準で対象を確定してください。`,bestPlans.flatMap(x=>x.names).filter((x,i,a)=>a.indexOf(x)===i));
 const targets=[...(unions.lower?[`労働組合 ${unions.lower}個を設立`]:[]),...(best.length?[`配置先：${best.join('、')}`]:[])];
 return actionResult('AW',true,targets.join('。')||`失業者を${maxHire}人配置します。`,targets,[`失業者から最大${maxHire}人の配置を計算${unlimited?'（カード#19の任意数ボーナス）':''}`],best.length>1?['同率候補がある場合はカードの優先基準を順に適用してください。']:[],{action:'AW',allocations:bestAlloc});
}
function demonstrationAction(s){
 const r=s.records,status=root.WCARecords?.demonstrationStatus?.(r),unemployed=status?.unemployed??Object.values(pool(r)).reduce((a,b)=>a+b,0),slots=status?.slots??Object.values(r.companies||{}).reduce((n,c)=>n+(c.status==='built'?c.slots.filter(x=>x.owner==='empty').length:0),0),ok=status?.eligible??unemployed>=slots+2;
 const participants=['Capitalist','Middle','State'].filter(x=>r.participants[x]!=='absent'),labels={Capitalist:'資本家階級',Middle:'中産階級',State:'国家'};
 return actionResult('DEM',ok,ok?`デモを行います。VP減少は${participants.map(x=>labels[x]).join(' → ')||'対象なし'}の順です。`:`失業者${unemployed}人、空きスロット${slots}個のため実行できません。`,participants.map(x=>labels[x]),[`条件：失業者${unemployed} > 空きスロット${slots}＋2`],ok?['VP減少は生産フェイズのデモ解決時に処理します。']:[],ok?{action:'DEM'}:null);
}
function specialAction(s){const number=String(s.card?.number||''),card=CARD_DATA[number],r=s.records,w=r.personal.Working.values,cap=r.personal.Capitalist.values;if(!card){const o=actionResult('SA',null,'未登録カードのため、実物AIカード下部の特殊アクションを確認してください。');o.reasons.push('実行不能なら、最優先の場合は次点行動へ進み、次点の場合は政治的圧力を行います。');return o;}
 if(['6','19'].includes(number)){const ok=Number(w.cash||0)>=20;return actionResult('SA',ok,ok?'資本家階級に20を支払い、5VPを得ます。':'資金が20未満のため実行できません。',['資本家階級'],[`労働者の資金 ${w.cash}`],[],ok?{action:'SA',effect:'payCapitalistForVp',cost:20,vp:5}:null);}
 if(number==='13'){const owners=['Capitalist','Middle','State'].filter(id=>r.participants[id]!=='absent'),counts=Object.fromEntries(owners.map(id=>[id,Object.entries(r.companies).reduce((n,[companyId,c])=>n+(defs()[companyId]?.class===id&&c.status==='built'?c.slots.filter(x=>x.owner==='Working').length:0),0)])),max=Math.max(...Object.values(counts)),top=owners.filter(id=>counts[id]===max),labels={Capitalist:'資本家階級',Middle:'中産階級',State:'国家'};if(top.length!==1)return actionResult('SA',null,`最多雇用者が同数です（${top.map(id=>`${labels[id]} ${counts[id]}人`).join('、')}）。現物の同点処理を確認してください。`,top.map(id=>labels[id]));return actionResult('SA',true,`${labels[top[0]]}が労働者階級へ15を支払います。`,[labels[top[0]]],[`雇用数：${owners.map(id=>`${labels[id]} ${counts[id]}`).join('、')}`],[],{action:'SA',effect:'largestEmployerPays',payer:top[0],amount:15});}
 if(['16','30'].includes(number)){const buy=Math.min(3,Math.floor(Number(w.cash||0)/5),Number(r.common.values.influence||0)),missing=3-buy,targets=[`影響力${buy}個を${buy*5}で購入`,...(missing?[`投票駒${missing*2}個を袋へ追加`]:[])];return actionResult('SA',true,targets.join('。'),targets,[`資金${w.cash}、国家の影響力在庫${r.common.values.influence}`],[],{action:'SA',effect:'buyInfluenceOrVotes',buy,legitimacy:card.specialLegitimacy||0});}
 if(number==='22'){const total=Object.values(r.common.unemployed.Working||{}).reduce((n,x)=>n+Number(x||0),0),ok=total>=4;return actionResult('SA',ok,ok?'失業労働者2人を取り除き、10を得ます。未熟練を優先し、残りは確定時にランダム選択します。':`失業労働者が${total}人のため実行できません。`,[],[`失業労働者 ${total}人`],[],ok?{action:'SA',effect:'removeWorkersForCash'}:null);}
 return actionResult('SA',null,'特殊アクションの登録内容を確認してください。');}
function evaluateAction(s,action){if(!s?.records)return actionResult(action,null,'盤面の初期設定が必要です。');if(action==='PB')return policyAction(s);if(action==='BGS')return goodsAction(s);if(action==='STR')return strikeAction(s);if(action==='AW')return workerAction(s);if(action==='DEM')return demonstrationAction(s);if(action==='SA')return specialAction(s);throw Error('未知の行動です');}
function evaluate(s,check,answers={}){if(!s?.records)return {status:'needsReview',movements:[],reasons:[],questions:[],warnings:['盤面の初期設定が必要です。'],source:'Word転記'};if(check==='PB')return policyCheck(s,answers);if(check==='STR')return strikeCheck(s);if(check==='BGS')return goodsCheck(s,answers);if(check==='AW')return workersCheck(s,answers);throw Error('未知のチェックです');}
root.WCAJudge={evaluate,evaluateAction,SAMPLE_CARDS,CARD_DATA,foreignMarketPrice,immediateVote2P};if(typeof module!=='undefined')module.exports=root.WCAJudge;
})(typeof globalThis!=='undefined'?globalThis:this);

