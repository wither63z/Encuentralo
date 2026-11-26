import { ArrowLeft } from 'lucide-react'
import { Boton, BuscadorFiltro, Cargando, EstadoVacio, ListaObjetos, MensajeError } from '../components'
import { TEXTOS } from '../config'
import { useFiltros, useObjetos } from '../hooks'

export interface PaginaListadoProps {
  onAbrir: (id: number) => void
  onVolver: () => void
}

// Entrada: acciones para abrir un objeto y volver · Proceso: carga objetos y aplica filtros
// Salida: listado con contador y estados de carga, error, vacío y sin resultados (regla 6).
export function PaginaListado({ onAbrir, onVolver }: PaginaListadoProps) {
  const { objetos, cargando, error, reintentar } = useObjetos()
  const { filtros, setFiltros, limpiar, resultado, sinResultados } = useFiltros(objetos)

  return (
    <div className="animar-entrada mx-auto flex max-w-5xl flex-col gap-6 py-2 md:py-6">
      <div><Boton variante="texto" onClick={onVolver}><ArrowLeft size={18} aria-hidden="true" />{TEXTOS.acciones.volver}</Boton></div>
      <header className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-3xl font-bold md:text-4xl">{TEXTOS.listado.titulo}</h1>
        {!cargando && !error && (
          <p className="text-sm font-bold text-texto-suave" aria-live="polite">
            {TEXTOS.listado.contador(resultado.length, objetos.length)}
          </p>
        )}
      </header>

      <section className="rounded-xl border border-borde bg-superficie p-4 shadow-sm md:p-5">
        <BuscadorFiltro filtros={filtros} onCambio={setFiltros} />
      </section>

      {cargando && <Cargando />}
      {!cargando && error && <MensajeError mensaje={error} onReintentar={() => void reintentar()} />}
      {!cargando && !error && objetos.length === 0 && <EstadoVacio mensaje={TEXTOS.listado.vacio} />}
      {!cargando && !error && sinResultados && (
        <EstadoVacio mensaje={TEXTOS.listado.sinResultados}
          accion={<Boton variante="secundario" onClick={limpiar}>{TEXTOS.acciones.limpiarFiltros}</Boton>} />
      )}
      {!cargando && !error && resultado.length > 0 && <ListaObjetos objetos={resultado} onAbrir={onAbrir} />}
    </div>
  )
}
