const {test}=require('node:test'),assert=require('node:assert/strict');
for(const n of ['companies','boards','middle','judge','capitalist','action-card-data','middle-cards','player-cards','middle-ai-cards','middle-automa','state-data','state','engine'])require('../dist/'+n+'.js');
const E=globalThis.WCA,A=globalThis.StatePlayer;
function election({influence=2,proposer='Capitalist',step='declare',queue}={}){
 const s=E.reduce(E.initial(),{type:'setup',players:4,automaClass:'FourState',confirmed:true,managePlayerCards:true,middleMarket:['mc_game_shop','mc_training_center','mc_organic_farm'],market:['cc_supermarket_pool','cc_clinic_pool','cc_electronics_auto','cc_shopping_mall_pool'],immigrationDeck:Object.keys(E.IMMIGRATION_CARD_DATA)});
 for(const id of A.CLASSES)s.records.personal[id].values.influence=0;
 s.records.personal.State.values.influence=influence;s.records.common.values.influence=50;
 s.phase='election';s.election={step,mode:'phase',queue:queue||[{id:'3',from:'A',target:'B',proposer}],current:0,returnPhase:'scoring',results:[]};return s;
}
function declare(s,side='favor'){
 const p=E.currentElection(s),sides=Object.fromEntries(E.voters(s).map(id=>[id,id==='State'?side:E.automaStance(s,p,id)]));
 return E.reduce(s,{type:'electionDeclare',sides,cubes:{Working:2,Middle:1,Capitalist:2}});
}
test('State voting preview and regular refill use the complete lowest-legitimacy table exactly once',()=>{
 for(let minimum=1;minimum<=10;minimum++){
  let s=election({influence:3,step:'refill'});Object.assign(s.records.personal.State.values,{workingLegitimacy:10,middleLegitimacy:minimum,capitalistLegitimacy:10});
  const before=E.copy(s);assert.deepEqual(A.votingPreview(s),{minimum,gain:Math.floor(minimum/2),influence:3,after:3+Math.floor(minimum/2)});assert.deepEqual(s,before);
  s=E.reduce(s,{type:'electionRefill'});assert.equal(s.election.stateInfluence,Math.floor(minimum/2));assert.equal(s.records.personal.State.values.influence,3+Math.floor(minimum/2));assert.equal(s.records.common.values.influence,50);assert.throws(()=>E.reduce(s,{type:'electionRefill'}),/補充/);
 }
});
test('zero personal influence excludes State even with media influence; positive influence requires a stance',()=>{
 let s=election({influence:0});assert(!E.voters(s).includes('State'));s=declare(s);assert.equal(s.election.sides.State,undefined);assert.equal(s.election.cubes.State,undefined);
 s=E.reduce(s,{type:'electionResolve',spends:{}});assert.equal(s.lastElection.spends.State,undefined);assert.equal(s.records.common.values.influence,50);
 s=election();assert.throws(()=>E.reduce(s,{type:'electionDeclare',sides:{Working:'against',Middle:'favor',Capitalist:'favor'},cubes:{Working:2,Middle:1,Capitalist:2}}),/Stateの賛否/);
});
for(const [side,spend,passed,vp,totals] of [['favor',2,true,1,{favor:5,against:2}],['favor',0,true,0,{favor:3,against:2}],['against',1,true,0,{favor:3,against:3}],['against',2,false,0,{favor:3,against:4}]])test(`State ${side} with ${spend} personal influence resolves votes and VP correctly`,()=>{
 let s=declare(election(),side);s=E.reduce(s,{type:'electionResolve',spends:{State:spend}});assert.equal(s.lastElection.passed,passed);assert.deepEqual(s.lastElection.totals,totals);assert.equal(s.records.personal.State.values.vp,vp);assert.equal(s.records.personal.State.values.influence,2-spend);assert.equal(s.records.common.values.influence,50);assert.equal(s.lastElection.spends.State,spend);
});
test('State cannot spend public media influence or more personal influence than it owns',()=>{
 const s=declare(election({influence:1})),before=E.copy(s);assert.throws(()=>E.reduce(s,{type:'electionResolve',spends:{State:2}}),/使用影響力/);assert.deepEqual(s,before);
});
test('State proposer gains three VP when its bill passes with no personal influence or cubes',()=>{
 let s=declare(election({influence:0,proposer:'State'}));s=E.reduce(s,{type:'electionResolve',spends:{}});assert.equal(s.lastElection.passed,true);assert.equal(s.records.personal.State.values.vp,3);assert.equal(s.lastElection.cubes.State,undefined);
});
test('spending the last State influence counts that vote and excludes it only from the following election',()=>{
 let s=election({influence:1,queue:[{id:'3',from:'A',target:'B',proposer:'Capitalist'},{id:'4',from:'A',target:'B',proposer:'Capitalist'}]});s=declare(s);s=E.reduce(s,{type:'electionResolve',spends:{State:1}});assert.deepEqual(s.election.lastResult.totals,{favor:4,against:2});assert.equal(s.records.personal.State.values.vp,1);assert.equal(s.election.step,'declare');assert(!E.voters(s).includes('State'));s=declare(s);s=E.reduce(s,{type:'electionResolve',spends:{}});assert.equal(s.lastElections[1].sides.State,undefined);assert.equal(s.records.personal.State.values.vp,1);
});
test('emergency refill in an immediate election never grants State influence',()=>{
 let s=election({influence:1});s.election.mode='immediate';Object.assign(s.records.personal.State.values,{workingLegitimacy:10,middleLegitimacy:10,capitalistLegitimacy:10});Object.assign(s.records.common.values,{workingVotesOutside:25,middleVotesOutside:25,capitalistVotesOutside:25});s=E.reduce(s,{type:'electionEmergencyRefill'});assert.equal(s.records.personal.State.values.influence,1);assert.equal(s.election.stateInfluence,undefined);
});
