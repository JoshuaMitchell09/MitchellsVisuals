/* =========================================================
   STAGE 3D — Cámara estilo Sony α7 II que se arma / desarma
   con el scroll. Modelada 100% en código con Three.js.
   ========================================================= */
(() => {
  const THREE = window.THREE;
  const canvas = document.getElementById("stage");
  if (!THREE || !canvas) return;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  } catch (e) { canvas.remove(); return; }

  const S = window.SITE || {};
  const isMobile = () => innerWidth / innerHeight < 0.9;
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(32, 1, 0.1, 300);
  cam.position.set(0, 0, 16);

  /* ---------- Environment (reflejos neón) ---------- */
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = new THREE.Scene();
  env.add(new THREE.Mesh(new THREE.BoxGeometry(40, 40, 40), new THREE.MeshBasicMaterial({ color: 0x030406, side: THREE.BackSide })));
  const panel = (hex, k, w, h, pos) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(hex).multiplyScalar(k), side: THREE.DoubleSide }));
    m.position.set(...pos); m.lookAt(0, 0, 0); env.add(m);
  };
  panel(0xffffff, 3.2, 14, 6, [0, 16, 6]);
  panel(0xdfe9f0, 2.6, 4, 18, [-16, 2, 4]);
  panel(0xffffff, 2.2, 4, 18, [16, 0, 2]);
  panel(0x50555c, 2, 20, 4, [0, -14, -6]);
  scene.environment = pmrem.fromScene(env, 0.035).texture;

  /* ---------- Materials ---------- */
  const tex = (w, h, draw) => { const c = document.createElement("canvas"); c.width = w; c.height = h; draw(c.getContext("2d"), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; };
  const noise = tex(256, 256, (g, w, h) => { const d = g.createImageData(w, h); for (let i = 0; i < d.data.length; i += 4) { const v = 110 + Math.random() * 90; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; } g.putImageData(d, 0, 0); });
  noise.wrapS = noise.wrapT = THREE.RepeatWrapping; noise.repeat.set(4, 4); noise.colorSpace = THREE.NoColorSpace;
  const ribs = tex(512, 16, (g, w, h) => { for (let x = 0; x < w; x += 8) { g.fillStyle = "#fff"; g.fillRect(x, 0, 4, h); g.fillStyle = "#222"; g.fillRect(x + 4, 0, 4, h); } });
  ribs.wrapS = ribs.wrapT = THREE.RepeatWrapping; ribs.repeat.set(2, 1); ribs.colorSpace = THREE.NoColorSpace;

  const M = {
    body: new THREE.MeshPhysicalMaterial({ color: 0x0e0f12, roughness: 0.62, metalness: 0.1, clearcoat: 0.12, clearcoatRoughness: 0.7, envMapIntensity: 0.3, bumpMap: noise, bumpScale: 0.6 }),
    rubber: new THREE.MeshStandardMaterial({ color: 0x0d0d10, roughness: 0.9, metalness: 0.05, envMapIntensity: 0.5, bumpMap: noise, bumpScale: 2.5 }),
    ribbed: new THREE.MeshStandardMaterial({ color: 0x101114, roughness: 0.75, metalness: 0.2, envMapIntensity: 0.7, bumpMap: ribs, bumpScale: 4 }),
    metal: new THREE.MeshStandardMaterial({ color: 0xc9ccd4, roughness: 0.22, metalness: 1 }),
    dark: new THREE.MeshStandardMaterial({ color: 0x24262c, roughness: 0.35, metalness: 0.9 }),
    black: new THREE.MeshStandardMaterial({ color: 0x050506, roughness: 0.6, metalness: 0.2 }),
    glass: new THREE.MeshPhysicalMaterial({ color: 0x0b1a3a, roughness: 0.03, metalness: 0.1, clearcoat: 1, iridescence: 1, iridescenceIOR: 1.6, envMapIntensity: 2.4 }),
    lensEl: new THREE.MeshPhysicalMaterial({ color: 0xdfefff, roughness: 0.05, metalness: 0, transparent: true, opacity: 0.38, iridescence: 1, envMapIntensity: 2, side: THREE.DoubleSide, depthWrite: false }),
    sensor: new THREE.MeshPhysicalMaterial({ color: 0x29406e, roughness: 0.12, metalness: 1, iridescence: 1, iridescenceIOR: 2.0, iridescenceThicknessRange: [200, 900] }),
    cyan: new THREE.MeshBasicMaterial({ color: new THREE.Color(0x7cf3ff).multiplyScalar(0.9), toneMapped: false }),
    mag: new THREE.MeshBasicMaterial({ color: new THREE.Color(0xffffff).multiplyScalar(0.55), toneMapped: false }),
  };
  const pcbTex = tex(512, 320, (g, w, h) => {
    g.fillStyle = "#06261d"; g.fillRect(0, 0, w, h);
    g.strokeStyle = "#00f0ff"; g.globalAlpha = 0.8; g.lineWidth = 2;
    for (let i = 0; i < 70; i++) { g.beginPath(); let x = Math.random() * w, y = Math.random() * h; g.moveTo(x, y); for (let k = 0; k < 4; k++) { Math.random() < 0.5 ? (x += (Math.random() - 0.5) * 160) : (y += (Math.random() - 0.5) * 110); g.lineTo(x, y); } g.stroke(); }
    g.globalAlpha = 1; g.fillStyle = "#111"; g.fillRect(190, 110, 130, 100); g.fillStyle = "#00f0ff"; g.font = "bold 26px monospace"; g.fillText("BIONZ X", 198, 168);
  });
  M.pcb = new THREE.MeshStandardMaterial({ map: pcbTex, emissiveMap: pcbTex, emissive: new THREE.Color(0x66ffff), emissiveIntensity: 0.9, roughness: 0.5 });

  /* ---------- Live-view screen (tu foto + HUD) ---------- */
  const scr = document.createElement("canvas"); scr.width = 640; scr.height = 400;
  const sg = scr.getContext("2d");
  const screenTex = new THREE.CanvasTexture(scr); screenTex.colorSpace = THREE.SRGBColorSpace;
  const live = new Image(); live.src = (S.about && S.about.photo) || "";
  let flash = 0;
  function drawScreen(t) {
    const w = scr.width, h = scr.height;
    sg.fillStyle = "#000"; sg.fillRect(0, 0, w, h);
    if (live.complete && live.naturalWidth) {
      const z = 1.1 + Math.sin(t * 0.3) * 0.05, iw = w * z, ih = iw * (live.naturalHeight / live.naturalWidth);
      sg.globalAlpha = 0.95; sg.drawImage(live, (w - iw) / 2 + Math.sin(t * 0.2) * 12, -ih * 0.18, iw, ih); sg.globalAlpha = 1;
    }
    sg.strokeStyle = "rgba(255,255,255,.25)"; sg.lineWidth = 1;
    for (let i = 1; i < 3; i++) { sg.beginPath(); sg.moveTo((w / 3) * i, 0); sg.lineTo((w / 3) * i, h); sg.moveTo(0, (h / 3) * i); sg.lineTo(w, (h / 3) * i); sg.stroke(); }
    const fx = w * 0.5 + Math.sin(t * 0.8) * 30, fy = h * 0.4 + Math.cos(t * 0.6) * 20;
    sg.strokeStyle = Math.sin(t * 4) > 0 ? "#3dff6e" : "#00f0ff"; sg.lineWidth = 3;
    const b = 46; [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy]) => { sg.beginPath(); sg.moveTo(fx + sx * b, fy + sy * (b - 14)); sg.lineTo(fx + sx * b, fy + sy * b); sg.lineTo(fx + sx * (b - 14), fy + sy * b); sg.stroke(); });
    sg.fillStyle = "rgba(0,0,0,.55)"; sg.fillRect(0, h - 44, w, 44); sg.fillRect(0, 0, w, 36);
    sg.fillStyle = "#fff"; sg.font = "600 22px monospace";
    sg.fillText("1/250   F2.8   ISO 800   ±0.0", 18, h - 15);
    sg.fillText("M", 18, 26); sg.fillText("RAW", 70, 26);
    sg.fillText(String(Math.floor(999 - (t * 0.5) % 999)).padStart(4, "0"), w - 80, h - 15);
    if (Math.sin(t * 3) > 0) { sg.fillStyle = "#ff3355"; sg.beginPath(); sg.arc(w - 110, 18, 8, 0, 7); sg.fill(); sg.fillText("REC", w - 96, 26); }
    sg.strokeStyle = "#fff"; sg.strokeRect(w - 190, 8, 40, 20); sg.fillStyle = "#3dff6e"; sg.fillRect(w - 188, 10, 30, 16);
    for (let i = 0; i < 40; i++) { const v = Math.abs(Math.sin(i * 0.5 + t)) * 30 + Math.random() * 6; sg.fillStyle = "rgba(255,255,255,.6)"; sg.fillRect(w - 160 + i * 3, h - 60 - v, 2, v); }
    if (flash > 0.01) { sg.fillStyle = `rgba(255,255,255,${flash})`; sg.fillRect(0, 0, w, h); }
    screenTex.needsUpdate = true;
  }
  M.screen = new THREE.MeshBasicMaterial({ map: screenTex, toneMapped: false });

  /* ---------- Geometry helpers ---------- */
  function rbox(w, h, d, r, bevel = 0.12) {
    w -= bevel * 2; h -= bevel * 2; r = Math.min(r, w / 2, h / 2);
    const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
    s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r);
    s.quadraticCurveTo(x + w, y + h, x + w - r, y + h); s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
    const g = new THREE.ExtrudeGeometry(s, { depth: Math.max(0.01, d - bevel * 2), bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 3, curveSegments: 10 });
    g.center(); return g;
  }
  const cyl = (r1, r2, len, seg = 64) => { const g = new THREE.CylinderGeometry(r1, r2, len, seg, 1); g.rotateX(Math.PI / 2); return g; };
  const mesh = (g, m, x = 0, y = 0, z = 0) => { const o = new THREE.Mesh(g, m); o.position.set(x, y, z); return o; };

  /* ---------- Build camera ---------- */
  const rig = new THREE.Group();       // posición/rotación global
  const model = new THREE.Group();     // centro de rotación
  rig.add(model); scene.add(rig);
  model.position.set(-0.3, -0.4, -3.2);
  const parts = [];
  function part(name, objs, off, rot = [0, 0, 0], delay = 0, anchor = null) {
    const g = new THREE.Group(); objs.forEach((o) => g.add(o)); model.add(g);
    const p = { name, g, base: g.position.clone(), off: new THREE.Vector3(...off), rot: new THREE.Vector3(...rot), delay, anchor: anchor && new THREE.Vector3(...anchor), seed: Math.random() * 10 };
    parts.push(p); return p;
  }
  const MX = 0.6, MY = -0.3; // eje de montura (E-mount)

  // Cuerpo central
  part("core", [
    mesh(rbox(12.2, 7.0, 3.2, 0.7), M.body),
    mesh(new THREE.BoxGeometry(12.0, 0.05, 3.0), M.dark, 0, -3.5, 0),
    mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.5, 16), M.metal, 6.05, 2.2, 0).rotateZ(Math.PI / 2),
    mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.5, 16), M.metal, -6.05, 2.2, 0).rotateZ(Math.PI / 2),
  ], [0, 0, 0]);

  // Grip
  part("grip", [mesh(rbox(3.0, 6.9, 2.4, 1.0, 0.3), M.rubber, -4.75, -0.1, 1.95), mesh(cyl(0.55, 0.55, 0.35, 32), M.dark, -4.7, 2.6, 3.2)], [-4.5, -0.6, 2.5], [0, -0.5, 0.25], 0.12, [-4.7, 0.5, 3.2]);

  // Visor (joroba)
  const hs = new THREE.Shape(); hs.moveTo(-2.3, 0); hs.lineTo(2.3, 0); hs.lineTo(1.45, 2.1); hs.lineTo(-1.45, 2.1); hs.closePath();
  const humpG = new THREE.ExtrudeGeometry(hs, { depth: 2.9, bevelEnabled: true, bevelThickness: 0.12, bevelSize: 0.12, bevelSegments: 3 }); humpG.translate(0, 0, -1.45);
  const labelTex = tex(256, 64, (g) => { g.fillStyle = "#e9edf5"; g.font = "600 34px 'Space Grotesk', sans-serif"; g.textAlign = "center"; g.fillText("α7 II", 128, 44); });
  const label = mesh(new THREE.PlaneGeometry(1.6, 0.4), new THREE.MeshBasicMaterial({ map: labelTex, transparent: true }), MX + 3.6, 2.85, 1.62);
  part("hump", [mesh(humpG, M.body, MX, 3.45, -0.05), mesh(new THREE.BoxGeometry(1.2, 0.05, 0.6), M.cyan, MX, 5.6, 0.6), label], [0, 4.2, -0.5], [-0.35, 0, 0], 0.05, [MX, 5.2, 0]);

  // Diales superiores
  const dialMode = mesh(new THREE.CylinderGeometry(0.95, 0.95, 0.55, 28), M.dark, -2.8, 3.8, -0.4); dialMode.material = M.dark.clone(); dialMode.material.flatShading = true;
  const dialExp = mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.5, 28), dialMode.material, -5.0, 3.75, -0.8);
  const shutter = mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.28, 32), M.metal, -4.75, 3.62, 2.1);
  const onRing = mesh(new THREE.CylinderGeometry(0.78, 0.78, 0.18, 32), M.black, -4.75, 3.5, 2.1);
  const dialRing = mesh(new THREE.TorusGeometry(0.96, 0.03, 8, 48), M.cyan, -2.8, 4.08, -0.4); dialRing.rotation.x = Math.PI / 2;
  const frontWheel = mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.32, 24), dialMode.material, -4.6, 3.3, 2.75);
  const c1 = mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.16, 20), M.dark, -3.55, 3.58, 1.2);
  const c2 = mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.16, 20), M.dark, -2.75, 3.58, 1.35);
  const afLamp = mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.08, 20), new THREE.MeshStandardMaterial({ color: 0x2a1408, emissive: 0xff7a2a, emissiveIntensity: 0.25 }), -3.0, 2.45, 1.62); afLamp.rotation.x = Math.PI / 2;
  part("dials", [dialMode, dialExp, shutter, onRing, dialRing, frontWheel, c1, c2, afLamp], [-0.5, 7.2, 0.3], [0.4, 0, -0.3], 0.1, [-3.6, 4.1, 0]);

  // Pantalla trasera
  const screenBody = mesh(rbox(7.6, 4.9, 0.4, 0.3, 0.08), M.black, 0.9, -0.4, -1.8);
  const screenFace = mesh(new THREE.PlaneGeometry(7.0, 4.35), M.screen, 0.9, -0.4, -2.02); screenFace.rotation.y = Math.PI;
  part("screen", [screenBody, screenFace], [0.5, -0.8, -6.5], [0.3, 0.5, 0], 0.15, [0.9, -0.4, -2.0]);

  // Ocular EVF
  const eyeGlass = mesh(new THREE.PlaneGeometry(1.6, 1.1), M.glass, MX, 4.45, -2.72); eyeGlass.rotation.y = Math.PI;
  part("evf", [mesh(rbox(3.1, 2.1, 1.2, 0.6, 0.2), M.rubber, MX, 4.45, -2.1), eyeGlass], [0, 3.2, -4.5], [0.4, 0, 0], 0.18, [MX, 4.5, -2.6]);

  // Placa base (BIONZ X) — oculta dentro
  part("pcb", [mesh(new THREE.BoxGeometry(8.4, 0.12, 2.4), M.pcb, 0.6, 1.2, -0.3)], [0, 2.6, -2.6], [0.6, 0, 0], 0.22, [0.6, 1.3, -0.3]);
  // Batería
  const batt = mesh(rbox(1.6, 5.4, 3.8, 0.2, 0.06), new THREE.MeshStandardMaterial({ color: 0x1b1d22, roughness: 0.5, metalness: 0.4 }), -4.7, -0.4, 1.3);
  part("battery", [batt, mesh(new THREE.BoxGeometry(1.62, 0.6, 3.82), M.cyan, -4.7, 1.2, 1.3)], [-1.5, -8, 1.5], [0, 0.8, 0.4], 0.2, [-4.7, -2.5, 1.3]);

  // Sensor + IBIS
  const sensorRig = new THREE.Group();
  sensorRig.add(mesh(new THREE.BoxGeometry(5.2, 4.2, 0.3), M.dark, 0, 0, 0));
  sensorRig.add(mesh(new THREE.BoxGeometry(3.6, 2.4, 0.06), M.sensor, 0, 0, 0.18));
  [[-2.3, -1.8], [2.3, -1.8], [-2.3, 1.8], [2.3, 1.8]].forEach(([x, y]) => sensorRig.add(mesh(new THREE.TorusGeometry(0.22, 0.06, 8, 20), M.cyan, x, y, 0.2)));
  sensorRig.position.set(MX, MY, 1.05);
  const sensorPart = part("sensor", [sensorRig], [0, 0, 3.8], [0, 0, 0], 0.08, [MX, MY, 1.2]);

  // Montura
  const mount = mesh(cyl(2.95, 2.95, 0.35), M.metal, MX, MY, 1.75);
  const mountIn = mesh(cyl(2.35, 2.35, 0.4, 48), M.black, MX, MY, 1.76);
  part("mount", [mount, mountIn, mesh(new THREE.TorusGeometry(2.96, 0.04, 8, 64), M.cyan, MX, MY, 1.95)], [0, 0, 2.2], [0, 0, 0.5], 0.05);

  // Lente (28-70)
  const L = (r1, len, z, mat, extra = []) => { const objs = [mesh(cyl(r1, r1, len), mat, MX, MY, z + len / 2), ...extra]; return objs; };
  part("l1", L(2.75, 0.5, 1.95, M.metal), [0, 0, 3.2], [0, 0, 0], 0.0);
  part("l2", L(3.3, 1.6, 2.45, M.body), [0, 0, 5.2], [0, 0, 0.6], 0.02, [MX, MY + 3.3, 3.2]);
  const zoom = mesh(cyl(3.55, 3.55, 2.4, 96), M.ribbed, MX, MY, 5.25);
  part("l3", [zoom], [0, 0, 7.4], [0, 0, -0.8], 0.04);
  part("l4", L(3.45, 0.8, 6.45, M.body, [mesh(new THREE.TorusGeometry(3.47, 0.035, 8, 96), M.cyan, MX, MY, 6.85)]), [0, 0, 9.4], [0, 0, 0.4], 0.06);
  const focus = mesh(cyl(3.5, 3.5, 1.2, 96), M.ribbed, MX, MY, 7.85);
  part("l5", [focus], [0, 0, 11.2], [0, 0, 1.2], 0.08);
  const frontRing = mesh(cyl(3.62, 3.62, 0.7, 96), M.black, MX, MY, 8.8);
  const R = 6.5, a = Math.asin(2.9 / R);
  const capG = new THREE.SphereGeometry(R, 64, 16, 0, Math.PI * 2, 0, a); capG.rotateX(Math.PI / 2);
  const cap = mesh(capG, M.glass, MX, MY, 9.0 - R * Math.cos(a));
  const innerRing = mesh(new THREE.TorusGeometry(2.95, 0.05, 8, 96), M.mag, MX, MY, 9.15);
  part("front", [frontRing, cap, innerRing], [0, 0, 13.2], [0, 0, -0.5], 0.1, [MX, MY + 3.6, 9.0]);

  // Elementos ópticos internos (aparecen al desarmar)
  const elements = [];
  [[3.2, 2.2], [4.4, 2.5], [5.6, 2.6], [7.0, 2.7], [8.2, 2.8]].forEach(([z, r], i) => {
    const g = new THREE.SphereGeometry(r * 2.2, 40, 10, 0, Math.PI * 2, 0, Math.asin(1 / 2.2)); g.rotateX(i % 2 ? -Math.PI / 2 : Math.PI / 2);
    const el = mesh(g, M.lensEl, MX, MY, z);
    const edge = mesh(new THREE.TorusGeometry(r, 0.025, 6, 64), i % 2 ? M.mag : M.cyan, MX, MY, z);
    const p = part("el" + i, [el, edge], [0, 0, 4.2 + i * 2.0], [0, 0, 0], 0.1 + i * 0.03, i === 2 ? [MX, MY + r, z] : null);
    p.hideAssembled = true; elements.push(p);
  });

  /* ---------- Etiquetas (specs) ---------- */
  const SP = (S.gear && S.gear.specs) || {};
  const tagDefs = [
    ["front", SP.lens], ["sensor", SP.sensor], ["pcb", SP.processor], ["evf", SP.evf],
    ["screen", SP.screen], ["battery", SP.battery], ["grip", SP.ibis], ["dials", SP.dials],
  ].filter((d) => d[1]);
  const tagWrap = document.getElementById("tags");
  const gearHead = document.querySelector(".gear-head");
  const tags = tagDefs.map(([name, txt], i) => {
    const el = document.createElement("div"); el.className = "tag" + (i % 2 ? " left" : "");
    const [title, sub] = txt.split("|");
    el.innerHTML = `<i></i><span><small class="mono">0${i + 1}</small><b>${title}</b>${sub ? `<em>${sub}</em>` : ""}</span>`;
    tagWrap && tagWrap.appendChild(el);
    return { el, p: parts.find((p) => p.name === name) };
  });

  /* ---------- Halo + partículas ---------- */
  const halo = new THREE.Group(); scene.add(halo);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.08, blending: THREE.AdditiveBlending, depthWrite: false });
  const ringMat2 = ringMat.clone(); ringMat2.color.set(0xff2bd6); ringMat2.opacity = 0.25;
  const r1 = new THREE.Mesh(new THREE.TorusGeometry(9, 0.03, 8, 160), ringMat), r2 = new THREE.Mesh(new THREE.TorusGeometry(10.5, 0.02, 8, 160), ringMat2);
  const r3 = new THREE.Mesh(new THREE.TorusGeometry(7.6, 0.015, 8, 160), ringMat.clone());
  halo.add(r1);
  const N = 260, pg = new THREE.BufferGeometry(), pos = new Float32Array(N * 3), col = new Float32Array(N * 3);
  const pal = [new THREE.Color(0xffffff), new THREE.Color(0x9a9aa0), new THREE.Color(0xcfd6dc), new THREE.Color(0x7cf3ff)];
  for (let i = 0; i < N; i++) {
    const r = 8 + Math.random() * 40, th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
    pos.set([r * Math.sin(ph) * Math.cos(th), r * Math.sin(ph) * Math.sin(th) * 0.6, r * Math.cos(ph) - 15], i * 3);
    col.set(pal[i % 4].toArray(), i * 3);
  }
  pg.setAttribute("position", new THREE.BufferAttribute(pos, 3)); pg.setAttribute("color", new THREE.BufferAttribute(col, 3));
  const dust = new THREE.Points(pg, new THREE.PointsMaterial({ size: 0.06, vertexColors: true, transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending, depthWrite: false }));
  scene.add(dust);

  /* ---------- Luces ---------- */
  scene.add(new THREE.AmbientLight(0xffffff, 0.15));
  const key = new THREE.DirectionalLight(0xffffff, 1.1); key.position.set(5, 8, 10); scene.add(key);
  const lc = new THREE.PointLight(0xcfefff, 35, 40); scene.add(lc);
  const lm = new THREE.PointLight(0xffffff, 25, 40); scene.add(lm);
  const flashLight = new THREE.PointLight(0xffffff, 0, 30); scene.add(flashLight);

  /* ---------- Estado (lo controla el scroll) ---------- */
  const state = { px: 0.42, py: -0.05, s: 1, rotY: -0.65, rotX: 0.22, explode: 0, dim: 1, labels: 0 };
  const cur = { ...state };
  const intro = { explode: 2.6, s: 0.4, spin: -4, y: 0 }; // la cámara se arma al terminar la intro
  let introDone = false;

  const sel = (q) => document.querySelector(q);
  const topOf = (q) => { const el = sel(q); return el ? el.getBoundingClientRect().top + scrollY : 0; };
  let keys = [];
  function buildKeys() {
    const vh = innerHeight, gear = sel("#equipo");
    const gTop = topOf("#equipo"), gLen = gear ? gear.offsetHeight - vh : vh;
    const m = isMobile();
    const k = (y, v) => keys.push({ y, v });
    keys = [];
    k(0, m ? { px: 0.1, py: -0.66, s: 0.8, rotY: -0.65, rotX: 0.22, explode: 0, dim: 0.9, labels: 0 } : { px: 0.42, py: -0.05, s: 1, rotY: -0.65, rotX: 0.22, explode: 0, dim: 1, labels: 0 });
    k(gTop, { px: 0, py: m ? -0.08 : -0.06, s: m ? 0.85 : 1.05, rotY: -0.45, rotX: 0.2, explode: 0, dim: 1, labels: 0 });
    k(gTop + gLen * 0.75, { px: m ? 0 : 0.08, py: m ? -0.18 : -0.1, s: m ? 0.55 : 0.68, rotY: -1.05, rotX: 0.34, explode: 1, dim: 1, labels: 1 });
    k(gTop + gLen, { px: m ? 0 : 0.08, py: m ? -0.18 : -0.1, s: m ? 0.55 : 0.68, rotY: -1.2, rotX: 0.34, explode: 1, dim: 1, labels: 1 });
    k(topOf("#sobre") - vh * 0.15, { px: m ? 0.45 : 0.68, py: 0.6, s: m ? 0.5 : 0.36, rotY: -1.2 + Math.PI * 2, rotX: 0.25, explode: 0, dim: m ? 0.35 : 1, labels: 0 });
    k(topOf("#servicios") - vh * 0.15, { px: m ? 0.45 : 0.68, py: 0.58, s: m ? 0.5 : 0.42, rotY: 6.3 + 1.1, rotX: 0.35, explode: 0.45, dim: m ? 0.3 : 0.9, labels: 0 });
    k(topOf("#clientes") - vh * 0.3, { px: 0, py: 0, s: 1.05, rotY: 6.3 + 2.2, rotX: 0.55, explode: 1.4, dim: 0.28, labels: 0 });
    k(topOf("#portafolio") - vh * 0.45, { px: 0, py: 0, s: 1, rotY: Math.PI * 4, rotX: 0, explode: 0, dim: 0.85, labels: 0 });
    k(topOf("#portafolio") + vh * 0.05, { px: 0, py: 0.05, s: 6.5, rotY: Math.PI * 4, rotX: 0, explode: 0, dim: 0.2, labels: 0 });
    k(topOf("#contacto") - vh * 0.3, { px: 0, py: m ? 0.3 : 0.12, s: m ? 0.45 : 0.55, rotY: Math.PI * 4 - 0.6, rotX: 0.2, explode: 0, dim: 0.22, labels: 0 });
    k(document.documentElement.scrollHeight, { px: 0, py: 0.12, s: 0.55, rotY: Math.PI * 4 + 0.6, rotX: 0.2, explode: 0.15, dim: 0.22, labels: 0 });
  }
  const ease = (t) => t * t * (3 - 2 * t);
  function target(y) {
    if (!keys.length) return state;
    if (y <= keys[0].y) return keys[0].v;
    for (let i = 1; i < keys.length; i++) {
      if (y <= keys[i].y) {
        const a = keys[i - 1], b = keys[i], t = ease((y - a.y) / Math.max(1, b.y - a.y)), o = {};
        for (const kk in a.v) o[kk] = a.v[kk] + (b.v[kk] - a.v[kk]) * t;
        return o;
      }
    }
    return keys[keys.length - 1].v;
  }

  /* ---------- Resize ---------- */
  let W = 1, H = 1;
  function resize() {
    const w = innerWidth, h = innerHeight;
    renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix();
    H = 2 * cam.position.z * Math.tan((cam.fov * Math.PI) / 360); W = H * cam.aspect;
    buildKeys();
  }
  addEventListener("resize", resize); resize();
  addEventListener("load", buildKeys);
  setTimeout(buildKeys, 1500);

  let mx = 0, my = 0;
  addEventListener("pointermove", (e) => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; });

  /* ---------- Loop (siempre animado) ---------- */
  const clock = new THREE.Clock();
  const v3 = new THREE.Vector3();
  let frame = 0, nextShot = 4;
  function loop() {
    requestAnimationFrame(loop);
    const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime;
    frame++;

    const tg = target(scrollY);
    const k = 1 - Math.pow(0.0015, dt); // suavizado
    for (const kk in cur) cur[kk] += (tg[kk] - cur[kk]) * k;

    const base = Math.min(H * 0.042, W * 0.055);
    const ex = cur.explode + intro.explode;
    rig.scale.setScalar(base * cur.s * intro.s);
    rig.position.set(cur.px * W * 0.5, cur.py * H * 0.5 + Math.sin(t * 0.9) * 0.12, 0);
    rig.rotation.y = cur.rotY + intro.spin + Math.sin(t * 0.4) * 0.12 + mx * 0.35;
    rig.rotation.x = cur.rotX + Math.sin(t * 0.6) * 0.05 + my * 0.2;
    rig.rotation.z = Math.sin(t * 0.5) * 0.03;

    for (const p of parts) {
      const d = p.delay;
      let e = ex <= 1 ? ease(Math.min(1, Math.max(0, (ex - d) / (1 - d)))) : 1 + (ex - 1) * 0.8;
      const drift = e * 0.25;
      p.g.position.set(
        p.base.x + p.off.x * e + Math.sin(t * 0.8 + p.seed) * drift,
        p.base.y + p.off.y * e + Math.cos(t * 0.7 + p.seed) * drift,
        p.base.z + p.off.z * e
      );
      p.g.rotation.set(p.rot.x * e + Math.sin(t + p.seed) * 0.05 * e, p.rot.y * e, p.rot.z * e);
      if (p.hideAssembled) p.g.visible = e > 0.04;
      p.e = e;
    }
    // micro-animaciones constantes
    dialMode.rotation.y = t * 0.4; dialExp.rotation.y = -t * 0.3;
    zoom.rotation.z = Math.sin(t * 0.5) * 0.6; focus.rotation.z = -t * 0.3;
    sensorRig.position.x = MX + Math.sin(t * 2.1) * 0.05; sensorRig.position.y = MY + Math.cos(t * 1.7) * 0.05; sensorRig.rotation.z = Math.sin(t * 1.3) * 0.02;
    elements.forEach((p, i) => (p.g.children[0].rotation.z = t * (0.2 + i * 0.05)));

    // obturador / flash periódico
    if (t > nextShot) { flash = 1; nextShot = t + 6 + Math.random() * 3; }
    flash *= 0.9;
    flashLight.intensity = flash * 120;
    v3.set(MX, MY, 10); model.localToWorld(v3); flashLight.position.copy(v3);

    lc.position.set(Math.cos(t * 0.6) * 12, 4 + Math.sin(t * 0.8) * 3, 8);
    lm.position.set(Math.cos(t * 0.6 + Math.PI) * 12, -3 + Math.cos(t * 0.7) * 3, 6);

    halo.position.copy(rig.position); halo.position.z = -4;
    const hs2 = rig.scale.x / base;
    halo.scale.setScalar(Math.max(0.3, hs2) * (1 + Math.sin(t * 1.2) * 0.02));
    r1.rotation.set(t * 0.2, t * 0.3, 0); r2.rotation.set(-t * 0.15, t * 0.1, t * 0.2); r3.rotation.set(Math.PI / 2 + Math.sin(t * 0.5) * 0.4, 0, t * 0.5);
    dust.rotation.y = t * 0.02; dust.rotation.x = Math.sin(t * 0.1) * 0.1;
    dust.position.y = -scrollY * 0.002;

    if (frame % 3 === 0) drawScreen(t);
    canvas.style.opacity = cur.dim.toFixed(3);
    if (gearHead) gearHead.style.opacity = (1 - cur.labels * 0.8).toFixed(3);

    renderer.render(scene, cam);

    // etiquetas
    if (tags.length) {
      const show = cur.labels;
      tagWrap.style.visibility = show > 0.02 ? "visible" : "hidden";
      const mob = isMobile();
      tags.forEach((tg2, i) => (tg2.el.style.display = mob && i > 4 ? "none" : ""));
      for (const tg2 of tags) {
        if (!tg2.p || !tg2.p.anchor) continue;
        v3.copy(tg2.p.anchor); tg2.p.g.localToWorld(v3); v3.project(cam);
        const x = Math.min(innerWidth - 24, Math.max(24, (v3.x * 0.5 + 0.5) * innerWidth));
        const y = Math.min(innerHeight - 90, Math.max(mob ? 270 : 110, (-v3.y * 0.5 + 0.5) * innerHeight));
        const o = Math.max(0, Math.min(1, (tg2.p.e - 0.6) * 3)) * show;
        tg2.el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
        tg2.el.style.opacity = o.toFixed(3);
      }
    }
  }
  loop();

  /* ---------- API para main.js ---------- */
  window.STAGE = {
    assemble() {
      if (!window.gsap) { intro.explode = 0; intro.s = 1; intro.spin = 0; introDone = true; return; }
      gsap.to(intro, { explode: 0, s: 1, spin: 0, duration: 2.6, ease: "expo.out", onComplete: () => (introDone = true) });
    },
    refresh: buildKeys,
  };
})();
