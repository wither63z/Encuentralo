# Encuéntralo · Objetos perdidos · Técnico Salesiano

App web (Vite + React + TypeScript + Tailwind) para explorar objetos perdidos del colegio, buscarlos, ver su detalle y registrar un reclamo de prueba.
Proyecto para "Mentes que Programan 2026" (Categoría B). Carpeta de entrega: `CategoriaB_TecnicoSalesiano_Encuentralo`.

## Cómo ejecutar el proyecto (jurado)
Requisitos: Node.js 20 o superior.
```bash
git clone https://github.com/wither63z/Encuentralo.git
cd Encuentralo
npm install
cp .env.example .env      # en Windows PowerShell: copy .env.example .env
npm run dev -- --host
```
Abrir la URL que muestra la terminal (en el celular, la de "Network" en la misma red WiFi).
Por defecto `VITE_USE_MOCK=true`: funciona sin internet ni claves, con los 10 datos oficiales. Los reclamos se conservan en el navegador; para volver a los datos oficiales usa «Modo inspector → Restablecer datos de demostración».

## Ejecutable de escritorio y APK
- **Windows (.exe portable):** `npm run exe` → `release/Encuentralo-0.1.0.exe` (doble clic, no requiere instalación ni internet). Para probar sin empaquetar: `npm run escritorio`.
- **Android (APK):** se compila en GitHub Actions (flujo *Empaquetar*, en cada push a `main`). Descargar el artifact `Encuentralo-apk`, copiar `app-debug.apk` al celular y permitir "instalar apps de origen desconocido".
  En local (requiere Android Studio/SDK): `npm run apk:preparar` y luego `cd android && ./gradlew assembleDebug`.
- Ambos usan el modo demo (`VITE_USE_MOCK=true`): funcionan sin internet y conservan los reclamos en el dispositivo.

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
Mock en memoria (por defecto) o Supabase (`VITE_USE_MOCK=false` + URL y clave publicable). Ver `supabase/schema.sql`.
