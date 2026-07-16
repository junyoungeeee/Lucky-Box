/* ===== 행운부적 · Lucky Box — MVP ===== */

// Clover interior path in main.png pixel coords (traced from image/main.png, 1086x1448).
const CLOVER_PATH = "M 432.0 399.0 L 460.0 401.0 L 476.0 406.0 L 497.0 419.0 L 518.0 441.0 L 525.0 444.0 L 534.0 442.0 L 551.0 425.0 L 564.0 416.0 L 594.0 406.0 L 625.0 406.0 L 640.0 410.0 L 659.0 419.0 L 669.0 426.0 L 685.0 444.0 L 694.0 465.0 L 697.0 481.0 L 695.0 516.0 L 686.0 544.0 L 673.0 570.0 L 675.0 579.0 L 686.0 590.0 L 693.0 592.0 L 712.0 588.0 L 733.0 587.0 L 764.0 594.0 L 787.0 607.0 L 801.0 624.0 L 808.0 640.0 L 812.0 662.0 L 811.0 681.0 L 807.0 698.0 L 791.0 726.0 L 774.0 741.0 L 760.0 747.0 L 749.0 760.0 L 750.0 768.0 L 760.0 781.0 L 766.0 796.0 L 770.0 830.0 L 764.0 863.0 L 757.0 879.0 L 748.0 892.0 L 733.0 906.0 L 717.0 915.0 L 698.0 920.0 L 674.0 920.0 L 654.0 915.0 L 635.0 906.0 L 624.0 899.0 L 609.0 884.0 L 599.0 882.0 L 587.0 892.0 L 575.0 927.0 L 554.0 957.0 L 552.0 969.0 L 555.0 979.0 L 539.0 970.0 L 519.0 967.0 L 485.0 967.0 L 460.0 957.0 L 450.0 947.0 L 442.0 928.0 L 442.0 900.0 L 439.0 894.0 L 429.0 885.0 L 419.0 885.0 L 401.0 897.0 L 371.0 910.0 L 357.0 913.0 L 332.0 913.0 L 311.0 907.0 L 298.0 900.0 L 285.0 889.0 L 277.0 878.0 L 268.0 859.0 L 264.0 844.0 L 263.0 820.0 L 273.0 784.0 L 293.0 756.0 L 293.0 748.0 L 284.0 737.0 L 272.0 733.0 L 256.0 723.0 L 242.0 706.0 L 235.0 690.0 L 231.0 670.0 L 231.0 650.0 L 235.0 632.0 L 243.0 612.0 L 256.0 592.0 L 272.0 577.0 L 285.0 570.0 L 312.0 563.0 L 341.0 563.0 L 357.0 566.0 L 371.0 555.0 L 372.0 544.0 L 357.0 525.0 L 348.0 499.0 L 347.0 477.0 L 353.0 452.0 L 363.0 434.0 L 379.0 418.0 L 400.0 406.0 L 431.0 400.0 Z";
const CLOVER_BBOX = { x: 231, y: 399, w: 581, h: 580 };
const MAIN_W = 1086, MAIN_H = 1448;

let userPhoto = null; // dataURL of chosen photo

const $ = (id) => document.getElementById(id);

// Hidden screens still live in the render tree, so their CSS animations run from
// page load and are long finished by the time you arrive. Replay them on entry.
function restartAnims(screen) {
  screen.querySelectorAll('.pic-regret, .pic-dog, .msg-pics img, .msg-line').forEach(el => {
    el.style.animation = 'none';
    void el.offsetWidth;      // force reflow so the restart takes
    el.style.animation = '';
  });
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  $(id).classList.add('active');
  restartAnims($(id));
  // clovers rain only on the screen you're actually looking at
  document.querySelectorAll('[data-rain]').forEach(layer => {
    if (layer.closest('.screen').id === id) startRain(layer);
    else stopRain(layer);
  });
  if (id === 'screen-msg1') typeLine($('msg1-line'));
}

// reveal the line one letter at a time
function typeLine(el) {
  if (!el.dataset.text) el.dataset.text = el.textContent.trim();
  el.textContent = '';
  [...el.dataset.text].forEach((ch, i) => {
    const s = document.createElement('span');
    s.className = 'ch';
    s.textContent = ch === ' ' ? ' ' : ch;   // inline-block collapses a plain space
    s.style.animationDelay = (i * 0.042) + 's';
    el.appendChild(s);
  });
}


/* ---------------- CLOVER RAIN ---------------- */
const CLOVERS = [1, 2, 3, 4, 5, 6, 7].map(n => `image/clover/clover-${n}.png`);
const rainTimers = new Map();

