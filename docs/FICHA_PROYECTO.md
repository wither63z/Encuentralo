# Ficha del proyecto

- **Colegio:** Técnico Salesiano
- **Integrantes:** William · Gabriel · Mister
- **Nombre del proyecto:** Encuéntralo
- **Problema:** cuando alguien pierde algo en el colegio no sabe si fue encontrado ni dónde preguntar; los objetos se acumulan sin dueño y los reclamos se hacen de palabra, sin registro.
- **Usuarios:** estudiantes, docentes y personal del colegio que perdieron un objeto; el inspector que guarda los objetos encontrados.
- **Objetivo:** que cualquier persona de la comunidad encuentre su objeto en menos de un minuto desde el celular y deje un reclamo verificable.
- **Propuesta de valor:** lista pública y siempre actualizada de objetos encontrados, con búsqueda sin tildes, filtros, estados claros (Disponible, Reclamado, Entregado) y un reclamo que exige una seña particular para evitar reclamos falsos.
- **Funciones principales:**
  1. Explorar la lista de objetos encontrados (tarjetas con nombre, fecha, categoría y estado).
  2. Buscar por texto y filtrar por categoría y estado, con mensaje cuando no hay resultados.
  3. Ver el detalle completo con ícono de categoría y botón «Reclamar» (solo si está Disponible).
  4. Registrar un reclamo de prueba (nombre, curso y seña de al menos 10 caracteres) y recibir confirmación.
  5. Innovación «¿Qué perdiste?»: el estudiante describe su objeto y la app sugiere los 3 objetos Disponibles más parecidos, con puntaje y razones (mínimo 40 puntos).
- **Para destacar (opcionales del enunciado, todos implementados):** formulario «Reportar objeto encontrado» con foto; Modo inspector para marcar Entregado (solo profesores); datos que se conservan al cerrar y abrir (Supabase); conteo de objetos por estado; además, Radar de inspección (objetos estancados más de 5 días y top 3 de lugares y categorías).
- **Plataforma:** Web responsive (móvil y escritorio), también empaquetada como .exe (Windows) y APK (Android).
- **Tecnologías:** Vite, React 19, TypeScript, Tailwind CSS v4, Phosphor Icons, Vitest; Supabase (base de datos PostgreSQL con RLS y Storage para fotos); Clerk (inicio de sesión verificado y rol de profesor); Capacitor (APK Android); Electron (.exe Windows); Cloudflare Workers y GitHub Pages (web publicada).
- **Dónde se guardan los datos:** en Supabase (tablas `objetos` y `reclamos`, fotos en Storage); los permisos se controlan con RLS y funciones en el servidor. Si Supabase no responde, la app usa un respaldo local en el dispositivo (localStorage). En desarrollo se puede usar el modo demo sin internet (`VITE_USE_MOCK=true`).
- **Cómo ejecutar:** web publicada https://encuentralo.encuentralo.workers.dev/app/ (login primero); descargas en https://github.com/wither63z/Encuentralo/releases/latest (Encuentralo.apk y Encuentralo.exe, sin login). En local: ver README.md, sección "Cómo ejecutar el proyecto".
- **Datos simulados adicionales:** ids 11 a 25 en `src/data/objetosExtra.ts`. Son 15 objetos **ficticios** creados por el equipo (no forman parte del enunciado) para probar búsqueda, filtros y «¿Qué perdiste?». Los ids 1 a 10 son los datos oficiales del enunciado, cargados tal cual en `src/data/objetosPrueba.ts` y en Supabase (`supabase/instalar_todo.sql`). En Supabase también hay un objeto reportado durante las pruebas («Botella de prueba», id 1000, con foto ficticia de un objeto). Para volver al estado inicial antes de la demostración: `supabase/05_reiniciar_demo.sql`.

| id | Objeto | Categoría | Estado |
|---|---|---|---|
| 11 | Mochila gris | Útiles | Disponible |
| 12 | Casaca deportiva del colegio | Ropa | Entregado |
| 13 | Memoria USB de 32 GB | Tecnología | Disponible |
| 14 | Raqueta de tenis de mesa | Deportes | Disponible |
| 15 | Lonchera térmica | Otros | Reclamado |
| 16 | Juego geométrico | Útiles | Disponible |
| 17 | Gafas de lectura | Otros | Disponible |
| 18 | Cargador de celular | Tecnología | Disponible |
| 19 | Canilleras de fútbol | Deportes | Disponible |
| 20 | Bufanda tejida | Ropa | Disponible |
| 21 | Libro de Matemática | Útiles | Reclamado |
| 22 | Reloj de pulsera | Otros | Disponible |
| 23 | Cuerda para saltar | Deportes | Entregado |
| 24 | Mouse inalámbrico | Tecnología | Disponible |
| 25 | Sombrero de paja | Ropa | Disponible |
