const {chromium}=require(process.argv[2]);
const {pathToFileURL}=require('url');
const path=require('path');
const assert=require('node:assert/strict');

(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(pathToFileURL(path.resolve(__dirname,'../dist/index.html')).href);
  await page.locator('#setupWelcomeForm button[type=submit]').click();

  await page.evaluate(()=>{
   state=E.reduce(state,{type:'start'});
   state=E.reduce(state,{type:'card',number:'6',order:['PB','BGS','AW','STR'],policies:['2','3'],bonus:'影響力を支払わず即時投票を要求する'});
   for(let i=0;i<4;i++)state=E.reduce(state,{type:'check',confirmed:true,note:'UI test',movements:[]});
   state.actions={0:E.ACTIONS.filter(x=>x!=='PB'),2:['PB']};
   state.records.personal.Working.values.influence=0;
   state.records.personal.Working.values.billMarkers=0;
   state.records.personal.Capitalist.values.influence=5;
   state.records.common.values.workingVotesOutside=24;
   render();
  });
  assert.match(await page.locator('[data-pb-for="first"]').textContent(),/即時投票ウインドウ/);
  await page.locator('#next').click();
  assert.deepEqual(await page.evaluate(()=>({phase:state.phase,mode:state.election.mode,step:state.election.step})),{phase:'election',mode:'immediate',step:'declare'});
  if(await page.locator('#boardInstructionDialog').count())await page.locator('#boardInstructionDone').click();

  await page.evaluate(()=>{
   state.phase='player';
   const c=state.records.companies.cc_electronics_auto;
   c.status='built';c.operating='yes';c.wage='L2';
   state.positions[2]='B';render();
   act({type:'policy',id:'2',position:'A',result:'position',proposer:'other'});
  });
  const wageInstructions=await page.locator('#boardInstructionDialog').textContent();
  assert.doesNotMatch(wageInstructions,/自動化電子工場の賃金/);
  assert.equal(await page.evaluate(()=>state.records.companies.cc_electronics_auto.wage),'unknown');
  await page.locator('#boardInstructionDone').click();

  await page.evaluate(()=>{
   state.turn=5;
   state.phase='player';
   state=E.reduce(state,{type:'playerEnd'});
   state=E.reduce(state,{type:'productionProduce'});
   render();
  });
  assert.match(await page.locator('#flow').textContent(),/自動購入を反映する/);
  assert.equal(await page.locator('#flow input[type=number]').count(),0);
  const before=await page.evaluate(()=>({food:state.records.personal.Working.values.food,cash:state.records.personal.Working.values.cash}));
  await page.locator('#needsApply').click();
  if(await page.locator('#boardInstructionDialog').count())await page.locator('#boardInstructionDone').click();
  const after=await page.evaluate(()=>({step:state.production.step,food:state.records.personal.Working.values.food,cash:state.records.personal.Working.values.cash}));
  assert.equal(after.step,'imf');
  assert(after.food<=before.food);
  assert(after.cash<=before.cash);

  await page.evaluate(()=>{
   state.phase='production';
   state.production={step:'taxes',laborPolicy:'B'};
   state.proposals={'1':{proposer:'Capitalist',from:'C',target:'B',round:1,turn:5}};
   for(const row of Object.values(state.policies))row.splice(0,row.length,...row.filter(x=>x!=='1'));
   state.aside.policies['1']='bill:Capitalist';
   state.records.personal.Capitalist.values.billMarkers--;
   state=E.reduce(state,{type:'productionTaxes'});
   render();
  });
  await page.locator('#electionRefill').click();
  if(await page.locator('#boardInstructionDialog').count())await page.locator('#boardInstructionDone').click();
  assert.match(await page.locator('#flow').textContent(),/実物の袋から引いた5個/);
  assert.equal(await page.locator('[data-election-cube]').count(),3);
  await page.locator('[data-election-cube="Working"]').fill('2');
  await page.locator('[data-election-cube="Middle"]').fill('1');
  await page.locator('[data-election-cube="Capitalist"]').fill('2');
  await page.locator('#electionDeclare').click();
  assert.equal(await page.evaluate(()=>Object.values(state.election.cubes).reduce((a,b)=>a+b,0)),5);
  await page.locator('#electionResolve').click();
  const passedInstructions=await page.locator('#boardInstructionDialog').textContent();
  assert.match(passedInstructions,/政策1のマーカーをCからBへ移す/);
  assert.match(passedInstructions,/労働者のVPを1増やす/);
  assert.match(passedInstructions,/資本家のVPを3増やす/);
  assert.match(passedInstructions,/政策1から資本家の法案マーカーを取り除く/);
  assert.doesNotMatch(passedInstructions,/優先カード|AIカード/);
  await page.locator('#boardInstructionDone').click();
  const coverage=await page.evaluate(()=>{
   const before=E.copy(state),after=E.copy(state),company=after.records.companies.cc_supermarket_init;
   after.round=before.round+1;after.positions['2']=before.positions['2']==='A'?'B':'A';after.proposals['2']={proposer:'Working',from:before.positions['2'],target:after.positions['2']};
   after.records.personal.Working.values.vp++;after.records.personal.Working.unions.Food=true;after.records.common.values.influence++;after.records.common.values.workingVotesOutside--;
   after.records.common.unemployed.Working.Gray++;after.records.common.tokens.demonstration=true;company.machinery=true;company.strike=true;company.slots[0].committed=!company.slots[0].committed;
   after.actions={0:['PB'],1:['AW']};after.card={number:'30'};
   return boardInstructions(before,after,{type:'gameEndApply'}).join('\n');
  });
  for(const expected of ['ラウンドマーカー','政策2のマーカー','政策2の','法案マーカーを置く','労働者のVP','国家の影響力','投票駒を袋の外から','失業未熟練労働者','Food産業の労働組合','機械化トークン','ストライキトークン','1枠','デモトークン'])assert.match(coverage,new RegExp(expected));
  assert.doesNotMatch(coverage,/優先カード|AIカード/);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  assert.deepEqual(errors,[]);
  console.log('PASS automation UI: complete policy instructions, internal cards omitted, physical bag, mobile width');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
