import { describe, expect, it } from 'vitest'
import { OBJETOS_PRUEBA } from '../data'
import { FILTROS_INICIALES, filtrarObjetos } from './filtrarObjetos'
import { formatearFecha } from './formatearFecha'
import { puedeReclamar } from './puedeReclamar'
import { esReclamoValido, validarReclamo } from './validarReclamo'

const porId = (id: number) => {
  const objeto = OBJETOS_PRUEBA.find((o) => o.id === id)
  if (!objeto) throw new Error(`Falta el objeto ${id}`)
  return objeto
}

describe('Regla 1 y datos oficiales', () => {
  it('carga los 10 objetos oficiales con estados válidos', () => {
    expect(OBJETOS_PRUEBA.filter((o) => o.id <= 10)).toHaveLength(10)
    expect(porId(3).estado).toBe('Reclamado')
    expect(porId(5).estado).toBe('Entregado')
  })
})

describe('Regla 2: puedeReclamar', () => {
  it('solo permite reclamar objetos Disponibles', () => {
    expect(puedeReclamar(porId(1))).toBe(true)
    expect(puedeReclamar(porId(3))).toBe(false)
    expect(puedeReclamar(porId(5))).toBe(false)
  })
})

describe('Reglas 4 y 5: validarReclamo', () => {
  const base = { nombre: 'Ana Ficticia', curso: '2do BGU A', sena: '' }
  it('rechaza los tres campos vacíos', () => {
    const errores = validarReclamo({ nombre: ' ', curso: '', sena: '' })
    expect(Object.keys(errores).sort()).toEqual(['curso', 'nombre', 'sena'])
  })
  it('rechaza seña de 9 caracteres e indica cuántos faltan', () => {
    const errores = validarReclamo({ ...base, sena: '123456789' })
    expect(errores.sena).toContain('Te falta 1.')
  })
  it('acepta seña de 10 caracteres', () => {
    expect(esReclamoValido(validarReclamo({ ...base, sena: '1234567890' }))).toBe(true)
  })
  it('rechaza textos más largos que el máximo', () => {
    expect(validarReclamo({ ...base, sena: 'x'.repeat(301) }).sena).toContain('300')
  })
  it('no cuenta espacios de los extremos', () => {
    expect(validarReclamo({ ...base, sena: '   123456789   ' }).sena).toBeDefined()
  })
})

describe('Regla 6: filtrarObjetos', () => {
  it('busca sin distinguir mayúsculas ni tildes', () => {
    const r = filtrarObjetos(OBJETOS_PRUEBA, { ...FILTROS_INICIALES, texto: 'MUSICA' })
    expect(r.map((o) => o.id)).toContain(10)
  })
  it('devuelve lista vacía si no hay coincidencias', () => {
    expect(filtrarObjetos(OBJETOS_PRUEBA, { ...FILTROS_INICIALES, texto: 'zzz-no-existe' })).toEqual([])
  })
  it('filtra por categoría y estado', () => {
    const r = filtrarObjetos(OBJETOS_PRUEBA, { texto: '', categoria: 'Tecnología', estado: 'Disponible' })
    expect(r.every((o) => o.categoria === 'Tecnología' && o.estado === 'Disponible')).toBe(true)
  })
})

describe('formatearFecha', () => {
  it('no se desfasa por zona horaria', () => {
    expect(formatearFecha('2026-11-18')).toBe('18 de noviembre de 2026')
  })
})
