import { SignIn } from '@clerk/clerk-react'
import { Boton } from '../components'
import { CLERK_ACTIVO, TEXTOS } from '../config'

// Entrada: acción de volver · Proceso: muestra Clerk solo si está activo
// Salida: formulario de ingreso o aviso de que no hace falta ingresar.
export function PaginaLogin({ onVolver }: { onVolver: () => void }) {
  return (
    <section className="flex flex-col items-center gap-4 py-6">
      <h1 className="text-2xl font-bold">{TEXTOS.login.titulo}</h1>
      {CLERK_ACTIVO ? (
        <SignIn routing="hash" appearance={{ variables: { colorPrimary: 'var(--color-marca)' } }} />
      ) : (
        <p className="text-texto-suave">{TEXTOS.login.sinLogin}</p>
      )}
      <Boton variante="secundario" onClick={onVolver}>{TEXTOS.acciones.volver}</Boton>
    </section>
  )
}
