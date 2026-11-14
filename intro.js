/* =========================================================
   INTRO "CRUDA" — stop-motion con la cabra del logo
   saluda → gol → celebra → triple → foto → se ríe → página
   + música (botón Entrar) + reproductor fijo con ecualizador
   ========================================================= */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const intro = $("#intro");
  const audio = $("#music");
  window.AUDIO = { level: 0, bass: 0, playing: false };

  /* ---------------- AUDIO ----------------
     La música suena directo desde <audio> (sin Web Audio) para que
     funcione en todos los navegadores, incluido iPhone/Safari.
     Las barras y el "latido" de la cámara se simulan al ritmo. */
  const BPM = 140;
  function playMusic() {
    if (!audio) return Promise.resolve(false);
    audio.muted = false;
    audio.volume = 0.8;
    const p = audio.play();
    return p && p.then ? p.then(() => true).catch((e) => { console.warn("No se pudo reproducir la música:", e); syncBtn(); return false; }) : Promise.resolve(true);
  }
  const soundBtn = $(".sound");
  function syncBtn() {
    const on = audio && !audio.paused;
    window.AUDIO.playing = on;
    if (!soundBtn) return;
    soundBtn.classList.toggle("on", on);
    soundBtn.setAttribute("aria-label", on ? "Pausar música" : "Reproducir música");
    soundBtn.querySelector("span").textContent = audio && audio.dataset.err ? "Sin audio" : on ? "Sonido on" : "Sonido off";
  }
  if (audio) {
    ["play", "playing", "pause", "ended"].forEach((ev) => audio.addEventListener(ev, syncBtn));
    audio.addEventListener("error", () => { audio.dataset.err = "1"; console.warn("No se encontró el archivo de música"); syncBtn(); }, true);
  }
  soundBtn && soundBtn.addEventListener("click", () => { if (audio.paused) playMusic(); else audio.pause(); });
  const bars = $$(".sound i");
  (function meter() {
    requestAnimationFrame(meter);
    const playing = audio && !audio.paused;
    let bass = 0;
    if (playing) {
      const t = audio.currentTime, ph = ((t * BPM) / 60) % 1;
      bass = Math.pow(1 - ph, 3);
      bars.forEach((b, i) => (b.style.transform = `scaleY(${(0.2 + Math.abs(Math.sin(t * (2.3 + i * 0.7) + i)) * 0.5 + bass * 0.3).toFixed(3)})`));
    } else bars.forEach((b) => (b.style.transform = "scaleY(.15)"));
    window.AUDIO.bass += (bass * 0.9 - window.AUDIO.bass) * 0.4;
    window.AUDIO.level = window.AUDIO.bass;
  })();

  if (!intro) return;
  const done = () => {
    if (intro.dataset.done) return;
    intro.dataset.done = "1";
    gsap.ticker.fps(60);
    clearInterval(boilTimer);
    intro.remove();
    document.body.classList.remove("is-loading");
    window.MV_HERO_IN && window.MV_HERO_IN();
  };

  if (!window.gsap || matchMedia("(prefers-reduced-motion: reduce)").matches) {
    $("[data-enter]").addEventListener("click", () => { playMusic(); intro.remove(); document.body.classList.remove("is-loading"); window.MV_HERO_IN && window.MV_HERO_IN(); });
    $("[data-enter-mute]").addEventListener("click", () => { intro.remove(); document.body.classList.remove("is-loading"); window.MV_HERO_IN && window.MV_HERO_IN(); });
    return;
  }

  /* ---------------- ESCALA DEL ESCENARIO (1000x800 virtual) ---------------- */
  const stageEl = $(".s2d");
  function fit() {
    const k = Math.min(innerWidth / 1000, innerHeight / 800) * (innerWidth < innerHeight ? 0.98 : 0.95);
    stageEl.style.transform = `translate(-50%, -50%) scale(${k})`;
  }
  fit(); addEventListener("resize", fit);

  /* ---------------- TEXTURA: líneas que hierven + parpadeo + rayones ---------------- */
  const turb = $("#boil feTurbulence"), film = $(".film"), scratches = $$(".scratch");
  let seed = 1;
  const boilTimer = setInterval(() => {
    turb && turb.setAttribute("seed", String((seed = (seed % 9) + 1)));
    film.style.opacity = (0.9 + Math.random() * 0.1).toFixed(2);
    scratches.forEach((s) => {
      const show = Math.random() < 0.25;
      s.style.opacity = show ? (0.2 + Math.random() * 0.5).toFixed(2) : 0;
      if (show) s.style.left = (Math.random() * 100).toFixed(1) + "%";
    });
  }, 90);

  /* ---------------- TIMELINE ---------------- */
  const tc = $("#tc"), scene = $("#scene");
  const stamp = $("#stamp");
  const S = (txt, opts = {}) => {
    const tl = gsap.timeline();
    tl.call(() => { stamp.textContent = txt; stamp.className = "stamp " + (opts.cls || ""); })
      .fromTo(stamp, { opacity: 0, scale: opts.from || 1.8, rotate: opts.rot || -6 }, { opacity: 1, scale: 1, duration: 0.25, ease: "steps(3)" })
      .to(stamp, { x: "+=6", yoyo: true, repeat: 5, duration: 0.05, ease: "steps(1)" }, ">")
      .to(stamp, { opacity: 0, duration: 0.15, ease: "steps(2)" }, `+=${opts.hold || 0.5}`);
    return tl;
  };
  const shake = (n = 6, a = 10) => {
    const tl = gsap.timeline();
    for (let i = 0; i < n; i++) tl.to(stageEl.parentNode, { x: gsap.utils.random(-a, a), y: gsap.utils.random(-a, a), duration: 0.05, ease: "steps(1)" });
    return tl.to(stageEl.parentNode, { x: 0, y: 0, duration: 0.05, ease: "steps(1)" });
  };
  const flash = (o = 1) => gsap.timeline().set(".flash", { opacity: o }).to(".flash", { opacity: 0, duration: 0.35, ease: "steps(4)" });
  const cut = () => gsap.timeline().set(".blackout", { opacity: 1 }).to(".blackout", { opacity: 0, duration: 0.01 }, "+=0.12");
  const draw = (sel, d = 0.5) => gsap.fromTo(sel, { strokeDashoffset: 600 }, { strokeDashoffset: 0, duration: d, ease: "steps(6)" });

  const G = ".goat", head = ".g-head", arm = ".g-arm", leg = ".g-leg", body = ".g-body";
  gsap.set(".props > *:not(.floor)", { opacity: 0 });
  gsap.set($$(".props [data-draw]"), { strokeDasharray: 600 });

  const tl = gsap.timeline({ paused: true, onComplete: done, onUpdate: () => {
    const t = tl.time(), f = Math.floor((t % 1) * 24);
    tc.textContent = `00:00:${String(Math.floor(t)).padStart(2, "0")}:${String(f).padStart(2, "0")}`;
  } });

  tl
    // 1 · ENTRA SALUDANDO
    .call(() => (scene.textContent = "ESC 01 — HOLA"))
    .fromTo(G, { x: -700 }, { x: 0, duration: 1.1, ease: "steps(8)" })
    .to(G, { y: -14, yoyo: true, repeat: 7, duration: 0.07, ease: "steps(1)" }, "<")
    .to(arm, { rotate: -28, duration: 0.15, ease: "steps(2)" })
    .to(arm, { rotate: 8, yoyo: true, repeat: 5, duration: 0.16, ease: "steps(2)" })
    .add(S("HOLA.", { hold: 0.4 }), "<")
    .to(head, { rotate: -8, yoyo: true, repeat: 3, duration: 0.12, ease: "steps(2)" }, "<0.1")
    .to(arm, { rotate: 0, duration: 0.15, ease: "steps(2)" })

    // 2 · GOL
    .call(() => (scene.textContent = "ESC 02 — FÚTBOL"))
    .set(".goal, .ball", { opacity: 1 })
    .add(draw(".goal [data-draw]", 0.45))
    .fromTo(".ball", { x: 300, rotate: 0 }, { x: 0, rotate: -360, duration: 0.5, ease: "steps(6)", immediateRender: false }, "<")
    .to(leg, { rotate: 22, duration: 0.18, ease: "steps(2)" }, "+=0.1")
    .to(leg, { rotate: -38, duration: 0.1, ease: "steps(1)" })
    .to(".ball", { keyframes: [{ x: 160, y: -120 }, { x: 330, y: -150 }, { x: 450, y: -70 }], rotate: 720, duration: 0.45, ease: "steps(6)" }, "<")
    .to(leg, { rotate: 0, duration: 0.2, ease: "steps(2)" }, "<0.15")
    .to(".net-g", { x: 18, scaleY: 1.06, duration: 0.08, ease: "steps(1)", transformOrigin: "100% 50%" }, "-=0.08")
    .add(flash(0.7), "<")
    .add(shake(8, 14), "<")
    .add(S("GOOOL", { cls: "big", hold: 0.6 }), "<")
    .to(".net-g", { x: 0, scaleY: 1, duration: 0.3, ease: "steps(3)" }, "<0.2")
    // celebra
    .to(G, { y: -70, yoyo: true, repeat: 3, duration: 0.14, ease: "steps(2)" }, "<0.1")
    .to(arm, { rotate: -35, yoyo: true, repeat: 3, duration: 0.14, ease: "steps(2)" }, "<")
    .to(head, { rotate: 10, yoyo: true, repeat: 5, duration: 0.09, ease: "steps(1)" }, "<")

    // 3 · TRIPLE
    .add(cut())
    .call(() => (scene.textContent = "ESC 03 — BÁSQUET"))
    .set(".goal, .ball", { opacity: 0 })
    .set(".ball", { x: 0, y: 0 })
    .set(".hoop, .bball, .three", { opacity: 1 })
    .add(draw(".hoop [data-draw], .three [data-draw]", 0.4))
    .fromTo(".bball", { y: 260 }, { y: 0, duration: 0.3, ease: "steps(4)", immediateRender: false }, "<")
    .to(G, { scaleY: 0.92, transformOrigin: "50% 100%", duration: 0.15, ease: "steps(2)" }, "+=0.1")
    .to(G, { scaleY: 1, y: -130, duration: 0.25, ease: "steps(3)" })
    .to(head, { rotate: -25, duration: 0.1, ease: "steps(1)" }, "<0.1")
    .to(".bball", { keyframes: [{ x: 110, y: -230 }, { x: 230, y: -330 }, { x: 330, y: -260 }, { x: 368, y: -110 }, { x: 372, y: -15 }], rotate: 540, duration: 0.85, ease: "steps(10)" }, "<")
    .to(G, { y: 0, duration: 0.25, ease: "steps(3)" }, "<0.3")
    .to(head, { rotate: 0, duration: 0.15, ease: "steps(2)" }, "<")
    .to(".net-b", { scaleY: 1.25, transformOrigin: "50% 0%", yoyo: true, repeat: 1, duration: 0.1, ease: "steps(1)" }, "-=0.25")
    .add(S("+3", { cls: "big", hold: 0.5, rot: 4 }), "<")
    .add(shake(5, 8), "<")
    .to(".bball", { y: 60, duration: 0.2, ease: "steps(2)" }, "<0.1")
    .to(G, { y: -50, yoyo: true, repeat: 1, duration: 0.12, ease: "steps(2)" }, "<")
    .to(arm, { rotate: -30, yoyo: true, repeat: 1, duration: 0.12, ease: "steps(2)" }, "<")

    // 4 · FOTO + RISA
    .add(cut(), "+=0.25")
    .call(() => (scene.textContent = "ESC 04 — CLICK"))
    .set(".hoop, .bball, .three", { opacity: 0 })
    .set(G, { x: 150, y: 0, scale: 1.18, transformOrigin: "50% 100%" })
    .to(arm, { rotate: -12, y: -18, duration: 0.25, ease: "steps(3)" })
    .add(S("3… 2… 1…", { hold: 0.35, from: 1.2, rot: 0 }), "<")
    .add(flash(1), "+=0.15")
    .set(".polaroid", { opacity: 1 }, "<")
    .fromTo(".polaroid", { scale: 1.3, rotate: 0 }, { scale: 1, rotate: -4, duration: 0.25, ease: "steps(3)" }, "<")
    .set(".s2d", { filter: "grayscale(1) contrast(1.3)" }, "<")
    .add(shake(4, 6), "<")
    .add(S("CLICK", { cls: "big", hold: 0.35 }), "<0.05")
    // se ríe
    .to(head, { rotate: -14, yoyo: true, repeat: 9, duration: 0.07, ease: "steps(1)" }, "+=0.05")
    .to(G, { y: -10, yoyo: true, repeat: 9, duration: 0.07, ease: "steps(1)" }, "<")
    .add(S("JAJAJA", { hold: 0.55, rot: 3 }), "<")
    // logo + obturador
    .set(".polaroid, .goat", { opacity: 0 }, "+=0.15")
    .set(".final-logo", { opacity: 1 }, "<")
    .fromTo(".final-logo", { scale: 1.2 }, { scale: 1, duration: 0.3, ease: "steps(3)" }, "<")
    .add(flash(0.5), "<")
    .to("#intro", { clipPath: "circle(0% at 50% 50%)", duration: 0.7, ease: "steps(7)" }, "+=0.6");

  /* ---------------- ARRANQUE ---------------- */
  function start(withSound) {
    if (withSound) playMusic();
    gsap.ticker.fps(14); // stop-motion
    gsap.to(".gate", { opacity: 0, duration: 0.3, ease: "steps(3)", onComplete: () => $(".gate").remove() });
    gsap.set(".film", { visibility: "visible" });
    tl.play(0);
  }
  $("[data-enter]").addEventListener("click", () => start(true));
  $("[data-enter-mute]").addEventListener("click", () => start(false));
  $(".intro-skip").addEventListener("click", () => {
    if ($(".gate")) { playMusic(); }
    tl.progress(1);
    done();
  });
  gsap.from(".gate > *", { opacity: 0, y: 12, stagger: 0.12, duration: 0.8, ease: "steps(5)" });
})();
