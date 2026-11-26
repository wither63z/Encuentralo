import { CONSERVAR_DATOS_DEMO } from '../config'
import type { DatosReclamo, ReclamoRegistrado } from '../types'

// Reclamos del modo demo: en memoria y, si se puede, en localStorage (igual que los objetos).
const CLAVE = 'encuentralo:reclamos'

// Entrada: valor leído del navegador · Proceso: revisa la forma · Salida: true si es un reclamo.
function esReclamo(valor: unknown): valor is ReclamoRegistrado {
  if (typeof valor !== 'object' || valor === null) return false
  const v = valor as Record<string, unknown>
  return typeof v.objetoId === 'number' && typeof v.nombre === 'string'
    && typeof v.curso === 'string' && typeof v.sena === 'string'
}

// Entrada: nada · Proceso: lee y valida lo guardado · Salida: lista de reclamos (vacía si no hay).
function leer(): ReclamoRegistrado[] {
  if (!CONSERVAR_DATOS_DEMO) return []
  try {
    const crudo: unknown = JSON.parse(localStorage.getItem(CLAVE) ?? '[]')
    return Array.isArray(crudo) ? crudo.filter(esReclamo) : []
  } catch {
    return []
  }
}

let reclamos: ReclamoRegistrado[] = leer()

// Entrada: lista · Proceso: la guarda en localStorage si está disponible · Salida: nada.
function guardar(): void {
  if (!CONSERVAR_DATOS_DEMO) return
  try {
    localStorage.setItem(CLAVE, JSON.stringify(reclamos))
  } catch {
    // Sin almacenamiento: queda solo en memoria.
  }
}

// Entrada: id del objeto y datos del formulario · Proceso: guarda el reclamo (recortado)
// Salida: nada. El inspector lo usará para verificar al dueño.
export function guardarReclamoMock(objetoId: number, datos: DatosReclamo): void {
  reclamos = [...reclamos.filter((r) => r.objetoId !== objetoId), {
    objetoId, nombre: datos.nombre.trim(), curso: datos.curso.trim(), sena: datos.sena.trim(),
    creadoEn: new Date().toISOString(),
  }]
  guardar()
}

// Entrada: nada · Proceso: copia la lista · Salida: reclamos registrados en el modo demo.
export function listarReclamosMock(): ReclamoRegistrado[] {
  return reclamos.map((r) => ({ ...r }))
}

// Entrada: nada · Proceso: vacía memoria y almacenamiento · Salida: nada.
export function borrarReclamosMock(): void {
  reclamos = []
  try {
    if (CONSERVAR_DATOS_DEMO) localStorage.removeItem(CLAVE)
  } catch {
    // Sin almacenamiento: no hay nada que borrar.
  }
}
