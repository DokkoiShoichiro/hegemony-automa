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
  await page.evaluate(()=>{state.phase='player';render();});
  await page.getByText('賃金を上げる',{exact:true}).first().click();
  await page.locator('#capWageCompany').selectOption('cc_supermarket_init');
  assert.equal(await page.locator('#capWageTarget').inputValue(),'L3');
  await page.locator('#capRaiseWage').click();
  const company=await page.evaluate(()=>state.records.companies.cc_supermarket_init);
  assert.equal(company.wage,'L3');
  assert.equal(company.slots.every(x=>x.committed),true);
  assert.deepEqual(errors,[]);
  console.log('PASS capitalist wage increase: all company workers committed');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});

