// s2 — العنوان: «دار الأوبرا السلطانية» بخط الرقعة الذهبي ونجمة عمانية تدور
import { bg, star8, star8Draw, kicker, frame, GOLD, HI, IVORY } from './lib.js';
MOTION.scene({ id: 's2',
  draw(t, lt, ctx) {
    const { X, at } = ctx;
    bg(ctx, X, t, { cy: 900, inner: '#3A2614' });
    const w = ctx.wordsOf('l2');
    // rotating ornament behind the title
    X.save(); X.globalAlpha = 0.28;
    star8Draw(ctx, X, 540, 900, 470, lt * 0.08, at(lt, 0, 1.6, 'cubicInOut'), { width: 2 });
    X.globalAlpha = 0.16; star8Draw(ctx, X, 540, 900, 380, -lt * 0.06 + Math.PI / 8, at(lt, 0.2, 1.8, 'cubicInOut'), { width: 1.5 });
    X.globalAlpha = 0.1; star8(X, 540, 900, 560, lt * 0.04, { stroke: GOLD, width: 1 });
    X.restore();
    const k1 = at(t, w[0].s - 0.1, w[0].s + 0.7, 'expoOut'), k2 = at(t, w[2].s - 0.1, w[2].s + 0.8, 'expoOut');
    const s1 = 0.94 + 0.06 * k1;
    X.save(); X.translate(540, 820); X.scale(s1, s1); X.translate(-540, -820);
    ctx.text(X, 'دارُ الأوبرا', 540, 820, { family: 'display', weight: 700, size: 190, color: IVORY, alpha: k1 });
    X.restore();
    X.save(); X.globalAlpha = k2;
    ctx.text.drawKashida(X, 'السلطانية', 540, 1040, 860, { family: 'display', weight: 700, size: 200, color: GOLD }, at(t, w[2].s + 0.1, w[2].e + 0.6, 'expoInOut'));
    X.restore();
    kicker(ctx, X, 'مسقط', 1210, at(t, w[3].s - 0.05, w[3].s + 0.6), { size: 64, len: 170, color: HI });
    frame(ctx, X, 1);
  } });
