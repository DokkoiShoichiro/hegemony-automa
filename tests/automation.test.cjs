require('../dist/companies.js');
require('../dist/boards.js');
require('../dist/judge.js');
const E=require('../dist/engine.js'),{test}=require('node:test'),assert=require('node:assert/strict');

const ordered=Array.from({length:30},(_,i)=>String(i+1));

test('a new game shuffles one thirty-card deck and turn start draws without physical input',()=>{
 const deck=['14',...ordered.filter(x=>x!=='14')];
 const setup=E.reduce(E.initial(),{type:'setup',players:2,immigrant:'',market:[],deck,confirmed:true});
 const next=E.reduce(setup,{type:'start'});
 assert.equal(next.phase,'checks');
 assert.equal(next.card.number,'14');
 assert.deepEqual(next.card.order,['AW','PB','BGS','STR']);
 assert.deepEqual(next.card.policies,['2','7']);
 assert.deepEqual(next.aiDiscard,['14']);
 assert.equal(next.aiDeck.length,29);
 assert.equal(setup.aiDeck.length,30);
});

test('generated AI decks contain every card exactly once',()=>{
 const deck=E.randomDeck(()=>0.37);
 assert.equal(deck.length,30);
 assert.deepEqual([...deck].sort((a,b)=>Number(a)-Number(b)),ordered);
});

test('automa Influence card draws are replaced by recorded fifty-percent outcomes',()=>{
 let s=E.reduce(E.initial(),{type:'setup',players:2,immigrant:'',market:[],confirmed:true});
 s.turn=5;s.phase='production';s.production={step:'taxes',laborPolicy:'B'};
 s.proposals={6:{proposer:'Capitalist',from:'B',target:'A',round:1,turn:5}};
 for(const row of Object.values(s.policies))row.splice(0,row.length,...row.filter(x=>x!=='6'));
 s.aside.policies['6']='bill:Capitalist';s.records.personal.Capitalist.values.billMarkers--;
 s.records.personal.Working.values.influence=3;s.records.personal.Capitalist.values.influence=2;
 s=E.reduce(s,{type:'productionTaxes'});s=E.reduce(s,{type:'electionRefill'});
 s=E.reduce(s,{type:'electionDeclare',sides:{Working:'against',Capitalist:'favor'},cubes:{Working:3,Capitalist:2,Middle:0}});
 assert.equal(s.election.autoPlans.Working.cards,1);
 s=E.reduce(s,{type:'electionResolve',spends:{Capitalist:2},autoCoinSuccesses:{Working:1}});
 assert.deepEqual(s.lastElection.coinResults.Working,{attempts:1,successes:1});
 assert.equal(s.records.personal.Working.values.influence,2);
});

