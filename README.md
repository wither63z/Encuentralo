# Encuéntralo · Objetos perdidos · Técnico Salesiano

App (Vite + React + TypeScript + Tailwind; web, Android y Windows) para explorar objetos perdidos del colegio, buscarlos, ver su detalle y registrar un reclamo de prueba.
Proyecto para "Mentes que Programan 2026" (Categoría B). Carpeta de entrega: `CategoriaB_TecnicoSalesiano_Encuentralo`.

## Acceso rápido (jurado)
| Qué | Dónde | Login |
|---|---|---|
| Presentación (landing) | https://encuentralo.encuentralo.workers.dev · copia: https://wither63z.github.io/Encuentralo/ | No |
| App web | https://encuentralo.encuentralo.workers.dev/app/ | Sí: Google o correo verificado (credenciales de demostración se entregan aparte, no van en el código) |
| Android (APK) | https://github.com/wither63z/Encuentralo/releases/latest/download/Encuentralo.apk | No |
| Windows (.exe portable) | https://github.com/wither63z/Encuentralo/releases/latest/download/Encuentralo.exe | No |

Entregables: ficha `docs/FICHA_PROYECTO.md` · declaración de IA `docs/DECLARACION_IA.md` · registro de IA `docs/BITACORA_IA.md` · mapa `docs/MAPA_NAVEGACION.md` · bocetos `docs/bocetos/` · Android Studio `docs/ANDROID_STUDIO.md`.

## Cómo ejecutar el proyecto en local
Requisitos: Node.js 20 o superior.
```bash
git clone https://github.com/wither63z/Encuentralo.git
cd Encuentralo
npm install
cp .env.example .env      # en Windows PowerShell: copy .env.example .env
npm run dev -- --host
```
Abrir la URL que muestra la terminal (en el celular, la de "Network" en la misma red WiFi).
Con `.env.example` (`VITE_USE_MOCK=true`) funciona sin internet ni claves, con los datos de prueba; los cambios se conservan en el navegador («Modo inspector → Restablecer datos de demostración» vuelve al inicio).
Para usar la base real: `VITE_USE_MOCK=false` + URL y clave **publicable** de Supabase (y `VITE_CLERK_PUBLISHABLE_KEY` para el login). Base: `supabase/instalar_todo.sql` + `04_roles.sql`; antes de la demo, `05_reiniciar_demo.sql`.

## Modos de compilación
| Versión | Archivo de configuración | Datos | Login | Modo inspector |
|---|---|---|---|---|
| Web publicada (`npm run sitio`) | `.env.web` | Supabase | Clerk primero | Solo profesores |
| .exe y APK (`npm run exe`, `npm run apk:preparar`) | `.env.production` | Supabase + respaldo local sin internet | No | Oculto |
| Desarrollo (`npm run dev`) | `.env` | Mock o Supabase | Según `.env` | Según rol |

## Ejecutable de escritorio y APK
- **Windows (.exe portable):** `npm run exe` → `release/Encuentralo-0.1.0.exe` (doble clic, no requiere instalación). Para probar sin empaquetar: `npm run escritorio`.
- **Android (APK):** se compila en GitHub Actions (flujo *Empaquetar*, en cada push a `main`) y se publica en el Release. En local con Android Studio: ver `docs/ANDROID_STUDIO.md`.

## Cambios rápidos en la defensa
Si el jurado pide un cambio, se edita el código y se muestra así (tiempos medidos en el PC de desarrollo, Windows 11, 26-11-2026):

| Dónde mostrar | Comando | Tiempo medido |
|---|---|---|
| Navegador del PC (recarga en caliente) | `npm run dev` | Vite listo en ~0,7 s; cada cambio se ve al guardar |
| Celular por WiFi, **sin SDK** | `npm run dev -- --host` y abrir en el celular `http://IP-DEL-PC:5173` | Igual que arriba |
| App de escritorio en vivo (Electron + recarga en caliente) | `npm run escritorio:vivo` | Vite listo en ~0,7 s (apertura de la ventana no cronometrada) |
| Compilar la web | `npm run build` | 3,0–3,5 s |
| `.exe` sin comprimir (`release/win-unpacked/Encuentralo.exe`) | `npm run exe:rapido` | 16–18 s (no se midió `npm run exe` completo) |
| APK en vivo contra el PC | `npm run dev -- --host` + `npm run apk:vivo` | No medido: **requiere Android SDK/Studio** y el celular por USB (no instalado aquí) |

- `escritorio:vivo` levanta Vite en el puerto 5173 y abre Electron con `ENCUENTRALO_URL=http://localhost:5173`. Si el puerto está ocupado, avisa y no abre nada; usar `ENCUENTRALO_PUERTO=5174 npm run escritorio:vivo`. El `.exe` empaquetado ignora esa variable y siempre abre la copia offline.
- APK en vivo con una APK instalada: `CAP_SERVER_URL=http://IP-DEL-PC:5173 npx cap sync android` y recompilar; la app cargará el servidor del PC (sin la variable, vuelve a ser offline). Se necesita el SDK para recompilar, así que en la defensa la vía práctica es el navegador del celular.

## Descargas
- **Release:** al subir un tag `v*` (`git tag v0.1.0 && git push origin v0.1.0`), el flujo *Publicar* (`.github/workflows/publicar.yml`) compila y publica `Encuentralo.apk` y `Encuentralo.exe` en https://github.com/wither63z/Encuentralo/releases/latest, y deja el artifact `sitio`.
- **Landing:** `landing/` (HTML/CSS estático, sin recursos externos) con los botones de descarga y «Usar en el navegador» (`./app/`). `npm run sitio` arma `sitio/` = landing + app en `sitio/app/`.
- **Cloudflare:** `npm run publicar:cloudflare` → `https://encuentralo.<subdominio>.workers.dev`. Guía en [CLOUDFLARE.md](CLOUDFLARE.md) (el login lo hace una persona).

## Arranque por integrante
| Persona | Rama | Carpeta que edita | Primero |
|---|---|---|---|
| William | `main` | `src/types config utils services hooks App.tsx main.tsx`, `scripts`, `supabase` | Integrar ramas, pruebas |
| Gabriel | `feature/componentes` | `src/components/`, `src/data/`, `docs/` | Pulir componentes `ui/`; extras en `src/data` (ids ≥ 11) |
| Mister | `feature/ui` | `src/pages/`, `src/index.css`, `public/` | Diseño de páginas sobre lo existente |

```bash
git clone https://github.com/wither63z/Encuentralo.git
cd Encuentralo
git checkout feature/componentes   # o feature/ui
npm install
cp .env.example .env
npm run dev -- --host
```
Antes de cada commit: `npm run typecheck && npm run verificar && npm run test && npm run build`.

## Scripts
`dev` servidor local · `build` compila · `typecheck` revisa tipos · `verificar` máx. 150 líneas por archivo · `test` pruebas (Vitest) · `escritorio:vivo` Electron en vivo · `exe:rapido` .exe sin comprimir · `apk:vivo` APK en vivo (requiere SDK) · `sitio` arma landing + app · `publicar:cloudflare` despliega el sitio.

## Estructura
```
src/types      contrato de tipos          src/hooks       lógica de React
src/config     textos, estados, reglas    src/components  piezas visuales
src/utils      funciones puras + tests    src/pages       pantallas
src/services   repositorio mock/Supabase  src/data        datos de prueba
supabase/      esquema SQL con RLS        docs/           ficha, IA, mapa
```

## Datos
Supabase (PostgreSQL con RLS, Storage para fotos) en las versiones publicadas; mock local en desarrollo. Ver `supabase/README.md`.
