import { CategoriaIcono, Boton, EstadoBadge, EstadoVacio } from '../../components'
import { TEXTOS } from '../../config'
import type { Coincidencia } from './calcularCoincidencia'

const T = TEXTOS.coincidencias

export interface ResultadosCoincidenciasProps {
  coincidencias: Coincidencia[]
  buscado: boolean
  onAbrir: (id: number) => void
  /** Si se pasa, el aviso de "sin resultados" muestra un botón para ir al listado. */
  onVerListado?: () => void
}

// Entrada: coincidencias, si ya se buscó y acciones · Proceso: decide entre aviso vacío o tarjetas
// Salida: lista con puntaje y razones, o "sin resultados" con botón al listado.
export function ResultadosCoincidencias({ coincidencias, buscado, onAbrir, onVerListado }: ResultadosCoincidenciasProps) {
  if (!buscado) return null
  if (coincidencias.length === 0) {
    const botonListado = onVerListado
      && <Boton variante="primario" onClick={onVerListado}>{T.verListado}</Boton>
    return <EstadoVacio mensaje={T.sinResultados} accion={botonListado} />
  }

  return (
    <section aria-labelledby="titulo-coincidencias" className="flex flex-col gap-3">
      <h2 id="titulo-coincidencias" className="text-lg font-bold text-texto">{T.tituloResultados}</h2>
      <ol className="flex flex-col gap-3">
        {coincidencias.map(({ objeto, puntaje, razones }) => (
          <li key={objeto.id} className="flex flex-col gap-3 rounded-xl border border-borde bg-superficie p-4">
            <div className="flex items-start gap-3">
              <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-marca-suave">
                <CategoriaIcono categoria={objeto.categoria} />
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="font-bold text-texto">{objeto.nombre}</span>
                <span><EstadoBadge estado={objeto.estado} /></span>
              </div>
              <p className="shrink-0 text-right text-marca">
                <span className="block text-3xl font-bold leading-none">{puntaje}</span>
                <span className="text-sm">{T.puntos}</span>
              </p>
            </div>
            <ul className="list-disc pl-5 text-sm text-texto-suave">
              {razones.map((razon) => <li key={razon}>{razon}</li>)}
            </ul>
            <Boton variante="secundario" onClick={() => onAbrir(objeto.id)}>{T.verDetalle}</Boton>
          </li>
        ))}
      </ol>
    </section>
  )
}
