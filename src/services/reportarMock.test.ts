import { beforeEach, describe, expect, it } from 'vitest'
import { repositorioMock, restablecerDatosDemo } from './repositorioMock'

// Entrada: datos de un objeto encontrado · Proceso: lo registra en el mock
// Salida: verifica id nuevo, estado Disponible, foto guardada y rechazo de datos inválidos.
describe('repositorioMock.reportarObjeto (con foto)', () => {
  beforeEach(() => restablecerDatosDemo())

  it('registra el objeto como Disponible con el siguiente id y su foto', async () => {
    const resultado = await repositorioMock.reportarObjeto({
      nombre: 'Botella azul', categoria: 'Otros', lugar: 'Patio central', fecha: '2026-11-25',
      descripcion: 'Botella de aluminio con tapa negra', foto: 'data:image/jpeg;base64,AAAA',
    })
    expect(resultado.ok).toBe(true)
    expect(resultado.id).toBe(26)
    const guardado = await repositorioMock.obtener(26)
    expect(guardado?.estado).toBe('Disponible')
    expect(guardado?.foto).toBe('data:image/jpeg;base64,AAAA')
  })

  it('no registra si faltan datos', async () => {
    const resultado = await repositorioMock.reportarObjeto({
      nombre: '', categoria: '', lugar: '', fecha: '', descripcion: '',
    })
    expect(resultado.ok).toBe(false)
    expect(await repositorioMock.obtener(26)).toBeNull()
  })
})
