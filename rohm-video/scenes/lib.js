/* lib.js — لغة بصرية مشتركة لفيلم دار الأوبرا السلطانية مسقط
   ذهب على أسود دافئ · نجمة عُمانية ثمانية · إطار ذهبي مزدوج · غبار ذهبي · ستارة مخملية */

export const GOLD = '#C9A35C', HI = '#E8CF95', IVORY = '#F3E9D8', CRIMSON = '#7E1822', MUT = '#9C8E78', ROSE = '#D8B49A';

/* ── tiny deterministic hash (no Math.random) ── */
export const h01 = (a, b = 0) => { const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); };

/* ── background: warm black radial + faint star lattice + gold dust ── */
export function bg(ctx, X, t, o = {}) {
  const { W, H } = ctx, cy = o.cy ?? H * 0.42;
  const g = X.createRadialGradient(W / 2, cy, 40, W / 2, cy, H * 0.85);
  g.addColorStop(0, o.inner || '#2B1D11'); g.addColorStop(0.5, o.mid || '#140E09'); g.addColorStop(1, '#050302');
  X.fillStyle = g; X.fillRect(0, 0, W, H);
  if (o.lattice !== false) lattice(ctx, X, t, o.latticeAlpha ?? 0.055);
  if (o.dust !== false) dust(ctx, X, t, o.dustAlpha ?? 1, o.dustN ?? 70);
}

export function lattice(ctx, X, t, alpha) {
  const step = 180, off = (t * 6) % step;
  X.save(); X.globalAlpha = alpha; X.strokeStyle = GOLD; X.lineWidth = 1.4;
  for (let y = -step; y < ctx.H + step; y += step) for (let x = 0; x <= ctx.W + step; x += step) {
    const odd = Math.round(y / step) % 2 ? step / 2 : 0;
    star8(X, x + odd, y + off, 46, Math.PI / 8, { stroke: GOLD, width: 1.4 });
  }
  X.restore();
}

export function dust(ctx, X, t, a = 1, n = 70) {
  X.save();
  for (let i = 0; i < n; i++) {
    const sp = 18 + h01(i, 2) * 40, x = h01(i, 1) * ctx.W + Math.sin(t * 0.3 + i) * 18;
    const y = ((h01(i, 3) * (ctx.H + 200) - t * sp) % (ctx.H + 200) + ctx.H + 200) % (ctx.H + 200) - 100;
    const r = 1 + h01(i, 4) * 2.6, tw = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * (1 + h01(i, 5) * 2) + i * 3));
    X.globalAlpha = a * tw * (0.25 + h01(i, 6) * 0.5);
    X.fillStyle = h01(i, 7) > 0.6 ? IVORY : HI;
    X.beginPath(); X.arc(x, y, r, 0, 6.2832); X.fill();
  }
  X.restore();
}

/* ── Omani / Islamic 8-point star (khatam): two overlapping squares ── */
export function starPts(cx, cy, r, rot = 0) {
  const pts = [], ri = r * 0.7654;
  for (let i = 0; i < 16; i++) { const a = rot + i * Math.PI / 8, rr = i % 2 ? ri : r; pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]); }
  return pts;
}
export function star8(X, cx, cy, r, rot = 0, o = {}) {
  const p = starPts(cx, cy, r, rot);
  X.beginPath(); p.forEach((q, i) => i ? X.lineTo(q[0], q[1]) : X.moveTo(q[0], q[1])); X.closePath();
  if (o.fill) { X.fillStyle = o.fill; X.fill(); }
  if (o.stroke) { X.strokeStyle = o.stroke; X.lineWidth = o.width || 2; X.stroke(); }
}
/* star drawn progressively (k 0..1) */
export function star8Draw(ctx, X, cx, cy, r, rot, k, o = {}) {
  const p = starPts(cx, cy, r, rot); p.push(p[0]);
  ctx.drawPath(X, p, k, { width: o.width || 2, color: o.color || GOLD, smooth: false });
}

