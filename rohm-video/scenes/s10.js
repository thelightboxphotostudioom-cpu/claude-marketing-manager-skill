// s10 — في الداخل: ثلاث لوحات خامات — خشب محفور، رخام، حِرف عُمانية
import { bg, kicker, reveal, frame, star8, TRANS, h01, GOLD, HI, IVORY, CRIMSON } from './lib.js';
function mk(w, h, f) { const c = document.createElement('canvas'); c.width = w; c.height = h; f(c.getContext('2d'), w, h); return c; }
MOTION.scene({ id: 's10', transition: { type: TRANS.veil, dur: 0.9 },
  setup(ctx) {
    const W = 280, H = 760, n2 = ctx.noise2;
    this.wood = mk(W, H, (X) => {
      X.fillStyle = '#5A3418'; X.fillRect(0, 0, W, H);
      for (let i = 0; i < 70; i++) { X.strokeStyle = i % 3 ? 'rgba(30,14,5,.35)' : 'rgba(201,140,80,.25)'; X.lineWidth = 1 + h01(i, 1) * 3; X.beginPath();
        for (let y = 0; y <= H; y += 8) { const x = i * 4.2 + n2(i * 0.3, y * 0.01) * 26 + Math.sin(y * 0.02 + i) * 6; y ? X.lineTo(x, y) : X.moveTo(x, y); } X.stroke(); }
      // hand-carved lattice inset
      X.strokeStyle = 'rgba(232,207,149,.55)'; X.lineWidth = 3;
      for (let y = 120; y < H; y += 170) { star8(X, W / 2, y, 70, Math.PI / 8, { stroke: 'rgba(232,207,149,.6)', width: 3 }); star8(X, W / 2, y, 36, 0, { stroke: 'rgba(20,10,4,.6)', width: 4 }); }
    });
    this.marble = mk(W, H, (X) => {
      const g = X.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#F1EBE2'); g.addColorStop(1, '#D9D0C3'); X.fillStyle = g; X.fillRect(0, 0, W, H);
      for (let i = 0; i < 14; i++) { X.strokeStyle = i % 4 ? 'rgba(110,100,90,.35)' : 'rgba(176,140,80,.6)'; X.lineWidth = 0.8 + h01(i, 3) * 2.2; X.beginPath();
        let x = h01(i, 4) * W, y = -20; X.moveTo(x, y); while (y < H + 20) { y += 14; x += n2(i, y * 0.008) * 18; X.lineTo(x, y); } X.stroke(); }
    });
    this.craft = mk(W, H, (X) => {
      X.fillStyle = '#5E1119'; X.fillRect(0, 0, W, H);
      for (let y = 0; y < H + 70; y += 70) for (let x = 0; x < W + 70; x += 70) { star8(X, x + ((y / 70) % 2 ? 35 : 0), y, 30, Math.PI / 8, { stroke: '#C9A35C', width: 2 }); star8(X, x + ((y / 70) % 2 ? 35 : 0), y, 10, 0, { fill: '#C9A35C' }); }
    });
  },
  draw(t, lt, ctx) {
    const { X, at } = ctx, w = ctx.wordsOf('l10');
    bg(ctx, X, t, { cy: 900, inner: '#2F1F12' });
    reveal(ctx, X, 'في الداخل', 540, 380, { t, family: 'display', weight: 700, size: 140, color: IVORY, rise: 60 }, [w[0].s, w[1].s]);
    const panels = [[this.wood, 'خشبٌ محفورٌ باليد', w[2].s], [this.marble, 'رخامٌ ثمين', w[5].s], [this.craft, 'حِرَفٌ عُمانية', w[7].s]];
    panels.forEach(([img, lab, s], i) => {
      const x = 860 - i * 320 - 140, y = 520, k = at(t, s - 0.1, s + 0.9, 'expoInOut'); if (k <= 0) return;
      const h = 760 * k;
      X.save(); X.beginPath(); X.rect(x, y + 760 - h, 280, h); X.clip();
      X.translate(0, (1 - k) * 60); X.drawImage(img, x, y);
      // arch-topped mask frame line
      X.restore();
      X.save(); X.globalAlpha = k; X.strokeStyle = GOLD; X.lineWidth = 3; X.strokeRect(x - 10, y - 10, 300, 780); X.lineWidth = 1; X.strokeRect(x - 20, y - 20, 320, 800); X.restore();
      reveal(ctx, X, lab, x + 140, 1380, { t, size: 36, weight: 600, color: HI, maxWidth: 300 }, [s + 0.3, s + 0.45, s + 0.6]);
    });
    frame(ctx, X, 1, { alpha: 0.7 });
  } });
