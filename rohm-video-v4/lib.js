/* Shared helpers for the ROHM v4 scenes: palette, photo moves, kinetic type, chips, counters,
   custom transitions (8-point Omani star iris, gold flash, whip, light leak) and burned-in captions. */
export const C = { bg: '#0D0A07', gold: '#C9A35C', lg: '#E8CF95', ivory: '#F3E9D8', crim: '#7E1822', rose: '#D8B49A', ink: '#1A130C' };
const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const pr = (t, a, b) => cl((t - a) / (b - a));
const lerp = (a, b, k) => a + (b - a) * k;
const eo = k => 1 - Math.pow(1 - k, 3);
const sio = k => -(Math.cos(Math.PI * k) - 1) / 2;
export const rgba = (h, a) => { const c = h.replace('#', ''); return `rgba(${parseInt(c.slice(0, 2), 16)},${parseInt(c.slice(2, 4), 16)},${parseInt(c.slice(4, 6), 16)},${a})`; };
export const W = (ctx, line, i) => ctx.wordTime(line, i).s;      // start of word i of a line (absolute seconds)
export const WE = (ctx, line, i) => ctx.wordTime(line, i).e;

/* ── photos ─────────────────────────────────────────────── */
// draw img cover-fit into rect, focus (fx,fy) at rect centre, zoom z, never showing an empty edge
export function cover(X, img, o = {}) {
  const [rx, ry, rw, rh] = o.rect || [0, 0, 1080, 1920];
  const z = o.z || 1, s = Math.max(rw / img.width, rh / img.height) * z, w = img.width * s, h = img.height * s;
  let x = rx + rw / 2 - (o.fx ?? 0.5) * w + (o.dx || 0), y = ry + rh / 2 - (o.fy ?? 0.5) * h + (o.dy || 0);
  x = cl(x, rx + rw - w, rx); y = cl(y, ry + rh - h, ry);
  X.save();
  if (o.rect) { X.beginPath(); X.rect(rx, ry, rw, rh); X.clip(); }
  if (o.alpha != null) X.globalAlpha *= o.alpha;
  if (o.filter) X.filter = o.filter;
  if (o.rot) { X.translate(rx + rw / 2, ry + rh / 2); X.rotate(o.rot); X.translate(-rx - rw / 2, -ry - rh / 2); }
  X.drawImage(img, x, y, w, h);
  X.restore();
}
// Ken Burns from a → b ({fx,fy,z}) over [s, s+dur] (sine in-out)
export function kb(X, img, t, s, dur, a, b, o = {}) {
  const k = o.linear ? pr(t, s, s + dur) : sio(pr(t, s, s + dur));
  cover(X, img, { ...o, fx: lerp(a.fx ?? .5, b.fx ?? .5, k), fy: lerp(a.fy ?? .5, b.fy ?? .5, k), z: lerp(a.z || 1, b.z || 1, k) });
  return k;
}
// 2.5D parallax: background moves with the camera, a soft-masked foreground band moves ~2x more
let TMP = null;
export function depth(X, img, t, s, dur, a, b, o = {}) {
  const k = sio(pr(t, s, s + dur)), fx = lerp(a.fx ?? .5, b.fx ?? .5, k), fy = lerp(a.fy ?? .5, b.fy ?? .5, k), z = lerp(a.z || 1, b.z || 1, k);
  cover(X, img, { ...o, fx, fy, z });
  if (!TMP) { TMP = document.createElement('canvas'); TMP.width = 1080; TMP.height = 1920; }
  const T = TMP.getContext('2d'); T.setTransform(1, 0, 0, 1, 0, 0); T.globalCompositeOperation = 'source-over'; T.clearRect(0, 0, 1080, 1920);
  const amt = o.depth ?? 1, zf = z * (1 + 0.05 * amt * k), dy = 30 * amt * k;
  cover(T, img, { fx, fy, z: zf, dy: (o.fgDir || 1) * dy });
  const split = o.split ?? 0.62, g = T.createLinearGradient(0, 1920 * (split - 0.16), 0, 1920 * (split + 0.06));
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,1)');
  T.globalCompositeOperation = 'destination-in'; T.fillStyle = g; T.fillRect(0, 0, 1080, 1920);
  X.drawImage(TMP, 0, 0, 1080, 1920);
  return k;
}
// legibility shading: dark gradient at top / bottom, optional warm tint
export function shade(X, o = {}) {
  X.save();
  if (o.all) { X.fillStyle = `rgba(13,10,7,${o.all})`; X.fillRect(0, 0, 1080, 1920); }
  if (o.top) { const g = X.createLinearGradient(0, 0, 0, o.topH || 900); g.addColorStop(0, `rgba(13,10,7,${o.top})`); g.addColorStop(1, 'rgba(13,10,7,0)'); X.fillStyle = g; X.fillRect(0, 0, 1080, o.topH || 900); }
  if (o.bottom) { const h = o.botH || 900, g = X.createLinearGradient(0, 1920 - h, 0, 1920); g.addColorStop(0, 'rgba(13,10,7,0)'); g.addColorStop(1, `rgba(13,10,7,${o.bottom})`); X.fillStyle = g; X.fillRect(0, 1920 - h, 1080, h); }
  if (o.warm) { X.globalCompositeOperation = 'soft-light'; X.fillStyle = rgba(C.gold, o.warm); X.fillRect(0, 0, 1080, 1920); }
  X.restore();
}
// diagonal light band sweeping across a rect (gold shimmer)
export function sweep(X, k, rect = [0, 0, 1080, 1920], o = {}) {
  if (k <= 0 || k >= 1) return;
  const [x, y, w, h] = rect, bw = o.width || 260, cx = lerp(x - bw * 2, x + w + bw * 2, k);
  X.save(); X.beginPath(); X.rect(x, y, w, h); X.clip(); X.globalCompositeOperation = o.op || 'screen';
  X.translate(cx, y + h / 2); X.rotate(o.angle ?? 0.35);
  const g = X.createLinearGradient(-bw, 0, bw, 0); g.addColorStop(0, rgba(C.lg, 0)); g.addColorStop(0.5, rgba(C.lg, o.alpha ?? 0.55)); g.addColorStop(1, rgba(C.lg, 0));
  X.fillStyle = g; X.fillRect(-bw, -h * 2, bw * 2, h * 4); X.restore();
}

