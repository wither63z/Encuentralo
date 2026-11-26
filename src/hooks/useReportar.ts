import { useState } from 'react'
import { TEXTOS } from '../config'
import { comprimirFoto, obtenerRepositorio } from '../services'
import type { DatosNuevoObjeto, ResultadoReporte } from '../types'
import { hoyIso, validarNuevoObjeto } from '../utils'

// Entrada: nada · Proceso: prepara fotos (comprime) y registra objetos encontrados
// Salida: { prepararFoto(archivo), procesandoFoto, enviar(datos), enviando }.
export function useReportar() {
  const [enviando, setEnviando] = useState(false)
  const [procesandoFoto, setProcesandoFoto] = useState(false)

  // Entrada: archivo de la cámara o galería · Proceso: lo reduce a JPEG liviano
  // Salida: data URL o null si no es una imagen válida.
  async function prepararFoto(archivo: File): Promise<string | null> {
    setProcesandoFoto(true)
    try {
      return await comprimirFoto(archivo)
    } catch {
      return null
    } finally {
      setProcesandoFoto(false)
    }
  }

  // Entrada: datos del formulario · Proceso: valida y, si todo está bien, llama al repositorio
  // Salida: { ok, id } · { ok:false, errores } · { ok:false, mensaje }.
  async function enviar(datos: DatosNuevoObjeto): Promise<ResultadoReporte> {
    const errores = validarNuevoObjeto(datos, hoyIso())
    if (Object.keys(errores).length > 0) return { ok: false, errores }
    setEnviando(true)
    try {
      return await obtenerRepositorio().reportarObjeto(datos)
    } catch {
      return { ok: false, mensaje: TEXTOS.reportar.errores.enviar }
    } finally {
      setEnviando(false)
    }
  }

  return { prepararFoto, procesandoFoto, enviar, enviando }
}
