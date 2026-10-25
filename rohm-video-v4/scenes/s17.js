// 4 · TRANSFORMING HALL · «فتحة المسرح ترتفع، وحفرة الأوركسترا تطلع لفوق، والصفّين الأماميين ينزلون تحت الأرض…
//   ودار الأوبرا اللي فيها ألف ومية مقعد، تصير قاعة حفلات كلاسيكية.» — each move happens on its word
import * as H from '../lib.js';
import { diagram } from './s16.js';
const { C } = H;
MOTION.scene({
  id: 's17', transition: H.T.cross(0.3),
  draw(t, lt, ctx) {
    const { X, E } = ctx, a = i => H.W(ctx, 'l17', i), b = i => H.W(ctx, 'l18', i);
    const lift = E.cubicInOut(ctx.prog(t, a(2) - 0.1, a(2) + 0.7)), pit = E.cubicInOut(ctx.prog(t, a(5) - 0.1, a(6) + 0.5)), sink = E.cubicInOut(ctx.prog(t, a(9) - 0.1, a(11) + 0.4));
    const concert = ctx.prog(t, b(7), b(10) + 0.4), z = 1 + 0.025 * E.sineInOut(ctx.prog(lt, 0, ctx.scene.dur));
    H.cover(X, ctx.img('hall_2'), { z: 1.2, filter: 'brightness(.5) saturate(.9)' });
    H.shade(X, { all: 0.5 });
    X.save(); X.translate(540, 900); X.scale(z, z); X.translate(-540, -900);
    diagram(ctx, X, { a: 1, shell: 1 - 0.0 * concert, lift, pit, sink, concert });
    // motion arrows on the moving parts
    const arrow = (x, y, dir, k) => { if (k <= 0 || k >= 1) return; X.save(); X.globalAlpha = Math.sin(Math.PI * k); X.fillStyle = C.lg; X.translate(x, y); X.scale(1, dir); X.beginPath(); X.moveTo(-18, 10); X.lineTo(0, -16); X.lineTo(18, 10); X.closePath(); X.fill(); X.restore(); };
    X.translate(540, 840); X.scale(1.05, 1.05); X.translate(-540, -900);     // same frame as diagram()
    arrow(383, 760 - 110 * lift - 30, 1, ctx.prog(t, a(2) - 0.1, a(2) + 0.9));
    arrow(461, 1150 - 130 * pit - 40, 1, ctx.prog(t, a(5) - 0.1, a(6) + 0.7));
    arrow(593, 1120 + 140 * sink - 70, -1, ctx.prog(t, a(9) - 0.1, a(11) + 0.6));
    X.restore();
    // labels on their words (above the diagram, below the counters)
    H.chip(ctx, t, 'فتحة المسرح ترتفع', 540, 520, { s: a(0), size: 50, out: a(3) - 0.1 });
    H.chip(ctx, t, 'حفرة الأوركسترا تطلع', 540, 520, { s: a(3), size: 50, out: a(7) - 0.1 });
    H.chip(ctx, t, 'الصفّين الأماميين ينزلون', 540, 520, { s: a(7), size: 50, out: b(0) - 0.1 });
    // seats: 1,100 (opera) → 850 (concert hall)
    const cIn = ctx.at(t, b(4) - 0.2, b(4) + 0.2);
    if (cIn > 0) {
      const down = E.cubicInOut(ctx.prog(t, b(7) + 0.1, b(9)));
      X.save(); X.globalAlpha = cIn;
      H.counter(ctx, t, { from: 0, to: 1100, s: b(4) - 0.05, dur: 0.9, x: 540, y: 380, size: 190, weight: 200, alpha: 1 - down });
      H.counter(ctx, t, { from: 1100, to: 850, s: b(7) + 0.1, dur: 0.9, x: 540, y: 380, size: 190, weight: 200, alpha: down, color: C.lg });
      X.restore();
      ctx.text(X, 'مقعد · أوبرا', 540, 455, { family: 'Cairo', weight: 800, size: 46, color: C.ivory, alpha: cIn * (1 - down) });
      ctx.text(X, 'مقعد · قاعة حفلات', 540, 455, { family: 'Cairo', weight: 800, size: 46, color: C.ivory, alpha: down });
    }
    H.flash(X, t, b(8), { a: 0.3, dur: 0.3 });
  },
});
