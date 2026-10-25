// 7 · OPENING NIGHT · «رُفع الستار على توراندوت، بإخراج زيفيريلّي، وقيادة بلاسيدو دومينغو…» — curtain opens on a spotlit stage
import * as H from '../lib.js';
const { C } = H;
MOTION.scene({
  id: 's23', transition: H.T.cut,
  setup(ctx) { this.dust = H.dust(ctx, 23, 80); },
  draw(t, lt, ctx) {
    const { X, E } = ctx, w = i => H.W(ctx, 'l24', i), open = E.cubicInOut(ctx.prog(t, w(0) - 0.05, w(1) + 0.55));
    // stage behind: real stage photo, warm spot
    H.kb(X, ctx.img('hall_3'), t, w(0), 5.5, { fx: 0.5, fy: 0.42, z: 1.55 }, { fx: 0.5, fy: 0.45, z: 1.35 }, { filter: 'brightness(.6) saturate(1.15)' });
    H.shade(X, { all: 0.3, top: 0.6, bottom: 0.6 });
    const sw = Math.sin(t * 0.9) * 120;
    H.beam(X, 300, 0, 540 + sw, 1300, 260, 0.35 * open); H.beam(X, 800, 0, 540 - sw, 1300, 240, 0.3 * open);
    this.dust(X, t, open);
    X.save(); H.shake(X, t, w(3), 10, 0.3);
    H.sheen(X, ctx.prog(t, w(3) + 0.4, w(4) + 0.3), Y => H.royal(ctx, t, 'توراندوت', 540, 720, { X: Y, times: [w(3)], size: 230, dur: 0.5 }), { width: 170 });
    X.restore();
    H.chip(ctx, t, 'إخراج زيفيريلّي', 540, 920, { s: w(4), size: 54 });
    H.chip(ctx, t, 'قيادة بلاسيدو دومينغو', 540, 1050, { s: w(6), size: 54 });
    if (open < 1) H.curtain(X, t, open, { spot: 0.8 * (1 - open) });
    H.flash(X, t, w(0), { a: 0.35, dur: 0.4 });
  },
});