/* ── type ───────────────────────────────────────────────── */
const LC = new Map();
function lay(ctx, X, str, o) {
  const key = [str, o.family, o.weight, o.size, o.maxWidth, o.lineHeight].join('|');
  let L = LC.get(key);
  if (!L) { L = ctx.text.layout(X, str, { family: o.family, weight: o.weight, size: o.size, maxWidth: o.maxWidth || 940, lineHeight: o.lineHeight || 1.15 }); LC.set(key, L); }
  return L;
}
// kinetic words: each word rises out of its baseline (mode 'up') or pops (mode 'pop'); o.times = per-word absolute starts
export function words(ctx, t, str, x, y, o = {}) {
  const X = o.X || ctx.X, size = o.size || 120, fam = o.family || 'Cairo', wt = o.weight || 900, st = o.stagger ?? 0.07, du = o.dur || 0.38;
  const L = lay(ctx, X, str, { family: fam, weight: wt, size, maxWidth: o.maxWidth, lineHeight: o.lineHeight });
  const ko = o.out != null ? pr(t, o.out, o.out + 0.25) : 0; if (ko >= 1 || t < (o.times ? o.times[0] : o.s) - 0.1) return L;
  ctx.text.drawLayout(X, L, x, y, { align: o.align || 'center', perWord: (i) => {
    const s0 = o.times ? o.times[Math.min(i, o.times.length - 1)] : o.s + i * st, k = eo(pr(t, s0, s0 + du));
    const col = (o.accent || []).includes(i) ? (o.accentColor || C.lg) : (o.color || C.ivory);
    const base = { color: col, alpha: (k > 0.001 ? 1 : 0) * (1 - ko), shadow: o.shadow === false ? null : { blur: 18, y: 6, color: 'rgba(0,0,0,.55)' }, stroke: o.stroke };
    if ((o.mode || 'up') === 'up') return { ...base, clipUp: 1, dy: (1 - k) * size * 1.05 };
    return { ...base, alpha: k * (1 - ko), scale: 0.94 + 0.06 * k, dy: (1 - k) * 18 };
  } });
  return L;
}
// royal title (Aref Ruqaa): right→left reveal wipe per word + slight rise; engraved = dark inner edge
export function royal(ctx, t, str, x, y, o = {}) {
  const X = o.X || ctx.X, size = o.size || 150, st = o.stagger ?? 0.16, du = o.dur || 0.7;
  const L = lay(ctx, X, str, { family: 'Aref Ruqaa', weight: 700, size, maxWidth: o.maxWidth || 900, lineHeight: o.lineHeight || 1.25 });
  const ko = o.out != null ? pr(t, o.out, o.out + 0.3) : 0; if (ko >= 1 || t < o.s) return L;
  ctx.text.drawLayout(X, L, x, y, { align: 'center', perWord: (i) => {
    const s0 = o.times ? o.times[Math.min(i, o.times.length - 1)] : o.s + i * st, k = sio(pr(t, s0, s0 + du));
    return { reveal: k, dy: (1 - k) * 14, alpha: 1 - ko, color: o.color || C.lg, stroke: o.engrave === false ? null : { width: Math.max(2, size * 0.022), color: '#6B4E22' }, shadow: { blur: 22, y: 8, color: 'rgba(0,0,0,.6)' } };
  } });
  return L;
}
// info chip: dark pill + gold rim + gold diamond, pops in at o.s
export function chip(ctx, t, str, x, y, o = {}) {
  const X = ctx.X, size = o.size || 48, k = eo(pr(t, o.s, o.s + 0.3)), ko = o.out != null ? pr(t, o.out, o.out + 0.2) : 0;
  if (k <= 0 || ko >= 1) return;
  const fam = o.family || 'Cairo', wt = o.weight || 800;
  X.save(); X.font = ctx.font(fam, wt, size);
  const tw = X.measureText(ctx.text.westernDigits(str)).width, padX = size * 0.62, dia = size * 0.28, w = tw + padX * 2 + dia * 2.4, h = size * 1.7;
  X.globalAlpha *= k * (1 - ko); X.translate(x, y); const sc = 0.94 + 0.06 * k; X.scale(sc, sc);
  X.beginPath(); X.roundRect(-w / 2, -h / 2, w, h, h / 2);
  X.fillStyle = o.fill || 'rgba(13,10,7,.78)'; X.fill();
  X.lineWidth = 2.5; X.strokeStyle = o.rim || C.gold; X.stroke();
  const dx = w / 2 - padX * 0.7 - dia; X.save(); X.translate(dx, 0); X.rotate(Math.PI / 4); X.fillStyle = C.gold; X.fillRect(-dia / 2, -dia / 2, dia, dia); X.restore();
  ctx.text(X, str, -dia * 1.2, size * 0.36, { family: fam, weight: wt, size, color: o.color || C.ivory });
  X.restore();
}
// counter with fixed-width digit slots (no jitter). o: {from,to,s,dur,x,y,size,family,weight,color,suffix,suffixSize,suffixFamily}
export function counter(ctx, t, o) {
  const X = o.X || ctx.X, k = eo(pr(t, o.s, o.s + (o.dur || 1))), v = Math.round(lerp(o.from || 0, o.to, k));
  const str = o.plain ? String(v) : ctx.num(v), size = o.size || 200, fam = o.family || 'Inter', wt = o.weight || 200;
  X.save(); X.font = ctx.font(fam, wt, size); X.fillStyle = o.color || C.lg; X.textAlign = 'center'; X.textBaseline = 'alphabetic';
  const d0 = X.measureText('0').width * 1.02, sep = X.measureText(',').width;
  const fin = o.plain ? String(o.to) : ctx.num(o.to), full = [...fin].reduce((a, c) => a + (/\d/.test(c) ? d0 : sep), 0);
  let cx = o.x - full / 2; const ofs = full - [...str].reduce((a, c) => a + (/\d/.test(c) ? d0 : sep), 0); cx += ofs / 2;
  const alpha = o.alpha ?? 1; X.globalAlpha *= alpha * (t >= o.s - 0.05 ? 1 : 0);
  if (o.shadow !== false) { X.shadowColor = 'rgba(0,0,0,.55)'; X.shadowBlur = 24; X.shadowOffsetY = 8; }
  for (const c of str) { const w = /\d/.test(c) ? d0 : sep; X.fillText(c, cx + w / 2, o.y); cx += w; }
  X.restore();
  if (o.suffix) ctx.text(X, o.suffix, o.x, o.y + (o.suffixGap || size * 0.62), { family: o.suffixFamily || 'Cairo', weight: 800, size: o.suffixSize || size * 0.32, color: o.suffixColor || C.ivory, alpha: alpha * eo(pr(t, o.s + 0.2, o.s + 0.5)) });
  return k;
}
// light sweep that shines only on what drawFn(Y) paints (text, numbers): drawn normally, then a bright band clipped to its pixels
let TMP2 = null;
export function sheen(X, k, drawFn, o = {}) {
  drawFn(X);
  if (k <= 0 || k >= 1) return;
  if (!TMP2) { TMP2 = document.createElement('canvas'); TMP2.width = 1080; TMP2.height = 1920; }
  const T = TMP2.getContext('2d'); T.setTransform(1, 0, 0, 1, 0, 0); T.globalCompositeOperation = 'source-over'; T.clearRect(0, 0, 1080, 1920);
  drawFn(T);
  T.globalCompositeOperation = 'source-atop';
  const bw = o.width || 160, cx = lerp(-bw * 2, 1080 + bw * 2, k);
  T.save(); T.translate(cx, 960); T.rotate(o.angle ?? 0.35);
  const g = T.createLinearGradient(-bw, 0, bw, 0); g.addColorStop(0, 'rgba(255,248,230,0)'); g.addColorStop(0.5, `rgba(255,248,230,${o.alpha ?? 0.95})`); g.addColorStop(1, 'rgba(255,248,230,0)');
  T.fillStyle = g; T.fillRect(-bw, -2400, bw * 2, 4800); T.restore();
  X.save(); X.globalAlpha *= o.alphaAll ?? 1; X.drawImage(TMP2, 0, 0, 1080, 1920); X.restore();
}
// gold rule that draws from the centre outward
export function rule(X, t, s, x, y, w, o = {}) {
  const k = eo(pr(t, s, s + (o.dur || 0.5))); if (k <= 0) return;
  X.save(); X.fillStyle = o.color || C.gold; X.globalAlpha *= o.alpha ?? 1; X.fillRect(x - w / 2 * k, y - (o.h || 4) / 2, w * k, o.h || 4);
  const d = (o.h || 4) * 3; [-1, 1].forEach(sx => { X.save(); X.translate(x + sx * (w / 2 * k + d), y); X.rotate(Math.PI / 4); X.fillRect(-d / 2, -d / 2, d, d); X.restore(); });
  X.restore();
}
// 8-point Omani star (two overlapping squares) path
export function starPath(X, cx, cy, R, rot = 0) {
  const r = R * 0.7654;   // inner radius of an 8/3 star polygon
  X.beginPath();
  for (let i = 0; i < 16; i++) { const a = rot + i * Math.PI / 8 - Math.PI / 2, rr = i % 2 ? r : R; X[i ? 'lineTo' : 'moveTo'](cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); }
  X.closePath();
}
// slowly turning star-lattice ornament (background texture)
export function lattice(X, t, o = {}) {
  X.save(); X.globalAlpha *= o.alpha ?? 0.08; X.strokeStyle = o.color || C.gold; X.lineWidth = 2;
  const sz = o.size || 180, rot = (o.spin ?? 0.02) * t;
  for (let gy = -1; gy < 1920 / sz + 1; gy++) for (let gx = -1; gx < 1080 / sz + 1; gx++) { starPath(X, gx * sz + (gy % 2) * sz / 2, gy * sz * 0.87, sz * 0.36, rot); X.stroke(); }
  X.restore();
}
// warm dark backdrop: radial warm centre + lattice
export function backdrop(X, t, o = {}) {
  X.fillStyle = C.bg; X.fillRect(0, 0, 1080, 1920);
  const g = X.createRadialGradient(o.cx ?? 540, o.cy ?? 820, 0, o.cx ?? 540, o.cy ?? 820, o.r || 1100);
  g.addColorStop(0, o.inner || '#2A1D10'); g.addColorStop(1, 'rgba(13,10,7,0)'); X.fillStyle = g; X.fillRect(0, 0, 1080, 1920);
  if (o.lattice !== false) lattice(X, t, { alpha: o.latticeAlpha ?? 0.06 });
}
// drifting gold dust (build in setup, draw every frame)
export function dust(ctx, seed, n = 60) {
  const r = ctx.seeded(seed), P = [];
  for (let i = 0; i < n; i++) P.push({ x: r() * 1080, y: r() * 1920, s: 1 + r() * 3.2, v: 10 + r() * 40, ph: r() * 6.28, a: 0.25 + r() * 0.6 });
  return (X, t, alpha = 1) => { X.save(); X.fillStyle = C.lg; P.forEach(p => { const y = ((p.y - p.v * t) % 1920 + 1920) % 1920, x = p.x + 18 * Math.sin(t * 0.6 + p.ph); X.globalAlpha = alpha * p.a * (0.6 + 0.4 * Math.sin(t * 2 + p.ph)); X.beginPath(); X.arc(x, y, p.s, 0, 6.283); X.fill(); }); X.restore(); };
}
// gold bookmark icon
export function bookmark(X, x, y, s, col = C.gold) {
  X.save(); X.translate(x, y); X.scale(s / 100, s / 100); X.beginPath(); X.moveTo(-34, -50); X.lineTo(34, -50); X.lineTo(34, 50); X.lineTo(0, 24); X.lineTo(-34, 50); X.closePath();
  X.fillStyle = col; X.fill(); X.restore();
}
// screen-space impact flash
export function flash(X, t, s, o = {}) { const k = pr(t, s, s + (o.dur || 0.35)); if (k <= 0 || k >= 1) return; X.save(); X.globalCompositeOperation = 'screen'; X.fillStyle = rgba(o.color || C.lg, (o.a ?? 0.8) * Math.pow(1 - k, 2)); X.fillRect(0, 0, 1080, 1920); X.restore(); }
// camera shake transform around a draw
export function shake(X, t, s, amp = 18, dur = 0.35) { const k = pr(t, s, s + dur); if (k <= 0 || k >= 1) return; const a = amp * Math.pow(1 - k, 2); X.translate(Math.sin(t * 91) * a, Math.cos(t * 77) * a); }

