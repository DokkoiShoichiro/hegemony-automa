'use strict';
const E=WCA,$=id=>document.getElementById(id),KEY='wca-assistant-v4';
const names={AW:'労働者の割り当て',BGS:'商品・サービスの購入',STR:'ストライキ',DEM:'デモ',SA:'特殊アクション',PB:'法案の提議'};
for (const id of Object.keys(names)) names[id] += ` (${id})`;
const hints={AW:'入れ替え後の合法な配置案を確認。雇用する失業労働者、設立できる組合、失業人数と空きスロット数を調べます。異なる配置案を合算しないでください。',PB:'カード上の2政策について、現在位置・望みの位置・提議マーカー・除外状態を確認。政策2の追加移動の適用条件は現物参照。',BGS:'健康・教育・贅沢品ごとに必要量、所持量、販売元の在庫、合計費用、支払能力を確認。複数販売元とボーナスの単価計算は公式印刷10ページを参照。',STR:'労働市場Bなら組合数、Cなら対象企業数を確認。最低許容賃金で、ストライキ可能な企業だけを数えます。'};
const sections={AW:'労働者のチェック',PB:'政策のチェック',BGS:'商品とサービスのチェック',STR:'ストライキのチェック'};
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let state=E.initial(),history=[],blocked=false;
try{const raw=localStorage.getItem(KEY);if(raw){const data=JSON.parse(raw);E.validate(data.state);if(!Array.isArray(data.history))throw Error('履歴が不正です');data.history.forEach(E.validate);state=data.state;history=data.history;}}catch(e){blocked=true;showError('保存データを読み込めません。元データは上書きしません。JSONを読み込んで復旧してください。\n'+e.message);}
function showError(msg){$('error').hidden=false;$('error').textContent=msg;}
function persist(){if(blocked)return;$('saved').textContent='';try{localStorage.setItem(KEY,JSON.stringify({state,history}));$('saved').textContent='この端末に保存済み';}catch(e){$('saved').textContent='保存失敗・JSONを書き出してください';showError('ブラウザへの保存に失敗しました。画面の状態は保持しています。JSONを書き出してください。');}}
function act(event){if(blocked){showError('保存データの復旧が必要です。');return false;}try{const next=E.reduce(state,event);history.push(E.copy(state));state=next;$('error').hidden=true;render();persist();return true;}catch(e){showError(e.message);return false;}}
function options(values,chosen,labels={}){return values.map(x=>`<option value="${esc(x)}" ${x===chosen?'selected':''}>${esc(labels[x]||x)}</option>`).join('');}
const yesNo=id=>`<select id="${id}"><option value="unknown">未確認</option><option value="yes">実行できる</option><option value="no">実行できない</option></select>`;
function render(){
 $('counter').textContent=`ラウンド ${state.round} / 5 · 手番 ${state.turn}`;$('undo').disabled=!history.length||blocked;
 const rowIds=[...new Set([...E.rows(state,'actions'),...E.rows(state,'policies')])].sort((a,b)=>b-a);
 $('board').innerHTML=rowIds.map(r=>`<div class="priority-row"><div class="cards action ${((state.actions[r]||[]).length>3)?'crowded':''}">${[...(state.actions[r]||[])].reverse().map(id=>`<span class="chip" title="${names[id]}">${id}</span>`).join('')}</div><span class="row-label">${r+1}</span><div class="cards ${((state.policies[r]||[]).length>3)?'crowded':''}">${(state.policies[r]||[]).map(id=>`<span class="chip policy">${id}</span>`).join('')}</div></div>`).join('');
 $('aside').textContent=`脇に置く：${Object.keys(state.aside.actions).join('・')||'行動なし'} ／ 政策 ${Object.keys(state.aside.policies).join('・')||'なし'}${state.round===5?'（政策7はゲームから除外）':''}`;
 const ranked=E.rank(state,'actions');$('leaders').innerHTML=`最優先 <strong>${names[ranked[0]]||'なし'}</strong><br><span class="muted">次点 ${names[ranked[1]]||'なし'} ／ 政策 ${E.rank(state,'policies')[0]||'なし'}</span>`;
 const phaseLabels={start:'開始',card:'カード',checks:'チェック',action:'行動',end:'終了'};
 $('steps').innerHTML=Object.entries(phaseLabels).map(([k,v])=>`<span class="${k===state.phase?'active':''}" ${k===state.phase?'aria-current="step"':''}>${v}</span>`).join('');
 $('facts').value=state.facts;
 $('history').innerHTML=state.log.slice().reverse().map(l=>`<li><strong>${esc(l.type)}</strong> · ${esc(l.note)}${l.event.movements?'<br>'+l.event.movements.map(m=>`${esc(m.card)} +${m.up}${m.applied?'':'（除外中のため無変更）'}`).join(' ／ '):''}${l.event.source?'<br>出典：'+esc(l.event.source):''}</li>`).join('')||'<li>まだ操作はありません。</li>';
 renderFlow();renderEvents();
 WCARecords.render(state, act);
 document.querySelectorAll('#flow > .source').forEach(p=>{const d=document.createElement('details');d.className='rule-detail';const summary=document.createElement('summary');summary.textContent='出典を確認';p.before(d);d.append(summary,p);});
}
function renderJudgedCheck(flow,check,answers={}){
 const verdict=WCAJudge.evaluate(state,check,answers),resultText=verdict.movements.length?verdict.movements.map(m=>`${m.series==='policies'?'政策'+m.card:names[m.card]}を${m.up}段上げる`).join('、'):'優先順位は動かさない';
 const questions=verdict.questions.map(q=>q.type==='boolean'?`<label>${esc(q.label)}<select data-judge-answer="${q.id}" data-type="boolean"><option value="">選択してください</option><option value="true">はい</option><option value="false">いいえ</option></select></label>`:`<label>${esc(q.label)}<input data-judge-answer="${q.id}" data-type="number" min="${q.min??0}" ${q.max===undefined?'':`max="${q.max}"`} value="${answers[q.id]??''}"></label>`).join('');
 const heading=verdict.status==='ready'?resultText:verdict.status==='needsInput'?'判定に追加情報が必要です':'現物で確認してください';
 const bonus=state.index===0&&state.card.bonus?.trim()?`<p class="check-context"><span>カードのボーナス</span>${esc(state.card.bonus)}</p>`:'';
 flow.innerHTML=`<h2>${state.index+1} / 4 · ${names[check]}</h2>${bonus}<section class="judge-card ${verdict.status}"><p class="judge-result">${esc(heading)}</p>${verdict.warnings.map(x=>`<p class="judge-warning">${esc(x)}</p>`).join('')}${questions?`<div class="judge-questions">${questions}<button type="button" id="judgeRecalc">判定する</button></div>`:''}${verdict.status==='ready'?`<button type="button" id="next" class="judge-next">この結果で次へ</button>`:''}<button type="button" id="editResult" class="text-button">${verdict.status==='ready'?'結果を修正する':'結果を手入力する'}</button><details class="judge-reason"><summary>理由を見る</summary><ul>${verdict.reasons.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><p class="source">${esc(verdict.source)}「${esc(sections[check])}」</p></details></section><details id="manualEditor" class="manual-check"><summary>手入力</summary><div id="moves"></div><button type="button" id="addMove" class="quiet">＋ 移動を追加</button><label>補足（任意）<textarea id="reason" rows="2"></textarea></label>${verdict.status==='ready'?'':`<label><input type="checkbox" id="confirmed">現物で結果を確認した</label>`}<button type="button" id="manualNext">入力した結果で次へ</button></details>`;
 const addMove=m=>{const div=document.createElement('div');div.className='movement';div.innerHTML=`<select aria-label="移動するカード">${options([...E.ACTIONS,...['1','2','3','4','5','6','7'].map(x=>'政策'+x)],m?.series==='policies'?'政策'+m.card:m?.card||check)}</select><input aria-label="上げる段数" type="number" min="1" max="100" value="${m?.up||1}"><button type="button" class="quiet" aria-label="この移動を削除">×</button>`;div.querySelector('button').onclick=()=>div.remove();$('moves').appendChild(div);};
 $('addMove').onclick=()=>addMove();verdict.movements.forEach(addMove);$('editResult').onclick=()=>{$('manualEditor').open=true;$('manualEditor').scrollIntoView({block:'nearest'});};
 if($('judgeRecalc'))$('judgeRecalc').onclick=()=>{const next={...answers};document.querySelectorAll('[data-judge-answer]').forEach(el=>{if(el.value==='')return;next[el.dataset.judgeAnswer]=el.dataset.type==='boolean'?el.value==='true':Number(el.value);});renderJudgedCheck(flow,check,next);};
 const finish=manual=>{const movements=manual?[...$('moves').children].map(div=>{const id=div.querySelector('select').value;return {series:id.startsWith('政策')?'policies':'actions',card:id.replace('政策',''),up:Number(div.querySelector('input').value)};}):verdict.movements,note=[...verdict.reasons,$('reason')?.value].filter(Boolean).join('\n')||'優先順位の移動なし';if(verdict.status!=='ready'&&manual&&!$('confirmed')?.checked)return showError('現物で結果を確認してください');act({type:'check',confirmed:true,note,source:verdict.source,movements});};
 if($('next'))$('next').onclick=()=>finish(false);$('manualNext').onclick=()=>finish(true);
}
function renderFlow(){const flow=$('flow');
 if(state.phase==='start'){
  flow.innerHTML='<h2>手番開始の確認</h2><p>援助の獲得と、返済できる貸付金を確認します。</p><p class="source">転記：援助の獲得／貸付金の返済。公式 印刷9〜10ページ。</p><label><input type="checkbox" id="free">開始時の無償行動を確認した</label><button id="next">カードを入力する</button>';
  $('next').onclick=()=>{$('free').checked?act({type:'start',note:'開始時の無償行動を確認'}):showError('開始時の無償行動を確認してください');};
 }else if(state.phase==='card'){
  flow.innerHTML=`<h2>実物のAIカード</h2><label>カード番号（任意）<input id="number" type="number" min="1" max="30"></label><p>左から順に4つのチェックを指定します。</p><div class="grid">${E.CHECKS.map((v,i)=>`<label>${i+1}番目<select id="order${i}">${options(E.CHECKS,v,names)}</select></label>`).join('')}</div><div class="grid"><label>1つ目の政策<select id="p1">${options(['1','2','3','4','5','6','7'],'1')}</select></label><label>2つ目の政策<select id="p2">${options(['1','2','3','4','5','6','7'],'2')}</select></label></div><label>最初のチェックに関わるボーナス<textarea id="bonus" placeholder="なし、または現物の効果・適用条件"></textarea></label><button id="next">チェックを始める</button>`;
  $('next').onclick=()=>act({type:'card',number:$('number').value,order:[0,1,2,3].map(i=>$('order'+i).value),policies:[$('p1').value,$('p2').value],bonus:$('bonus').value,note:'AIカードを入力'});
 }else if(state.phase==='checks'){
 const check=state.card.order[state.index];
  return renderJudgedCheck(flow,check);
 }else if(state.phase==='action'){
  const [a,b]=E.rank(state,'actions');
  flow.innerHTML=`<h2>実行する行動</h2><label>最優先：${names[a]}${yesNo('first')}</label><label id="secondLabel" hidden>次点：${names[b]}${yesNo('second')}</label><p class="notice">対象の自動選択は未対応。現物の行動基準で対象と可否を確認してください。特殊アクションはAIカード下部を参照。</p><label><input type="checkbox" id="policyReviewed">PBの場合：政策優先順・提議条件・第5ラウンドの制限を確認した</label><label><input type="checkbox" id="strExhausted">STR実行後、ストライキトークンを使い切った</label><label>最下段より下へ下降する場合の手動裁定<select id="bottom"><option value="">未確認（該当時に停止）</option><option value="floor">現物で確認：最下段に置く</option><option value="extend">現物で確認：下に段を追加する</option></select></label><label>実行対象・補足<textarea id="actionNote" placeholder="企業名、購入先、実行した特殊アクションなど"></textarea></label><label><input type="checkbox" id="executed">実際の行動を盤面で実行した</label><p class="source">出典：公式 印刷6ページ、Word「アクションの詳細」。下限裁定は確認待ちのため手動記録。</p><button id="next">実行した行動を確定</button>`;
  $('first').onchange=()=>{$('secondLabel').hidden=$('first').value!=='no';};
  $('next').onclick=()=>{if(!$('executed').checked)return showError('盤面で実行した行動を確認してください');act({type:'action',first:$('first').value,second:$('second').value,bottom:$('bottom').value,policyReviewed:$('policyReviewed').checked,strExhausted:$('strExhausted').checked,note:$('actionNote').value});};
 }else{
  flow.innerHTML='<h2>手番終了の確認</h2><p>法案を提議した場合は下の政策イベントを記録してください。資源の使用は贅沢品 → 教育 → 健康の順で確認し、使用後の人口や盤面の変化を反映してください。</p><p class="source">出典：Word「繁栄度を上げる」、公式 印刷9〜10ページ。</p><label><input type="checkbox" id="free">政策イベント・終了時の無償行動・盤面メモを確認した</label><button id="next">手番を終える</button>';
  $('next').onclick=()=>{$('free').checked?act({type:'end',note:'終了時の処理を確認'}):showError('終了時の処理を確認してください');};
 }
}
function renderEvents(){
 const locked=['checks','action'].includes(state.phase);
 $('events').innerHTML=`<h3>政策イベント</h3><p class="source">自分・他プレイヤー両方の提議を記録。公式 印刷6〜7ページ。提議直後の投票は「可決／否決」を直接選びます。</p><div class="grid"><label>政策<select id="policyId">${options(['1','2','3','4','5','6','7'],'1')}</select></label><label>現在の施行位置<select id="position">${options(['A','B','C'],state.positions['1'])}</select></label></div><label>イベント<select id="result"><option value="position">位置のみ更新（優先順位は変更しない）</option><option value="pending">法案提議・即時投票なし</option><option value="failed">即時投票・否決（優先順位は維持）</option><option value="passed">即時投票・可決（新しい位置を指定）</option></select></label><button id="policyApply" class="quiet" ${locked?'disabled':''}>政策イベントを記録</button><p class="source">確認済み位置：${Object.entries(state.positions).map(([k,v])=>k+v).join(' / ')}。初期値は仮入力。</p><div class="buttons"><button id="demReturn" class="quiet" ${locked||!state.aside.actions.DEM?'disabled':''}>デモトークン除去・DEM復帰</button><button id="strikeAside" class="quiet" ${locked?'disabled':''}>STRトークン枯渇・除外</button></div><h3>次ラウンドの準備</h3><label><input type="checkbox" id="roundConfirmed">全7政策の現在位置を実盤面と照合した</label><button id="round" class="quiet" ${state.phase!=='start'||state.round===5?'disabled':''}>次のラウンドへ</button>${locked?'<p class="muted">チェック中の盤面変更は、開始時まで戻してから記録します。</p>':''}`;
 $('policyId').onchange=()=>{$('position').value=state.positions[$('policyId').value];};
 $('policyApply').onclick=()=>act({type:'policy',id:$('policyId').value,position:$('position').value,result:$('result').value,note:`政策${$('policyId').value} ${$('result').selectedOptions[0].textContent}`,source:'公式 p.6–7'});
 $('demReturn').onclick=()=>act({type:'demReturn',note:'デモトークン除去',source:'公式 p.10'});
 $('strikeAside').onclick=()=>act({type:'strikeAside',note:'ストライキトークン枯渇',source:'公式 p.10'});
 $('round').onclick=()=>act({type:'round',confirmed:$('roundConfirmed').checked,note:'次ラウンドの準備',source:'公式 p.6–7,9–10'});
}
const newGame=document.createElement('button');newGame.id='newGame';newGame.className='quiet';newGame.textContent='新しいゲーム';$('undo').before(newGame);
newGame.onclick=()=>WCARecords.openSetupDialog();
$('undo').onclick=()=>{if(!history.length||blocked||!WCARecords.canLeave())return;state=history.pop();render();persist();};
$('saveFacts').onclick=()=>act({type:'facts',value:$('facts').value,note:'盤面メモを更新'});
$('export').onclick=()=>{const raw=blocked?localStorage.getItem(KEY):JSON.stringify({state,history},null,2);const url=URL.createObjectURL(new Blob([raw||''],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='wca-save.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
$('import').onchange=async ev=>{const file=ev.target.files[0];if(!file)return;try{const data=JSON.parse(await file.text());E.validate(data.state);if(!Array.isArray(data.history))throw Error('履歴がありません');data.history.forEach(E.validate);if(!confirm('現在の状態を読み込んだ保存データに置き換えますか？'))return;state=data.state;history=data.history;blocked=false;$('error').hidden=true;render();persist();}catch(e){showError('読み込み失敗。現在の状態は変更していません。'+e.message);}finally{ev.target.value='';}};
render();if(!blocked)persist();
if(document.modelContext?.registerTool){try{Promise.resolve(document.modelContext.registerTool({name:'read_wca_turn',description:'現在のWCA手番と優先順位、確認状態を読み取る',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute(input){if(!input||typeof input!=='object'||Object.keys(input).length)throw Error('引数は空のオブジェクトです');return E.copy({round:state.round,phase:state.phase,index:state.index,actions:state.actions,policies:state.policies,aside:state.aside});}})).catch(()=>{});}catch{}}

