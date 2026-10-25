// s15 — +90,000 زائر كل عام، ثم ألوان العروض تتوالى كبطاقات ذهبية
import { bg, kicker, reveal, frame, GOLD, HI, IVORY, MUT } from './lib.js';
function chip(ctx, X, str, x, y, k, big) {
  if (k <= 0) return; const e = ctx.E.expoOut(k), size = big ? 54 : 46;
  X.save(); X.font = ctx.F('body', 600, size); const w = X.measureText(str).width + 80; X.restore();
  X.save(); X.globalAlpha = e; X.translate(x, y + (1 - e) * 40); X.scale(0.94 + 0.06 * e, 0.94 + 0.06 * e);
  X.fillStyle = big ? 'rgba(201,163,92,.18)' : 'rgba(13,10,7,.65)'; X.strokeStyle = GOLD; X.lineWidth = 2;
  X.beginPath(); X.roundRect(-w / 2, -size * 1.05, w, size * 1.6, size * 0.8); X.fill(); X.stroke();
  ctx.text(X, str, 0, 0, { family: 'body', weight: 600, size, color: big ? HI : IVORY }); X.restore();
}
MOTION.scene({ id: 's15',
  draw(t, lt, ctx) {
    const { X, at } = ctx, a = ctx.wordsOf('l15'), b = ctx.wordsOf('l16');
    bg(ctx, X, t, { cy: 700 });
    const up = at(t, b[0].s - 0.4, b[0].s + 0.4, 'cubicInOut');       // number lifts when genres arrive
    const ny = 760 - 300 * up, sc = 1 - 0.3 * up;
    kicker(ctx, X, 'جمهورٌ لا يهدأ', 330 - 60 * up, at(lt, 0.1, 0.9) * (1 - up));
    const ck = at(t, a[0].s, a[4].e, 'cubicOut');
    X.save(); X.translate(540, ny); X.scale(sc, sc);
    ctx.text(X, '+' + ctx.num(Math.round(90000 * ck)), 0, 0, { family: 'num', weight: 200, size: 230, color: IVORY, dir: 'ltr', alpha: ctx.clamp(ck * 5) });
    ctx.text(X, 'زائرٍ كلَّ عام', 0, 110, { family: 'body', weight: 500, size: 56, color: GOLD, alpha: at(t, a[4].s, a[4].s + 0.5) });
    X.restore();
    // ring of progress under the number (before genres)
    X.save(); X.globalAlpha = 1 - up; X.strokeStyle = 'rgba(201,163,92,.25)'; X.lineWidth = 3; X.beginPath(); X.arc(540, 1150, 220, 0, 6.2832); X.stroke();
    X.strokeStyle = GOLD; X.lineWidth = 6; X.beginPath(); X.arc(540, 1150, 220, -Math.PI / 2, -Math.PI / 2 + 6.2832 * ck); X.stroke();
    ctx.text(X, 'سنوياً', 540, 1170, { family: 'display', weight: 700, size: 80, color: HI, alpha: ck }); X.restore();
    // genres
    const G = [['أوبرا', 0, 720, 800], ['باليه', 1, 380, 920], ['موسيقى عربية', 2, 660, 1050], ['جاز', 4, 360, 1180], ['عروضٌ للعائلة', 5, 560, 1330]];
    G.forEach(([s, wi, x, y]) => chip(ctx, X, s, x, y, at(t, b[wi].s - 0.08, b[wi].s + 0.6), wi === 5));
    frame(ctx, X, 1, { alpha: 0.7 });
  } });
