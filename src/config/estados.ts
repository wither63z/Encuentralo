import type { Estado } from '../types'

export type NombreIconoEstado = 'CircleCheck' | 'Clock' | 'PackageCheck'

export interface EstadoUI {
  etiqueta: string
  /** Nombre del ícono de lucide-react (el componente lo traduce). */
  icono: NombreIconoEstado
  /** Clases Tailwind con tokens semánticos (nunca hex). */
  clases: string
}

// Mapeo estado → presentación. Cambiar un color de estado = tocar solo este archivo.
export const ESTADOS_UI: Record<Estado, EstadoUI> = {
  Disponible: { etiqueta: 'Disponible', icono: 'CircleCheck', clases: 'bg-marca-suave text-marca' },
  Reclamado: { etiqueta: 'Reclamado', icono: 'Clock', clases: 'bg-alerta text-texto' },
  Entregado: { etiqueta: 'Entregado', icono: 'PackageCheck', clases: 'bg-exito text-texto' },
}
