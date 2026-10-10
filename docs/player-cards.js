(function(root){
'use strict';
// Base-card effects are added in stages and explicitly listed below. C&C data is retained in the
// catalog, but is not mixed into the playable deck until its effects are ready.
const classKeys={Working:'working_class',Capitalist:'capitalist_class',Middle:'middle_class'};
const voteKeys={Working:'workingVotesOutside',Capitalist:'capitalistVotesOutside'};
const skills=['Gray','Green','Blue','White','Orange','Purple'];
const copy=x=>JSON.parse(JSON.stringify(x));
const check=(ok,message)=>{if(!ok)throw Error(message);};
const effects={
 // First Middle stage: shared card families, with the Middle amounts/storage rules below.
 mc_healthcare_benefits:'discountHealth',mc_state_scholarship:'discountEducation',mc_highlight_social_issues:'influence',
 mc_fake_news:'politicsFake',mc_interest_groups:'politicsInterest',mc_public_opinion_polling:'politicsPolling',mc_immigration_reform:'politicsMovement',
 mc_health_crisis:'sellHealth',mc_higher_education_program:'sellEducation',mc_public_sector_overtime:'publicOvertime',mc_investment_opportunities:'investment',
 wc_need_for_change:'politicsDouble',cc_push_political_agenda:'politicsDouble',
 wc_fake_news:'politicsFake',cc_fake_news:'politicsFake',wc_interest_groups:'politicsInterest',cc_interest_groups:'politicsInterest',
 wc_workers_movement:'politicsMovement',wc_healthcare_movement:'politicsMovement',wc_student_movement:'politicsMovement',wc_immigration_reform:'politicsMovement',cc_tap_into_new_markets:'politicsMovement',cc_taxed_enough_already:'politicsMovement',
 wc_radical_reforms:'politicsRadical',cc_radical_reforms:'politicsRadical',wc_public_opinion_polling:'politicsPolling',cc_public_opinion_polling:'politicsPolling',
 wc_affordable_housing:'housing',wc_healthcare_benefits:'discountHealth',wc_state_scholarship:'discountEducation',
 wc_highlight_social_issues:'influence',wc_boost_domestic_tourism:'tourism',wc_workplace_accident:'accident',
 wc_proletarians_unite:'populationVotes',wc_immigration:'immigration',wc_cooperative_farm:'farm',
 wc_unemployment_benefits:'unemploymentIncome',wc_supplemental_income_program:'employmentIncome',
 wc_specialization:'specialization',wc_signing_bonus:'signingBonus',cc_industrialization:'industrialization',
 wc_public_sector_overtime:'publicOvertime',cc_extra_shift:'extraShift',
 wc_general_strike:'generalStrike',cc_business_expansion:'businessExpansion',
 cc_investment_opportunities:'investment',cc_technological_progress:'technology',
 wc_labor_market_deregulation:'deregulation',cc_unemployment_initiative_program:'employmentGrant',
 cc_foreign_recruitment:'foreignRecruitment',cc_competitive_wages:'competitiveWages',
 cc_global_branding:'branding',cc_global_food_crisis:'foodCrisis',cc_foreign_partner:'foreignPartner',cc_foreign_market_insight:'exportInsight',
 cc_endorse_political_campaign:'campaign',cc_buy_private_island:'island',cc_offshore_companies:'offshore',
 cc_trade_protectionism_lobby:'industryVotes',cc_business_grants:'grants',cc_health_crisis:'sellHealth',
 cc_higher_education_program:'sellEducation',cc_bid_rigging:'sellLuxury',cc_exit_strategy:'exit'
};
const catalog=owner=>root.HEGEMONY_ACTION_CARDS?.[classKeys[owner]]?.base||[];
const definition=(owner,id)=>catalog(owner).find(c=>c.id===id);
const cardId=uid=>String(uid).split('#')[0];
const card=(owner,uid)=>definition(owner,cardId(uid));
function allCopies(owner){return catalog(owner).flatMap(c=>Array.from({length:c.copies},(_,i)=>`${c.id}#${i+1}`));}
function shuffled(owner,random=Math.random){const ids=allCopies(owner);for(let i=ids.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[ids[i],ids[j]]=[ids[j],ids[i]];}return ids;}
function validOrder(owner,ids){const expected=allCopies(owner);return Array.isArray(ids)&&ids.length===expected.length&&new Set(ids).size===expected.length&&ids.every(id=>expected.includes(id));}
function create(records,orders={}){
 const result={version:1,classes:{},used:false};
 for(const owner of Object.keys(classKeys))if(records.participants[owner]==='human'){
  check(catalog(owner).length,'アクションカードのカタログがありません');
  if(orders[owner]!==undefined)check(validOrder(owner,orders[owner]),'アクションカードの山札が不正です');
  const deck=orders[owner]?[...orders[owner]]:shuffled(owner);
  result.classes[owner]={deck:deck.slice(7),hand:deck.slice(0,7),discard:[]};
 }
 return result;
}
function validate(s){
 const p=s.playerCards;check(!s.pendingPlayerCard||p,'継続中のカードには手札管理が必要です');if(p===undefined)return;
 check(p?.version===1&&p.classes&&typeof p.used==='boolean','プレイヤーカードの保存形式が不正です');
 if(s.pendingPlayerCard?.kind==='politics'){root.WCA.validatePlayerPolitics(s);}else if(s.pendingPlayerCard){const p=s.pendingPlayerCard;check(s.phase==='player'&&s.playerCards.used&&p.owner==='Capitalist'&&p.cardId==='cc_foreign_market_insight'&&cardId(p.uid)===p.cardId&&s.playerCards.classes.Capitalist?.discard.includes(p.uid)&&Array.isArray(p.revealed)&&p.revealed.length===2&&new Set(p.revealed.map(c=>c.id)).size===2&&p.revealed.every(c=>root.WCA?.EXPORT_CARD_DATA[c.id]&&JSON.stringify(c)===JSON.stringify(root.WCA.EXPORT_CARD_DATA[c.id])),'継続中の輸出カード公開が不正です');}
 const humans=Object.keys(classKeys).filter(owner=>s.records?.participants[owner]==='human');
 check(Object.keys(p.classes).length===humans.length&&humans.every(owner=>p.classes[owner]),'手札を管理する階級が不正です');
 for(const owner of humans){const c=p.classes[owner];check(c&&['deck','hand','discard'].every(k=>Array.isArray(c[k])),'山札・手札・捨て札が不正です');check(validOrder(owner,[...c.deck,...c.hand,...c.discard]),'アクションカードに重複・欠落があります');check(c.hand.length<=7,'手札は7枚までです');}
}
const activeOwner=s=>s.records?.participants?.Middle==='human'?'Middle':s.automaClass==='Capitalist'?'Working':'Capitalist';
const mainEvents=new Set(['workingBasic','workingPolicy','playerPolicy','playerPurchase','playerBuild','playerSell','playerExport','playerLobby','playerPressure','playerCardEffect','playerCardReveal','middleBasic','middlePolicy']);
function consume(s,e){
 check(s.phase==='player'&&s.records?.participants[activeOwner(s)]==='human','プレイヤーの手番ではありません');
 check(!s.playerCards.used,'この手番のメインアクションは実行済みです');
 const owner=activeOwner(s),c=s.playerCards.classes[owner],index=c.hand.indexOf(e.cardUid);
 check(index>=0,'使用する手札のカードを選んでください');
 if(owner==='Middle')check(['middleBasic','middlePolicy','playerCardEffect'].includes(e.type),'中産階級のアクションではありません');else if(owner==='Working')check(['workingBasic','workingPolicy','playerCardEffect'].includes(e.type),'労働者のアクションではありません');
 else check(!['workingBasic','workingPolicy'].includes(e.type),'資本家のアクションではありません');
 c.hand.splice(index,1);c.discard.push(e.cardUid);s.playerCards.used=true;
 // workingBasic/workingPolicy perform their own legacy one-action check.
 return {owner,uid:e.cardUid,definition:card(owner,e.cardUid)};
}
function replenish(s){
 for(const c of Object.values(s.playerCards.classes)){
  check(c.hand.length===2,'ラウンド終了時の手札は2枚です。各手番に1枚使用してください');
  check(c.deck.length>=5,'アクションカードの枚数記録が不正です');
  c.hand.push(...c.deck.splice(0,5));
 }
 s.playerCards.used=false;
}
function requirement(s,c){
 if(!c.requirement)return null;
 const match=c.requirement.match(/政策([1-7])が([ABC])または([ABC])/);
 if(!match)return 'このカードの使用条件は未対応です';
 return [match[2],match[3]].includes(s.positions[match[1]])?null:c.requirement;
}
function availability(s,owner,uid){
 const c=card(owner,uid);if(!c)return {ready:false,reason:'カードがありません'};
 if(!effects[c.id])return {ready:false,reason:'カード効果は次の実装段階で対応します。基本アクション用には使用できます。'};
 const reason=requirement(s,c);return {ready:!reason,reason:reason||'',effect:effects[c.id]};
}
function bonusAmount(bonus,bases={}){
 if(!bonus)return 0;
 if(Number.isSafeInteger(bonus.amount))return bonus.amount;
 const c=bonus.calculation,n=bases[c?.basis];
 check(bonus.amount==='X'&&Number.isSafeInteger(n)&&n>=0&&Number.isSafeInteger(c?.per)&&c.per>0&&Number.isSafeInteger(c?.gain),'正当性ボーナスの計算条件がありません');
 return Math.floor(n/c.per)*c.gain;
}
function number(value,label){check(Number.isSafeInteger(value)&&value>=0,`${label}は0以上の整数です`);return value;}
function known(value,label){check(Number.isSafeInteger(value)&&value>=0,`${label}が未確認です`);return value;}
function payState(r,amount){const state=r.personal.State.values;known(state.cash,'国庫');known(state.loans,'国家の貸付金');while(state.cash<amount){state.cash+=50;state.loans++;}state.cash-=amount;}
function payCap(cap,amount,capitalOnly=false){known(cap.capital,'資本');known(cap.loans,'資本家の貸付金');if(!capitalOnly)known(cap.revenue,'収入');while(cap.capital+(capitalOnly?0:cap.revenue)<amount){cap.capital+=50;cap.loans++;}if(capitalOnly)cap.capital-=amount;else{const revenue=Math.min(cap.revenue,amount);cap.revenue-=revenue;cap.capital-=amount-revenue;}}
function payWorking(w,amount){check(known(w.cash,'支払い資金')>=amount,'支払い資金が足りません');w.cash-=amount;}
const defs=()=>[...(root.WCA_COMPANIES||[]),...(root.WCA_EXTRA_COMPANIES||[])];
const def=id=>defs().find(d=>d.id===id);
const built=(r,owner)=>Object.entries(r.companies).filter(([id,c])=>c.status==='built'&&def(id)?.class===owner);
const employed=r=>Object.values(r.companies).reduce((n,c)=>n+(c.status==='built'?c.slots.filter(x=>x.owner==='Working').length:0),0);
const unemployed=r=>Object.values(r.common.unemployed.Working).reduce((n,x)=>n+known(x,'失業労働者'),0);
const unionSkills={Food:'Green',Luxury:'Blue',Health:'White',Education:'Orange',Media:'Purple'};
function companyDefinition(r,id){const d=def(id);return d&&r.companies[id]?.slotProfile==='base-v1.2-initial'?{...d,workers:d.workers.slice(0,2)}:d;}
function workerChoices(r,reassign=false){
 const result=skills.filter(skill=>Number(r.common.unemployed.Working[skill])>0).map(skill=>({ref:`u:${skill}`,skill,count:r.common.unemployed.Working[skill]}));
 if(reassign)for(const [id,c] of Object.entries(r.companies))if(c.status==='built')c.slots.forEach((slot,index)=>{if(slot.owner==='Working'&&!slot.committed)result.push({ref:`c:${id}:${index}`,skill:slot.skill,companyId:id,index});});
 return result;
}
// Resolve all moves together: a source company may be refilled during the same
// action. Remaining workers return to unemployment only after all moves finish.
function assignWorkers(records,plan,limit,unemployedOnly){
 const r=copy(records),allocations=plan.allocations||[],unions=plan.unions||[];
 check(Array.isArray(allocations)&&Array.isArray(unions),'労働者の配置計画が不正です');
 check(allocations.every(a=>a&&Array.isArray(a.slots)&&a.slots.length>0),'企業へ配置する枠を選んでください');
 const count=allocations.reduce((n,a)=>n+a.slots.length,0)+unions.length;
 check(count<=limit,`配置する労働者は最大${limit}人です`);
 check(new Set(allocations.map(a=>a.companyId)).size===allocations.length&&new Set(unions.map(u=>u?.industry)).size===unions.length,'配置先が重複しています');
 const sourceRefs=new Set(),touched=new Set(),destinations=new Set(),moves=[];
 const take=(ref,destination)=>{
  check(typeof ref==='string','配置する労働者を選んでください');const parts=ref.split(':');let skill;
  if(parts.length===2&&parts[0]==='u'){
   skill=parts[1];check(skills.includes(skill)&&Number(r.common.unemployed.Working[skill])>0,'失業労働者が足りません');r.common.unemployed.Working[skill]--;
  }else{
   check(!unemployedOnly,'この配置で使えるのは失業労働者だけです');
   check(parts.length===3&&parts[0]==='c'&&/^\d+$/.test(parts[2]),'移動する労働者が不正です');
   const id=parts[1],index=Number(parts[2]),c=r.companies[id],slot=c?.slots[index];
   check(c?.status==='built'&&slot?.owner==='Working'&&!slot.committed,'誓約中でない自分の労働者を選んでください');
   check(!sourceRefs.has(ref),'同じ労働者を重複して配置できません');check(id!==destination,'同じ企業内の移動では労働者を配置できません');
   sourceRefs.add(ref);skill=slot.skill;c.slots[index]={owner:'empty',skill:companyDefinition(r,id).workers[index].color,committed:false};touched.add(id);
  }
  return skill;
 };
 // Reserve all source workers before checking destination occupancy.
 for(const a of allocations){
  const c=r.companies[a.companyId],d=companyDefinition(r,a.companyId);
  check(c?.status==='built'&&d&&c.slots.length>0,'配置先は設立済みの企業を選んでください');
  check(!c.slots.some(x=>x.owner==='unknown'||x.owner==='Middle'||x.committed),'配置先の労働者・誓約状態を確認してください');
  check(new Set(a.slots.map(x=>x?.index)).size===a.slots.length,'配置先の枠が重複しています');
  for(const slot of a.slots){check(Number.isSafeInteger(slot.index)&&slot.index>=0&&slot.index<c.slots.length,'配置先の枠が不正です');moves.push({companyId:a.companyId,index:slot.index,skill:take(slot.worker,a.companyId)});}
  destinations.add(a.companyId);touched.add(a.companyId);
 }
 const unionMoves=unions.map(u=>{check(u&&unionSkills[u.industry]&&!r.personal.Working.unions[u.industry],'この労働組合は設立できません');const skill=take(u.worker);check(skill===unionSkills[u.industry],'労働組合に必要な技能と一致しません');return u;});
 for(const move of moves){
  const c=r.companies[move.companyId],d=companyDefinition(r,move.companyId),req=d.workers[move.index];
  check(c.slots[move.index].owner==='empty','配置先の枠にいる労働者も別の配置先へ移動してください');
  check(req.type!=='MiddleClass'&&(req.type!=='Skilled'||req.color===move.skill),'必要な技能と一致しません');
  c.slots[move.index]={owner:'Working',skill:move.skill,committed:true};
 }
 for(const id of touched){
  const c=r.companies[id],old=records.companies[id];
  if(c.slots.some(x=>x.owner==='empty')){
   check(!destinations.has(id),'企業の全スロットを同時に埋めてください');
   for(const slot of c.slots)if(slot.owner==='Working'){check(!slot.committed,'誓約中の労働者がいる企業から移動できません');r.common.unemployed.Working[slot.skill]++;}
   c.slots=c.slots.map((slot,index)=>({owner:'empty',skill:companyDefinition(r,id).workers[index].color,committed:false}));c.operating='no';c.strike=false;
  }else{
   c.operating='yes';
   // An already fully staffed company that remains staffed is a worker swap:
   // the incoming and retained workers all remain uncommitted (rulebook FAQ).
   const wasStaffed=old.slots.every(x=>x.owner==='Working');
   for(const slot of c.slots)slot.committed=!wasStaffed;
  }
 }
 const employedIn=industry=>Object.entries(r.companies).reduce((n,[id,c])=>n+(c.status==='built'&&def(id).industry===industry?c.slots.filter(x=>x.owner==='Working').length:0),0);
 for(const u of unionMoves){check(employedIn(u.industry)>=4,'組合設立には同じ産業で働く労働者4人が必要です');r.personal.Working.unions[u.industry]=true;r.personal.Working.values.vp=known(r.personal.Working.values.vp,'VP')+2;}
 reconcileUnions(r);
 return root.WCARecords.validate(r);
}
function reconcileUnions(r){
 for(const [industry,active] of Object.entries(r.personal.Working.unions))if(active){const count=Object.entries(r.companies).reduce((n,[id,c])=>n+(c.status==='built'&&def(id)?.industry===industry?c.slots.filter(slot=>slot.owner==='Working').length:0),0);if(count<4){r.personal.Working.unions[industry]=false;r.common.unemployed.Working[unionSkills[industry]]=known(r.common.unemployed.Working[unionSkills[industry]],'失業労働者')+1;}}
}
function stoppedCompany(r,id){const c=r.companies[id],d=companyDefinition(r,id);check(d?.class==='Capitalist'&&c?.status==='built'&&c.operating==='no'&&d.workers.length>0&&c.slots.every(slot=>slot.owner==='empty'),'全枠が空いている自分の非稼働企業を選んでください');return d;}
function publicTransferSlots(r,sourceId,targetId){
 const source=r.companies[sourceId],target=companyDefinition(r,targetId);
 if(def(sourceId)?.class!=='State'||source?.status!=='built'||source.operating!=='yes'||!target||source.slots.length!==target.workers.length||!source.slots.every((slot,index)=>slot.owner==='Working'&&!slot.committed&&(companyDefinition(r,sourceId).workers[index].type!=='Skilled'||companyDefinition(r,sourceId).workers[index].color===slot.skill)))return null;
 const match=(index,used,slots)=>{if(index===target.workers.length)return slots;const req=target.workers[index];for(let i=0;i<source.slots.length;i++)if(!used.includes(i)&&req.type!=='MiddleClass'&&(req.type!=='Skilled'||req.color===source.slots[i].skill)){const result=match(index+1,[...used,i],[...slots,{...source.slots[i],committed:true}]);if(result)return result;}return null;};
 return match(0,[],[]);
}
function buildCompany(records,positions,plan,half=false,investmentMode=null){
 records=copy(records);
 const d=def(plan.companyId);check(d?.class==='Capitalist'&&(!half||['Food','Luxury'].includes(d.industry)),half?'食料または贅沢品の資本家企業を選んでください':'資本家企業を選んでください');
 if(investmentMode==='search'){check(root.WCARecords.marketCandidates(records).some(candidate=>candidate.id===d.id),'未使用の企業山札から選んでください');records.companies[d.id].status='market';}
 check(records.companies[d.id]?.status==='market','資本家の企業市場から選んでください');
 const workers=plan.workers||[],hasWages=Object.keys(d.wages||{}).length>0,minimum=({A:3,B:2,C:1})[positions[2]],wage=hasWages?plan.wage:'unknown';
 check(Array.isArray(workers)&&(workers.length===0||workers.length===d.workers.length),'設立時は企業の全スロットを埋めてください');
 check(!hasWages||['L1','L2','L3'].includes(wage)&&Number(wage.slice(1))>=minimum,'賃金は政策2の最低賃金以上にしてください');
 for(const key of ['revenue','capital','loans'])known(records.personal.Capitalist.values[key],'資本家の'+key);if(half)for(const key of ['cash','loans'])known(records.personal.State.values[key],'国家の'+key);
 const common=copy(records.common),slots=d.workers.map((req,index)=>{
  if(!workers.length)return {owner:'empty',skill:req.color,committed:false};
  const skill=workers[index];check(skills.includes(skill)&&(req.type!=='Skilled'||req.color===skill),'必要な技能と一致しません');
  check(Number(common.unemployed.Working[skill])>0,'失業労働者が足りません');common.unemployed.Working[skill]--;return {owner:'Working',skill,committed:true};
 });
 if(workers.length){const unskilled=d.workers.filter(req=>req.type!=='Skilled').length,gray=Math.min(known(records.common.unemployed.Working.Gray,'未熟練失業者'),unskilled);check(workers.filter(skill=>skill==='Gray').length===gray,'設立時の未熟練枠は未熟練失業者を優先してください');}
 const value={status:'built',wage,operating:d.workers.length===0||workers.length?'yes':'no',machinery:false,strike:false,note:'',slots};
 const discount=investmentMode==='discount'?Math.min(10,d.cost):0;
 if(investmentMode==='search')payCap(records.personal.Capitalist.values,10);
 return root.WCARecords.applyCapitalistBuild(records,d.id,value,common,{capitalistCost:half?Math.ceil(d.cost/2):d.cost-discount,stateCost:half?Math.floor(d.cost/2):0,discount});
}
function purchase(r,s,resource,source,qty,discount=false,subsidy=false,owner='Working'){
 const w=r.personal[owner].values;number(qty,'購入数');check(qty<=w.population,'購入数は人口までです');
 let stock,price,seller;
 if(source==='State'){
  stock=r.common.values;price=resource==='influence'?5:({A:0,B:5,C:10})[s.positions[resource==='health'?4:5]];seller=r.personal.State.values;
 }else{check(source==='Capitalist'&&['food','health','education','luxury'].includes(resource),'購入先が不正です');stock=r.personal.Capitalist.values;price=known(stock[resource+'Price'],'販売価格');seller=stock;}
 check(known(stock[resource],'販売元在庫')>=qty,'販売元の在庫が足りません');
 const total=price*qty,cost=discount?Math.ceil(total/2):total;
 payWorking(w,cost);stock[resource]-=qty;const destination=owner==='Middle'&&resource!=='influence'?'consumed'+resource[0].toUpperCase()+resource.slice(1):resource;w[destination]=known(w[destination],resource)+qty;
 if(subsidy)payState(r,total-cost);
 const key=source==='State'?'cash':'revenue';seller[key]=known(seller[key],'販売収入')+(subsidy?total:cost);
 return {cost,qty};
}
function exportTransactions(records,indices,allowed=['food','luxury','health','education']){
 check(Array.isArray(indices)&&new Set(indices).size===indices.length,'輸出取引を重複させずに選んでください');let r=copy(records);
 for(const index of indices){const offer=r.trade.exportCard.offers[index];check(Number.isSafeInteger(index)&&offer&&allowed.includes(offer.resource),'輸出カードの取引が不正です');r=root.WCARecords.applyCapitalistExport(r,offer.resource,offer.quantity,offer.revenue);}return r;
}
function revealExport(s,played){
 check(played?.owner==='Capitalist'&&played.definition.id==='cc_foreign_market_insight'&&!s.pendingPlayerCard,'このカードでは輸出カードを公開できません');
 const revealed=[root.WCA.drawTradeCards(s,0).exportCard,root.WCA.drawTradeCards(s,0).exportCard];
 s.pendingPlayerCard={owner:'Capitalist',uid:played.uid,cardId:played.definition.id,revealed};
}
function applyEffect(s,owner,c,plan={}){
 const a=availability(s,owner,c.id);check(a.ready,a.reason);
 check(owner==='Middle'?root.MiddleClass?.isThree(s.records):s.records.participants.Middle==='absent'&&s.records.participants.State==='absent','この階級のカード効果は現在の人数設定に対応していません');
 let production=null,machinery=null,companySearch=null,tradeEffect=null,r=copy(s.records);const w=r.personal.Working.values,cap=r.personal.Capitalist.values,state=r.personal.State.values;
 const bases={unemployed_workers:unemployed(r),assigned_workers:employed(r),companies_owned:built(r,'Capitalist').length};
 const addVotes=(who,n)=>{const key=voteKeys[who];r.common.values[key]=Math.max(0,known(r.common.values[key],'袋の外の投票駒')-n);};
 switch(a.effect){
 case 'branding':case 'foodCrisis':{
  r=exportTransactions(r,plan.transactions||[]);
  const key=a.effect==='branding'?'luxury':'food',limit=a.effect==='branding'?6:4,price=a.effect==='branding'?10:15,qty=number(plan.qty??0,'追加販売数');check(qty<=limit,'追加販売数が上限を超えています');
  check((plan.transactions||[]).length>0||qty>0,'輸出取引か追加販売を1つ以上選んでください');
  if(qty)r=root.WCARecords.applyCapitalistExport(r,key,qty,qty*price);break;
 }
 case 'foreignPartner':{
  check(Number.isSafeInteger(plan.dealIndex)&&r.trade.businessDeals[plan.dealIndex],'商取引カードを選んでください');
  for(const key of ['revenue','capital','loans','food','luxury','foodStorage','luxuryStorage','freeTradeFood','freeTradeLuxury'])known(cap[key],'資本家の'+key);
  known(state.cash,'国庫');r.trade=root.WCARecords.tradeData(r.trade);const deal=r.trade.businessDeals[plan.dealIndex];check(deal.food+deal.luxury>0,'商取引カードの商品数量を確認してください');
  const importedBefore={food:cap.food,luxury:cap.luxury,freeTradeFood:cap.freeTradeFood,freeTradeLuxury:cap.freeTradeLuxury},purchaseResult=root.WCARecords.applyCapitalistPurchase(r,{source:'BusinessDeal',dealIndex:plan.dealIndex,destination:plan.destination},s.positions[6]);r=purchaseResult.records;
  const imported=r.personal.Capitalist.values;
  if(plan.destination==='regular')for(const [key,capacity] of [['food',8],['luxury',12]])imported[key]=Math.min(imported[key],capacity*(1+imported[key+'Storage']));
  const losses={};for(const key of ['food','luxury']){const storageKey=plan.destination==='regular'?key:key==='food'?'freeTradeFood':'freeTradeLuxury';losses[key]=importedBefore[storageKey]+deal[key]-imported[storageKey];}
  r=exportTransactions(r,plan.transactions||[],['food','luxury']);tradeEffect={type:'foreignPartner',deal:copy(deal),destination:plan.destination,total:purchaseResult.total,tariff:purchaseResult.tariff,losses};break;
 }
 case 'exportInsight':{
  validate(s);const pending=s.pendingPlayerCard;check(pending?.cardId===c.id&&pending.owner===owner,'先に輸出カード2枚を公開してください');
  check([-1,0,1].includes(plan.choice),'現在の輸出カードを維持するか、公開したカードを選んでください');
  if(plan.choice!==-1)r.trade.exportCard=copy(pending.revealed[plan.choice]);
  r=exportTransactions(r,plan.transactions||[]);
  tradeEffect={type:'exportInsight',revealed:copy(pending.revealed),choice:plan.choice};break;
 }
 case 'deregulation':r=assignWorkers(r,plan,root.WCARecords.workingWorkerCount(r),s.positions[2]!=='C');break;
 case 'employmentGrant':{
  const d=stoppedCompany(r,plan.companyId);
  check(Number.isSafeInteger(d.wages?.[r.companies[d.id].wage]),'配置先の賃金を確認してください');
  check(Array.isArray(plan.workers)&&plan.workers.length===d.workers.length,'企業の全スロットへ配置する失業労働者を選んでください');
  r=assignWorkers(r,{allocations:[{companyId:d.id,slots:plan.workers.map((skill,index)=>({index,worker:`u:${skill}`}))}]},d.workers.length,true);
  const amount=d.workers.length*5;payState(r,amount);r.personal.Capitalist.values.revenue=known(r.personal.Capitalist.values.revenue,'収入')+amount;break;
 }
 case 'foreignRecruitment':{
  const d=stoppedCompany(r,plan.companyId);
  check(Number.isSafeInteger(d.wages?.[r.companies[d.id].wage]),'配置先の賃金を確認してください');
  check(root.WCARecords.workingWorkerCount(r)+d.workers.length<=48,'労働者サプライの残り人数が足りません');
  payCap(cap,10);const company=r.companies[d.id];company.slots=d.workers.map(req=>({owner:'Working',skill:req.type==='Skilled'?req.color:'Gray',committed:true}));company.operating='yes';break;
 }
 case 'competitiveWages':{
  const d=stoppedCompany(r,plan.companyId),slots=publicTransferSlots(r,plan.sourceId,d.id);
  check(!r.companies[plan.sourceId]?.slots.some(slot=>slot.owner!=='empty'&&slot.committed),'誓約中の労働者は移せません');
  check(slots,'必要人数と技能が一致する稼働中の公共企業を選んでください');
  const source=r.companies[plan.sourceId],sourceDef=companyDefinition(r,plan.sourceId),target=r.companies[d.id];
  source.slots=sourceDef.workers.map(req=>({owner:'empty',skill:req.color,committed:false}));source.operating='no';source.strike=false;
  target.wage='L3';target.slots=slots;target.operating='yes';reconcileUnions(r);break;
 }
 case 'investment':{
  if(owner==='Middle'){
   check(['discount','search'].includes(plan.mode),'市場の割引設立か企業山札の検索を選んでください');
   const d=def(plan.companyId),company=r.companies[plan.companyId],search=plan.mode==='search';
   check(d?.class==='Middle'&&company?.status===(search?'unbuilt':'market')&&(!search||root.MiddleClass.candidates(r).some(x=>x.id===d.id)),'中産階級の企業市場または企業山札から選んでください');
   if(search)company.status='market';
   r=root.MiddleClass.basic(r,s.positions,{action:'BC',id:d.id,workers:plan.workers,wage:plan.wage,employee:plan.employee},{buildCost:search?d.cost+8:Math.max(0,d.cost-8)});
   if(search)companySearch={companyId:d.id,shuffleRequired:true};break;
  }
  check(['discount','search'].includes(plan.mode),'市場の割引設立か企業山札の検索を選んでください');
  r=buildCompany(r,s.positions,plan,false,plan.mode);
  if(plan.mode==='search')companySearch={companyId:plan.companyId,shuffleRequired:true};
  break;
 }
 case 'technology':{
  check([1,2].includes(plan.qty),'機械化トークンは1枚または2枚を選んでください');
  const remaining=6-Object.values(r.companies).filter(company=>company.status==='built'&&company.machinery).length;
  check(plan.qty<=remaining,'機械化トークンの残り枚数が足りません');
  const eligible=built(r,'Capitalist').filter(([id,company])=>!company.machinery&&Number(def(id).production.machinery_bonus||0)>0).map(([id])=>id),ids=plan.companyIds;
  check(Array.isArray(ids)&&ids.length===Math.min(plan.qty,eligible.length)&&new Set(ids).size===ids.length&&ids.every(id=>eligible.includes(id)),'必要な枚数分、異なる機械化可能な自分の企業を選んでください');
  const cost=plan.qty===1?20:45;payCap(cap,cost);
  for(const id of ids)r.companies[id].machinery=true;
  machinery={quantity:plan.qty,placed:ids.length,lost:plan.qty-ids.length,cost};
  break;
 }
 case 'businessExpansion':{
  check(Array.isArray(plan.builds)&&plan.builds.length===2&&plan.builds.every(item=>item&&typeof item.companyId==='string')&&new Set(plan.builds.map(item=>item?.companyId)).size===2,'事業拡大は異なる企業2社を選んでください');
  const candidates=root.WCARecords.marketCandidates(r).map(d=>d.id),adds=plan.marketAdds;
  check(Array.isArray(adds)&&adds.length===Math.min(2,candidates.length)&&new Set(adds).size===adds.length&&adds.every(id=>candidates.includes(id)),'企業山札から異なる2枚（残り枚数まで）を補充してください');
  for(const item of plan.builds)r=buildCompany(r,s.positions,item);
  for(const id of adds)r.companies[id].status='market';
  break;
 }
 case 'generalStrike':{
  const ids=plan.companyIds,limit=2+Object.values(r.personal.Working.unions).filter(Boolean).length;
  check(Array.isArray(ids)&&ids.length>=1&&ids.length<=limit&&new Set(ids).size===ids.length,`ゼネストは異なる企業1〜${limit}社を選んでください`);
  check(Object.values(r.companies).filter(company=>company.status==='built'&&company.strike).length+ids.length<=7,'ストライキトークンは盤面全体で7枚までです');
  // Reuse basic strike eligibility and commitment rules, two targets at a time.
  for(let i=0;i<ids.length;i+=2)r=root.WCARecords.applyWorkingBasic(r,{action:'STR',companyIds:ids.slice(i,i+2)},s.positions);
  break;
 }
 case 'extraShift':case 'publicOvertime':{
  const d=def(plan.companyId),company=r.companies[plan.companyId],publicCard=a.effect==='publicOvertime';
  check(d?.class===(publicCard?'State':'Capitalist')&&company?.status==='built'&&company.operating==='yes','稼働中の'+(publicCard?'公共':'自分の')+'企業を選んでください');
  check(publicCard||d.workers.length>0&&!d.tags?.includes('Automated'),'追加シフトでは自動化企業を選べません');
  check(company.slots.length>0&&company.slots.every(slot=>publicCard&&owner==='Middle'?['Working','Middle'].includes(slot.owner):slot.owner==='Working'),'配置された労働者を確認してください');
  check(!company.strike||company.wage==='L3','ストライキ中の企業は生産できません');
  check(Number.isSafeInteger(d.wages?.[company.wage]),'賃金を確認してください');
  known((publicCard?r.personal[owner].values:w).cash,'プレイヤーの資金');if(publicCard){known(state.cash,'国庫');known(state.loans,'国家の貸付金');}else{known(cap.revenue,'収入');known(cap.capital,'資本');known(cap.loans,'資本家の貸付金');}
  const key=d.production.resource.toLowerCase();known(publicCard?r.common.values[key]:cap[key],'生産先の在庫');
  if(!publicCard){known(cap[key+'Storage'],'倉庫');if(['food','luxury'].includes(key))known(cap[key==='food'?'freeTradeFood':'freeTradeLuxury'],'自由貿易エリアの在庫');}
  const result=root.WCARecords.applyCompanyProduction(r,d.id);r=result.records;
  production={companyId:d.id,resource:key,amount:result.preview.amount,wage:result.preview.wage,storage:result.storage};
  if(publicCard&&plan.qty!==undefined)purchase(r,s,key,'State',plan.qty,false,false,owner);
  break;
 }
 case 'housing':check(!plan.target||plan.target==='Capitalist','2人戦では資本家への支払いを選んでください');payWorking(w,20);cap.revenue=known(cap.revenue,'収入')+20;w.vp=known(w.vp,'VP')+5;break;
 case 'discountHealth':purchase(r,s,'health','State',plan.qty,true,false,owner);break;
 case 'discountEducation':purchase(r,s,'education','State',plan.qty,true,false,owner);break;
 case 'influence':purchase(r,s,'influence','State',3,false,false,owner);break;
 case 'tourism':purchase(r,s,'luxury','Capitalist',plan.qty,true,true);break;
 case 'populationVotes':addVotes('Working',known(w.population,'人口'));break;
 case 'specialization':{
  check(skills.includes(plan.skill)&&plan.skill!=='Gray','獲得する熟練技能を選んでください');
  r.common.unemployed.Working[plan.skill]=known(r.common.unemployed.Working[plan.skill],'失業労働者')+1;
  r=assignWorkers(r,plan,3,false);break;
 }
 case 'signingBonus':{
  r=assignWorkers(r,plan,4,true);
  for(const allocation of plan.allocations||[]){const owner=def(allocation.companyId).class,amount=allocation.slots.length*4;
   if(owner==='Capitalist')payCap(r.personal.Capitalist.values,amount);else if(owner==='State')payState(r,amount);else check(owner==='Working','支払う企業所有者に対応していません');
   // A cooperative farm is owned by Working; paying oneself has no net effect.
   if(owner!=='Working')r.personal.Working.values.cash=known(r.personal.Working.values.cash,'資金')+amount;
  }break;
 }
 case 'industrialization':r=buildCompany(r,s.positions,plan,true);break;
 case 'campaign':payCap(cap,15);addVotes('Capitalist',6);break;
 case 'island':payCap(cap,50,true);state.cash=known(state.cash,'国庫')+50;cap.vp=known(cap.vp,'VP')+7;break;
 case 'offshore':{const amount=Math.floor(known(cap.revenue,'収入')/2);cap.revenue-=amount;cap.capital=known(cap.capital,'資本')+amount;break;}
 case 'industryVotes':addVotes('Capitalist',built(r,'Capitalist').filter(([id])=>def(id).industry==='Food'||s.positions[6]==='A'&&def(id).industry==='Luxury').length*2);break;
 case 'grants':{const amount=bases.companies_owned*5;payState(r,amount);cap.revenue=known(cap.revenue,'収入')+amount;break;}
 case 'accident':{
  check(['Food','Luxury','Health','Education','Media'].includes(plan.industry),'産業を選んでください');
  const count=built(r,'Capitalist').filter(([id,c])=>def(id).industry===plan.industry&&c.slots.some(x=>x.owner==='Working')).length;
  payCap(cap,count*8);w.cash=known(w.cash,'資金')+count*8;break;
 }
 case 'sellHealth':case 'sellEducation':case 'sellLuxury':{
  const resource={sellHealth:'health',sellEducation:'education',sellLuxury:'luxury'}[a.effect],limit=owner==='Middle'||resource==='luxury'?6:9,qty=number(plan.qty,'売却数'),seller=r.personal[owner].values;
  check(qty<=limit&&known(seller[resource],'売却在庫')>=qty,'売却数が上限または在庫を超えています');
  payState(r,qty*10);seller[resource]-=qty;const income=owner==='Middle'?'cash':'revenue';seller[income]=known(seller[income],'販売収入')+qty*10;
  const stock=resource==='luxury'?state:r.common.values;stock[resource]=known(stock[resource],'国家在庫')+qty;
  bases[resource==='health'?'healthcare_sold_to_state':resource==='education'?'education_sold_to_state':'luxury_sold_to_state']=qty;
  if(resource==='luxury')cap.influence=known(cap.influence,'影響力')+1;break;
 }
 case 'immigration':{
  check(bases.unemployed_workers>=4,'失業労働者が4人以上必要です');
  const selected=plan.workers;check(Array.isArray(selected)&&selected.length<=2,'取り除く失業労働者は最大2人です');
  check(root.WCARecords.workingWorkerCount(r)-selected.length>=10,'労働者総数の最低値10人を下回ります');
  for(const skill of selected){check(skills.includes(skill)&&r.common.unemployed.Working[skill]>0,'選んだ失業労働者が足りません');r.common.unemployed.Working[skill]--;w.cash=known(w.cash,'資金')+(skill==='Gray'?5:10);}break;
 }
 case 'farm':{
  check(bases.unemployed_workers>=3,'失業労働者が3人以上必要です');
  const d=defs().find(d=>d.class==='Working'&&r.companies[d.id]?.status==='unbuilt');check(d,'未設立の共同農場がありません');
  check(Array.isArray(plan.workers)&&plan.workers.length===3,'共同農場へ配置する失業労働者3人を選んでください');
  const company=r.companies[d.id];company.slots=plan.workers.map(skill=>{check(skills.includes(skill)&&r.common.unemployed.Working[skill]>0,'失業労働者が足りません');r.common.unemployed.Working[skill]--;return {owner:'Working',skill,committed:true};});
  company.status='built';company.operating='yes';company.wage='unknown';break;
 }
 case 'exit':{
  const d=def(plan.companyId),company=r.companies[plan.companyId];check(d?.class==='Capitalist'&&company?.status==='built'&&d.workers.length>0&&!d.tags?.includes('Automated'),'非自動化の自分の企業を選んでください');
  r=root.WCARecords.applyCapitalistSell(r,d.id,d.cost*2);break;
 }
 case 'unemploymentIncome':case 'employmentIncome':{
  const amount=a.effect==='unemploymentIncome'?bases.unemployed_workers*5:bases.assigned_workers;
  payState(r,amount);w.cash=known(w.cash,'資金')+amount;
  if(plan.purchase){if(a.effect==='unemploymentIncome')check(plan.purchase.purchases?.every(p=>p.source==='State'),'失業給付の購入先は国家です');r=root.WCARecords.applyWorkingBasic(r,{action:'BGS',resource:plan.purchase.resource,purchases:plan.purchase.purchases},s.positions);}break;
 }
 default:throw Error('このカード効果は未対応です');
 }
 if(['specialization','signingBonus','industrialization','businessExpansion','investment','deregulation','employmentGrant','foreignRecruitment','competitiveWages'].includes(a.effect)&&r.common.tokens.demonstration&&!root.WCARecords.demonstrationStatus(r).eligible)r.common.tokens.demonstration=false;
 // Legitimacy changes belong to the State player's tracks. In the supported
 // two- and three-player modes the State is absent: record but do not apply the bonus.
 const legitimacy=bonusAmount(c.bonus,bases);
 s.records=root.WCARecords.validate(r);
 s.lastPlayerCard={id:c.id,owner,production,machinery,companySearch,tradeEffect,legitimacy,legitimacyApplied:false,source:'ユーザー提供 v6 JSON／基本ルール v1.2：正当性は国家参加時のみ'};
 if(a.effect==='exportInsight')delete s.pendingPlayerCard;
 return s;
}
const api={catalog,card,definition,allCopies,shuffled,create,validate,activeOwner,mainEvents,consume,replenish,availability,bonusAmount,applyEffect,effects,companyDefinition,workerChoices,publicTransferSlots,revealExport};
root.PlayerCards=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
