import { Confirmacion } from '../components'

export interface PaginaConfirmacionProps {
  resultado: 'exito' | 'error'
  mensaje?: string
  onVolverListado: () => void
}

// Entrada: resultado y mensaje · Salida: vista de confirmación con regreso al listado.
export function PaginaConfirmacion({ resultado, mensaje, onVolverListado }: PaginaConfirmacionProps) {
  return <Confirmacion resultado={resultado} mensaje={mensaje} onVolver={onVolverListado} />
}
