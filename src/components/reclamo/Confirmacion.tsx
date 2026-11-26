import { CircleCheck, CircleX } from '../ui/iconos'
import { TEXTOS } from '../../config'
import { Boton } from '../ui/Boton'

export interface ConfirmacionProps {
  resultado: 'exito' | 'error'
  onVolver: () => void
  mensaje?: string
}

// Entrada: resultado del reclamo · Proceso: elige ícono, color y textos de éxito o de error
// Salida: mensaje claro y botón para volver al listado.
export function Confirmacion({ resultado, onVolver, mensaje }: ConfirmacionProps) {
  const exito = resultado === 'exito'
  const Icono = exito ? CircleCheck : CircleX
  return (
    <section role={exito ? 'status' : 'alert'} className="flex flex-col items-center gap-4 rounded-xl border border-borde bg-superficie p-8 text-center">
      <Icono size={56} aria-hidden="true" className={exito ? 'text-exito' : 'text-error'} />
      <h1 className="text-2xl font-bold">{exito ? TEXTOS.confirmacion.tituloExito : TEXTOS.confirmacion.tituloError}</h1>
      <p className="text-texto-suave">{mensaje ?? (exito ? TEXTOS.confirmacion.textoExito : TEXTOS.confirmacion.textoError)}</p>
      <Boton variante="primario" onClick={onVolver}>{TEXTOS.acciones.volverListado}</Boton>
    </section>
  )
}
