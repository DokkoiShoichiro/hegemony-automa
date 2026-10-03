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
  await page.evaluate(()=>{state.phase='player';state.records.companies.cc_supermarket_pool.status='market';state.records.companies.cc_shopping_mall_pool.status='market';state.records.common.unemployed.Working.Green=1;state.records.common.unemployed.Working.Gray=2;render();});
  await page.locator('#capBuild').click();
  await page.locator('#establishPick').selectOption('cc_shopping_mall_pool');
  assert.match(await page.locator('#establishDetails').innerText(),/空きスロット 2/);
  assert.match(await page.locator('#establishDetails').innerText(),/機械化トークン：生産 \+2 贅沢品/);
  await page.locator('#establishPick').selectOption('cc_supermarket_pool');
  assert.match(await page.locator('#establishDetails').innerText(),/空きスロット 3/);
  assert.match(await page.locator('#establishDetails').innerText(),/機械化トークンによる生産増加なし/);
  assert.equal(await page.locator('[data-establish-committed]').count(),0);
  assert.equal(await page.locator('#establishStaffAll').count(),1);
  await page.locator('#establishStaffAll').selectOption('yes');
  await page.locator('#establishForm button[type=submit]').click();
  const result=await page.evaluate(()=>({slots:state.records.companies.cc_supermarket_pool.slots,green:state.records.common.unemployed.Working.Green,gray:state.records.common.unemployed.Working.Gray,dialog:!!document.querySelector('#establishDialog')}));
  assert.equal(result.slots.every(x=>x.owner==='Working'&&x.committed),true);
  assert.deepEqual({green:result.green,gray:result.gray,dialog:result.dialog},{green:0,gray:0,dialog:false});
  await page.locator('#boardInstructionDone').click();
  await page.evaluate(()=>{state.records.companies.cc_electronics_auto.status='market';render();});
  await page.locator('#capBuild').click();
  await page.locator('#establishPick').selectOption('cc_electronics_auto');
  assert.equal(await page.locator('#establishStaffAll').count(),0);
  assert.equal(await page.locator('[data-establish-worker]').count(),0);
  assert.match(await page.locator('#establishDetails').innerText(),/自動化企業（労働者スロットなし）/);
  assert.match(await page.locator('#establishDetails').innerText(),/機械化トークンによる生産増加なし/);
  await page.locator('#establishForm button[type=submit]').click();
  const automated=await page.evaluate(()=>state.records.companies.cc_electronics_auto);
  assert.equal(automated.operating,'yes');
  assert.deepEqual(automated.slots,[]);
  assert.deepEqual(errors,[]);
  console.log('PASS capitalist build: slot and machinery info, all slots only, automated company');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});

