import { CATEGORIAS, FOTO, LIMITES_REPORTE, TEXTOS } from '../config'
import type { DatosNuevoObjeto, ErroresNuevoObjeto } from '../types'

const E = TEXTOS.reportar.errores
const entre = (texto: string, l: { min: number; max: number }) => texto.length >= l.min && texto.length <= l.max

// Entrada: fecha "YYYY-MM-DD" y "hoy" · Proceso: valida formato y que no sea futura · Salida: true/false.
export function esFechaValida(fecha: string, hoy: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(fecha) && !Number.isNaN(Date.parse(fecha)) && fecha <= hoy
}

// Entrada: foto opcional · Proceso: solo data URL de imagen o URL https, con tamaño limitado
// Salida: true si se puede guardar.
export function esFotoValida(foto: string | undefined): boolean {
  if (foto === undefined || foto === '') return true
  if (foto.length > FOTO.maxCaracteres) return false
  return /^data:image\/(jpeg|png|webp);base64,/.test(foto) || foto.startsWith('https://')
}

// Entrada: datos del formulario y fecha de hoy · Proceso: recorta espacios y aplica límites
// Salida: errores por campo (vacío = todo correcto).
export function validarNuevoObjeto(datos: DatosNuevoObjeto, hoy: string): ErroresNuevoObjeto {
  const errores: ErroresNuevoObjeto = {}
  if (!entre(datos.nombre.trim(), LIMITES_REPORTE.nombre)) errores.nombre = E.nombre
  if (!CATEGORIAS.some((c) => c === datos.categoria)) errores.categoria = E.categoria
  if (!entre(datos.lugar.trim(), LIMITES_REPORTE.lugar)) errores.lugar = E.lugar
  if (!esFechaValida(datos.fecha, hoy)) errores.fecha = E.fecha
  if (!entre(datos.descripcion.trim(), LIMITES_REPORTE.descripcion)) errores.descripcion = E.descripcion
  if (!esFotoValida(datos.foto)) errores.foto = E.foto
  return errores
}

// Entrada: nada · Proceso: fecha local de hoy · Salida: "YYYY-MM-DD".
export function hoyIso(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
