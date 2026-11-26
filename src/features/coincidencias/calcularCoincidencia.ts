import type { Categoria, Objeto } from '../../types'
import { normalizarTexto } from '../../utils'

/** Puntaje mínimo para sugerir un objeto: evita sugerir solo por la categoría (25). */
export const PUNTAJE_MINIMO = 40

// Lo que el estudiante cuenta sobre el objeto que perdió.
export interface DescripcionPerdida {
  texto: string
  categoria: Categoria | 'Todas'
  lugar: string
}

// Un objeto disponible con su puntaje de parecido y las razones del puntaje.
export interface Coincidencia {
  objeto: Objeto
  puntaje: number
  razones: string[]
}

export const PUNTOS_POR_PALABRA = 20
export const TOPE_PALABRAS = 60
export const PUNTOS_CATEGORIA = 25
export const PUNTOS_LUGAR = 15

/** Palabras que no ayudan a distinguir objetos (ya normalizadas, sin tildes). */
const PALABRAS_VACIAS: readonly string[] = [
  'con', 'del', 'las', 'los', 'una', 'uno', 'unos', 'unas', 'por', 'para', 'que', 'mis',
  'color', 'era', 'tiene', 'tenia', 'perdi', 'creo', 'donde', 'cuando', 'muy', 'este', 'esta',
  'ese', 'esa', 'sus', 'mio', 'mia', 'algo', 'como', 'pero', 'sin', 'hay', 'fue',
]

// Entrada: texto libre · Proceso: normaliza, separa por no-letras, quita cortas, vacías y repetidas
// Salida: lista de palabras clave sin tildes y en minúsculas.
export function extraerPalabrasClave(texto: string): string[] {
  const palabras = normalizarTexto(texto).split(/[^a-z0-9ñ]+/)
  const utiles = palabras.filter((p) => p.length >= 3 && !PALABRAS_VACIAS.includes(p))
  return [...new Set(utiles)]
}

// Entrada: objeto y descripción de lo perdido · Proceso: suma puntos por palabras (con tope),
// categoría y lugar · Salida: Coincidencia con puntaje total y razones legibles.
export function calcularCoincidencia(objeto: Objeto, descripcion: DescripcionPerdida): Coincidencia {
  const razones: string[] = []
  const textoObjeto = normalizarTexto(`${objeto.nombre} ${objeto.descripcion}`)
  const maximoPalabras = TOPE_PALABRAS / PUNTOS_POR_PALABRA
  const palabrasQueCoinciden = extraerPalabrasClave(descripcion.texto)
    .filter((palabra) => textoObjeto.includes(palabra))
    .slice(0, maximoPalabras)
  for (const palabra of palabrasQueCoinciden) {
    razones.push(`Coincide la palabra «${palabra}» (+${PUNTOS_POR_PALABRA})`)
  }
  let puntaje = palabrasQueCoinciden.length * PUNTOS_POR_PALABRA

  if (descripcion.categoria !== 'Todas' && descripcion.categoria === objeto.categoria) {
    puntaje += PUNTOS_CATEGORIA
    razones.push(`Misma categoría: ${objeto.categoria} (+${PUNTOS_CATEGORIA})`)
  }

  const lugarObjeto = normalizarTexto(objeto.lugar)
  const coincideLugar = extraerPalabrasClave(descripcion.lugar).some((p) => lugarObjeto.includes(p))
  if (coincideLugar) {
    puntaje += PUNTOS_LUGAR
    razones.push(`Mismo lugar: ${objeto.lugar} (+${PUNTOS_LUGAR})`)
  }

  return { objeto, puntaje, razones }
}

// Entrada: objetos, descripción y cuántos mostrar · Proceso: solo Disponibles, puntúa, quita los de menos de PUNTAJE_MINIMO,
// ordena por puntaje (empate: fecha más reciente) · Salida: las mejores coincidencias.
export function buscarCoincidencias(
  objetos: readonly Objeto[],
  descripcion: DescripcionPerdida,
  maximo = 3,
): Coincidencia[] {
  return objetos
    .filter((objeto) => objeto.estado === 'Disponible')
    .map((objeto) => calcularCoincidencia(objeto, descripcion))
    .filter((coincidencia) => coincidencia.puntaje >= PUNTAJE_MINIMO)
    .sort((a, b) => b.puntaje - a.puntaje || b.objeto.fecha.localeCompare(a.objeto.fecha))
    .slice(0, maximo)
}
