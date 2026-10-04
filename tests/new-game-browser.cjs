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
  await page.locator('#tab-personal').click();
  await page.locator('#personalForm [data-number=cash]').fill('99');
  await page.locator('#personalForm button[type=submit]').click();
  await page.evaluate(()=>{state.lastElection={proposal:{id:'2'},passed:false,totals:{favor:1,against:2},vp:{}};render();});
  assert.equal(await page.locator('.election-result').count(),0);

  await page.locator('#newGame').click();
  assert.equal(await page.locator('#setupWelcomeTitle').textContent(),'新しいゲームを始めますか？');
  assert.equal(await page.locator('#setupWelcomeLater').textContent(),'今のゲームに戻る');
  await page.locator('#setupWelcomeLater').click();
  assert.equal(await page.locator('#personalForm [data-number=cash]').inputValue(),'99');

  await page.locator('#newGame').click();
  await page.locator('#setupWelcomeForm button[type=submit]').click();
  assert.equal(await page.locator('#personalForm [data-number=cash]').inputValue(),'30');
  assert.equal(await page.locator('#undo').isDisabled(),true);
  assert.equal(await page.locator('#tab-turn').getAttribute('aria-selected'),'true');
  assert.equal(await page.locator('dialog').count(),0);
  assert.equal(await page.locator('.election-result').count(),0);
  assert.equal(await page.evaluate(()=>Object.hasOwn(state,'lastElection')||Object.hasOwn(state,'lastElections')),false);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  assert.deepEqual(errors,[]);
  console.log('PASS new game: open, cancel, replace, clear history/UI/results, mobile width');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
