import { Confirmacion } from '../components'

export interface PaginaConfirmacionProps {
  resultado: 'exito' | 'error'
  mensaje?: string
  onVolverListado: () => void
}

// Entrada: resultado y mensaje · Salida: vista de confirmación con regreso al listado.
export function PaginaConfirmacion({ resultado, mensaje, onVolverListado }: PaginaConfirmacionProps) {
  return (
    <div className="animar-entrada mx-auto flex min-h-[55vh] max-w-lg flex-col justify-center py-6">
      <Confirmacion resultado={resultado} mensaje={mensaje} onVolver={onVolverListado} />
    </div>
  )
}
