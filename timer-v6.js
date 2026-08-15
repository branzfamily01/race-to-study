// Race to Study v6: TRACK FOCUS, PIT STOP, steerable pseudo-3D race
if(!s.focusMode)s.focusMode='track';
if(!s.lastStudyMinutes)s.lastStudyMinutes=20;
u.timerMode=u.timerMode||'study';u.breakMin=u.breakMin||5;u.breakLeft=u.breakLeft||0;u.breakRun=false;u.breakExtended=false;u.focusMarks={};u.returnCount=null;
let breakTimer=null,returnTimer=null,raceRAF=null,raceCountdownTimer=null,raceImg=null;
let race3d={active:false,playerDist:0,cpuDist:0,speed:0,lane:0,steer:0,last:0,finish:2500,offroad:false,result:null,lastCue:0};
save();

function pleasantCue(level=1){
 if(!volumeGain())return;
 try{
  let a=audio(),t=a.currentTime,g=a.createGain(),f=a.createBiquadFilter();
  f.type='lowpass';f.frequency.value=1800;f.Q.value=.8;f.connect(g);g.connect(a.destination);
  let o1=a.createOscillator(),o2=a.createOscillator();o1.type='triangle';o2.type='sine';o1.connect(f);o2.connect(f);
  let base=190+level*35;o1.frequency.setValueAtTime(base,t);o1.frequency.exponentialRampToValueAtTime(base*1.7,t+.45);
  o2.frequency.setValueAtTime(base*1.5,t);o2.frequency.exponentialRampToValueAtTime(base*2.2,t+.45);
  let v=.035*volumeGain()/.11;g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(v,t+.05);g.gain.exponentialRampToValueAtTime(.0001,t+.55);
  o1.start(t);o2.start(t);o1.stop(t+.56);o2.stop(t+.56);
 }catch{}
}
function pitChime(){if(!volumeGain())return;[523,659,784].forEach((f,i)=>setTimeout(()=>burst(f,.2,'sine',.035),i*110))}
function studyCue(mark){if(s.focusMode==='quiet')return;if(mark===25){pleasantCue(1)}if(mark===50){pleasantCue(2);setTimeout(shiftSound,220)}if(mark===75){pleasantCue(3);setTimeout(()=>pleasantCue(2),300)}if(mark===99){pitChime()}}

function timerV6(){
 let isBreak=u.timerMode==='break';
 if(isBreak){
  let total=u.breakMin*60,p=(u.breakRun||u.breakLeft>0)?(total-u.breakLeft)/total:0,m=Math.floor(u.breakLeft/60),sec=u.breakLeft%60;
  return page(`<div class="timerhead">${back('home')}<div class="muted">🛠 PIT STOP</div></div>
  <div class="modeTabs"><button class="${!isBreak?'on':''}" data-timer-mode="study">🏁 集中</button><button class="${isBreak?'on':''}" data-timer-mode="break">🛠 休憩</button></div>
  <div class="card pitIntro"><b>休憩もタイマーで区切る</b><span class="muted">終わったら3・2・1で勉強へ戻る</span></div>
  <div class="gauge breakGauge" style="--p:${p}"><div class="face"><div><div class="time">${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}</div><div class="remaining">PIT STOP</div></div></div></div>
  ${!u.breakRun&&u.breakLeft===0?`<div class="times breakTimes">${[3,5,10,15].map(x=>`<button data-break-time="${x}" class="${u.breakMin===x?'on':''}">${x}分<small>休憩</small></button>`).join('')}</div>`:''}
  <div class="controls">${!u.breakRun&&u.breakLeft===0?'<button class="primary big" data-act="breakStart">🛠 休憩スタート</button>':''}${u.breakRun?'<button class="secondary" data-act="breakPause">⏸ 一時停止</button>':''}${!u.breakRun&&u.breakLeft>0?'<button class="primary" data-act="breakResume">▶ 再開</button><button class="secondary" data-act="breakReset">リセット</button>':''}</div>
  <button class="secondary big" data-timer-mode="study" style="width:100%;margin-top:12px">🏁 集中タイマーへ戻る</button>`);
 }
 let total=u.min*60,p=(u.run||u.left>0)?(total-u.left)/total:0,m=Math.floor(u.left/60),sec=u.left%60;
 return page(`<div class="timerhead">${back('home')}<div class="muted">📚 ${esc(s.materials.find(x=>x.id===u.sel)?.name||'フリー学習')}</div></div>
 <div class="modeTabs"><button class="on" data-timer-mode="study">🏁 集中</button><button data-timer-mode="break">🛠 休憩</button></div>
 ${u.msg?`<div class="card ray">🏎️ 「${esc(u.msg)}」</div>`:''}
 <div class="card focusCard"><div><b>TRACK FOCUS</b><div class="muted">鳴りっぱなしなし。節目だけ短い走行サウンド。</div></div><div class="focusBtns"><button class="chip ${s.focusMode==='track'?'on':''}" data-focus="track">🏁 TRACK</button><button class="chip ${s.focusMode==='quiet'?'on':''}" data-focus="quiet">🔇 QUIET</button></div></div>
 <div class="gauge" style="--p:${p}"><div class="face"><div><div class="time">${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}</div><div class="remaining">REMAINING</div></div></div></div>
 ${!u.run&&u.left===0?`<div class="times">${OPT.map(x=>`<button data-time="${x}" class="${u.min===x?'on':''}">${x}分<small>+${PT[x]}pt</small></button>`).join('')}</div>`:''}
 <div class="controls">${!u.run&&u.left===0?'<button class="primary big" data-act="start">▶ スタート！</button>':''}${u.run?'<button class="secondary" data-act="pause">⏸ 一時停止</button>':''}${!u.run&&u.left>0?'<button class="primary" data-act="resume">▶ 再開</button><button class="secondary" data-act="reset">リセット</button>':''}</div>
 ${u.sel&&!s.materials.find(x=>x.id===u.sel)?.done&&u.left>0?'<button class="success big" data-act="completeSel" style="width:100%;margin-top:12px">🎉 教材おわった！ +25pt</button>':''}
 ${!u.run&&u.left===0?'<button class="secondary big" data-timer-mode="break" style="width:100%;margin-top:12px">🛠 先に休憩タイマーを使う</button>':''}`)
}

