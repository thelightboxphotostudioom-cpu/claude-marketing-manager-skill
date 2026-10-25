// s9 — العمارة ثلاثية الأبعاد: واجهة من حجر وردة الصحراء، أروقة وأبراج، كاميرا تدور بغروب ذهبي
import { kicker, reveal, frame, dust, GOLD, HI, IVORY, MUT } from './lib.js';
function chip(ctx, X, str, x, y, k) {
  if (k <= 0) return; const e = ctx.E.expoOut(k);
  X.save(); X.font = ctx.F('body', 600, 40); const w = X.measureText(str).width + 70; X.restore();
  X.save(); X.globalAlpha = e; X.translate(0, (1 - e) * 24);
  X.fillStyle = 'rgba(13,10,7,.6)'; X.strokeStyle = GOLD; X.lineWidth = 2;
  X.beginPath(); X.roundRect(x - w / 2, y - 52, w, 76, 38); X.fill(); X.stroke();
  ctx.text(X, str, x, y, { family: 'body', weight: 600, size: 40, color: HI }); X.restore();
}
MOTION.scene({ id: 's9',
  setup(ctx) {
    const T = ctx.THREE;
    this.st = ctx.stage3D({ fov: 40, camera: [0, 6, 45], lookAt: [0, 5, 0], tone: 'aces', exposure: 1.05, samples: 4 });
    const stone = new T.MeshStandardMaterial({ color: '#D8B49A', roughness: 0.85 });
    const stone2 = new T.MeshStandardMaterial({ color: '#C9A487', roughness: 0.9 });
    const gold = new T.MeshStandardMaterial({ color: '#C9A35C', roughness: 0.35, metalness: 0.7 });
    const glow = new T.MeshStandardMaterial({ color: '#2A1A0E', emissive: '#E8B970', emissiveIntensity: 0.9 });
    const G = new T.Group(); this.G = G; this.st.add(G);
    // arcade with pointed arches
    const sh = new T.Shape(); sh.moveTo(-8, -0.2); sh.lineTo(8, -0.2); sh.lineTo(8, 3.4); sh.lineTo(-8, 3.4); sh.closePath();
    for (let i = 0; i < 7; i++) {
      const x0 = -8 + i * 16 / 7 + 0.38, x1 = x0 + 16 / 7 - 0.76, m = (x0 + x1) / 2, h = new T.Path();
      h.moveTo(x0, 0); h.lineTo(x0, 2.1); h.quadraticCurveTo(x0 + 0.05, 2.75, m, 3.05); h.quadraticCurveTo(x1 - 0.05, 2.75, x1, 2.1); h.lineTo(x1, 0); h.closePath(); sh.holes.push(h);
    }
    const arc = new T.Mesh(new T.ExtrudeGeometry(sh, { depth: 1.4, bevelEnabled: false }), stone); arc.position.z = -0.7; G.add(arc);
    const back = new T.Mesh(new T.BoxGeometry(15.8, 3.3, 0.2), glow); back.position.set(0, 1.5, -1.5); G.add(back);
    const add = (geo, mat, x, y, z) => { const m = new T.Mesh(geo, mat); m.position.set(x, y, z); G.add(m); return m; };
    add(new T.BoxGeometry(16.5, 0.22, 1.8), gold, 0, 3.5, 0);                               // gilded cornice
    add(new T.BoxGeometry(14.4, 2.6, 5), stone2, 0, 4.9, -2.9);                              // upper body
    for (let i = 0; i < 9; i++) add(new T.BoxGeometry(0.55, 1.2, 0.05), glow, -6 + i * 1.5, 4.9, -0.38);   // lit windows
    add(new T.BoxGeometry(14.8, 0.18, 5.3), gold, 0, 6.25, -2.9);
    add(new T.BoxGeometry(3.4, 4.4, 3.4), stone, 0, 8.4, -2.9);                               // central tower
    add(new T.BoxGeometry(1.0, 1.9, 0.05), glow, 0, 8.6, -1.17);
    const cren = (cx, cy, cz, w) => { const n = 5; for (let i = 0; i < n; i++) for (const s of [-1, 1]) { add(new T.BoxGeometry(w / (2 * n), 0.45, 0.35), stone, cx - w / 2 + (i + 0.5) * w / n, cy, cz + s * (w / 2 - 0.17)); add(new T.BoxGeometry(0.35, 0.45, w / (2 * n)), stone, cx + s * (w / 2 - 0.17), cy, cz - w / 2 + (i + 0.5) * w / n); } };
    cren(0, 10.82, -2.9, 3.4);
    for (const sx of [-6, 6]) { add(new T.BoxGeometry(2, 1.8, 2), stone, sx, 7.1, -2.9); cren(sx, 8.2, -2.9, 2); }
    const ground = new T.Mesh(new T.PlaneGeometry(200, 200), new T.MeshStandardMaterial({ color: '#2B1D13', roughness: 1 }));
    ground.rotation.x = -Math.PI / 2; ground.position.y = -0.2; this.st.add(ground);
    this.st.add(new T.HemisphereLight('#FFE0B5', '#1E130B', 0.9));
    const sun = new T.DirectionalLight('#FFC27E', 2.8); sun.position.set(-14, 9, 16); this.st.add(sun);
    const rim = new T.DirectionalLight('#E8CF95', 0.8); rim.position.set(12, 6, -8); this.st.add(rim);
  },
  draw(t, lt, ctx) {
    const { X, at } = ctx, w = ctx.wordsOf('l9'), d = ctx.scene.dur;
    const sky = X.createLinearGradient(0, 0, 0, 1920); sky.addColorStop(0, '#080503'); sky.addColorStop(0.45, '#2A170C'); sky.addColorStop(0.62, '#7A4523'); sky.addColorStop(0.66, '#3A2214'); sky.addColorStop(1, '#120B06');
    X.fillStyle = sky; X.fillRect(0, 0, 1080, 1920);
    const sg = X.createRadialGradient(380, 1150, 10, 380, 1150, 700); sg.addColorStop(0, 'rgba(255,190,120,.35)'); sg.addColorStop(1, 'rgba(255,190,120,0)'); X.fillStyle = sg; X.fillRect(0, 400, 1080, 1300);
    const u = at(lt, 0, d, 'sineInOut');
    this.st.orbit(ctx.lerp(-0.55, -0.05, u), ctx.lerp(0.17, 0.08, u), ctx.lerp(66, 56, u), [0, 7.2, -1]);
    this.G.position.y = -0.6 * (1 - at(lt, 0, 1.4, 'expoOut'));
    this.st.draw(X);
    dust(ctx, X, t, 0.6, 40);
    kicker(ctx, X, 'العمارة', 300, at(lt, 0.1, 0.9));
    reveal(ctx, X, 'حجر وردة الصحراء', 540, 450, { t, family: 'display', weight: 700, size: 116, color: IVORY, rise: 60 }, [w[2].s, w[3].s, w[4].s]);
    reveal(ctx, X, 'العُماني', 540, 570, { t, family: 'display', weight: 700, size: 96, color: GOLD, rise: 50 }, [w[5].s]);
    chip(ctx, X, 'أروقة', 680, 720, at(t, w[6].s, w[6].s + 0.6));
    chip(ctx, X, 'أبراج', 400, 720, at(t, w[7].s, w[7].s + 0.6));
    reveal(ctx, X, 'تستلهمُ قلاعَ نخل وبهلاء', 540, 1480, { t, size: 48, weight: 500, color: IVORY, colorAt: i => i >= 2 ? HI : null }, [w[8].s, w[9].s, w[10].s, w[11].s]);
    frame(ctx, X, 1, { alpha: 0.7 });
  } });
