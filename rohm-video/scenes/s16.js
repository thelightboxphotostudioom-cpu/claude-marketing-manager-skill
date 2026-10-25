// s16 — الذكرى الخامسة عشرة: «15» داخل إكليل ذهبي + 28 عرضاً · 43 ليلة
import { bg, kicker, reveal, frame, dust, TRANS, GOLD, HI, IVORY, MUT } from './lib.js';
function wreath(ctx, X, cx, cy, R, k) {
  for (const side of [-1, 1]) for (let i = 0; i < 14; i++) {
    const u = i / 13, kk = ctx.clamp(k * 1.4 - u * 0.4); if (kk <= 0) continue;
    const a = Math.PI / 2 + side * (0.35 + u * 2.3), x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R;
    X.save(); X.translate(x, y); X.rotate(a + side * 0.6 + Math.PI / 2); X.scale(kk, kk); X.globalAlpha = kk;
    X.fillStyle = i % 2 ? GOLD : HI; X.beginPath(); X.ellipse(0, 0, 13, 34, 0, 0, 6.2832); X.fill(); X.restore();
  }
  ctx.drawPath(X, Array.from({ length: 40 }, (_, j) => { const a = Math.PI / 2 - 0.35 - j / 39 * 2.3; return [cx + Math.cos(a) * (R - 26), cy + Math.sin(a) * (R - 26)]; }), k, { width: 2, color: GOLD });
  ctx.drawPath(X, Array.from({ length: 40 }, (_, j) => { const a = Math.PI / 2 + 0.35 + j / 39 * 2.3; return [cx + Math.cos(a) * (R - 26), cy + Math.sin(a) * (R - 26)]; }), k, { width: 2, color: GOLD });
}
MOTION.scene({ id: 's16', transition: { type: TRANS.starIris, dur: 1.0 },
  draw(t, lt, ctx) {
    const { X, at } = ctx, w = ctx.wordsOf('l17');
    bg(ctx, X, t, { cy: 700, inner: '#3A2614' });
    dust(ctx, X, t, 1, 60);
    kicker(ctx, X, 'الذكرى الخامسة عشرة', 280, at(t, w[0].s, w[4].e));
    const k = at(t, w[2].s - 0.2, w[4].e + 0.4, 'cubicInOut');
    wreath(ctx, X, 540, 660, 300, k);
    const nk = at(t, w[3].s - 0.1, w[3].s + 0.8, 'expoOut');
    X.save(); X.translate(540, 760); X.scale(0.9 + 0.1 * nk, 0.9 + 0.1 * nk);
    ctx.text(X, '15', 0, 0, { family: 'num', weight: 100, size: 380, color: IVORY, dir: 'ltr', alpha: nk }); X.restore();
    ctx.text(X, 'عاماً', 540, 870, { family: 'display', weight: 700, size: 80, color: GOLD, alpha: nk });
    // stats
    const s1 = at(t, w[5].s - 0.1, w[7].e, 'cubicOut'), s2 = at(t, w[10].s - 0.2, w[12].e, 'cubicOut');
    ctx.text(X, String(Math.round(28 * s1)), 760, 1200, { family: 'num', weight: 200, size: 170, color: HI, dir: 'ltr', alpha: ctx.clamp(s1 * 5) });
    ctx.text(X, 'عرضاً', 760, 1290, { family: 'body', weight: 500, size: 48, color: IVORY, alpha: s1 });
    ctx.text(X, String(Math.round(43 * s2)), 320, 1200, { family: 'num', weight: 200, size: 170, color: HI, dir: 'ltr', alpha: ctx.clamp(s2 * 5) });
    ctx.text(X, 'ليلة', 320, 1290, { family: 'body', weight: 500, size: 48, color: IVORY, alpha: s2 });
    ctx.drawPath(X, [[540, 1060], [540, 1310]], at(t, w[8].s, w[9].e), { width: 2, color: GOLD });
    ctx.text(X, 'موسم 2026 — 2027', 540, 1440, { family: 'body', weight: 500, size: 38, color: MUT, alpha: at(t, w[11].s, w[12].e) });
    frame(ctx, X, 1, { alpha: 0.8 });
  } });
