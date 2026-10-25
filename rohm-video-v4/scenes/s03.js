// HOOK · «ببناء مبنى ما له مثيل في الخليج» — Blender night aerial dive (Cycles/OptiX, 200 frames)
import * as H from '../lib.js';
const { C } = H;
MOTION.scene({
  id: 's03', transition: H.T.zoom(0.45),
  draw(t, lt, ctx) {
    const { X } = ctx, f = Math.max(1, Math.min(200, 1 + Math.floor((lt + 0.25) * 60 * 1.12)));
    X.drawImage(ctx.img('bl' + f), 0, 0, 1080, 1920);
    H.shade(X, { top: 0.55, topH: 620, bottom: 0.45, botH: 700, warm: 0.12 });
    const w = i => H.W(ctx, 'l03', i);
    H.words(ctx, t, 'ما له مثيل', 540, 380, { times: [w(2), w(3), w(4)], size: 150, weight: 900, accent: [2], out: ctx.scene.end - 0.1 });
    H.words(ctx, t, 'في الخليج', 540, 510, { times: [w(5), w(6)], size: 92, weight: 800, color: C.lg, out: ctx.scene.end - 0.1 });
  },
});
