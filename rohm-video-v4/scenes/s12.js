// 2 · ARCHITECTURE · «الواجهة من حجر وردة الصحراء العُماني…» — arcade close-up, rose swatch, shimmer over the stone
import * as H from '../lib.js';
const { C } = H;
MOTION.scene({
  id: 's12', transition: H.T.zoom(0.4),
  draw(t, lt, ctx) {
    const { X, E } = ctx, w = i => H.W(ctx, 'l12', i);
    H.kb(X, ctx.img('arcade_1'), t, ctx.scene.start - 0.2, 3, { fx: 0.4, fy: 0.55, z: 1.35 }, { fx: 0.55, fy: 0.5, z: 1.15 }, { filter: 'saturate(1.1) sepia(.12)' });
    H.shade(X, { top: 0.75, topH: 800, bottom: 0.4, warm: 0.2 });
    H.sweep(X, ctx.prog(t, w(3), w(5) + 0.3), [0, 400, 1080, 1100], { width: 220, alpha: 0.35 });
    H.words(ctx, t, 'الواجهة', 540, 330, { times: [w(0)], size: 84, weight: 800 });
    const sk = E.expoOut(ctx.prog(t, w(2), w(2) + 0.4));
    if (sk > 0) { X.save(); X.translate(540, 520); X.scale(sk, sk); X.beginPath(); X.arc(0, 0, 62, 0, 6.283); X.fillStyle = C.rose; X.fill(); X.lineWidth = 5; X.strokeStyle = C.gold; X.stroke(); X.restore(); }
    H.chip(ctx, t, 'حجر وردة الصحراء', 540, 680, { s: w(3), size: 60 });
    H.words(ctx, t, 'العُماني', 540, 830, { times: [w(5)], size: 70, weight: 800, color: C.lg });
  },
});
