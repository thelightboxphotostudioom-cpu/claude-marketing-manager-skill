// 3 · INTERIOR · «وفي الداخل… سقف من خشب الساج محفور باليد ومطلي بورق الذهب،» — foyer tilt, then the carved ceiling
import * as H from '../lib.js';
const { C } = H;
MOTION.scene({
  id: 's14', transition: H.T.star(0.75, [540, 800]),
  draw(t, lt, ctx) {
    const { X, E } = ctx, w = i => H.W(ctx, 'l14', i), cut = w(2) - 0.12;
    if (t < cut + 0.25) H.kb(X, ctx.img('foyer_1'), t, ctx.scene.start - 0.4, 1.8, { fx: 0.5, fy: 0.75, z: 1.25 }, { fx: 0.5, fy: 0.42, z: 1.18 });
    if (t >= cut) {
      X.save(); X.globalAlpha = E.cubicOut(ctx.prog(t, cut, cut + 0.25));
      H.depth(X, ctx.img('foyer_3'), t, cut, 4.4, { fx: 0.5, fy: 0.85, z: 1.12 }, { fx: 0.5, fy: 0.2, z: 1.2 }, { split: 0.7, fgDir: -1 });
      X.restore();
    }
    H.shade(X, { top: 0.7, topH: 800, bottom: 0.45 });
    H.words(ctx, t, 'وفي الداخل…', 540, 360, { times: [w(0), w(1)], size: 110, out: cut });
    H.chip(ctx, t, 'خشب الساج محفور باليد', 540, 340, { s: w(4), size: 56 });
    H.sweep(X, ctx.prog(t, w(9) - 0.1, w(10) + 0.6), [0, 150, 1080, 1150], { width: 240, alpha: 0.5, op: 'lighter' });
    H.chip(ctx, t, 'ورق الذهب', 540, 480, { s: w(9), size: 56 });
    H.flash(X, t, cut, { a: 0.35, dur: 0.25 });
  },
});
