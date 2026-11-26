---
name: design-system
description: Aplica el sistema de diseño de Encuéntralo (tokens, estados, tipografía, accesibilidad) al crear o revisar componentes y páginas. Usar solo cuando se pida explícitamente.
disable-model-invocation: true
---

Fuente de verdad, en este orden:
1. `DESIGN.md` en la raíz del repo y los tokens `@theme` de `src/index.css`.
2. `src/config/estados.ts` (color + ícono + texto por estado) y `src/config/textos.ts`.
3. `REFERENCIA-friendly.md` (paquete "friendly" de nexu-io/open-design, Apache-2.0) solo como inspiración de tono y ritmo; nunca reemplaza los tokens de la marca.

Reglas: colores solo por tokens semánticos (sin hex en componentes) · táctiles ≥44px (`min-h-11`) · foco visible · contraste AA (texto blanco solo sobre `marca`) · estados siempre color + ícono + texto · una acción primaria por pantalla.

Procedencia (fijada, no actualizar automáticamente):
- grill-me / grilling: mattpocock/skills @ 6f7f7831a625f040a8e06a0e7954826b87ce775a (MIT)
- REFERENCIA-*: nexu-io/open-design @ 6a74a1521ea2745fcf448bda7cdb8114f20d19b5 (Apache-2.0)
