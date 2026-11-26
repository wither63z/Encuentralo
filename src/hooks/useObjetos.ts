import { useCallback, useEffect, useState } from 'react'
import { TEXTOS } from '../config'
import { obtenerRepositorio } from '../services'
import type { Objeto } from '../types'

// Entrada: nada · Proceso: pide la lista al repositorio al montar (así el listado refleja
// los reclamos nuevos al volver) · Salida: { objetos, cargando, error, reintentar }.
export function useObjetos() {
  const [objetos, setObjetos] = useState<Objeto[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const cargar = useCallback(async () => {
    setCargando(true)
    setError(null)
    try {
      setObjetos(await obtenerRepositorio().listar())
    } catch {
      setError(TEXTOS.errores.cargar)
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    void cargar()
  }, [cargar])

  return { objetos, cargando, error, reintentar: cargar }
}
