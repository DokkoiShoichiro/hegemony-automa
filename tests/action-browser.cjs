const {chromium}=require(process.argv[2]);
const {pathToFileURL}=require('node:url');
const path=require('node:path'),assert=require('node:assert/strict');

(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(pathToFileURL(path.resolve(__dirname,'../dist/index.html')).href);await page.evaluate(()=>localStorage.clear());await page.reload();
  await page.locator('#setupWelcomeForm button[type=submit]').click();
  await page.evaluate(()=>{state.records.personal.Working.values.cash=120;state.records.personal.Working.values.loans=3;render();});assert.match(await page.locator('#flow').innerText(),/援助の獲得[\s\S]*対象なし[\s\S]*貸付金の返済[\s\S]*2枚返済・支払100[\s\S]*資金 120 → 20/);assert.equal(await page.locator('#free').count(),0);await page.locator('#next').click();assert.match(await page.locator('#boardInstructionDialog').innerText(),/労働者の資金.*100減らす[\s\S]*労働者の貸付金.*2減らす/);await page.locator('#boardInstructionDone').click();await page.evaluate(()=>{state.records.personal.Working.values.cash=30;});
  assert.equal(await page.evaluate(()=>state.phase),'checks');assert.equal(await page.evaluate(()=>state.aiDeck.length),29);assert.equal(await page.evaluate(()=>state.aiDiscard.length),1);assert.match(await page.locator('#flow .eyebrow').textContent(),/AIカード #\d+/);assert.equal(await page.locator('#number').count(),0);
  await page.evaluate(()=>{state.phase='checks';state.index=0;state.card={number:'1',...WCAJudge.CARD_DATA['1']};render();});assert.equal(await page.locator('.check-context .vardis-symbol').count(),1);assert.equal(await page.locator('.check-context .vardis-symbol').getAttribute('aria-label'),'ヴァルディス');
  await page.evaluate(()=>{state.phase='action';state.card={number:'',order:['AW','PB','BGS','STR'],policies:['2','7'],bonus:''};state.actions={0:['SA','STR','DEM','AW','BGS'],1:['PB']};render();});
  assert.match(await page.locator('.action-advice strong').first().textContent(),/法案の提議 \(PB\)：実行可能/);
  assert.match(await page.locator('.action-advice p').first().textContent(),/政策1：C → B/);
  assert.equal(await page.locator('#first').inputValue(),'yes');
  assert.equal(await page.locator('.action-correction').getAttribute('open'),null);assert.equal(await page.locator('.action-correction summary').textContent(),'判定を修正する');
  await page.evaluate(()=>{state.actions={0:['STR','DEM','AW','BGS','PB'],1:['SA']};render();});
  assert.match(await page.locator('.action-advice strong').first().textContent(),/特殊アクション \(SA\)：現物確認/);
  assert.match(await page.locator('.action-advice p').first().textContent(),/実物AIカード下部/);
  assert.equal(await page.locator('#first').inputValue(),'unknown');
  assert.equal(await page.locator('.action-correction').getAttribute('open'),'');
  assert.equal(await page.locator('.action-advice').count(),2);
  await page.locator('#first').selectOption('no');
  assert.equal(await page.locator('#secondLabel').isVisible(),true);
  await page.evaluate(()=>{state.phase='action';state.actions={0:['SA','STR','AW','BGS','PB'],1:['DEM']};render();});
  assert.equal(await page.locator('#first').inputValue(),'no');
  assert.equal(await page.locator('#second').inputValue(),'unknown');
  const cubes=await page.evaluate(()=>state.records.common.values.workingVotesOutside);
  await page.locator('#second').selectOption('no');await page.locator('#manualConfirmed').check();await page.locator('#next').click();assert.match(await page.locator('#boardInstructionDialog').textContent(),/袋の外の労働者票を3減らす/);await page.locator('#boardInstructionDone').click();
  assert.equal(await page.evaluate(()=>state.records.common.values.workingVotesOutside),cubes-3);
  await page.evaluate(()=>{state.phase='action';state.actions={0:['SA','STR','DEM','AW','PB'],2:['BGS']};render();});
  assert.equal(await page.locator('#first').inputValue(),'yes');await page.locator('#next').click();assert.equal(await page.locator('#boardInstructionDialog').isVisible(),true);await page.locator('#boardInstructionDone').click();
  assert.equal(await page.evaluate(()=>state.phase),'end');assert.equal(await page.evaluate(()=>state.records.personal.Working.values.health),3);assert.equal(await page.evaluate(()=>state.records.personal.Working.values.cash),15);
  await page.evaluate(()=>{state.phase='action';state.card={number:'6',order:['PB','BGS','AW','STR'],policies:['2','3'],bonus:''};state.records.personal.Working.values.cash=30;state.records.personal.Working.values.vp=0;state.actions={0:['STR','DEM','AW','BGS','PB'],2:['SA']};render();});
  assert.match(await page.locator('.action-advice strong').first().textContent(),/特殊アクション \(SA\)：実行可能/);assert.equal(await page.locator('#first').inputValue(),'yes');await page.locator('#next').click();assert.equal(await page.evaluate(()=>state.records.personal.Working.values.cash),10);assert.equal(await page.evaluate(()=>state.records.personal.Working.values.vp),5);await page.locator('#boardInstructionDone').click();
  await page.evaluate(()=>{state.phase='action';state.card={number:'1',order:['AW','BGS','PB','STR'],policies:['1','2'],bonus:''};state.actions={0:['STR','DEM','AW','BGS','PB'],2:['SA']};render();});
  assert.equal(await page.locator('[data-cubes-for="first"]').isVisible(),true);await page.locator('[data-cubes-for="first"] [data-cube-class="Capitalist"]').fill('2');await page.locator('[data-cubes-for="first"] [data-cube-class="Middle"]').fill('1');const workingOutside=await page.evaluate(()=>state.records.common.values.workingVotesOutside);await page.locator('#next').click();assert.equal(await page.evaluate(()=>state.records.common.values.workingVotesOutside),workingOutside-3);await page.locator('#boardInstructionDone').click();
  await page.evaluate(()=>{state.phase='end';const w=state.records.personal.Working.values;w.population=3;w.workerCount=12;w.prosperity=0;w.luxury=0;w.education=0;w.health=3;render();});await page.locator('#useResource').click();const instruction=await page.locator('#boardInstructionDialog').textContent();assert.match(instruction,/ボーナス2/);assert.match(instruction,/失業労働者エリアに未熟練労働者を1個追加/);assert.match(instruction,/個人ボードの人口を\+1/);assert.match(instruction,/繁栄度を\+1/);await page.locator('#boardInstructionDone').click();
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);assert.deepEqual(errors,[]);
  console.log('PASS automatic action advice and manual special action on mobile');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

