/* =========================================================
   MASCOTA — la cabra de Mitchell Visuals
   Salta de sección en sección, saluda, habla y baila con la música.
   Los textos se editan en config.js → mascot
   ========================================================= */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const root = $(".mascot");
  if (!root || !window.gsap) return;
  const CFG = (window.SITE && window.SITE.mascot) || {};
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const flip = $(".m-flip", root), goat = $(".m-goat", root), shadow = $(".m-shadow", root);
  const head = $(".m-head", root), arm = $(".m-arm", root), leg = $(".m-leg", root);
  const bubble = $(".m-bubble", root), bubbleText = $(".m-bubble span", root);
  const GH = 129; // alto base de la cabra (px)

  const isMobile = () => innerWidth < 820;
  // Posiciones por sección: x/y = punto de las patas (fracción de la pantalla), s = tamaño, face = 1 mira a la derecha / -1 izquierda
  const R = { x: 0.93, y: 0.96, s: 0.8, face: -1 }, L = { x: 0.07, y: 0.89, s: 0.8, face: 1 };
  const MR = { x: 0.87, y: 0.965, s: 0.44, face: -1 }, ML = { x: 0.7, y: 0.965, s: 0.44, face: -1 };
  const SPOTS = {
    trabajo:    { d: L, m: ML },
    top:        { d: R, m: MR },
    equipo:     { d: R, m: MR },
    sobre:      { d: L, m: ML },
    servicios:  { d: R, m: MR },
    clientes:   { d: L, m: ML },
    portafolio: { d: R, m: MR },
    contacto:   { d: R, m: MR },
  };

  const LINES = Object.assign({
    top: "¡Meeeeeeh! Bienvenido.",
    trabajo: "Esto es lo que hago.",
    equipo: "Con esto hago la magia.",
    sobre: "Recuerda: cabra solo hay una.",
    servicios: "¿Qué necesitas? Yo me encargo.",
    clientes: "Ellos ya confiaron. ¿Sigues tú?",
    portafolio: "Aquí está lo bueno. Dale clic.",
    contacto: "Escríbeme… meeeeeh.",
  }, CFG.lines || {});
  const RANDOM = CFG.random || ["¡Meeeeeeeeeh!", "Cabra solo hay una.", "El GOAT de la foto.", "¿Una foto? ¡Clic!", "Meeeh… dale scroll."];

  const spot = (key) => { const s = SPOTS[key] || SPOTS.top; const v = isMobile() ? s.m : s.d; return { x: v.x * innerWidth, y: v.y * innerHeight, s: v.s, face: v.face }; };
  const state = { key: null, x: innerWidth * 1.2, y: innerHeight * 0.9, s: 1, face: -1, busy: null };

  function place() { gsap.set(root, { x: state.x, y: state.y }); }
  function setScale(s) { gsap.set(goat, { scale: s }); gsap.set(shadow, { scale: s }); root.style.setProperty("--s", s); }
  function bubbleSide() {
    root.classList.toggle("edge-right", state.x > innerWidth * 0.65);
    root.classList.toggle("edge-left", state.x < innerWidth * 0.35);
  }

  /* ---------- globo de texto ---------- */
  let bubbleTl;
  function say(text, hold = 3.2) {
    if (!text) return;
    bubbleSide();
    bubbleText.textContent = "";
    bubbleTl && bubbleTl.kill();
    const chars = [...text];
    bubbleTl = gsap.timeline()
      .set(bubble, { autoAlpha: 1 })
      .fromTo(bubble, { scale: 0.4, rotate: -6 }, { scale: 1, rotate: 0, duration: 0.25, ease: "steps(3)" })
      .to({}, { duration: chars.length * 0.035, ease: "none", onUpdate() { bubbleText.textContent = chars.slice(0, Math.ceil(this.progress() * chars.length)).join(""); } })
      .to(bubble, { autoAlpha: 0, scale: 0.8, duration: 0.2, ease: "steps(2)" }, `+=${hold}`);
  }

  /* ---------- gestos ---------- */
  const wave = () => gsap.timeline()
    .to(arm, { rotate: -30, duration: 0.12, ease: "steps(2)" })
    .to(arm, { rotate: 6, yoyo: true, repeat: 5, duration: 0.14, ease: "steps(2)" })
    .to(arm, { rotate: 0, duration: 0.12, ease: "steps(2)" });
  const nod = () => gsap.timeline().to(head, { rotate: -10, yoyo: true, repeat: 5, duration: 0.08, ease: "steps(1)" });
  const hop = () => gsap.timeline()
    .to(goat, { scaleY: state.s * 0.88, duration: 0.08, ease: "steps(1)" })
    .to(goat, { y: -50, scaleY: state.s, duration: 0.18, ease: "steps(3)" })
    .to(shadow, { scale: state.s * 0.6, opacity: 0.25, duration: 0.18, ease: "steps(3)" }, "<")
    .to(goat, { y: 0, duration: 0.16, ease: "steps(3)" })
    .to(shadow, { scale: state.s, opacity: 0.5, duration: 0.16, ease: "steps(3)" }, "<");

  /* ---------- saltar a otra posición ---------- */
  function jumpTo(key, { talk = true } = {}) {
    if (state.key === key && talk) return;
    state.key = key;
    const to = spot(key);
    state.busy && state.busy.kill();
    const from = { x: state.x, y: state.y };
    const peak = Math.min(from.y, to.y) - (isMobile() ? 110 : 190);
    const dir = to.x >= from.x ? 1 : -1;
    const far = Math.abs(to.x - from.x) > 40;
    const tl = gsap.timeline({ onComplete: () => { state.busy = null; } });
    // girar hacia donde salta
    if (far) tl.set(flip, { scaleX: dir });
    tl.to(goat, { scaleY: state.s * 0.85, duration: 0.1, ease: "steps(2)" })
      .to(leg, { rotate: -35, duration: 0.08, ease: "steps(1)" })
      .to(state, {
        keyframes: [{ x: from.x + (to.x - from.x) * 0.5, y: peak, duration: 0.32 }, { x: to.x, y: to.y, duration: 0.32 }],
        ease: "steps(5)", onUpdate: place,
      })
      .to(goat, { rotate: -12 * dir * (far ? 1 : 0), scale: to.s, duration: 0.3, ease: "steps(3)", onUpdate: () => root.style.setProperty("--s", gsap.getProperty(goat, "scaleX")) }, "<")
      .to(shadow, { scale: to.s * 0.4, opacity: 0.15, duration: 0.32, ease: "steps(4)" }, "<")
      .to(goat, { rotate: 0, duration: 0.3, ease: "steps(3)" }, "<0.32")
      .to(shadow, { scale: to.s, opacity: 0.5, duration: 0.3, ease: "steps(4)" }, "<")
      .to(leg, { rotate: 0, duration: 0.1, ease: "steps(1)" }, "<0.2")
      // aterriza
      .to(goat, { scaleY: to.s * 0.84, duration: 0.07, ease: "steps(1)" })
      .to(goat, { scaleY: to.s, duration: 0.12, ease: "steps(2)" })
      .set(flip, { scaleX: to.face })
      .call(() => { state.s = to.s; state.face = to.face; root.style.setProperty("--s", to.s); bubbleSide(); });
    if (talk) tl.add(wave(), ">-0.05").call(() => say(LINES[key]), null, "<").add(nod(), "<0.3");
    state.busy = tl;
  }

  /* ---------- idle: respira + baila con la música ---------- */
  gsap.timeline({ repeat: -1, yoyo: true }).to(".m-body, .m-head, .m-arm, .m-leg", { y: -1.5, duration: 0.9, ease: "sine.inOut" });
  gsap.timeline({ repeat: -1, repeatDelay: 4 }).to(head, { rotate: 6, duration: 0.15, ease: "steps(2)" }).to(head, { rotate: 0, duration: 0.15, ease: "steps(2)" }, "+=0.6");
  gsap.ticker.add(() => {
    const b = (window.AUDIO && window.AUDIO.playing && window.AUDIO.bass) || 0;
    gsap.set(flip, { y: -b * 8 });
  });

  /* ---------- interacción ---------- */
  let r = 0;
  root.addEventListener("click", () => {
    if (state.busy && state.busy.isActive()) return;
    say(RANDOM[r++ % RANDOM.length], 2.2);
    state.busy = gsap.timeline().add(hop()).add(nod(), "<");
  });
  root.addEventListener("pointerenter", () => { if (!state.busy || !state.busy.isActive()) wave(); });

  /* ---------- arranque (después de la intro) ---------- */
  const keys = Object.keys(SPOTS);
  function start() {
    root.classList.add("live");
    const s0 = spot("top");
    state.s = s0.s; setScale(s0.s);
    state.x = innerWidth + 150; state.y = s0.y; place();
    gsap.set(flip, { scaleX: -1 });
    if (reduced) { state.x = s0.x; place(); say(LINES.top); return; }
    jumpTo("top");
    keys.forEach((k) => {
      const el = k === "top" ? $(".hero") : document.getElementById(k);
      if (!el || !window.ScrollTrigger) return;
      ScrollTrigger.create({ trigger: el, start: "top 55%", end: "bottom 55%", onEnter: () => jumpTo(k), onEnterBack: () => jumpTo(k) });
    });
  }
  addEventListener("resize", () => {
    if (!state.key) return;
    const to = spot(state.key); state.x = to.x; state.y = to.y; state.s = to.s; setScale(to.s); place(); bubbleSide();
  });
  window.MASCOT = { start, say, jumpTo };
})();
