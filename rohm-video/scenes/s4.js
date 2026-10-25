// s4 — حلم سلطان عشق الموسيقى: مدرج موسيقي ذهبي يتموّج ونوتات تولد مع الكلمات
import { bg, reveal, wt, frame, push, h01, GOLD, HI, IVORY } from './lib.js';
MOTION.scene({ id: 's4',
  draw(t, lt, ctx) {
    const { X, at } = ctx, w = ctx.wordsOf('l4');
    bg(ctx, X, t, { cy: 960, inner: '#2F1F10' });
    X.save(); push(ctx, X, lt, 0.04);
    // five-line staff, gently waving
    const k = at(lt, 0.0, 1.8, 'cubicInOut'), sy = 1080, gap = 26;
    const yAt = (x, j) => sy + j * gap + Math.sin(x * 0.006 + t * 0.9) * 40 + Math.sin(x * 0.013 - t * 0.6) * 12;
    for (let j = 0; j < 5; j++) {
      const pts = []; for (let x = 60; x <= 1020; x += 20) pts.push([x, yAt(x, j)]);
      ctx.drawPath(X, pts, ctx.clamp(k * 1.15 - j * 0.04), { width: 1.8, color: GOLD });
    }
    // notes appear on every spoken word
    w.forEach((ww, i) => {
      const kk = at(t, ww.s, ww.s + 0.45, 'expoOut'); if (kk <= 0) return;
      const x = 940 - i * 92, j = Math.floor(h01(i, 9) * 8) / 2, y = yAt(x, 0) + j * gap - gap / 2;
      X.save(); X.globalAlpha = kk; X.translate(x, y + (1 - kk) * 30); X.rotate(-0.35);
      X.fillStyle = i % 3 === 2 ? HI : GOLD; X.beginPath(); X.ellipse(0, 0, 17, 12, 0, 0, 6.2832); X.fill(); X.restore();
      X.save(); X.globalAlpha = kk; X.strokeStyle = GOLD; X.lineWidth = 3; X.beginPath(); X.moveTo(x + 15, y + (1 - kk) * 30); X.lineTo(x + 15, y - 90 * kk); X.stroke();
      if (i % 2 === 0) { X.beginPath(); X.moveTo(x + 15, y - 90 * kk); X.quadraticCurveTo(x + 40, y - 60 * kk, x + 34, y - 30 * kk); X.stroke(); }
      X.restore();
    });
    X.restore();
    reveal(ctx, X, 'حُلمُ سلطانٍ', 540, 520, { t, family: 'display', weight: 700, size: 150, color: IVORY, rise: 70 }, [w[0].s, w[1].s]);
    reveal(ctx, X, 'عشقَ الموسيقى', 540, 720, { t, family: 'display', weight: 700, size: 150, color: GOLD, rise: 70 }, [w[2].s, w[3].s]);
    reveal(ctx, X, 'منبرٌ لعُمان… للفنِّ الرفيع', 540, 1380, { t, size: 54, weight: 500, color: HI }, [w[6].s, w[5].s, w[7].s, w[8].s]);
    frame(ctx, X, 1, { alpha: 0.7 });
  } });
