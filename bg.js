/* =========================================================
   FONDO ANIMADO — aurora suave + luces bokeh flotando
   (como las luces desenfocadas de una foto de noche)
   Late un poco con la música. Ligero en celular.
   ========================================================= */
(() => {
  const c = document.getElementById("bg");
  if (!c) return;
  const g = c.getContext("2d");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobile = matchMedia("(max-width: 820px)").matches;
  const SCALE = mobile ? 0.45 : 0.6; // se dibuja a menor resolución (todo es desenfocado)
  let W, H, t = 0, scrollF = 0, last = 0;

  // Manchas de color (aurora)
  const BLOBS = [
    { c: [124, 243, 255], a: 0.11, r: 0.55, x: 0.15, y: 0.2, sx: 0.07, sy: 0.05, p: 0 },   // cian
    { c: [233, 180, 92], a: 0.08, r: 0.5, x: 0.85, y: 0.35, sx: 0.05, sy: 0.08, p: 2 },    // ámbar (ojos de la cabra)
    { c: [139, 92, 255], a: 0.08, r: 0.6, x: 0.55, y: 0.85, sx: 0.06, sy: 0.04, p: 4 },    // violeta
    { c: [255, 255, 255], a: 0.035, r: 0.4, x: 0.4, y: 0.5, sx: 0.09, sy: 0.07, p: 1 },    // brillo
  ];
  // Luces bokeh
  const N = reduced ? 0 : mobile ? 18 : 38;
  const PAL = [[124, 243, 255], [233, 180, 92], [255, 255, 255], [180, 160, 255]];
  let bokeh = [];

  function resize() {
    W = c.width = Math.ceil(innerWidth * SCALE);
    H = c.height = Math.ceil(innerHeight * SCALE);
    bokeh = Array.from({ length: N }, () => mk(true));
  }
  function mk(any) {
    const z = Math.random(); // profundidad: lejos = pequeño y tenue
    return {
      x: Math.random() * W, y: any ? Math.random() * H : H + 40,
      r: (6 + z * 34) * SCALE * (mobile ? 1.2 : 1),
      a: (0.05 + z * 0.13) * (mobile ? 0.55 : 0.85), vy: (0.08 + z * 0.35) * SCALE, vx: (Math.random() - 0.5) * 0.12 * SCALE,
      ph: Math.random() * 6.28, c: PAL[(Math.random() * PAL.length) | 0], z,
    };
  }
  addEventListener("resize", resize);
  addEventListener("scroll", () => { scrollF = scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight); }, { passive: true });
  resize();

  function frame(now) {
    requestAnimationFrame(frame);
    if (document.hidden) return;
    if (now - last < (mobile ? 40 : 30)) return; // ~25–33 fps es suficiente
    const dt = Math.min(0.1, (now - last) / 1000 || 0.03); last = now;
    t += reduced ? 0 : dt;
    const beat = (window.AUDIO && window.AUDIO.playing && window.AUDIO.bass) || 0;

    g.globalCompositeOperation = "source-over";
    g.fillStyle = "#0a0a0b"; g.fillRect(0, 0, W, H);
    g.globalCompositeOperation = "lighter";

    const M = Math.max(W, H);
    for (const b of BLOBS) {
      const x = (b.x + Math.sin(t * b.sx + b.p) * 0.18) * W;
      const y = (b.y + Math.cos(t * b.sy + b.p) * 0.14 - scrollF * 0.25) * H;
      const r = b.r * M * (1 + Math.sin(t * 0.3 + b.p) * 0.08);
      const a = b.a * (1 + beat * 0.6);
      const gr = g.createRadialGradient(x, y, 0, x, y, r);
      gr.addColorStop(0, `rgba(${b.c},${a})`); gr.addColorStop(1, `rgba(${b.c},0)`);
      g.fillStyle = gr; g.fillRect(0, 0, W, H);
    }
    for (const p of bokeh) {
      p.y -= p.vy * (1 + beat * 1.5); p.x += p.vx + Math.sin(t * 0.6 + p.ph) * 0.08 * SCALE;
      if (p.y < -p.r * 2) Object.assign(p, mk(false));
      const tw = 0.75 + Math.sin(t * 1.4 + p.ph) * 0.25;
      const a = p.a * tw * (1 + beat * 0.8);
      const gr = g.createRadialGradient(p.x, p.y, p.r * 0.55, p.x, p.y, p.r);
      gr.addColorStop(0, `rgba(${p.c},${a})`); gr.addColorStop(0.85, `rgba(${p.c},${a * 0.8})`); gr.addColorStop(1, `rgba(${p.c},0)`);
      g.fillStyle = gr; g.beginPath(); g.arc(p.x, p.y, p.r, 0, 6.283); g.fill();
    }
  }
  requestAnimationFrame(frame);
})();
