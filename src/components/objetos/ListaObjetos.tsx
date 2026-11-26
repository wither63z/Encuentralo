import type { Objeto } from '../../types'
import { ObjetoCard } from './ObjetoCard'

// Entrada: lista de objetos · Salida: cuadrícula responsive de tarjetas.
export function ListaObjetos({ objetos, onAbrir }: { objetos: readonly Objeto[]; onAbrir: (id: number) => void }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {objetos.map((objeto) => (
        <li key={objeto.id}><ObjetoCard objeto={objeto} onAbrir={onAbrir} /></li>
      ))}
    </ul>
  )
}
