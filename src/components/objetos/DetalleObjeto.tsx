import { ArrowLeft } from 'lucide-react'
import { TEXTOS } from '../../config'
import type { Objeto } from '../../types'
import { formatearFecha, puedeReclamar, razonNoReclamable } from '../../utils'
import { Boton } from '../ui/Boton'
import { CategoriaIcono } from '../ui/CategoriaIcono'
import { EstadoBadge } from '../ui/EstadoBadge'

export interface DetalleObjetoProps {
  objeto: Objeto
  onReclamar: () => void
  onVolver: () => void
}

// Entrada: objeto · Proceso: regla 2 (botón desactivado con razón visible si no está Disponible)
// Salida: ficha completa del objeto con acción primaria «Reclamar».
export function DetalleObjeto({ objeto, onReclamar, onVolver }: DetalleObjetoProps) {
  const razon = razonNoReclamable(objeto)
  const filas = [
    [TEXTOS.detalle.categoria, objeto.categoria],
    [TEXTOS.detalle.lugar, objeto.lugar],
    [TEXTOS.detalle.fecha, formatearFecha(objeto.fecha)],
    [TEXTOS.detalle.descripcion, objeto.descripcion],
  ] as const
  return (
    <article className="flex flex-col gap-4 rounded-xl border border-borde bg-superficie p-5">
      <Boton variante="texto" onClick={onVolver}><ArrowLeft size={18} aria-hidden="true" />{TEXTOS.acciones.volverListado}</Boton>
      <div className="flex items-center gap-4">
        <span className="grid size-20 place-items-center rounded-xl bg-marca-suave"><CategoriaIcono categoria={objeto.categoria} tamano={40} /></span>
        <div className="flex flex-col items-start gap-2">
          <h1 className="text-2xl font-bold">{objeto.nombre}</h1>
          <EstadoBadge estado={objeto.estado} />
        </div>
      </div>
      <dl className="grid gap-2 sm:grid-cols-2">
        {filas.map(([etiqueta, valor]) => (
          <div key={etiqueta}><dt className="text-sm text-texto-suave">{etiqueta}</dt><dd className="font-semibold">{valor}</dd></div>
        ))}
      </dl>
      <Boton variante="primario" disabled={!puedeReclamar(objeto)} onClick={onReclamar}
        describidoPor={razon ? 'razon-no-reclamable' : undefined}>{TEXTOS.acciones.reclamar}</Boton>
      {razon && <p id="razon-no-reclamable" className="text-sm text-texto-suave" role="note">{razon}</p>}
    </article>
  )
}
