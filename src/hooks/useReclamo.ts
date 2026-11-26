import { useState } from 'react'
import { TEXTOS } from '../config'
import { obtenerRepositorio } from '../services'
import type { DatosReclamo, ResultadoReclamo } from '../types'

// Entrada: id del objeto · Proceso: envía el reclamo al repositorio y marca "enviando"
// Salida: { enviar(datos) → ResultadoReclamo, enviando }.
export function useReclamo(objetoId: number) {
  const [enviando, setEnviando] = useState(false)

  async function enviar(datos: DatosReclamo): Promise<ResultadoReclamo> {
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
