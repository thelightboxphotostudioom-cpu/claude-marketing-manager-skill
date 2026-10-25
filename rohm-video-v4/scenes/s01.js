// HOOK · «سنة ألفين وواحد…» — black, then 2001 slams in gold with a light sweep
import * as H from '../lib.js';
const { C } = H;
MOTION.scene({
  id: 's01',
  setup(ctx) { H.installCaptions(ctx); this.dust = H.dust(ctx, 11, 70); },
  draw(t, lt, ctx) {
    const { X, E, at } = ctx, hit = 0.03;
    X.fillStyle = '#000'; X.fillRect(0, 0, 1080, 1920);
    const warm = 0.25 + 0.75 * at(t, hit, hit + 0.8, 'cubicOut');
    X.save(); X.globalAlpha = warm; H.backdrop(X, t, { cy: 880, r: 1000, inner: '#3A2712', latticeAlpha: 0.07 }); X.restore();
    this.dust(X, t, warm);
    X.save(); H.shake(X, t, hit, 22, 0.4);
    const k = E.expoOut(ctx.prog(t, hit, hit + 0.28)), s = 1.45 - 0.45 * k;
    X.translate(540, 860); X.scale(s, s); X.translate(-540, -860);
    if (t >= hit) H.sheen(X, ctx.prog(t, 0.3, 1.1), Y => H.counter(ctx, t, { X: Y, from: 2001, to: 2001, s: hit, x: 540, y: 980, size: 360, weight: 200, plain: true, color: C.lg, shadow: Y === X }), { width: 120 });
    X.restore();
    H.rule(X, t, 0.45, 540, 1060, 520, { h: 4 });
    H.flash(X, t, hit, { a: 0.9, dur: 0.4 });
  },
});
