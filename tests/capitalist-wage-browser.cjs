const {chromium}=require(process.argv[2]);
const assert=require('node:assert/strict');

(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(process.env.APP_URL||'http://127.0.0.1:4173');
  await page.locator('#setupWelcomeForm button[type=submit]').click();
  await page.evaluate(()=>{state.phase='player';render();});
  await page.getByText('賃金を調整（フリー）',{exact:true}).first().click();
  await page.locator('#capWageCompany').selectOption('cc_supermarket_init');
  assert.equal(await page.locator('#capWageTarget').inputValue(),'L3');
  assert.match(await page.locator('#capWageTarget option:checked').textContent(),/L3（25）/);
  await page.locator('#capRaiseWage').click();
  const company=await page.evaluate(()=>state.records.companies.cc_supermarket_init);
  assert.equal(company.wage,'L3');
  assert.equal(company.slots.every(x=>x.committed),true);
  assert.match(await page.locator('#boardInstructionDialog').textContent(),/賃金をL2（20）からL3（25）へ変更/);
  assert.deepEqual(errors,[]);
  console.log('PASS capitalist wage increase: all company workers committed');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
