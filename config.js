/* =========================================================
   CONFIGURACIÓN DEL SITIO — edita SOLO este archivo
   para cambiar textos, fotos, clientes y links.
   Las fotos van en la carpeta  assets/img/
   ========================================================= */
window.SITE = {
  hero: {
    // Foto grande en la portada (déjala "" para no mostrar ninguna)
    photo: "",
    subtitle: "Fotografía deportiva, retratos y marcas desde Costa Rica. El instante exacto, con carácter.",
  },

  // Sección "Mi equipo": la cámara 3D se desarma y muestra estas etiquetas.
  // Formato: "Título|detalle"
  gear: {
    model: "Sony α7 II",
    sub: "FULL-FRAME · MIRRORLESS · E-MOUNT",
    specs: {
      lens: "Óptica E-mount|Lentes intercambiables",
      sensor: "Sensor full-frame|24.3 MP Exmor CMOS",
      processor: "Procesador BIONZ X|Color y detalle reales",
      evf: "Visor OLED|2.36 M puntos",
      screen: "Pantalla 3\"|LCD abatible",
      battery: "Batería NP-FW50|Para sesiones largas",
      ibis: "Estabilización 5 ejes|SteadyShot INSIDE",
      dials: "Control manual|Diales dedicados",
    },
    // Lista de todo tu equipo (sección "Mi equipo")
    kit: [
      { cat: "Cámaras", items: ["Sony α7 II", "Sony α7R"] },
      { cat: "Lentes", items: ["Sigma 100-400 mm", "Sony 16-50 mm"] },
      { cat: "Audio", items: ["Micrófono DJI Mini 2", "Micrófono DJI 3"] },
      { cat: "Estabilización", items: ["Estabilizador para celular"] },
    ],
  },

  // Galería "Trabajo seleccionado". Pon tus mejores fotos en assets/img/trabajo/
  // y agrégalas aquí. La sección aparece sola cuando hay 3 fotos o más.
  // Ejemplo: { src: "assets/img/trabajo/gol.jpg", title: "Final de liga", cat: "Fútbol" },
  gallery: [],

  // Lo que dice la cabra en cada sección (y al hacerle clic)
  mascot: {
    lines: {
      top: "¡Meeeeeeh! Bienvenido.",
      trabajo: "Esto es lo que hago.",
      equipo: "Con esto hago la magia.",
      sobre: "Recuerda: cabra solo hay una.",
      servicios: "¿Qué necesitas? Yo me encargo.",
      clientes: "Ellos ya confiaron. ¿Sigues tú?",
      portafolio: "Aquí está lo bueno. Dale clic.",
      contacto: "Escríbeme… meeeeeh.",
    },
    random: ["¡Meeeeeeeeeh!", "Cabra solo hay una.", "El GOAT de la foto.", "¿Una foto? ¡Clic!", "Meeeh… dale scroll."],
  },

  about: {
    // Pon tu foto en assets/img/ y escribe el nombre aquí, ej: "assets/img/mitchell.jpg"
    photo: "assets/img/mitchell-1.jpg",
    // Segunda foto que aparece al pasar el mouse / tocar la foto
    photoHover: "assets/img/mitchell-2.jpg",
    tag: "MITCHELL",
    lead: "Soy Mitchell, fotógrafo de Costa Rica enfocado en el deporte, las marcas y las personas.",
    // Cada texto entre comillas es un párrafo
    body: [
      "Desde 2025 trabajo bajo el nombre Mitchell Visuals, buscando imágenes con carácter: luz contrastada, color con intención y el momento exacto en que pasa algo.",
      "Mi base es la fotografía deportiva. He cubierto fútbol para medios como Zona Fut y Ascenso Total —el fútbol que no ves— y baloncesto con la LSBF Davivienda. En la cancha aprendí a anticipar la jugada y a no perder el instante.",
      "Ese mismo ojo lo llevo a marcas y negocios como Prime Supplements CR, Suministros PR, IPT, La Adelita y Upsidedown: fotos de producto, retratos y contenido listo para redes.",
    ],
    // Lista corta de lo que has hecho: "Categoría|Detalle"
    highlights: [
      "Fútbol|Zona Fut · Ascenso Total",
      "Baloncesto|LSBF Davivienda",
      "Marcas|Prime Supplements CR · Suministros PR · IPT · Upsidedown",
      "Gastronomía|La Adelita",
      "Equipo|Sony α7 II",
    ],
    stats: [
      { value: 8, suffix: "+", label: "Marcas y clientes" },
      { value: 2, suffix: "", label: "Deportes: fútbol y baloncesto" },
      { value: 2025, suffix: "", label: "Desde" },
    ],
  },

  services: [
    { title: "Deportes", desc: "Fútbol, baloncesto y acción en vivo. Cobertura de partidos, atletas y eventos deportivos." },
    { title: "Retratos", desc: "Sesiones personales y profesionales con dirección de pose, luz y estilo." },
    { title: "Marcas & producto", desc: "Fotografía comercial para negocios, catálogos, e-commerce y redes sociales." },
    { title: "Eventos", desc: "Cobertura de eventos sociales, corporativos y lanzamientos." },
    { title: "Contenido para redes", desc: "Fotos listas para Instagram y TikTok, pensadas para tu marca." },
    { title: "Video", desc: "Próximamente: reels, videoclips y piezas audiovisuales." },
  ],

  // Clientes: pon el logo/foto en assets/img/ y su ruta en "image".
  // fit: "cover" = la imagen llena el cuadro · "contain" = logo centrado con espacio (ideal para PNG transparentes)
  // "link" es opcional (Instagram o web del cliente).
  clients: [
    { name: "Zona Fut", type: "Fútbol · Medios", image: "assets/img/cliente-zonafut.jpg", fit: "contain", link: "" },
    { name: "Ascenso Total", type: "Fútbol · Medios", image: "assets/img/cliente-ascenso-total.jpg", fit: "cover", link: "" },
    { name: "LSBF · Davivienda", type: "Liga deportiva", image: "assets/img/cliente-lsbf.jpg", fit: "contain", link: "" },
    { name: "Prime Supplements CR", type: "Suplementos deportivos", image: "assets/img/cliente-prime-supplements.png", fit: "contain", link: "" },
    { name: "Suministros PR", type: "Marca", image: "assets/img/cliente-suministros-pr.jpg", fit: "cover", link: "" },
    { name: "IPT", type: "Marca", image: "assets/img/cliente-ipt.jpg", fit: "cover", link: "" },
    { name: "La Adelita", type: "Restaurante", image: "assets/img/cliente-la-adelita.jpg", fit: "cover", link: "" },
    { name: "Upsidedown", type: "Marca", image: "assets/img/cliente-upsidedown.png", fit: "contain", link: "" },
  ],

  // Links al portafolio. Cuando tengas el de video, pon el link y cambia soon a false.
  portfolio: [
    { title: "Fotografía", desc: "Todos mis trabajos: retratos, marcas, eventos y más.", url: "https://mitchellsvisualstellephotography.pixieset.com/mitchellsphotographyportafolio/", soon: false, cover: "assets/img/mitchell-1.jpg" },
    { title: "Deportes", desc: "Partidos, atletas y la acción del fútbol desde la cancha.", url: "https://mitchellsvisualstellephotography.pixieset.com/portafoliodeportivo/", soon: false, cover: "assets/img/mitchell-2.jpg" },
    { title: "Video", desc: "Reels, videoclips y piezas audiovisuales.", url: "", soon: true, cover: "" },
  ],

  contact: [
    { label: "Instagram", value: "@Mitchells_Visuals", url: "https://instagram.com/Mitchells_Visuals" },
    { label: "WhatsApp", value: "+506 7135-0454", url: "https://wa.me/50671350454" },
    { label: "Email", value: "Mitchells_Visuals@outlook.com", url: "mailto:Mitchells_Visuals@outlook.com" },
    { label: "Portafolio", value: "Ver en Pixieset", url: "https://mitchellsvisualstellephotography.pixieset.com/mitchellsphotographyportafolio/" },
  ],

  marquee: ["Fotografía", "Retratos", "Eventos", "Marcas", "Deportes", "Video", "Dirección visual"],
};
