// s1 — الهوك: ليل شاطئ القرم، الواجهة ترتسم بخط ذهبي، ثم تضيء «وتغنّي للعالم»
import { bg, drawFacade, facadePaths, litArches, reveal, wt, push, frame, GOLD, HI, IVORY } from './lib.js';
MOTION.scene({ id: 's1',
  setup(ctx) { this.paths = facadePaths(540, 1230, 860); },
  draw(t, lt, ctx) {
    const { X, W, H } = ctx;
    bg(ctx, X, t, { cy: 1150, inner: '#2E2012' });
    X.save(); push(ctx, X, lt, 0.06, 540, 1100);
    // sea: shimmering gold reflection strokes under the building
    for (let i = 0; i < 26; i++) {
      const y = 1270 + i * 9 + i * i * 0.5, a = (1 - i / 26) * 0.5 * ctx.at(lt, 0.3, 1.5);
      const ph = Math.sin(t * 1.6 + i * 1.7), x0 = 540 - (300 - i * 6) + ph * 20, len = 600 - i * 12;
      X.globalAlpha = a; X.strokeStyle = i % 3 ? GOLD : HI; X.lineWidth = 2;
      X.setLineDash([24 + (i % 4) * 10, 18 + (i % 3) * 8]); X.lineDashOffset = -t * 30 * (i % 2 ? 1 : -1);
      X.beginPath(); X.moveTo(x0, y); X.lineTo(x0 + len, y); X.stroke();
    }
    X.setLineDash([]); X.globalAlpha = 1;
    const sing = ctx.wordTime('l1', 8).s;
    litArches(ctx, X, ctx.at(t, sing - 0.2, sing + 1.2, 'cubicOut'), { cx: 540, base: 1230, w: 860 });
    drawFacade(ctx, X, ctx.at(lt, 0.05, 4.2, 'cubicInOut'), { paths: this.paths, width: 2.6 });
    // sound rings rising from the tower when it "sings"
    for (let r = 0; r < 4; r++) {
      const k = ctx.clamp((t - sing - r * 0.35) / 1.8); if (k <= 0 || k >= 1) continue;
      X.globalAlpha = (1 - k) * 0.7; X.strokeStyle = HI; X.lineWidth = 2.5;
      X.beginPath(); X.arc(540, 690, 60 + k * 420, Math.PI * 1.15, Math.PI * 1.85); X.stroke();
    }
    X.restore(); X.globalAlpha = 1;
    const T = wt(ctx, 'l1');
    reveal(ctx, X, 'على شاطئِ القُرم… يقفُ صرحٌ', 540, 330, { t, size: 62, weight: 500, color: IVORY }, T.slice(0, 5));
    reveal(ctx, X, 'يُشبهُ قلاعَ عُمان… ويُغنّي للعالم', 540, 450, { t, size: 62, weight: 500, color: IVORY, colorAt: i => i >= 3 ? HI : null }, T.slice(5));
    frame(ctx, X, ctx.at(lt, 0, 2.2, 'cubicInOut'), { alpha: 0.7 });
  } });
