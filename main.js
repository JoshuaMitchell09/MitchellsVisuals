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

  // Servicios: pestañas
  const waL = (S.contact.find((c) => c.label.toLowerCase() === "whatsapp") || {}).url || "#contacto";
  $("#svc-tabs").innerHTML = S.services.map((s, i) => `<button class="tab" role="tab" type="button" data-i="${i}" aria-selected="${i === 0}">${esc(s.title)}</button>`).join("");
  const showSvc = (i) => {
    const s = S.services[i];
    $$("#svc-tabs .tab").forEach((t, k) => t.setAttribute("aria-selected", String(k === i)));
    $("#svc-panel").innerHTML = `<div><h3 class="tp-title">${esc(s.title)}</h3><p class="tp-desc">${esc(s.desc)}</p><a class="tp-cta" href="${esc(waL)}" target="_blank" rel="noopener">Cotizar por WhatsApp <span>→</span></a></div>
      <ul class="tp-inc"><span class="mono">Incluye</span>${(s.includes || []).map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`;
    window.gsap && gsap.from("#svc-panel > *", { y: 20, opacity: 0, duration: 0.6, stagger: 0.08, ease: "power3.out" });
  };
  $$("#svc-tabs .tab").forEach((t) => t.addEventListener("click", () => showSvc(+t.dataset.i)));
  showSvc(0);

  // Portafolio: fotos que cambian dentro de "PORTA[foto]FOLIO"
  const splitSrc = S.portfolio.map((p) => p.cover).filter(Boolean);
  $("#split-imgs").innerHTML = splitSrc.map((s, i) => `<img src="${esc(s)}" alt="" class="${i ? "" : "on"}" />`).join("");

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
      const media = p.video
        ? `<video src="${esc(p.video)}" poster="${esc(p.cover || "")}" muted loop playsinline autoplay preload="metadata"></video>`
        : img(p.cover, p.title);
      const badge = p.soon ? "Próximamente" : p.video ? "▶ Video" : "Galería";
      return `<${tag} class="pf-card${p.soon ? " soon" : ""}"${href}>
        <div class="pf-media">${media}</div>
        <div class="pf-top"><span class="pf-num">${pad(i)}</span><span class="pf-badge mono">${badge}</span></div>
        <div class="pf-bottom">
          <h3 class="pf-title">${esc(p.title)}</h3>
          <p class="pf-desc">${esc(p.desc)}</p>
          <span class="pf-go">${p.soon ? "Muy pronto" : "Ver galería"} <i>↗</i></span>
        </div>
      </${tag}>`;
    })
    .join("");
  $("#pf-count").textContent = `${String(S.portfolio.length).padStart(2, "0")} categorías`;

  // Videos de portada: solo se reproducen cuando se ven en pantalla
  const vids = $$(".pf-card video, .portal video");
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
    el.innerHTML = el.textContent.split(" ").map((w) => `<span class="word-wrap">${[...w].map((c) => `<span class="char">${esc(c)}</span>`).join("")}</span>`).join(" ");
  });

  const clock = $("#clock");
  const tick = () => (clock.textContent = new Date().toLocaleTimeString("es-CR", { hour: "2-digit", minute: "2-digit", hour12: false }));
  tick(); setInterval(tick, 1000);

  // Menú móvil
  $(".pill-menu").addEventListener("click", () => document.body.classList.toggle("menu-open"));
  $$(".menu-links a, .pill-cta").forEach((a) => a.addEventListener("click", () => document.body.classList.remove("menu-open")));
  addEventListener("keydown", (e) => e.key === "Escape" && document.body.classList.remove("menu-open"));

  /* ================= SIN GSAP ================= */
  if (!window.gsap || reduced) {
    window.MV_HERO_IN = () => window.MASCOT && MASCOT.start();
    $$("[data-count]").forEach((b) => (b.textContent = b.dataset.count + b.dataset.suffix));
    return;
  }
  gsap.registerPlugin(ScrollTrigger);



  /* ================= HERO ================= */
  gsap.set(".ed-name .char", { yPercent: 110 });
  gsap.set(".ed-sub, .ed-side, .ed-trust", { y: 20, opacity: 0 });
  gsap.set(".ed-nav", { opacity: 0 });
  gsap.set(".ed-hero .ed-glow", { scale: 0.4, opacity: 0, transformOrigin: "30% 60%" });

  window.MV_HERO_IN = heroIn;
  function heroIn() {
    window.MASCOT && MASCOT.start();
    gsap.timeline({ defaults: { ease: "expo.out" } })
      .to(".ed-hero .ed-glow", { scale: 1, opacity: 1, duration: 2.2, ease: "expo.out" }, 0)
      .to(".ed-name .char", { yPercent: 0, duration: 1.2, stagger: 0.04 }, 0.2)
      .to(".ed-sub, .ed-side, .ed-trust", { y: 0, opacity: 1, duration: 1.2, stagger: 0.1 }, 0.6)
      .to(".ed-nav", { opacity: 1, duration: 1 }, 0.5)
      .fromTo(".hero-goat", { opacity: 0, y: 40, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, duration: 1.6, ease: "expo.out" }, 0.15);
    // la cabeza a veces dice "meeeh" (con sonido si la música está activa)
    let mehN = 0;
    const heroMeh = () => {
      const visible = scrollY < innerHeight * 0.6 && !document.hidden && !document.body.classList.contains("menu-open");
      if (visible) {
        window.SFX && SFX.play(mehN++ % 2 ? "meh-2" : "meh-1");
        const hgEl = $(".hero-goat"); hgEl.classList.add("colorful"); setTimeout(() => hgEl.classList.remove("colorful"), 1700);
        gsap.timeline()
          .to(".hg-jaw", { y: "2.6%", duration: 0.12, ease: "power2.out" })
          .to(".hero-goat", { rotate: 4, duration: 0.07, yoyo: true, repeat: 5, ease: "sine.inOut" }, 0)
          .fromTo(".hg-say", { autoAlpha: 0, scale: 0.6, y: 10 }, { autoAlpha: 1, scale: 1, y: 0, duration: 0.3, ease: "back.out(2.2)" }, 0)
          .to(".hg-jaw", { y: 0, duration: 0.25, ease: "power2.in" }, 0.6)
          .to(".hero-goat", { rotate: 0, duration: 0.2 }, 0.7)
          .to(".hg-say", { autoAlpha: 0, y: -8, duration: 0.3 }, 1.6);
      }
      gsap.delayedCall(gsap.utils.random(9, 16), heroMeh);
    };
    gsap.delayedCall(4.5, heroMeh);
    $(".hero-goat").style.pointerEvents = "auto";
    $(".hero-goat").addEventListener("click", () => { gsap.killTweensOf(heroMeh); heroMeh(); });
    // la cabra del hero respira y de vez en cuando mastica
    gsap.to(".hero-goat", { y: -10, duration: 3.2, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1.8 });
    gsap.timeline({ repeat: -1, repeatDelay: 3.5, delay: 2.5 })
      .to(".hg-jaw", { y: "1.1%", duration: 0.14, ease: "sine.inOut", yoyo: true, repeat: 5 })
      .to(".hero-goat", { rotate: -2, duration: 0.5, ease: "sine.inOut", yoyo: true, repeat: 1 }, "+=0.6");
    ScrollTrigger.refresh();
  }
  gsap.to(".ed-name", { yPercent: -30, ease: "none", scrollTrigger: { trigger: ".ed-hero", start: "top top", end: "bottom top", scrub: true } });
  gsap.to(".ed-hero .ed-glow", { yPercent: -18, ease: "none", scrollTrigger: { trigger: ".ed-hero", start: "top top", end: "bottom top", scrub: true } });

  /* Círculo negro que "traga" la pantalla antes de cada zona oscura */
  $$("[data-reveal]").forEach((zone) => {
    const prev = zone.previousElementSibling; if (!prev) return;
    prev.style.overflow = "hidden";
    const dot = document.createElement("div"); dot.className = "reveal-dot"; prev.appendChild(dot);
    gsap.fromTo(dot, { scale: 0 }, { scale: 1, ease: "power1.in", scrollTrigger: { trigger: prev, start: "bottom 98%", end: "bottom 0%", scrub: true } });
  });

  /* PORTA [foto] FOLIO: las palabras se separan y la foto crece */
  const imgs = $$("#split-imgs img");
  const cardW = () => Math.min(innerWidth * (innerWidth < 820 ? 0.78 : 0.3), 460);
  const shift = () => (innerWidth < 820 ? 0 : innerWidth * 0.03);
  gsap.timeline({ scrollTrigger: { trigger: ".ed-split", start: "top top", end: "bottom bottom", scrub: 0.6,
      onUpdate: (st) => { const k = Math.min(imgs.length - 1, Math.floor(st.progress * imgs.length * 1.2)); imgs.forEach((im, i) => im.classList.toggle("on", i === Math.max(0, k))); } } })
    .fromTo(".split-card", { width: 0, rotate: -8 }, { width: cardW, rotate: -3, ease: "power2.out", duration: 0.6 })
    .fromTo(".split-word.w1", { x: 0 }, { x: () => -shift(), ease: "power2.out", duration: 0.6 }, 0)
    .fromTo(".split-word.w2", { x: 0 }, { x: () => shift(), ease: "power2.out", duration: 0.6 }, 0)
    .to(".split-card", { rotate: 0, duration: 0.4 });

  /* Foto a pantalla completa con parallax */
  gsap.fromTo(".ed-full img", { yPercent: -8 }, { yPercent: 8, ease: "none", scrollTrigger: { trigger: ".ed-full", start: "top bottom", end: "bottom top", scrub: true } });

  /* ================= SCROLL ================= */
  gsap.to(".scroll-bar", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });
  ScrollTrigger.create({ start: 60, onToggle: (s) => $(".nav").classList.toggle("scrolled", s.isActive) });

  const up = (targets, trigger, extra = {}) =>
    gsap.from(targets, { y: 40, opacity: 0, duration: 1.2, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger, start: "top 85%" }, ...extra });

  $$(".ed-h2, .ed-mega, .ed-full-text h2").forEach((el) =>
    gsap.from(el.querySelectorAll(".char"), {
      yPercent: 110, duration: 1.1, ease: "expo.out", stagger: 0.025,
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
  expose(".pf-media img", ".pf-grid");
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

  // Clientes
  up(".client", ".clients-grid", { y: 30, stagger: 0.05 });

  // Portafolio
  up(".pf-card", ".pf-grid", { y: 80, stagger: 0.12 });
  up(".pf-head > *", ".pf-head");
  if (innerWidth > 820) gsap.utils.toArray(".pf-card").forEach((c, i) => gsap.fromTo(c.querySelector(".pf-media"), { yPercent: -6 }, { yPercent: 6, ease: "none", scrollTrigger: { trigger: c, start: "top bottom", end: "bottom top", scrub: true } }));

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
    const t = e.target.closest(".g-item, a.portal, a.pf-card");
    cv.classList.toggle("on", !!t);
    cv.textContent = t && (t.classList.contains("portal") || t.classList.contains("pf-card")) ? "Abrir" : "Ver";
  });
})();
