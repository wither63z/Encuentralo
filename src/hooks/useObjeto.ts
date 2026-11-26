import { useCallback, useEffect, useState } from 'react'
import { TEXTOS } from '../config'
import { obtenerRepositorio } from '../services'
import type { Objeto } from '../types'

// Entrada: id del objeto · Proceso: lo pide al repositorio · Salida: { objeto, cargando, error, reintentar }.
export function useObjeto(id: number) {
  const [objeto, setObjeto] = useState<Objeto | null>(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const cargar = useCallback(async () => {
    setCargando(true)
    setError(null)
    try {
      const encontrado = await obtenerRepositorio().obtener(id)
      setObjeto(encontrado)
      if (!encontrado) setError(TEXTOS.detalle.noEncontrado)
    } catch {
      setError(TEXTOS.errores.cargar)
    } finally {
      setCargando(false)
    }
  }, [id])

  useEffect(() => {
    void cargar()
  }, [cargar])

  return { objeto, cargando, error, reintentar: cargar }
}
