require('../dist/companies.js');require('../dist/boards.js');
const E=require('../dist/engine.js'),{test}=require('node:test'),assert=require('node:assert/strict');

test('a complete two-player round reaches the next round through Production, Elections, Scoring, and Preparation',()=>{
 let s=E.reduce(E.initial(),{type:'setup',players:2,immigrant:'',market:[],confirmed:true});
 for(let turn=1;turn<=5;turn++){
  assert.deepEqual({round:s.round,turn:s.turn,phase:s.phase},{round:1,turn,phase:'start'});
  s=E.reduce(s,{type:'start',note:'開始時処理'});
  s=E.reduce(s,{type:'card',number:'14',order:['AW','PB','BGS','STR'],policies:['2','7'],bonus:'なし',note:'カード入力'});
  for(let i=0;i<4;i++)s=E.reduce(s,{type:'check',confirmed:true,note:'統合テスト：移動なし',movements:[]});
  s=E.reduce(s,{type:'action',first:'no',second:'no',plan:{action:'PRESSURE'},note:'政治的圧力'});
  assert.equal(s.phase,'end');
  s=E.reduce(s,{type:'end'});
  assert.equal(s.phase,'player');
  if(turn===1)s=E.reduce(s,{type:'playerPolicy',id:'1',position:'B',immediate:false});
  s=E.reduce(s,{type:'playerEnd'});
 }
 assert.equal(s.phase,'production');
 s=E.reduce(s,{type:'productionProduce'});assert.equal(s.production.step,'needs');
 const food=WCARecords.foodNeedPreview(s.records,s.positions[6]),capitalist=Math.min(food.shortage,food.capitalistStock);
 s=E.reduce(s,{type:'productionNeeds',plan:{capitalist,foreign:food.shortage-capitalist}});assert.equal(s.production.step,'imf');
 s=E.reduce(s,{type:'productionImf',manual:false});assert.equal(s.production.step,'taxes');
 s=E.reduce(s,{type:'productionTaxes'});assert.equal(s.phase,'election');
 s=E.reduce(s,{type:'electionRefill'});assert.equal(s.election.step,'declare');
 s=E.reduce(s,{type:'electionDeclare',sides:{Working:'favor',Capitalist:'favor'},cubes:{Working:5,Capitalist:0,Middle:0}});assert.equal(s.election.step,'influence');
 s=E.reduce(s,{type:'electionResolve',spends:{Capitalist:0},autoSymbols:{}});assert.equal(s.phase,'scoring');assert.equal(s.positions['1'],'B');
 s=E.reduce(s,{type:'scoringApply'});assert.equal(s.phase,'preparation');
 const market=WCA_COMPANIES.filter(d=>d.class==='Capitalist'&&!d.tags.includes('Initial_Setup')&&s.records.companies[d.id]?.status==='unbuilt').slice(0,4).map(d=>d.id);
 s=E.reduce(s,{type:'preparationApply',confirmed:true,plan:{market,immigration:['Gray'],exportCard:'統合テスト輸出',businessDeals:['統合テスト商取引']}});
 assert.deepEqual({round:s.round,turn:s.turn,phase:s.phase},{round:2,turn:1,phase:'start'});
 assert.equal(Object.keys(s.proposals).length,0);
 assert.equal(s.records.trade.exportCard,'統合テスト輸出');
 assert.equal(s.records.trade.businessDeals,'統合テスト商取引');
 assert.equal(s.records.companies.cc_supermarket_init.slots.every(x=>!x.committed),true);
 assert.deepEqual(E.validate(JSON.parse(JSON.stringify(s))),s);
});

