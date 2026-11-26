import { useState } from 'react'
import { Cargando, MensajeError } from '../../components'
import { useObjetos } from '../../hooks'
import {
  FormularioPerdida, ResultadosCoincidencias, TEXTOS_COINCIDENCIAS as T, buscarCoincidencias,
  type Coincidencia, type DescripcionPerdida,
} from '../coincidencias'

// Entrada: acción para abrir un objeto · Proceso: carga los objetos y, al buscar, calcula
// las 3 coincidencias Disponibles más parecidas · Salida: formulario + resultados.
export function PaginaQuePerdiste({ onAbrir }: { onAbrir: (id: number) => void }) {
  const { objetos, cargando, error, reintentar } = useObjetos()
  const [coincidencias, setCoincidencias] = useState<Coincidencia[]>([])
  const [buscado, setBuscado] = useState(false)

  function buscar(descripcion: DescripcionPerdida) {
    setCoincidencias(buscarCoincidencias(objetos, descripcion))
    setBuscado(true)
  }

  if (cargando) return <Cargando />
  if (error) return <MensajeError mensaje={error} onReintentar={() => void reintentar()} />
  return (
    <section className="flex flex-col gap-4">
      <h1 className="font-display text-2xl font-bold">{T.titulo}</h1>
      <p className="text-texto-suave">{T.explicacion}</p>
      <FormularioPerdida onBuscar={buscar} />
      <ResultadosCoincidencias coincidencias={coincidencias} buscado={buscado} onAbrir={onAbrir} />
    </section>
  )
}
