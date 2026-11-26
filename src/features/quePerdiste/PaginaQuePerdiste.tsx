import { useState } from 'react'
import { Cargando, MensajeError } from '../../components'
import { TEXTOS } from '../../config'
import { useObjetos } from '../../hooks'
import {
  FormularioPerdida, ResultadosCoincidencias, buscarCoincidencias,
  type Coincidencia, type DescripcionPerdida,
} from '../coincidencias'

const T = TEXTOS.coincidencias

// Entrada: acción para abrir un objeto · Proceso: carga los objetos y, al buscar, calcula
// las 3 coincidencias Disponibles más parecidas · Salida: formulario + resultados.
export function PaginaQuePerdiste({ onAbrir, onVerListado }: { onAbrir: (id: number) => void; onVerListado?: () => void }) {
  const { objetos, cargando, error, reintentar } = useObjetos()
  const [coincidencias, setCoincidencias] = useState<Coincidencia[]>([])
  const [descripcionBuscada, setDescripcionBuscada] = useState<DescripcionPerdida | undefined>(undefined)

  // Entrada: descripción enviada · Proceso: guarda la descripción y calcula las coincidencias
  // Salida: actualiza el estado de la búsqueda.
  function buscar(descripcion: DescripcionPerdida) {
    setCoincidencias(buscarCoincidencias(objetos, descripcion))
    setDescripcionBuscada(descripcion)
  }

  if (cargando) return <Cargando />
  if (error) return <MensajeError mensaje={error} onReintentar={() => void reintentar()} />
  return (
    <section className="flex flex-col gap-4">
      <h1 className="font-display text-2xl font-bold">{T.titulo}</h1>
      <p className="text-texto-suave">{T.explicacion}</p>
      <FormularioPerdida onBuscar={buscar} />
      <ResultadosCoincidencias
        coincidencias={coincidencias}
        buscado={descripcionBuscada !== undefined}
        onAbrir={onAbrir}
        onVerListado={onVerListado}
        objetos={objetos}
        descripcion={descripcionBuscada}
      />
    </section>
  )
}
