import type { ReactNode } from 'react'

export type VarianteBoton = 'primario' | 'secundario' | 'texto'

export interface BotonProps {
  variante: VarianteBoton
  disabled?: boolean
  onClick: () => void
  children: ReactNode
  tipo?: 'button' | 'submit'
  /** id del texto que explica el botón (p. ej. por qué está desactivado). */
  describidoPor?: string
}

const CLASES: Record<VarianteBoton, string> = {
  primario: 'bg-marca text-superficie hover:opacity-90',
  secundario: 'bg-superficie text-marca border border-marca hover:bg-marca-suave',
  texto: 'text-marca underline-offset-4 hover:underline',
}

// Entrada: variante, disabled y contenido · Proceso: aplica las clases de la variante
// Salida: botón de al menos 44px; si está disabled se ve atenuado y no responde.
export function Boton({ variante, disabled, onClick, children, tipo = 'button', describidoPor }: BotonProps) {
  return (
    <button
      type={tipo}
      aria-describedby={describidoPor}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca disabled:cursor-not-allowed disabled:opacity-50 ${CLASES[variante]}`}
    >
      {children}
    </button>
  )
}
