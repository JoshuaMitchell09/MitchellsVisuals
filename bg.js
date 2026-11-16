/* =========================================================
   FONDO ANIMADO — líneas topográficas (mapa de montaña)
   Curvas de nivel finas que se deforman lentamente.
   Brillan un poco cerca del cursor y laten con la música.
   ========================================================= */
(() => {
  const c = document.getElementById("bg");
  if (!c) return;
  const g = c.getContext("2d");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobile = matchMedia("(max-width: 820px)").matches;
  const DPR = Math.min(devicePixelRatio || 1, mobile ? 1.5 : 1.25);
  const CELL = mobile ? 26 : 22;          // tamaño de celda (px CSS)
  const LEVELS = mobile ? 9 : 12;         // número de curvas
  const SPEED = 0.045;                    // velocidad de deformación
  let W, H, cols, rows, field, t = Math.random() * 100, last = 0, scrollF = 0;
  let mx = -1e4, my = -1e4, sx = -1e4, sy = -1e4;

  /* ---- ruido 3D (value noise suavizado) ---- */
  const P = new Uint8Array(512);
  { const p = [...Array(256).keys()]; for (let i = 255; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [p[i], p[j]] = [p[j], p[i]]; } for (let i = 0; i < 512; i++) P[i] = p[i & 255]; }
  const fade = (x) => x * x * x * (x * (x * 6 - 15) + 10);
  const lerp = (a, b, k) => a + (b - a) * k;
  const h = (x, y, z) => P[P[P[x & 255] + (y & 255)] + (z & 255)] / 255;
  function noise(x, y, z) {
    const X = Math.floor(x), Y = Math.floor(y), Z = Math.floor(z);
    const u = fade(x - X), v = fade(y - Y), w = fade(z - Z);
    return lerp(
      lerp(lerp(h(X, Y, Z), h(X + 1, Y, Z), u), lerp(h(X, Y + 1, Z), h(X + 1, Y + 1, Z), u), v),
      lerp(lerp(h(X, Y, Z + 1), h(X + 1, Y, Z + 1), u), lerp(h(X, Y + 1, Z + 1), h(X + 1, Y + 1, Z + 1), u), v), w);
  }
  const fbm = (x, y, z) => noise(x, y, z) * 0.65 + noise(x * 2.1, y * 2.1, z * 1.3) * 0.35;

  function resize() {
    W = innerWidth; H = innerHeight;
    c.width = Math.ceil(W * DPR); c.height = Math.ceil(H * DPR);
    g.setTransform(DPR, 0, 0, DPR, 0, 0);
    cols = Math.ceil(W / CELL) + 1; rows = Math.ceil(H / CELL) + 1;
    field = new Float32Array(cols * rows);
  }
  addEventListener("resize", resize);
  addEventListener("pointermove", (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });
  addEventListener("scroll", () => { scrollF = scrollY; }, { passive: true });
  resize();

  // interpolación del punto donde la curva cruza un borde de celda
  const cross = (a, b, lv) => (lv - a) / (b - a || 1e-6);

  function draw(now) {
    requestAnimationFrame(draw);
    if (document.hidden) return;
    if (now - last < (mobile ? 50 : 33)) return; // 20–30 fps: suficiente para algo tan lento
    const dt = Math.min(0.1, (now - last) / 1000 || 0.03); last = now;
    if (!reduced) t += dt * SPEED;
    const beat = (window.AUDIO && window.AUDIO.playing && window.AUDIO.bass) || 0;
    sx += (mx - sx) * 0.12; sy += (my - sy) * 0.12;

    // campo de alturas (se desplaza un poco con el scroll: parallax)
    const off = scrollF * 0.0009, S = 0.0026 * CELL;
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++)
      field[j * cols + i] = fbm(i * S, j * S + off, t);

    g.clearRect(0, 0, W, H);
    g.lineWidth = 1;
    const R = mobile ? 0 : 260; // radio del brillo del cursor
    for (let L = 1; L <= LEVELS; L++) {
      const lv = 0.18 + (L / (LEVELS + 1)) * 0.7;
      const major = L % 4 === 0;
      g.beginPath();
      for (let j = 0; j < rows - 1; j++) {
        for (let i = 0; i < cols - 1; i++) {
          const a = field[j * cols + i], b = field[j * cols + i + 1], d = field[(j + 1) * cols + i], e = field[(j + 1) * cols + i + 1];
          const k = (a > lv ? 8 : 0) | (b > lv ? 4 : 0) | (e > lv ? 2 : 0) | (d > lv ? 1 : 0);
          if (k === 0 || k === 15) continue;
          const x = i * CELL, y = j * CELL;
          const T = [x + cross(a, b, lv) * CELL, y], Rr = [x + CELL, y + cross(b, e, lv) * CELL];
          const B = [x + cross(d, e, lv) * CELL, y + CELL], Lf = [x, y + cross(a, d, lv) * CELL];
          const seg = (p, q) => { g.moveTo(p[0], p[1]); g.lineTo(q[0], q[1]); };
          switch (k) {
            case 1: case 14: seg(Lf, B); break;
            case 2: case 13: seg(B, Rr); break;
            case 3: case 12: seg(Lf, Rr); break;
            case 4: case 11: seg(T, Rr); break;
            case 5: seg(Lf, T); seg(B, Rr); break;
            case 6: case 9: seg(T, B); break;
            case 7: case 8: seg(Lf, T); break;
            case 10: seg(Lf, B); seg(T, Rr); break;
          }
        }
      }
      const base = (major ? (mobile ? 0.2 : 0.16) : (mobile ? 0.1 : 0.075)) * (1 + beat * 0.5);
      g.strokeStyle = `rgba(255,255,255,${base})`;
      g.stroke();
      // brillo cerca del cursor: se repinta la misma curva recortada a un círculo
      if (R && sx > -1000) {
        g.save();
        const gr = g.createRadialGradient(sx, sy, 0, sx, sy, R);
        gr.addColorStop(0, `rgba(124,243,255,${major ? 0.5 : 0.32})`); gr.addColorStop(1, "rgba(124,243,255,0)");
        g.strokeStyle = gr; g.stroke();
        g.restore();
      }
    }
  }
  requestAnimationFrame(draw);
})();
