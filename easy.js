// A tiny guided practice loop. No account, microphone or timer required.
const PRACTICE_ORDER=['greetings','introductions','food','home','numbers','places','routine','alphabet'];
function tr(en,th){return state.thai?th:en;}
function easyPool(){return PRACTICE_ORDER.flatMap(id=>lessons.find(l=>l.id===id)?.cards||[]);}
function startEasy(more=false){
 const pool=easyPool();if(!pool.length)return;
 const old=state.easy;
 if(more||!old||old.day!==day()||!Array.isArray(old.ids)||!old.ids.length||!old.ids.every(id=>pool.some(c=>c.id===id))){
  const cursor=Number.isInteger(state.easyCursor)&&state.easyCursor>=0?state.easyCursor:0;
  state.easy={day:day(),ids:Array.from({length:5},(_,i)=>pool[(cursor+i)%pool.length].id),index:0,stage:'listen',selected:null};
 }
 save();history.pushState(null,'','#easy');session=null;render();window.scrollTo(0,0);
}
function easyChoices(card){
 const pool=easyPool();const other=pool.find(c=>c.id!==card.id&&c.thai!==card.thai&&c.id.split('-')[0]===card.id.split('-')[0])||pool.find(c=>c.thai!==card.thai);
 return Number(card.id.split('-').pop())%2===0?[card.thai,other.thai]:[other.thai,card.thai];
}
function easyHome(){const e=state.easy;const active=e&&e.day===day()&&e.index<e.ids.length;const done=e&&e.day===day()&&e.index>=e.ids.length;return `
 <section class="easy-welcome"><span class="pill">${tr('A LITTLE ENGLISH, EVERY DAY','ฝึกอังกฤษง่าย ๆ ทุกวัน')}</span><h1>${tr('You can do this.','คุณทำได้ 😊')}</h1><p class="muted">${tr('Five useful words. Listen, say, and try.','วันละ 5 คำที่ใช้ได้จริง ฟัง พูดตาม แล้วลองตอบ')}</p></section>
 <section class="panel green easy-start"><span class="eyebrow" style="color:#d8eadd">${tr('YOUR EASY DAILY PRACTICE','เริ่มง่าย ๆ วันละนิด')}</span><h2>${done?tr('Five words. Well done!','ครบ 5 คำแล้ว เก่งมาก!'):active?tr('Let’s keep going.','มาฝึกต่อกันเถอะ'):state.easyCursor?tr('Five useful words. One small step.','อีก 5 คำง่าย ๆ ที่ใช้ได้จริง'):tr('Let’s start with “Hello”.','เริ่มจากคำว่า Hello กัน')}</h2><p class="muted">${done?tr('Come back tomorrow, or practise five more.','พรุ่งนี้มาใหม่ หรือฝึกเพิ่มอีก 5 คำก็ได้'):tr('No rush. No speaking test. Just a little practice.','ไม่ต้องรีบ ไม่สอบพูด ค่อย ๆ ฝึกไปด้วยกัน')}</p>${btn(done?tr('Practise 5 more words →','ฝึกเพิ่มอีก 5 คำ →'):active?tr(`Continue · ${e.index}/5 words done →`,`ฝึกต่อ · ทำแล้ว ${e.index}/5 คำ →`):tr('Start easy practice →','เริ่มฝึกง่าย ๆ →'),done?'easy-more':'easy-start','class="white wide large-button"')}</section>
 <div class="easy-how"><span>1. ${tr('Listen','ฟัง')}</span><span>2. ${tr('Say it','พูดตาม')}</span><span>3. ${tr('Try','ลองตอบ')}</span></div>
 <p class="muted small-text">${tr('Your place is saved automatically. A few minutes is enough.','ระบบจำจุดที่คุณฝึกไว้ให้ ใช้เวลาแค่ไม่กี่นาทีก็พอ')}</p>
 <div class="panel row"><div><strong>${tr('Today’s practice','วันนี้ฝึกไปแล้ว')}</strong><p class="muted">${count()} ${tr('activities','กิจกรรม')} · ${streak()} ${tr('day streak','วันต่อเนื่อง')}</p></div><span class="practice-flower" aria-hidden="true">✦</span></div>
 <details class="install"><summary>${tr('Install on your iPhone','เพิ่มแอปไว้บนหน้าจอ iPhone')}</summary><p>${tr('In Safari: Share → Add to Home Screen → Add. Open once online to save lessons for offline practice.','เปิดใน Safari → แชร์ → เพิ่มไปยังหน้าจอโฮม → เพิ่ม เปิดขณะต่ออินเทอร์เน็ตหนึ่งครั้งเพื่อเก็บบทเรียนไว้ฝึกแบบออฟไลน์')}</p><p id="offline-status" class="small-text muted">${tr('Checking offline readiness…','กำลังตรวจสอบบทเรียนออฟไลน์…')}</p></details>
 <p class="small-text muted">${tr('Want to explore? Lessons and flashcards are below.','อยากเรียนเรื่องอื่น? เลือกบทเรียนหรือบัตรคำที่เมนูด้านล่าง')}</p>`;}
