// Reel cover (1080×1920). Everything that matters sits in the centre 1:1 square (y 420–1500) so the profile grid shows it.
// Variant is picked from the URL hash-free project field: window.__COVER ('A' foyer ceiling · 'B' night model)
import * as H from './../lib.js';
const { C } = H;
MOTION.scene({
  id: 'cv',
  draw(t, lt, ctx) {
    const { X } = ctx, v = (window.COVER_VARIANT || 'B');
    X.fillStyle = C.bg; X.fillRect(0, 0, 1080, 1920);
    if (v === 'A') H.cover(X, ctx.img('foyer_3'), { fx: 0.5, fy: 0.3, z: 1.12, filter: 'brightness(.62) saturate(1.12) contrast(1.05)' });
    else H.cover(X, ctx.img('bl200'), { fx: 0.5, fy: 0.5, z: 1.0, filter: 'brightness(.8) saturate(1.1)' });
    // legibility: dark centre pool + strong vignette
    const g = X.createRadialGradient(540, 960, 120, 540, 960, 1150); g.addColorStop(0, 'rgba(8,6,4,.62)'); g.addColorStop(0.55, 'rgba(8,6,4,.38)'); g.addColorStop(1, 'rgba(8,6,4,.9)');
    X.fillStyle = g; X.fillRect(0, 0, 1080, 1920);
    H.shade(X, { top: 0.55, topH: 420, bottom: 0.65, botH: 480 });
    // Omani star ornament behind the type
    X.save(); X.strokeStyle = H.rgba(C.gold, 0.4); X.lineWidth = 3; H.starPath(X, 540, 900, 530, 0.0); X.stroke(); X.restore();
    // kicker
    H.rule(X, 9, 0, 540, 575, 360, { h: 3 });
    ctx.text(X, 'دار الأوبرا السلطانية', 540, 530, { family: 'Aref Ruqaa', weight: 700, size: 70, color: C.lg, shadow: { blur: 18, y: 5, color: 'rgba(0,0,0,.8)' } });
    // hook: two lines
    H.words(ctx, 9, 'أشياء', 540, 830, { s: 0, size: 215, weight: 1000, color: C.ivory, stagger: 0, maxWidth: 1000 });
    H.words(ctx, 9, 'ما تعرفها', 540, 1035, { s: 0, size: 160, weight: 1000, color: C.lg, stagger: 0, maxWidth: 1000 });
    H.rule(X, 9, 0, 540, 1130, 420, { h: 4 });
    ctx.text(X, 'عن دار الأوبرا في مسقط', 540, 1250, { family: 'Cairo', weight: 800, size: 62, color: C.ivory, shadow: { blur: 18, y: 5, color: 'rgba(0,0,0,.8)' } });
  },
});
