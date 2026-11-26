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
  5. Innovación «¿Qué perdiste?»: el estudiante describe su objeto y la app sugiere los 3 objetos Disponibles más parecidos, con puntaje y razones.
- **Plataforma:** Web (responsive, móvil y escritorio)
- **Tecnologías:** Vite, React, TypeScript, Tailwind CSS, lucide-react (opcional: Supabase, Clerk)
- **Dónde se guardan los datos:** en memoria (modo demo, por defecto) o Supabase.
- **Cómo ejecutar:** ver README.md, sección "Cómo ejecutar el proyecto".
- **Datos simulados adicionales:** ids 11 a 25 en `src/data/objetosExtra.ts`. Son 15 objetos **ficticios** creados por el equipo (no forman parte del enunciado) para probar búsqueda, filtros y «¿Qué perdiste?». Los ids 1 a 10 son los datos oficiales del enunciado, cargados tal cual en `src/data/objetosPrueba.ts`.

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
