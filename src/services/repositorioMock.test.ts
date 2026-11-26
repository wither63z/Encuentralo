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

describe('Regla 3: repositorioMock.crearReclamo', () => {
  beforeEach(() => restablecerDatosDemo())
  const datos = { nombre: 'Ana Pérez', curso: '2do BGU A', sena: 'Tiene una etiqueta con mi nombre' }

  it('un reclamo válido pasa el objeto a Reclamado y se ve en el listado', async () => {
    expect(await repositorioMock.crearReclamo(1, datos)).toEqual({ ok: true })
    const listado = await repositorioMock.listar()
    expect(listado.find((o) => o.id === 1)?.estado).toBe('Reclamado')
  })

  it('no permite reclamar dos veces ni reclamar con datos inválidos', async () => {
    await repositorioMock.crearReclamo(1, datos)
    expect((await repositorioMock.crearReclamo(1, datos)).ok).toBe(false)
    expect((await repositorioMock.crearReclamo(2, { ...datos, sena: 'corta' })).ok).toBe(false)
    expect((await repositorioMock.obtener(2))?.estado).toBe('Disponible')
  })

  it('guarda nombre, curso y seña para que el inspector verifique al dueño', async () => {
    await repositorioMock.crearReclamo(1, datos)
    const [reclamo] = await repositorioMock.listarReclamos()
    expect(reclamo).toMatchObject({ objetoId: 1, nombre: 'Ana Pérez', curso: '2do BGU A', sena: datos.sena })
  })
})
