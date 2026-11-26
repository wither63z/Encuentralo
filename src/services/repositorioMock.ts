import { LATENCIA_MOCK_MS, TEXTOS } from '../config'
import { OBJETOS_PRUEBA } from '../data'
import type { Objeto } from '../types'
import { esReclamoValido, puedeReclamar, validarReclamo } from '../utils'
import type { RepositorioObjetos } from './RepositorioObjetos'

// Almacén en memoria: se reinicia al recargar la página (aceptable para la demo).
let almacen: Objeto[] = OBJETOS_PRUEBA.map((objeto) => ({ ...objeto }))

const esperar = () => new Promise((resolver) => setTimeout(resolver, LATENCIA_MOCK_MS))

// Entrada: nada · Proceso: vuelve a copiar los datos oficiales · Salida: almacén reiniciado.
export function restablecerDatosDemo(): void {
  almacen = OBJETOS_PRUEBA.map((objeto) => ({ ...objeto }))
}

export const repositorioMock: RepositorioObjetos = {
  // Entrada: nada · Proceso: espera simulada · Salida: copia de todos los objetos.
  async listar() {
    await esperar()
    return almacen.map((objeto) => ({ ...objeto }))
  },

  // Entrada: id · Proceso: busca en memoria · Salida: copia del objeto o null.
  async obtener(id) {
    await esperar()
    const objeto = almacen.find((o) => o.id === id)
    return objeto ? { ...objeto } : null
  },

  // Entrada: id y datos del reclamo · Proceso: valida (defensa en profundidad) y, si está
  // Disponible, lo pasa a Reclamado (regla 3) · Salida: { ok } o { ok:false, mensaje }.
  async crearReclamo(objetoId, datos) {
    await esperar()
    const objeto = almacen.find((o) => o.id === objetoId)
    if (!objeto) return { ok: false, mensaje: TEXTOS.errores.noExiste }
    if (!puedeReclamar(objeto)) return { ok: false, mensaje: TEXTOS.errores.noDisponible }
    if (!esReclamoValido(validarReclamo(datos))) return { ok: false, mensaje: TEXTOS.confirmacion.textoError }
    objeto.estado = 'Reclamado'
    return { ok: true }
  },
}
