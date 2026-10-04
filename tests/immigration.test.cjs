require('../dist/companies.js');
require('../dist/boards.js');
const E=require('../dist/engine.js'),{test}=require('node:test'),assert=require('node:assert/strict');

const ordered=(...first)=>[...first,...Object.keys(E.IMMIGRATION_CARD_DATA).filter(id=>!first.includes(id))];
const market=s=>WCA_COMPANIES.filter(d=>!d.tags.includes('Initial_Setup')&&['market','unbuilt'].includes(s.records.companies[d.id].status)).slice(0,4).map(d=>d.id);
const trade={exportCard:{name:'輸出A',offers:[{resource:'food',quantity:3,revenue:20},{resource:'food',quantity:8,revenue:50}]},businessDeals:[{name:'取引1',food:2,luxury:1,cost:20}]};

test('immigration deck has the exact twenty-five-card class and skill composition',()=>{
 const cards=Object.values(E.IMMIGRATION_CARD_DATA),skills=['Blue','Green','White','Orange','Purple'];
 assert.equal(cards.length,25);assert.equal(new Set(cards.map(x=>x.id)).size,25);
 for(const skill of skills){assert.equal(cards.filter(x=>x.Working===skill&&x.Middle==='Gray').length,2);assert.equal(cards.filter(x=>x.Middle===skill&&x.Working==='Gray').length,3);}
 assert(cards.every(x=>(x.Working==='Gray')!==(x.Middle==='Gray')));
});

test('new game draws the top immigration card and returns it to the bottom',()=>{
 const deck=ordered('W-Blue-1'),s=E.reduce(E.initial(),{type:'setup',players:2,market:[],immigrationDeck:deck,confirmed:true});
 assert.deepEqual(s.records.setup.immigrationCard,E.IMMIGRATION_CARD_DATA['W-Blue-1']);assert.equal(s.records.common.unemployed.Working.Blue,1);
 assert.equal(s.immigrationDeck.at(-1),'W-Blue-1');assert.equal(s.immigrationDeck.length,25);assert.deepEqual(E.validate(JSON.parse(JSON.stringify(s))),s);
});

test('preparation automatically draws policy-count cards in order and cycles both to the bottom',()=>{
 const deck=ordered('W-Blue-1','W-Green-1','M-White-1');let s=E.reduce(E.initial(),{type:'setup',players:2,market:[],immigrationDeck:deck,confirmed:true});
 s.phase='preparation';s.positions[7]='C';const before=structuredClone(s.records.common.unemployed.Working),ids=market(s);s=E.reduce(s,{type:'preparationTrade',value:trade});s=E.reduce(s,{type:'preparationApply',confirmed:true,plan:{market:ids}});
 assert.deepEqual(s.lastPreparation.immigrationCards.map(x=>x.id),['W-Green-1','M-White-1']);assert.deepEqual(s.immigrationDeck.slice(-3),['W-Blue-1','W-Green-1','M-White-1']);
 assert.equal(s.records.common.unemployed.Working.Green,before.Green+1);assert.equal(s.records.common.unemployed.Working.Gray,before.Gray+3);assert.equal(s.records.common.unemployed.Middle.White,null);
});

test('immigration deck validation rejects missing or duplicated cards',()=>{
 const deck=E.randomImmigrationDeck(()=>0.5);assert(E.validImmigrationDeck(deck));assert.equal(E.validImmigrationDeck(deck.slice(1)),false);assert.equal(E.validImmigrationDeck([...deck.slice(1),deck[1]]),false);
});

test('a legacy saved game creates an automatic immigration deck at its next preparation',()=>{
 let s=E.reduce(E.initial(),{type:'setup',players:2,immigrant:'Gray',market:[],confirmed:true});assert.equal(s.immigrationDeck,undefined);s.phase='preparation';s.preparationTrade=trade;
 s=E.reduce(s,{type:'preparationApply',confirmed:true,plan:{market:market(s)}});assert(E.validImmigrationDeck(s.immigrationDeck));assert.equal(s.lastPreparation.immigrationCards.length,1);
});
