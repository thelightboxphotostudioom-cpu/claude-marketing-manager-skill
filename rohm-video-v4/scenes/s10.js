// 2 · ARCHITECTURE · «التصميم فاز بمسابقة دولية سنة ألفين وثلاثة»
import * as H from '../lib.js';
const { C } = H;
MOTION.scene({
  id: 's10', transition: H.T.star(0.75, [540, 900]),
  draw(t, lt, ctx) {
    const { X } = ctx, w = i => H.W(ctx, 'l10', i);
    H.depth(X, ctx.img('ext_day_1'), t, ctx.scene.start - 0.4, 4.6, { fx: 0.62, fy: 0.42, z: 1.05 }, { fx: 0.5, fy: 0.42, z: 1.18 }, { split: 0.7, depth: 1.2 });
    H.shade(X, { top: 0.8, topH: 1000, bottom: 0.5 });
    H.words(ctx, t, 'التصميم', 540, 330, { times: [w(0)], size: 84, weight: 800, color: C.ivory });
    H.chip(ctx, t, 'مسابقة دولية', 540, 470, { s: w(2), size: 58 });
    X.save(); H.shake(X, t, w(4) + 0.45, 12, 0.3);
    H.sheen(X, ctx.prog(t, w(5) + 0.2, w(5) + 1.0), Y => H.counter(ctx, t, { X: Y, from: 1990, to: 2003, s: w(4), dur: 0.55, x: 540, y: 800, size: 280, weight: 200, plain: true, shadow: Y === X }));
    X.restore();
    H.flash(X, t, w(4) + 0.5, { a: 0.35 });
  },
});
