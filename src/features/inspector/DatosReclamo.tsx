import { TEXTOS } from '../../config'
import type { ReclamoRegistrado } from '../../types'

const T = TEXTOS.inspector

// Entrada: el reclamo del objeto (o undefined) · Proceso: muestra quién lo reclamó y su seña
// para que el profesor compare antes de entregar · Salida: bloque con los datos o un aviso.
export function DatosReclamo({ reclamo }: { reclamo?: ReclamoRegistrado }) {
  if (!reclamo) return <p className="text-sm text-texto-suave">{T.sinDatosReclamo}</p>
  return (
    <dl className="grid gap-1 rounded-lg bg-fondo p-3 text-sm">
      <div className="flex flex-wrap gap-x-2">
        <dt className="font-bold">{T.reclamadoPor}</dt>
        <dd>{reclamo.nombre} · {reclamo.curso}</dd>
      </div>
      <div className="flex flex-wrap gap-x-2">
        <dt className="font-bold">{T.sena}</dt>
        <dd>«{reclamo.sena}»</dd>
      </div>
      <p className="text-texto-suave">{T.verificar}</p>
    </dl>
  )
}
