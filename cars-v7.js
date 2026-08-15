// v7.2: every selectable car uses its own Image 2.0 artwork.
const CAR_FILES=[
 'mclaren-p1.svg',
 'mclaren-speedtail.svg',
 'bugatti-bolide.webp',
 'laferrari.webp',
 'koenigsegg-agera-r.webp',
 'koenigsegg-regera.webp',
 'pagani-huayra-roadster.webp',
 'nissan-gtr.webp',
 'honda-nsx-r.webp',
 'honda-nsx.webp',
 'honda-nsx-type-s.webp'
];
C.forEach((c,i)=>{c.asset=`assets/cars/${CAR_FILES[i]}`;c.f='none'});
function carSprite(c=car(),cl=''){return `<img class="carSprite ${cl}" src="${c.asset}" alt="${esc(c.name)}" loading="${cl==='heroCar'?'eager':'lazy'}">`}
function homeV7(){let n=s.unlockedParts.length,t=target(),pct=Math.min(100,s.daily.points/t*100);return page(`<div class="top"><div><div class="eyebrow">RACE TO STUDY</div><h1 class="title">ガレージ</h1></div>${pts()}</div><div class="topActions"><button class="chip" data-go="sounds">🔊 ${esc(sound().name)}</button><button class="chip" data-go="parent">⚙️ 保護者設定</button>${s.raceTickets?`<span class="ticket">🎫 BONUS RACE ×${s.raceTickets}</span>`:''}</div><div class="hero">${carSprite(car(),'heroCar')}<div class="name">${esc(car().name)}</div><div class="line"></div></div><div class="card target"><div class="targetTop"><div><div class="eyebrow">TODAY'S TARGET</div><b style="font-size:23px">${s.daily.points} / ${t}pt</b></div><span class="mode">${modeLabel()}</span></div><div class="bar"><i style="--w:${pct}%"></i></div><div class="row" style="margin-top:9px"><span class="muted">達成で 🎫 レース券 +${s.daily.rewardTickets}</span>${s.daily.rewardClaimed?'<b style="color:#61f59b">✓ 達成済み</b>':''}</div></div><div class="card soundcard" data-go="sounds"><div class="row"><div><div class="muted">ENGINE SOUND</div><strong>${sound().icon} ${esc(sound().name)}</strong></div><span>▶ 試聴・変更</span></div></div><div class="card progressbox"><div class="row"><b>⚙️ パーツ収集率</b><b>${n}/20</b></div><div class="bar"><i style="--w:${n*5}%"></i></div></div><button class="primary big pulse" data-go="engine" style="margin-top:14px">🔑 エンジン スタート！</button>${nav()}`)}
function carsV7(){return page(`<div class="head">${back()}<h2>🚗 クルマを選ぶ</h2></div><div class="list">${C.map(x=>`<div class="card caritem ${s.selectedCarId===x.id?'sel':''}" data-car="${x.id}">${carSprite(x,'carThumb')}<div><strong>${esc(x.name)}</strong>${s.selectedCarId===x.id?'<div style="color:#67d6ff">✓ 選択中</div>':'<div class="muted">タップして乗り換え</div>'}</div></div>`).join('')}</div>`)}
views.home=homeV7;views.cars=carsV7;
