import { describe, expect, it } from 'vitest'
import { OBJETOS_OFICIALES } from '../data'
import type { Objeto } from '../types'
import { contarPorEstado, puedeEntregar } from './contarPorEstado'

const base: Objeto = {
  id: 1, nombre: 'Prueba', categoria: 'Otros', lugar: 'Patio', fecha: '2026-11-18',
  estado: 'Disponible', descripcion: 'Objeto ficticio',
}

describe('contarPorEstado', () => {
  it('devuelve los tres estados en 0 con una lista vacía', () => {
    expect(contarPorEstado([])).toEqual({ Disponible: 0, Reclamado: 0, Entregado: 0 })
  })

  it('cuenta los 10 objetos oficiales: 7 Disponibles, 2 Reclamados, 1 Entregado', () => {
    expect(contarPorEstado(OBJETOS_OFICIALES)).toEqual({ Disponible: 7, Reclamado: 2, Entregado: 1 })
  })

  it('la suma del conteo coincide con el total de objetos', () => {
    const conteo = contarPorEstado(OBJETOS_OFICIALES)
    expect(conteo.Disponible + conteo.Reclamado + conteo.Entregado).toBe(OBJETOS_OFICIALES.length)
  })

  it('no modifica la lista recibida', () => {
    const lista = [{ ...base }, { ...base, id: 2, estado: 'Entregado' as const }]
    const copia = structuredClone(lista)
    contarPorEstado(lista)
    expect(lista).toEqual(copia)
  })
})

describe('puedeEntregar', () => {
  it('solo permite entregar objetos Reclamados', () => {
    expect(puedeEntregar({ ...base, estado: 'Reclamado' })).toBe(true)
    expect(puedeEntregar({ ...base, estado: 'Disponible' })).toBe(false)
    expect(puedeEntregar({ ...base, estado: 'Entregado' })).toBe(false)
  })
})
