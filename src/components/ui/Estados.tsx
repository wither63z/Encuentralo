import { AlertCircle, Loader2, SearchX } from 'lucide-react'
import type { ReactNode } from 'react'
import { TEXTOS } from '../../config'
import { Boton } from './Boton'

// Entrada: mensaje y acción opcional · Proceso: muestra el ícono de búsqueda sin resultados
// Salida: aviso de lista vacía o sin resultados (regla 6).
export function EstadoVacio({ mensaje, accion }: { mensaje: string; accion?: ReactNode }) {
  return (
    <div role="status" className="flex flex-col items-center gap-3 rounded-xl border border-borde bg-superficie p-6 text-center">
      <SearchX size={32} aria-hidden="true" className="text-texto-suave" />
      <p>{mensaje}</p>
      {accion}
    </div>
  )
}

// Entrada: ninguna · Proceso: muestra un ícono girando y el texto de carga
// Salida: indicador de carga accesible (role="status").
export function Cargando() {
  return (
    <div role="status" className="flex items-center justify-center gap-2 p-6 text-texto-suave">
      <Loader2 size={20} aria-hidden="true" className="animate-spin" />
      {TEXTOS.cargando}
    </div>
  )
}

// Entrada: mensaje y reintento opcional · Proceso: muestra el botón solo si hay onReintentar
// Salida: aviso de error (role="alert") con opción de reintentar.
export function MensajeError({ mensaje, onReintentar }: { mensaje: string; onReintentar?: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center gap-3 rounded-xl border border-error bg-superficie p-6 text-center">
      <AlertCircle size={32} aria-hidden="true" className="text-error" />
      <p>{mensaje}</p>
      {onReintentar && <Boton variante="secundario" onClick={onReintentar}>{TEXTOS.acciones.reintentar}</Boton>}
    </div>
  )
}
