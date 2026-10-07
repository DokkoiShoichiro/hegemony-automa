(function(root){
'use strict';
// Phase 1: base cards and the effects listed below. C&C data is retained in the
// catalog, but is not mixed into the playable deck until its effects are ready.
const classKeys={Working:'working_class',Capitalist:'capitalist_class'};
const voteKeys={Working:'workingVotesOutside',Capitalist:'capitalistVotesOutside'};
const skills=['Gray','Green','Blue','White','Orange','Purple'];
const copy=x=>JSON.parse(JSON.stringify(x));
const check=(ok,message)=>{if(!ok)throw Error(message);};
const effects={
 wc_affordable_housing:'housing',wc_healthcare_benefits:'discountHealth',wc_state_scholarship:'discountEducation',
 wc_highlight_social_issues:'influence',wc_boost_domestic_tourism:'tourism',wc_workplace_accident:'accident',
 wc_proletarians_unite:'populationVotes',wc_immigration:'immigration',wc_cooperative_farm:'farm',
 wc_unemployment_benefits:'unemploymentIncome',wc_supplemental_income_program:'employmentIncome',
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
 const p=s.playerCards;if(p===undefined)return;
 check(p?.version===1&&p.classes&&typeof p.used==='boolean','プレイヤーカードの保存形式が不正です');
 const humans=Object.keys(classKeys).filter(owner=>s.records?.participants[owner]==='human');
 check(Object.keys(p.classes).length===humans.length&&humans.every(owner=>p.classes[owner]),'手札を管理する階級が不正です');
 for(const owner of humans){const c=p.classes[owner];check(c&&['deck','hand','discard'].every(k=>Array.isArray(c[k])),'山札・手札・捨て札が不正です');check(validOrder(owner,[...c.deck,...c.hand,...c.discard]),'アクションカードに重複・欠落があります');check(c.hand.length<=7,'手札は7枚までです');}
}
const activeOwner=s=>s.automaClass==='Capitalist'?'Working':'Capitalist';
const mainEvents=new Set(['workingBasic','workingPolicy','playerPolicy','playerPurchase','playerBuild','playerSell','playerExport','playerLobby','playerPressure','playerCardEffect']);
function consume(s,e){
 check(s.phase==='player'&&s.records?.participants[activeOwner(s)]==='human','プレイヤーの手番ではありません');
 check(!s.playerCards.used,'この手番のメインアクションは実行済みです');
 const owner=activeOwner(s),c=s.playerCards.classes[owner],index=c.hand.indexOf(e.cardUid);
 check(index>=0,'使用する手札のカードを選んでください');
 if(owner==='Working')check(['workingBasic','workingPolicy','playerCardEffect'].includes(e.type),'労働者のアクションではありません');
 else check(!['workingBasic','workingPolicy'].includes(e.type),'資本家のアクションではありません');
 c.hand.splice(index,1);c.discard.push(e.cardUid);s.playerCards.used=true;
 // workingBasic/workingPolicy perform their own legacy one-action check.
 return {owner,definition:card(owner,e.cardUid)};
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
function payWorking(w,amount){check(known(w.cash,'労働者の資金')>=amount,'支払い資金が足りません');w.cash-=amount;}
const defs=()=>[...(root.WCA_COMPANIES||[]),...(root.WCA_EXTRA_COMPANIES||[])];
const def=id=>defs().find(d=>d.id===id);
const built=(r,owner)=>Object.entries(r.companies).filter(([id,c])=>c.status==='built'&&def(id)?.class===owner);
const employed=r=>Object.values(r.companies).reduce((n,c)=>n+(c.status==='built'?c.slots.filter(x=>x.owner==='Working').length:0),0);
const unemployed=r=>Object.values(r.common.unemployed.Working).reduce((n,x)=>n+known(x,'失業労働者'),0);
function purchase(r,s,resource,source,qty,discount=false,subsidy=false){
 const w=r.personal.Working.values;number(qty,'購入数');check(qty<=w.population,'購入数は人口までです');
 let stock,price,seller;
 if(source==='State'){
  stock=r.common.values;price=resource==='influence'?5:({A:0,B:5,C:10})[s.positions[resource==='health'?4:5]];seller=r.personal.State.values;
 }else{check(source==='Capitalist'&&['food','health','education','luxury'].includes(resource),'購入先が不正です');stock=r.personal.Capitalist.values;price=known(stock[resource+'Price'],'販売価格');seller=stock;}
 check(known(stock[resource],'販売元在庫')>=qty,'販売元の在庫が足りません');
 const total=price*qty,cost=discount?Math.ceil(total/2):total;
 payWorking(w,cost);stock[resource]-=qty;w[resource]=known(w[resource],resource)+qty;
 if(subsidy)payState(r,total-cost);
 const key=source==='State'?'cash':'revenue';seller[key]=known(seller[key],'販売収入')+(subsidy?total:cost);
 return {cost,qty};
}
function applyEffect(s,owner,c,plan={}){
 const a=availability(s,owner,c.id);check(a.ready,a.reason);
 check(s.records.participants.Middle==='absent'&&s.records.participants.State==='absent','この段階のプレイヤーカード効果は2人戦に対応しています');
 let r=copy(s.records);const w=r.personal.Working.values,cap=r.personal.Capitalist.values,state=r.personal.State.values;
 const bases={unemployed_workers:unemployed(r),assigned_workers:employed(r),companies_owned:built(r,'Capitalist').length};
 const addVotes=(who,n)=>{const key=voteKeys[who];r.common.values[key]=Math.max(0,known(r.common.values[key],'袋の外の投票駒')-n);};
 switch(a.effect){
 case 'housing':check(!plan.target||plan.target==='Capitalist','2人戦では資本家への支払いを選んでください');payWorking(w,20);cap.revenue=known(cap.revenue,'収入')+20;w.vp=known(w.vp,'VP')+5;break;
 case 'discountHealth':purchase(r,s,'health','State',plan.qty,true);break;
 case 'discountEducation':purchase(r,s,'education','State',plan.qty,true);break;
 case 'influence':purchase(r,s,'influence','State',3);break;
 case 'tourism':purchase(r,s,'luxury','Capitalist',plan.qty,true,true);break;
 case 'populationVotes':addVotes('Working',known(w.population,'人口'));break;
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
  const resource={sellHealth:'health',sellEducation:'education',sellLuxury:'luxury'}[a.effect],limit=resource==='luxury'?6:9,qty=number(plan.qty,'売却数');
  check(qty<=limit&&known(cap[resource],'売却在庫')>=qty,'売却数が上限または在庫を超えています');
  payState(r,qty*10);cap[resource]-=qty;cap.revenue=known(cap.revenue,'収入')+qty*10;
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
 // Legitimacy changes belong to the State player's tracks. In two-player
 // games the State is absent, so we preserve the bonus but do not apply it.
 const legitimacy=bonusAmount(c.bonus,bases);
 s.records=root.WCARecords.validate(r);
 s.lastPlayerCard={id:c.id,owner,legitimacy,legitimacyApplied:false,source:'ユーザー提供 v6 JSON／基本ルール v1.2：正当性は国家参加時のみ'};
 return s;
}
const api={catalog,card,definition,allCopies,shuffled,create,validate,activeOwner,mainEvents,consume,replenish,availability,bonusAmount,applyEffect,effects};
root.PlayerCards=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
