// 5 · ROYAL ORGAN · «والأرغن… صنعته كلايس الألمانية. أربعة آلاف وخمسمية واثنين وأربعين أنبوب،»
import * as H from '../lib.js';
const { C } = H;
MOTION.scene({
  id: 's18', transition: H.T.star(0.75, [540, 860]),
  draw(t, lt, ctx) {
    const { X, E } = ctx, w = i => H.W(ctx, 'l19', i), cut = w(2) - 0.1;
    if (t < cut + 0.3) H.kb(X, ctx.img('organ_2'), t, ctx.scene.start - 0.3, 1.9, { fx: 0.5, fy: 0.55, z: 1.0 }, { fx: 0.5, fy: 0.4, z: 1.55 });
    if (t >= cut) {                                    // crane bottom → top over the pipes while the count runs
      X.save(); X.globalAlpha = E.cubicOut(ctx.prog(t, cut, cut + 0.3));
      H.kb(X, ctx.img('organ_1'), t, cut, ctx.scene.end - cut + 0.3, { fx: 0.5, fy: 0.95, z: 1.5 }, { fx: 0.5, fy: 0.15, z: 1.35 }, { filter: 'saturate(1.1)' });
      X.restore();
    }
    H.shade(X, { top: 0.8, topH: 950, bottom: 0.5 });
    H.words(ctx, t, 'الأرغن', 540, 380, { times: [w(0)], size: 120, out: cut });
    X.save(); X.globalAlpha = ctx.at(t, cut, cut + 0.35) * (1 - ctx.prog(t, w(4) - 0.2, w(4)));
    ctx.text(X, 'KLAIS', 540, 420, { family: 'Inter', weight: 300, size: 130, color: C.lg, letterSpacing: 28, shadow: { blur: 20, y: 6, color: 'rgba(0,0,0,.6)' } });
    X.restore();
    H.chip(ctx, t, 'ألمانيا', 540, 540, { s: w(3), size: 52, out: w(4) - 0.15 });
    H.counter(ctx, t, { from: 0, to: 4542, s: w(4), dur: w(9) - w(4), x: 540, y: 470, size: 230, weight: 200 });
    ctx.text(X, 'أنبوب', 540, 580, { family: 'Cairo', weight: 900, size: 80, color: C.ivory, alpha: ctx.at(t, w(9) - 0.05, w(9) + 0.15), shadow: { blur: 16, y: 5, color: 'rgba(0,0,0,.6)' } });
    H.flash(X, t, w(9), { a: 0.3 });
  },
});
