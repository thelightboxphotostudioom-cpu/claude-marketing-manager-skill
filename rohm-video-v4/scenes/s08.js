// 1 · DREAM · «سنة خمسة وثمانين أسّس الأوركسترا السيمفونية السلطانية، وكل عازفينها عُمانيين.»
import * as H from '../lib.js';
const { C } = H;
export function rail(ctx, X, t, pos, o = {}) {        // timeline 1985 → 2001 (right → left), shared with s09
  const y = o.y || 1180, xr = 860, xl = 220, a = o.alpha ?? 1; if (a <= 0) return;
  X.save(); X.globalAlpha *= a;
  X.fillStyle = H.rgba(C.gold, 0.35); X.fillRect(xl, y - 2, xr - xl, 4);
  X.fillStyle = C.gold; X.fillRect(xr - (xr - xl) * pos, y - 3, (xr - xl) * pos, 6);
  [[xr, '1985'], [xl, '2001']].forEach(([x, s], i) => { X.beginPath(); X.arc(x, y, 12, 0, 6.283); X.fillStyle = i === 0 || pos >= 1 ? C.lg : C.bg; X.fill(); X.lineWidth = 3; X.strokeStyle = C.gold; X.stroke(); ctx.text(X, s, x, y + 62, { family: 'Inter', weight: 300, size: 40, color: C.ivory }); });
  const px = xr - (xr - xl) * pos; X.beginPath(); X.arc(px, y, 9, 0, 6.283); X.fillStyle = '#FFF4DC'; X.fill();
  X.restore();
}
MOTION.scene({
  id: 's08', transition: H.T.leak(0.8),
  setup(ctx) { this.dust = H.dust(ctx, 8, 40); },
  draw(t, lt, ctx) {
    const { X, E } = ctx, w = i => H.W(ctx, 'l08', i), img = ctx.img('hall_3');
    const up = E.expoInOut(ctx.prog(t, w(3) - 0.1, w(3) + 0.45));              // year moves up when «أسّس» lands
    H.backdrop(X, t, { cy: 800 });
    X.save(); X.globalAlpha = up;
    H.kb(X, img, t, w(3), 4.5, { fx: 0.5, fy: 0.42, z: 1.1 }, { fx: 0.5, fy: 0.5, z: 1.22 }, { filter: 'brightness(.75) saturate(1.1)' });
    H.shade(X, { all: 0.25, top: 0.85, topH: 1100, bottom: 0.7 });
    X.restore();
    this.dust(X, t, 0.5);
    const yy = 860 - 470 * up, sz = 300 - 150 * up;
    X.save(); H.shake(X, t, w(1) + 0.5, 12, 0.3);
    H.sheen(X, ctx.prog(t, w(1) + 0.5, w(1) + 1.3), Y => H.counter(ctx, t, { X: Y, from: 1960, to: 1985, s: w(0), dur: 0.75, x: 540, y: yy, size: sz, weight: 200, plain: true, shadow: Y === X }));
    X.restore();
    H.royal(ctx, t, 'الأوركسترا السيمفونية السلطانية', 540, 640, { times: [w(4), w(5), w(6)], size: 92, maxWidth: 880, dur: 0.45 });
    H.rule(X, t, w(6) + 0.3, 540, 850, 300, { h: 3 });
    H.chip(ctx, t, 'كل عازفينها عُمانيين', 540, 980, { s: w(7), size: 54 });
    rail(ctx, X, t, 0, { alpha: 1 - up });
  },
});
