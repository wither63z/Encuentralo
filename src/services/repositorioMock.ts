import { LATENCIA_MOCK_MS, TEXTOS } from '../config'
import { OBJETOS_PRUEBA } from '../data'
import type { Objeto } from '../types'
import { esReclamoValido, hoyIso, puedeEntregar, puedeReclamar, validarNuevoObjeto, validarReclamo } from '../utils'
import { borrarAlmacen, guardarAlmacen, leerAlmacen } from './almacenLocal'
import type { RepositorioObjetos } from './RepositorioObjetos'
import { borrarReclamosMock, guardarReclamoMock, listarReclamosMock } from './reclamosMock'

const copiarOficiales = (): Objeto[] => OBJETOS_PRUEBA.map((objeto) => ({ ...objeto }))

// Almacén en memoria que se conserva en localStorage: al cerrar y reabrir, sigue igual.
let almacen: Objeto[] = leerAlmacen() ?? copiarOficiales()

const esperar = () => new Promise((resolver) => setTimeout(resolver, LATENCIA_MOCK_MS))

// Entrada: nada · Proceso: borra lo guardado en el navegador y vuelve a copiar los datos
// oficiales · Salida: almacén reiniciado.
export function restablecerDatosDemo(): void {
  borrarAlmacen()
  borrarReclamosMock()
  almacen = copiarOficiales()
}

export const repositorioMock: RepositorioObjetos = {
  // Entrada: nada · Proceso: espera simulada · Salida: reclamos guardados en este dispositivo.
  async listarReclamos() {
    await esperar()
    return listarReclamosMock()
  },

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
    guardarReclamoMock(objetoId, datos)
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

  // Entrada: datos del objeto encontrado · Proceso: valida, asigna el siguiente id y lo agrega
  // como Disponible · Salida: { ok, id } (con aviso si la foto no cupo en el dispositivo).
  async reportarObjeto(datos) {
    await esperar()
    const errores = validarNuevoObjeto(datos, hoyIso())
    if (Object.keys(errores).length > 0) return { ok: false, errores, mensaje: TEXTOS.reportar.errores.enviar }
    if (datos.categoria === '') return { ok: false, mensaje: TEXTOS.reportar.errores.categoria }
    const id = Math.max(0, ...almacen.map((o) => o.id)) + 1
    const nuevo: Objeto = {
      id, nombre: datos.nombre.trim(), categoria: datos.categoria, lugar: datos.lugar.trim(),
      fecha: datos.fecha, estado: 'Disponible', descripcion: datos.descripcion.trim(),
      ...(datos.foto ? { foto: datos.foto } : {}),
    }
    almacen.push(nuevo)
    if (guardarAlmacen(almacen)) return { ok: true, id }
    return { ok: true, id, mensaje: TEXTOS.reportar.errores.fotoNoGuardada }
  },
}
