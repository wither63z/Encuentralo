import { SignedIn, SignedOut, SignIn } from '@clerk/clerk-react'
import type { ReactNode } from 'react'
import { CLERK_ACTIVO, TEXTOS } from '../../config'

const LOGO = `${import.meta.env.BASE_URL}icono-encuentralo.png`
const APARIENCIA_CLERK = { variables: { colorPrimary: '#1D4ED8', borderRadius: '0.75rem' } } as const

// Entrada: la app completa · Proceso: si Clerk está activo, primero exige iniciar sesión
// (SignedOut → pantalla de ingreso; SignedIn → la app) · Salida: login o la app.
// Sin clave de Clerk (modo demo, .exe y APK) muestra la app directamente.
export function PuertaSesion({ children }: { children: ReactNode }) {
  if (!CLERK_ACTIVO) return <>{children}</>
  return (
    <>
      <SignedOut>
        <div className="animar-entrada flex min-h-dvh flex-col items-center justify-center gap-5 bg-fondo px-4 py-10 text-center">
          <img src={LOGO} alt="" width={96} height={96} className="size-24 rounded-3xl shadow-md" />
          <h1 className="font-display text-3xl font-bold text-marca">{TEXTOS.app.nombre}</h1>
          <p className="font-bold">{TEXTOS.app.lema}</p>
          <p className="max-w-sm text-texto-suave">{TEXTOS.login.subtitulo}</p>
          <SignIn routing="hash" appearance={APARIENCIA_CLERK} />
          <p className="text-sm text-texto-suave">{TEXTOS.app.aviso}</p>
        </div>
      </SignedOut>
      <SignedIn>{children}</SignedIn>
    </>
  )
}
