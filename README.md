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
`dev` servidor local · `build` compila · `typecheck` revisa tipos · `verificar` máx. 150 líneas por archivo · `test` pruebas (Vitest).

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
