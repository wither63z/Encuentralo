import type { Objeto } from '../../types'
import { formatearFecha } from '../../utils'
import { CategoriaIcono } from '../ui/CategoriaIcono'
import { EstadoBadge } from '../ui/EstadoBadge'

// Entrada: objeto y acción al abrir · Proceso: arma foto (o ícono de respaldo), nombre, categoría, fecha e insignia
// Salida: tarjeta-botón accesible que abre el detalle del objeto.
export function ObjetoCard({ objeto, onAbrir }: { objeto: Objeto; onAbrir: (id: number) => void }) {
  return (
    <button type="button" onClick={() => onAbrir(objeto.id)}
      className="flex w-full items-start gap-3 rounded-xl border border-borde bg-superficie p-4 text-left hover:border-marca focus-visible:outline-2 focus-visible:outline-marca">
      {objeto.foto ? (
        <img src={objeto.foto} alt={`Foto de ${objeto.nombre}`} loading="lazy" width={64} height={64}
          className="aspect-square size-16 shrink-0 rounded-lg object-cover" />
      ) : (
        <span className="grid size-16 shrink-0 place-items-center rounded-lg bg-marca-suave">
          <CategoriaIcono categoria={objeto.categoria} />
        </span>
      )}
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="font-bold">{objeto.nombre}</span>
        <span className="text-sm text-texto-suave">{objeto.categoria} · {formatearFecha(objeto.fecha)}</span>
        <span><EstadoBadge estado={objeto.estado} /></span>
      </span>
    </button>
  )
}