// red velvet stage curtain; open 0 = closed, 1 = fully gathered to the sides. Folds sway with t.
export function curtain(X, t, open, o = {}) {
  const n = 14, hw = 540 * (1 - 0.86 * open);           // visible width of each half
  [-1, 1].forEach(side => {
    X.save();
    const x0 = side < 0 ? 0 : 1080 - hw;
    X.beginPath(); X.rect(x0, 0, hw, 1920); X.clip();
    for (let i = 0; i < n; i++) {
      const u = i / n, fw = hw / n, sway = 6 * Math.sin(t * 1.3 + i * 1.7) * (1 - open * 0.5);
      const x = side < 0 ? x0 + u * hw + sway : x0 + u * hw - sway;
      const g = X.createLinearGradient(x, 0, x + fw, 0);
      g.addColorStop(0, '#2A0508'); g.addColorStop(0.35, '#8E1A26'); g.addColorStop(0.55, '#A8293A'); g.addColorStop(1, '#3A070C');
      X.fillStyle = g; X.fillRect(x - 1, 0, fw + 2, 1920);
    }
    const sh = X.createLinearGradient(0, 0, 0, 1920); sh.addColorStop(0, 'rgba(0,0,0,.55)'); sh.addColorStop(0.25, 'rgba(0,0,0,0)'); sh.addColorStop(0.8, 'rgba(0,0,0,.1)'); sh.addColorStop(1, 'rgba(0,0,0,.6)');
    X.fillStyle = sh; X.fillRect(x0, 0, hw, 1920);
    const ex = side < 0 ? x0 + hw : x0, eg = X.createLinearGradient(ex - side * 30, 0, ex, 0); eg.addColorStop(0, 'rgba(0,0,0,0)'); eg.addColorStop(1, 'rgba(0,0,0,.55)');
    X.fillStyle = eg; X.fillRect(Math.min(ex, ex - side * 30), 0, 30, 1920);
    X.fillStyle = C.gold; X.fillRect(x0, 1760, hw, 10); X.fillStyle = rgba(C.lg, 0.5); X.fillRect(x0, 1774, hw, 3);   // gold hem
    X.restore();
  });
  // valance on top
  X.save(); const vg = X.createLinearGradient(0, 0, 0, 230); vg.addColorStop(0, '#3A070C'); vg.addColorStop(1, '#7E1822'); X.fillStyle = vg;
  X.beginPath(); X.moveTo(0, 0); X.lineTo(1080, 0); X.lineTo(1080, 200); for (let i = 8; i >= 0; i--) X.quadraticCurveTo(i * 135 + 67, 250, i * 135, 200); X.closePath(); X.fill();
  X.fillStyle = C.gold; X.fillRect(0, 196, 1080, 6); X.restore();
  // spotlight pool
  if (o.spot) { X.save(); X.globalCompositeOperation = 'screen'; const sg = X.createRadialGradient(540, 900, 0, 540, 900, 620); sg.addColorStop(0, rgba('#FFD7A0', o.spot * 0.45)); sg.addColorStop(1, 'rgba(0,0,0,0)'); X.fillStyle = sg; X.fillRect(0, 0, 1080, 1920); X.restore(); }
}
// stage spotlight beam from the top
export function beam(X, x, topY, bx, by, w, a) {
  X.save(); X.globalCompositeOperation = 'screen';
  const g = X.createLinearGradient(x, topY, bx, by); g.addColorStop(0, rgba('#FFE2B0', a)); g.addColorStop(1, rgba('#FFE2B0', 0));
  X.fillStyle = g; X.beginPath(); X.moveTo(x - 30, topY); X.lineTo(x + 30, topY); X.lineTo(bx + w, by); X.lineTo(bx - w, by); X.closePath(); X.fill();
  X.restore();
}

