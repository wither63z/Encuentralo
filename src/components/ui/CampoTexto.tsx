export interface CampoTextoProps {
  id: string
  etiqueta: string
  valor: string
  onChange: (valor: string) => void
  error?: string
  multilinea?: boolean
  /** Si se indica, muestra el contador n/minimo. */
  minimo?: number
  ayuda?: string
  /** Texto del contador, p. ej. TEXTOS.reclamo.contador. Si falta, se muestra «n/minimo». */
  textoContador?: (lleva: number) => string
}

// Entrada: valor, etiqueta y error · Proceso: input o textarea con label visible y aria
// Salida: campo accesible con mensaje de error junto al campo y contador opcional.
export function CampoTexto({ id, etiqueta, valor, onChange, error, multilinea, minimo, ayuda, textoContador }: CampoTextoProps) {
  const clases = `w-full rounded-lg border bg-superficie px-3 py-2 min-h-11 focus-visible:outline-2 focus-visible:outline-marca ${error ? 'border-error' : 'border-borde'}`
  const idAyuda = `${id}-ayuda`
  const props = {
    id,
    value: valor,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': idAyuda,
    className: clases,
  }
  const largo = valor.trim().length

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="font-semibold">{etiqueta}</label>
      {multilinea ? (
        <textarea {...props} rows={3} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input {...props} type="text" onChange={(e) => onChange(e.target.value)} />
      )}
      <div id={idAyuda} className="flex justify-between gap-2 text-sm">
        <span className={error ? 'text-error' : 'text-texto-suave'}>{error ?? ayuda ?? ''}</span>
        {minimo !== undefined && (
          <span className={largo >= minimo ? 'text-texto-suave' : 'text-error'}>
            {textoContador ? textoContador(largo) : `${largo}/${minimo}`}
          </span>
        )}
      </div>
    </div>
  )
}
