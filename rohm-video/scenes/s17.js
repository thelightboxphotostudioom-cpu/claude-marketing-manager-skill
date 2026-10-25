// s17 — دار لا تكتفي بالعروض: شبكة أجيال تتسع من المركز (برامج تعليمية ومجتمعية)
import { bg, reveal, frame, star8, h01, GOLD, HI, IVORY, MUT } from './lib.js';
MOTION.scene({ id: 's17',
  setup() {
    this.nodes = []; for (let r = 1; r <= 5; r++) { const n = 6 * r + 2; for (let i = 0; i < n; i++) { const a = i / n * 6.2832 + r * 0.4; this.nodes.push({ r, a, R: r * 92, j: h01(i, r) }); } }
  },
  draw(t, lt, ctx) {
    const { X, at } = ctx, w = ctx.wordsOf('l18'), cx = 540, cy = 1080;
    bg(ctx, X, t, { cy, lattice: false });
    reveal(ctx, X, 'دارٌ لا تكتفي بالعروض', 540, 420, { t, family: 'display', weight: 700, size: 112, color: IVORY, rise: 60 }, [w[0].s, w[1].s, w[2].s, w[3].s]);
    const g = at(t, w[4].s - 0.3, w[9].e, 'cubicOut');
    // centre: a small gilded star (the House)
    X.save(); X.translate(cx, cy); X.rotate(lt * 0.2); star8(X, 0, 0, 34 * ctx.clamp(g * 4), Math.PI / 8, { fill: GOLD }); X.restore();
    X.save();
    this.nodes.forEach((n, i) => {
      const k = ctx.clamp(g * 1.6 - (n.r - 1) * 0.15 - n.j * 0.1); if (k <= 0) return;
      const a = n.a + t * 0.04 * (n.r % 2 ? 1 : -1), R = n.R * ctx.E.expoOut(k), x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R * 0.9;
      X.globalAlpha = k * 0.35; X.strokeStyle = GOLD; X.lineWidth = 1; X.beginPath(); X.moveTo(cx + Math.cos(a) * (R - 92), cy + Math.sin(a) * (R - 92) * 0.9); X.lineTo(x, y); X.stroke();
      X.globalAlpha = k; X.fillStyle = n.r <= 2 ? HI : (n.j > 0.5 ? GOLD : IVORY); X.beginPath(); X.arc(x, y, 5 + (5 - n.r) * 1.2, 0, 6.2832); X.fill();
    });
    X.restore();
    reveal(ctx, X, 'برامجُ تعليميةٌ ومجتمعية', 540, 560, { t, size: 54, weight: 600, color: GOLD }, [w[4].s, w[5].s, w[6].s]);
    reveal(ctx, X, 'تصنعُ جيلاً يعشقُ الفن', 540, 1600 - 120, { t, size: 58, weight: 500, color: IVORY, colorAt: i => i >= 2 ? HI : null }, [w[7].s, w[8].s, w[9].s, w[10].s]);
    frame(ctx, X, 1, { alpha: 0.7 });
  } });
