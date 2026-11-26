import { TEXTOS } from '../config'
import type { Objeto, ReclamoRegistrado } from '../types'
import { esReclamoValido, validarReclamo } from '../utils'
import type { RepositorioObjetos } from './RepositorioObjetos'
import { reportarObjetoSupabase } from './reportarSupabase'
import { obtenerClienteSupabase } from './supabaseCliente'

// foto_url se expone como "foto" para cumplir el tipo Objeto.
const COLUMNAS = 'id, nombre, categoria, lugar, fecha, estado, descripcion, foto:foto_url'

export const repositorioSupabase: RepositorioObjetos = {
  // Entrada: nada · Proceso: select público a la tabla objetos · Salida: lista ordenada por id.
  async listar() {
    const { data, error } = await obtenerClienteSupabase().from('objetos').select(COLUMNAS).order('id')
    if (error) throw new Error(TEXTOS.errores.cargar)
    return (data ?? []) as Objeto[]
  },

  // Entrada: id · Proceso: select de una fila · Salida: objeto o null.
  async obtener(id) {
    const { data, error } = await obtenerClienteSupabase()
      .from('objetos').select(COLUMNAS).eq('id', id).maybeSingle()
    if (error) throw new Error(TEXTOS.errores.cargar)
    return (data as Objeto | null) ?? null
  },

  // Entrada: id y datos · Proceso: llama a la función reclamar_objeto (cambia estado e inserta
  // el reclamo solo si estaba Disponible) · Salida: { ok } o { ok:false, mensaje }.
  async crearReclamo(objetoId, datos) {
    if (!esReclamoValido(validarReclamo(datos))) return { ok: false, mensaje: TEXTOS.confirmacion.textoError }
    const { data, error } = await obtenerClienteSupabase().rpc('reclamar_objeto', {
      p_objeto: objetoId,
      p_nombre: datos.nombre.trim(),
      p_curso: datos.curso.trim(),
      p_sena: datos.sena.trim(),
    })
    if (error) return { ok: false, mensaje: TEXTOS.errores.enviar }
    return data === true ? { ok: true } : { ok: false, mensaje: TEXTOS.errores.noDisponible }
  },

  // Entrada: id · Proceso: llama a la función marcar_entregado (solo cambia si estaba
  // Reclamado) · Salida: { ok } o { ok:false, mensaje }.
  async marcarEntregado(objetoId) {
    const { data, error } = await obtenerClienteSupabase().rpc('marcar_entregado', { p_objeto: objetoId })
    if (error) return { ok: false, mensaje: TEXTOS.errores.entregar }
    return data === true ? { ok: true } : { ok: false, mensaje: TEXTOS.errores.noReclamado }
  },

  // Entrada: nada · Proceso: función listar_reclamos (la base exige rol profesor en el token)
  // Salida: reclamos con nombre, curso y seña; lista vacía si no hay permiso o falla.
  async listarReclamos() {
    const { data, error } = await obtenerClienteSupabase().rpc('listar_reclamos')
    if (error || !Array.isArray(data)) return []
    return (data as { objeto_id: number; nombre: string; curso: string; sena: string; creado_en: string }[])
      .map((r): ReclamoRegistrado => ({ objetoId: r.objeto_id, nombre: r.nombre, curso: r.curso, sena: r.sena, creadoEn: r.creado_en }))
  },

  reportarObjeto: reportarObjetoSupabase,
}
