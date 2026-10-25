// s7 — 12.10.2011: الستارة المخملية تُغلق، يظهر التاريخ عليها، ثم «رُفعَ الستار»
import { stage, curtains, kicker, reveal, frame, dust, TRANS, GOLD, HI, IVORY } from './lib.js';
MOTION.scene({ id: 's7', transition: { type: TRANS.curtainIn, dur: 1.0 },
  draw(t, lt, ctx) {
    const { X, at } = ctx, w = ctx.wordsOf('l7');
    const op = at(t, w[7].s - 0.15, w[7].s + 1.6, 'cubicInOut');
    stage(ctx, X, t, { k: op });
    // revealed title on stage
    reveal(ctx, X, 'رُفِعَ الستار', 540, 1000, { t, family: 'display', weight: 700, size: 170, color: GOLD, rise: 80, dur: 0.9 }, [w[7].s + 0.35, w[8].s + 0.3]);
    kicker(ctx, X, 'ليلة الافتتاح', 1130, at(t, w[8].s + 0.3, w[8].e + 0.8), { size: 40 });
    dust(ctx, X, t, op, 50);
    // curtain with the date stitched in gold
    X.save(); curtains(X, 1080, 1920, op, 1); X.restore();
    const da = 1 - at(t, w[7].s - 0.3, w[7].s + 0.3);
    if (da > 0) {
      X.save(); X.globalAlpha = da * at(lt, 0.45, 1.1);
      X.fillStyle = 'rgba(20,4,6,.72)'; X.strokeStyle = GOLD; X.lineWidth = 2; X.beginPath(); X.roundRect(250, 560, 580, 860, 30); X.fill(); X.stroke();
      kicker(ctx, X, 'ليلة لا تُنسى', 660, at(lt, 0.6, 1.4), { size: 40, color: HI, len: 60 });
      const T = [w[1].s, w[3].s, w[5].s];
      const parts = ['12', '10', '2011'];
      parts.forEach((p, i) => { const k = at(t, T[i] - 0.05, T[i] + 0.5, 'expoOut'); ctx.text(X, p, 540, 860 + i * 190, { family: 'num', weight: 200, size: i === 2 ? 190 : 150, color: i === 2 ? HI : IVORY, dir: 'ltr', alpha: k }); });
      X.globalAlpha = da * at(t, w[3].s, w[3].s + 0.4); X.fillStyle = GOLD;
      for (const y of [905, 1095]) { X.beginPath(); X.moveTo(540, y - 8); X.lineTo(548, y); X.lineTo(540, y + 8); X.lineTo(532, y); X.closePath(); X.fill(); }
      X.restore();
    }
    frame(ctx, X, 1, { alpha: 0.7 });
  } });
