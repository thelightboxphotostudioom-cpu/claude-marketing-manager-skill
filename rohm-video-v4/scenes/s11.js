// 2 · ARCHITECTURE · «والبناء بدأ سنة ألفين وسبعة على ثمانين ألف متر مربع في شاطئ القرم.»
import * as H from '../lib.js';
const { C } = H;
MOTION.scene({
  id: 's11', transition: H.T.whip(0.4, 1),
  draw(t, lt, ctx) {
    const { X, E } = ctx, w = i => H.W(ctx, 'l11', i), plot = E.expoInOut(ctx.prog(t, w(5) - 0.15, w(6) + 0.2));
    H.depth(X, ctx.img('ext_day_2'), t, ctx.scene.start, 5.2, { fx: 0.55, fy: 0.5, z: 1.1 }, { fx: 0.45, fy: 0.55, z: 1.3 }, { split: 0.66 });
    H.shade(X, { top: 0.8, topH: 1000, bottom: 0.45, all: 0.35 * plot });
    // 2007 + chip
    const out07 = ctx.prog(t, w(5) - 0.2, w(5) + 0.1);
    X.save(); X.globalAlpha = 1 - out07;
    H.counter(ctx, t, { from: 1995, to: 2007, s: w(2), dur: 0.55, x: 540, y: 640, size: 280, weight: 200, plain: true });
    X.restore();
    H.chip(ctx, t, 'بدء البناء', 540, 330, { s: w(0), size: 58, out: w(5) - 0.2 });
    // land plot outline on the lawn + 80,000 m²
    if (plot > 0) {
      const q = [[160, 1210], [930, 1180], [1010, 1010], [90, 1040]];
      X.save(); X.setLineDash([22, 14]); X.lineDashOffset = -t * 60; X.strokeStyle = C.lg; X.lineWidth = 5;
      X.beginPath(); q.forEach(([x, y], i) => X[i ? 'lineTo' : 'moveTo'](540 + (x - 540) * plot, 1110 + (y - 1110) * plot)); X.closePath(); X.stroke();
      X.setLineDash([]); X.globalAlpha = 0.18 * plot; X.fillStyle = C.gold; X.fill(); X.restore();
      H.counter(ctx, t, { from: 0, to: 80000, s: w(6), dur: 1.1, x: 540, y: 620, size: 190, weight: 200, suffix: 'متر مربع', suffixSize: 60, suffixGap: 105 });
    }
    // pin + شاطئ القرم
    const pk = E.expoOut(ctx.prog(t, w(11) - 0.1, w(11) + 0.3));
    if (pk > 0) {
      X.save(); X.translate(540, 900 - (1 - pk) * 60); X.globalAlpha = pk; X.fillStyle = C.gold;
      X.beginPath(); X.arc(0, -40, 30, Math.PI, 0); X.lineTo(0, 10); X.closePath(); X.fill(); X.beginPath(); X.arc(0, -40, 12, 0, 6.283); X.fillStyle = C.bg; X.fill(); X.restore();
    }
    H.chip(ctx, t, 'شاطئ القرم', 540, 960, { s: w(11), size: 52 });
  },
});
