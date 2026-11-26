import { CircleCheck, Clock, PackageCheck, type Icono } from '../../components/ui/iconos'
import { ESTADOS, ESTADOS_UI, TEXTOS, type NombreIconoEstado } from '../../config'
import type { Estado } from '../../types'

const ICONOS: Record<NombreIconoEstado, Icono> = { CircleCheck, Clock, PackageCheck }

// Entrada: conteo por estado · Proceso: una tarjeta por estado con color, ícono y texto de
// ESTADOS_UI (el color nunca va solo) · Salida: resumen accesible de tres tarjetas.
export function ConteoEstados({ conteo }: { conteo: Record<Estado, number> }) {
  return (
    <section aria-labelledby="titulo-conteo" className="flex flex-col gap-2">
      <h2 id="titulo-conteo" className="text-lg font-bold">{TEXTOS.inspector.tituloConteo}</h2>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {ESTADOS.map((estado) => {
          const ui = ESTADOS_UI[estado]
          const Icono = ICONOS[ui.icono]
          return (
            <li key={estado} className={`flex items-center gap-3 rounded-xl border border-borde p-4 ${ui.clases}`}>
              <Icono size={28} aria-hidden="true" />
              <div className="flex flex-col">
                <span className="text-3xl font-bold leading-none">{conteo[estado]}</span>
                <span className="font-semibold">{ui.etiqueta}</span>
                <span className="sr-only">{TEXTOS.inspector.conteo(conteo[estado])}</span>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
