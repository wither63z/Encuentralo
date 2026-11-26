# Defensa · «¿Qué perdiste?» (Gabriel)

**Problema:** quien perdió algo no sabe con qué palabra buscarlo ni revisa los 25 objetos uno por uno. Con «¿Qué perdiste?» describe su objeto con sus propias palabras y la app le sugiere los **3 objetos Disponibles** más parecidos, con su puntaje y el motivo de cada punto. Nunca sugiere objetos Reclamados o Entregados (regla 2).

Código: `src/features/coincidencias/calcularCoincidencia.ts` (lógica pura) · `FormularioPerdida.tsx` · `ResultadosCoincidencias.tsx` · tests en `coincidencias.test.ts`.

## Tabla de puntajes

| Qué coincide | Puntos | Constante (línea) |
|---|---|---|
| Cada palabra clave que aparece en el nombre o la descripción | +20 | `PUNTOS_POR_PALABRA` (21) |
| Tope por palabras (máximo 3 palabras) | 60 | `TOPE_PALABRAS` (22) |
| Misma categoría | +25 | `PUNTOS_CATEGORIA` (23) |
| Una palabra del lugar aparece en el lugar del objeto | +15 | `PUNTOS_LUGAR` (24) |
| **Mínimo para sugerir** | 40 | `PUNTAJE_MINIMO` (5) |

Máximo posible: 60 + 25 + 15 = **100**. Con el mínimo de 40, la categoría sola (25) no alcanza: antes la app sugería objetos solo por la categoría.

## Ejemplo paso a paso: «chompa azul con capucha» · Ropa · «cancha»

1. `extraerPalabrasClave` pasa todo a minúsculas sin tildes y quita las palabras vacías («con»): quedan `chompa`, `azul`, `capucha`.
2. Se descartan los objetos que no están Disponibles (quedan 18 de 25).
3. Objeto 1 «Chompa azul con capucha»: las 3 palabras aparecen → 3 × 20 = **60**.
4. La categoría es Ropa = Ropa → **+25** (85).
5. «cancha» aparece en «Cancha de básquet» → **+15** (**100**).
6. Se ordena de mayor a menor (si empatan, gana el hallado más reciente), se quitan los de menos de 40 y se muestran los 3 primeros. El objeto 1 sale primero con 100 puntos.

## Preguntas probables

1. **¿Por qué no aparece la calculadora si escribo «calculadora»?** Porque está Reclamada: solo se sugieren Disponibles (regla 2).
2. **¿Por qué hay un mínimo de 40?** Para que una sola coincidencia débil (solo la categoría, 25 puntos) no muestre objetos que no se parecen.
3. **¿Importan las mayúsculas o las tildes?** No: `normalizarTexto` lo pasa todo a minúsculas sin tildes («CALCULADORA» = «calculadora», «audífono» = «audifono»).
4. **¿Por qué el tope de 60 por palabras?** Para que una descripción muy larga no gane solo por cantidad de palabras; la categoría y el lugar también pesan.
5. **¿Cómo sabes que funciona?** Hay 9 tests (`npm run test`): el caso de la chompa da 100, la categoría sola da lista vacía, nunca salen Reclamados ni Entregados y «CALCULADORA» encuentra la calculadora.

## Dos modificaciones en vivo

1. **Pedir más parecido (mínimo de 60):** en `calcularCoincidencia.ts`, **línea 5**, cambiar `export const PUNTAJE_MINIMO = 40` por `export const PUNTAJE_MINIMO = 60`. Ahora «chompa azul» + Ropa (40 + 25 = 65) sí sale, pero «chompa» + Ropa (20 + 25 = 45) ya no.
2. **Mostrar 5 sugerencias en lugar de 3:** en `calcularCoincidencia.ts`, **línea 75**, cambiar `maximo = 3,` por `maximo = 5,`.

Después de cada cambio: `npm run test` (algún test fallará a propósito, porque espera el valor anterior) y `npm run dev` para verlo en pantalla.
