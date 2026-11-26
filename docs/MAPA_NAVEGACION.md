# Mapa de navegación

Navegación sin router: `App.tsx` muestra una vista según la unión `Vista` (`src/types/index.ts`).

```
                ┌──────────── Navbar: Inicio · Objetos ────────────┐
                ▼                                                  ▼
Inicio ──Ver objetos──▶ Listado ──tarjeta──▶ Detalle ──Reclamar (solo Disponible)──▶ Formulario
                          ▲  ▲                 │                                       │  │
                          │  └──Volver al listado                       Cancelar ◀──────┘  │ Enviar
                          │                                                                ▼
                          └────────────── Volver al listado ──────────── Confirmación (éxito / error)

Pie de página (todas las vistas):
  «¿Qué perdiste?» ──▶ Coincidencias ──Ver detalle──▶ Detalle
  «Modo inspector» ──▶ Inspector (marcar Entregado, conteo por estado)
```

| Vista | Qué muestra | Cómo se llega | Reglas del jurado |
|---|---|---|---|
| Inicio | Identidad, explicación, pasos y botón «Ver objetos» | Al abrir la app o desde la Navbar | — |
| Listado | Tarjetas (nombre, fecha, categoría, estado) + búsqueda y filtros | «Ver objetos», Navbar o «Volver al listado» | 1, 3 (refleja Reclamado), 6 (mensaje sin resultados) |
| Detalle | Información completa, ícono y botón «Reclamar» | Tocar una tarjeta o «Ver detalle» en coincidencias | 2 (desactivado con razón si no está Disponible) |
| Formulario de reclamo | Nombre, curso y seña con errores junto a cada campo y contador n / 10 | «Reclamar» en un objeto Disponible | 4, 5 |
| Confirmación | Éxito o error y «Volver al listado» | Al enviar el formulario | 3 |
| ¿Qué perdiste? | Descripción de lo perdido y los 3 objetos Disponibles más parecidos | Pie de página | Solo sugiere Disponibles |
| Inspector | Conteo por estado y botón para marcar Entregado | Pie de página | 1 |

Login solo aparece si Clerk está activo; en la demo (`VITE_USE_MOCK=true`) se reclama directo.
