// 8 · STARS · «من بعدها وقف على خشبتها أندريا بوتشيلّي، ويو-يو ما، ورينيه فليمنغ…» — names flash under a spotlight
import * as H from '../lib.js';
const { C } = H;
MOTION.scene({
  id: 's25', transition: H.T.star(0.75, [540, 860]),
  draw(t, lt, ctx) {
    const { X, E } = ctx, w = i => H.W(ctx, 'l26', i);
    H.kb(X, ctx.img('hall_1'), t, ctx.scene.start - 0.3, 5.6, { fx: 0.45, fy: 0.55, z: 1.25 }, { fx: 0.55, fy: 0.5, z: 1.45 }, { filter: 'brightness(.5)' });
    H.shade(X, { all: 0.3, top: 0.6, bottom: 0.6 });
    H.words(ctx, t, 'وقف على خشبتها', 540, 380, { times: [w(2), w(3), w(4)], size: 88, weight: 800, color: C.ivory });
    const names = [['أندريا بوتشيلّي', w(5)], ['يو-يو ما', w(7)], ['رينيه فليمنغ', w(9)]];
    let cur = -1; names.forEach((n, i) => { if (t >= n[1] - 0.08) cur = i; });
    names.forEach(([n, at], i) => {
      if (i > cur) return;
      if (i === cur) {                                 // the current name: big, gold, settles from 1.12
        const k = E.expoOut(ctx.prog(t, at - 0.08, at + 0.25)), s = 1.12 - 0.12 * k;
        X.save(); X.translate(540, 720); X.scale(s, s); X.translate(-540, -720);
        ctx.text(X, n, 540, 760, { family: 'Cairo', weight: 900, size: 124, color: C.lg, alpha: k, maxWidth: 920, shadow: { blur: 24, y: 8, color: 'rgba(0,0,0,.7)' } });
        X.restore();
        H.flash(X, t, at - 0.05, { a: 0.35, dur: 0.25 });
      } else {                                         // earlier names stack underneath, smaller
        const k = E.cubicOut(ctx.prog(t, names[i + 1][1] - 0.08, names[i + 1][1] + 0.25));
        ctx.text(X, n, 540, 960 + (cur - i - 1) * 80, { family: 'Cairo', weight: 800, size: 54, color: C.ivory, alpha: 0.8 * k, shadow: { blur: 14, y: 4, color: 'rgba(0,0,0,.6)' } });
      }
    });
    const sx = cur === 1 ? 640 : cur === 2 ? 440 : 540;
    H.beam(X, sx, 0, 540, 900, 300, cur >= 0 ? 0.25 : 0);
  },
});
