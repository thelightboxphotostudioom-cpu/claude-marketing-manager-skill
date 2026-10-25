// CTA + FINALE · «احفظ الفيديو… وقول لنا: حضرت عرض فيها؟» → Blender pull-away, «حيث تلتقي عُمان بالعالم», photo credits
import * as H from '../lib.js';
const { C } = H;
const CREDITS = [
  'Photos: Wikimedia Commons — Karananand2 (CC0) · Ljuba brank · Taha Al-Hayali',
  'Andrew Moore · Khalidalbusaidi · Orientalist (CC BY-SA 2.0–4.0)',
  'Chief National Guard Bureau · Fabio Achilli (CC BY 2.0) · Ondřej Žváček (CC BY 2.5)',
];
MOTION.scene({
  id: 's27', transition: H.T.zoom(0.45),
  draw(t, lt, ctx) {
    const { X, E } = ctx, w = i => H.W(ctx, 'l28', i), voEnd = ctx.lineSpan('l28').e;
    // Blender hero played backwards = pull-away into the night
    const f = Math.max(1, Math.min(200, Math.round(200 - lt * 60 * 0.62)));
    X.drawImage(ctx.img('bl' + f), 0, 0, 1080, 1920);
    const endK = ctx.at(t, voEnd - 0.1, voEnd + 0.5);
    H.shade(X, { all: 0.55 * (1 - endK) + 0.15, top: 0.6, bottom: 0.65 });
    const out = ctx.prog(t, voEnd - 0.15, voEnd + 0.15);
    X.save(); X.globalAlpha = 1 - out;
    const bk = E.expoOut(ctx.prog(t, w(0) - 0.05, w(0) + 0.3)), pulse = 1 + 0.05 * Math.max(0, Math.sin((t - w(0)) * 7)) * (1 - ctx.prog(t, w(2), w(2) + 0.3));
    if (bk > 0) { X.save(); X.translate(540, 470); X.scale(bk * pulse, bk * pulse); H.bookmark(X, 0, 0, 150); X.restore(); }
    H.words(ctx, t, 'احفظ الفيديو', 540, 730, { times: [w(0), w(1)], size: 128, weight: 1000, accent: [0], maxWidth: 1040 });
    H.chip(ctx, t, 'حضرت عرض فيها؟', 540, 930, { s: w(4), size: 66 });
    X.restore();
    // finale
    H.royal(ctx, t, 'حيث تلتقي عُمان بالعالم', 540, 500, { s: voEnd + 0.1, stagger: 0.18, size: 112, maxWidth: 940 });
    H.rule(X, t, voEnd + 0.7, 540, 600, 380, { h: 3 });
    ctx.text(X, 'دار الأوبرا السلطانية · مسقط', 540, 680, { family: 'Cairo', weight: 700, size: 46, color: C.ivory, alpha: ctx.at(t, voEnd + 0.8, voEnd + 1.2), shadow: { blur: 14, y: 4, color: 'rgba(0,0,0,.7)' } });
    const ck = ctx.at(t, voEnd + 0.9, voEnd + 1.3);
    X.save(); X.globalAlpha = 0.6 * ck; X.fillStyle = '#000'; X.fillRect(0, 1400, 1080, 170); X.restore();
    CREDITS.forEach((s, i) => ctx.text(X, s, 520, 1450 + i * 42, { family: 'Inter', weight: 400, size: 26, color: C.ivory, alpha: 0.9 * ck, maxWidth: 860, dir: 'ltr' }));
  },
});