/* ── double gold frame with corner stars ── */
export function frame(ctx, X, k, o = {}) {
  if (k <= 0) return;
  const { W, H } = ctx, a = o.inset ?? 48, b = a + 14;
  X.save(); X.globalAlpha = o.alpha ?? 0.9;
  const rect = i => [[W / 2, i], [W - i, i], [W - i, H - i], [i, H - i], [i, i], [W / 2, i]];
  ctx.drawPath(X, rect(a), k, { width: 2, color: GOLD, smooth: false });
  ctx.drawPath(X, rect(b), k, { width: 1, color: GOLD, smooth: false });
  const s = ctx.E.cubicOut(ctx.clamp((k - 0.6) / 0.4));
  if (s > 0) for (const [x, y] of [[a + 7, a + 7], [W - a - 7, a + 7], [W - a - 7, H - a - 7], [a + 7, H - a - 7]]) {
    X.save(); X.translate(x, y); X.scale(s, s); star8(X, 0, 0, 20, Math.PI / 8, { fill: '#0D0A07', stroke: GOLD, width: 2 }); star8(X, 0, 0, 8, Math.PI / 8, { fill: GOLD }); X.restore();
  }
  X.restore();
}

/* ── kicker: small gold label with rules + diamonds ── */
export function kicker(ctx, X, str, y, k, o = {}) {
  if (k <= 0) return;
  const size = o.size || 36;
  X.save(); X.font = ctx.F('body', 600, size); const tw = X.measureText(str).width; X.restore();
  const e = ctx.E.expoOut(k), len = (o.len || 130) * e, gap = 26, cx = o.x ?? 540;
  ctx.text(X, str, cx, y, { family: 'body', weight: 600, size, color: o.color || GOLD, alpha: ctx.clamp(k * 1.6) });
  X.save(); X.strokeStyle = GOLD; X.lineWidth = 2; X.globalAlpha = 0.9;
  const ly = y - size * 0.32;
  X.beginPath(); X.moveTo(cx + tw / 2 + gap, ly); X.lineTo(cx + tw / 2 + gap + len, ly); X.moveTo(cx - tw / 2 - gap, ly); X.lineTo(cx - tw / 2 - gap - len, ly); X.stroke();
  X.fillStyle = GOLD;
  for (const x of [cx + tw / 2 + gap + len + 10, cx - tw / 2 - gap - len - 10]) { X.beginPath(); X.moveTo(x, ly - 7); X.lineTo(x + 7, ly); X.lineTo(x, ly + 7); X.lineTo(x - 7, ly); X.closePath(); X.fill(); }
  X.restore();
}

/* ── word-by-word rise reveal; times[i] = reveal start of word i ── */
export function reveal(ctx, X, str, x, y, o, times) {
  const L = ctx.text.layout(X, str, { family: o.family || 'body', weight: o.weight ?? 600, size: o.size || 60, maxWidth: o.maxWidth || 900, lineHeight: o.lineHeight || 1.45 });
  const t = o.t, dur = o.dur || 0.55, out = o.out;
  return ctx.text.drawLayout(X, L, x, y, {
    align: o.align || 'center', color: o.color || IVORY, perWord: (i) => {
      const s = times[Math.min(i, times.length - 1)], k = ctx.at(t, s, s + dur, 'expoOut');
      if (k <= 0) return { alpha: 0 };
      let a = k; if (out != null) a *= 1 - ctx.at(t, out, out + 0.4, 'cubicIn');
      return { alpha: a, dy: (1 - k) * (o.rise ?? 46), clipUp: o.clip === false ? undefined : 1, color: (o.colorAt && o.colorAt(i)) || undefined };
    },
  });
}
export const spread = (a, b, n) => Array.from({ length: n }, (_, i) => n === 1 ? a : a + (b - a) * i / (n - 1));
/* word times of a VO line (start of each word) */
export const wt = (ctx, id) => ctx.wordsOf(id).map(w => w.s);

/* ── slow luxurious camera push for a whole scene: call before drawing content ── */
export function push(ctx, X, lt, amt = 0.045, cx = 540, cy = 960) {
  const s = 1 + amt * ctx.clamp(lt / Math.max(ctx.scene.dur, 1));
  X.translate(cx, cy); X.scale(s, s); X.translate(-cx, -cy);
}

