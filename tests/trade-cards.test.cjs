require('../dist/companies.js');require('../dist/boards.js');
const E=require('../dist/engine.js'),{test}=require('node:test'),assert=require('node:assert/strict');
const ordered=()=>({export:Object.keys(E.EXPORT_CARD_DATA),business:Object.keys(E.BUSINESS_DEAL_DATA)});
const market=s=>WCA_COMPANIES.filter(d=>d.class==='Capitalist'&&!d.tags.includes('Initial_Setup')&&s.records.companies[d.id]?.status==='unbuilt').slice(0,4).map(d=>d.id);

test('attached catalog registers sixteen Export cards and two copies of ten Business Deals',()=>{
 assert.equal(Object.keys(E.EXPORT_CARD_DATA).length,16);assert.equal(Object.keys(E.BUSINESS_DEAL_DATA).length,20);
 const contents=Object.values(E.BUSINESS_DEAL_DATA).map(x=>`${x.food}:${x.luxury}:${x.cost}`),counts=Object.fromEntries(contents.map(x=>[x,contents.filter(y=>y===x).length]));
 assert.equal(Object.keys(counts).length,10);assert(Object.values(counts).every(x=>x===2));
 assert.deepEqual(E.EXPORT_CARD_DATA.E01.offers,[{resource:'food',quantity:2,revenue:25},{resource:'food',quantity:6,revenue:65},{resource:'luxury',quantity:4,revenue:20},{resource:'luxury',quantity:7,revenue:35},{resource:'health',quantity:3,revenue:20},{resource:'health',quantity:7,revenue:40},{resource:'education',quantity:3,revenue:25},{resource:'education',quantity:6,revenue:45}]);
 assert.deepEqual(E.BUSINESS_DEAL_DATA['B01-1'],{id:'B01-1',name:'',food:0,luxury:10,cost:40,tariffB:10,tariffA:20});
});

test('new game draws the first Export and Business Deal and cycles both to the bottom',()=>{
 const s=E.reduce(E.initial(),{type:'setup',players:2,market:[],tradeDecks:ordered(),confirmed:true});
 assert.deepEqual(s.records.trade.exportCard.offers,E.EXPORT_CARD_DATA.E01.offers);assert.deepEqual(s.records.trade.businessDeals[0],E.BUSINESS_DEAL_DATA['B01-1']);
 assert.equal(s.tradeDecks.export.at(-1),'E01');assert.equal(s.tradeDecks.business.at(-1),'B01-1');assert(E.validTradeDecks(s.tradeDecks));
});

test('preparation automatically draws one Export and the policy count of Business Deals',()=>{
 let s=E.reduce(E.initial(),{type:'setup',players:2,market:[],tradeDecks:ordered(),confirmed:true});s.phase='preparation';s.positions[6]='C';
 s=E.reduce(s,{type:'preparationApply',confirmed:true,plan:{market:market(s),immigration:['Gray']}});
 assert.deepEqual(s.records.trade.exportCard.offers,E.EXPORT_CARD_DATA.E02.offers);assert.deepEqual(s.records.trade.businessDeals,['B01-2','B02-1'].map(id=>E.BUSINESS_DEAL_DATA[id]));
 assert.deepEqual(s.tradeDecks.export.slice(-2),['E01','E02']);assert.deepEqual(s.tradeDecks.business.slice(-3),['B01-1','B01-2','B02-1']);assert.equal(s.lastPreparation.trade.businessDeals.length,2);
});

test('trade deck validation rejects missing and duplicated physical cards',()=>{const decks=ordered();assert(E.validTradeDecks(decks));assert.equal(E.validTradeDecks({...decks,export:decks.export.slice(1)}),false);assert.equal(E.validTradeDecks({...decks,business:[...decks.business.slice(1),decks.business[1]]}),false);});
