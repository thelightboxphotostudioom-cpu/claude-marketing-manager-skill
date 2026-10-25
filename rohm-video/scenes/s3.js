// s3 — 2001: الأمر السامي. أرقام تدور كعدّاد، وسكة زمن بالأسفل
import { bg, kicker, reveal, wt, rollNumber, rail, frame, push, GOLD, HI, IVORY, MUT } from './lib.js';
MOTION.scene({ id: 's3',
  draw(t, lt, ctx) {
    const { X, at } = ctx, w = ctx.wordsOf('l3');
    bg(ctx, X, t, { cy: 640 });
    X.save(); push(ctx, X, lt, 0.03);
    kicker(ctx, X, 'البداية', 330, at(lt, 0.2, 1.0));
    rollNumber(ctx, X, '2001', 540, 640, at(t, w[2].s - 0.4, w[4].e, 'cubicInOut'), { size: 300, weight: 200, color: IVORY });
    // gold underline drawn under the year
    ctx.drawPath(X, [[330, 700], [750, 700]], at(t, w[4].s, w[4].e + 0.4, 'expoOut'), { width: 3, color: GOLD });
    reveal(ctx, X, 'أمرٌ سامٍ بإنشاء دار الأوبرا', 540, 840, { t, size: 54, weight: 500, color: IVORY }, [w[5].s, w[6].s, w[7].s, w[7].s + 0.15, w[7].s + 0.3]);
    // the Sultan's name in Ruqaa, revealed word by word
    reveal(ctx, X, 'السلطان قابوس بن سعيد', 540, 1010, { t, family: 'display', weight: 700, size: 112, color: GOLD, rise: 60 }, [w[7].s, w[8].s, w[9].s, w[10].s]);
    reveal(ctx, X, 'طيّب الله ثراه', 540, 1120, { t, size: 40, weight: 400, color: MUT }, [w[11].s, w[12].s, w[13].s]);
    X.restore();
    rail(ctx, X, t, lt, 0, { y: 1340 });
    frame(ctx, X, 1, { alpha: 0.7 });
  } });
