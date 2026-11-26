import { CircleCheck, Clock, PackageCheck, type Icono } from './iconos'
import { ESTADOS_UI, type NombreIconoEstado } from '../../config'
import type { Estado } from '../../types'

const ICONOS: Record<NombreIconoEstado, Icono> = { CircleCheck, Clock, PackageCheck }

// Entrada: estado · Proceso: busca etiqueta, ícono y color en ESTADOS_UI
// Salida: insignia con color + ícono + texto (nunca solo color).
export function EstadoBadge({ estado }: { estado: Estado }) {
  const ui = ESTADOS_UI[estado]
  const Icono = ICONOS[ui.icono]
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-semibold ${ui.clases}`}>
      <Icono size={16} aria-hidden="true" />
      {ui.etiqueta}
    </span>
  )
}
