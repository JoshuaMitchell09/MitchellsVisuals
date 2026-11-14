(() => {
  const S = window.SITE;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = (t = "") => String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const img = (src, alt, label = "") => (src ? `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" />` : `<div class="ph">${label}</div>`);
  const pad = (i) => String(i + 1).padStart(2, "0");

  /* ================= CONTENIDO ================= */
  $("#hero-sub").textContent = S.hero.subtitle;
  $("#about-lead").textContent = S.about.lead;
  const bodies = [].concat(S.about.body || []);
  $("#about-body").outerHTML = bodies.map((t) => `<p class="body">${esc(t)}</p>`).join("") +
    (S.about.highlights && S.about.highlights.length
      ? `<ul class="highlights">${S.about.highlights.map((h) => { const [k, v] = h.split("|"); return `<li><span class="mono">${esc(k)}</span><b>${esc(v || "")}</b></li>`; }).join("")}</ul>`
      : "");
  $("#about-photo").innerHTML = img(S.about.photo, "Mitchell", "TU FOTO AQUÍ") +
    (S.about.photo && S.about.photoHover ? `<img class="alt" src="${esc(S.about.photoHover)}" alt="" loading="lazy" />` : "");
  $(".about-photo").addEventListener("click", () => $(".about-photo").classList.toggle("swap"));
  $("#stats").innerHTML = S.about.stats
    .map((s) => `<div class="stat"><b data-count="${s.value}" data-suffix="${esc(s.suffix)}">0${esc(s.suffix)}</b><span>${esc(s.label)}</span></div>`)
    .join("");

  $("#services").innerHTML = S.services
    .map((s, i) => `<article class="service"><span class="num mono">${pad(i)}</span><h3>${esc(s.title)}</h3><p>${esc(s.desc)}</p><i>→</i></article>`)
    .join("");

  $("#clients").innerHTML = S.clients
    .map((c) => {
      const tag = c.link ? "a" : "div";
      const href = c.link ? ` href="${esc(c.link)}" target="_blank" rel="noopener"` : "";
      const visual = c.image ? img(c.image, c.name) : `<div class="ph client-ph"><b>${esc(c.name)}</b></div>`;
      return `<${tag} class="client"${href}>${visual}<div class="info"><h4>${esc(c.name)}</h4><span class="mono">${esc(c.type)}</span></div></${tag}>`;
    })
    .join("");

  $("#portals").innerHTML = S.portfolio
    .map((p, i) => {
      const live = !p.soon && p.url;
      const tag = live ? "a" : "div";
      const href = live ? ` href="${esc(p.url)}" target="_blank" rel="noopener"` : "";
      return `<${tag} class="portal${p.soon ? " soon" : ""}"${href}><div class="bg">${img(p.cover, p.title)}</div>
        <span class="label mono">${pad(i)} — ${p.soon ? "Próximamente" : "Disponible"}</span>
        <h3>${esc(p.title)}</h3><p>${esc(p.desc)}</p>
        <span class="go">${p.soon ? "Muy pronto" : "Abrir portafolio"} <i>→</i></span></${tag}>`;
    })
    .join("");

  $("#contact-links").innerHTML = S.contact
    .map((c) => `<a class="contact-link" href="${esc(c.url)}" target="_blank" rel="noopener"><small>${esc(c.label)}</small><b>${esc(c.value)}</b></a>`)
    .join("");

  $("#year").textContent = new Date().getFullYear();
  if (S.gear && S.gear.kit) {
    $("#kit-grid").innerHTML = S.gear.kit
      .map((g, i) => `<div class="kit-col"><span class="mono">${pad(i)} — ${esc(g.cat)}</span><ul>${g.items.map((it) => `<li>${esc(it)}</li>`).join("")}</ul></div>`)
      .join("");
  }

  $$("[data-split]").forEach((el) => {
    el.innerHTML = [...el.textContent].map((c) => (c === " " ? " " : `<span class="char">${esc(c)}</span>`)).join("");
  });

  const clock = $("#clock");
  const tick = () => (clock.textContent = new Date().toLocaleTimeString("es", { hour12: false }));
  tick(); setInterval(tick, 1000);

  // Menú móvil
  $(".nav-burger").addEventListener("click", () => document.body.classList.toggle("menu-open"));
  $$(".nav-links a").forEach((a) => a.addEventListener("click", () => document.body.classList.remove("menu-open")));

  /* ================= SIN GSAP ================= */
  if (!window.gsap || reduced) {
    window.MV_HERO_IN = () => window.MASCOT && MASCOT.start();
    $$("[data-count]").forEach((b) => (b.textContent = b.dataset.count + b.dataset.suffix));
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  /* ================= HERO ================= */
  gsap.set(".hero-title .char", { yPercent: 105 });
  gsap.set(".hero .reveal-up", { y: 20, opacity: 0 });
  gsap.set(".nav, .hero-meta", { opacity: 0 });

  window.MV_HERO_IN = heroIn;
  function heroIn() {
    window.MASCOT && MASCOT.start();
    gsap.timeline({ defaults: { ease: "expo.out" } })
      .to(".hero-title .char", { yPercent: 0, duration: 0.5, ease: "steps(4)", stagger: { each: 0.05, from: "random" } })
      .to(".hero .reveal-up", { y: 0, opacity: 1, duration: 1.2, stagger: 0.1 }, 0.35)
      .to(".nav, .hero-meta", { opacity: 1, duration: 1.2 }, 0.6);
    ScrollTrigger.refresh();
  }
  gsap.to(".hero-inner", { yPercent: 20, opacity: 0, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

  /* ================= SCROLL ================= */
  gsap.to(".scroll-bar", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });
  ScrollTrigger.create({ start: 60, onToggle: (s) => $(".nav").classList.toggle("scrolled", s.isActive) });

  const up = (targets, trigger, extra = {}) =>
    gsap.from(targets, { y: 40, opacity: 0, duration: 1.2, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger, start: "top 85%" }, ...extra });

  $$(".section-title, .contact-title [data-split]").forEach((el) =>
    gsap.from(el.querySelectorAll(".char"), {
      opacity: 0, yPercent: () => gsap.utils.random(-40, 40), rotate: () => gsap.utils.random(-14, 14),
      duration: 0.45, ease: "steps(3)", stagger: { each: 0.045, from: "random" },
      scrollTrigger: { trigger: el, start: "top 88%" },
    })
  );
  // Fotos: se "revelan" como una exposición (sobreexpuesta → normal, a saltos)
  const expose = (targets, trigger) =>
    gsap.fromTo(targets, { filter: "brightness(3.2) contrast(0.5) blur(8px)" }, {
      filter: "brightness(1) contrast(1) blur(0px)", duration: 0.9, ease: "steps(7)", stagger: 0.08,
      scrollTrigger: { trigger, start: "top 82%" }, clearProps: "filter",
    });
  expose(".about-photo .frame img:not(.alt)", ".about");
  expose(".client img", ".clients-grid");
  expose(".portal .bg img", ".portals");
  $$(".section-head .idx").forEach((el) => up(el, el));

  // Sobre mí
  gsap.fromTo(".about-photo .frame", { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.inOut", scrollTrigger: { trigger: ".about", start: "top 75%" } });
  gsap.to(".about-photo .frame img", { yPercent: -10, ease: "none", scrollTrigger: { trigger: ".about", scrub: true } });
  up(".about-text > *", ".about-text");
  $$("[data-count]").forEach((b) => {
    const o = { v: 0 };
    gsap.to(o, { v: +b.dataset.count, duration: 2, ease: "power3.out", onUpdate: () => (b.textContent = Math.round(o.v) + b.dataset.suffix), scrollTrigger: { trigger: b, start: "top 92%" } });
  });

  // Kit
  up(".kit-col", ".kit-grid", { stagger: 0.1 });

  // Servicios
  up(".service", ".services-list", { stagger: 0.07 });

  // Clientes
  up(".client", ".clients-grid", { y: 30, stagger: 0.05 });
  up(".section-intro", ".section-intro");

  // Portafolio
  up(".portal", ".portals", { y: 60, stagger: 0.12 });

  // Contacto
  up(".contact .eyebrow", ".contact");
  up(".contact-link", ".contact-links");

  /* ================= INTERACCIÓN ================= */
  if (matchMedia("(hover: hover)").matches) {
    $$(".magnetic").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * 0.2, y: (e.clientY - r.top - r.height / 2) * 0.3, duration: 0.5, ease: "power3" });
      });
      el.addEventListener("pointerleave", () => gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "power3" }));
    });
  }
})();
