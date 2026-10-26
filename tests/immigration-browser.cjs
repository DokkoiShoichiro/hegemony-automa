const {chromium}=require(process.argv[2]||'playwright'),assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});try{
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true}),errors=[];page.on('pageerror',error=>errors.push(error.message));await page.goto(process.env.APP_URL||'http://127.0.0.1:4173');await page.locator('#setupWelcomeLater').click();
 const close=async()=>{while(await page.locator('#boardInstructionDialog[open]').count())await page.locator('#boardInstructionDone').click();};
 async function setup(mode='Middle',policy='B',step=1){await page.evaluate(({mode,policy,step})=>{
  state=E.reduce(E.initial(),{type:'setup',players:mode==='Working'?2:mode==='FourState'?4:3,automaClass:mode,confirmed:true,managePlayerCards:true,middleSkill:'Green',immigrationDeck:Object.keys(E.IMMIGRATION_CARD_DATA)});
  state.positions[7]=policy;history=[];if(MiddleClass.hasMiddle(state.records)){state.records.personal.Middle.values.prosperityStep=step;state.records.personal.Middle.values.prosperity=MiddleClass.prosperity[step];}render();persist();
 },{mode,policy,step});}
 // Real resource-use actions produce one physical marker instruction, including a plateau and the track limit.
 for(const [step,next,value] of [[1,2,2],[5,6,5],[9,10,7],[10,10,7]]){
  await setup('Middle','B',step);await page.evaluate(()=>{state.phase='player';state.records.personal.Middle.values.consumedHealth=state.records.personal.Middle.values.population;render();persist();});
  await page.locator('#middleUseHealth').evaluate(el=>el.closest('details').open=true);await page.locator('#middleUseHealth').click();
  const dialog=page.locator('#boardInstructionDialog'),lines=dialog.locator('li').filter({hasText:'中産階級の繁栄度'});assert.equal(await lines.count(),next===step?0:1);assert.doesNotMatch(await dialog.textContent(),/prosperityStep/);
  if(next!==step)assert.match(await lines.textContent(),new RegExp(`マーカーを1段階進める（繁栄度 ${step===5||step===9?value+'のまま':step+' → '+value}）`));
  assert.equal(await page.evaluate(()=>state.records.personal.Middle.values.prosperityStep),next);assert.equal(await page.evaluate(()=>state.records.personal.Middle.values.prosperity),value);await close();await page.reload();assert.equal(await page.evaluate(()=>state.records.personal.Middle.values.prosperityStep),next);await page.locator('#undo').click();assert.equal(await page.evaluate(()=>state.records.personal.Middle.values.prosperityStep),step);
 }
 // Both classes draw separately from the same rotating deck; each uses only its own class's entry.
 for(const mode of ['Working','Middle','ThreeCapitalist','FourState'])for(const policy of ['A','B','C']){
  await setup(mode,policy,8);const before=await page.evaluate(()=>{
   state.phase='preparation';if(StatePlayer.active(state)){state.government.eventDiscard.push(...state.government.events);state.government.events=[];state.government.agendaDiscard.push(state.government.agenda);state.government.agenda=null;}state.immigrationDeck=['W-Green-1','M-White-1','W-Orange-1','M-Purple-1',...Object.keys(E.IMMIGRATION_CARD_DATA).filter(id=>!['W-Green-1','M-White-1','W-Orange-1','M-Purple-1'].includes(id))];
   for(const pile of Object.values(state.playerCards.classes))pile.discard.push(...pile.hand.splice(0,5));render();persist();return {counts:{Working:state.records.personal.Working.values.workerCount,Middle:state.records.personal.Middle?.values.workerCount},unemployed:structuredClone(state.records.common.unemployed),deck:[...state.immigrationDeck]};
  });const n={A:0,B:1,C:2}[policy],middle=mode!=='Working';
  if(middle)assert.match(await page.locator('[data-prep-immigration-note]').textContent(),n?new RegExp(`別々に移民カードを${n}枚ずつ`):/両階級とも移民による追加はありません/);
  assert.equal(await page.locator('[data-prep-immigration]').count(),0);await page.locator('#preparationApply').click();assert.equal(await page.locator('#boardInstructionDialog[open]').count(),1,mode+'/'+policy+': '+await page.locator('#error').textContent());const dialog=page.locator('#boardInstructionDialog'),text=await dialog.textContent();assert.doesNotMatch(text,/prosperityStep|専用の移民カード|の面は使わ/);
  assert.equal(await dialog.locator('li').filter({hasText:'労働者の移民カード'}).count(),n?1:0);assert.equal(await dialog.locator('li').filter({hasText:'中産階級の移民カード'}).count(),n&&middle?1:0);
  if(n){assert.match(text,new RegExp(`労働者の移民カード（${n}枚）`));if(middle)assert.match(text,new RegExp(`中産階級の移民カード（${n}枚・別に引く）`));}
  if(middle){assert.equal(await dialog.locator('li').filter({hasText:'中産階級の繁栄度'}).count(),1);assert.match(text,/繁栄度マーカーを2段階戻す（繁栄度 6 → 5）/);}
  const after=await page.evaluate(()=>({round:state.round,working:state.records.personal.Working.values.workerCount,middle:state.records.personal.Middle?.values.workerCount,unemployed:state.records.common.unemployed,last:state.lastPreparation,deck:state.immigrationDeck,skill:state.lastPreparation.Middle?.skill}));
  assert.equal(after.round,2);assert.equal(after.working,before.counts.Working+2+n);assert.deepEqual(after.last.immigrationCards.map(c=>c.id),before.deck.slice(0,n));assert.deepEqual(after.last.middleImmigrationCards.map(c=>c.id),middle?before.deck.slice(n,n*2):[]);
  if(middle)assert.equal(after.middle,before.counts.Middle+2+n);const drawn=n*(middle?2:1);assert.deepEqual(after.deck,[...before.deck.slice(drawn),...before.deck.slice(0,drawn)]);
  // Verify each skill's addition, catching accidental application of both faces of a card.
  for(const owner of middle?['Working','Middle']:['Working'])for(const skill of Object.keys(before.unemployed[owner])){const cards=owner==='Working'?after.last.immigrationCards:after.last.middleImmigrationCards;const base=owner==='Working'?(skill==='Gray'?2:0):(skill==='Gray'?1:0)+(skill===after.skill?1:0);assert.equal(after.unemployed[owner][skill],before.unemployed[owner][skill]+base+cards.filter(c=>c[owner]===skill).length,`${mode}/${policy}/${owner}/${skill}`);}
  for(const width of [320,390,1280]){await page.setViewportSize({width,height:844});assert(await dialog.evaluate(el=>el.scrollWidth<=el.clientWidth));}await page.setViewportSize({width:390,height:844});if(mode==='FourState'&&policy==='B')await dialog.screenshot({path:'/tmp/preparation-instructions-fixed.png'});await close();await page.reload();assert.equal(await page.evaluate(()=>state.round),2);await page.locator('#undo').click();assert.equal(await page.evaluate(()=>state.round),1);
 }
 assert.deepEqual(errors,[]);console.log('PASS prosperity and immigration instructions: one marker move, plateau/limit/rollback, separate class cards and exact workers for all policies in 2/3/4-player games, deck rotation, reload/undo/mobile');
 }finally{await browser.close();}})().catch(error=>{console.error(error);process.exitCode=1;});
