import { Search } from '../../components/ui/iconos'
import { TEXTOS } from '../../config'
import type { Objeto } from '../../types'
import { extraerPalabrasClave, type DescripcionPerdida } from '../coincidencias/calcularCoincidencia'
import { predecirLugares } from './predecirLugares'

const T = TEXTOS.coincidencias

// Entrada: objetos registrados y última descripción buscada · Proceso: calcula los lugares más frecuentes
// Salida: lista de lugares con su cantidad de hallazgos, si hay registros.
export function DondeBuscar({ objetos, descripcion }: { objetos: readonly Objeto[]; descripcion: DescripcionPerdida }) {
  const lugares = predecirLugares(objetos, descripcion.categoria, extraerPalabrasClave(descripcion.texto))
  if (lugares.length === 0) return null

  return (
    <section aria-labelledby="titulo-donde-buscar" className="flex flex-col gap-2 rounded-xl border border-borde bg-superficie p-4">
      <h2 id="titulo-donde-buscar" className="flex items-center gap-2 text-lg font-bold text-marca">
        <Search className="size-5 shrink-0" aria-hidden="true" />
        {T.dondeBuscarTitulo}
      </h2>
      <p className="text-sm text-texto-suave">{T.dondeBuscarAyuda}</p>
      <ol className="divide-y divide-borde">
        {/* Entrada: lugar y cantidad · Proceso: muestra ambos datos · Salida: fila de la lista. */}
        {lugares.map(({ lugar, cantidad }) => (
          <li key={lugar} className="flex items-start justify-between gap-3 py-2 text-sm">
            <span className="min-w-0 wrap-break-word">{lugar}</span>
            <strong className="text-marca">{cantidad}</strong>
          </li>
        ))}
      </ol>
    </section>
  )
}
