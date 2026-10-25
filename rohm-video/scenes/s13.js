// s13 — أوّل دار في العالم بشاشات تفاعلية في ظهر المقاعد: صفوف مقاعد بمنظور، الشاشات تضيء تباعاً + ختم ذهبي
import { bg, kicker, reveal, frame, star8, TRANS, GOLD, HI, IVORY, MUT, CRIMSON } from './lib.js';
function seat(X, x, y, s, lit, t, i) {
  X.save(); X.translate(x, y); X.scale(s, s);
  X.fillStyle = '#5E121A'; X.beginPath(); X.roundRect(-60, -150, 120, 160, 22); X.fill();          // back
  X.fillStyle = '#7E1822'; X.beginPath(); X.roundRect(-52, -142, 104, 120, 18); X.fill();
  X.fillStyle = '#3C0A10'; X.fillRect(-66, 10, 132, 26);                                        // seat edge
  X.fillStyle = GOLD; X.fillRect(-62, -152, 124, 6);
  // screen on the seat back
  X.fillStyle = '#0B0806'; X.beginPath(); X.roundRect(-34, -118, 68, 44, 6); X.fill();
  if (lit > 0) {
    X.globalAlpha = lit; X.fillStyle = '#F3E2BC'; X.beginPath(); X.roundRect(-31, -115, 62, 38, 4); X.fill();
    X.fillStyle = '#7E1822'; for (let k = 0; k < 3; k++) X.fillRect(-24, -108 + k * 10, 48 - ((i + k) % 3) * 10, 4);
  }
  X.restore();
}
MOTION.scene({ id: 's13', transition: { type: TRANS.starIris, dur: 0.9 },
  draw(t, lt, ctx) {
    const { X, at } = ctx, w = ctx.wordsOf('l13');
    bg(ctx, X, t, { cy: 1100, inner: '#24160D', lattice: false });
    const lightT = w[5].s;
    // rows in perspective (back rows first)
    for (let r = 4; r >= 0; r--) {
      const s = 0.55 + r * 0.17, y = 1000 + r * 95, n = 7 - Math.min(r, 2), gap = 150 * s;
      for (let i = 0; i < n; i++) {
        const x = 540 + (i - (n - 1) / 2) * gap, lit = at(t, lightT + (4 - r) * 0.18 + Math.abs(i - (n - 1) / 2) * 0.12, lightT + 0.5 + (4 - r) * 0.18 + Math.abs(i - (n - 1) / 2) * 0.12);
        seat(X, x, y, s, lit, t, i + r);
      }
    }
    // stamp: "first in the world"
    const sk = at(t, w[1].s - 0.1, w[1].s + 0.5, 'expoOut');
    if (sk > 0) {
      X.save(); X.translate(540, 560); const sc = 1.25 - 0.25 * sk; X.scale(sc, sc); X.rotate(-0.08 * (1 - sk)); X.globalAlpha = sk;
      star8(X, 0, 0, 230, Math.PI / 8 + lt * 0.05, { stroke: GOLD, width: 2 });
      X.strokeStyle = GOLD; X.lineWidth = 4; X.beginPath(); X.arc(0, 0, 175, 0, 6.2832); X.stroke(); X.lineWidth = 1.5; X.beginPath(); X.arc(0, 0, 160, 0, 6.2832); X.stroke();
      ctx.text(X, 'أوّل دار', 0, -10, { family: 'display', weight: 700, size: 92, color: IVORY });
      ctx.text(X, 'في العالم', 0, 80, { family: 'display', weight: 700, size: 72, color: GOLD });
      X.restore();
    }
    reveal(ctx, X, 'شاشاتٌ تفاعلية في ظهر المقاعد', 540, 850, { t, size: 50, weight: 600, color: HI }, [w[6].s, w[7].s, w[8].s, w[9].s, w[10].s]);
    frame(ctx, X, 1, { alpha: 0.7 });
  } });