function spawnClover(layer) {
  const img = document.createElement('img');
  img.src = CLOVERS[(Math.random() * CLOVERS.length) | 0];
  const size = 24 + Math.random() * 42;
  const h = layer.clientHeight || 700;
  img.style.width = size + 'px';
  if (Math.random() < 0.35) {                 // a third blow in from the sides
    const fromLeft = Math.random() < 0.5;
    img.style.left = (fromLeft ? -size : layer.clientWidth) + 'px';
    img.style.top = (-30 - Math.random() * 90) + 'px';
    img.style.setProperty('--dx', (fromLeft ? 1 : -1) * (130 + Math.random() * 190) + 'px');
  } else {                                    // the rest drop from the top
    img.style.left = (Math.random() * 100) + '%';
    img.style.setProperty('--dx', (Math.random() * 130 - 65) + 'px');
  }
  img.style.setProperty('--fall', (h + 260) + 'px');
  img.style.setProperty('--spin', (Math.random() * 720 - 360) + 'deg');
  img.style.animation = `cloverFall ${4.5 + Math.random() * 4}s linear forwards`;
  img.addEventListener('animationend', () => img.remove());
  layer.appendChild(img);
}

function startRain(layer) {
  if (rainTimers.has(layer)) return;
  for (let i = 0; i < 5; i++) setTimeout(() => spawnClover(layer), i * 240);
  rainTimers.set(layer, setInterval(() => {
    if (layer.childElementCount < 26) spawnClover(layer);
  }, 520));
}

function stopRain(layer) {
  clearInterval(rainTimers.get(layer));
  rainTimers.delete(layer);
  layer.innerHTML = '';
}

/* ---------------- MESSAGE SCREENS (tap to continue) ---------------- */
// Each .msg-screen advances to data-next on tap. A short lock-out keeps the tap
// that arrived on the previous screen from skipping this one.
document.querySelectorAll('.msg-screen').forEach(sc => {
  let armedAt = 0;
  new MutationObserver(() => {
    if (sc.classList.contains('active')) armedAt = performance.now() + 700;
  }).observe(sc, { attributes: true, attributeFilter: ['class'] });

  sc.addEventListener('click', () => {
    if (performance.now() < armedAt) return;
    const next = sc.dataset.next;
    if (next === 'screen-charm') { buildCharm(); showScreen(next); playCelebrate(); }
    else showScreen(next);
  });
});

/* ---------------- SCREEN 1 : BOX ---------------- */
const pickBtn = $('pick-btn');
const fileInput = $('file-input');
const boxWrap = $('box-wrap2');
const boxClosed = $('box-img2');
const boxOpenImg = $('box-open-img');
const emergeLamp = $('emerge-lamp');
const emergeGlow = $('emerge-glow');
let boxOpened = false;

// place the lamp for a given emerge progress (0..1)
function placeLamp(lp) {
  lp = Math.max(0, Math.min(1, lp));
  const ty = 45 - lp * 235;
  const sc = 0.15 + lp * 0.95;
  emergeLamp.style.opacity = lp > 0.03 ? String(Math.min(1, lp * 2)) : '0';
  emergeLamp.style.transform = `translate(-50%, ${ty}px) scale(${sc})`;
  emergeGlow.style.opacity = String(lp * 0.85);
  emergeGlow.style.transform = `translate(-50%, ${ty + 10}px) scale(${0.3 + lp})`;
}

// slide progress (0..1) → box crossfades open + lamp only peeks (full rise on release)
function setOpen(p) {
  p = Math.max(0, Math.min(1, p));
  const op = Math.max(0, (p - 0.2) / 0.8);          // closed box fades into the open box
  boxClosed.style.opacity = String(1 - op);
  boxOpenImg.style.opacity = String(op);
  placeLamp(p * 0.35);
}

pickBtn.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    userPhoto = reader.result;
    boxOpened = false;
    [emergeLamp, emergeGlow, boxClosed, boxOpenImg].forEach(el => el.style.transition = '');
    setOpen(0);
    showScreen('screen-msg1');   // greeting first, then the received box
  };
  reader.readAsDataURL(file);
});

