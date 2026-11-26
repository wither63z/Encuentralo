import { useState, type FormEvent } from 'react'
import { Boton, CampoTexto } from '../../components'
import { CATEGORIAS, TEXTOS } from '../../config'
import type { Categoria } from '../../types'
import type { DescripcionPerdida } from './calcularCoincidencia'

const T = TEXTOS.coincidencias

export interface FormularioPerdidaProps {
  onBuscar: (descripcion: DescripcionPerdida) => void
}

const claseSelect = 'min-h-11 w-full rounded-lg border border-borde-control bg-superficie px-3 focus-visible:outline-2 focus-visible:outline-marca'

// Entrada: función onBuscar · Proceso: guarda los campos en estado local y valida que haya texto
// Salida: formulario que entrega la DescripcionPerdida solo si el texto no está vacío.
export function FormularioPerdida({ onBuscar }: FormularioPerdidaProps) {
  const [texto, setTexto] = useState('')
  const [categoria, setCategoria] = useState<Categoria | 'Todas'>('Todas')
  const [lugar, setLugar] = useState('')
  const [error, setError] = useState<string | undefined>(undefined)

  // Entrada: evento submit · Proceso: evita recargar y valida el texto
  // Salida: llama onBuscar o muestra el error junto al campo.
  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    if (texto.trim() === '') {
      setError(T.errorTexto)
      return
    }
    setError(undefined)
    onBuscar({ texto, categoria, lugar })
  }

  return (
    <form onSubmit={enviar} noValidate className="flex flex-col gap-4 rounded-xl border border-borde bg-superficie p-4">
      <CampoTexto id="perdida-texto" etiqueta={T.etiquetaTexto} valor={texto} onChange={setTexto}
        error={error} ayuda={T.ayudaTexto} multilinea />
      <div className="flex flex-col gap-1">
        <label htmlFor="perdida-categoria" className="font-semibold">{T.etiquetaCategoria}</label>
        <select id="perdida-categoria" className={claseSelect} value={categoria}
          onChange={(e) => setCategoria(e.target.value as Categoria | 'Todas')}>
          <option value="Todas">{T.todas}</option>
          {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <CampoTexto id="perdida-lugar" etiqueta={T.etiquetaLugar} valor={lugar} onChange={setLugar} />
      <Boton variante="primario" tipo="submit" onClick={() => undefined}>{T.buscar}</Boton>
    </form>
  )
}
