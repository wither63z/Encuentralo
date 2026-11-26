import { SignIn } from '@clerk/clerk-react'
import { Info } from 'lucide-react'
import { Boton } from '../components'
import { CLERK_ACTIVO, TEXTOS } from '../config'

const LOGO = `${import.meta.env.BASE_URL}icono-encuentralo.png`

// Clerk calcula sus tonos a partir de un color real (no acepta variables CSS): azul de la marca.
const APARIENCIA_CLERK = { variables: { colorPrimary: '#1D4ED8', borderRadius: '0.75rem' } } as const

// Entrada: acción de volver · Proceso: muestra el ingreso de Clerk solo si está activo
// Salida: tarjeta centrada con logo, título, subtítulo y el acceso (o un aviso si no hay login).
export function PaginaLogin({ onVolver }: { onVolver: () => void }) {
  return (
    <div className="animar-entrada mx-auto flex max-w-md flex-col items-center gap-5 py-6 text-center">
      <img src={LOGO} alt="" width={64} height={64} className="size-16 rounded-2xl shadow-sm" />
      <h1 className="text-2xl font-bold">{TEXTOS.login.titulo}</h1>
      <p className="text-texto-suave">{TEXTOS.login.subtitulo}</p>
      {CLERK_ACTIVO ? (
        <SignIn routing="hash" appearance={APARIENCIA_CLERK} />
      ) : (
        <p role="status" className="flex items-start gap-3 rounded-lg bg-marca-suave p-4 text-left">
          <Info size={20} aria-hidden="true" className="mt-0.5 shrink-0 text-marca" />
          {TEXTOS.login.sinLogin}
        </p>
      )}
      <Boton variante="texto" onClick={onVolver}>{TEXTOS.acciones.volver}</Boton>
    </div>
  )
}