/* ── transitions (type: fn(X, A, B, k, opts) in device pixels) ── */
function blitAll(X, c, a = 1) { X.save(); X.globalAlpha = a; X.drawImage(c, 0, 0); X.restore(); }
export const T = {
  // 8-point star opening from the centre with a gold rim
  star: (dur = 0.7, at = [540, 900]) => ({ dur, type: (X, A, B, k) => {
    const s = A.width / 1080, e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2, R = e * 1500 * s, rot = (1 - e) * 0.9;
    blitAll(X, A);
    X.save(); starPath(X, at[0] * s, at[1] * s, R, rot); X.clip(); blitAll(X, B); X.restore();
    if (k > 0.02 && k < 0.98) { X.save(); starPath(X, at[0] * s, at[1] * s, R, rot); X.lineWidth = 14 * s; X.strokeStyle = C.gold; X.globalAlpha = 1 - e * 0.6; X.stroke(); starPath(X, at[0] * s, at[1] * s, R * 0.93, rot); X.lineWidth = 3 * s; X.strokeStyle = C.lg; X.stroke(); X.restore(); }
  } }),
  // hard cut hidden under a gold flash
  flash: (dur = 0.35) => ({ dur, type: (X, A, B, k) => { blitAll(X, k < 0.5 ? A : B); X.save(); X.globalCompositeOperation = 'screen'; X.fillStyle = rgba(C.lg, 0.85 * Math.pow(1 - Math.abs(k - 0.5) * 2, 2)); X.fillRect(0, 0, A.width, A.height); X.restore(); } }),
  // whip pan with streaked copies (dir 1 = content moves left)
  whip: (dur = 0.4, dir = 1) => ({ dur, type: (X, A, B, k) => {
    const Wd = A.width, e = k < 0.5 ? 8 * k ** 4 : 1 - Math.pow(-2 * k + 2, 4) / 2, off = -dir * e * Wd;
    for (let j = 0; j < 5; j++) { const o = off + dir * j * 0.035 * Wd * Math.sin(Math.PI * k), a = j ? 0.22 : 1; X.save(); X.globalAlpha = a; X.drawImage(A, o, 0); X.drawImage(B, o + dir * Wd, 0); X.restore(); }
  } }),
  // zoom through: A scales up & fades, B settles from 1.15
  zoom: (dur = 0.45) => ({ dur, type: (X, A, B, k) => {
    const Wd = A.width, Hd = A.height, e = sio(k);
    X.save(); X.translate(Wd / 2, Hd / 2); X.scale(1 + 0.5 * e, 1 + 0.5 * e); X.globalAlpha = 1 - e; X.drawImage(A, -Wd / 2, -Hd / 2); X.restore();
    X.save(); X.translate(Wd / 2, Hd / 2); const z = 1.15 - 0.15 * e; X.scale(z, z); X.globalAlpha = e; X.drawImage(B, -Wd / 2, -Hd / 2); X.restore();
  } }),
  // warm light leak crossing right→left while the shot changes underneath
  leak: (dur = 0.9) => ({ dur, type: (X, A, B, k) => {
    const s = A.width / 1080, m = cl((k - 0.3) / 0.4); blitAll(X, A); blitAll(X, B, m);
    const g = Math.sin(Math.PI * k); X.save(); X.globalCompositeOperation = 'screen';
    [[C.lg, 1, 900], [C.gold, 0.8, 700], ['#FFB060', 0.6, 520]].forEach(([c, sp, rad], j) => { const cx = (1500 - 1900 * k * sp - j * 120) * s, cy = (700 + 480 * j) * s, gr = X.createRadialGradient(cx, cy, 0, cx, cy, rad * s); gr.addColorStop(0, rgba(c, 0.75 * g)); gr.addColorStop(1, rgba(c, 0)); X.fillStyle = gr; X.fillRect(0, 0, A.width, A.height); });
    X.restore();
  } }),
  cross: (dur = 0.5) => ({ dur, type: 'crossfade' }),
  dip: (dur = 0.6) => ({ dur, type: 'dip', color: '#000000' }),
};

