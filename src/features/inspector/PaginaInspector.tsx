import { useMemo, useState } from 'react'
import { Boton, Cargando, CategoriaIcono, EstadoBadge, EstadoVacio, MensajeError } from '../../components'
import { TEXTOS, USAR_MOCK } from '../../config'
import { useInspector } from '../../hooks'
import type { Objeto } from '../../types'
import { contarPorEstado, formatearFecha, puedeEntregar } from '../../utils'
import { PanelRadar } from '../radar/PanelRadar'
import { ConteoEstados } from './ConteoEstados'
import { DatosReclamo } from './DatosReclamo'

interface Aviso {
  tipo: 'exito' | 'error'
  texto: string
}

// Entrada: nada · Proceso: muestra el conteo por estado y la lista de Reclamados; el inspector
// marca uno como Entregado · Salida: vista del inspector con carga, error, vacío y avisos.
export function PaginaInspector({ onAbrir }: { onAbrir?: (id: number) => void }) {
  const { objetos, reclamos, cargando, error, marcarEntregado, procesando, reintentar, restablecer } = useInspector()
  const [aviso, setAviso] = useState<Aviso | null>(null)
  const conteo = useMemo(() => contarPorEstado(objetos), [objetos])
  const reclamados = useMemo(() => objetos.filter(puedeEntregar), [objetos])

  async function entregar(objeto: Objeto) {
    const resultado = await marcarEntregado(objeto.id)
    setAviso(resultado.ok
      ? { tipo: 'exito', texto: TEXTOS.inspector.exito(objeto.nombre) }
      : { tipo: 'error', texto: resultado.mensaje ?? TEXTOS.errores.entregar })
  }

  async function restablecerDemo() {
    await restablecer()
    setAviso({ tipo: 'exito', texto: TEXTOS.inspector.restablecido })
  }

  return (
    <section className="flex flex-col gap-5">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">{TEXTOS.inspector.titulo}</h1>
        <p className="text-texto-suave">{TEXTOS.inspector.intro}</p>
        <p className="text-sm text-texto-suave">{TEXTOS.inspector.aviso}</p>
      </header>

      {cargando && <Cargando />}
      {!cargando && error && <MensajeError mensaje={error} onReintentar={() => void reintentar()} />}
      {!cargando && !error && <ConteoEstados conteo={conteo} />}

      <div aria-live="polite">
        {aviso && (
          <p role={aviso.tipo === 'error' ? 'alert' : 'status'}
            className={`rounded-lg border p-3 font-semibold ${aviso.tipo === 'error' ? 'border-error text-error bg-superficie' : 'border-borde bg-exito/20 text-texto'}`}>
            {aviso.texto}
          </p>
        )}
      </div>

      {!cargando && !error && (
        <section aria-labelledby="titulo-reclamados" className="flex flex-col gap-3">
          <h2 id="titulo-reclamados" className="text-lg font-bold">{TEXTOS.inspector.tituloReclamados}</h2>
          {reclamados.length === 0 && <EstadoVacio mensaje={TEXTOS.inspector.sinReclamados} />}
          {reclamados.length > 0 && (
            <ul className="flex flex-col gap-3">
              {reclamados.map((objeto) => (
                <li key={objeto.id} className="flex flex-col gap-3 rounded-xl border border-borde bg-superficie p-4 sm:flex-row sm:items-center">
                  <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-marca-suave">
                    <CategoriaIcono categoria={objeto.categoria} />
                  </span>
                  <div className="flex flex-1 flex-col gap-1">
                    <span className="font-semibold">{objeto.nombre}</span>
                    <span className="text-sm text-texto-suave">{objeto.lugar} · {formatearFecha(objeto.fecha)}</span>
                    <div><EstadoBadge estado={objeto.estado} /></div>
                    <DatosReclamo reclamo={reclamos.find((r) => r.objetoId === objeto.id)} />
                  </div>
                  <Boton variante="primario" disabled={procesando !== null} onClick={() => void entregar(objeto)}>
                    {procesando === objeto.id ? TEXTOS.inspector.guardando : TEXTOS.inspector.marcarEntregado}
                  </Boton>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {!cargando && !error && <PanelRadar objetos={objetos} onAbrir={onAbrir} />}

      {USAR_MOCK && (
        <div className="flex flex-col items-start gap-1 border-t border-borde pt-4">
          <Boton variante="secundario" disabled={cargando || procesando !== null} onClick={() => void restablecerDemo()}>
            {TEXTOS.inspector.restablecer}
          </Boton>
          <p className="text-sm text-texto-suave">{TEXTOS.inspector.ayudaRestablecer}</p>
        </div>
      )}
    </section>
  )
}
