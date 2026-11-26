import type { Estado, Objeto } from '../types'

// Entrada: lista de objetos · Proceso: suma cuántos hay en cada estado (los tres estados
// aparecen siempre, aunque sea con 0) · Salida: { Disponible, Reclamado, Entregado }.
export function contarPorEstado(objetos: readonly Objeto[]): Record<Estado, number> {
  const conteo: Record<Estado, number> = { Disponible: 0, Reclamado: 0, Entregado: 0 }
  for (const objeto of objetos) conteo[objeto.estado] += 1
  return conteo
}

// Entrada: objeto · Proceso: regla del inspector (solo se entrega lo Reclamado) · Salida: true/false.
export function puedeEntregar(objeto: Objeto): boolean {
  return objeto.estado === 'Reclamado'
}