/* ── burned-in captions (2–4 words, active word gold), drawn over every frame ── */
let CAP = null;
const PUN = /[…،,\.:؛!]+$/u;
function buildChunks(vo) {
  const all = []; Object.values(vo).sort((a, b) => a.start - b.start).forEach(L => L.words.forEach(w => all.push({ ...w })));
  const out = []; let cur = [];
  const push = () => { if (cur.length) out.push(cur); cur = []; };
  all.forEach((w, i) => {
    cur.push({ w: w.w.replace(PUN, ''), s: w.s, e: w.e });
    const len = cur.reduce((a, x) => a + x.w.length + 1, 0), nxt = all[i + 1];
    if (PUN.test(w.w) || /؟$/.test(w.w) || cur.length >= 3 || len > 20 || (nxt && nxt.s - w.e > 0.45)) push();
  });
  push();
  return out.map((c, i) => ({ words: c, s: c[0].s - 0.06, e: out[i + 1] ? Math.min(out[i + 1][0].s - 0.06, c[c.length - 1].e + 0.6) : c[c.length - 1].e + 0.5 }));
}
export function installCaptions(ctx, o = {}) {
  if (CAP) return; CAP = { ctx, chunks: buildChunks(ctx.vo), y: o.y || 1390, size: o.size || 76 };
  const M = window.MOTION, OUT = document.getElementById('out'), OX = OUT.getContext('2d');
  M.frameData = (t, type = 'image/jpeg', q = 0.95) => { M.renderFrame(t); drawCaptions(OX, t); return OUT.toDataURL(type, q); };
}
export function captionHidden(fn) { if (CAP) CAP.hidden = fn; }
function drawCaptions(X, t) {
  const { ctx, chunks, y, size } = CAP; if (CAP.hidden && CAP.hidden(t)) return;
  const c = chunks.find(c => t >= c.s && t < c.e); if (!c) return;
  X.save(); ctx.resetTransform(X);
  const str = c.words.map(w => w.w).join(' '), L = lay(ctx, X, str, { family: 'Cairo', weight: 900, size, maxWidth: 760, lineHeight: 1.12 });
  const kin = eo(pr(t, c.s, c.s + 0.16)), kout = pr(t, c.e - 0.08, c.e);
  let cur = 0; c.words.forEach((w, i) => { if (t >= w.s - 0.04) cur = i; });
  ctx.text.drawLayout(X, L, 520, y - (L.lines.length - 1) * size * 0.56 + (1 - kin) * 16, { align: 'center', perWord: (i) => {
    const w = c.words[i] || c.words[c.words.length - 1], k = eo(pr(t, w.s - 0.06, w.s + 0.1)), on = i === cur;
    return { alpha: k * kin * (1 - kout), scale: on ? 1.06 : 1, color: on ? C.lg : C.ivory, stroke: { width: size * 0.15, color: 'rgba(8,6,4,.92)' }, shadow: { blur: 16, y: 5, color: 'rgba(0,0,0,.7)' } };
  } });
  X.restore();
}
