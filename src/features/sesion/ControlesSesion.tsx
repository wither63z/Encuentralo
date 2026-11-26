import { SignInButton, Show, UserButton } from '@clerk/react'
import { CLERK_ACTIVO, TEXTOS } from '../../config'

// Entrada: nada · Proceso: solo si Clerk está activo, muestra «Ingresar» (sin sesión) o el
// botón de usuario (con sesión) · Salida: controles de sesión o nada en modo demo.
// Fuente: https://clerk.com/docs/react/getting-started/quickstart (SDK Core 3: Show).
export function ControlesSesion() {
  if (!CLERK_ACTIVO) return null
  return (
    <div className="flex min-h-11 items-center">
      <Show when="signed-out">
        <SignInButton mode="modal">
          <button type="button" className="min-h-11 rounded-lg px-3 font-semibold text-marca">{TEXTOS.menu.ingresar}</button>
        </SignInButton>
      </Show>
      <Show when="signed-in">
        <UserButton />
      </Show>
    </div>
  )
}