function startStudyV6(){u.timerMode='study';s.lastStudyMinutes=u.min;u.left=u.min*60;u.run=true;u.msg='スタート！最初のコーナーへ。';u.focusMarks={};ignitionSound();setTimeout(()=>pleasantCue(1),900);tickStudyV6();save();render()}
function tickStudyV6(){clearInterval(ti);ti=setInterval(()=>{u.left--;let total=u.min*60,elapsed=total-u.left;[[25,.25],[50,.5],[75,.75]].forEach(([mark,ratio])=>{if(!u.focusMarks[mark]&&elapsed>=Math.floor(total*ratio)){u.focusMarks[mark]=true;u.msg=mark===50?'HALFWAY！いいペース！':mark===75?'FINAL SECTOR！あと少し！':'1st SECTOR CLEAR！';studyCue(mark)}});if(u.left===60&&!u.focusMarks[99]){u.focusMarks[99]=true;u.msg='LAST 1 MINUTE！';studyCue(99)}if(u.left<=0){clearInterval(ti);u.run=false;completeTimer()}render()},1000)}
function pauseStudyV6(){u.run=false;clearInterval(ti);shiftSound();render()}
function resumeStudyV6(){u.run=true;u.msg='再スタート！コースへ戻ろう。';pleasantCue(1);tickStudyV6();render()}
function resetStudyV6(){u.run=false;u.left=0;clearInterval(ti);u.focusMarks={};render()}

function startBreak(){u.timerMode='break';u.breakLeft=u.breakMin*60;u.breakRun=true;u.breakExtended=false;pitChime();tickBreak();render()}
function tickBreak(){clearInterval(breakTimer);breakTimer=setInterval(()=>{u.breakLeft--;if(u.breakLeft===60)pleasantCue(1);if(u.breakLeft<=10&&u.breakLeft>0)countdownBeep(u.breakLeft<=3);if(u.breakLeft<=0){clearInterval(breakTimer);u.breakRun=false;pitChime();u.overlay={type:'breakDone'};render();return}render()},1000)}
function pauseBreak(){u.breakRun=false;clearInterval(breakTimer);render()}
function resumeBreak(){u.breakRun=true;pleasantCue(1);tickBreak();render()}
function resetBreak(){u.breakRun=false;u.breakLeft=0;clearInterval(breakTimer);render()}
function quickBreak(){u.overlay=null;u.screen='timer';u.timerMode='break';u.breakMin=5;u.breakLeft=5*60;u.breakRun=true;u.breakExtended=false;pitChime();tickBreak();render()}
function extendBreak(){if(u.breakExtended)return;u.overlay=null;u.timerMode='break';u.breakLeft=120;u.breakRun=true;u.breakExtended=true;pleasantCue(1);tickBreak();render()}
function returnStudy(){u.overlay={type:'returnStudy',count:3};render();let c=3;countdownBeep();clearInterval(returnTimer);returnTimer=setInterval(()=>{c--;if(c>0){u.overlay={type:'returnStudy',count:c};countdownBeep();render()}else{clearInterval(returnTimer);countdownBeep(true);u.overlay=null;u.timerMode='study';u.min=s.lastStudyMinutes||20;startStudyV6()}},800)}

const oldOverlayV6=overlay;
overlay=function(){
 if(u.overlay?.type==='done')return `<div class="overlay"><div class="card popup"><div class="big">🏆</div><h2>ラップ完了！</h2><p>+${u.overlay.pt}pt 獲得！</p>${u.overlay.ticket?`<p class="ticket">🎫 目標達成！レース券 +${u.overlay.ticket}</p>`:''}${u.overlay.newSound?`<p style="color:#d9d0ff">🔊 NEW SOUND: ${esc(u.overlay.newSound.name)}</p>`:''}<button class="primary big" data-act="quickBreak">🛠 5分 PIT STOP</button><button class="secondary big" data-act="close" style="margin-top:8px">ガレージへ</button></div></div>`;
 if(u.overlay?.type==='breakDone')return `<div class="overlay"><div class="card popup pitDone"><div class="big">🟢</div><div class="eyebrow">PIT STOP COMPLETE</div><h2>休憩終了！</h2><p>ここからの切り替えはアプリに任せよう。</p><button class="primary big" data-act="returnStudy">🏁 3・2・1で勉強に戻る</button>${u.breakExtended?'':`<button class="secondary" data-act="extendBreak" style="margin-top:9px">＋2分だけ延長</button>`}</div></div>`;
 if(u.overlay?.type==='returnStudy')return `<div class="overlay returnOverlay"><div class="returnCount">${u.overlay.count}</div><div class="eyebrow">ENGINE ON → STUDY</div></div>`;
 return oldOverlayV6();
};
