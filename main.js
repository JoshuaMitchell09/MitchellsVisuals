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
      return `<${tag} class="portal${p.soon ? " soon" : ""}${p.video ? " has-video" : ""}"${href}><div class="bg">${p.video ? `<video src="${esc(p.video)}" poster="${esc(p.cover || "")}" muted loop playsinline autoplay preload="metadata"></video>` : img(p.cover, p.title)}</div>
        <span class="label mono">${pad(i)} — ${p.soon ? "Próximamente" : "Disponible"}</span>
        <h3>${esc(p.title)}</h3><p>${esc(p.desc)}</p>
        <span class="go">${p.soon ? "Muy pronto" : "Abrir portafolio"} <i>→</i></span></${tag}>`;
    })
    .join("");

  // Videos de portada: solo se reproducen cuando se ven en pantalla
  const vids = $$(".portal video");
  if (vids.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { const v = e.target; if (e.isIntersecting) { v.muted = true; const pr = v.play(); pr && pr.catch(() => {}); } else v.pause(); }), { threshold: 0.15 });
    vids.forEach((v) => { v.pause(); io.observe(v); });
  }
  $("#contact-links").innerHTML = S.contact
    .map((c) => `<a class="contact-link" href="${esc(c.url)}" target="_blank" rel="noopener"><small>${esc(c.label)}</small><b>${esc(c.value)}</b></a>`)
    .join("");

  $("#year").textContent = new Date().getFullYear();

  // Franja "Han confiado en mí"
  const trust = S.clients.map((c) => `<span>${esc(c.name)}</span>`).join("");
  $("#trust-row").innerHTML = trust + trust;

  // Galería (se muestra con 3+ fotos)
  const G = S.gallery || [];
  if (G.length >= 3) {
    $("#gallery").innerHTML = G.map((g, i) => `<figure class="g-item" data-i="${i}"><img src="${esc(g.src)}" alt="${esc(g.title || "")}" loading="lazy" /><figcaption><span class="mono">${esc(g.cat || "")}</span>${esc(g.title || "")}</figcaption></figure>`).join("");
  } else { $("#trabajo").remove(); const nw = $(".nav-work"); nw && nw.remove(); }

  // Footer
  const navLinks = [["#equipo", "Equipo"], ["#sobre", "Sobre mí"], ["#servicios", "Servicios"], ["#clientes", "Clientes"], ["#portafolio", "Portafolio"]];
  const find = (l) => S.contact.find((c) => c.label.toLowerCase() === l) || null;
  const col = (t, items) => `<div><span class="mono">${t}</span>${items.filter(Boolean).map(([h2, l, ext]) => `<a href="${esc(h2)}"${ext ? ' target="_blank" rel="noopener"' : ""}>${esc(l)}</a>`).join("")}</div>`;
  const ig = find("instagram"), wa = find("whatsapp"), em = find("email"), pf = find("portafolio");
  $("#f-cols").innerHTML =
    col("Navegación", navLinks) +
    col("Contacto", [wa && [wa.url, wa.value, 1], em && [em.url, em.value, 1]]) +
    col("Redes", [ig && [ig.url, "Instagram", 1], pf && [pf.url, "Pixieset", 1]]);
  $("#nav-foot").innerHTML = [ig && `<a href="${esc(ig.url)}" target="_blank" rel="noopener">Instagram</a>`, wa && `<a href="${esc(wa.url)}" target="_blank" rel="noopener">WhatsApp</a>`].filter(Boolean).join("");
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
      .to(".nav, .hero-meta", { opacity: 1, duration: 1.2 }, 0.6)
      .fromTo(".hero-goat", { opacity: 0, y: 40, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, duration: 1.6, ease: "expo.out" }, 0.15);
    // la cabra del hero respira y de vez en cuando mastica
    gsap.to(".hero-goat", { y: -10, duration: 3.2, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1.8 });
    gsap.timeline({ repeat: -1, repeatDelay: 3.5, delay: 2.5 })
      .to(".hg-jaw", { y: "1.1%", duration: 0.14, ease: "sine.inOut", yoyo: true, repeat: 5 })
      .to(".hero-goat", { rotate: -2, duration: 0.5, ease: "sine.inOut", yoyo: true, repeat: 1 }, "+=0.6");
    ScrollTrigger.refresh();
  }
  gsap.to(".hero-goat", { yPercent: 12, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
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

/* ================= LIGHTBOX + CURSOR "VER" ================= */
(() => {
  const $ = (s) => document.querySelector(s), $$ = (s) => [...document.querySelectorAll(s)];
  const lb = $("#lightbox"); if (!lb) return;
  const items = $$(".g-item"), img = lb.querySelector("img"), cap = lb.querySelector("figcaption");
  let i = 0;
  const show = (n) => { if (!items.length) return; i = (n + items.length) % items.length; const it = items[i]; img.src = it.querySelector("img").src; cap.textContent = it.querySelector("figcaption").textContent; };
  const open = (n) => { show(n); lb.classList.add("open"); lb.setAttribute("aria-hidden", "false"); window.MV_LENIS && window.MV_LENIS.stop(); };
  const close = () => { lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true"); window.MV_LENIS && window.MV_LENIS.start(); };
  items.forEach((it, n) => it.addEventListener("click", () => open(n)));
  lb.querySelector(".lb-close").addEventListener("click", close);
  lb.querySelector(".lb-prev").addEventListener("click", () => show(i - 1));
  lb.querySelector(".lb-next").addEventListener("click", () => show(i + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
  addEventListener("keydown", (e) => { if (!lb.classList.contains("open")) return; if (e.key === "Escape") close(); if (e.key === "ArrowRight") show(i + 1); if (e.key === "ArrowLeft") show(i - 1); });
  let sx = 0; lb.addEventListener("touchstart", (e) => (sx = e.touches[0].clientX), { passive: true });
  lb.addEventListener("touchend", (e) => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) show(i + (dx < 0 ? 1 : -1)); });

  const cv = $(".cursor-view");
  if (!cv || !matchMedia("(hover: hover) and (pointer: fine)").matches || !window.gsap) return;
  const qx = gsap.quickTo(cv, "x", { duration: 0.35, ease: "power3" }), qy = gsap.quickTo(cv, "y", { duration: 0.35, ease: "power3" });
  addEventListener("pointermove", (e) => { qx(e.clientX); qy(e.clientY); });
  document.addEventListener("pointerover", (e) => {
    const t = e.target.closest(".g-item, a.portal");
    cv.classList.toggle("on", !!t);
    cv.textContent = t && t.classList.contains("portal") ? "Abrir" : "Ver";
  });
})();
