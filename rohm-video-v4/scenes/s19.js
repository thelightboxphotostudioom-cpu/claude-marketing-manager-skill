// 5 · ROYAL ORGAN · «وسبعين مفتاح صوت، ووزنه حوالي خمسين طن… ويتحرك على سكة.»
import * as H from '../lib.js';
const { C } = H;
MOTION.scene({
  id: 's19', transition: H.T.whip(0.4, 1),
  draw(t, lt, ctx) {
    const { X, E } = ctx, w = i => H.W(ctx, 'l20', i), roll = E.cubicInOut(ctx.prog(t, w(7) - 0.1, w(9) + 0.5));
    H.backdrop(X, t, { cy: 900 });
    // 70 stop knobs light up in sequence
    const sk = ctx.prog(t, w(0) - 0.1, w(2) + 0.3), fade = 1 - ctx.prog(t, w(3) - 0.2, w(3) + 0.2);
    if (fade > 0) for (let i = 0; i < 70; i++) {
      const c = i % 10, r = Math.floor(i / 10), x = 540 + (c - 4.5) * 84, y = 690 + r * 84, on = sk * 70 > i;
      X.save(); X.globalAlpha = fade; X.beginPath(); X.arc(x, y, 30, 0, 6.283); X.fillStyle = on ? C.lg : 'rgba(201,163,92,.12)'; X.fill(); X.lineWidth = 3; X.strokeStyle = C.gold; X.stroke();
      if (on) { X.beginPath(); X.arc(x, y, 12, 0, 6.283); X.fillStyle = C.bg; X.fill(); } X.restore();
    }
    H.counter(ctx, t, { from: 0, to: 70, s: w(0) - 0.05, dur: w(2) - w(0) + 0.2, x: 540, y: 470, size: 220, weight: 200, alpha: fade });
    ctx.text(X, 'مفتاح صوت', 540, 575, { family: 'Cairo', weight: 900, size: 70, color: C.ivory, alpha: fade * ctx.at(t, w(1) - 0.05, w(1) + 0.2) });
    // organ card on rails, ~50 tons
    const cin = E.expoOut(ctx.prog(t, w(3) - 0.2, w(3) + 0.3));
    if (cin > 0) {
      const dx = -240 * roll + (1 - cin) * 600;
      X.save(); X.globalAlpha = cin;
      H.cover(X, ctx.img('organ_2'), { rect: [130 + dx, 660, 820, 540], fx: 0.5, fy: 0.42, z: 1.6 });
      X.strokeStyle = C.gold; X.lineWidth = 3; X.strokeRect(130 + dx, 660, 820, 540);
      X.fillStyle = C.gold; X.fillRect(40, 1226, 1000, 6); X.fillRect(40, 1256, 1000, 6);
      for (let i = -1; i < 25; i++) { const x = 40 + ((i * 44 + dx) % 1000 + 1000) % 1000; X.fillRect(x, 1220, 8, 44); }
      [250, 830].forEach(x => { X.save(); X.translate(x + dx, 1214); X.rotate(-roll * 5); X.beginPath(); X.arc(0, 0, 20, 0, 6.283); X.fillStyle = C.bg; X.fill(); X.lineWidth = 6; X.strokeStyle = C.lg; X.stroke(); X.fillStyle = C.lg; X.fillRect(-2, -20, 4, 40); X.restore(); });
      X.restore();
      X.save(); H.shake(X, t, w(5) + 0.3, 12, 0.3);
      H.chip(ctx, t, 'حوالي', 540, 330, { s: w(4), size: 44 });
      H.counter(ctx, t, { from: 0, to: 50, s: w(5) - 0.05, dur: 0.45, x: 540, y: 500, size: 200, weight: 200 });
      ctx.text(X, 'طن', 540, 590, { family: 'Cairo', weight: 900, size: 70, color: C.ivory, alpha: ctx.at(t, w(6) - 0.05, w(6) + 0.15) });
      X.restore();
    }
  },
});
