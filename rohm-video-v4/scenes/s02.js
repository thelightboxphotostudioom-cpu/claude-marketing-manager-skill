// HOOK · «أمر السلطان قابوس، طيّب الله ثراه» — the name is written in gold Ruqaa, slow dignified push-in
import * as H from '../lib.js';
const { C } = H;
MOTION.scene({
  id: 's02', transition: H.T.flash(0.3),
  setup(ctx) { this.dust = H.dust(ctx, 22, 55); },
  draw(t, lt, ctx) {
    const { X, FX, at } = ctx, z = 1 + 0.06 * at(lt, 0, ctx.scene.dur + 0.4, 'sineInOut');
    X.save(); X.translate(540, 900); X.scale(z, z); X.translate(-540, -900);
    H.backdrop(X, t, { cy: 880, r: 950, inner: '#33230F', latticeAlpha: 0.05 });
    X.save(); X.globalAlpha = 0.16 * at(lt, 0, 0.6); X.strokeStyle = C.gold; X.lineWidth = 3;
    H.starPath(X, 540, 900, 430, t * 0.05); X.stroke(); H.starPath(X, 540, 900, 400, t * 0.05); X.stroke(); X.restore();
    this.dust(X, t, 0.8);
    FX.qalamWrite(ctx, t, { text: 'السلطان قابوس بن سعيد', s: H.W(ctx, 'l02', 1) - 0.12, x: 540, y: 905, size: 150, per: 0.045, lift: 0.025, color: C.lg });
    H.rule(X, t, H.W(ctx, 'l02', 3) - 0.1, 540, 975, 420, { h: 3 });
    H.royal(ctx, t, 'طيّب الله ثراه', 540, 1090, { s: H.W(ctx, 'l02', 3), times: [H.W(ctx, 'l02', 3), H.W(ctx, 'l02', 4), H.W(ctx, 'l02', 5)], size: 74, color: C.ivory, engrave: false, dur: 0.5 });
    X.restore();
  },
});
