// s14 — على خشبتها: أسماء النجوم تتوالى تحت بقعة ضوء
import { stage, kicker, frame, dust, star8, GOLD, HI, IVORY, MUT } from './lib.js';
const STARS = [['أندريا بوتشيلّي', 'ANDREA BOCELLI', 2], ['خوسيه كاريراس', 'JOSÉ CARRERAS', 4], ['يوناس كاوفمان', 'JONAS KAUFMANN', 6], ['مارسيل خليفة', 'MARCEL KHALIFE', 8]];
MOTION.scene({ id: 's14',
  draw(t, lt, ctx) {
    const { X, at } = ctx, w = ctx.wordsOf('l14');
    stage(ctx, X, t, { k: 0.8 });
    dust(ctx, X, t, 0.8, 50);
    kicker(ctx, X, 'على خشبتها', 300, at(t, w[0].s, w[1].e));
    STARS.forEach(([ar, en, wi], i) => {
      const s = w[wi].s - 0.1, k = at(t, s, s + 0.8, 'expoOut'); if (k <= 0) return;
      const nxt = STARS[i + 1] ? w[STARS[i + 1][2]].s : 1e9, dim = 1 - 0.55 * at(t, nxt - 0.1, nxt + 0.5);
      const y = 520 + i * 230;
      X.save(); X.globalAlpha = k * dim; X.translate((1 - k) * -60, 0);
      star8(X, 540, y - 120, 14, Math.PI / 8 + t * 0.5, { fill: GOLD });
      ctx.text(X, ar, 540, y, { family: 'display', weight: 700, size: i === 3 ? 120 : 104, color: i === 3 ? GOLD : IVORY });
      ctx.text(X, en, 540, y + 52, { family: 'num', weight: 300, size: 26, color: MUT, dir: 'ltr', letterSpacing: 9 });
      X.restore();
    });
    frame(ctx, X, 1, { alpha: 0.7 });
  } });
