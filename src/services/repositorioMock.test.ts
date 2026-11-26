import { beforeEach, describe, expect, it } from 'vitest'
import { TEXTOS } from '../config'
import { repositorioMock, restablecerDatosDemo } from './repositorioMock'

describe('repositorioMock.marcarEntregado', () => {
  beforeEach(() => restablecerDatosDemo())

  it('pasa un objeto Reclamado a Entregado', async () => {
    expect(await repositorioMock.marcarEntregado(3)).toEqual({ ok: true })
    expect((await repositorioMock.obtener(3))?.estado).toBe('Entregado')
  })

  it('rechaza objetos Disponibles o ya Entregados sin cambiarlos', async () => {
    expect(await repositorioMock.marcarEntregado(1)).toEqual({ ok: false, mensaje: TEXTOS.errores.noReclamado })
    expect(await repositorioMock.marcarEntregado(5)).toEqual({ ok: false, mensaje: TEXTOS.errores.noReclamado })
    expect((await repositorioMock.obtener(1))?.estado).toBe('Disponible')
  })

  it('rechaza un id inexistente', async () => {
    expect(await repositorioMock.marcarEntregado(999)).toEqual({ ok: false, mensaje: TEXTOS.errores.noExiste })
  })

  it('restablecerDatosDemo vuelve a los datos oficiales', async () => {
    await repositorioMock.marcarEntregado(3)
    restablecerDatosDemo()
    expect((await repositorioMock.obtener(3))?.estado).toBe('Reclamado')
  })
})
