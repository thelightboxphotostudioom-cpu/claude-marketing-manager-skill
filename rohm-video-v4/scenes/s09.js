// 1 · DREAM · «وكان يبي لهالحلم بيت يليق فيه… بيت لأهل عُمان، وللإنسانية كلها.» — notes become the façade line drawing
import * as H from '../lib.js';
import { note } from './s07.js';
import { rail } from './s08.js';
const { C } = H;
const B = 1060;                                       // façade baseline
function teeth(x0, x1, y, n) { const p = [], w = (x1 - x0) / (2 * n - 1); for (let i = 0; i < 2 * n - 1; i++) { const a = x0 + i * w, b = a + w, h = i % 2 ? 0 : -16; p.push([a, y + h], [b, y + h]); } return p; }
function facade() {
  return [[100, B], [100, 930], [235, 930], [235, 760], ...teeth(235, 315, 760, 3), [315, 760], [315, 860], [460, 860], [460, 680], ...teeth(460, 620, 680, 5), [620, 680], [620, 860],
    [765, 860], [765, 760], ...teeth(765, 845, 760, 3), [845, 760], [845, 930], [980, 930], [980, B], [100, B]];
}
function archD(x, w, top) { return `M ${x - w / 2} ${B} L ${x - w / 2} ${top + w * 0.55} Q ${x - w / 2} ${top} ${x} ${top - w * 0.15} Q ${x + w / 2} ${top} ${x + w / 2} ${top + w * 0.55} L ${x + w / 2} ${B}`; }
MOTION.scene({
  id: 's09', transition: H.T.cross(0.5),
  setup(ctx) { this.dust = H.dust(ctx, 9, 45); this.f = facade(); this.arches = [340, 410, 480, 540, 600, 670, 740].map(x => archD(x, 46, 990)); this.win = [500, 540, 580].map(x => archD(x, 22, 740).replaceAll(`${B}`, '800')); },
  draw(t, lt, ctx) {
    const { X, E } = ctx, w = i => H.W(ctx, 'l09', i), s0 = ctx.scene.start;
    H.backdrop(X, t, { cy: 900, inner: '#2E200F' });
    this.dust(X, t, 0.6);
    // notes fly into the drawing
    for (let i = 0; i < 9; i++) { const k = E.cubicInOut(ctx.prog(lt, 0.05 + i * 0.05, 0.75 + i * 0.05)), x0 = 980 - i * 100, y0 = 1020, x1 = 140 + i * 100, y1 = 900;
      if (k < 1) note(X, ctx.lerp(x0, x1, k), ctx.lerp(y0, y1, k) - 120 * Math.sin(Math.PI * k), 1 - 0.6 * k, 1 - k); }
    const dk = E.cubicInOut(ctx.prog(lt, 0.35, 2.3));
    ctx.drawPath(X, this.f, dk, { width: 5, color: C.gold, tip: { r: 7, color: C.lg } });
    this.arches.forEach((d, i) => ctx.drawPath(X, d, E.cubicOut(ctx.prog(lt, 1.2 + i * 0.12, 1.8 + i * 0.12)), { width: 4, color: C.lg }));
    this.win.forEach((d, i) => ctx.drawPath(X, d, E.cubicOut(ctx.prog(lt, 1.9 + i * 0.1, 2.4 + i * 0.1)), { width: 3, color: C.lg }));
    const glow = ctx.at(lt, 2.3, 3.0); if (glow > 0) { X.save(); X.globalAlpha = 0.18 * glow; X.fillStyle = C.gold; X.beginPath(); this.f.forEach(([x, y], i) => X[i ? 'lineTo' : 'moveTo'](x, y)); X.fill(); X.restore(); }
    H.words(ctx, t, 'بيت يليق فيه', 540, 1215, { times: [w(3), w(4), w(5)], size: 78, weight: 800, color: C.ivory, out: w(6) - 0.2, shadow: false });
    H.royal(ctx, t, 'لأهل عُمان…', 540, 400, { times: [w(7), w(8)], size: 110, dur: 0.5 });
    H.royal(ctx, t, 'وللإنسانية كلها', 540, 545, { times: [w(9), w(10)], size: 110, dur: 0.55, color: C.ivory });
    rail(ctx, X, t, E.cubicInOut(ctx.prog(t, w(9), w(10) + 0.4)), { alpha: ctx.at(t, w(6) - 0.1, w(6) + 0.3), y: 1225 });
  },
});