// Slide the box to the RIGHT → the top opens and the lamp pops out
(function boxSlide() {
  let startX = 0, dragging = false, prog = 0, maxDx = 0;
  const els = [emergeLamp, emergeGlow, boxClosed, boxOpenImg];
  const onDown = (e) => {
    if (boxOpened) return;
    dragging = true;
    startX = (e.touches ? e.touches[0].clientX : e.clientX);
    maxDx = boxWrap.clientWidth * 0.6;
    els.forEach(el => el.style.transition = 'none');
    buzz(8);
    e.preventDefault();
  };
  const onMove = (e) => {
    if (!dragging || boxOpened) return;
    const x = (e.touches ? e.touches[0].clientX : e.clientX);
    prog = Math.min(1, Math.max(0, x - startX) / maxDx);
    setOpen(prog);
    if (prog >= 1) { dragging = false; finishOpen(); }
  };
  const onUp = () => {
    if (!dragging || boxOpened) return;
    dragging = false;
    els.forEach(el => el.style.transition = 'transform .3s ease, opacity .3s ease');
    prog = 0; setOpen(0);   // spring back if not fully opened
  };
  boxWrap.addEventListener('mousedown', onDown);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);
  boxWrap.addEventListener('touchstart', onDown, { passive: false });
  window.addEventListener('touchmove', onMove, { passive: false });
  window.addEventListener('touchend', onUp);
})();

function finishOpen() {
  if (boxOpened) return;
  boxOpened = true;
  boxWrap.classList.add('opened');      // stop the idle sway
  const snd = $('box-sound');           // cardboard box opening sound (~2s)
  if (snd) { try { snd.currentTime = 0; snd.play(); } catch (e) {} }
  buzz([30, 30, 70]);
  // finish opening the box, then let the lamp rise out slowly to match the sound
  boxClosed.style.transition = 'opacity .3s';
  boxOpenImg.style.transition = 'opacity .3s';
  boxClosed.style.opacity = '0';
  boxOpenImg.style.opacity = '1';
  emergeLamp.style.transition = 'transform 1.6s cubic-bezier(.2,.85,.3,1), opacity .5s';
  emergeGlow.style.transition = 'transform 1.6s ease, opacity .5s';
  placeLamp(1);
  setTimeout(() => { showScreen('screen-lamp'); }, 2000);
}

/* ---------------- SCREEN 2 : LAMP ---------------- */
const lampWrap = $('lamp-wrap');
const lampImg = $('lamp-img');
const lampGlow = $('lamp-glow');
const progressEl = $('rub-progress');
const rubBar = progressEl.firstElementChild;
const flash = $('flash');
const RUB_TARGET = 1400; // px of accumulated movement to trigger
let rubTotal = 0, lastX = null, lastY = null, rubbing = false, lampDone = false, lastVib = 0;

function buzz(pattern) { if (navigator.vibrate) { try { navigator.vibrate(pattern); } catch (e) {} } }

function rubStart(e) {
  if (lampDone) return;
  rubbing = true; lastX = null; lastY = null;
  progressEl.classList.add('show');   // progress bar appears under the lamp
  lampImg.classList.add('rubbing');
  buzz(15);
  e.preventDefault();
}
function rubMove(e) {
  if (!rubbing || lampDone) return;
  const p = e.touches ? e.touches[0] : e;
  if (lastX !== null) {
    rubTotal += Math.hypot(p.clientX - lastX, p.clientY - lastY);
    rubBar.style.width = Math.min(100, (rubTotal / RUB_TARGET) * 100) + '%';
    if (rubTotal - lastVib > 55) { buzz(10); lastVib = rubTotal; } // haptic buzz while rubbing
    if (rubTotal >= RUB_TARGET) triggerLamp();
  }
  lastX = p.clientX; lastY = p.clientY;
}
function rubEnd() { rubbing = false; lampImg.classList.remove('rubbing'); }

lampWrap.addEventListener('mousedown', rubStart);
window.addEventListener('mousemove', rubMove);
window.addEventListener('mouseup', rubEnd);
lampWrap.addEventListener('touchstart', rubStart, { passive: false });
window.addEventListener('touchmove', rubMove, { passive: false });
window.addEventListener('touchend', rubEnd);

function triggerLamp() {
  if (lampDone) return;
  lampDone = true;
  rubbing = false;
  lampImg.classList.remove('rubbing');
  buzz([60, 40, 140]);              // strong celebratory buzz
  lampGlow.classList.add('show');   // yellow light bursts and covers the lamp
  lampImg.classList.add('dim');     // lamp dissolves into the light
  setTimeout(() => flash.classList.add('go'), 350); // screen fills yellow
  setTimeout(() => { showScreen('screen-msg2'); flash.classList.remove('go'); }, 1150);
}

/* ---------------- SCREEN 3 : CHARM ---------------- */
const charmWrap = $('charm-wrap');

