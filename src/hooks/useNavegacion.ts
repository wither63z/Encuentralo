import { useEffect, useState } from 'react'
import type { Vista } from '../types'

// Entrada: nada · Proceso: guarda la vista actual y un historial en memoria (sin router);
// al cambiar de vista mueve el foco al contenido principal · Salida: { vista, irA, volver }.
export function useNavegacion() {
  const [historial, setHistorial] = useState<Vista[]>([{ tipo: 'inicio' }])
  const vista: Vista = historial[historial.length - 1] ?? { tipo: 'inicio' }

  function irA(destino: Vista) {
    setHistorial((previo) => [...previo, destino])
  }

  function volver() {
    setHistorial((previo) => (previo.length > 1 ? previo.slice(0, -1) : previo))
  }

  useEffect(() => {
    window.scrollTo({ top: 0 })
    document.getElementById('contenido-principal')?.focus()
  }, [vista])

  return { vista, irA, volver }
}
