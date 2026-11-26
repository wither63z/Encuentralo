# Encuéntralo — reglas para cualquier IA que trabaje aquí

Concurso UCACUE "Mentes que Programan 2026", Cat. B. SPA web mobile-first de objetos perdidos del Técnico Salesiano. Datos 100% ficticios. El enunciado oficial manda sobre todo lo demás.

## Reparto (nunca edites fuera de la carpeta de la persona que te habla)
- **William** (main): `src/types config utils services hooks App.tsx main.tsx`, config raíz, `.github`, `scripts`, `supabase/`, tests.
- **Gabriel** (feature/componentes): `src/components/` (ui, layout, objetos, reclamo), `src/data/`, `docs/`.
- **Mister** (feature/ui): `src/pages/`, `src/index.css`, `public/`.
- `src/features/`: función innovadora, dueño por definir.

## Arquitectura
types → config → utils (puras) → services (adapters) → hooks → components (props-only) → pages (containers) → App.
Dependencias solo hacia abajo. Components no importan services/hooks. Pages no importan otras pages.
`RepositorioObjetos` + `obtenerRepositorio()` elige mock/Supabase por `VITE_USE_MOCK` (default true: sin claves).
Navegación: unión `Vista` + `useNavegacion` (sin router). Textos en `config/textos.ts`, estados en `config/estados.ts`, constantes en `config/constantes.ts`, colores solo como tokens en `index.css` (`bg-marca`, `text-texto-suave`…).

## Contrato (no renombrar)
Ver `src/types/index.ts`, `src/services/RepositorioObjetos.ts`, barrels `src/*/index.ts`.

## Reglamento
- Máx. 150 líneas por archivo (`npm run verificar`). TS strict sin `any`.
- Nombres en español. Cada función importante empieza con comentario de 2 líneas: Entrada · Proceso · Salida.
- Antes de commitear: `npm run typecheck && npm run verificar && npm run test && npm run build`.
- Cero secretos: no leer ni crear `.env`; solo `.env.example`. Nunca service_role.
- Sin force-push. Bitácora en `docs/BITACORA_IA.md` (solo pruebas realmente ejecutadas).

## Reglas del jurado (no romper)
1. Estados Disponible/Reclamado/Entregado. 2. Solo se reclama lo Disponible. 3. Reclamo válido → Reclamado, visible en el listado.
4. Nombre, curso y seña obligatorios; seña ≥ 10. 5. Si falla, no se registra y se explica. 6. Búsqueda sin resultados muestra mensaje.

## Skills del proyecto (`.claude/skills/`, solo por pedido explícito)
`grill-me`/`grilling` (mattpocock/skills, MIT) y `design-system` (tokens propios + referencia de nexu-io/open-design, Apache-2.0). Versiones fijadas en `design-system/SKILL.md`.
`cloudflare-wrangler` y `cloudflare-workers-best-practices` (cloudflare/skills, Apache-2.0; procedencia en `.claude/skills/README-cloudflare.md`).
