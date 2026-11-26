import { Camera, Eye, HandHeart, Search, Sparkles, type LucideIcon } from 'lucide-react'
import { Boton, EstadoBadge } from '../components'
import { ESTADOS, TEXTOS } from '../config'

export interface PaginaInicioProps {
  onVerObjetos: () => void
  onReportar: () => void
  onQuePerdiste: () => void
}

const ICONOS_PASOS: readonly LucideIcon[] = [Search, Eye, HandHeart]
const LOGO = `${import.meta.env.BASE_URL}icono-encuentralo.png`

// Entrada: número, ícono, título y texto de un paso · Proceso: lo dibuja como tarjeta
// Salida: un <li> con el paso numerado.
function TarjetaPaso({ numero, Icono, titulo, texto }: { numero: number; Icono: LucideIcon; titulo: string; texto: string }) {
  return (
    <li className="flex gap-4 rounded-xl border border-borde bg-superficie p-5 shadow-sm">
      <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-marca-suave text-marca">
        <Icono size={20} aria-hidden="true" />
      </span>
      <div>
        <h3 className="font-bold"><span className="text-marca">{numero}.</span> {titulo}</h3>
        <p className="mt-1 text-sm text-texto-suave">{texto}</p>
      </div>
    </li>
  )
}

// Entrada: acciones de navegación · Proceso: arma portada, leyenda de estados y pasos
// Salida: pantalla de bienvenida con una acción principal y dos secundarias.
export function PaginaInicio({ onVerObjetos, onReportar, onQuePerdiste }: PaginaInicioProps) {
  return (
    <div className="animar-entrada mx-auto flex max-w-3xl flex-col gap-12 py-4 md:py-10">
      <section className="flex flex-col items-center gap-5 text-center">
        <img src={LOGO} alt="" width={112} height={112} className="size-24 rounded-3xl shadow-md md:size-28" />
        <h1 className="text-4xl font-bold text-marca md:text-5xl">{TEXTOS.app.nombre}</h1>
        <p className="text-lg font-bold md:text-xl">{TEXTOS.app.lema}</p>
        <p className="max-w-prose text-pretty text-texto-suave">{TEXTOS.app.explicacion}</p>
        <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
          <Boton variante="primario" onClick={onVerObjetos}>{TEXTOS.acciones.verObjetos}</Boton>
          <Boton variante="secundario" onClick={onQuePerdiste}><Sparkles size={18} aria-hidden="true" />{TEXTOS.pie.quePerdiste}</Boton>
          <Boton variante="secundario" onClick={onReportar}><Camera size={18} aria-hidden="true" />{TEXTOS.pie.reportar}</Boton>
        </div>
      </section>

      <section aria-labelledby="titulo-leyenda" className="flex flex-col items-center gap-3">
        <h2 id="titulo-leyenda" className="text-sm font-bold uppercase tracking-wide text-texto-suave">
          {TEXTOS.inicio.leyendaTitulo}
        </h2>
        <ul className="flex flex-wrap justify-center gap-3">
          {ESTADOS.map((estado) => <li key={estado}><EstadoBadge estado={estado} /></li>)}
        </ul>
      </section>

      <section aria-labelledby="titulo-pasos" className="flex flex-col gap-5">
        <h2 id="titulo-pasos" className="text-center text-2xl font-bold">{TEXTOS.inicio.tituloPasos}</h2>
        <ol className="grid gap-4 md:grid-cols-3">
          {TEXTOS.inicio.pasos.map((paso, i) => (
            <TarjetaPaso key={paso.titulo} numero={i + 1} Icono={ICONOS_PASOS[i] ?? Search} titulo={paso.titulo} texto={paso.texto} />
          ))}
        </ol>
      </section>

      <p className="text-center text-sm text-texto-suave">{TEXTOS.app.aviso}</p>
    </div>
  )
}
