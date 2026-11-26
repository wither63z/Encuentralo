import { BuscadorFiltro, Boton, Cargando, EstadoVacio, ListaObjetos, MensajeError } from '../components'
import { TEXTOS } from '../config'
import { useFiltros, useObjetos } from '../hooks'

// Entrada: acción para abrir un objeto · Proceso: carga objetos y aplica filtros
// Salida: listado con estados de carga, error, vacío y sin resultados (regla 6).
export function PaginaListado({ onAbrir }: { onAbrir: (id: number) => void }) {
  const { objetos, cargando, error, reintentar } = useObjetos()
  const { filtros, setFiltros, limpiar, resultado, sinResultados } = useFiltros(objetos)

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">{TEXTOS.listado.titulo}</h1>
      <BuscadorFiltro filtros={filtros} onCambio={setFiltros} />
      {cargando && <Cargando />}
      {!cargando && error && <MensajeError mensaje={error} onReintentar={() => void reintentar()} />}
      {!cargando && !error && objetos.length === 0 && <EstadoVacio mensaje={TEXTOS.listado.vacio} />}
      {!cargando && !error && sinResultados && (
        <EstadoVacio mensaje={TEXTOS.listado.sinResultados}
          accion={<Boton variante="secundario" onClick={limpiar}>{TEXTOS.acciones.limpiarFiltros}</Boton>} />
      )}
      {!cargando && !error && resultado.length > 0 && <ListaObjetos objetos={resultado} onAbrir={onAbrir} />}
    </section>
  )
}
