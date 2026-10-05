const {chromium}=require(process.argv[2]||'playwright');
const {pathToFileURL}=require('url'),path=require('path'),assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});try{
 const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.APP_URL||pathToFileURL(path.resolve(__dirname,'../dist/index.html')).href);
 await page.evaluate(()=>{document.getElementById('setupWelcome')?.remove();state=E.reduce(E.initial(),{type:'setup',players:2,automaClass:'Capitalist',confirmed:true,market:[]});render();});
 assert.equal(await page.locator('#workingAssign').count(),1);
 await page.getByText('商品・サービスの購入',{exact:true}).click();await page.locator('#workingResource').selectOption('health');await page.locator('[data-working-source="State"]').fill('2');assert.match(await page.locator('#workingCost').textContent(),/支払合計 10/);
 await page.locator('#workingBuy').click();assert.equal(await page.evaluate(()=>state.records.personal.Working.values.health),2);assert.equal(await page.locator('#workingBuy').count(),0);assert.ok(await page.locator('#boardInstructionDialog').isVisible());
 await page.evaluate(()=>{document.getElementById('boardInstructionDialog')?.close();state=E.reduce(E.initial(),{type:'setup',players:2,automaClass:'Capitalist',confirmed:true,market:[]});render();});
 await page.getByText('法案提議',{exact:true}).click();await page.locator('#workingPolicy').selectOption('1');assert.deepEqual(await page.locator('#workingTarget option').allTextContents(),['B']);await page.locator('#workingPropose').click();assert.equal(await page.evaluate(()=>state.proposals['1'].proposer),'Working');
 assert.deepEqual(errors,[]);console.log('PASS Working player mobile UI: purchase, action limit, instructions, adjacent proposal');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
