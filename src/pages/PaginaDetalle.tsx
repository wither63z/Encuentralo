import { Boton, Cargando, DetalleObjeto, MensajeError } from '../components'
import { TEXTOS } from '../config'
import { useObjeto } from '../hooks'

export interface PaginaDetalleProps {
  id: number
  onReclamar: (id: number) => void
  onVolver: () => void
}

// Entrada: id del objeto · Proceso: lo carga · Salida: detalle, carga o error con opción de volver.
export function PaginaDetalle({ id, onReclamar, onVolver }: PaginaDetalleProps) {
  const { objeto, cargando, error, reintentar } = useObjeto(id)
  if (cargando) return <Cargando />
  if (error || !objeto) {
    return (
      <div className="flex flex-col gap-3">
        <MensajeError mensaje={error ?? TEXTOS.detalle.noEncontrado} onReintentar={() => void reintentar()} />
        <Boton variante="secundario" onClick={onVolver}>{TEXTOS.acciones.volverListado}</Boton>
      </div>
    )
  }
  return (
    <div className="animar-entrada mx-auto max-w-2xl py-2 md:py-6">
      <DetalleObjeto objeto={objeto} onReclamar={() => onReclamar(objeto.id)} onVolver={onVolver} />
    </div>
  )
}
