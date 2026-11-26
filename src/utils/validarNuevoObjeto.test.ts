import { describe, expect, it } from 'vitest'
import type { DatosNuevoObjeto } from '../types'
import { esFotoValida, validarNuevoObjeto } from './validarNuevoObjeto'

const HOY = '2026-11-26'
const valido: DatosNuevoObjeto = {
  nombre: 'Botella azul', categoria: 'Otros', lugar: 'Patio central', fecha: '2026-11-25',
  descripcion: 'Botella de aluminio con tapa negra', foto: 'data:image/jpeg;base64,AAAA',
}

describe('validarNuevoObjeto (reportar objeto encontrado)', () => {
  it('acepta datos válidos con foto', () => {
    expect(validarNuevoObjeto(valido, HOY)).toEqual({})
  })
  it('acepta sin foto (es opcional)', () => {
    expect(validarNuevoObjeto({ ...valido, foto: undefined }, HOY)).toEqual({})
  })
  it('rechaza campos vacíos y categoría sin elegir', () => {
    const errores = validarNuevoObjeto({ nombre: ' ', categoria: '', lugar: '', fecha: '', descripcion: '' }, HOY)
    expect(Object.keys(errores).sort()).toEqual(['categoria', 'descripcion', 'fecha', 'lugar', 'nombre'])
  })
  it('rechaza fecha futura', () => {
    expect(validarNuevoObjeto({ ...valido, fecha: '2026-11-27' }, HOY).fecha).toBeDefined()
  })
  it('rechaza fotos que no son imagen o demasiado grandes', () => {
    expect(esFotoValida('data:text/html;base64,PHNjcmlwdD4=')).toBe(false)
    expect(esFotoValida('javascript:alert(1)')).toBe(false)
    expect(esFotoValida(`data:image/jpeg;base64,${'A'.repeat(500_000)}`)).toBe(false)
  })
})
