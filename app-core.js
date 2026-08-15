const C=[['マクラーレン P1','#ff7600','#ffc04b','none'],['マクラーレン スピードテール','#d9dfe5','#fff','grayscale(1) brightness(1.25)'],['ブガッティ ボリード','#087cff','#5ddcff','hue-rotate(165deg) saturate(1.5)'],['ラ フェラーリ','#d52323','#ff6049','hue-rotate(320deg) saturate(1.5)'],['ケーニグセグ アゲーラR','#555','#aaa','grayscale(1) brightness(.6)'],['ケーニグセグ レゲーラ','#7b2fbe','#c77dff','hue-rotate(235deg) saturate(1.5)'],['パガーニ ウアイラ ロードスター','#b8860b','#ffd65a','sepia(.8) saturate(.8)'],['日産 GT-R','#e4e9ee','#fff','grayscale(1) brightness(1.15)'],['ホンダ NSX-R','#fff','#eef6ff','grayscale(1) brightness(1.55)'],['ホンダ NSX','#ff4a19','#ff8263','hue-rotate(345deg) saturate(1.2)'],['ホンダ NSX タイプS','#333','#888','grayscale(1) brightness(.72)']].map((x,i)=>({id:i+1,name:x[0],a:x[1],a2:x[2],f:x[3]}));
const P=['エンジン','タイヤ(F)','タイヤ(R)','ウイング','ボディ','塗装 赤','塗装 青','塗装 金','ヘッドライト','ホイール A','ホイール B','エアロ','マフラー','インタークーラー','ブレーキ','サスペンション','シート','ステアリング','ECU','ニトロ'].map((n,i)=>({id:i+1,name:n,ico:['⚙️','🛞','🛞','✈️','🏎️','🔴','🔵','🟡','💡','⭕','🔘','💨','🔥','❄️','🛑','🔩','💺','🎯','💻','⚡'][i],cost:30}));
const OPT=[5,10,15,20,25,30,45,60],PT={5:5,10:12,15:20,20:30,25:40,30:50,45:70,60:100};
const SOUNDS=[
 {id:'v8',name:'V8 MUSCLE',icon:'🔥',need:0,desc:'低く太いドロドロ音',base:58,wave:'sawtooth',harm:1.46},
 {id:'turbo',name:'TURBO',icon:'💨',need:100,desc:'ターボの吸気＋ブローオフ',base:72,wave:'square',harm:1.62},
 {id:'ev',name:'EV MOTOR',icon:'⚡',need:180,desc:'高回転モーターのキーン音',base:150,wave:'sine',harm:2.05},
 {id:'v10',name:'V10',icon:'🏁',need:300,desc:'高く鋭いレーシング音',base:95,wave:'sawtooth',harm:1.83},
 {id:'v12',name:'V12',icon:'👑',need:500,desc:'滑らかな超高回転サウンド',base:110,wave:'triangle',harm:2.18}
];
const MODE={easy:{label:'EASY',target:50},normal:{label:'NORMAL',target:100},hard:{label:'HARD',target:150},custom:{label:'CUSTOM',target:100}};
const K='raceToStudy_v5';
function dayKey(d=new Date()){let z=new Date(d.getTime()-d.getTimezoneOffset()*60000);return z.toISOString().slice(0,10)}
const fresh=()=>({points:0,totalPoints:0,streak:0,lastStudyDate:null,unlockedParts:[],selectedCarId:1,materials:[],sessions:[],nextMaterialId:1,raceTickets:0,selectedSound:'v8',soundVolume:'medium',seenSoundUnlocks:['v8'],daily:{date:dayKey(),mode:'normal',customTarget:100,rewardTickets:1,points:0,rewardClaimed:false}});
let s;try{s={...fresh(),...JSON.parse(localStorage.getItem(K)||localStorage.getItem('raceToStudy_v4')||'{}')}}catch{s=fresh()}
if(!s.daily||s.daily.date!==dayKey())s.daily={date:dayKey(),mode:'normal',customTarget:100,rewardTickets:1,points:0,rewardClaimed:false};
if(!Array.isArray(s.seenSoundUnlocks))s.seenSoundUnlocks=['v8'];
if(!s.selectedSound)s.selectedSound='v8';if(!s.soundVolume)s.soundVolume='medium';if(!Number.isFinite(s.raceTickets))s.raceTickets=0;
let u={screen:'home',sel:null,min:20,left:0,run:false,msg:'',parent:false,key:false,race:false,p:0,cpu:0,count:null,result:null,toast:'',overlay:null,pendingTargetMode:null};
let ti,ri,ci;const $=q=>document.querySelector(q),save=()=>localStorage.setItem(K,JSON.stringify(s)),car=()=>C.find(x=>x.id===s.selectedCarId)||C[0],sound=()=>SOUNDS.find(x=>x.id===s.selectedSound)||SOUNDS[0],esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),img=(cl='',filter=car().f)=>`<img class="car ${cl}" src="assets/supercar.webp" alt="${esc(car().name)}" style="--filter:${filter}">`,vars=()=>`--a:${car().a};--a2:${car().a2};--filter:${car().f}`;
function target(){return s.daily.mode==='custom'?Math.max(10,+s.daily.customTarget||100):MODE[s.daily.mode]?.target||100}
function modeLabel(){return MODE[s.daily.mode]?.label||'NORMAL'}
function volumeGain(){return {off:0,small:.05,medium:.11,large:.19}[s.soundVolume]??.11}
function unlockedSound(x){return s.totalPoints>=x.need}
function permanentRace(){return s.unlockedParts.length>=20}
function canRace(){return permanentRace()||s.raceTickets>0}
function page(x){return `<section class="page" style="${vars()}"><div class="wrap">${x}</div></section>${u.toast?`<div class="toast">${esc(u.toast)}</div>`:''}${u.overlay?overlay():''}`}
function pts(){return `<div class="pts"><b>${s.points}<span style="font-size:14px">pt</span></b><small>🔥 ${s.streak}日連続</small></div>`}
function back(to='home'){return `<button class="back" data-go="${to}">← 戻る</button>`}
function nav(){return `<div class="nav">${[['🚗','クルマ','cars'],['🔧','パーツ','parts'],['📚','教材','materials'],['🏁','レース','race'],['📋','引き継ぎ','transfer']].map((x,i)=>`<button data-go="${x[2]}" ${i===3&&!canRace()?'disabled':''}><span>${x[0]}</span>${x[1]}${i===3&&s.raceTickets?`<small style="display:block;color:#ffd26e">券${s.raceTickets}</small>`:''}</button>`).join('')}</div>`}