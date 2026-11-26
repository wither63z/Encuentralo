import { useState } from 'react'
import { TEXTOS } from '../config'
import { obtenerRepositorio } from '../services'
import type { DatosReclamo, ResultadoReclamo } from '../types'
import { esReclamoValido, validarReclamo } from '../utils'

// Entrada: id del objeto · Proceso: valida con validarReclamo (reglas 4 y 5); si hay errores
// no llama al repositorio; si no, envía el reclamo · Salida: { enviar(datos), enviando }.
// enviar devuelve { ok:false, errores } (datos inválidos), { ok:false, mensaje } (rechazo o red)
// o { ok:true } (el objeto ya está Reclamado).
export function useReclamo(objetoId: number) {
  const [enviando, setEnviando] = useState(false)

  async function enviar(datos: DatosReclamo): Promise<ResultadoReclamo> {
    const errores = validarReclamo(datos)
    if (!esReclamoValido(errores)) return { ok: false, errores, mensaje: TEXTOS.confirmacion.textoError }
    setEnviando(true)
    try {
      return await obtenerRepositorio().crearReclamo(objetoId, datos)
    } catch {
      return { ok: false, mensaje: TEXTOS.errores.enviar }
    } finally {
      setEnviando(false)
    }
  }

  return { enviar, enviando }
}
