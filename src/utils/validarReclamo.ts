import { MAX_CARACTERES, MIN_CARACTERES_SENA, TEXTOS } from '../config'
import type { DatosReclamo, ErroresReclamo } from '../types'

// Entrada: datos del formulario · Proceso: recorta espacios y aplica reglas 4 y 5
// Salida: objeto con un mensaje por campo inválido (vacío = todo correcto).
export function validarReclamo(datos: DatosReclamo): ErroresReclamo {
  const errores: ErroresReclamo = {}
  const nombre = datos.nombre.trim()
  const curso = datos.curso.trim()
  const sena = datos.sena.trim()

  if (nombre === '') errores.nombre = TEXTOS.validacion.nombreVacio
  if (curso === '') errores.curso = TEXTOS.validacion.cursoVacio
  if (sena === '') errores.sena = TEXTOS.validacion.senaVacia
  else if (sena.length < MIN_CARACTERES_SENA) errores.sena = TEXTOS.validacion.senaCorta(sena.length)

  if (nombre.length > MAX_CARACTERES.nombre) errores.nombre = TEXTOS.validacion.muyLargo(MAX_CARACTERES.nombre)
  if (curso.length > MAX_CARACTERES.curso) errores.curso = TEXTOS.validacion.muyLargo(MAX_CARACTERES.curso)
  if (sena.length > MAX_CARACTERES.sena) errores.sena = TEXTOS.validacion.muyLargo(MAX_CARACTERES.sena)

  return errores
}

// Entrada: errores de validación · Proceso: revisa si hay alguno · Salida: true si no hay errores.
export function esReclamoValido(errores: ErroresReclamo): boolean {
  return Object.keys(errores).length === 0
}
