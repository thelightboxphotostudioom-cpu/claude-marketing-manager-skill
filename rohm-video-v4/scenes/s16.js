// 4 · TRANSFORMING HALL · «وهنا السر… بضغطة زر، جدار صوتي وزنه خمسمية طن يمشي على سكة حديد.»
// real hall photo → button → 2D gold section diagram: the 500-ton shell rolls in on rails
import * as H from '../lib.js';
const { C } = H;
const FL = 1120;                                       // auditorium floor line
// st: {a: alpha, shell 0..1 (offstage → on stage), lift, pit, sink, concert, t}
export function diagram(ctx, X, st) {
  const { E } = ctx, a = st.a ?? 1; if (a <= 0) return;
  X.save(); X.globalAlpha *= a; X.translate(540, 840); X.scale(1.05, 1.05); X.translate(-540, -900);
  X.fillStyle = 'rgba(13,10,7,.55)'; X.fillRect(60, 560, 960, 680);
  // blueprint grid
  X.strokeStyle = H.rgba(C.gold, 0.08); X.lineWidth = 1;
  for (let x = 60; x <= 1020; x += 40) { X.beginPath(); X.moveTo(x, 560); X.lineTo(x, 1240); X.stroke(); }
  for (let y = 560; y <= 1240; y += 40) { X.beginPath(); X.moveTo(60, y); X.lineTo(1020, y); X.stroke(); }
  // walls / fly tower / roof
  X.strokeStyle = H.rgba(C.lg, 0.85); X.lineWidth = 3.5;
  X.beginPath(); X.moveTo(80, FL + 60); X.lineTo(80, 580); X.lineTo(380, 580); X.lineTo(380, 660); X.lineTo(1000, 700); X.lineTo(1000, FL - 140); X.stroke();
  // stage + rails
  X.fillStyle = H.rgba(C.gold, 0.22); X.fillRect(80, 1040, 300, FL + 60 - 1040); X.strokeStyle = C.gold; X.strokeRect(80, 1040, 300, FL + 60 - 1040);
  X.fillStyle = C.lg; X.fillRect(80, 1034, 300, 3); for (let x = 90; x < 380; x += 24) X.fillRect(x, 1030, 4, 10);
  // proscenium header (lifts)
  const hb = 800 - 110 * (st.lift || 0);
  X.fillStyle = C.gold; X.fillRect(372, 600, 22, hb - 600); X.fillRect(372, 1040, 22, 0);
  X.fillStyle = H.rgba(C.gold, 0.5); X.fillRect(366, hb - 6, 34, 6);
  // orchestra pit platform
  const py = 1170 - 130 * (st.pit || 0);
  X.strokeStyle = H.rgba(C.lg, 0.5); X.lineWidth = 2; X.strokeRect(396, 1040, 130, 150);
  X.fillStyle = C.gold; X.fillRect(398, py, 126, 14);
  for (let i = 0; i < 3; i++) { X.fillStyle = H.rgba(C.gold, 0.5); X.fillRect(420 + i * 36, py + 14, 6, 1190 - py - 14); }
  // raked seating; the first two rows sink below the floor
  for (let i = 0; i < 10; i++) {
    const x = 550 + i * 44, base = FL - i * 13, sink = i < 2 ? 140 * (st.sink || 0) : 0, gone = i < 2 && (st.concert || 0) > 0.5;
    X.save(); X.beginPath(); X.rect(x - 4, 500, 48, base - 500 + 2); X.clip();
    if (!gone || true) { X.fillStyle = C.crim; X.beginPath(); X.roundRect(x, base - 46 + sink, 30, 36, 6); X.fill(); X.fillStyle = '#A8293A'; X.fillRect(x + 2, base - 18 + sink, 34, 10); }
    X.restore();
    X.fillStyle = H.rgba(C.lg, 0.6); X.fillRect(x - 4, base, 48, 3);
  }
  // the 500-ton acoustic shell on rails
  const sx = -260 + 360 * (st.shell || 0);
  X.save(); X.beginPath(); X.rect(80, 560, 920, 700); X.clip();
  X.fillStyle = H.rgba(C.gold, 0.85); X.fillRect(sx, 770, 110, 264);
  X.strokeStyle = C.bg; X.lineWidth = 2; for (let y = 790; y < 1030; y += 22) { X.beginPath(); X.moveTo(sx + 8, y); X.lineTo(sx + 102, y); X.stroke(); }
  [sx + 22, sx + 88].forEach(wx => { X.beginPath(); X.arc(wx, 1030, 9, 0, 6.283); X.fillStyle = C.lg; X.fill(); });
  // concert mode: reflector panels lower over the stage
  const ck = E.cubicInOut(st.concert || 0);
  for (let i = 0; i < 4; i++) { const y = 610 + ck * (150 + i * 4); X.fillStyle = H.rgba(C.lg, 0.35 + 0.6 * ck); X.save(); X.translate(130 + i * 66, y); X.rotate(-0.12); X.fillRect(-28, 0, 56, 8); X.restore(); }
  X.restore();
  const lab = (s, x, y) => ctx.text(X, s, x, y, { family: 'Cairo', weight: 700, size: 30, color: H.rgba(C.ivory, 0.85) });
  lab('المسرح', 230, 1110); lab('الحفرة', 461, 1005); lab('المقاعد', 800, 960);
  X.restore();
}
MOTION.scene({
  id: 's16', transition: H.T.star(0.75, [540, 860]),
  draw(t, lt, ctx) {
    const { X, E } = ctx, w = i => H.W(ctx, 'l16', i), press = w(2) + 0.15, toD = E.cubicInOut(ctx.prog(t, w(3), w(3) + 0.45));
    H.kb(X, ctx.img('hall_1'), t, ctx.scene.start - 0.3, 2.4, { fx: 0.5, fy: 0.55, z: 1.1 }, { fx: 0.5, fy: 0.6, z: 1.45 });
    H.shade(X, { top: 0.6, bottom: 0.5, all: 0.72 * toD });
    H.royal(ctx, t, 'وهنا السر…', 540, 640, { times: [w(0), w(1)], size: 140, out: w(3) - 0.1 });
    // button
    const bk = ctx.at(t, press - 0.3, press, 'expoOut'), bo = ctx.prog(t, press + 0.35, press + 0.6);
    if (bk > 0 && bo < 1) { X.save(); X.globalAlpha = bk * (1 - bo); X.translate(540, 900); const d = ctx.prog(t, press, press + 0.1) > 0 && t < press + 0.18 ? 0.86 : 1; X.scale(d, d);
      X.beginPath(); X.arc(0, 0, 90, 0, 6.283); X.fillStyle = 'rgba(13,10,7,.85)'; X.fill(); X.lineWidth = 6; X.strokeStyle = C.gold; X.stroke(); X.beginPath(); X.arc(0, 0, 56, 0, 6.283); X.fillStyle = C.gold; X.fill(); X.restore(); }
    const shell = E.cubicInOut(ctx.prog(t, w(9) - 0.6, w(12) + 0.3));
    diagram(ctx, X, { a: toD, shell });
    H.flash(X, t, press, { a: 0.5, dur: 0.3 });
    X.save(); H.shake(X, t, w(7) + 0.3, 10, 0.3);
    H.counter(ctx, t, { from: 0, to: 500, s: w(7) - 0.1, dur: 0.6, x: 540, y: 400, size: 220, weight: 200, alpha: toD });
    ctx.text(X, 'طن', 540, 500, { family: 'Cairo', weight: 900, size: 76, color: C.ivory, alpha: ctx.at(t, w(8) - 0.05, w(8) + 0.15) });
    X.restore();
    H.chip(ctx, t, 'جدار صوتي', 300, 1240, { s: w(4), size: 44 });
    H.chip(ctx, t, 'سكة حديد', 760, 1240, { s: w(11), size: 44 });
  },
});
