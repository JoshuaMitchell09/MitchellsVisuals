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

  // "Cómo trabajo": pasos del proceso
  process: [
    { title: "Contacto", desc: "Me escribes por WhatsApp o con el formulario y me cuentas tu idea." },
    { title: "Plan", desc: "Definimos fecha, lugar, estilo y lo que necesitas recibir." },
    { title: "Sesión", desc: "Fotografío o grabo el día acordado, cuidando cada detalle." },
    { title: "Entrega", desc: "Recibes tus fotos editadas en una galería en línea, listas para usar." },
  ],

  // Testimonios: la sección aparece sola cuando agregas al menos uno.
  // Ejemplo: { quote: "Las fotos del partido quedaron increíbles.", name: "Nombre Apellido", role: "Zona Fut", logo: "assets/img/cliente-zonafut.jpg" },
  testimonials: [],

  // Preguntas frecuentes (edítalas con tus respuestas reales)
  faq: [
    { q: "¿Cuánto tarda la entrega?", a: "Depende del servicio y de la cantidad de fotos. Al cotizar te confirmo la fecha exacta de entrega." },
    { q: "¿Cómo recibo las fotos?", a: "En una galería en línea donde puedes verlas y descargarlas en alta calidad." },
    { q: "¿Trabajas fuera de tu zona?", a: "Escríbeme con la ubicación y la fecha, y te confirmo disponibilidad." },
    { q: "¿También haces video?", a: "Sí: reels, videoclips y piezas para marcas, eventos y deportes. Mira la categoría Video del portafolio." },
    { q: "¿Cómo reservo una fecha?", a: "Escríbeme por WhatsApp o con el formulario de esta página; confirmamos detalles y apartamos la fecha." },
  ],

  // Lo que dice la cabra en cada sección (y al hacerle clic)
  mascot: {
    lines: {
      top: "¡Meeeeeeh! Bienvenido.",
      trabajo: "Esto es lo que hago.",
      equipo: "Con esto hago la magia.",
      proceso: "Así de fácil, meeeh.",
      faq: "¿Dudas? Aquí las resuelvo.",
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
      "Ese mismo ojo lo llevo a marcas y negocios como Prime Supplements CR, The Void, Suministros PR, IPT, La Adelita, Cali en Tica y Upsidedown: fotos de producto, retratos y contenido listo para redes.",
    ],
    // Lista corta de lo que has hecho: "Categoría|Detalle"
    highlights: [
      "Fútbol|Zona Fut · Ascenso Total",
      "Baloncesto|LSBF Davivienda",
      "Marcas|Prime Supplements CR · The Void · Suministros PR · IPT · Upsidedown",
      "Gastronomía|La Adelita · Cali en Tica",
      "Equipo|Sony α7 II",
    ],
    stats: [
      { value: 10, suffix: "+", label: "Marcas y clientes" },
      { value: 2, suffix: "", label: "Deportes: fútbol y baloncesto" },
      { value: 2025, suffix: "", label: "Desde" },
    ],
  },

  // Servicios (pestañas). "includes" = lista de lo que incluye cada servicio.
  services: [
    { title: "Deportes", desc: "Fútbol, baloncesto y acción en vivo. Cobertura de partidos, atletas y eventos deportivos.",
      includes: ["Cobertura completa del partido o evento", "Fotos de acción, celebración y afición", "Edición profesional de color", "Entrega rápida para redes y medios"] },
    { title: "Retratos", desc: "Sesiones personales y profesionales con dirección de pose, luz y estilo.",
      includes: ["Dirección de pose y estilo", "Iluminación de estudio o natural", "Selección y retoque de las mejores fotos", "Galería privada en línea"] },
    { title: "Marcas & producto", desc: "Fotografía comercial para negocios, catálogos, e-commerce y redes sociales.",
      includes: ["Fotos de producto y ambiente", "Concepto visual según tu marca", "Formatos para web, catálogo y redes", "Uso comercial de las imágenes"] },
    { title: "Eventos", desc: "Cobertura de eventos sociales, corporativos y lanzamientos.",
      includes: ["Cobertura de principio a fin", "Momentos clave, invitados y detalles", "Edición profesional", "Galería para compartir"] },
    { title: "Contenido para redes", desc: "Fotos listas para Instagram y TikTok, pensadas para tu marca.",
      includes: ["Fotos verticales y horizontales", "Contenido pensado para engagement", "Entregas por paquete mensual", "Ideas y guion visual"] },
    { title: "Video", desc: "Reels, videoclips y piezas audiovisuales para marcas, eventos y deportes.",
      includes: ["Reels de 15 a 60 segundos", "Grabación con estabilizador y audio DJI", "Edición, color y música", "Formatos para cada red"] },
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
    { name: "Cali en Tica", type: "Gastronomía", image: "assets/img/cliente-calientica.jpg", fit: "contain", link: "" },
    { name: "The Void", type: "Performance & Recovery", image: "assets/img/cliente-the-void.png", fit: "contain", link: "" },
    { name: "Upsidedown", type: "Marca", image: "assets/img/cliente-upsidedown.png", fit: "contain", link: "" },
  ],

  // Links al portafolio. "video" (opcional) = video MP4 que se reproduce de fondo en la tarjeta.
  portfolio: [
    { title: "Fotografía", desc: "Todos mis trabajos: retratos, marcas, eventos y más.", url: "https://mitchellsvisualstellephotography.pixieset.com/mitchellsphotographyportafolio/", soon: false, cover: "assets/img/portada-fotografia.jpg" },
    { title: "Deportes", desc: "Partidos, atletas y la acción del fútbol desde la cancha.", url: "https://mitchellsvisualstellephotography.pixieset.com/portafoliodeportivo/", soon: false, cover: "assets/img/portada-deportes.jpg" },
    { title: "Video", desc: "Reels, videoclips y piezas audiovisuales.", url: "https://mitchellsvisualstellephotography.pixieset.com/portafoliovideos/", soon: false, cover: "assets/video/portada-video.jpg", video: "assets/video/portada-video.mp4" },
  ],

  contact: [
    { label: "Instagram", value: "@Mitchells_Visuals", url: "https://instagram.com/Mitchells_Visuals" },
    { label: "WhatsApp", value: "+506 7135-0454", url: "https://wa.me/50671350454" },
    { label: "Email", value: "Mitchells_Visuals@outlook.com", url: "mailto:Mitchells_Visuals@outlook.com" },
    { label: "Portafolio", value: "Ver en Pixieset", url: "https://mitchellsvisualstellephotography.pixieset.com/mitchellsphotographyportafolio/" },
  ],

  marquee: ["Fotografía", "Retratos", "Eventos", "Marcas", "Deportes", "Video", "Dirección visual"],
};
