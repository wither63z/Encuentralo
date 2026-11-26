import { CATEGORIAS, ESTADOS, TEXTOS } from '../../config'
import type { Categoria, Estado, FiltrosObjetos } from '../../types'

export interface BuscadorFiltroProps {
  filtros: FiltrosObjetos
  onCambio: (filtros: FiltrosObjetos) => void
}

const claseControl = 'min-h-11 w-full rounded-lg border border-borde-control bg-superficie px-3 focus-visible:outline-2 focus-visible:outline-marca'

// Entrada: filtros actuales · Proceso: copia los filtros cambiando solo el campo editado
// Salida: caja de búsqueda + selectores de categoría y estado.
export function BuscadorFiltro({ filtros, onCambio }: BuscadorFiltroProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-[2fr_1fr_1fr]">
      <label className="flex flex-col gap-1 font-semibold">
        {TEXTOS.listado.buscar}
        <input type="search" className={claseControl} value={filtros.texto}
          onChange={(e) => onCambio({ ...filtros, texto: e.target.value })} />
      </label>
      <label className="flex flex-col gap-1 font-semibold">
        {TEXTOS.listado.categoria}
        <select className={claseControl} value={filtros.categoria}
          onChange={(e) => onCambio({ ...filtros, categoria: e.target.value as Categoria | 'Todas' })}>
          <option value="Todas">{TEXTOS.listado.todas}</option>
          {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </label>
      <label className="flex flex-col gap-1 font-semibold">
        {TEXTOS.listado.estado}
        <select className={claseControl} value={filtros.estado}
          onChange={(e) => onCambio({ ...filtros, estado: e.target.value as Estado | 'Todos' })}>
          <option value="Todos">{TEXTOS.listado.todos}</option>
          {ESTADOS.map((e) => <option key={e} value={e}>{e}</option>)}
        </select>
      </label>
    </div>
  )
}
