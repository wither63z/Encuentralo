import { Show, SignIn, SignUp } from '@clerk/react'
import { useState, type ReactNode } from 'react'
import { CLERK_ACTIVO, TEXTOS } from '../../config'

const LOGO = `${import.meta.env.BASE_URL}icono-encuentralo.png`
// El enlace propio de Clerk (Sign up) saca a accounts.dev y rompe el .exe/APK: se oculta y se usa el nuestro.
const APARIENCIA_CLERK = {
  variables: { colorPrimary: '#1D4ED8', borderRadius: '0.75rem' },
  elements: { footerAction: { display: 'none' } },
} as const

// Entrada: la app completa · Proceso: si Clerk está activo, primero exige iniciar sesión
// (SignedOut → pantalla de ingreso; SignedIn → la app) · Salida: login o la app.
// Sin clave de Clerk (modo demo, .exe y APK) muestra la app directamente.
export function PuertaSesion({ children }: { children: ReactNode }) {
  const [registrando, setRegistrando] = useState(false)
  if (!CLERK_ACTIVO) return <>{children}</>
  return (
    <>
      <Show when="signed-out">
        <div className="animar-entrada flex min-h-dvh flex-col items-center justify-center gap-5 bg-fondo px-4 py-10 text-center">
          <img src={LOGO} alt="" width={96} height={96} className="size-24 rounded-3xl shadow-md" />
          <h1 className="font-display text-3xl font-bold text-marca">{TEXTOS.app.nombre}</h1>
          <p className="font-bold">{TEXTOS.app.lema}</p>
          <p className="max-w-sm text-texto-suave">{TEXTOS.login.subtitulo}</p>
          {registrando ? (
            <SignUp routing="hash" appearance={APARIENCIA_CLERK} />
          ) : (
            <SignIn routing="hash" appearance={APARIENCIA_CLERK} />
          )}
          <button
            type="button"
            onClick={() => setRegistrando((valor) => !valor)}
            className="min-h-11 rounded-full px-4 font-bold text-marca underline-offset-4 hover:underline"
          >
            {registrando ? TEXTOS.login.yaTengoCuenta : TEXTOS.login.crearCuenta}
          </button>
          <p className="text-sm text-texto-suave">{TEXTOS.app.aviso}</p>
        </div>
      </Show>
      <Show when="signed-in">{children}</Show>
    </>
  )
}
