// HOOK · «هذي دار الأوبرا السلطانية… وهذا اللي ما تعرفه عنها» — real night exterior, fast push-in, gold title (music drop)
import * as H from '../lib.js';
const { C } = H;
MOTION.scene({
  id: 's06', transition: H.T.zoom(0.4),
  draw(t, lt, ctx) {
    const { X, FX } = ctx, w = i => H.W(ctx, 'l06', i), img = ctx.img('ext_night_1');
    const pk = ctx.E.expoOut(ctx.prog(lt, 0, 1.2)), pk2 = ctx.prog(lt, 1.2, ctx.scene.dur + 0.3);
    H.cover(X, img, { fx: 0.53, fy: 0.47, z: 1.25 + 0.55 * pk + 0.12 * pk2, filter: 'saturate(1.25) contrast(1.08) brightness(1.15)' });
    H.shade(X, { top: 0.75, topH: 900, bottom: 0.55, warm: 0.25 });
    X.save(); H.shake(X, t, w(1), 10, 0.3);
    H.royal(ctx, t, 'دار الأوبرا السلطانية', 540, 560, { times: [w(1), w(2), w(3)], size: 132, maxWidth: 920, dur: 0.45 });
    X.restore();
    H.rule(X, t, w(3) + 0.1, 540, 760, 360, { h: 3 });
    ctx.text(X, 'مسقط', 540, 860, { family: 'Cairo', weight: 700, size: 64, color: C.ivory, alpha: ctx.at(t, w(3) + 0.15, w(3) + 0.5), shadow: { blur: 16, y: 5, color: 'rgba(0,0,0,.6)' } });
    H.sweep(X, ctx.prog(t, w(5) - 0.2, w(5) + 0.9), [0, 150, 1080, 1100], { width: 200, alpha: 0.25 });
    H.flash(X, t, w(1), { a: 0.6, dur: 0.35 });
  },
});
