# Mitchell Visuals — Portafolio

Sitio web estático (HTML + CSS + JS, sin build) con estilo neofuturista, intro animada del logo y animaciones con GSAP.

## Editar contenido
Todo el contenido está en **`config.js`**: textos, estadísticas, servicios, clientes, links del portafolio y contacto.

- Fotos → súbelas a `assets/img/` y pon la ruta en `config.js`, por ejemplo `photo: "assets/img/mitchell.jpg"`.
- Clientes → cada uno tiene `name`, `type`, `image` y `link` (opcional).
- Portafolio de video → cuando esté listo, pon el `url` y cambia `soon: false`.
- Galería "Trabajo seleccionado" → sube fotos a `assets/img/trabajo/` y agrégalas en `gallery` (aparece con 3 o más).
- Música → reemplaza `assets/audio/musica.mp3` (mismo nombre).
- Frases de la cabra → `mascot` en `config.js`.
- Testimonios → `testimonials` en `config.js` (la sección aparece con al menos uno).
- Preguntas frecuentes → `faq` · Pasos del proceso → `process` · Lo que incluye cada servicio → `services[].includes`.
- La intro completa se ve solo en la primera visita; en el footer está "Ver intro de nuevo".

Recomendado: fotos en `.jpg` o `.webp`, máximo ~2000px de ancho, para que cargue rápido.

## Ver en local
```bash
python3 -m http.server 8080
```
Luego abre http://localhost:8080

## Publicar en Cloudflare Pages
1. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Elige este repositorio.
3. Framework preset: **None**. Build command: *(vacío)*. Build output directory: **`/`**.
4. Deploy. Cada `git push` vuelve a publicar automáticamente.

## Estructura
```
index.html      estructura de la página
styles.css      estilos
main.js         animaciones e interacciones
mascot.js       la cabra que salta por la página (textos en config.js → mascot)
intro.js        intro stop-motion de la cabra + música
assets/audio/   musica.mp3 (reemplázalo para cambiar la canción)
config.js       ← tu contenido
assets/         logo, fotos, audio y librerías (GSAP)
```
