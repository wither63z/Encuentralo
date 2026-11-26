# Mapa de navegación

Navegación sin router: `App.tsx` muestra una vista según la unión `Vista` (`src/types/index.ts`).

```
   Login (Clerk: Google o correo verificado) — en la web publicada, antes de todo
                │
                ▼
                ┌──────────── Navbar: Inicio · Objetos ────────────┐
                ▼                                                  ▼
Inicio ──Ver objetos──▶ Listado ──tarjeta──▶ Detalle ──Reclamar (solo Disponible)──▶ Formulario
                          ▲  ▲                 │                                       │  │
                          │  └──Volver al listado                       Cancelar ◀──────┘  │ Enviar
                          │                                                                ▼
                          └────────────── Volver al listado ──────────── Confirmación (éxito / error)

Pie de página (todas las vistas):
  «Reportar objeto encontrado» ──▶ Reportar (con foto) ──Registrar──▶ Detalle del objeto nuevo
  «¿Qué perdiste?» ──▶ Coincidencias ──Ver detalle──▶ Detalle  (sin resultados: «Ver el listado completo» ──▶ Listado)
  «Modo inspector» (solo profesores) ──▶ Inspector + Radar ──objeto estancado──▶ Detalle
```

| Vista | Qué muestra | Cómo se llega | Reglas del jurado |
|---|---|---|---|
| Inicio | Identidad, explicación, pasos y botón «Ver objetos» | Al abrir la app o desde la Navbar | — |
| Listado | Tarjetas (nombre, fecha, categoría, estado) + búsqueda y filtros | «Ver objetos», Navbar o «Volver al listado» | 1, 3 (refleja Reclamado), 6 (mensaje sin resultados) |
| Detalle | Información completa, ícono y botón «Reclamar» | Tocar una tarjeta o «Ver detalle» en coincidencias | 2 (desactivado con razón si no está Disponible) |
| Formulario de reclamo | Nombre, curso y seña con errores junto a cada campo y contador n / 10 | «Reclamar» en un objeto Disponible | 4, 5 |
| Confirmación | Éxito o error y «Volver al listado» | Al enviar el formulario | 3 |
| ¿Qué perdiste? | Descripción de lo perdido y los 3 objetos Disponibles más parecidos | Pie de página | Solo sugiere Disponibles |
| Reportar | Formulario con nombre, categoría, lugar, fecha, descripción y foto opcional | Pie, Inicio o botón flotante del Listado | Validación de campos |
| Inspector + Radar | Conteo por estado, marcar Entregado, objetos estancados (> 5 días) y top 3 de lugares y categorías | Pie (solo con rol de profesor) | 1 |

El login aparece primero en la web publicada (Clerk activo). En el .exe y la APK no hay login: se reclama directo y el Modo inspector no se muestra. Bocetos de las pantallas: `docs/bocetos/`.
