import { LATENCIA_MOCK_MS, TEXTOS } from '../config'
import { OBJETOS_PRUEBA } from '../data'
import type { Objeto } from '../types'
import { esReclamoValido, puedeEntregar, puedeReclamar, validarReclamo } from '../utils'
import { borrarAlmacen, guardarAlmacen, leerAlmacen } from './almacenLocal'
import type { RepositorioObjetos } from './RepositorioObjetos'

const copiarOficiales = (): Objeto[] => OBJETOS_PRUEBA.map((objeto) => ({ ...objeto }))

// Almacén en memoria que se conserva en localStorage: al cerrar y reabrir, sigue igual.
let almacen: Objeto[] = leerAlmacen() ?? copiarOficiales()

const esperar = () => new Promise((resolver) => setTimeout(resolver, LATENCIA_MOCK_MS))

// Entrada: nada · Proceso: borra lo guardado en el navegador y vuelve a copiar los datos
// oficiales · Salida: almacén reiniciado.
export function restablecerDatosDemo(): void {
  borrarAlmacen()
  almacen = copiarOficiales()
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
  // Disponible, lo pasa a Reclamado (regla 3) y lo guarda · Salida: { ok } o { ok:false, mensaje }.
  async crearReclamo(objetoId, datos) {
    await esperar()
    const objeto = almacen.find((o) => o.id === objetoId)
    if (!objeto) return { ok: false, mensaje: TEXTOS.errores.noExiste }
    if (!puedeReclamar(objeto)) return { ok: false, mensaje: TEXTOS.errores.noDisponible }
    if (!esReclamoValido(validarReclamo(datos))) return { ok: false, mensaje: TEXTOS.confirmacion.textoError }
    objeto.estado = 'Reclamado'
    guardarAlmacen(almacen)
    return { ok: true }
  },

  // Entrada: id · Proceso: si está Reclamado lo pasa a Entregado y lo guarda
  // Salida: { ok } o { ok:false, mensaje } si no existe o no estaba Reclamado.
  async marcarEntregado(objetoId) {
    await esperar()
    const objeto = almacen.find((o) => o.id === objetoId)
    if (!objeto) return { ok: false, mensaje: TEXTOS.errores.noExiste }
    if (!puedeEntregar(objeto)) return { ok: false, mensaje: TEXTOS.errores.noReclamado }
    objeto.estado = 'Entregado'
    guardarAlmacen(almacen)
    return { ok: true }
  },
}
