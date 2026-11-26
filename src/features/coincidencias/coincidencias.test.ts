import { describe, expect, it } from 'vitest'
import { OBJETOS_PRUEBA } from '../../data'
import {
  TOPE_PALABRAS,
  buscarCoincidencias,
  calcularCoincidencia,
  extraerPalabrasClave,
  type DescripcionPerdida,
} from './calcularCoincidencia'

const porId = (id: number) => {
  const objeto = OBJETOS_PRUEBA.find((o) => o.id === id)
  if (!objeto) throw new Error(`Falta el objeto ${id}`)
  return objeto
}

const describir = (texto: string, extra: Partial<DescripcionPerdida> = {}): DescripcionPerdida => ({
  texto,
  categoria: 'Todas',
  lugar: '',
  ...extra,
})

describe('extraerPalabrasClave', () => {
  it('quita palabras vacías, tildes, cortas y repetidas', () => {
    expect(extraerPalabrasClave('Perdí mi chompa de color AZUL, azul con capucha'))
      .toEqual(['chompa', 'azul', 'capucha'])
    expect(extraerPalabrasClave('Audífonos en la Biblioteca')).toEqual(['audifonos', 'biblioteca'])
  })
})

describe('buscarCoincidencias', () => {
  it('pone la chompa azul (id 1) primero con 20+20+25+15 = 80', () => {
    const resultado = buscarCoincidencias(
      OBJETOS_PRUEBA,
      describir('chompa azul', { categoria: 'Ropa', lugar: 'cancha' }),
    )
    expect(resultado[0]?.objeto.id).toBe(1)
    expect(resultado[0]?.puntaje).toBe(80)
    expect(resultado[0]?.razones).toContain('Misma categoría: Ropa (+25)')
    expect(resultado[0]?.razones).toContain('Mismo lugar: Cancha de básquet (+15)')
  })

  it('nunca devuelve objetos Reclamado ni Entregado', () => {
    const calculadora = buscarCoincidencias(OBJETOS_PRUEBA, describir('calculadora científica'))
    expect(calculadora.map((c) => c.objeto.id)).not.toContain(3)
    const balon = buscarCoincidencias(OBJETOS_PRUEBA, describir('balón fútbol', { lugar: 'cancha' }))
    expect(balon.map((c) => c.objeto.id)).not.toContain(5)
    expect(balon.every((c) => c.objeto.estado === 'Disponible')).toBe(true)
  })

  it('devuelve como máximo 3 resultados (o el máximo pedido)', () => {
    const texto = describir('llaves termo flauta cuaderno cartuchera')
    expect(buscarCoincidencias(OBJETOS_PRUEBA, texto)).toHaveLength(3)
    expect(buscarCoincidencias(OBJETOS_PRUEBA, texto, 2)).toHaveLength(2)
  })

  it('acepta coincidencia por inclusión (audifono dentro de audifonos)', () => {
    const resultado = buscarCoincidencias(OBJETOS_PRUEBA, describir('audifono'))
    expect(resultado[0]?.objeto.id).toBe(6)
  })

  it('devuelve lista vacía si nada se parece', () => {
    expect(buscarCoincidencias(OBJETOS_PRUEBA, describir('paraguas morado'))).toEqual([])
  })
})

describe('calcularCoincidencia', () => {
  it('limita los puntos por palabras a 60', () => {
    const muchas = describir('chompa azul capucha talla cierre plateado')
    const resultado = calcularCoincidencia(porId(1), muchas)
    expect(resultado.puntaje).toBe(TOPE_PALABRAS)
    expect(resultado.razones).toHaveLength(3)
  })
})
