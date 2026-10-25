// s18 — الختام: الواجهة الذهبية مضاءة، خطوط الطول للعالم، العنوان الكامل ثم خفوت للأسود
import { bg, drawFacade, facadePaths, litArches, kicker, reveal, frame, star8, GOLD, HI, IVORY } from './lib.js';
MOTION.scene({ id: 's18',
  setup() { this.paths = facadePaths(540, 1260, 760); },
  draw(t, lt, ctx) {
    const { X, at } = ctx, w = ctx.wordsOf('l19'), d = ctx.scene.dur;
    bg(ctx, X, t, { cy: 1000, inner: '#3A2614' });
    // globe meridians behind the house — "the world"
    const gk = at(t, w[3].s - 0.5, w[6].e, 'cubicInOut');
    X.save(); X.globalAlpha = 0.35 * gk; X.strokeStyle = GOLD; X.lineWidth = 1.5;
    X.beginPath(); X.arc(540, 1000, 430, 0, 6.2832); X.stroke();
    for (let i = 0; i < 8; i++) { const ph = (i / 8 + lt * 0.03) % 1, rx = Math.abs(Math.cos(ph * Math.PI)) * 430; X.beginPath(); X.ellipse(540, 1000, rx, 430, 0, 0, 6.2832); X.stroke(); }
    for (let j = -3; j <= 3; j++) { const y = 1000 + j * 120, rx = Math.sqrt(Math.max(0, 430 * 430 - (j * 120) ** 2)); X.beginPath(); X.ellipse(540, y, rx, 20 * gk, 0, 0, 6.2832); X.stroke(); }
    X.restore();
    drawFacade(ctx, X, at(lt, 0, 2.2, 'cubicInOut'), { paths: this.paths, width: 2.6 });
    litArches(ctx, X, at(lt, 1.2, 3.0), { cx: 540, base: 1260, w: 760 });
    ctx.text(X, 'دارُ الأوبرا السلطانية', 540, 380, { family: 'display', weight: 700, size: 112, color: IVORY, alpha: at(t, w[0].s - 0.1, w[2].e) });
    kicker(ctx, X, 'مسقط', 480, at(t, w[2].s, w[2].e + 0.6), { size: 48, color: GOLD });
    reveal(ctx, X, 'حيثُ تلتقي عُمانُ بالعالم', 540, 1420, { t, family: 'display', weight: 700, size: 92, color: GOLD, rise: 50, dur: 0.8 }, [w[3].s, w[4].s, w[5].s, w[6].s]);
    frame(ctx, X, 1);
    // fade to black at the very end
    const fo = at(lt, d - 1.2, d, 'cubicIn'); if (fo > 0) { X.fillStyle = `rgba(0,0,0,${fo})`; X.fillRect(0, 0, 1080, 1920); }
  } });
