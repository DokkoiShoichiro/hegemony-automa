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
  assert.match(await page.locator('#flow').textContent(),/アプリが袋から抽選する5個/);
  assert.equal(await page.locator('[data-election-cube]').count(),0);
  await page.locator('#electionDeclare').click();
  assert.equal(await page.evaluate(()=>Object.values(state.election.cubes).reduce((a,b)=>a+b,0)),5);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  assert.deepEqual(errors,[]);
  console.log('PASS automation UI: food auto-plan, digital five-cube draw, mobile width');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
