# Ficha del proyecto

Mentes que Programan 2026 · Categoría B (Software + IA) · Reto «Encuéntralo»

| Dato | Respuesta del equipo |
|---|---|
| **Colegio** | Técnico Salesiano |
| **Integrantes** | William · Gabriel · Mister |
| **Nombre del proyecto** | Encuéntralo |
| **Problema que resuelve** | En la inspección se acumulan chompas, cartucheras, termos y calculadoras que nadie reclama: los estudiantes no saben qué se encontró ni dónde preguntar, y los reclamos se hacen de palabra, sin registro. |
| **Usuarios destinatarios** | Estudiantes, docentes y personal que perdieron un objeto (consultan y reclaman) y los profesores o inspectores que guardan y entregan los objetos (Modo inspector). |
| **Objetivo de la aplicación** | Que cualquier persona de la comunidad encuentre su objeto en menos de un minuto desde el celular o la computadora y deje un reclamo verificable que el inspector pueda confirmar antes de entregar. |
| **Propuesta de valor** | Lista siempre actualizada y con fotos, búsqueda sin tildes y filtros; «¿Qué perdiste?» sugiere los objetos más parecidos; cada reclamo pide una seña que el profesor compara antes de entregar; cuentas verificadas y permisos comprobados en el servidor; funciona en web, Android y Windows, y sigue funcionando si se cae internet. |
| **Funciones principales (3 a 5)** | 1. Explorar la lista de objetos (tarjetas con nombre, fecha, categoría, estado y foto). 2. Buscar y filtrar por texto, categoría y estado, con mensaje cuando no hay resultados. 3. Ver el detalle y reclamar (nombre, curso y seña de mínimo 10 caracteres) con confirmación; solo objetos Disponibles. 4. «¿Qué perdiste?»: describe tu objeto y la app sugiere los 3 Disponibles más parecidos con puntaje. 5. Modo inspector (solo profesores): ve quién reclamó y su seña, marca Entregado, conteo por estado y Radar (objetos estancados más de 5 días y lugares con más hallazgos). Extra: reportar objeto encontrado con foto. |
| **Plataforma: web, móvil o escritorio** | Web responsive (plataforma declarada); además, empaquetada como APK (Android) y .exe portable (Windows) con el mismo código. |
| **Tecnologías utilizadas** | React 19, TypeScript, Vite, Tailwind CSS v4, Phosphor Icons, Vitest (42 pruebas); Supabase (PostgreSQL con RLS y Storage para fotos); Clerk (login con correo verificado o Google, rol de profesor); Capacitor (APK); Electron (.exe); Cloudflare Workers y GitHub Pages (publicación). |
| **Dónde se guardan los datos** | En Supabase: tablas `objetos` y `reclamos` y fotos en Storage. Nadie escribe directo en las tablas: todo pasa por funciones del servidor que validan (un reclamo por objeto, máximo 3 por cuenta, solo profesores entregan o leen reclamos). Si Supabase no responde, la app usa un respaldo local en el dispositivo (localStorage). |
| **Cómo ejecutar o instalar el proyecto** | Web: https://encuentralo.encuentralo.workers.dev/app/ (iniciar sesión). Android: descargar `Encuentralo.apk` de https://github.com/wither63z/Encuentralo/releases/latest y permitir orígenes desconocidos. Windows: descargar `Encuentralo.exe` (portable, sin instalar). Local: `npm install`, `copy .env.example .env`, `npm run dev` (detalles en README.md). |
| **Datos simulados adicionales** | Además de los 10 objetos oficiales (ids 1–10, sin cambios), 15 objetos ficticios creados por el equipo (ids 11–25, tabla abajo) para probar búsqueda, filtros y «¿Qué perdiste?». En Supabase también hay objetos reportados durante las pruebas (id 1000 «Botella de prueba», con foto ficticia de un objeto). Ningún dato es real ni contiene fotos de personas. |

## Registro de uso de IA

| Herramienta | Instrucción (prompt) | Qué devolvió | Qué aceptamos, cambiamos o descartamos | Cómo lo verificamos |
|---|---|---|---|---|
| Claude Code (William) | "Arma la estructura del proyecto contract-first: tipos, textos, reglas 1–6 como funciones puras con pruebas y un repositorio mock con los 10 datos oficiales." | `src/types`, `src/config`, `src/utils` (puedeReclamar, validarReclamo, filtrarObjetos), repositorio mock y 10 pruebas. | Aceptado como base. Cambiamos: todos los textos a un solo archivo (`TEXTOS`) y límite de 150 líneas por archivo para poder explicar el código. | `npm run typecheck`, `npm run test` (10/10) y recorrido en el navegador Inicio → Listado → Detalle → Reclamo → Confirmación (reglas 3–6). |
| Claude Code (Gabriel) | "Implementa «¿Qué perdiste?»: muestra los 3 objetos Disponibles más parecidos; +20 por palabra (tope 60), +25 por categoría, +15 por lugar, con razones y tests." | Lógica de puntaje, formulario, resultados y 7 pruebas. | Cambiamos: sugería objetos solo por coincidir la categoría (25 puntos, resultados sin sentido); pusimos `PUNTAJE_MINIMO = 40` y ajustamos 3 pruebas. Descartamos sugerir objetos Reclamados o Entregados. | Pruebas (a)–(d) del puntaje; búsqueda «chompa azul con capucha» devuelve el id 1 con 100 puntos. |
| Claude Code (William) | "Que solo los profesores puedan usar el modo inspector y los estudiantes no; que no se puedan crear cuentas falsas." | Rol `profesor` en Clerk, función SQL que revisa el rol en el token y botón del inspector solo para profesores. | Cambiamos: el registro fallaba por un SDK de Clerk obsoleto (actualizamos a `@clerk/react` 6) y el rol se leía una sola vez (pasamos al hook `useUser`). Agregamos bloqueo de correos desechables. | Prueba real: cuenta sin rol → el botón no aparece; petición anónima a `marcar_entregado` → «permission denied»; profesor → marca Entregado en Supabase. |
| Codex (ChatGPT) | "Agrega «¿Dónde buscar?» en «¿Qué perdiste?»: cuando no haya coincidencias, muestra los 3 lugares donde más se encuentran objetos parecidos (función pura `predecirLugares` con pruebas, textos en `TEXTOS`, sin librerías nuevas y máximo 150 líneas por archivo)." | `predecirLugares` (cuenta por lugar los objetos que coinciden por categoría o palabra; si ninguno coincide, usa todos), 6 pruebas y el componente `DondeBuscar` conectado a «¿Qué perdiste?». | Aceptado tras revisar el diff de 8 archivos: respeta los nombres y props existentes (las props nuevas son opcionales) y los comentarios Entrada · Proceso · Salida. Corregimos su fila de la bitácora: el aviso de Vite de más de 500 kB ya existía antes (lo causa el peso de Clerk y Supabase) y no viene de este cambio. | Corrimos nosotros `npm run typecheck`, `verificar`, `test` (48/48) y `build`; en el navegador, «paraguas morado» no tiene coincidencias y aparece «¿Dónde buscar?» con el lugar sugerido. |

El registro completo (18 usos) está en `docs/BITACORA_IA.md` y la declaración (Anexo B) en `docs/DECLARACION_IA.md`.

## Anexo: datos simulados adicionales (ids 11–25)

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
