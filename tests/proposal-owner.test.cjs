const test=require('node:test'),assert=require('node:assert/strict');
require('../dist/companies.js');require('../dist/boards.js');require('../dist/judge.js');require('../dist/capitalist.js');require('../dist/engine.js');
const E=globalThis.WCA;
const trade={exportCard:{name:'test',offers:['food','luxury','health','education'].flatMap(resource=>[{resource,quantity:2,revenue:10},{resource,quantity:4,revenue:20}])},businessDeals:[{name:'deal',food:1,luxury:1,cost:10,tariffA:16,tariffB:8}]};
const setup=()=>E.reduce(E.initial(),{type:'setup',players:2,immigrant:'',market:[],automaClass:'Capitalist',capitalistDeck:['5','7','9','20','21','29'],trade,confirmed:true});

test('manual proposals charge the bill marker to the selected participating class',()=>{
 let s=setup(),working=s.records.personal.Working.values.billMarkers;
 s=E.reduce(s,{type:'policy',id:'3',position:'B',result:'pending',proposer:'Working'});
 assert.equal(s.proposals['3'].proposer,'Working');
 assert.equal(s.records.personal.Working.values.billMarkers,working-1);
 const capitalist=s.records.personal.Capitalist.values.billMarkers;
 s=E.reduce(s,{type:'policy',id:'5',position:'B',result:'pending',proposer:'Capitalist'});
 assert.equal(s.proposals['5'].proposer,'Capitalist');
 assert.equal(s.records.personal.Capitalist.values.billMarkers,capitalist-1);
});
