import { useState, type FormEvent } from 'react'
import { Boton, CampoTexto, MensajeError } from '../../components'
import { CATEGORIAS, TEXTOS } from '../../config'
import { useReportar } from '../../hooks'
import type { DatosNuevoObjeto, ErroresNuevoObjeto } from '../../types'
import { hoyIso, validarNuevoObjeto } from '../../utils'
import { SelectorFoto } from './SelectorFoto'

const T = TEXTOS.reportar
const VACIO: DatosNuevoObjeto = { nombre: '', categoria: '', lugar: '', fecha: hoyIso(), descripcion: '' }
const claseControl = 'min-h-11 w-full rounded-lg border border-borde-control bg-superficie px-3 focus-visible:outline-2 focus-visible:outline-marca'

export interface PaginaReportarProps {
  onRegistrado: (id: number, aviso?: string) => void
  onCancelar: () => void
}

// Entrada: callbacks de navegación · Proceso: formulario con foto, validación al enviar y en vivo
// al corregir · Salida: llama a onRegistrado con el id nuevo.
export function PaginaReportar({ onRegistrado, onCancelar }: PaginaReportarProps) {
  const { prepararFoto, procesandoFoto, enviar, enviando } = useReportar()
  const [datos, setDatos] = useState<DatosNuevoObjeto>(VACIO)
  const [errores, setErrores] = useState<ErroresNuevoObjeto>({})
  const [intentado, setIntentado] = useState(false)
  const [mensaje, setMensaje] = useState<string | null>(null)

  function cambiar<K extends keyof DatosNuevoObjeto>(campo: K, valor: DatosNuevoObjeto[K]) {
    const nuevos = { ...datos, [campo]: valor }
    setDatos(nuevos)
    if (intentado) setErrores(validarNuevoObjeto(nuevos, hoyIso()))
  }

  async function elegirFoto(archivo: File) {
    const foto = await prepararFoto(archivo)
    if (foto) cambiar('foto', foto)
    else setErrores((previo) => ({ ...previo, foto: T.errores.foto }))
  }

  async function registrar(evento: FormEvent) {
    evento.preventDefault()
    setIntentado(true)
    const resultado = await enviar(datos)
    if (resultado.ok && resultado.id !== undefined) return onRegistrado(resultado.id, resultado.mensaje)
    setErrores(resultado.errores ?? {})
    setMensaje(resultado.errores ? null : (resultado.mensaje ?? T.errores.enviar))
    if (resultado.errores) document.getElementById(`reportar-${Object.keys(resultado.errores)[0]}`)?.focus()
  }

  return (
    <form noValidate onSubmit={(e) => void registrar(e)} className="mx-auto flex w-full max-w-2xl flex-col gap-4 rounded-xl border border-borde bg-superficie p-4 sm:p-6">
      <h1 className="font-display text-2xl font-bold">{T.titulo}</h1>
      <p className="text-texto-suave">{T.intro}</p>
      {mensaje && <MensajeError mensaje={mensaje} />}
      <SelectorFoto foto={datos.foto} procesando={procesandoFoto} error={errores.foto}
        onElegir={(a) => void elegirFoto(a)} onQuitar={() => cambiar('foto', undefined)} />
      <CampoTexto id="reportar-nombre" etiqueta={T.nombre} valor={datos.nombre} onChange={(v) => cambiar('nombre', v)} error={errores.nombre} />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 font-semibold">
          {T.categoria}
          <select id="reportar-categoria" className={claseControl} value={datos.categoria} aria-invalid={errores.categoria ? true : undefined}
            onChange={(e) => cambiar('categoria', e.target.value as DatosNuevoObjeto['categoria'])}>
            <option value="">{T.elegirCategoria}</option>
            {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {errores.categoria && <span className="text-sm font-normal text-error" aria-live="polite">{errores.categoria}</span>}
        </label>
        <label className="flex flex-col gap-1 font-semibold">
          {T.fecha}
          <input id="reportar-fecha" type="date" max={hoyIso()} className={claseControl} value={datos.fecha}
            aria-invalid={errores.fecha ? true : undefined} onChange={(e) => cambiar('fecha', e.target.value)} />
          {errores.fecha && <span className="text-sm font-normal text-error" aria-live="polite">{errores.fecha}</span>}
        </label>
      </div>
      <CampoTexto id="reportar-lugar" etiqueta={T.lugar} valor={datos.lugar} onChange={(v) => cambiar('lugar', v)} error={errores.lugar} />
      <CampoTexto id="reportar-descripcion" etiqueta={T.descripcion} valor={datos.descripcion} multilinea
        onChange={(v) => cambiar('descripcion', v)} error={errores.descripcion} />
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Boton variante="secundario" onClick={onCancelar}>{TEXTOS.acciones.cancelar}</Boton>
        <Boton variante="primario" tipo="submit" disabled={enviando || procesandoFoto} onClick={() => undefined}>
          {enviando ? T.enviando : T.enviar}
        </Boton>
      </div>
    </form>
  )
}