function buildCharm() {
  // set clover clip path + place user's photo to cover the clover bbox
  $('clover-path').setAttribute('d', CLOVER_PATH);
  const img = $('charm-photo-img');
  const src = userPhoto || 'image/box.png';
  img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', src);
  img.setAttribute('href', src);
  img.setAttribute('x', CLOVER_BBOX.x);
  img.setAttribute('y', CLOVER_BBOX.y);
  img.setAttribute('width', CLOVER_BBOX.w);
  img.setAttribute('height', CLOVER_BBOX.h);
  // pop-in animation
  charmWrap.classList.remove('pop'); void charmWrap.offsetWidth; charmWrap.classList.add('pop');
}

const THUMB = 'image/엄지척.png';
let celebrateTimer = null;

// one thumbs-up or clap, rising from the bottom
function spawnCel(layer) {
  let el;
  if (Math.random() < 0.5) {
    el = document.createElement('img');
    el.src = THUMB;
    el.className = 'cel cel-img';
    el.style.width = (32 + Math.random() * 34) + 'px';
  } else {
    el = document.createElement('span');
    el.className = 'cel';
    el.textContent = Math.random() < 0.82 ? '👏' : '✨';
    el.style.fontSize = (26 + Math.random() * 18) + 'px';
  }
  el.style.left = (3 + Math.random() * 90) + '%';
  el.style.setProperty('--rise', -(380 + Math.random() * 320) + 'px');
  el.style.setProperty('--drift', (Math.random() * 90 - 45) + 'px');
  el.style.setProperty('--rot', (Math.random() * 120 - 60) + 'deg');
  el.style.animation = `rise ${1.9 + Math.random() * 1.1}s ease-out forwards`;
  el.addEventListener('animationend', () => el.remove());
  layer.appendChild(el);
}

function playCelebrate() {
  const layer = $('celebrate');
  layer.innerHTML = '';
  clearInterval(celebrateTimer);
  // opening burst, then keep them coming
  for (let i = 0; i < 12; i++) setTimeout(() => spawnCel(layer), i * 110);
  celebrateTimer = setInterval(() => {
    if (layer.childElementCount < 30) spawnCel(layer);
  }, 340);
  // confetti also rising
  const colors = ['#6BAF4B', '#F3B33F', '#E0402F', '#4C9CDD', '#9B5FBE'];
  for (let i = 0; i < 28; i++) {
    const c = document.createElement('span');
    c.className = 'confetti-pc';
    c.style.left = Math.random() * 100 + '%';
    c.style.background = colors[i % colors.length];
    c.style.setProperty('--rise', -(300 + Math.random() * 300) + 'px');
    c.style.animation = `riseConfetti ${1.5 + Math.random() * .9}s ease-out forwards`;
    c.style.animationDelay = (Math.random() * .5) + 's';
    c.addEventListener('animationend', () => c.remove());
    layer.appendChild(c);
  }
}

/* ---- Save (composite charm to PNG) ---- */
$('save-btn').addEventListener('click', async () => {
  try {
    const canvas = $('export-canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, MAIN_W, MAIN_H);
    const main = await loadImg('image/main.png');
    ctx.drawImage(main, 0, 0, MAIN_W, MAIN_H);
    if (userPhoto) {
      const photo = await loadImg(userPhoto);
      ctx.save();
      const p = new Path2D(CLOVER_PATH);
      ctx.clip(p);
      // cover fit into clover bbox
      const b = CLOVER_BBOX;
      const scale = Math.max(b.w / photo.width, b.h / photo.height);
      const dw = photo.width * scale, dh = photo.height * scale;
      ctx.drawImage(photo, b.x + (b.w - dw) / 2, b.y + (b.h - dh) / 2, dw, dh);
      ctx.restore();
    }
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = '행운부적.png';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, 'image/png');
  } catch (err) {
    alert('저장 중 문제가 생겼어요: ' + err.message);
  }
});

/* ---- Share ---- */
$('share-btn').addEventListener('click', async () => {
  if (navigator.share) {
    try { await navigator.share({ title: '행운부적', text: '너를 위한 행운부적 🍀', url: location.href }); }
    catch (e) { /* cancelled */ }
  } else {
    try { await navigator.clipboard.writeText(location.href); alert('링크가 복사되었어요!'); }
    catch (e) { alert('공유 링크: ' + location.href); }
  }
});

function loadImg(src) {
  return new Promise((res, rej) => {
    const im = new Image();
    im.crossOrigin = 'anonymous';
    im.onload = () => res(im);
    im.onerror = rej;
    im.src = src;
  });
}
