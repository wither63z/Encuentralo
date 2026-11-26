import { useCallback, useEffect, useState } from 'react'
import { TEXTOS } from '../config'
import { obtenerRepositorio, restablecerDatosDemo } from '../services'
import type { Objeto, ReclamoRegistrado, ResultadoReclamo } from '../types'

// Entrada: nada · Proceso: carga todos los objetos y permite al inspector marcar uno
// Reclamado como Entregado · Salida: { objetos, reclamos, cargando, error, marcarEntregado, procesando, reintentar, restablecer }.
export function useInspector() {
  const [objetos, setObjetos] = useState<Objeto[]>([])
  const [reclamos, setReclamos] = useState<ReclamoRegistrado[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  /** id del objeto que se está guardando (null si no hay ninguno). */
  const [procesando, setProcesando] = useState<number | null>(null)

  const cargar = useCallback(async () => {
    setCargando(true)
    setError(null)
    try {
      const repositorio = obtenerRepositorio()
      const [lista, datosReclamos] = await Promise.all([repositorio.listar(), repositorio.listarReclamos()])
      setObjetos(lista)
      setReclamos(datosReclamos)
    } catch {
      setError(TEXTOS.errores.cargar)
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    void cargar()
  }, [cargar])

  // Entrada: id · Proceso: pide el cambio al repositorio y, si sale bien, actualiza la lista
  // local sin volver a cargar · Salida: ResultadoReclamo.
  async function marcarEntregado(objetoId: number): Promise<ResultadoReclamo> {
    setProcesando(objetoId)
    try {
      const resultado = await obtenerRepositorio().marcarEntregado(objetoId)
      if (resultado.ok) {
        setObjetos((previo) => previo.map((o) => (o.id === objetoId ? { ...o, estado: 'Entregado' } : o)))
      }
      return resultado
    } catch {
      return { ok: false, mensaje: TEXTOS.errores.entregar }
    } finally {
      setProcesando(null)
    }
  }

  // Entrada: nada · Proceso: borra los datos guardados del mock y recarga la lista
  // Salida: promesa que termina cuando la lista ya está recargada.
  async function restablecer(): Promise<void> {
    restablecerDatosDemo()
    await cargar()
  }

  return { objetos, reclamos, cargando, error, marcarEntregado, procesando, reintentar: cargar, restablecer }
}
