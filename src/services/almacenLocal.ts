import { CATEGORIAS, CLAVE_ALMACEN, CONSERVAR_DATOS_DEMO, ESTADOS } from '../config'
import type { Objeto } from '../types'

// Persistencia del mock en localStorage. Todo va protegido: en Node (tests) o con el
// almacenamiento bloqueado, simplemente no se guarda y la app sigue en memoria.

function hayLocalStorage(): boolean {
  if (!CONSERVAR_DATOS_DEMO) return false
  try {
    return typeof localStorage !== 'undefined'
  } catch {
    return false
  }
}

// Entrada: valor desconocido leído del navegador · Proceso: revisa campos y tipos
// Salida: true solo si tiene la forma exacta de un Objeto válido.
function esObjeto(valor: unknown): valor is Objeto {
  if (typeof valor !== 'object' || valor === null) return false
  const v = valor as Record<string, unknown>
  return typeof v.id === 'number'
    && typeof v.nombre === 'string' && typeof v.lugar === 'string'
    && typeof v.fecha === 'string' && typeof v.descripcion === 'string'
    && CATEGORIAS.some((c) => c === v.categoria) && ESTADOS.some((e) => e === v.estado)
}

// Entrada: nada · Proceso: lee y valida lo guardado · Salida: lista guardada o null
// (si no hay nada, está dañado o no hay localStorage).
export function leerAlmacen(): Objeto[] | null {
  if (!hayLocalStorage()) return null
  try {
    const crudo = localStorage.getItem(CLAVE_ALMACEN)
    if (crudo === null) return null
    const datos: unknown = JSON.parse(crudo)
    return Array.isArray(datos) && datos.length > 0 && datos.every(esObjeto) ? datos : null
  } catch {
    return null
  }
}

// Entrada: lista de objetos · Proceso: la guarda como JSON · Salida: nada (falla en silencio).
export function guardarAlmacen(objetos: readonly Objeto[]): void {
  if (!hayLocalStorage()) return
  try {
    localStorage.setItem(CLAVE_ALMACEN, JSON.stringify(objetos))
  } catch {
    // Cuota llena o modo privado: se sigue trabajando solo en memoria.
  }
}

// Entrada: nada · Proceso: elimina la clave del navegador · Salida: nada.
export function borrarAlmacen(): void {
  if (!hayLocalStorage()) return
  try {
    localStorage.removeItem(CLAVE_ALMACEN)
  } catch {
    // Sin acceso al almacenamiento: no hay nada que borrar.
  }
}