/* ── year timeline rail (2001 · 2003 · 2007 · 2011) ── */
export const YEARS = ['2001', '2003', '2007', '2011'];
export function rail(ctx, X, t, lt, active, o = {}) {
  const y = o.y ?? 1400, x0 = 160, x1 = 920, k = ctx.at(lt, 0.1, 0.9, 'expoOut');
  X.save(); X.globalAlpha = o.alpha ?? 1;
  X.strokeStyle = 'rgba(201,163,92,.35)'; X.lineWidth = 2;
  X.beginPath(); X.moveTo(x1, y); X.lineTo(x1 - (x1 - x0) * k, y); X.stroke();
  YEARS.forEach((yr, i) => {
    const x = x1 - (x1 - x0) * i / (YEARS.length - 1), on = i === active, past = i < active;
    const kk = ctx.at(lt, 0.2 + i * 0.08, 0.6 + i * 0.08, 'expoOut');
    X.globalAlpha = (o.alpha ?? 1) * kk;
    X.fillStyle = on ? GOLD : past ? 'rgba(201,163,92,.7)' : '#3A2D1E';
    X.beginPath(); X.arc(x, y, on ? 11 : 7, 0, 6.2832); X.fill();
    if (on) { const p = 0.5 + 0.5 * Math.sin(t * 3); X.strokeStyle = GOLD; X.lineWidth = 2; X.globalAlpha *= 0.6 * (1 - p * 0.5); X.beginPath(); X.arc(x, y, 20 + p * 8, 0, 6.2832); X.stroke(); X.globalAlpha = (o.alpha ?? 1) * kk; }
    ctx.text(X, yr, x, y + 58, { family: 'num', weight: on ? 500 : 300, size: on ? 34 : 28, color: on ? HI : MUT, dir: 'ltr' });
  });
  X.restore();
}

/* ── rolling year (slot-machine digits) ── */
export function rollNumber(ctx, X, str, x, y, k, o = {}) {
  const size = o.size || 300; X.save(); X.font = ctx.F('num', o.weight ?? 200, size);
  const ch = [...str], ws = ch.map(c => X.measureText(c).width), tw = ws.reduce((a, b) => a + b, 0);
  let cx = x - tw / 2;
  X.beginPath(); X.rect(x - tw / 2 - 40, y - size * 0.86, tw + 80, size * 1.02); X.clip();
  X.textAlign = 'left'; X.direction = 'ltr'; X.fillStyle = o.color || IVORY;
  ch.forEach((c, i) => {
    const d = /\d/.test(c) ? +c : null, kk = ctx.E.expoOut(ctx.clamp((k - i * 0.08) / (1 - Math.min(0.5, ch.length * 0.08))));
    if (d === null) { X.globalAlpha = kk; X.fillText(c, cx, y); X.globalAlpha = 1; cx += ws[i]; return; }
    const spins = 1 + i, pos = (d + 10 * spins) * kk;               // virtual position on the reel
    for (let j = Math.floor(pos) - 1; j <= Math.floor(pos) + 1; j++) {
      const off = (j - pos) * size * 0.95; X.globalAlpha = ctx.clamp(1 - Math.abs(j - pos) * 0.9);
      X.fillText(String(((j % 10) + 10) % 10), cx, y + off);
    }
    X.globalAlpha = 1; cx += ws[i];
  });
  X.restore();
}

