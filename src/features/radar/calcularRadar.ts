import type { Objeto } from '../../types'

/** Días sin reclamar a partir de los cuales un objeto Disponible se considera estancado. */
export const DIAS_ESTANCADO = 5

export interface Ranking {
  nombre: string
  cantidad: number
}

export interface Radar {
  estancados: Objeto[]
  topLugares: Ranking[]
  topCategorias: Ranking[]
}

const MS_DIA = 86_400_000

// Entrada: fecha YYYY-MM-DD y hoy YYYY-MM-DD · Proceso: resta en UTC · Salida: días completos.
export function diasDesde(fecha: string, hoy: string): number {
  return Math.floor((Date.parse(`${hoy}T00:00:00Z`) - Date.parse(`${fecha}T00:00:00Z`)) / MS_DIA)
}

// Entrada: lista de textos · Proceso: cuenta repeticiones y ordena (mayor primero, luego A-Z)
// Salida: los 3 más frecuentes.
function top3(valores: string[]): Ranking[] {
  const conteo = new Map<string, number>()
  valores.forEach((v) => conteo.set(v, (conteo.get(v) ?? 0) + 1))
  return [...conteo]
    .map(([nombre, cantidad]) => ({ nombre, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad || a.nombre.localeCompare(b.nombre, 'es'))
    .slice(0, 3)
}

// Entrada: objetos y la fecha de hoy · Proceso: busca Disponibles con más de DIAS_ESTANCADO
// días (los más antiguos primero) y los lugares/categorías con más hallazgos
// Salida: el radar para que el profesor priorice dónde avisar.
export function calcularRadar(objetos: readonly Objeto[], hoy: string): Radar {
  const estancados = objetos
    .filter((o) => o.estado === 'Disponible' && diasDesde(o.fecha, hoy) > DIAS_ESTANCADO)
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
  return {
    estancados,
    topLugares: top3(objetos.map((o) => o.lugar)),
    topCategorias: top3(objetos.map((o) => o.categoria)),
  }
}
