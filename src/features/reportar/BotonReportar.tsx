import { Plus } from 'lucide-react'
import { TEXTOS } from '../../config'

// Entrada: acción para abrir «Reportar objeto encontrado» · Proceso: botón flotante fijo abajo a
// la derecha (≥56 px, foco visible) · Salida: acceso rápido para crear un objeto nuevo.
export function BotonReportar({ onReportar }: { onReportar: () => void }) {
  return (
    <button type="button" onClick={onReportar}
      className="fixed bottom-4 right-4 z-20 flex min-h-14 items-center gap-2 rounded-full bg-marca px-5 font-semibold text-white shadow-lg hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca">
      <Plus size={22} aria-hidden="true" />
      {TEXTOS.reportar.botonFlotante}
    </button>
  )
}
