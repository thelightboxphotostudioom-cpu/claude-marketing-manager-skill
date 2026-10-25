// 3 · INTERIOR · «ورخام إيطالي، وثريات من الكريستال النمساوي.» — marble staircase, crystal twinkles
import * as H from '../lib.js';
const { C } = H;
MOTION.scene({
  id: 's15', transition: H.T.leak(0.7),
  setup(ctx) { const r = ctx.seeded(15); this.tw = Array.from({ length: 34 }, () => ({ x: 120 + r() * 840, y: 260 + r() * 700, d: r() * 1.2, s: 10 + r() * 22 })); },
  draw(t, lt, ctx) {
    const { X } = ctx, w = i => H.W(ctx, 'l15', i);
    H.kb(X, ctx.img('foyer_2'), t, ctx.scene.start - 0.3, 3.8, { fx: 0.5, fy: 0.75, z: 1.2 }, { fx: 0.5, fy: 0.45, z: 1.1 });
    H.shade(X, { top: 0.55, topH: 700, bottom: 0.45 });
    H.chip(ctx, t, 'رخام إيطالي', 540, 330, { s: w(0), size: 60 });
    H.chip(ctx, t, 'كريستال نمساوي', 540, 480, { s: w(4), size: 60 });
    const s0 = w(2);                                 // twinkles start with «وثريات»
    X.save(); X.globalCompositeOperation = 'lighter';
    this.tw.forEach(p => { const k = (t - s0 - p.d) / 0.7; if (k <= 0 || k >= 1) return; const a = Math.sin(Math.PI * k), r = p.s * a;
      X.fillStyle = H.rgba('#FFF6E0', 0.9 * a); X.beginPath(); X.moveTo(p.x, p.y - r); X.lineTo(p.x + r * 0.16, p.y - r * 0.16); X.lineTo(p.x + r, p.y); X.lineTo(p.x + r * 0.16, p.y + r * 0.16); X.lineTo(p.x, p.y + r); X.lineTo(p.x - r * 0.16, p.y + r * 0.16); X.lineTo(p.x - r, p.y); X.lineTo(p.x - r * 0.16, p.y - r * 0.16); X.closePath(); X.fill(); });
    X.restore();
  },
});
