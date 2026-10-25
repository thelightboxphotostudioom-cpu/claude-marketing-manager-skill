// 7 · OPENING NIGHT · «وحوالي ثلاثمية وخمسين فنان إيطالي جوا خصيصاً لهالليلة.» — 350 figures fill the frame
import * as H from '../lib.js';
const { C } = H;
MOTION.scene({
  id: 's24', transition: H.T.flash(0.3),
  setup(ctx) { const r = ctx.seeded(24); this.d = Array.from({ length: 350 }, (_, i) => ({ i, d: r() * 0.9 })); },
  draw(t, lt, ctx) {
    const { X, E } = ctx, w = i => H.W(ctx, 'l25', i), s0 = w(1) - 0.1;
    H.backdrop(X, t, { cy: 950, inner: '#2B1C0D', latticeAlpha: 0.04 });
    const cols = 25, cw = 36, rh = 46, x0 = 540 - (cols - 1) * cw / 2, y0 = 650;
    this.d.forEach(p => {
      const c = p.i % cols, r = Math.floor(p.i / cols), k = E.expoOut(ctx.prog(t, s0 + p.d + r * 0.03, s0 + p.d + r * 0.03 + 0.35)); if (k <= 0) return;
      const x = x0 + c * cw, y = y0 + r * rh + (1 - k) * 30;
      X.save(); X.globalAlpha = k; X.fillStyle = (p.i % 17 === 0) ? C.lg : C.gold;
      X.beginPath(); X.arc(x, y - 12, 7, 0, 6.283); X.fill(); X.beginPath(); X.roundRect(x - 10, y - 2, 20, 22, [9, 9, 3, 3]); X.fill(); X.restore();
    });
    H.chip(ctx, t, 'حوالي', 540, 300, { s: w(0), size: 44 });
    X.save(); H.shake(X, t, w(3) - 0.1, 10, 0.3);
    H.counter(ctx, t, { from: 0, to: 350, s: w(1), dur: w(3) - w(1), x: 540, y: 500, size: 210, weight: 200 });
    X.restore();
    ctx.text(X, 'فنان إيطالي', 540, 610, { family: 'Cairo', weight: 900, size: 64, color: C.ivory, alpha: ctx.at(t, w(3) - 0.05, w(3) + 0.2), shadow: { blur: 14, y: 4, color: 'rgba(0,0,0,.6)' } });
    H.chip(ctx, t, 'خصيصاً لهالليلة', 540, 1330 - 70, { s: w(6), size: 46 });
  },
});
