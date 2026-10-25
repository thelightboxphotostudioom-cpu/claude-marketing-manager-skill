// 1 · DREAM · «السلطان قابوس كان عاشق للموسيقى…» — a gold music staff flows across the frame, notes land on it
import * as H from '../lib.js';
const { C } = H;
export function staff(ctx, X, t, draw, o = {}) {      // shared with s09
  const y0 = o.y || 1020, gap = 30, amp = o.amp ?? 34;
  const yAt = (x, j) => y0 + (j - 2) * gap + amp * Math.sin(x / 210 + t * 1.4);
  X.save(); X.strokeStyle = C.gold; X.lineWidth = 3; X.globalAlpha *= o.alpha ?? 1;
  for (let j = 0; j < 5; j++) { X.beginPath(); for (let x = 1100; x >= 1100 - 1200 * draw; x -= 12) X[x === 1100 ? 'moveTo' : 'lineTo'](x, yAt(x, j)); X.stroke(); }
  X.restore();
  return yAt;
}
export function note(X, x, y, s, a, col = C.lg) {
  X.save(); X.globalAlpha *= a; X.translate(x, y); X.fillStyle = col; X.strokeStyle = col;
  X.save(); X.rotate(-0.38); X.beginPath(); X.ellipse(0, 0, 17 * s, 12 * s, 0, 0, 6.283); X.fill(); X.restore();
  X.lineWidth = 4 * s; X.beginPath(); X.moveTo(15 * s, -4 * s); X.lineTo(15 * s, -86 * s); X.stroke();
  X.beginPath(); X.moveTo(15 * s, -86 * s); X.quadraticCurveTo(44 * s, -60 * s, 34 * s, -30 * s); X.stroke();
  X.restore();
}
MOTION.scene({
  id: 's07', transition: H.T.star(0.75, [540, 760]),
  setup(ctx) { this.dust = H.dust(ctx, 7, 50); const r = ctx.seeded(4); this.notes = Array.from({ length: 11 }, (_, i) => ({ x: 980 - i * 88, j: r.int ? r.int(0, 8) : Math.floor(r() * 9), d: 0.12 + i * 0.12 })); },
  draw(t, lt, ctx) {
    const { X, E } = ctx, w = i => H.W(ctx, 'l07', i);
    H.backdrop(X, t, { cy: 900, inner: '#2C1E0E' });
    this.dust(X, t, 0.6);
    const yAt = staff(ctx, X, t, E.cubicOut(ctx.prog(lt, 0.05, 1.0)));
    this.notes.forEach(n => { const k = E.expoOut(ctx.prog(lt, n.d + 0.2, n.d + 0.55)); if (k > 0) note(X, n.x, yAt(n.x, 2) + (n.j - 4) * 15 - (1 - k) * 60, 1, k); });
    H.royal(ctx, t, 'السلطان قابوس', 540, 560, { times: [w(0), w(1)], size: 96, dur: 0.5 });
    H.words(ctx, t, 'عاشق للموسيقى', 540, 780, { times: [w(3), w(4)], size: 150, accent: [1] });
  },
});
