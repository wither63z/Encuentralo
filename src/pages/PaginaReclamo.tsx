import { Boton, Cargando, FormularioReclamo, MensajeError } from '../components'
import { TEXTOS } from '../config'
import { useObjeto, useReclamo } from '../hooks'
import type { DatosReclamo, ResultadoReclamo } from '../types'

export interface PaginaReclamoProps {
  id: number
  onResultado: (resultado: ResultadoReclamo) => void
  onCancelar: () => void
}

// Entrada: id del objeto · Proceso: muestra el formulario y envía el reclamo
// Salida: llama a onResultado con el resultado (éxito o error).
export function PaginaReclamo({ id, onResultado, onCancelar }: PaginaReclamoProps) {
  const { objeto, cargando, error } = useObjeto(id)
  const { enviar, enviando } = useReclamo(id)

  async function manejarEnvio(datos: DatosReclamo) {
    onResultado(await enviar(datos))
  }

  if (cargando) return <Cargando />
  if (error || !objeto) {
    return (
      <div className="flex flex-col gap-3">
        <MensajeError mensaje={error ?? TEXTOS.errores.noExiste} />
        <Boton variante="secundario" onClick={onCancelar}>{TEXTOS.acciones.volver}</Boton>
      </div>
    )
  }
  return (
    <div className="animar-entrada mx-auto max-w-2xl py-2 md:py-6">
      <FormularioReclamo objeto={objeto} enviando={enviando} onCancelar={onCancelar} onEnviar={(d) => void manejarEnvio(d)} />
    </div>
  )
}
