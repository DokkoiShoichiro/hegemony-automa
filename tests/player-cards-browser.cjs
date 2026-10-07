const {chromium}=require(process.argv[2]||'playwright'),assert=require('node:assert/strict'),path=require('node:path'),{pathToFileURL}=require('node:url');
(async()=>{const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium'});try{
 const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.APP_URL||pathToFileURL(path.resolve(__dirname,'../dist/index.html')).href);
 // Exercise the actual welcome dialog: fresh games opt in to card management.
 await page.locator('#setupWelcome').waitFor();await page.locator('#setupWelcome select[name="automaClass"]').count().then(async n=>{if(n)await page.locator('#setupWelcome select[name="automaClass"]').selectOption('Capitalist');else await page.locator('#setupWelcome [name="automaClass"][value="Capitalist"]').check();});
 await page.locator('#setupWelcome button[type="submit"]').click();
 assert.equal(await page.evaluate(()=>state.playerCards.classes.Working.hand.length),7);
 assert.equal(await page.locator('#playerHand').count(),1);
 // Use deterministic deals so that both effect and basic paths are checked.
 async function setup(owner,id){await page.evaluate(({owner,id})=>{document.getElementById('setupWelcome')?.remove();document.getElementById('boardInstructionDialog')?.remove();const ids=PlayerCards.allCopies(owner),first=ids.filter(uid=>uid.startsWith(id+'#')),order=[...first,...ids.filter(uid=>!first.includes(uid))];history=[];state=E.reduce(E.initial(),{type:'setup',players:2,immigrant:'Gray',automaClass:owner==='Working'?'Capitalist':'Working',confirmed:true,managePlayerCards:true,playerCardDecks:{[owner]:order}});state.phase='player';PlayerCardsUi.reset();render();persist();},{owner,id});}
 await setup('Working','wc_healthcare_benefits');
 assert.equal(await page.locator('#playerEnd').isDisabled(),true);
 await page.locator('#effectQty').fill('3');if(process.env.SCREENSHOT_DIR)await page.screenshot({path:path.join(process.env.SCREENSHOT_DIR,'player-cards-working.png'),fullPage:true});assert.match(await page.locator('#cardEffectPreview').textContent(),/30 → 22/);
 await page.locator('#playCardEffect').click();
 assert.equal(await page.evaluate(()=>state.playerCards.classes.Working.hand.length),6);assert.equal(await page.evaluate(()=>state.records.personal.Working.values.health),3);
 assert.equal(await page.locator('#playerEnd').isEnabled(),true);assert.equal(await page.locator('#playCardEffect').count(),0);
 assert.equal(await page.locator('#boardInstructionDialog').isVisible(),true);assert.match(await page.locator('#boardInstructionDialog').textContent(),/健康|医療/);
 await page.evaluate(()=>document.getElementById('boardInstructionDialog').close());
 await page.locator('#workingUseHealth').click();assert.equal(await page.evaluate(()=>state.playerCards.classes.Working.discard.length),1);
 await page.evaluate(()=>document.getElementById('boardInstructionDialog').close());await page.locator('#undo').click();await page.locator('#undo').click();
 assert.equal(await page.evaluate(()=>state.playerCards.classes.Working.hand.length),7);assert.equal(await page.evaluate(()=>state.records.personal.Working.values.cash),30);
 await page.reload();assert.equal(await page.evaluate(()=>state.playerCards.classes.Working.hand.length),7);
 // Selecting an unsupported effect still allows a basic action; no bonus.
 await setup('Working','wc_fake_news');assert.equal(await page.locator('#playCardEffect').count(),0);assert.match(await page.locator('#playerCardDetails').textContent(),/次の実装/);
 await page.locator('#workingPressure').click();assert.equal(await page.evaluate(()=>state.playerCards.classes.Working.discard[0]),'wc_fake_news#1');
 await page.evaluate(()=>document.getElementById('boardInstructionDialog').close());
 await page.locator('#playerEnd').click();assert.equal(await page.evaluate(()=>state.phase),'start');
 await setup('Capitalist','cc_offshore_companies');await page.locator('#playCardEffect').click();
 assert.equal(await page.evaluate(()=>state.records.personal.Capitalist.values.capital),60);assert.equal(await page.locator('#capPressure').isDisabled(),true);assert.equal(await page.locator('#capRaiseWage').isEnabled(),true);
 await page.evaluate(()=>document.getElementById('boardInstructionDialog').close());
 assert.equal(await page.locator('#capPurchaseSource option[value="Foreign"]').count(),0);
 // Multiple printed export transactions consume one card, not one per sale.
 await setup('Capitalist','cc_fake_news');await page.evaluate(()=>{state.records.personal.Capitalist.values.food=8;state.records.trade.exportCard.offers=[{resource:'food',quantity:3,revenue:20},{resource:'food',quantity:5,revenue:35}];render();});
 await page.locator('details').filter({has:page.locator('#capExport')}).locator('summary').click();
 await page.locator('[data-player-export="0"]').check();await page.locator('[data-player-export="1"]').check();await page.locator('#capExport').click();
 assert.equal(await page.evaluate(()=>state.records.personal.Capitalist.values.food),0);assert.equal(await page.evaluate(()=>state.playerCards.classes.Capitalist.discard.length),1);
 await page.evaluate(()=>document.getElementById('boardInstructionDialog').close());
 // Preparation automatically draws five cards and retains the two leftovers.
 await page.evaluate(()=>{const c=state.playerCards.classes.Capitalist;while(c.hand.length>2)c.discard.push(c.hand.shift());state.playerCards.used=false;state.phase='preparation';state.turn=5;render();});
 assert.equal(await page.locator('#prepActionCards').count(),0);assert.match(await page.locator('#flow').textContent(),/確定時に5枚/);
 await page.locator('#prepRandomMarket').click();await page.locator('#prepConfirmed').check();await page.locator('#preparationApply').click();
 assert.equal(await page.evaluate(()=>state.round),2);assert.equal(await page.evaluate(()=>state.playerCards.classes.Capitalist.hand.length),7);assert.equal(await page.evaluate(()=>state.playerCards.classes.Capitalist.deck.length),28);
 await page.evaluate(()=>document.getElementById('boardInstructionDialog').close());
 for(const width of [390,1280]){await page.setViewportSize({width,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
 assert.deepEqual(errors,[]);console.log('PASS player cards: fresh setup, effects, basic discard, free actions, undo, reload, export, preparation and responsive layout');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
