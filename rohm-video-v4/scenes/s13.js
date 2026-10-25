// 2 · ARCHITECTURE · «أروقتها وأبراجها مستوحاة من قلاع نخل وبهلاء.» — split screen ROHM | fort, one gold arch traced across both
import * as H from '../lib.js';
const { C } = H;
const archD = (x, w, top, base) => `M ${x - w / 2} ${base} L ${x - w / 2} ${top + w * 0.55} Q ${x - w / 2} ${top} ${x} ${top - w * 0.18} Q ${x + w / 2} ${top} ${x + w / 2} ${top + w * 0.55} L ${x + w / 2} ${base}`;
MOTION.scene({
  id: 's13', transition: H.T.flash(0.3),
  draw(t, lt, ctx) {
    const { X, E } = ctx, w = i => H.W(ctx, 'l13', i), s0 = ctx.scene.start;
    const inR = E.expoOut(ctx.prog(lt, 0, 0.5)), inL = E.expoOut(ctx.prog(lt, 0.12, 0.62)), bahla = E.expoInOut(ctx.prog(t, w(6) - 0.05, w(6) + 0.3));
    X.fillStyle = C.bg; X.fillRect(0, 0, 1080, 1920);
    X.save(); X.translate((1 - inR) * 540, 0); H.kb(X, ctx.img('arcade_2'), t, s0, 3.8, { fx: 0.5, fy: 0.6, z: 1.15 }, { fx: 0.5, fy: 0.5, z: 1.3 }, { rect: [540, 150, 540, 1150] }); X.restore();
    X.save(); X.translate(-(1 - inL) * 540, 0);
    H.kb(X, ctx.img('fort_1'), t, s0, 3.8, { fx: 0.58, fy: 0.55, z: 1.0 }, { fx: 0.58, fy: 0.5, z: 1.12 }, { rect: [0, 150, 540, 1150] });
    if (bahla > 0) { X.save(); X.beginPath(); X.rect(0, 150 + 1150 * (1 - bahla), 540, 1150 * bahla); X.clip(); H.kb(X, ctx.img('fort_2'), t, w(6), 1, { fx: 0.62, fy: 0.45, z: 1.0 }, { fx: 0.6, fy: 0.45, z: 1.06 }, { rect: [0, 150, 540, 1150] }); X.restore(); }
    X.restore();
    H.shade(X, { top: 0.6, topH: 520 });
    X.fillStyle = C.gold; X.fillRect(538, 150, 4, 1150 * E.expoOut(ctx.prog(lt, 0.2, 0.7)));
    X.fillRect(0, 1298, 1080 * E.expoOut(ctx.prog(lt, 0.2, 0.7)), 4);
    // matching arch traced on both halves
    const ak = E.cubicInOut(ctx.prog(t, w(2) - 0.1, w(2) + 0.8));
    [270, 810].forEach(x => ctx.drawPath(X, archD(x, 200, 560, 1000), ak, { width: 6, color: C.lg, tip: { r: 8, color: '#FFF4DC' } }));
    H.chip(ctx, t, 'أروقة', 760, 300, { s: w(0), size: 54 });
    H.chip(ctx, t, 'أبراج', 320, 300, { s: w(1), size: 54 });
    H.chip(ctx, t, 'دار الأوبرا', 810, 1210, { s: w(4) - 0.2, size: 44 });
    H.chip(ctx, t, 'قلعة نخل', 270, 1210, { s: w(5), size: 44, out: w(6) - 0.05 });
    H.chip(ctx, t, 'قلعة بهلاء', 270, 1210, { s: w(6) + 0.05, size: 44 });
  },
});
