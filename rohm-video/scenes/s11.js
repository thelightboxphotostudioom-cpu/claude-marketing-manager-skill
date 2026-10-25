// s11 — قاعة تتحوّل: 850 مقعداً للأوبرا ← 1,050 للحفلات (مخطط علوي على شكل حدوة)
import { bg, kicker, reveal, frame, GOLD, HI, IVORY, MUT, CRIMSON } from './lib.js';
MOTION.scene({ id: 's11',
  setup() {
    // horseshoe rows facing a stage at the top; first 850 = opera layout, +200 = concert extension
    const cx = 540, cy = 620, row = (R, a0, a1, sp, r) => { const n = Math.floor((a1 - a0) * R / sp), o = []; for (let i = 0; i < n; i++) { const a = a0 + (a1 - a0) * (i + 0.5) / n; o.push({ x: cx + Math.cos(a) * R * 0.86, y: cy + Math.sin(a) * R * 0.92, r }); } return o; };
    let all = []; for (let r = 0; r < 20; r++) all = all.concat(row(250 + 20 * r, Math.PI * 0.12, Math.PI * 0.88, 18, r));
    this.opera = all.slice(0, 850);
    let inner = []; for (let r = 0; r < 5; r++) inner = inner.concat(row(140 + 20 * r, Math.PI * 0.2, Math.PI * 0.8, 16, -1));
    this.extra = inner.concat(all.slice(850)).slice(0, 200);
  },
  draw(t, lt, ctx) {
    const { X, at } = ctx, w = ctx.wordsOf('l11');
    bg(ctx, X, t, { cy: 900, lattice: false });
    kicker(ctx, X, 'القاعة الكبرى', 250, at(lt, 0.1, 0.9));
    const sw = at(t, w[9].s - 0.2, w[11].e, 'cubicInOut');            // hydraulic switch
    // stage + proscenium (moves back as it converts)
    const sy = 450 - 70 * sw;
    X.save(); X.fillStyle = 'rgba(126,24,34,.75)'; X.strokeStyle = GOLD; X.lineWidth = 2;
    X.beginPath(); X.moveTo(340, sy - 120); X.lineTo(740, sy - 120); X.lineTo(700, sy); X.lineTo(380, sy); X.closePath(); X.fill(); X.stroke();
    ctx.text(X, 'المسرح', 540, sy - 45, { family: 'body', weight: 600, size: 30, color: HI });
    X.restore();
    // opera seats appear row by row
    const ap = at(t, w[0].s, w[3].e + 0.5, 'cubicOut');
    X.save();
    this.opera.forEach((s, i) => { const k = ctx.clamp(ap * 1.3 - s.r / 17 * 0.3 - (i % 50) / 50 * 0.02); if (k <= 0) return; X.globalAlpha = k; X.fillStyle = s.r < 3 ? HI : '#A8362F'; X.beginPath(); X.arc(s.x, s.y + (1 - k) * 20, 5.5, 0, 6.2832); X.fill(); });
    this.extra.forEach((s, i) => { const k = ctx.clamp(sw * 1.6 - (i / 200) * 0.6); if (k <= 0) return; X.globalAlpha = k; X.fillStyle = GOLD; X.beginPath(); X.arc(s.x, s.y, 5.5 * k, 0, 6.2832); X.fill(); });
    X.restore();
    // counter
    const n = Math.round(ctx.lerp(850 * ctx.clamp(ap * 1.1), 1050, sw));
    const lab = sw > 0.5 ? 'مقعداً للحفلات' : 'مقعداً للأوبرا';
    ctx.text(X, ctx.num(n), 540, 1310, { family: 'num', weight: 200, size: 160, color: sw > 0.5 ? HI : IVORY, dir: 'ltr', alpha: at(t, w[5].s - 0.3, w[5].s + 0.3) });
    ctx.text(X, lab, 540, 1392, { family: 'body', weight: 500, size: 46, color: IVORY, alpha: at(t, w[7].s, w[7].s + 0.4) });
    // hydraulic badge
    const hk = at(t, w[3].s, w[3].s + 0.6, 'expoOut');
    if (hk > 0) { X.save(); X.globalAlpha = hk; X.strokeStyle = GOLD; X.lineWidth = 2; X.beginPath(); X.roundRect(340, 1425, 400, 58, 29); X.stroke();
      ctx.text(X, 'تحويل هيدروليكي', 540, 1465, { family: 'body', weight: 600, size: 32, color: GOLD }); X.restore(); }
    frame(ctx, X, 1, { alpha: 0.7 });
  } });