/* ── opera façade line-art (arcade + central tower + side towers) ── */
export function facadePaths(cx = 540, base = 1180, w = 860) {
  const P = [], L = cx - w / 2, R = cx + w / 2;
  const arch = (x0, x1, yb, yt) => {               // pointed (Omani) arch from springline yb, apex yt
    const pts = [[x0, yb + 120], [x0, yb]], m = (x0 + x1) / 2;
    for (let i = 1; i <= 10; i++) { const u = i / 10; pts.push([x0 + (m - x0) * Math.sin(u * Math.PI / 2), yb - (yb - yt) * (1 - Math.cos(u * Math.PI / 2))]); }
    for (let i = 9; i >= 0; i--) { const u = i / 10; pts.push([x1 - (x1 - m) * Math.sin(u * Math.PI / 2), yb - (yb - yt) * (1 - Math.cos(u * Math.PI / 2))]); }
    pts.push([x1, yb + 120]); return pts;
  };
  P.push([[L - 40, base], [R + 40, base]]);                                          // ground
  P.push([[L, base], [L, base - 190], [R, base - 190], [R, base]]);                // arcade block
  const n = 7, aw = w / n;
  for (let i = 0; i < n; i++) { const x0 = L + i * aw + 16, x1 = L + (i + 1) * aw - 16; P.push(arch(x0, x1, base - 120, base - 175)); }
  P.push([[L + 40, base - 190], [L + 40, base - 330], [R - 40, base - 330], [R - 40, base - 190]]);   // upper body
  for (let i = 0; i < 9; i++) { const x = L + 70 + i * (w - 140) / 8; P.push([[x - 18, base - 220], [x - 18, base - 290], [x, base - 312], [x + 18, base - 290], [x + 18, base - 220]]); }  // windows
  const tw = 190; P.push([[cx - tw / 2, base - 330], [cx - tw / 2, base - 560], [cx + tw / 2, base - 560], [cx + tw / 2, base - 330]]);  // central tower
  P.push(arch(cx - 50, cx + 50, base - 440, base - 520).slice(1, -1));
  const cren = (x0, wd, top, n, hgt) => { const c = []; for (let i = 0; i < n; i++) { const a = x0 + i * wd / n, b = a + wd / n, yy = i % 2 === 0 ? top - hgt : top; c.push([a, yy], [b, yy]); } return c; };
  P.push(cren(cx - tw / 2, tw, base - 560, 9, 30));
  for (const sx of [L + 40, R - 40 - 110]) {                                         // side towers
    P.push([[sx, base - 330], [sx, base - 430], [sx + 110, base - 430], [sx + 110, base - 330]]);
    P.push(cren(sx, 110, base - 430, 5, 22));
  }
  return P;
}
export function drawFacade(ctx, X, k, o = {}) {
  const P = o.paths || facadePaths(o.cx, o.base, o.w), n = P.length;
  X.save(); X.globalAlpha = o.alpha ?? 1;
  P.forEach((p, i) => { const kk = ctx.clamp((k - i / n * 0.6) / 0.4); if (kk > 0) ctx.drawPath(X, p, kk, { width: o.width || 2.4, color: o.color || GOLD, smooth: false }); });
  X.restore();
}
/* warm light inside arches (lit facade) */
export function litArches(ctx, X, k, o = {}) {
  if (k <= 0) return;
  const cx = o.cx ?? 540, base = o.base ?? 1180, w = o.w ?? 860, L = cx - w / 2, n = 7, aw = w / n;
  X.save();
  for (let i = 0; i < n; i++) {
    const kk = ctx.clamp(k * 2 - Math.abs(i - 3) * 0.18); if (kk <= 0) continue;
    const x0 = L + i * aw + 18, x1 = L + (i + 1) * aw - 18, g = X.createLinearGradient(0, base - 175, 0, base);
    g.addColorStop(0, 'rgba(232,207,149,0.0)'); g.addColorStop(0.35, 'rgba(232,207,149,0.55)'); g.addColorStop(1, 'rgba(201,163,92,0.15)');
    X.globalAlpha = kk; X.fillStyle = g; X.fillRect(x0 + 2, base - 118, x1 - x0 - 4, 118);
  }
  for (let i = 0; i < 9; i++) { const x = L + 70 + i * (w - 140) / 8, kk = ctx.clamp(k * 2 - 0.4 - Math.abs(i - 4) * 0.1); if (kk <= 0) continue; X.globalAlpha = kk * 0.8; X.fillStyle = HI; X.fillRect(x - 14, base - 286, 28, 64); }
  X.restore();
}

/* ── velvet curtain (one panel, cached per size) ── */
const CUR = {};
export function curtainPanel(w, h, side) {
  const key = w + 'x' + h + side; if (CUR[key]) return CUR[key];
  const c = document.createElement('canvas'); c.width = Math.ceil(w); c.height = Math.ceil(h); const X = c.getContext('2d');
  const folds = 7, g = X.createLinearGradient(0, 0, w, 0);
  for (let i = 0; i <= folds * 2; i++) { const u = i / (folds * 2); g.addColorStop(u, i % 2 ? '#3A070C' : '#8E1B26'); }
  X.fillStyle = g; X.fillRect(0, 0, w, h);
  const v = X.createLinearGradient(0, 0, 0, h); v.addColorStop(0, 'rgba(0,0,0,.55)'); v.addColorStop(0.25, 'rgba(0,0,0,0)'); v.addColorStop(0.85, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.6)');
  X.fillStyle = v; X.fillRect(0, 0, w, h);
  X.fillStyle = GOLD; const edge = side === 'L' ? w - 10 : 0; X.fillRect(edge, 0, 10, h);       // gold trim on the meeting edge
  X.fillRect(0, h - 26, w, 6); X.globalAlpha = .5; X.fillRect(0, h - 14, w, 3);
  CUR[key] = c; return c;
}
/* draw both panels; open 0 = closed, 1 = fully open; s = device scale (1 in scene space) */
export function curtains(X, W, H, open, s = 1) {
  const pw = W / 2 + 30 * s, Lp = curtainPanel(pw, H, 'L'), Rp = curtainPanel(pw, H, 'R');
  const off = open * (pw + 10 * s);
  // gather: panels compress horizontally as they open
  const sq = 1 - open * 0.45;
  X.save(); X.translate(-off * 0.55, 0); X.drawImage(Lp, 0, 0, pw * sq, H); X.restore();
  X.save(); X.translate(W - pw * sq + off * 0.55, 0); X.drawImage(Rp, 0, 0, pw * sq, H); X.restore();
  // valance (scalloped pelmet)
  X.save(); X.fillStyle = '#5A0F17'; X.beginPath(); X.moveTo(0, 0); X.lineTo(W, 0); X.lineTo(W, 120 * s);
  const n = 9; for (let i = n; i >= 0; i--) { const x = W * i / n; X.quadraticCurveTo(x + W / n / 2, 175 * s, x, 120 * s); }
  X.closePath(); X.fill(); X.strokeStyle = GOLD; X.lineWidth = 4 * s; X.stroke(); X.restore();
}

