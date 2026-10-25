// HOOK · «وأرغن وزنه خمسين طن يمشي على سكة» — organ photo rises in pipe strips, 50 طن slams, it rolls on gold rails
import * as H from '../lib.js';
const { C } = H;
MOTION.scene({
  id: 's05', transition: H.T.flash(0.3),
  draw(t, lt, ctx) {
    const { X, E } = ctx, img = ctx.img('organ_1'), w = i => H.W(ctx, 'l05', i), roll = E.cubicInOut(ctx.prog(t, w(4), w(6) + 0.4));
    X.fillStyle = C.bg; X.fillRect(0, 0, 1080, 1920);
    const n = 12, cardY = 590, cardH = 620, dx = -260 * roll;
    for (let i = 0; i < n; i++) {                   // strips rise like pipes, staggered from the centre out
      const d = Math.abs(i - (n - 1) / 2), k = E.expoOut(ctx.prog(lt, 0.02 + d * 0.035, 0.5 + d * 0.035)), sw = 900 / n;
      const x = 90 + i * sw + dx, hh = cardH * k;
      X.save(); X.beginPath(); X.rect(x, cardY + cardH - hh, sw + 0.8, hh); X.clip();
      H.kb(X, img, t, ctx.scene.start, 3.2, { fx: 0.5, fy: 0.55, z: 1 }, { fx: 0.5, fy: 0.45, z: 1.08 }, { rect: [90 + dx, cardY, 900, cardH] });
      X.restore();
    }
    X.strokeStyle = C.gold; X.lineWidth = 3; X.strokeRect(90 + dx, cardY, 900, cardH * E.expoOut(ctx.prog(lt, 0.3, 0.8)));
    // rails
    const rk = E.expoOut(ctx.prog(t, w(4) - 0.2, w(4) + 0.4));
    if (rk > 0) {
      X.save(); X.globalAlpha = rk; X.fillStyle = C.gold;
      X.fillRect(540 - 520 * rk, 1234, 1040 * rk, 6); X.fillRect(540 - 520 * rk, 1266, 1040 * rk, 6);
      for (let i = -12; i <= 12; i++) { const x = 540 + i * 44 + ((dx % 44) + 44) % 44; if (Math.abs(x - 540) < 520 * rk) X.fillRect(x - 5, 1228, 10, 48); }
      X.restore();
      [200, 880].forEach(x => { X.save(); X.translate(x + dx, 1222); X.rotate(-roll * 6); X.beginPath(); X.arc(0, 0, 22, 0, 6.283); X.fillStyle = C.bg; X.fill(); X.lineWidth = 6; X.strokeStyle = C.lg; X.stroke(); X.fillStyle = C.lg; X.fillRect(-2, -22, 4, 44); X.restore(); });
    }
    H.shade(X, { top: 0.7, topH: 560 });
    X.save(); H.shake(X, t, w(2), 16, 0.35);
    H.counter(ctx, t, { from: 0, to: 50, s: w(2) - 0.05, dur: 0.45, x: 540, y: 400, size: 250, weight: 200 });
    ctx.text(X, 'طن', 540, 500, { family: 'Cairo', weight: 900, size: 84, color: C.ivory, alpha: ctx.at(t, w(3) - 0.05, w(3) + 0.15) });
    X.restore();
    H.flash(X, t, w(2), { a: 0.45, dur: 0.3 });
  },
});
