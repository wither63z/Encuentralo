import type { Categoria, Objeto } from '../../types'
import { normalizarTexto } from '../../utils'

export const MAX_LUGARES = 3

// Entrada: objetos, categoría y palabras opcionales · Proceso: cuenta por lugar los objetos
// que coinciden por categoría o texto, o todos si ninguno coincide · Salida: hasta 3 lugares ordenados.
export function predecirLugares(
  objetos: readonly Objeto[],
  categoria?: Categoria | 'Todas',
  palabras: string[] = [],
): { lugar: string; cantidad: number }[] {
  const palabrasNormalizadas = palabras.map(normalizarTexto).filter(Boolean)
  // Entrada: objeto · Proceso: compara categoría o palabras en nombre y descripción
  // Salida: indica si el objeto coincide.
  const similares = objetos.filter((objeto) => {
    if (categoria !== 'Todas' && categoria === objeto.categoria) return true
    const nombre = normalizarTexto(objeto.nombre)
    const descripcion = normalizarTexto(objeto.descripcion)
    for (const palabra of palabrasNormalizadas) {
      if (nombre.includes(palabra) || descripcion.includes(palabra)) return true
    }
    return false
  })

  const conteo = new Map<string, number>()
  for (const { lugar } of similares.length > 0 ? similares : objetos) {
    conteo.set(lugar, (conteo.get(lugar) ?? 0) + 1)
  }

  // Entrada: par del conteo · Proceso: nombra sus valores · Salida: lugar con su cantidad.
  const lugares = Array.from(conteo, ([lugar, cantidad]) => ({ lugar, cantidad }))
  // Entrada: dos lugares · Proceso: compara cantidad y deshace empates por nombre
  // Salida: orden de ambos lugares.
  lugares.sort((a, b) => b.cantidad - a.cantidad || a.lugar.localeCompare(b.lugar, 'es'))
  return lugares.slice(0, MAX_LUGARES)
}
