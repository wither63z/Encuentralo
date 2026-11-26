import { useMemo } from 'react'
import { TEXTOS } from '../../config'
import type { Objeto } from '../../types'
import { formatearFecha, hoyIso } from '../../utils'
import { calcularRadar, diasDesde, DIAS_ESTANCADO, type Ranking } from './calcularRadar'

const T = TEXTOS.radar

// Entrada: título y ranking · Proceso: lista con barra proporcional · Salida: tarjeta del top 3.
function TarjetaTop({ titulo, ranking }: { titulo: string; ranking: Ranking[] }) {
  const maximo = ranking[0]?.cantidad ?? 1
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-borde bg-superficie p-4">
      <h3 className="font-bold">{titulo}</h3>
      <ol className="flex flex-col gap-2">
        {ranking.map((r) => (
          <li key={r.nombre} className="flex flex-col gap-1 text-sm">
            <span className="flex justify-between"><span>{r.nombre}</span><strong>{r.cantidad}</strong></span>
            <span className="h-2 rounded-full bg-marca-suave">
              <span className="block h-2 rounded-full bg-marca" style={{ width: `${(r.cantidad / maximo) * 100}%` }} />
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}

// Entrada: objetos cargados · Proceso: calcula estancados y top 3 · Salida: panel del Radar.
export function PanelRadar({ objetos, onAbrir }: { objetos: readonly Objeto[]; onAbrir?: (id: number) => void }) {
  const hoy = hoyIso()
  const radar = useMemo(() => calcularRadar(objetos, hoy), [objetos, hoy])
  return (
    <section aria-labelledby="titulo-radar" className="flex flex-col gap-3">
      <h2 id="titulo-radar" className="text-lg font-bold">{T.titulo}</h2>
      <p className="text-sm text-texto-suave">{T.explicacion(DIAS_ESTANCADO)}</p>
      <div className="rounded-xl border border-alerta bg-alerta/10 p-4">
        <h3 className="font-bold">{T.estancados(radar.estancados.length)}</h3>
        {radar.estancados.length === 0 ? (
          <p className="text-sm text-texto-suave">{T.sinEstancados}</p>
        ) : (
          <ul className="mt-2 flex flex-col gap-1 text-sm">
            {radar.estancados.slice(0, 5).map((o) => (
              <li key={o.id}>
                <button type="button" onClick={() => onAbrir?.(o.id)} className="min-h-11 text-left underline-offset-4 hover:underline">
                  <strong>{o.nombre}</strong> · {o.lugar} · {formatearFecha(o.fecha)} ({T.dias(diasDesde(o.fecha, hoy))})
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <TarjetaTop titulo={T.topLugares} ranking={radar.topLugares} />
        <TarjetaTop titulo={T.topCategorias} ranking={radar.topCategorias} />
      </div>
    </section>
  )
}