function easyView(){
 const e=state.easy;const pool=easyPool();
 if(!e||e.day!==day()||!Array.isArray(e.ids)||!e.ids.every(id=>pool.some(c=>c.id===id)))return `<h1>${tr('A little English?','มาฝึกอังกฤษกันไหม?')}</h1>${btn(tr('Start 5 easy words →','เริ่มฝึก 5 คำง่าย ๆ →'),'easy-start','class="wide large-button"')}`;
 if(e.index>=e.ids.length)return `<section class="easy-finish"><span class="finish-star" aria-hidden="true">✦</span><h1>${tr('You did it!','เก่งมาก! 🎉')}</h1><p>${tr('You practised five words today. That’s a lovely little step.','คุณฝึกครบ 5 คำแล้ว อีกก้าวเล็ก ๆ ที่ทำได้ในวันนี้')}</p><div class="panel gold"><strong>${tr('Your five words','5 คำที่ฝึกวันนี้')}</strong><p>${e.ids.map(id=>esc(pool.find(c=>c.id===id).english)).join(' · ')}</p></div><div class="stack"><a class="button large-button wide" href="#today">${tr('Done for now ✓','วันนี้พอแค่นี้ ✓')}</a>${btn(tr('Practise 5 more','ฝึกเพิ่มอีก 5 คำ'),'easy-more','class="secondary wide"')}</div></section>`;
 const c=pool.find(c=>c.id===e.ids[e.index]);const stage=['listen','say','try','answer'].includes(e.stage)?e.stage:'listen';const options=easyChoices(c);
 return `<div class="row"><a class="button back" href="#today">← ${tr('Save & exit','พักไว้ก่อน')}</a><span class="pill">${e.index+1} / ${e.ids.length}</span></div><progress max="${e.ids.length}" value="${e.index}" aria-label="${tr('Practice progress','ความคืบหน้า')}"></progress><div class="easy-steps" aria-label="${tr('Practice step','ขั้นตอนการฝึก')}">${['listen','say','try'].map((s,i)=>`<span class="${s===stage||(s==='try'&&stage==='answer')?'current':''}">${i+1}. ${[tr('Listen','ฟัง'),tr('Say it','พูดตาม'),tr('Try','ลองตอบ')][i]}</span>`).join('')}</div>
 <section class="easy-word"><p class="eyebrow">${stage==='listen'?tr('TAP AND LISTEN','กดฟังเสียงก่อน'):stage==='say'?tr('YOUR TURN · SAY IT ALOUD','ตาคุณแล้ว · ลองพูดตาม'):tr('A TINY CHECK','ลองตอบง่าย ๆ')}</p><h1>${esc(c.english)}</h1>${stage==='listen'||stage==='say'?`<p class="easy-meaning">${state.thai?esc(c.thai):tr('Say the word after the voice.','')}</p>`:''}${stage==='say'?`<p class="muted">${tr('Say it once. It’s okay if it isn’t perfect.','พูดตามหนึ่งครั้ง ไม่ต้องเป๊ะก็ได้')}<br><small>${tr('No recording. You decide when you’re ready.','ไม่มีการบันทึกเสียง พร้อมแล้วกดปุ่มด้านล่างได้เลย')}</small></p>`:''}</section>
 <div class="stack easy-controls">${stage==='listen'?`${btn('◖ '+tr('Listen','ฟังเสียง'),'easy-listen','class="wide large-button"')}${btn(tr('Continue without sound','ฝึกต่อแบบไม่มีเสียง'),'easy-silent','class="secondary wide"')}`:stage==='say'?`${btn(tr('I said it · Continue →','พูดแล้ว · ไปต่อ →'),'easy-said','class="wide large-button"')}${btn('◖ '+tr('Hear it again','ฟังอีกครั้ง'),`speak:${c.id}`,'class="secondary wide"')}`:`<p class="easy-question">${tr('What does it mean?','คำนี้แปลว่าอะไร?')}</p><div class="options">${options.map((o,i)=>btn(`${esc(o)} <span>${stage==='answer'&&o===c.thai?'✓':''}</span>`,`easy-answer:${i}`,`class="option large-button ${stage==='answer'&&o===c.thai?'correct':''}" ${stage==='answer'?'disabled':''}`)).join('')}</div>${e.selected!==null&&stage==='try'?`<p class="feedback" role="status">${tr('No worries. Here’s a hint:','ไม่เป็นไร ลองดูคำใบ้:')} <strong>${esc(c.thai)}</strong></p>`:''}${stage==='answer'?`<p class="feedback" role="status">${tr('That’s right. Nice work!','ถูกต้อง เก่งมาก!')} ✓</p>${btn(e.index===e.ids.length-1?tr('Finish my practice ✦','ฝึกเสร็จแล้ว ✦'):tr('Next word →','คำต่อไป →'),'easy-next','class="wide large-button"')}`:btn('◖ '+tr('Listen again','ฟังอีกครั้ง'),`speak:${c.id}`,'class="secondary wide"')}`}</div>`;
}
function easyAction(action,id){
 if(action==='easy-start'||action==='easy-more'){startEasy(action==='easy-more');return true;}
 if(!action.startsWith('easy-'))return false;
 const e=state.easy;const c=e&&easyPool().find(c=>c.id===e.ids[e.index]);if(!c)return true;
 if(action==='easy-listen'&&e.stage==='listen'){speak(c.english);e.stage='say';e.selected=null;}
 if(action==='easy-silent'&&e.stage==='listen'){e.stage='say';e.selected=null;}
 if(action==='easy-said'&&e.stage==='say'){if('speechSynthesis'in window)speechSynthesis.cancel();e.stage='try';e.selected=null;}
 if(action==='easy-answer'&&e.stage==='try'){const options=easyChoices(c);const chosen=Number(id);if(Number.isInteger(chosen)&&chosen>=0&&chosen<options.length){e.selected=chosen;if(options[chosen]===c.thai)e.stage='answer';}}
 if(action==='easy-next'&&e.stage==='answer'){record('card-'+c.id);state.easyCursor=(Number.isInteger(state.easyCursor)?state.easyCursor:0)+1;e.index++;e.stage='listen';e.selected=null;if('speechSynthesis'in window)speechSynthesis.cancel();}
 save();render();focusEasy();return true;
}
function focusEasy(){const heading=app.querySelector?.('.easy-word h1, .easy-finish h1');if(heading){heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true});}}
function localizeNavigation(){const labels=state.thai?['ฝึกวันนี้','บทเรียน','บัตรคำ','ความคืบหน้า']:['Today','Lessons','Cards','Progress'];document.querySelectorAll('nav a span').forEach((el,i)=>el.textContent=labels[i]);document.getElementById('settings').setAttribute('aria-label',tr('Settings','ตั้งค่า'));document.documentElement.lang=state.thai?'th':'en';}
