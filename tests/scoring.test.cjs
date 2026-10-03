require('../dist/companies.js');
require('../dist/boards.js');
const E=require('../dist/engine.js'),{test}=require('node:test'),assert=require('node:assert/strict');

function setup(){return E.reduce(E.initial(),{type:'setup',players:2,immigrant:'',market:[],confirmed:true});}

test('Capitalist wealth levels use every printed threshold',()=>{
 const cases=[[0,0],[9,0],[10,1],[24,1],[25,2],[199,8],[200,9],[249,9],[250,10],[499,14],[500,15],[900,15]];
 for(const [capital,level] of cases)assert.equal(WCARecords.wealthLevel(capital),level,`capital ${capital}`);
});

test('recurring scoring counts unions and transfers Revenue before moving Wealth',()=>{
 const s=setup(),r=s.records,w=r.personal.Working.values,c=r.personal.Capitalist.values;
 r.personal.Working.unions.Food=true;r.personal.Working.unions.Health=true;
 w.vp=7;c.vp=4;c.capital=25;c.revenue=100;c.wealth=2;
 const preview=WCARecords.scoringPreview(r);
 assert.deepEqual(preview.Working,{unions:2,vp:4});
 assert.deepEqual(preview.Capitalist,{revenue:100,capitalBefore:25,capital:125,level:6,wealthBefore:2,wealthAfter:6,baseVp:6,wealthMoves:4,bonusVp:12,vp:18});
 const result=WCARecords.applyScoring(r);
 assert.equal(result.records.personal.Working.values.vp,11);
 assert.deepEqual({revenue:result.records.personal.Capitalist.values.revenue,capital:result.records.personal.Capitalist.values.capital,wealth:result.records.personal.Capitalist.values.wealth,vp:result.records.personal.Capitalist.values.vp},{revenue:0,capital:125,wealth:6,vp:22});
 assert.equal(c.revenue,100,'preview and apply remain immutable');
});

test('Wealth never moves left, but the current Capital level still scores',()=>{
 const s=setup(),c=s.records.personal.Capitalist.values;c.capital=25;c.revenue=0;c.wealth=6;
 const p=WCARecords.scoringPreview(s.records).Capitalist;
 assert.deepEqual({level:p.level,wealthAfter:p.wealthAfter,bonus:p.bonusVp,vp:p.vp},{level:2,wealthAfter:6,bonus:0,vp:2});
});

test('round scoring leads to Preparation, while round five leads to final scoring',()=>{
 let s=setup();s.phase='scoring';s=E.reduce(s,{type:'scoringApply'});assert.equal(s.phase,'preparation');assert(s.lastScoring);
 s=setup();s.round=5;s.phase='scoring';s=E.reduce(s,{type:'scoringApply'});assert.equal(s.phase,'gameEnd');s=E.reduce(s,{type:'gameEndApply'});assert.equal(s.phase,'finished');assert(s.finalScoring.winners.length>=1);
});

test('game-end scoring repays Working loans and scores policies, cash, stock, and Capitalist loans',()=>{
 const s=setup(),r=s.records,w=r.personal.Working.values,c=r.personal.Capitalist.values;
 w.vp=10;w.cash=138;w.loans=2;c.vp=30;c.loans=1;c.food=3;c.freeTradeFood=2;c.luxury=2;c.freeTradeLuxury=1;c.health=5;c.education=6;
 Object.assign(s.positions,{1:'A',2:'A',3:'A',4:'B',5:'C'});
 const p=WCARecords.gameEndPreview(r,s.positions);
 assert.deepEqual({due:p.Working.loanDue,paid:p.Working.loanPaid,penalty:p.Working.loanPenalty,cash:p.Working.cashAfter,policies:p.Working.policies,policyVp:p.Working.policyVp,cashVp:p.Working.cashVp,total:p.Working.total},{due:110,paid:110,penalty:0,cash:28,policies:3,policyVp:8,cashVp:2,total:20});
 assert.deepEqual({penalty:p.Capitalist.loanPenalty,policies:p.Capitalist.policies,policyVp:p.Capitalist.policyVp,stockVp:p.Capitalist.stockVp,total:p.Capitalist.total},{penalty:5,policies:1,policyVp:1,stockVp:6,total:32});
 const result=WCARecords.applyGameEnd(r,s.positions);
 assert.deepEqual({cash:result.records.personal.Working.values.cash,loans:result.records.personal.Working.values.loans,vp:result.records.personal.Working.values.vp},{cash:28,loans:0,vp:20});
 assert.equal(result.records.personal.Capitalist.values.vp,32);
});

test('an underfunded Working loan is paid in five-money increments with one VP lost per missing five',()=>{
 const s=setup(),w=s.records.personal.Working.values;w.vp=10;w.cash=38;w.loans=1;Object.assign(s.positions,{1:'B',2:'B',3:'B',4:'B',5:'B'});
 const p=WCARecords.gameEndPreview(s.records,s.positions).Working;
 assert.deepEqual({paid:p.loanPaid,cash:p.cashAfter,penalty:p.loanPenalty,total:p.total},{paid:35,cash:3,penalty:4,total:6});
});

