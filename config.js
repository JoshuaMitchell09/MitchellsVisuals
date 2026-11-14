/* =========================================================
   CONFIGURACIÓN DEL SITIO — edita SOLO este archivo
   para cambiar textos, fotos, clientes y links.
   Las fotos van en la carpeta  assets/img/
   ========================================================= */
window.SITE = {
  hero: {
    // Foto grande en la portada (déjala "" para no mostrar ninguna)
    photo: "",
    subtitle: "Capturo momentos con estética de otro tiempo: luz, movimiento y emoción convertidos en imágenes que se sienten del futuro.",
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
  },

  about: {
    // Pon tu foto en assets/img/ y escribe el nombre aquí, ej: "assets/img/mitchell.jpg"
    photo: "assets/img/mitchell-1.jpg",
    // Segunda foto que aparece al pasar el mouse / tocar la foto
    photoHover: "assets/img/mitchell-2.jpg",
    tag: "MITCHELL",
    lead: "Soy Mitchell, fotógrafo y creador visual.",
    body: "Me apasiona contar historias a través de la imagen. Trabajo con marcas, artistas y personas que buscan un look distinto, con energía, cuidado en cada detalle y una dirección visual que se recuerda.",
    stats: [
      { value: 50, suffix: "+", label: "Proyectos" },
      { value: 30, suffix: "+", label: "Clientes" },
      { value: 10, suffix: "K+", label: "Fotos entregadas" },
    ],
  },

  services: [
    { title: "Retratos", desc: "Sesiones personales y profesionales con dirección de pose, luz y estilo.", icon: "portrait" },
    { title: "Eventos", desc: "Cobertura completa de eventos sociales, corporativos y conciertos.", icon: "event" },
    { title: "Producto & Marca", desc: "Fotografía comercial para catálogos, e-commerce y redes sociales.", icon: "product" },
    { title: "Deportes & Acción", desc: "Movimiento congelado en el instante exacto. Alta velocidad, alto impacto.", icon: "action" },
    { title: "Contenido para redes", desc: "Paquetes de foto y video vertical listos para Instagram y TikTok.", icon: "social" },
    { title: "Video", desc: "Próximamente: reels, videoclips y piezas audiovisuales.", icon: "video" },
  ],

  // Clientes: pon el logo/foto en assets/img/ y su ruta en "image".
  // fit: "cover" = la imagen llena el cuadro · "contain" = logo centrado con espacio (ideal para PNG transparentes)
  // "link" es opcional (Instagram o web del cliente).
  clients: [
    { name: "Zona Fut", type: "Fútbol · Medios", image: "assets/img/cliente-zonafut.jpg", fit: "contain", link: "" },
    { name: "Ascenso Total", type: "Fútbol · Medios", image: "assets/img/cliente-ascenso-total.jpg", fit: "cover", link: "" },
    { name: "LSBF · Davivienda", type: "Liga deportiva", image: "assets/img/cliente-lsbf.jpg", fit: "contain", link: "" },
    { name: "Prime Supplements CR", type: "Suplementos deportivos", image: "", fit: "contain", link: "" },
    { name: "Suministros PR", type: "Marca", image: "assets/img/cliente-suministros-pr.jpg", fit: "cover", link: "" },
    { name: "IPT", type: "Marca", image: "assets/img/cliente-ipt.jpg", fit: "cover", link: "" },
    { name: "La Adelita", type: "Restaurante", image: "", fit: "contain", link: "" },
    { name: "Upsidedown", type: "Marca", image: "", fit: "contain", link: "" },
  ],

  // Links al portafolio. Cuando tengas el de video, pon el link y cambia soon a false.
  portfolio: [
    { title: "Fotografía", desc: "Todos mis trabajos: retratos, marcas, eventos y más.", url: "https://mitchellsvisualstellephotography.pixieset.com/mitchellsphotographyportafolio/", soon: false, cover: "assets/img/mitchell-1.jpg" },
    { title: "Deportes", desc: "Partidos, atletas y la acción del fútbol desde la cancha.", url: "https://mitchellsvisualstellephotography.pixieset.com/portafoliodeportivo/", soon: false, cover: "assets/img/mitchell-2.jpg" },
    { title: "Video", desc: "Reels, videoclips y piezas audiovisuales.", url: "", soon: true, cover: "" },
  ],

  contact: [
    { label: "Instagram", value: "@mitchellvisuals", url: "https://instagram.com/" },
    { label: "WhatsApp", value: "Escríbeme", url: "https://wa.me/" },
    { label: "Email", value: "hola@mitchellvisuals.com", url: "mailto:hola@mitchellvisuals.com" },
  ],

  marquee: ["Fotografía", "Retratos", "Eventos", "Marcas", "Deportes", "Video", "Dirección visual"],
};
