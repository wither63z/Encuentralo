# Declaración de uso de IA (Anexo B)

1. **Herramientas y tareas:** Claude Code (Opus) para el scaffold inicial (William), la revisión de componentes, los datos ficticios ids 11–25, los comentarios Entrada · Proceso · Salida y la función innovadora «¿Qué perdiste?» (Gabriel). Claude y v0.dev para proponer el diseño de las páginas (Mister). El registro completo está en `docs/BITACORA_IA.md`.
2. **Prompts (sin datos privados):**
   - "Revisa los 12 componentes contra las reglas del reto (Reclamar desactivado si no está Disponible, error bajo el campo, mensaje sin resultados, paleta) y corrige solo lo que falte, sin renombrar ni cambiar props."
   - "Implementa «¿Qué perdiste?»: muestra los 3 objetos Disponibles más parecidos; +20 por palabra (tope 60), +25 por categoría, +15 por lugar, con razones y tests."
3. **Resultado de IA revisado/corregido y cómo se comprobó:** la IA propuso los extras y la función de coincidencias; el equipo revisó que los 10 datos oficiales no cambiaran, que nunca se sugieran objetos Reclamados o Entregados y que cada archivo tenga 150 líneas o menos. Se comprobó con `npm run typecheck`, `npm run verificar`, `npm run test` (17 pruebas) y `npm run build`.
4. **Fragmento de código asistido por IA y su explicación** (`src/features/coincidencias/calcularCoincidencia.ts`):
   ```ts
   return objetos
     .filter((objeto) => objeto.estado === 'Disponible')
     .map((objeto) => calcularCoincidencia(objeto, descripcion))
     .filter((coincidencia) => coincidencia.puntaje > 0)
     .sort((a, b) => b.puntaje - a.puntaje || b.objeto.fecha.localeCompare(a.objeto.fecha))
     .slice(0, maximo)
   ```
   Primero se quedan solo los objetos Disponibles (regla 2: lo demás no se puede reclamar). A cada uno se le calcula el puntaje, se descartan los que no se parecen en nada (0 puntos), se ordenan de mayor a menor puntaje (si empatan, gana el hallado más reciente) y se devuelven los 3 primeros.
