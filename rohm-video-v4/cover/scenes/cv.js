// Reel cover (1080×1920). Everything that matters sits in the centre 1:1 square (y 420–1500) so the profile grid shows it.
// Variant is picked from the URL hash-free project field: window.__COVER ('A' foyer ceiling · 'B' night model)
import * as H from './../lib.js';
const { C } = H;
MOTION.scene({
  id: 'cv',
  draw(t, lt, ctx) {
    const { X } = ctx, v = (window.COVER_VARIANT || 'B');
    X.fillStyle = C.bg; X.fillRect(0, 0, 1080, 1920);
    if (v === 'A') H.cover(X, ctx.img('foyer_3'), { fx: 0.5, fy: 0.22, z: 1.0, filter: 'brightness(1.08) saturate(1.18) contrast(1.06)' });
    else H.cover(X, ctx.img('bl200'), { fx: 0.5, fy: 1.0, z: 1.55, filter: 'brightness(1.3) saturate(1.2) contrast(1.05)' });
    // bottom-up black fade: the top half of the picture stays bright, the text sits on the dark part
    const g = X.createLinearGradient(0, 300, 0, 1050); g.addColorStop(0, 'rgba(8,6,4,0)'); g.addColorStop(0.45, 'rgba(8,6,4,.62)'); g.addColorStop(1, 'rgba(8,6,4,.93)');
    X.fillStyle = g; X.fillRect(0, 300, 1080, 750); X.fillStyle = 'rgba(8,6,4,.93)'; X.fillRect(0, 1050, 1080, 870);
    const t0 = X.createLinearGradient(0, 0, 0, 220); t0.addColorStop(0, 'rgba(8,6,4,.35)'); t0.addColorStop(1, 'rgba(8,6,4,0)'); X.fillStyle = t0; X.fillRect(0, 0, 1080, 220);
    // Omani star ornament behind the type
    X.save(); X.strokeStyle = H.rgba(C.gold, 0.32); X.lineWidth = 3; H.starPath(X, 540, 1070, 520, 0.0); X.stroke(); X.restore();
    // kicker
    H.rule(X, 9, 0, 540, 745, 360, { h: 3 });
    ctx.text(X, 'دار الأوبرا السلطانية', 540, 700, { family: 'Aref Ruqaa', weight: 700, size: 70, color: C.lg, shadow: { blur: 18, y: 5, color: 'rgba(0,0,0,.8)' } });
    // hook: two lines
    H.words(ctx, 9, 'أشياء', 540, 1000, { s: 0, size: 215, weight: 1000, color: C.ivory, stagger: 0, maxWidth: 1000 });
    H.words(ctx, 9, 'ما تعرفها', 540, 1205, { s: 0, size: 160, weight: 1000, color: C.lg, stagger: 0, maxWidth: 1000 });
    H.rule(X, 9, 0, 540, 1300, 420, { h: 4 });
    ctx.text(X, 'عن دار الأوبرا في مسقط', 540, 1420, { family: 'Cairo', weight: 800, size: 62, color: C.ivory, shadow: { blur: 18, y: 5, color: 'rgba(0,0,0,.8)' } });
  },
});
