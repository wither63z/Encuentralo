import { Search } from 'lucide-react'
import { Boton } from '../components'
import { TEXTOS } from '../config'

// Entrada: acción para ir al listado · Salida: portada con identidad, explicación y acción primaria.
export function PaginaInicio({ onVerObjetos }: { onVerObjetos: () => void }) {
  return (
    <section className="flex flex-col items-center gap-5 py-10 text-center">
      <span className="grid size-20 place-items-center rounded-2xl bg-marca text-alerta"><Search size={44} aria-hidden="true" /></span>
      <h1 className="font-display text-4xl font-bold text-marca">{TEXTOS.app.nombre}</h1>
      <p className="font-semibold text-texto-suave">{TEXTOS.app.lema}</p>
      <p className="max-w-prose">{TEXTOS.app.explicacion}</p>
      <Boton variante="primario" onClick={onVerObjetos}>{TEXTOS.acciones.verObjetos}</Boton>
    </section>
  )
}
