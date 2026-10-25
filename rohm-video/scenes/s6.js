// s6 — 2007: بدء البناء على 80,000 م² — قطعة أرض إيزومترية ترتفع منها الكتل
import { bg, kicker, reveal, rollNumber, frame, push, GOLD, HI, IVORY, MUT, ROSE } from './lib.js';
const iso = (x, y, z) => [540 + (x - y) * 0.87, 930 + (x + y) * 0.5 - z];
function prism(X, x, y, w, d, h, k, col) {
  if (k <= 0) return; const H = h * k;
  const a = iso(x, y, H), b = iso(x + w, y, H), c = iso(x + w, y + d, H), e = iso(x, y + d, H);
  const b0 = iso(x + w, y, 0), c0 = iso(x + w, y + d, 0), e0 = iso(x, y + d, 0);
  X.fillStyle = '#3A2A1B'; X.beginPath(); X.moveTo(...e); X.lineTo(...c); X.lineTo(...c0); X.lineTo(...e0); X.closePath(); X.fill();
  X.fillStyle = '#2A1E13'; X.beginPath(); X.moveTo(...c); X.lineTo(...b); X.lineTo(...b0); X.lineTo(...c0); X.closePath(); X.fill();
  X.fillStyle = col; X.beginPath(); X.moveTo(...a); X.lineTo(...b); X.lineTo(...c); X.lineTo(...e); X.closePath(); X.fill();
  X.strokeStyle = GOLD; X.lineWidth = 1.5; X.stroke();
}
MOTION.scene({ id: 's6',
  draw(t, lt, ctx) {
    const { X, at } = ctx, w = ctx.wordsOf('l6');
    bg(ctx, X, t, { cy: 1000 });
    X.save(); push(ctx, X, lt, 0.04, 540, 1000);
    rollNumber(ctx, X, '2007', 540, 420, at(t, w[0].s - 0.3, w[2].e, 'cubicInOut'), { size: 230, weight: 200, color: IVORY });
    kicker(ctx, X, 'بدء البناء', 520, at(t, w[3].s, w[4].e));
    // the plot
    const pk = at(lt, 0.8, 2.6, 'cubicInOut'), S = 360;
    const plot = [iso(-S, -S, 0), iso(S, -S, 0), iso(S, S, 0), iso(-S, S, 0), iso(-S, -S, 0)];
    ctx.drawPath(X, plot, pk, { width: 2.5, color: GOLD, smooth: false });
    X.save(); X.globalAlpha = 0.18 * pk; X.strokeStyle = GOLD; X.lineWidth = 1;
    for (let i = -S; i <= S; i += 60) { X.beginPath(); X.moveTo(...iso(i, -S, 0)); X.lineTo(...iso(i, S, 0)); X.moveTo(...iso(-S, i, 0)); X.lineTo(...iso(S, i, 0)); X.stroke(); }
    X.restore();
    // masses rise (back to front)
    const r0 = w[4].s;
    prism(X, -200, -220, 400, 220, 120, at(t, r0, r0 + 1.2, 'expoOut'), ROSE);
    prism(X, -250, 0, 500, 180, 70, at(t, r0 + 0.4, r0 + 1.6, 'expoOut'), '#C9A88E');
    prism(X, -60, -160, 120, 120, 230, at(t, r0 + 0.8, r0 + 2.0, 'expoOut'), '#E2C2A8');
    prism(X, -300, 220, 600, 80, 18, at(t, r0 + 1.0, r0 + 2.2, 'expoOut'), '#8C7A62');
    X.restore();
    // area counter
    const ck = at(t, w[7].s - 0.1, w[10].e, 'cubicOut');
    ctx.text(X, ctx.num(Math.round(80000 * ck)), 540, 1430, { family: 'num', weight: 200, size: 140, color: HI, dir: 'ltr', alpha: ctx.clamp(ck * 4) });
    reveal(ctx, X, 'متر مربّع · شاطئ القُرم', 540, 1500, { t, size: 42, weight: 500, color: IVORY }, [w[9].s, w[10].s, w[10].s + 0.2, w[10].s + 0.35]);
    frame(ctx, X, 1, { alpha: 0.7 });
  } });
