// s5 — 2003: مسابقة التصميم الدولية. لوحة مخطط معماري (بلوبرنت) ذهبية
import { bg, kicker, reveal, rollNumber, rail, frame, push, drawFacade, facadePaths, GOLD, HI, IVORY, MUT } from './lib.js';
MOTION.scene({ id: 's5',
  setup(ctx) { this.paths = facadePaths(540, 1160, 760); },
  draw(t, lt, ctx) {
    const { X, at } = ctx, w = ctx.wordsOf('l5');
    bg(ctx, X, t, { cy: 900, lattice: false, inner: '#22180E' });
    // drafting grid
    const g = at(lt, 0, 1.2);
    X.save(); X.strokeStyle = GOLD; X.lineWidth = 1;
    for (let x = 0; x <= 1080; x += 40) { X.globalAlpha = (x % 200 === 0 ? 0.12 : 0.05) * g; X.beginPath(); X.moveTo(x, 0); X.lineTo(x, 1920 * g); X.stroke(); }
    for (let y = 0; y <= 1920; y += 40) { X.globalAlpha = (y % 200 === 0 ? 0.12 : 0.05) * g; X.beginPath(); X.moveTo(1080, y); X.lineTo(1080 - 1080 * g, y); X.stroke(); }
    X.restore();
    X.save(); push(ctx, X, lt, 0.035);
    rollNumber(ctx, X, '2003', 540, 470, at(t, w[0].s - 0.3, w[2].e, 'cubicInOut'), { size: 230, weight: 200, color: IVORY });
    kicker(ctx, X, 'مسابقة دولية للتصميم', 580, at(t, w[5].s, w[5].s + 0.6), { size: 40 });
    // architect's elevation in thin construction lines + dimension marks
    drawFacade(ctx, X, at(lt, 0.6, 5.5, 'cubicInOut'), { paths: this.paths, width: 1.6, color: HI, alpha: 0.85 });
    const d = at(lt, 3.0, 4.2, 'expoOut');
    X.save(); X.globalAlpha = d; X.strokeStyle = GOLD; X.lineWidth = 1.2; X.setLineDash([6, 6]);
    X.beginPath(); X.moveTo(160, 1210); X.lineTo(920, 1210); X.moveTo(950, 1160); X.lineTo(950, 600); X.stroke(); X.setLineDash([]);
    for (const [x, y] of [[160, 1210], [920, 1210]]) { X.beginPath(); X.moveTo(x, y - 12); X.lineTo(x, y + 12); X.stroke(); }
    X.beginPath(); X.arc(540, 880, 330 * d, -0.4, -0.4 + 6.2832 * d); X.globalAlpha = d * 0.25; X.stroke();
    X.restore();
    X.restore();
    // the firm
    const kw = at(t, w[4].s - 0.1, w[4].s + 0.7, 'expoOut');
    ctx.text(X, 'WATG', 540, 1330, { family: 'num', weight: 300, size: 110, color: GOLD, dir: 'ltr', letterSpacing: 18 * kw, alpha: kw });
    reveal(ctx, X, 'تفوز بتصميم الدار', 540, 1430, { t, size: 44, weight: 400, color: IVORY }, [w[3].s + 0.1, w[6].s, w[7].s]);
    rail(ctx, X, t, lt, 1, { y: 1520, alpha: 0.85 });
    frame(ctx, X, 1, { alpha: 0.7 });
  } });
