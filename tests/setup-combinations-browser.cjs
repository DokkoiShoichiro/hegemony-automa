const {chromium}=require(process.argv[2]||'playwright'),assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});try{
 const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(process.env.APP_URL||'http://127.0.0.1:4173');
 const visible=()=>page.locator('#setupCombinations label:visible input').evaluateAll(inputs=>inputs.map(x=>x.value));
 const start=page.locator('#setupWelcomeForm button[type=submit]');
 assert.deepEqual(await visible(),['Working','Capitalist','Both']);assert.equal(await page.locator('[name=automaClass][value=Middle]').isDisabled(),true);
 await page.locator('[name=automaClass][value=Capitalist]').check();assert.equal(await page.locator('[name=players][value="2"]').isChecked(),true);assert.equal(await start.isEnabled(),true);
 await page.locator('[name=players][value="3"]').check();assert.deepEqual(await visible(),['Middle','ThreeWorking','ThreeCapitalist']);assert.equal(await page.locator('[name=automaClass][value=Middle]').isChecked(),true);assert.equal(await page.locator('#middleSetupFields').isVisible(),true);assert.equal(await start.isEnabled(),true);
 const before=await page.evaluate(()=>localStorage.getItem('wca-assistant-v4'));
 for(const id of ['ThreeWorking','ThreeCapitalist']){
  await page.locator(`[name=automaClass][value=${id}]`).check();assert.equal(await page.locator('[name=players][value="3"]').isChecked(),true);assert.equal(await start.isDisabled(),true);assert.match(await page.locator('#setupModeNotice').innerText(),/準備中.*未実装.*開始できません/);assert.equal(await page.locator('#setupPreparationFields').isVisible(),false);
  await page.locator('#setupWelcomeForm').evaluate(form=>form.requestSubmit());assert.equal(await page.evaluate(()=>localStorage.getItem('wca-assistant-v4')),before);
 }
 await page.locator('[name=players][value="2"]').check();assert.deepEqual(await visible(),['Working','Capitalist','Both']);assert.equal(await page.locator('[name=automaClass][value=Working]').isChecked(),true);assert.equal(await page.locator('#middleSetupFields').isVisible(),false);assert.equal(await start.isEnabled(),true);
 await page.locator('[name=automaClass][value=Both]').check();assert.equal(await start.isEnabled(),true);assert.equal(await page.locator('[name=players][value="4"]').isDisabled(),true);
 await page.locator('[name=players][value="3"]').check();assert.equal(await page.locator('[name=automaClass][value=Middle]').isChecked(),true);await start.click();assert.equal(await page.locator('#setupWelcome').count(),0);const state=await page.evaluate(()=>JSON.parse(localStorage.getItem('wca-assistant-v4')).state);assert.equal(state.records.setup.players,3);assert.equal(state.records.participants.Middle,'human');
 // The same filtering applies when reopening an existing game; cancel retains it.
 await page.evaluate(()=>WCARecords.openSetupDialog());await page.locator('[name=players][value="3"]').check();await page.locator('[name=automaClass][value=ThreeWorking]').check();await page.locator('#setupWelcomeLater').click();assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('wca-assistant-v4')).state),state);
 assert.deepEqual(errors,[]);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);console.log('PASS setup combinations: player-count filtering, two planned previews, submit guard, switching, real three-player setup and cancel preservation');
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
