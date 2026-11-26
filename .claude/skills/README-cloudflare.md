# Procedencia de las skills `cloudflare-*`

- **Repositorio oficial:** https://github.com/cloudflare/skills (organización `cloudflare`, descripción: "Skills for teaching agents how to build on Cloudflare").
- **Commit copiado:** `ff191de7d903788eceaf516a514ae7d3b56b924a` (2026-11-24), clon `--depth 1` revisado el 2026-11-26.
- **Licencia:** Apache-2.0 (copia en `LICENSE` dentro de cada carpeta).

| Carpeta local | Origen en el repo | Para qué |
|---|---|---|
| `cloudflare-wrangler/` | `skills/wrangler/` | Ejecutar/revisar comandos de Wrangler (deploy, config `wrangler.jsonc`). |
| `cloudflare-workers-best-practices/` | `skills/workers-best-practices/` | Revisar configuración y buenas prácticas de Workers. |

**Cambios locales (únicos):** en el frontmatter de cada `SKILL.md`, `name` se cambió para coincidir con la carpeta
(`wrangler` → `cloudflare-wrangler`, `workers-best-practices` → `cloudflare-workers-best-practices`) y se añadió
`disable-model-invocation: true` (regla del proyecto: skills solo por pedido explícito). El resto del texto es el original.

**Revisión de seguridad:** ambas skills son solo Markdown (sin scripts). No ejecutan comandos de red por sí mismas;
`references/skill-feedback.md` solo describe cómo abrir un issue público **con aprobación previa del usuario**.
No se copiaron las demás skills del repo (agents-sdk, turnstile-spin con scripts `.sh`, sandbox, etc.) por no ser relevantes.
