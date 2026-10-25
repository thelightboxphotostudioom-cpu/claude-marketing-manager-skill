// s8 — توراندوت لبوتشيني: عنوان العرض الافتتاحي + بطاقات الإخراج والقيادة
import { stage, kicker, reveal, frame, dust, star8, GOLD, HI, IVORY, MUT } from './lib.js';
function credit(ctx, X, role, ar, en, y, k) {
  if (k <= 0) return; const e = ctx.E.expoOut(k);
  X.save(); X.globalAlpha = e; X.translate(0, (1 - e) * 40);
  X.strokeStyle = 'rgba(201,163,92,.6)'; X.lineWidth = 1.5; X.strokeRect(150, y - 95, 780, 175);
  X.fillStyle = 'rgba(13,10,7,.55)'; X.fillRect(151, y - 94, 778, 173);
  ctx.text(X, role, 540, y - 45, { family: 'body', weight: 500, size: 32, color: GOLD });
  ctx.text(X, ar, 540, y + 25, { family: 'display', weight: 700, size: 70, color: IVORY });
  ctx.text(X, en, 540, y + 62, { family: 'num', weight: 300, size: 22, color: MUT, dir: 'ltr', letterSpacing: 6 });
  X.restore();
}
MOTION.scene({ id: 's8',
  draw(t, lt, ctx) {
    const { X, at } = ctx, w = ctx.wordsOf('l8');
    stage(ctx, X, t, { k: 1 });
    dust(ctx, X, t, 0.8, 50);
    kicker(ctx, X, 'العرض الافتتاحي', 330, at(lt, 0.1, 0.9));
    const k = at(t, w[1].s - 0.1, w[1].s + 0.9, 'expoOut');
    X.save(); X.translate(540, 520); const s = 0.92 + 0.08 * k; X.scale(s, s); X.translate(-540, -520);
    ctx.text(X, 'توراندوت', 540, 560, { family: 'display', weight: 700, size: 220, color: IVORY, alpha: k });
    X.restore();
    ctx.text(X, 'TURANDOT', 540, 640, { family: 'num', weight: 300, size: 34, color: GOLD, dir: 'ltr', letterSpacing: 20 * k, alpha: k });
    reveal(ctx, X, 'جاكومو بوتشيني', 540, 740, { t, size: 50, weight: 500, color: HI }, [w[2].s, w[2].s + 0.15]);
    credit(ctx, X, 'إخراج', 'فرانكو زيفيريلّي', 'FRANCO ZEFFIRELLI', 1010, at(t, w[3].s, w[3].s + 0.7));
    credit(ctx, X, 'قيادة', 'بلاسيدو دومينغو', 'PLÁCIDO DOMINGO', 1240, at(t, w[6].s, w[6].s + 0.7));
    frame(ctx, X, 1, { alpha: 0.7 });
  } });
