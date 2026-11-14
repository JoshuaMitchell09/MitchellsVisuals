/* =========================================================
   CONFIGURACIÓN DEL SITIO — edita SOLO este archivo
   para cambiar textos, fotos, clientes y links.
   Las fotos van en la carpeta  assets/img/
   ========================================================= */
window.SITE = {
  hero: {
    subtitle: "Capturo momentos con estética de otro tiempo: luz, movimiento y emoción convertidos en imágenes que se sienten del futuro.",
  },

  about: {
    // Pon tu foto en assets/img/ y escribe el nombre aquí, ej: "assets/img/mitchell.jpg"
    photo: "",
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

  // Clientes: pon la foto/logo en assets/img/ y su ruta en "image".
  // "link" es opcional (Instagram o web del cliente).
  clients: [
    { name: "Cliente Uno", type: "Marca", image: "", link: "" },
    { name: "Cliente Dos", type: "Evento", image: "", link: "" },
    { name: "Cliente Tres", type: "Artista", image: "", link: "" },
    { name: "Cliente Cuatro", type: "Producto", image: "", link: "" },
    { name: "Cliente Cinco", type: "Retrato", image: "", link: "" },
    { name: "Cliente Seis", type: "Deportes", image: "", link: "" },
  ],

  // Links al portafolio. Cuando tengas el de video, pon el link y cambia soon a false.
  portfolio: [
    { title: "Fotografía", desc: "Mi trabajo fotográfico completo.", url: "https://example.com", soon: false, cover: "" },
    { title: "Video", desc: "Reels, videoclips y piezas audiovisuales.", url: "", soon: true, cover: "" },
  ],

  contact: [
    { label: "Instagram", value: "@mitchellvisuals", url: "https://instagram.com/" },
    { label: "WhatsApp", value: "Escríbeme", url: "https://wa.me/" },
    { label: "Email", value: "hola@mitchellvisuals.com", url: "mailto:hola@mitchellvisuals.com" },
  ],

  marquee: ["Fotografía", "Retratos", "Eventos", "Marcas", "Deportes", "Video", "Dirección visual"],
};
