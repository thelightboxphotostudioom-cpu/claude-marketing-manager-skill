// Reel cover (1080×1920). Everything that matters sits in the centre 1:1 square (y 420–1500) so the profile grid shows it.
// Variant is picked from the URL hash-free project field: window.__COVER ('A' foyer ceiling · 'B' night model)
import * as H from './../lib.js';
const { C } = H; window.COVER_LANG = 'en';
MOTION.scene({
  id: 'cv',
  draw(t, lt, ctx) {
    const { X } = ctx, v = (window.COVER_VARIANT || 'B');
    X.fillStyle = C.bg; X.fillRect(0, 0, 1080, 1920);
    if (v === 'A') H.cover(X, ctx.img('foyer_3'), { fx: 0.5, fy: 0.22, z: 1.0, filter: 'brightness(1.08) saturate(1.18) contrast(1.06)' });
    else H.cover(X, ctx.img('bl200'), { fx: 0.5, fy: 1.0, z: 1.55, filter: 'brightness(1.3) saturate(1.2) contrast(1.05)' });
    // bottom-up black fade (lighter + shorter): clear above y≈600, ~0.8 at the text block, 0.8 below
    const g = X.createLinearGradient(0, 540, 0, 1320); g.addColorStop(0, 'rgba(8,6,4,0)'); g.addColorStop(0.22, 'rgba(8,6,4,.52)'); g.addColorStop(0.5, 'rgba(8,6,4,.68)'); g.addColorStop(1, 'rgba(8,6,4,.8)');
    X.fillStyle = g; X.fillRect(0, 540, 1080, 780); X.fillStyle = 'rgba(8,6,4,.8)'; X.fillRect(0, 1320, 1080, 600);
    const t0 = X.createLinearGradient(0, 0, 0, 200); t0.addColorStop(0, 'rgba(8,6,4,.28)'); t0.addColorStop(1, 'rgba(8,6,4,0)'); X.fillStyle = t0; X.fillRect(0, 0, 1080, 200);
    // Omani star ornament behind the type
    X.save(); X.strokeStyle = H.rgba(C.gold, 0.32); X.lineWidth = 3; H.starPath(X, 540, 1070, 520, 0.0); X.stroke(); X.restore();
    const en = window.COVER_LANG === 'en';
    // kicker
    H.rule(X, 9, 0, 540, 745, 360, { h: 3 });
    { const h = X.createRadialGradient(540, 690, 10, 540, 690, 330); h.addColorStop(0, 'rgba(8,6,4,.62)'); h.addColorStop(1, 'rgba(8,6,4,0)'); X.save(); X.scale(1, 0.34); X.translate(0, 690 * (1 / 0.34 - 1)); X.fillStyle = h; X.fillRect(0, 0, 1080, 1920 / 0.34); X.restore(); }
    const sh = { blur: 26, y: 6, color: 'rgba(0,0,0,.95)' };
    if (!en) {
      ctx.text(X, 'دار الأوبرا السلطانية', 540, 702, { family: 'Aref Ruqaa', weight: 700, size: 78, color: C.lg, stroke: { width: 11, color: 'rgba(8,6,4,.9)' }, shadow: sh });
      H.words(ctx, 9, 'أشياء', 540, 1000, { s: 0, size: 215, weight: 1000, color: C.ivory, stagger: 0, maxWidth: 1000 });
      H.words(ctx, 9, 'ما تعرفها', 540, 1205, { s: 0, size: 160, weight: 1000, color: C.lg, stagger: 0, maxWidth: 1000 });
      H.rule(X, 9, 0, 540, 1300, 420, { h: 4 });
      ctx.text(X, 'عن دار الأوبرا في مسقط', 540, 1420, { family: 'Cairo', weight: 800, size: 62, color: C.ivory, shadow: sh });
    } else {
      ctx.text(X, 'ROYAL OPERA HOUSE', 540, 706, { family: 'Inter', weight: 600, size: 60, letterSpacing: 9, color: C.lg, maxWidth: 940, stroke: { width: 10, color: 'rgba(8,6,4,.9)' }, shadow: sh });
      ctx.text(X, 'THINGS YOU', 540, 990, { family: 'Inter', weight: 900, size: 168, color: C.ivory, maxWidth: 960, shadow: sh });
      ctx.text(X, "DIDN'T KNOW", 540, 1180, { family: 'Inter', weight: 900, size: 156, color: C.lg, maxWidth: 960, shadow: sh });
      H.rule(X, 9, 0, 540, 1300, 420, { h: 4 });
      ctx.text(X, 'about the opera house in Muscat', 540, 1415, { family: 'Inter', weight: 500, size: 52, color: C.ivory, maxWidth: 940, shadow: sh });
    }
  },
});
