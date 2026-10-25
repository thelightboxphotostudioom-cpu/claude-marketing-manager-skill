// 5 · ROYAL ORGAN · «وفيه أصوات خاصة سمّوها الصولو الملكي… تكريماً للسلطان قابوس.» — engraved gold reveal
import * as H from '../lib.js';
const { C } = H;
MOTION.scene({
  id: 's20', transition: H.T.leak(0.8),
  setup(ctx) { this.dust = H.dust(ctx, 20, 70); },
  draw(t, lt, ctx) {
    const { X, FX } = ctx, w = i => H.W(ctx, 'l21', i);
    H.kb(X, ctx.img('organ_3'), t, ctx.scene.start - 0.4, 5, { fx: 0.5, fy: 0.6, z: 1.15 }, { fx: 0.5, fy: 0.4, z: 1.35 }, { filter: 'brightness(.55) saturate(1.2)' });
    H.shade(X, { all: 0.25, top: 0.6, bottom: 0.6 });
    FX.lightRays(ctx, t, { s: w(4) - 0.2, n: 14, power: 0.45, color: C.lg, spin: 3 });
    this.dust(X, t, 0.8);
    H.words(ctx, t, 'أصوات خاصة', 540, 420, { times: [w(1), w(2)], size: 110, out: w(4) - 0.15 });
    H.sheen(X, ctx.prog(t, w(5) + 0.3, w(6) + 0.3), Y => H.royal(ctx, t, 'الصولو الملكي', 540, 760, { X: Y, times: [w(4), w(5)], size: 170, dur: 0.6 }), { width: 150 });
    ctx.text(X, 'ROYAL  SOLO', 540, 900, { family: 'Inter', weight: 300, size: 66, color: C.lg, letterSpacing: 18, alpha: ctx.at(t, w(5), w(5) + 0.5), shadow: { blur: 16, y: 5, color: 'rgba(0,0,0,.6)' } });
    H.rule(X, t, w(5) + 0.2, 540, 960, 420, { h: 3 });
    H.royal(ctx, t, 'تكريماً للسلطان قابوس', 540, 1090, { times: [w(6), w(7), w(8)], size: 80, color: C.ivory, engrave: false, dur: 0.5 });
  },
});
