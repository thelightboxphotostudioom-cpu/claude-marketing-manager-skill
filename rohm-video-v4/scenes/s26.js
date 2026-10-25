// 8 · TODAY · «واليوم، في ذكراها الخامسة عشرة: ثمانية وعشرين عرض على ثلاث وأربعين ليلة.» — gold laurel draws around 15
import * as H from '../lib.js';
const { C } = H;
function leaf(X, x, y, ang, s, k) { if (k <= 0) return; X.save(); X.translate(x, y); X.rotate(ang); X.scale(k, k); X.beginPath(); X.moveTo(0, 0); X.quadraticCurveTo(s * 0.5, -s * 0.32, s, 0); X.quadraticCurveTo(s * 0.5, s * 0.32, 0, 0); X.fillStyle = C.gold; X.fill(); X.restore(); }
MOTION.scene({
  id: 's26', transition: H.T.leak(0.8),
  setup(ctx) { this.dust = H.dust(ctx, 26, 60); },
  draw(t, lt, ctx) {
    const { X, E } = ctx, w = i => H.W(ctx, 'l27', i), cx = 540, cy = 720, R = 250, wk = E.cubicInOut(ctx.prog(t, w(2) - 0.1, w(4) + 0.4));
    H.backdrop(X, t, { cy: 760, inner: '#33230F' });
    this.dust(X, t, 0.7);
    // laurel: two branches drawn from the bottom up, leaves sprout along them
    [-1, 1].forEach(sd => {
      const a0 = Math.PI / 2 + sd * 0.25, a1 = Math.PI / 2 + sd * 2.6;
      X.save(); X.strokeStyle = C.gold; X.lineWidth = 5; X.beginPath();
      for (let i = 0; i <= 40 * wk; i++) { const a = a0 + (a1 - a0) * i / 40; X[i ? 'lineTo' : 'moveTo'](cx + Math.cos(a) * R, cy + Math.sin(a) * R); }
      X.stroke(); X.restore();
      for (let i = 0; i < 14; i++) { const u = (i + 0.5) / 14, a = a0 + (a1 - a0) * u, k = E.expoOut(cl((wk - u) * 6)); const px = cx + Math.cos(a) * R, py = cy + Math.sin(a) * R, tang = a + sd * Math.PI / 2;
        leaf(X, px, py, tang - sd * 0.6, 44, k); leaf(X, px, py, tang - sd * 2.2, 38, k); }
    });
    H.words(ctx, t, 'واليوم', 540, 330, { times: [w(0)], size: 96, weight: 900 });
    X.save(); H.shake(X, t, w(3) + 0.3, 12, 0.3);
    H.sheen(X, ctx.prog(t, w(4), w(4) + 0.8), Y => H.counter(ctx, t, { X: Y, from: 1, to: 15, s: w(3) - 0.1, dur: 0.6, x: cx, y: cy + 110, size: 300, weight: 200, plain: true, shadow: Y === X }), { width: 130 });
    X.restore();
    ctx.text(X, 'الذكرى', 540, cy - 150, { family: 'Cairo', weight: 800, size: 46, color: C.ivory, alpha: ctx.at(t, w(2), w(2) + 0.3) });
    // 28 عرض · 43 ليلة (right → left)
    H.counter(ctx, t, { from: 0, to: 28, s: w(5) - 0.05, dur: 0.6, x: 730, y: 1170, size: 150, weight: 200, suffix: 'عرض', suffixSize: 52, suffixGap: 75 });
    const dk = ctx.at(t, w(8), w(8) + 0.3); X.save(); X.globalAlpha = dk; X.translate(540, 1120); X.rotate(Math.PI / 4); X.fillStyle = C.gold; X.fillRect(-9, -9, 18, 18); X.restore();
    H.counter(ctx, t, { from: 0, to: 43, s: w(9) - 0.05, dur: 0.6, x: 350, y: 1170, size: 150, weight: 200, suffix: 'ليلة', suffixSize: 52, suffixGap: 75 });
  },
});
const cl = (v) => Math.max(0, Math.min(1, v));
