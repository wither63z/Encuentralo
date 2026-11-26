import { expect, it } from 'vitest'
import type { Objeto } from '../../types'
import { predecirLugares } from './predecirLugares'

const base: Objeto = {
  id: 1, nombre: 'Chompa', categoria: 'Ropa', lugar: 'Patio',
  fecha: '2026-11-01', estado: 'Disponible', descripcion: '',
}

// Entrada: campos de prueba · Proceso: completa los campos restantes
// Salida: objeto para el escenario de prueba.
function hacerObjeto(cambios: Partial<Objeto>): Objeto {
  return { ...base, ...cambios }
}

// Entrada: objetos de distinto estado y categoría · Proceso: filtra por Ropa · Salida: solo hallazgos de Ropa.
it('cuenta solo la categoría elegida e incluye objetos de cualquier estado', () => {
  const objetos = [
    hacerObjeto({}),
    hacerObjeto({ id: 2, estado: 'Reclamado' }),
    hacerObjeto({ id: 3, estado: 'Entregado' }),
    hacerObjeto({ id: 4, categoria: 'Útiles', lugar: 'Aula' }),
  ]
  expect(predecirLugares(objetos, 'Ropa')).toEqual([{ lugar: 'Patio', cantidad: 3 }])
})

// Entrada: nombres y descripciones con tildes · Proceso: busca «balon» · Salida: ambos hallazgos.
it('busca palabras en el nombre o la descripción sin distinguir mayúsculas ni tildes', () => {
  const objetos = [
    hacerObjeto({ nombre: 'BALÓN' }),
    hacerObjeto({ id: 2, descripcion: 'Con dibujo de balón' }),
    hacerObjeto({ id: 3, lugar: 'Aula' }),
  ]
  expect(predecirLugares(objetos, 'Todas', ['balon'])).toEqual([{ lugar: 'Patio', cantidad: 2 }])
})

// Entrada: coincidencias por categoría, por palabra y por ambas · Proceso: combina los criterios
// Salida: cada objeto coincidente aporta un hallazgo.
it('incluye coincidencias por cualquiera de los criterios una sola vez', () => {
  const objetos = [
    hacerObjeto({}),
    hacerObjeto({ id: 2, categoria: 'Otros', nombre: 'Bufanda' }),
    hacerObjeto({ id: 3, nombre: 'Bufanda' }),
    hacerObjeto({ id: 4, categoria: 'Útiles', lugar: 'Aula' }),
  ]
  expect(predecirLugares(objetos, 'Ropa', ['bufanda'])).toEqual([{ lugar: 'Patio', cantidad: 3 }])
})

// Entrada: criterios sin coincidencias · Proceso: cuenta el historial completo · Salida: todos los lugares del ejemplo.
it('usa todos los objetos si nada coincide', () => {
  const objetos = [hacerObjeto({}), hacerObjeto({ id: 2, lugar: 'Aula' })]
  expect(predecirLugares(objetos, 'Deportes', ['balon'])).toEqual([
    { lugar: 'Aula', cantidad: 1 },
    { lugar: 'Patio', cantidad: 1 },
  ])
})

// Entrada: cuatro lugares con cantidades distintas o empatadas · Proceso: ordena y limita
// Salida: tres lugares ordenados por cantidad y, en empate, alfabéticamente.
it('devuelve como máximo tres lugares y ordena alfabéticamente los empates', () => {
  const objetos = [
    hacerObjeto({}),
    hacerObjeto({ id: 2, lugar: 'Cancha' }),
    hacerObjeto({ id: 3, lugar: 'Biblioteca' }),
    hacerObjeto({ id: 4, lugar: 'Aula' }),
    hacerObjeto({ id: 5 }),
  ]
  expect(predecirLugares(objetos)).toEqual([
    { lugar: 'Patio', cantidad: 2 },
    { lugar: 'Aula', cantidad: 1 },
    { lugar: 'Biblioteca', cantidad: 1 },
  ])
})

// Entrada: historial vacío · Proceso: intenta contar hallazgos · Salida: lista vacía.
it('no sugiere lugares si no hay objetos registrados', () => {
  expect(predecirLugares([])).toEqual([])
})
