// 7 · OPENING NIGHT · «وفي الثاني عشر من أكتوبر، ألفين وأحد عشر…» — the velvet curtain closes; the date lands on it
import * as H from '../lib.js';
const { C } = H;
MOTION.scene({
  id: 's22', transition: H.T.cross(0.25),
  draw(t, lt, ctx) {
    const { X, E } = ctx, w = i => H.W(ctx, 'l23', i), close = E.cubicOut(ctx.prog(lt, 0, 0.6));
    X.fillStyle = '#050302'; X.fillRect(0, 0, 1080, 1920);
    H.curtain(X, t, 1 - close, { spot: 0.6 + 0.4 * ctx.at(t, w(1), w(1) + 0.5) });
    // «12 · 10 · 2011» in one line, each token lands on its word
    const parts = [['12', w(1)], ['·', w(4)], ['10', w(4)], ['·', w(5)], ['2011', w(5)]], size = 132;
    X.save(); X.font = ctx.font('Inter', 200, size); const ws = parts.map(([s]) => X.measureText(s).width + (s === '·' ? 34 : 0)); X.restore();
    let x = 540 - ws.reduce((a, b) => a + b, 0) / 2;
    parts.forEach(([s, at], i) => {
      const k = E.expoOut(ctx.prog(t, at - 0.05, at + 0.35));
      if (k > 0) ctx.text(X, s, x + ws[i] / 2, 900 + (1 - k) * 36, { family: 'Inter', weight: 200, size, color: C.lg, alpha: k, shadow: { blur: 26, y: 8, color: 'rgba(0,0,0,.7)' } });
      x += ws[i];
    });
    H.rule(X, t, w(4), 540, 990, 520, { h: 3 });
    ctx.text(X, 'أكتوبر', 540, 1080, { family: 'Cairo', weight: 800, size: 52, color: C.ivory, alpha: ctx.at(t, w(4), w(4) + 0.3), shadow: { blur: 14, y: 4, color: 'rgba(0,0,0,.6)' } });
  },
});
