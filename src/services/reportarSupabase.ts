import { TEXTOS } from '../config'
import type { DatosNuevoObjeto, ResultadoReporte } from '../types'
import { dataUrlABlob } from './fotos'
import { obtenerClienteSupabase } from './supabaseCliente'

const BUCKET_FOTOS = 'fotos'

// Entrada: data URL de la foto · Proceso: la sube al bucket público "fotos" con nombre aleatorio
// Salida: URL pública https o null si falla (el objeto se registra igual, sin foto).
async function subirFoto(foto: string): Promise<string | null> {
  const cliente = obtenerClienteSupabase()
  const ruta = `${crypto.randomUUID()}.jpg`
  const { error } = await cliente.storage.from(BUCKET_FOTOS).upload(ruta, dataUrlABlob(foto), {
    contentType: 'image/jpeg',
    upsert: false,
  })
  if (error) return null
  return cliente.storage.from(BUCKET_FOTOS).getPublicUrl(ruta).data.publicUrl
}

// Entrada: datos ya validados · Proceso: sube la foto (si hay) y llama a reportar_objeto, que
// inserta el objeto como Disponible · Salida: { ok, id } o { ok:false, mensaje }.
export async function reportarObjetoSupabase(datos: DatosNuevoObjeto): Promise<ResultadoReporte> {
  const fotoUrl = datos.foto ? await subirFoto(datos.foto) : null
  const { data, error } = await obtenerClienteSupabase().rpc('reportar_objeto', {
    p_nombre: datos.nombre.trim(),
    p_categoria: datos.categoria,
    p_lugar: datos.lugar.trim(),
    p_fecha: datos.fecha,
    p_descripcion: datos.descripcion.trim(),
    p_foto_url: fotoUrl,
  })
  if (error || typeof data !== 'number') return { ok: false, mensaje: TEXTOS.reportar.errores.enviar }
  const sinFoto = datos.foto !== undefined && datos.foto !== '' && fotoUrl === null
  return { ok: true, id: data, mensaje: sinFoto ? TEXTOS.reportar.errores.fotoNoGuardada : undefined }
}
