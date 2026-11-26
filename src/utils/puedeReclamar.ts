import { TEXTOS } from '../config'
import type { Objeto } from '../types'

// Entrada: objeto · Proceso: regla 2 (solo se reclama lo Disponible) · Salida: true/false.
export function puedeReclamar(objeto: Objeto): boolean {
  return objeto.estado === 'Disponible'
}

// Entrada: objeto · Proceso: elige el motivo según el estado · Salida: texto o null si se puede reclamar.
export function razonNoReclamable(objeto: Objeto): string | null {
  if (objeto.estado === 'Reclamado') return TEXTOS.detalle.razonReclamado
  if (objeto.estado === 'Entregado') return TEXTOS.detalle.razonEntregado
  return null
}
