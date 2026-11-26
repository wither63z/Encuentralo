import { useState, type FormEvent } from 'react'
import { MIN_CARACTERES_SENA, TEXTOS } from '../../config'
import type { DatosReclamo, ErroresReclamo, Objeto } from '../../types'
import { esReclamoValido, validarReclamo } from '../../utils'
import { Boton } from '../ui/Boton'
import { CampoTexto } from '../ui/CampoTexto'

export interface FormularioReclamoProps {
  objeto: Objeto
  onEnviar: (datos: DatosReclamo) => void
  onCancelar: () => void
  enviando: boolean
  datosIniciales?: Partial<DatosReclamo>
}

// Entrada: objeto y callbacks · Proceso: valida al enviar y en vivo tras el primer intento
// (reglas 4 y 5) · Salida: llama a onEnviar solo si los datos son válidos.
export function FormularioReclamo({ objeto, onEnviar, onCancelar, enviando, datosIniciales }: FormularioReclamoProps) {
  const [datos, setDatos] = useState<DatosReclamo>({ nombre: '', curso: '', sena: '', ...datosIniciales })
  const [errores, setErrores] = useState<ErroresReclamo>({})
  const [intentado, setIntentado] = useState(false)

  function cambiar(campo: keyof DatosReclamo, valor: string) {
    const nuevos = { ...datos, [campo]: valor }
    setDatos(nuevos)
    if (intentado) setErrores(validarReclamo(nuevos))
  }

  function enviar(evento: FormEvent) {
    evento.preventDefault()
    const encontrados = validarReclamo(datos)
    setErrores(encontrados)
    setIntentado(true)
    if (esReclamoValido(encontrados)) onEnviar(datos)
    else document.getElementById(`campo-${Object.keys(encontrados)[0]}`)?.focus()
  }

  return (
    <form noValidate onSubmit={enviar} className="flex flex-col gap-4 rounded-xl border border-borde bg-superficie p-5">
      <h1 className="text-2xl font-bold">{TEXTOS.reclamo.titulo}: {objeto.nombre}</h1>
      <p className="text-texto-suave">{TEXTOS.reclamo.intro}</p>
      <CampoTexto id="campo-nombre" etiqueta={TEXTOS.reclamo.nombre} valor={datos.nombre} onChange={(v) => cambiar('nombre', v)} error={errores.nombre} />
      <CampoTexto id="campo-curso" etiqueta={TEXTOS.reclamo.curso} valor={datos.curso} onChange={(v) => cambiar('curso', v)} error={errores.curso} />
      <CampoTexto id="campo-sena" etiqueta={TEXTOS.reclamo.sena} valor={datos.sena} onChange={(v) => cambiar('sena', v)}
        error={errores.sena} multilinea minimo={MIN_CARACTERES_SENA} ayuda={TEXTOS.reclamo.ayudaSena} />
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Boton variante="secundario" onClick={onCancelar}>{TEXTOS.acciones.cancelar}</Boton>
        <Boton variante="primario" tipo="submit" disabled={enviando} onClick={() => undefined}>
          {enviando ? TEXTOS.acciones.enviando : TEXTOS.acciones.enviar}
        </Boton>
      </div>
    </form>
  )
}
