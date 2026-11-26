import { Camera, Loader2, X } from 'lucide-react'
import { useRef } from 'react'
import { TEXTOS } from '../../config'

export interface SelectorFotoProps {
  foto?: string
  procesando: boolean
  error?: string
  onElegir: (archivo: File) => void
  onQuitar: () => void
}

const T = TEXTOS.reportar

// Entrada: foto actual y callbacks · Proceso: abre cámara/galería (capture="environment" en
// celular) y muestra vista previa · Salida: control de foto accesible con botón ≥44px.
export function SelectorFoto({ foto, procesando, error, onElegir, onQuitar }: SelectorFotoProps) {
  const entrada = useRef<HTMLInputElement>(null)
  return (
    <div className="flex flex-col gap-2">
      <span id="foto-etiqueta" className="font-semibold">{T.foto}</span>
      {foto ? (
        <div className="relative w-full max-w-xs overflow-hidden rounded-xl border border-borde">
          <img src={foto} alt={T.altVistaPrevia} className="aspect-square w-full object-cover" />
          <button type="button" onClick={onQuitar} aria-label={T.quitarFoto}
            className="absolute right-2 top-2 grid size-11 place-items-center rounded-full bg-superficie text-texto shadow">
            <X size={20} aria-hidden="true" />
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => entrada.current?.click()} disabled={procesando} aria-describedby="foto-ayuda"
          className="flex min-h-24 w-full max-w-xs flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-marca bg-marca-suave p-4 font-semibold text-marca disabled:opacity-60">
          {procesando ? <Loader2 size={28} aria-hidden="true" className="animate-spin" /> : <Camera size={28} aria-hidden="true" />}
          {procesando ? T.procesandoFoto : T.elegirFoto}
        </button>
      )}
      <input ref={entrada} type="file" accept="image/jpeg,image/png,image/webp" capture="environment" hidden
        aria-labelledby="foto-etiqueta"
        onChange={(e) => {
          const archivo = e.target.files?.[0]
          if (archivo) onElegir(archivo)
          e.target.value = ''
        }} />
      <p id="foto-ayuda" className={`text-sm ${error ? 'text-error' : 'text-texto-suave'}`} aria-live="polite">{error ?? T.ayudaFoto}</p>
    </div>
  )
}
