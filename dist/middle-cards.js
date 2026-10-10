(function(root){
'use strict';
// Source: user-provided hegemony_action_cards_full_v6_bonus_fixed.json, Middle base cards.
// Basic actions retain base rulebook v1.2 pp.22–25; optional payments cannot create loans (p.33).
const M=root.MiddleClass,R=root.WCARecords,copy=x=>JSON.parse(JSON.stringify(x));
const skills=['Gray','Green','Blue','White','Orange','Purple'],resources=['food','luxury','health','education'];
const check=(ok,message)=>{if(!ok)throw Error(message);};
const integer=(n,label)=>{check(Number.isSafeInteger(n)&&n>=0,label+'は0以上の整数です');return n;};
function payState(r,amount){const v=r.personal.State.values;integer(v.cash,'国庫');integer(v.loans,'国家の貸付金');while(v.cash<amount){v.cash+=50;v.loans++;}v.cash-=amount;}
function grant(r,amount){payState(r,amount);r.personal.Middle.values.cash+=amount;}
function employees(r){return Object.entries(r.companies).filter(([id,c])=>M.definition(r,id)?.class==='Middle'&&c.status==='built'&&c.slots.some(x=>x.owner==='Working')).map(([id])=>id);}
function external(r){return Object.entries(r.companies).filter(([id,c])=>['State','Capitalist'].includes(M.definition(r,id)?.class)&&c.status==='built'&&c.slots.some(x=>x.owner==='Middle'));}
function staff(records,moves){const r=copy(records);check(Array.isArray(moves)&&moves.length<=3,'従業員の配置は最大3人です');const used=new Set();for(const move of moves){const c=r.companies[move.companyId],d=M.definition(r,move.companyId),i=move.index,skill=move.skill,key=move.companyId+':'+i;
 check(!used.has(key),'同じ従業員枠を重複して選べません');used.add(key);check(d?.class==='Middle'&&c?.status==='built'&&c.operating==='yes'&&Number.isSafeInteger(i)&&d.workers[i]?.type!=='MiddleClass'&&c.slots[i]?.owner==='empty','操業中の自分の企業の空き従業員枠を選んでください');
 check(skills.includes(skill)&&r.common.unemployed.Working[skill]>0&&(d.workers[i].type==='Unskilled'||d.workers[i].color===skill),'必要な技能を持つ労働者階級の失業者が足りません');r.common.unemployed.Working[skill]--;c.slots[i]={owner:'Working',skill,committed:true};
 }return R.validate(r);}
function exportGoods(records,counts,max){const r=copy(records),offers=r.trade.exportCard.offers,m=r.personal.Middle.values;check(Array.isArray(counts)&&counts.length===offers.length,'輸出取引の回数を選んでください');let total=0;for(let i=0;i<counts.length;i++){const n=integer(counts[i],'輸出回数'),offer=offers[i];check(n<=max,'各輸出取引は最大'+max+'回です');if(!n)continue;check(resources.includes(offer.resource)&&m[offer.resource]>=offer.quantity*n,'販売用倉庫の輸出在庫が足りません');m[offer.resource]-=offer.quantity*n;m.cash+=offer.revenue*n;m.vp+=n;total+=n;}check(total>0,'輸出取引を1つ以上選んでください');return {records:R.validate(r),transactions:total};}
function build(records,positions,plan,options={}){const r=copy(records),d=M.definition(r,plan.companyId);check(d?.class==='Middle'&&r.companies[d.id]?.status==='market','中産階級の企業市場から選んでください');const selected=plan.workers;check(Array.isArray(selected),'設立に必要な労働者を選んでください');let workers=selected;
 if(options.supply){const fromSupply=selected.filter(ref=>typeof ref==='string'&&ref.startsWith('supply:'));check(fromSupply.length===1,'サプライから熟練労働者1人を使ってください');const skill=fromSupply[0].split(':')[1];check(skills.includes(skill)&&skill!=='Gray','サプライの熟練技能を選んでください');r.common.unemployed.Middle[skill]++;workers=selected.map(ref=>ref===fromSupply[0]?'u:'+skill:ref);}
 const cost=options.statePays?0:Math.max(0,d.cost-(options.discount||0));if(options.statePays)payState(r,d.cost);
 return M.basic(r,positions,{action:'BC',id:d.id,workers,wage:plan.wage,employee:plan.employee},{buildCost:cost});}
function apply(s,c,plan={}){check(M.isThree(s.records),'中産階級の3人戦ではありません');const available=root.PlayerCards.availability(s,'Middle',c.id);check(available.ready,available.reason);let r=copy(s.records),m=r.personal.Middle.values,bases={},tradeEffect=null;
 switch(c.id){
 case 'mc_foreign_market_insight':{root.PlayerCards.validate(s);const p=s.pendingPlayerCard;check(p?.owner==='Middle'&&p.cardId===c.id,'先に輸出カード1枚を公開してください');check([-1,0].includes(plan.choice),'現在の輸出カードか公開したカードを選んでください');if(plan.choice===0)r.trade.exportCard=copy(p.revealed[0]);const result=exportGoods(r,plan.counts,2);r=result.records;tradeEffect={type:'exportInsight',revealed:copy(p.revealed),choice:plan.choice,transactions:result.transactions};break;}
 case 'mc_personal_consumption':{check(['multiple','double'].includes(plan.mode),'購入方法を選んでください');r=M.purchase(r,s.positions,plan.resource,plan.purchases,{sourceLimit:plan.mode==='multiple'?4:1,quantityMultiplier:plan.mode==='double'?2:1});break;}
 case 'mc_small_business_grant':r=build(r,s.positions,plan,{statePays:true});break;
 case 'mc_labor_market_deregulation':r=M.assignWorkers(r,plan.moves,Number(m.workerCount),s.positions[2]!=='C');break;
 case 'mc_immigration':{const pool=r.common.unemployed.Middle,count=Object.values(pool).reduce((a,b)=>a+b,0);check(count>=4,'中産階級の失業労働者が4人以上必要です');check(Array.isArray(plan.workers)&&plan.workers.length<=2,'取り除く失業労働者は最大2人です');check(m.workerCount-plan.workers.length>=10,'中産階級の労働者総数の最低値10人を下回ります');for(const skill of plan.workers){check(skills.includes(skill)&&pool[skill]>0,'選んだ中産階級の失業労働者が足りません');pool[skill]--;m.cash+=skill==='Gray'?5:10;}break;}
 case 'mc_growing_business':{check(resources.includes(plan.resource)&&m[plan.resource+'Storage']===0,'未購入の商品倉庫を選んでください');m[plan.resource+'Storage']=1;if(plan.build){const d=M.definition(r,plan.companyId);r=build(r,s.positions,plan,{discount:d?.production.resource.toLowerCase()===plan.resource?4:0});}break;}
 case 'mc_land_of_opportunity':r=build(r,s.positions,plan,{supply:true});break;
 case 'mc_voice_of_middle_class_workers':r.common.values.middleVotesOutside=Math.max(0,r.common.values.middleVotesOutside-(2+external(r).length));break;
 case 'mc_new_theme_park':{const cost=m.population*6;check(m.cash>=cost,'テーマパークの支払い資金が足りません');m.cash-=cost;M.gainProsperity(m);break;}
 case 'mc_unemployment_initiative_program':r=staff(r,plan.moves||[]);grant(r,(plan.moves||[]).length*5);break;
 case 'mc_supplemental_income_program':{const count=external(r).reduce((n,[,c])=>n+c.slots.filter(x=>x.owner==='Middle').length,0);bases.workers_counted_by_card=count;grant(r,count*2);if(plan.purchase)r=M.purchase(r,s.positions,plan.purchase.resource,plan.purchase.purchases);break;}
 case 'mc_specialization':check(skills.includes(plan.skill)&&plan.skill!=='Gray','追加する労働者階級の熟練技能を選んでください');r.common.unemployed.Working[plan.skill]++;r=staff(r,plan.moves||[]);break;
 case 'mc_export_subsidy':{const result=exportGoods(r,plan.counts,1);r=result.records;grant(r,result.transactions*5);tradeEffect={type:'middleExport',transactions:result.transactions};break;}
 case 'mc_import_subsidy':check(['food','luxury'].includes(plan.resource),'輸入する食料またはぜいたく品を選んでください');integer(plan.qty,'購入数量');check(plan.qty>0,'購入数量を1以上にしてください');r=M.purchase(r,s.positions,plan.resource,[{source:'Foreign',qty:plan.qty}],{waiveTariff:true});bases.food_or_luxury_bought_by_card=plan.qty;break;
 case 'mc_employment_subsidy':{const ids=employees(r);bases.companies_counted_by_card=ids.length;grant(r,ids.length*5);if(plan.shift){check(ids.includes(plan.companyId),'従業員のいる自分の企業を選んでください');r=M.basic(r,s.positions,{action:'SHIFT',id:plan.companyId});}break;}
 default:throw Error('未対応の中産階級カードです');
 }
 if(['mc_small_business_grant','mc_growing_business','mc_land_of_opportunity','mc_labor_market_deregulation','mc_unemployment_initiative_program','mc_specialization'].includes(c.id)&&r.common.tokens.demonstration&&!R.demonstrationStatus(r).eligible)r.common.tokens.demonstration=false;
 s.records=R.validate(r);s.lastPlayerCard={id:c.id,owner:'Middle',legitimacy:root.PlayerCards.bonusAmount(c.bonus,bases),legitimacyApplied:false,tradeEffect,source:'ユーザー提供 v6 JSON／基本ルール v1.2 印刷p.22–25・33：正当性は国家参加時のみ'};
 if(c.id==='mc_foreign_market_insight')delete s.pendingPlayerCard;return s;
}
root.MiddleCards={apply,staff,exportGoods,employees,external};
})(globalThis);
