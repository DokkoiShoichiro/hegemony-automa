const {chromium}=require(process.argv[2]||'playwright'),assert=require('node:assert/strict'),path=require('node:path');
(async()=>{const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium'});try{
 const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.APP_URL||'http://127.0.0.1:4173');
 async function setup(owner,id,fixture){await page.evaluate(({owner,id,fixture})=>{
  document.getElementById('setupWelcome')?.remove();document.getElementById('boardInstructionDialog')?.remove();const all=PlayerCards.allCopies(owner),first=all.filter(uid=>uid.startsWith(id+'#'));
  history=[];state=E.reduce(E.initial(),{type:'setup',players:2,automaClass:owner==='Working'?'Capitalist':'Working',confirmed:true,immigrant:'Gray',managePlayerCards:true,playerCardDecks:{[owner]:[...first,...all.filter(uid=>!first.includes(uid))]}});state.phase='player';
  const empty=(id,status='built')=>{const d=PlayerCards.companyDefinition(state.records,id);state.records.companies[id]={status,wage:d.wages?'L2':'unknown',operating:'no',machinery:false,strike:false,note:'',slots:d.workers.map(req=>({owner:'empty',skill:req.color,committed:false}))};};
  if(fixture==='specialize')empty('cc_shopping_mall_pool');
  if(fixture==='union'){empty('cc_vegetable_farm');state.records.common.unemployed.Working.Green=1;}
  if(fixture==='sign'){empty('cc_shopping_mall_pool');state.records.common.unemployed.Working.Blue=1;state.records.common.unemployed.Working.Purple=1;state.records.common.unemployed.Working.Gray=2;state.records.personal.State.values.cash=0;}
  if(fixture==='industrialize'){state.positions[1]='B';for(const id of ['cc_electronics_auto','cc_supermarket_pool','cc_fish_farm'])empty(id,'market');state.records.common.unemployed.Working.Green=1;}
  PlayerCardsUi.reset();render();persist();
 },{owner,id,fixture});}
 const checkCompany=id=>page.locator(`[data-assign-company="${id}"]`).check();
 const choose=(id,index,worker)=>page.locator(`[data-assign-slot="${id}"][data-index="${index}"]`).selectOption(worker);
 const close=()=>page.evaluate(()=>document.getElementById('boardInstructionDialog')?.close());
 await setup('Working','wc_specialization','specialize');await page.locator('#effectSkill').selectOption('Blue');
 await checkCompany('cc_shopping_mall_pool');await choose('cc_shopping_mall_pool',0,'u:Blue');await choose('cc_shopping_mall_pool',1,'u:Gray');
 assert.match(await page.locator('#cardEffectPreview').textContent(),/操業|誓約中/);assert.equal(await page.locator('#playCardEffect').isEnabled(),true);
 if(process.env.SCREENSHOT_DIR)await page.screenshot({path:path.join(process.env.SCREENSHOT_DIR,'specialization.png'),fullPage:true});
 await page.locator('#playCardEffect').click();assert.equal(await page.evaluate(()=>state.records.companies.cc_shopping_mall_pool.operating),'yes');assert.equal(await page.evaluate(()=>state.records.personal.Working.values.workerCount),11);assert.equal(await page.evaluate(()=>state.playerCards.classes.Working.discard.length),1);
 assert.match(await page.locator('#boardInstructionDialog').textContent(),/労働者の数|労働者|誓約中/);await close();
 await page.reload();assert.equal(await page.evaluate(()=>state.records.companies.cc_shopping_mall_pool.operating),'yes');await page.locator('#undo').click();assert.equal(await page.evaluate(()=>state.playerCards.classes.Working.hand.length),7);assert.equal(await page.evaluate(()=>state.records.companies.cc_shopping_mall_pool.operating),'no');
 await setup('Working','wc_specialization','union');await checkCompany('cc_vegetable_farm');await choose('cc_vegetable_farm',0,'u:Green');await choose('cc_vegetable_farm',1,'u:Gray');await page.locator('[data-assign-union="Food"]').check();
 assert.match(await page.locator('#cardEffectPreview').textContent(),/労働組合：設立/);await page.locator('#playCardEffect').click();assert.equal(await page.evaluate(()=>state.records.personal.Working.unions.Food),true);assert.equal(await page.evaluate(()=>state.records.personal.Working.values.vp),2);await close();
 // Employed sources are available for specialization, but not signing bonus.
 await setup('Working','wc_specialization');assert(await page.locator('[data-assign-slot] option[value^="c:"]').count()>0);
 await setup('Working','wc_signing_bonus','sign');assert.equal(await page.locator('[data-assign-slot] option[value^="c:"]').count(),0);
 for(const id of ['cc_shopping_mall_pool','state_local_tv_init'])await checkCompany(id);
 await choose('cc_shopping_mall_pool',0,'u:Blue');await choose('cc_shopping_mall_pool',1,'u:Gray');await choose('state_local_tv_init',0,'u:Purple');await choose('state_local_tv_init',1,'u:Gray');
 assert.match(await page.locator('#cardEffectPreview').textContent(),/30 → 46/);assert.match(await page.locator('#cardEffectPreview').textContent(),/国家の貸付金 0 → 1/);
 await page.locator('#playCardEffect').click();assert.equal(await page.evaluate(()=>state.records.personal.Working.values.cash),46);assert.equal(await page.evaluate(()=>state.records.personal.Capitalist.values.revenue),112);assert.equal(await page.evaluate(()=>state.records.personal.State.values.cash),42);await close();
 await page.locator('#undo').click();assert.equal(await page.evaluate(()=>state.records.personal.Working.values.cash),30);assert.equal(await page.evaluate(()=>state.records.companies.state_local_tv_init.operating),'no');
 await setup('Capitalist','cc_industrialization','industrialize');await page.locator('#effectBuildCompany').selectOption('cc_electronics_auto');
 assert.match(await page.locator('#effectBuildDetails').textContent(),/資本家13V、国家12V/);assert.equal(await page.locator('#effectBuildStaff').count(),0);
 await page.locator('#playCardEffect').click();assert.equal(await page.evaluate(()=>state.records.companies.cc_electronics_auto.operating),'yes');assert.equal(await page.evaluate(()=>state.records.personal.Capitalist.values.revenue),107);assert.equal(await page.evaluate(()=>state.records.personal.State.values.cash),108);await close();
 await page.locator('#undo').click();await page.locator('[name="playerCard"][value="cc_industrialization#1"]').check();await page.locator('#effectBuildCompany').selectOption('cc_supermarket_pool');await page.locator('#effectBuildStaff').check();await page.locator('#effectBuildWage').selectOption('L3');
 assert.equal(await page.locator('#playCardEffect').isEnabled(),true);
 if(process.env.SCREENSHOT_DIR)await page.screenshot({path:path.join(process.env.SCREENSHOT_DIR,'industrialization.png'),fullPage:true});
 await page.locator('#playCardEffect').click();assert.equal(await page.evaluate(()=>state.records.companies.cc_supermarket_pool.wage),'L3');assert.equal(await page.evaluate(()=>state.records.companies.cc_supermarket_pool.slots.every(slot=>slot.committed)),true);assert.equal(await page.evaluate(()=>state.playerCards.classes.Capitalist.discard.length),1);await close();
 // Live validation prevents a fifth assigned worker and leaves everything intact.
 await setup('Working','wc_signing_bonus','sign');await checkCompany('cc_shopping_mall_pool');await choose('cc_shopping_mall_pool',0,'u:Blue');await choose('cc_shopping_mall_pool',1,'u:Gray');await checkCompany('state_local_tv_init');await choose('state_local_tv_init',0,'u:Purple');await choose('state_local_tv_init',1,'u:Gray');await page.locator('[data-assign-union="Food"]').check();
 assert.equal(await page.locator('#playCardEffect').isDisabled(),true);assert.match(await page.locator('#cardEffectPreview').textContent(),/最大4人/);assert.equal(await page.evaluate(()=>state.playerCards.classes.Working.hand.length),7);
 for(const width of [390,1280]){await page.setViewportSize({width,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
 assert.deepEqual(errors,[]);console.log('PASS employment cards: specialization, unions, signing payments, industrialization, staffing, preview, undo, reload and responsive layout');
}finally{await browser.close();}})().catch(error=>{console.error(error);process.exitCode=1;});
