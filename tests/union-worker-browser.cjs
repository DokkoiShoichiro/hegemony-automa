const {chromium}=require(process.argv[2]||'playwright'),assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});try{
 const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(process.env.APP_URL||'http://127.0.0.1:4173');
 const cases=[['Food','Green','農業','緑'],['Luxury','Blue','贅沢品','青'],['Health','White','医療','白'],['Education','Orange','教育','橙'],['Media','Purple','メディア','紫']];
 for(const [industry,skill,name,color] of cases){
  await page.evaluate(({industry,skill})=>{
   document.getElementById('setupWelcome')?.remove();document.getElementById('boardInstructionDialog')?.remove();history=[];let s=E.reduce(E.initial(),{type:'setup',players:2,immigrant:'',market:[],confirmed:true});s=E.reduce(s,{type:'start'});s=E.reduce(s,{type:'card',number:'',order:['AW','PB','BGS','STR'],policies:['2','7'],bonus:''});for(let i=0;i<4;i++)s=E.reduce(s,{type:'check',confirmed:true,note:'test',movements:[]});s.actions={0:E.ACTIONS.filter(x=>x!=='AW'),2:['AW']};
   for(const c of Object.values(s.records.companies)){c.status='unbuilt';c.operating='no';c.strike=false;c.slots.forEach(x=>{x.owner='empty';x.committed=false;});}
   const ids={Food:['cc_supermarket_init','cc_vegetable_farm'],Luxury:['cc_shopping_mall_init','cc_shopping_mall_pool'],Health:['cc_clinic_init','cc_clinic_pool'],Education:['cc_college_init','cc_college_pool'],Media:['cc_radio_station','cc_lobbying_firm']}[industry];for(const id of ids){const c=s.records.companies[id];c.status='built';c.operating='yes';c.slots.forEach(x=>x.owner='Working');}
   s.records.common.unemployed.Working={Gray:3,Green:0,Blue:0,White:0,Orange:0,Purple:0};s.records.common.unemployed.Working[skill==='Green'?'Blue':'Green']=1;state=s;WCARecords.validate(state.records);render();persist();
  },{industry,skill});
  assert.equal(await page.evaluate(()=>WCAJudge.evaluateAction(state,'AW').feasible),false);
  await page.evaluate(skill=>{state.records.common.unemployed.Working[skill]=1;WCARecords.validate(state.records);render();persist();},skill);
  const count=await page.evaluate(()=>state.records.personal.Working.values.workerCount);assert.match(await page.locator('#flow').innerText(),new RegExp(`${name}の熟練労働者（${color}）1人を${industry}産業の労働組合へ配置`));
  await page.locator('#next').click();const text=await page.locator('#boardInstructionDialog').innerText();assert.match(text,new RegExp(`${industry}産業の労働組合へ${name}の熟練労働者（${color}）1人を配置`));assert.match(text,/企業で働く4人とは別に必要/);assert.doesNotMatch(text,/労働組合トークン/);
  const after=await page.evaluate(()=>JSON.parse(localStorage.getItem('wca-assistant-v4')).state.records);assert.equal(after.personal.Working.unions[industry],true);assert.equal(after.common.unemployed.Working[skill],0);assert.equal(after.common.unemployed.Working.Gray,3);assert.equal(after.personal.Working.values.workerCount,count);
  await page.locator('#boardInstructionDone').click();await page.locator('#undo').click();assert.equal(await page.evaluate(industry=>state.records.personal.Working.unions[industry],industry),false);assert.equal(await page.evaluate(skill=>state.records.common.unemployed.Working[skill],skill),1);
  await page.locator('#next').click();await page.locator('#boardInstructionDone').click();await page.reload();assert.equal(await page.evaluate(industry=>state.records.personal.Working.unions[industry],industry),true);assert.equal(await page.evaluate(skill=>state.records.common.unemployed.Working[skill],skill),0);
 }
 assert.deepEqual(errors,[]);console.log('PASS all five union colors: matching skilled worker required, explicit preview and physical placement, counts, undo and reload');
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
