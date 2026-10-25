// 6 · SEAT SCREENS · «وكانت أول دار أوبرا بالعالم تحط شاشة تفاعلية في ظهر كل كرسي… تقرأ فيها ترجمة الأوبرا بلغتك.»
// 2D illustration: rows of velvet seat backs, camera pushes to one, its screen lights with Arabic + English lines
import * as H from '../lib.js';
const { C } = H;
function seat(X, x, y, s, lit, scr) {
  X.save(); X.translate(x, y); X.scale(s, s);
  const g = X.createLinearGradient(-90, 0, 90, 0); g.addColorStop(0, '#4A0A12'); g.addColorStop(0.5, '#9C2232'); g.addColorStop(1, '#4A0A12');
  X.fillStyle = g; X.beginPath(); X.roundRect(-90, -150, 180, 260, 40); X.fill();
  X.strokeStyle = C.gold; X.lineWidth = 4; X.stroke();
  X.fillStyle = '#1A0D08'; X.beginPath(); X.roundRect(-64, -96, 128, 74, 8); X.fill();      // screen bezel
  if (lit > 0) {
    X.globalAlpha = lit; X.fillStyle = '#10161E'; X.beginPath(); X.roundRect(-58, -90, 116, 62, 6); X.fill();
    if (scr) {
      X.save(); X.globalCompositeOperation = 'screen'; const g = X.createRadialGradient(0, -59, 10, 0, -59, 120); g.addColorStop(0, 'rgba(255,243,218,.35)'); g.addColorStop(1, 'rgba(255,243,218,0)'); X.fillStyle = g; X.fillRect(-130, -180, 260, 240); X.restore();
      X.fillStyle = C.gold; X.fillRect(-52, -85, 104, 4); X.fillStyle = 'rgba(243,233,216,.25)'; X.fillRect(-30, -24 - 6, 60, 2);
      scr(X);
    }
    X.globalAlpha = 1;
  }
  X.restore();
}
MOTION.scene({
  id: 's21', transition: H.T.star(0.75, [540, 860]),
  draw(t, lt, ctx) {
    const { X, E } = ctx, w = i => H.W(ctx, 'l22', i), zk = E.cubicInOut(ctx.prog(t, w(5) - 0.4, w(8))), z = 1 + 2.4 * zk;
    const lit = ctx.at(t, w(6), w(6) + 0.3), sub = ctx.prog(t, w(14) - 0.1, w(16) + 0.3);
    H.backdrop(X, t, { cy: 700, inner: '#2A0F0C', latticeAlpha: 0.04 });
    X.save(); X.translate(540, 960 - 100 * zk); X.scale(z, z); X.translate(-540, -(960 - 95 * zk));   // zoom onto the middle seat's screen
    for (let r = 0; r <= 3; r++) for (let c = -3; c <= 3; c++) {   // far rows first, near rows on top
      const s = 0.55 + r * 0.22, x = 540 + c * 205 * s, y = 760 + r * 150;
      const me = r === 1 && c === 0;
      seat(X, x, y, s, me ? lit : 0.35 * lit, me ? Y => {
        Y.save(); Y.beginPath(); Y.rect(-58, -90, 116, 62); Y.clip();
        ctx.text(Y, 'ترجمة بلغتك', 0, -62, { family: 'Cairo', weight: 800, size: 17, color: C.ivory, alpha: ctx.at(t, w(12), w(12) + 0.3) });
        ctx.text(Y, 'Subtitles in your language', 0, -40, { family: 'Inter', weight: 400, size: 9.5, color: C.lg, alpha: ctx.at(t, w(14), w(14) + 0.3) });
        Y.fillStyle = H.rgba(C.lg, 0.8); Y.fillRect(-40, -34, 80 * sub, 2); Y.restore();
      } : null);
    }
    X.restore();
    H.shade(X, { top: 0.7, topH: 700 });
    // stamp «الأولى في العالم»
    const sk = ctx.prog(t, w(1), w(1) + 0.25), sc = sk > 0 ? 1.25 - 0.25 * E.expoOut(sk) : 0;
    if (sk > 0) {
      X.save(); X.translate(540, 420); X.rotate(-0.08); X.scale(sc, sc); X.globalAlpha = Math.min(1, sk * 3);
      X.strokeStyle = C.lg; X.lineWidth = 6; X.beginPath(); X.roundRect(-320, -90, 640, 180, 18); X.stroke(); X.lineWidth = 2; X.beginPath(); X.roundRect(-304, -74, 608, 148, 12); X.stroke();
      ctx.text(X, 'الأولى في العالم', 0, 30, { family: 'Cairo', weight: 900, size: 96, color: C.lg });
      X.restore();
    }
    H.chip(ctx, t, 'شاشة تفاعلية', 540, 590, { s: w(6), size: 50 });
    H.chip(ctx, t, 'في ظهر كل كرسي', 540, 1240, { s: w(9), size: 46 });
    H.flash(X, t, w(1) + 0.05, { a: 0.3, dur: 0.25 });
  },
});
