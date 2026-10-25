// s12 — أرغن Klais ثلاثي الأبعاد: أنابيب ذهبية ترتفع، عدّاد +4,000 أنبوب
import { kicker, reveal, frame, dust, bg, GOLD, HI, IVORY, MUT } from './lib.js';
MOTION.scene({ id: 's12',
  setup(ctx) {
    const T = ctx.THREE;
    this.st = ctx.stage3D({ fov: 36, camera: [0, 4, 30], lookAt: [0, 4, 0], env: 'room', tone: 'aces', exposure: 1.0, samples: 4 });
    const pipeM = new T.MeshStandardMaterial({ color: '#D9B46A', metalness: 1, roughness: 0.22, envMapIntensity: 1.2 });
    const woodM = new T.MeshStandardMaterial({ color: '#140A05', roughness: 0.7, envMapIntensity: 0.0 });
    const goldM = new T.MeshStandardMaterial({ color: '#C9A35C', metalness: 0.9, roughness: 0.3 });
    this.pipes = [];
    // five towers of pipes; heights follow a symmetric "organ" contour
    const towers = [[-7.2, 9, 0.30], [-3.7, 11, 0.36], [0, 14, 0.44], [3.7, 11, 0.36], [7.2, 9, 0.30]];
    towers.forEach(([tx, n, r], ti) => {
      const span = n * r * 2.25;
      for (let i = 0; i < n; i++) {
        const u = i / (n - 1), c = 1 - Math.abs(u - 0.5) * 2, h = (ti === 2 ? 7 : ti % 2 ? 5.4 : 4.4) * (0.55 + 0.45 * c);
        const g = new T.Group();
        const body = new T.Mesh(new T.CylinderGeometry(r, r, h, 24, 1, true), pipeM); body.position.y = h / 2; g.add(body);
        const foot = new T.Mesh(new T.ConeGeometry(r, 0.9, 24, 1, true), pipeM); foot.rotation.x = Math.PI; foot.position.y = -0.45; g.add(foot);
        const mouth = new T.Mesh(new T.BoxGeometry(r * 1.1, 0.25, 0.05), woodM); mouth.position.set(0, 0.35, r * 0.98); g.add(mouth);
        g.position.set(tx - span / 2 + (i + 0.5) * span / n, 1.4, ti === 2 ? 0.6 : ti % 2 ? 0.2 : -0.2);
        this.st.add(g); this.pipes.push({ g, d: ti * 0.12 + Math.abs(u - 0.5) * 0.5 });
      }
    });
    const add = (geo, m, x, y, z) => { const o = new T.Mesh(geo, m); o.position.set(x, y, z); this.st.add(o); return o; };
    add(new T.BoxGeometry(18.6, 1.6, 2.4), woodM, 0, 0.2, -0.3);           // case base
    add(new T.BoxGeometry(19.4, 0.16, 2.6), goldM, 0, 1.05, -0.3);        // gilded moulding
    add(new T.BoxGeometry(19.4, 0.16, 2.6), goldM, 0, -0.6, -0.3);
        const key = new T.SpotLight('#FFE6B8', 260, 60, 0.6, 0.6); key.position.set(-6, 16, 18); key.target.position.set(0, 4, 0); this.st.add(key); this.st.add(key.target);
    this.st.add(new T.HemisphereLight('#FFE9C8', '#1A0F08', 0.5));
  },
  draw(t, lt, ctx) {
    const { X, at } = ctx, w = ctx.wordsOf('l12'), d = ctx.scene.dur;
    bg(ctx, X, t, { cy: 1050, inner: '#2C1C10', lattice: false });
    const rise = at(t, w[1].s - 0.4, w[1].s + 2.6, 'linear');
    this.pipes.forEach(p => { const k = ctx.E.expoOut(ctx.clamp(rise * 1.6 - p.d)); p.g.scale.y = Math.max(0.001, k); p.g.visible = k > 0.002; });
    const u = at(lt, 0, d, 'sineInOut');
    this.st.orbit(ctx.lerp(0.3, -0.2, u), ctx.lerp(0.04, 0.12, u), ctx.lerp(72, 62, u), [0, 3.9, 0]);
    this.st.draw(X);
    dust(ctx, X, t, 0.7, 45);
    kicker(ctx, X, 'الأرغن', 280, at(lt, 0.1, 0.9));
    reveal(ctx, X, 'أرغنٌ ألمانيٌّ من صُنع', 540, 400, { t, size: 56, weight: 500, color: IVORY }, [w[1].s, w[2].s, w[3].s, w[4].s]);
    const kk = at(t, w[5].s - 0.05, w[5].s + 0.7, 'expoOut');
    ctx.text(X, 'KLAIS', 540, 520, { family: 'num', weight: 300, size: 90, color: GOLD, dir: 'ltr', letterSpacing: 24 * kk, alpha: kk });
    ctx.text(X, 'BONN · GERMANY', 540, 575, { family: 'num', weight: 300, size: 24, color: MUT, dir: 'ltr', letterSpacing: 8, alpha: kk });
    const ck = at(t, w[6].s, w[9].e, 'cubicOut');
    ctx.text(X, '+' + ctx.num(Math.round(4000 * ck)), 540, 1365, { family: 'num', weight: 200, size: 170, color: HI, dir: 'ltr', alpha: ctx.clamp(ck * 5) });
    reveal(ctx, X, 'أنبوب', 540, 1440, { t, size: 50, weight: 500, color: IVORY }, [w[9].s]);
    reveal(ctx, X, 'وصندوقٌ مُذهَّبٌ بورق الذهب', 540, 1500, { t, size: 40, weight: 500, color: GOLD }, [w[10].s, w[11].s, w[12].s, w[13].s]);
    frame(ctx, X, 1, { alpha: 0.7 });
  } });
