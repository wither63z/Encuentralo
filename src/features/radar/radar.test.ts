import { describe, expect, it } from 'vitest'
import type { Objeto } from '../../types'
import { calcularRadar, diasDesde } from './calcularRadar'

const base: Objeto = { id: 1, nombre: 'A', categoria: 'Ropa', lugar: 'Patio', fecha: '2026-11-01', estado: 'Disponible', descripcion: '' }
const hacer = (cambios: Partial<Objeto>): Objeto => ({ ...base, ...cambios })

describe('Radar de inspección', () => {
  it('cuenta días completos entre fechas', () => {
    expect(diasDesde('2026-11-20', '2026-11-26')).toBe(6)
  })

  it('solo marca estancados los Disponibles con más de 5 días', () => {
    const radar = calcularRadar([
      hacer({ id: 1, fecha: '2026-11-20' }),
      hacer({ id: 2, fecha: '2026-11-21' }),
      hacer({ id: 3, fecha: '2026-11-01', estado: 'Reclamado' }),
    ], '2026-11-26')
    expect(radar.estancados.map((o) => o.id)).toEqual([1])
  })

  it('ordena el top 3 por cantidad y limita a 3', () => {
    const radar = calcularRadar([
      hacer({ lugar: 'Patio' }), hacer({ lugar: 'Patio' }), hacer({ lugar: 'Aula' }),
      hacer({ lugar: 'Biblioteca' }), hacer({ lugar: 'Cancha' }),
    ], '2026-11-26')
    expect(radar.topLugares[0]).toEqual({ nombre: 'Patio', cantidad: 2 })
    expect(radar.topLugares).toHaveLength(3)
  })
})