/* ── royal transitions (device-pixel compositors) ── */
export const TRANS = {
  /* curtain closes over A from both sides, revealing B (B is itself a closed-curtain scene) */
  curtainIn(X, A, B, k) {
    const w = A.width, h = A.height, e = 1 - Math.pow(1 - k, 3), pw = w / 2 + 30 * w / 1080;
    const Lp = curtainPanel(pw, h, 'L'), Rp = curtainPanel(pw, h, 'R');
    if (k >= 0.999) { X.drawImage(B, 0, 0); return; }
    X.drawImage(A, 0, 0);
    X.drawImage(Lp, -pw + pw * e, 0); X.drawImage(Rp, w - pw * e, 0);
    // valance drops in from the top
    X.save(); X.translate(0, -180 * (w / 1080) * (1 - e)); curtains(X, w, h, 2, w / 1080); X.restore();
  },
  /* horizontal veil: B opens from a centre slit, gold hairlines on the edges */
  veil(X, A, B, k) {
    const w = A.width, h = A.height, e = k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2, hh = h / 2 * e, s = w / 1080;
    X.save(); X.translate(w / 2, h / 2); X.scale(1 + e * 0.08, 1 + e * 0.08); X.globalAlpha = 1 - e * 0.6; X.drawImage(A, -w / 2, -h / 2); X.restore();
    X.save(); X.beginPath(); X.rect(0, h / 2 - hh, w, hh * 2); X.clip(); X.drawImage(B, 0, 0); X.restore();
    if (k > 0 && k < 1) { X.fillStyle = GOLD; X.fillRect(0, h / 2 - hh - 2 * s, w, 3 * s); X.fillRect(0, h / 2 + hh - 1 * s, w, 3 * s); }
  },
  /* 8-point star iris */
  starIris(X, A, B, k) {
    const w = A.width, h = A.height, e = k * k * k, r = Math.hypot(w, h) * 0.75 * e + 1, s = w / 1080;
    X.drawImage(A, 0, 0); X.save(); star8(X, w / 2, h / 2, r, e * 0.8 + Math.PI / 8); X.clip(); X.drawImage(B, 0, 0); X.restore();
    if (k > 0 && k < 1) { X.save(); star8(X, w / 2, h / 2, r, e * 0.8 + Math.PI / 8, { stroke: GOLD, width: 5 * s }); X.restore(); }
  },
};

/* ── opera stage: dark backdrop, floor light pool, spotlight cones ── */
export function stage(ctx, X, t, o = {}) {
  const k = o.k ?? 1, W = 1080;
  const g = X.createLinearGradient(0, 0, 0, 1920); g.addColorStop(0, '#0A0605'); g.addColorStop(0.62, '#1A0F0A'); g.addColorStop(0.63, '#24170E'); g.addColorStop(1, '#0B0705');
  X.fillStyle = g; X.fillRect(0, 0, W, 1920);
  X.save(); X.globalCompositeOperation = 'lighter';
  const pool = X.createRadialGradient(540, 1250, 20, 540, 1250, 520); pool.addColorStop(0, `rgba(232,207,149,${0.35 * k})`); pool.addColorStop(1, 'rgba(232,207,149,0)');
  X.save(); X.translate(540, 1250); X.scale(1, 0.28); X.translate(-540, -1250); X.fillStyle = pool; X.fillRect(0, 700, W, 1100); X.restore();
  for (const [sx, sw] of [[230, 0.6], [850, -0.6]]) {
    const sway = Math.sin(t * 0.5 + sx) * 30, cg = X.createLinearGradient(sx, 150, 540, 1250);
    cg.addColorStop(0, `rgba(243,233,216,${0.22 * k})`); cg.addColorStop(1, 'rgba(243,233,216,0)');
    X.fillStyle = cg; X.beginPath(); X.moveTo(sx - 18, 150); X.lineTo(sx + 18, 150); X.lineTo(540 + 300 + sway, 1260); X.lineTo(540 - 300 + sway, 1260); X.closePath(); X.fill();
  }
  X.restore();
}
