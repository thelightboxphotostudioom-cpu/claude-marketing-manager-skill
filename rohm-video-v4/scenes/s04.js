// HOOK · «فيه قاعة تتحوّل بضغطة زر…» — real hall photo; a gold button press splits it into sliding wall panels
import * as H from '../lib.js';
const { C } = H;
MOTION.scene({
  id: 's04', transition: H.T.whip(0.4, 1),
  draw(t, lt, ctx) {
    const { X, E } = ctx, press = H.W(ctx, 'l04', 3), A = ctx.img('hall_1'), B = ctx.img('hall_2');
    const k = E.expoInOut(ctx.prog(t, press + 0.12, press + 0.75));
    H.kb(X, B, t, ctx.scene.start, 3, { fx: 0.5, z: 1.15 }, { fx: 0.45, z: 1.25 });
    const n = 6;                                    // panels of the first photo slide apart like moving walls
    for (let i = 0; i < n; i++) {
      const x0 = i * 180, dir = i < n / 2 ? -1 : 1, off = dir * k * (220 + 60 * Math.abs(i - 2.5));
      X.save(); X.beginPath(); X.rect(x0 + off, 0, 180, 1920); X.clip(); X.translate(off, 0);
      H.kb(X, A, t, ctx.scene.start, 3, { fx: 0.52, z: 1.05 }, { fx: 0.5, z: 1.2 });
      X.restore();
      if (k > 0 && k < 1) { X.fillStyle = H.rgba(C.gold, 0.9 * (1 - k)); X.fillRect(x0 + off - 2, 0, 4, 1920); }
    }
    H.shade(X, { top: 0.6, topH: 700, bottom: 0.4 });
    H.words(ctx, t, 'قاعة تتحوّل', 540, 400, { times: [H.W(ctx, 'l04', 1), H.W(ctx, 'l04', 2)], size: 140, accent: [1] });
    // the button
    const bk = ctx.at(t, press - 0.25, press, 'expoOut'), bp = ctx.prog(t, press, press + 0.12), down = bp > 0 && bp < 1 ? 0.88 : 1;
    if (bk > 0) {
      X.save(); X.translate(540, 900); X.globalAlpha = bk * (1 - ctx.prog(t, press + 0.6, press + 0.9)); X.scale(down * (0.94 + 0.06 * bk), down * (0.94 + 0.06 * bk));
      X.beginPath(); X.arc(0, 0, 92, 0, 6.283); X.fillStyle = 'rgba(13,10,7,.8)'; X.fill(); X.lineWidth = 6; X.strokeStyle = C.gold; X.stroke();
      X.beginPath(); X.arc(0, 0, 58, 0, 6.283); X.fillStyle = C.gold; X.fill();
      X.restore();
      const r = ctx.prog(t, press, press + 0.6); if (r > 0 && r < 1) { X.save(); X.globalAlpha = 1 - r; X.strokeStyle = C.lg; X.lineWidth = 5; X.beginPath(); X.arc(540, 900, 92 + 260 * E.expoOut(r), 0, 6.283); X.stroke(); X.restore(); }
    }
    H.flash(X, t, press, { a: 0.5, dur: 0.3 });
  },
});
