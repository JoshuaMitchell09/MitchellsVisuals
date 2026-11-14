(() => {
  const S = window.SITE;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = (t = "") => String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const img = (src, alt, label) => (src ? `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" />` : `<div class="ph">${label}</div>`);

  /* ================= RENDER CONTENT ================= */
  const ICONS = {
    portrait: '<circle cx="24" cy="17" r="8"/><path d="M8 42c2-9 9-13 16-13s14 4 16 13"/><path d="M4 12V4h8M36 4h8v8M44 36v8h-8M12 44H4v-8"/>',
    event: '<path d="M6 40 24 8l18 32z"/><circle cx="24" cy="30" r="4"/><path d="M14 26 4 20M34 26l10-6M24 8V2"/>',
    product: '<path d="m24 4 18 10v20L24 44 6 34V14z"/><path d="m6 14 18 10 18-10M24 24v20"/>',
    action: '<path d="M4 28h10l6-16 8 26 6-14h10"/><circle cx="40" cy="10" r="4"/>',
    social: '<rect x="12" y="4" width="24" height="40" rx="4"/><circle cx="24" cy="24" r="6"/><path d="M20 39h8"/>',
    video: '<rect x="4" y="12" width="30" height="24" rx="2"/><path d="m34 20 10-6v20l-10-6"/><path d="m16 19 8 5-8 5z"/>',
  };

  $("#hero-sub").textContent = S.hero.subtitle;
  $("#about-lead").textContent = S.about.lead;
  $("#about-body").textContent = S.about.body;
  $("#about-tag").textContent = S.about.tag;
  $("#about-photo").innerHTML = img(S.about.photo, "Mitchell", "TU FOTO AQUÍ<br/>assets/img/");
  $("#stats").innerHTML = S.about.stats
    .map((s) => `<div class="stat"><b data-count="${s.value}" data-suffix="${esc(s.suffix)}">0${esc(s.suffix)}</b><span>${esc(s.label)}</span></div>`)
    .join("");

  $("#services").innerHTML = S.services
    .map((s, i) => `<article class="service tilt"><span class="num mono">0${i + 1}</span>
      <svg viewBox="0 0 48 48">${ICONS[s.icon] || ICONS.portrait}</svg>
      <h3>${esc(s.title)}</h3><p>${esc(s.desc)}</p><span class="bar"></span></article>`)
    .join("");

  $("#clients").innerHTML = S.clients
    .map((c) => {
      const tag = c.link ? "a" : "div";
      const href = c.link ? ` href="${esc(c.link)}" target="_blank" rel="noopener"` : "";
      return `<${tag} class="client"${href}>${img(c.image, c.name, "FOTO DEL CLIENTE")}<span class="scan"></span>
        <div class="info"><span class="mono">${esc(c.type)}</span><h4>${esc(c.name)}</h4></div></${tag}>`;
    })
    .join("");

  $("#portals").innerHTML = S.portfolio
    .map((p, i) => {
      const live = !p.soon && p.url;
      const tag = live ? "a" : "div";
      const href = live ? ` href="${esc(p.url)}" target="_blank" rel="noopener"` : "";
      const ring = p.soon
        ? `<svg class="ring" viewBox="0 0 100 100"><defs><path id="rp${i}" d="M50 50m-38 0a38 38 0 1 1 76 0a38 38 0 1 1-76 0"/></defs><text><textPath href="#rp${i}" textLength="236" lengthAdjust="spacing">PRÓXIMAMENTE • PRÓXIMAMENTE •</textPath></text></svg>`
        : "";
      return `<${tag} class="portal${p.soon ? " soon" : ""}"${href}><div class="bg">${img(p.cover, p.title, "")}</div>${ring}
        <span class="label mono">0${i + 1} / ${p.soon ? "EN CAMINO" : "DISPONIBLE"}</span>
        <h3>${esc(p.title)}</h3><p>${esc(p.desc)}</p>
        <span class="go">${p.soon ? "Muy pronto" : "Abrir portafolio"} <i>→</i></span></${tag}>`;
    })
    .join("");

  $("#contact-links").innerHTML = S.contact
    .map((c) => `<a class="contact-link magnetic" href="${esc(c.url)}" target="_blank" rel="noopener"><small>${esc(c.label)}</small><b>${esc(c.value)}</b></a>`)
    .join("");

  const mq = S.marquee.map((t) => `<span>${esc(t)}</span>`).join("");
  $("#marquee").innerHTML = mq + mq;
  $("#year").textContent = new Date().getFullYear();

  /* Split text into chars */
  $$("[data-split]").forEach((el) => {
    el.innerHTML = [...el.textContent].map((c) => (c === " " ? " " : `<span class="char">${esc(c)}</span>`)).join("");
  });

  /* Clock */
  const clock = $("#clock");
  setInterval(() => (clock.textContent = new Date().toLocaleTimeString("es", { hour12: false })), 1000);

  /* ================= NO GSAP FALLBACK ================= */
  if (!window.gsap || reduced) {
    $("#intro").remove();
    document.body.classList.remove("is-loading");
    $$("[data-count]").forEach((b) => (b.textContent = b.dataset.count + b.dataset.suffix));
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  /* ================= INTRO CANVAS: particles ================= */
  const ic = $("#intro-canvas");
  const ix = ic.getContext("2d");
  const field = { pull: 0, burst: 0 };
  let parts = [], iw, ih, introRAF;
  const dpr = Math.min(devicePixelRatio || 1, 2);
  function sizeIntro() {
    iw = ic.width = innerWidth * dpr; ih = ic.height = innerHeight * dpr;
    parts = Array.from({ length: Math.min(260, Math.floor(innerWidth / 5)) }, () => {
      const a = Math.random() * Math.PI * 2, r = (0.35 + Math.random() * 0.8) * Math.max(iw, ih) * 0.6;
      return { a, r, r0: r, s: (Math.random() * 0.004 + 0.001) * (Math.random() < 0.5 ? -1 : 1), z: Math.random() * 1.6 + 0.4, c: Math.random() < 0.7 ? "0,240,255" : Math.random() < 0.5 ? "139,92,255" : "255,43,214" };
    });
  }
  sizeIntro();
  function drawIntro() {
    ix.fillStyle = "rgba(2,3,6,0.28)";
    ix.fillRect(0, 0, iw, ih);
    const cx = iw / 2, cy = ih / 2;
    for (const p of parts) {
      p.a += p.s * (1 + field.pull * 4);
      const target = p.r0 * (1 - field.pull * 0.85) + field.burst * p.r0 * 2.2 * p.z;
      p.r += (target - p.r) * 0.08;
      const x = cx + Math.cos(p.a) * p.r, y = cy + Math.sin(p.a) * p.r * 0.75;
      ix.fillStyle = `rgba(${p.c},${0.35 + p.z * 0.35})`;
      ix.fillRect(x, y, p.z * dpr * (1 + field.burst * 2), p.z * dpr * (1 + field.burst * 2));
    }
    introRAF = requestAnimationFrame(drawIntro);
  }
  drawIntro();

  /* ================= INTRO TIMELINE ================= */
  const pct = $("#intro-pct"), status = $("#intro-status");
  const counter = { v: 0 };
  const words = ["INICIALIZANDO", "CALIBRANDO LENTE", "AJUSTANDO ISO", "ENFOCANDO", "LISTO"];
  const intro = gsap.timeline({ onComplete: finishIntro });

  intro
    .from(".intro-hud", { opacity: 0, duration: 0.6 })
    .from(".hud-corner", { scale: 2.4, opacity: 0, stagger: 0.08, duration: 0.6, ease: "expo.out" }, "<")
    .to(field, { pull: 1, duration: 2.6, ease: "power2.in" }, 0.2)
    .to(counter, {
      v: 100, duration: 2.6, ease: "power1.inOut",
      onUpdate() {
        const v = Math.round(counter.v);
        pct.textContent = String(v).padStart(3, "0");
        status.textContent = words[Math.min(words.length - 1, Math.floor(v / 21))];
      },
    }, 0.2)
    .to(".ring-prog", { strokeDashoffset: 0, duration: 2.6, ease: "power1.inOut" }, 0.2)
    // Scan-line reveal of the logo
    .set(".intro-scan", { opacity: 1 }, 0.9)
    .to(".intro-scan", { top: "0%", duration: 1.8, ease: "power2.inOut" }, 0.9)
    .fromTo(".l-base", { clipPath: "inset(100% -40% -40% -40%)" }, { clipPath: "inset(-40% -40% -40% -40%)", duration: 1.8, ease: "power2.inOut" }, 0.9)
    .to(".intro-scan", { opacity: 0, duration: 0.3 })
    // Glitch burst
    .add(glitch(), "-=0.1")
    .to(".intro-flash", { opacity: 0.9, duration: 0.08, yoyo: true, repeat: 1 }, "-=0.2")
    .to(field, { pull: 0, burst: 1, duration: 1.2, ease: "expo.out" }, "<")
    .to(".intro-ring", { scale: 1.6, opacity: 0, duration: 1, ease: "expo.out" }, "<")
    .to(".intro-logo", { scale: 1.08, duration: 0.9, ease: "power2.out", filter: "drop-shadow(0 0 40px rgba(0,240,255,.8))" }, "<")
    .to({}, { duration: 0.35 })
    // Logo flies toward camera and dissolves
    .to(".intro-logo", { scale: 7, opacity: 0, filter: "blur(18px)", duration: 0.9, ease: "power4.in" })
    .to(".intro-hud, .intro-skip", { opacity: 0, duration: 0.4 }, "<")
    // CRT shut-off
    .to("#intro", { clipPath: "inset(49.8% 0 49.8% 0)", duration: 0.45, ease: "power4.in" }, "-=0.25")
    .to("#intro", { clipPath: "inset(49.8% 50% 49.8% 50%)", duration: 0.3, ease: "power4.in" });

  function glitch() {
    const tl = gsap.timeline();
    for (let i = 0; i < 7; i++) {
      const dx = gsap.utils.random(-14, 14), dy = gsap.utils.random(-6, 6);
      tl.set(".l-cyan", { opacity: 0.9, x: dx, y: dy, clipPath: `inset(${gsap.utils.random(0, 70)}% 0 ${gsap.utils.random(0, 30)}% 0)` })
        .set(".l-mag", { opacity: 0.9, x: -dx, y: -dy, clipPath: `inset(${gsap.utils.random(0, 30)}% 0 ${gsap.utils.random(0, 70)}% 0)` })
        .set(".l-base", { x: gsap.utils.random(-4, 4), skewX: gsap.utils.random(-6, 6) })
        .to({}, { duration: 0.05 });
    }
    tl.set(".l-cyan, .l-mag", { opacity: 0, x: 0, y: 0 }).set(".l-base", { x: 0, skewX: 0 });
    return tl;
  }

  let done = false;
  function finishIntro() {
    if (done) return;
    done = true;
    cancelAnimationFrame(introRAF);
    $("#intro").remove();
    document.body.classList.remove("is-loading");
    heroIn();
  }
  $(".intro-skip").addEventListener("click", () => { intro.progress(1); });

  /* ================= HERO ================= */
  gsap.set(".hero-title .char", { yPercent: 110, rotateX: -80, opacity: 0 });
  gsap.set(".hero .reveal-up", { y: 30, opacity: 0 });
  gsap.set(".nav", { y: -80, opacity: 0 });
  gsap.set(".hero-meta", { opacity: 0 });

  function heroIn() {
    gsap.timeline({ defaults: { ease: "expo.out" } })
      .to(".hero-title .char", { yPercent: 0, rotateX: 0, opacity: 1, duration: 1.4, stagger: 0.045 })
      .to(".hero .reveal-up", { y: 0, opacity: 1, duration: 1.1, stagger: 0.12 }, 0.4)
      .to(".nav", { y: 0, opacity: 1, duration: 1 }, 0.5)
      .to(".hero-meta", { opacity: 1, duration: 1 }, 0.9)
      .from("#hero-canvas", { opacity: 0, duration: 2 }, 0);
    ScrollTrigger.refresh();
  }

  /* Hero neon grid + stars */
  const hc = $("#hero-canvas"), hx = hc.getContext("2d");
  let hw, hh, stars = [], t = 0, mx = 0, my = 0, heroVisible = true;
  function sizeHero() {
    hw = hc.width = hc.offsetWidth * dpr; hh = hc.height = hc.offsetHeight * dpr;
    stars = Array.from({ length: 140 }, () => ({ x: Math.random() * hw, y: Math.random() * hh * 0.55, r: Math.random() * 1.4 * dpr, tw: Math.random() * 6 }));
  }
  sizeHero();
  addEventListener("resize", () => { sizeHero(); if (!done) sizeIntro(); });
  addEventListener("pointermove", (e) => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; });
  new IntersectionObserver(([e]) => (heroVisible = e.isIntersecting)).observe(hc);

  function drawHero() {
    requestAnimationFrame(drawHero);
    if (!heroVisible) return;
    t += 0.006;
    hx.clearRect(0, 0, hw, hh);
    const horizon = hh * (0.58 + my * 0.04);
    const vx = hw * (0.5 - mx * 0.15);
    // stars
    for (const s of stars) {
      hx.fillStyle = `rgba(200,230,255,${0.25 + Math.sin(t * 3 + s.tw) * 0.25})`;
      hx.fillRect(s.x - mx * 20 * dpr, s.y, s.r, s.r);
    }
    // sun glow
    const g = hx.createRadialGradient(vx, horizon, 0, vx, horizon, hw * 0.45);
    g.addColorStop(0, "rgba(139,92,255,0.35)"); g.addColorStop(0.4, "rgba(0,240,255,0.08)"); g.addColorStop(1, "transparent");
    hx.fillStyle = g; hx.fillRect(0, 0, hw, hh);
    // horizon line
    hx.strokeStyle = "rgba(0,240,255,0.7)"; hx.lineWidth = 1.2 * dpr;
    hx.shadowColor = "#00f0ff"; hx.shadowBlur = 12 * dpr;
    hx.beginPath(); hx.moveTo(0, horizon); hx.lineTo(hw, horizon); hx.stroke();
    hx.shadowBlur = 0;
    // vertical lines
    hx.lineWidth = 1 * dpr;
    for (let i = -24; i <= 24; i++) {
      const xb = vx + i * hw * 0.09;
      hx.strokeStyle = `rgba(0,240,255,${0.28 - Math.abs(i) * 0.008})`;
      hx.beginPath(); hx.moveTo(vx + i * 6 * dpr, horizon); hx.lineTo(xb + (xb - vx) * 1.5, hh); hx.stroke();
    }
    // horizontal moving lines
    for (let i = 0; i < 18; i++) {
      const p = ((i + (t * 4) % 1) / 18);
      const y = horizon + Math.pow(p, 2.6) * (hh - horizon);
      hx.strokeStyle = `rgba(139,92,255,${p * 0.6})`;
      hx.beginPath(); hx.moveTo(0, y); hx.lineTo(hw, y); hx.stroke();
    }
  }
  drawHero();

  gsap.to(".hero-inner", { yPercent: 30, opacity: 0, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

  /* ================= SCROLL ANIMATIONS ================= */
  gsap.to(".scroll-bar", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });
  ScrollTrigger.create({ start: 80, onToggle: (s) => $(".nav").classList.toggle("scrolled", s.isActive) });

  $$(".section-title, .contact-title [data-split]").forEach((el) => {
    gsap.from(el.querySelectorAll(".char"), {
      yPercent: 120, rotate: 8, opacity: 0, stagger: 0.035, duration: 1.1, ease: "expo.out",
      scrollTrigger: { trigger: el, start: "top 85%" },
    });
  });
  // About
  gsap.from(".about-photo", { clipPath: "inset(0 0 100% 0)", duration: 1.6, ease: "expo.inOut", scrollTrigger: { trigger: ".about", start: "top 70%" } });
  gsap.from(".about-photo .frame > *", { scale: 1.4, duration: 2, ease: "expo.out", scrollTrigger: { trigger: ".about", start: "top 70%" } });
  gsap.to(".about-photo .frame img", { yPercent: -12, ease: "none", scrollTrigger: { trigger: ".about", scrub: true } });
  gsap.from(".about-text > *", { y: 50, opacity: 0, stagger: 0.15, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: ".about-text", start: "top 80%" } });
  $$("[data-count]").forEach((b) => {
    const o = { v: 0 };
    gsap.to(o, {
      v: +b.dataset.count, duration: 2.2, ease: "power3.out",
      onUpdate: () => (b.textContent = Math.round(o.v) + b.dataset.suffix),
      scrollTrigger: { trigger: b, start: "top 90%" },
    });
  });

  // Services: 3D flip-in
  gsap.from(".service", {
    rotateX: -70, y: 120, opacity: 0, transformOrigin: "50% 100%", stagger: { each: 0.1, grid: "auto", from: "start" },
    duration: 1.3, ease: "expo.out", scrollTrigger: { trigger: ".services-grid", start: "top 80%" },
  });

  // Clients: wipe reveal
  gsap.utils.toArray(".client").forEach((c, i) => {
    gsap.from(c, {
      clipPath: "inset(100% 0 0 0)", y: 60, duration: 1.3, ease: "expo.out", delay: (i % 3) * 0.12,
      scrollTrigger: { trigger: c, start: "top 90%" },
    });
  });

  // Portals
  gsap.utils.toArray(".portal").forEach((p, i) => {
    gsap.from(p, { x: i % 2 ? 120 : -120, opacity: 0, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: p, start: "top 85%" } });
  });

  // Contact
  gsap.from(".contact-link", { y: 60, opacity: 0, stagger: 0.1, duration: 1, ease: "expo.out", scrollTrigger: { trigger: ".contact-links", start: "top 90%" } });
  gsap.to(".grad .char", { backgroundPosition: "100% 0", duration: 3, repeat: -1, yoyo: true, ease: "sine.inOut" });

  // Marquee skew with scroll velocity
  const skew = gsap.quickTo(".marquee-track", "skewX", { duration: 0.5, ease: "power3" });
  ScrollTrigger.create({ onUpdate: (s) => skew(gsap.utils.clamp(-14, 14, s.getVelocity() / -250)) });

  /* ================= INTERACTIONS ================= */
  const fine = matchMedia("(hover: hover)").matches;
  if (fine) {
    // Cursor
    const cur = $(".cursor");
    const cx = gsap.quickTo(cur, "x", { duration: 0.35, ease: "power3" });
    const cy = gsap.quickTo(cur, "y", { duration: 0.35, ease: "power3" });
    addEventListener("pointermove", (e) => { cur.style.opacity = 1; cx(e.clientX); cy(e.clientY); });
    document.addEventListener("pointerover", (e) => cur.classList.toggle("hover", !!e.target.closest("a, button, .service, .client")));

    // Tilt + spotlight
    $$(".tilt").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        el.style.setProperty("--mx", px * 100 + "%"); el.style.setProperty("--my", py * 100 + "%");
        gsap.to(el, { rotateY: (px - 0.5) * 12, rotateX: (0.5 - py) * 12, transformPerspective: 900, duration: 0.6, ease: "power3" });
      });
      el.addEventListener("pointerleave", () => gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.9, ease: "elastic.out(1,0.5)" }));
    });

    // Magnetic buttons
    $$(".magnetic").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * 0.3, y: (e.clientY - r.top - r.height / 2) * 0.4, duration: 0.5, ease: "power3" });
      });
      el.addEventListener("pointerleave", () => gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1,0.4)" }));
    });

    // Hero letters react to cursor
    $$(".hero-title .char").forEach((c) => {
      c.addEventListener("pointerenter", () => gsap.fromTo(c, { y: 0 }, { y: -18, duration: 0.25, yoyo: true, repeat: 1, ease: "power2.out" }));
    });
  }

  // Mobile menu
  $(".nav-burger").addEventListener("click", () => document.body.classList.toggle("menu-open"));
  $$(".nav-links a").forEach((a) => a.addEventListener("click", () => document.body.classList.remove("menu-open")));
})();
