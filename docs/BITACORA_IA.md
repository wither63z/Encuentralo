# Bitácora de uso de IA (registro oficial)

Solo se anotan pruebas realmente ejecutadas. Sin datos privados ni claves.

| # | Herramienta | Instrucción (prompt) | Qué devolvió | Qué aceptamos, cambiamos o descartamos | Cómo lo verificamos |
|---|---|---|---|---|---|
| 1 | Claude Code (Opus) | "Genera el scaffold contract-first de Encuéntralo: tipos, config, utils con tests, repositorio mock con los 10 datos oficiales, hooks, componentes y páginas base" | Estructura completa en Vite + React + TS + Tailwind | Aceptado. Revisión humana: pendiente (William) | `npm run typecheck`, `verificar`, `test` (10/10) y `build` pasaron el 26/11 a las 11:00 |
