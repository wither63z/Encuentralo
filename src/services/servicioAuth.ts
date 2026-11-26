import { CLERK_ACTIVO, USAR_MOCK } from '../config'
import type { Usuario } from '../types'

const USUARIO_DEMO: Usuario = { id: 'demo', nombre: 'Estudiante de prueba' }

// Forma mínima del objeto global window.Clerk que usamos (Clerk JS v5).
// Fuente: https://clerk.com/docs/guides/development/making-requests (Clerk.session.getToken())
// y https://clerk.com/docs/reference/objects/session (getToken → Promise<string | null>).
interface ClerkGlobal {
  loaded?: boolean
  user?: { id: string; fullName: string | null; firstName?: string | null } | null
  session?: { getToken: () => Promise<string | null> } | null
}

// Entrada: nada · Proceso: lee window.Clerk de forma segura (puede no existir aún)
// Salida: objeto Clerk o undefined si no cargó o no hay navegador.
function leerClerk(): ClerkGlobal | undefined {
  if (typeof window === 'undefined') return undefined
  const posible: unknown = (window as unknown as { Clerk?: unknown }).Clerk
  return typeof posible === 'object' && posible !== null ? (posible as ClerkGlobal) : undefined
}

export const servicioAuth = {
  // Entrada: nada · Proceso: con Clerk lee la sesión; sin Clerk, usuario ficticio SOLO en modo
  // mock (sin mock y sin Clerk no hay nadie autenticado) · Salida: usuario actual o null.
  usuarioActual(): Usuario | null {
    if (!CLERK_ACTIVO) return USAR_MOCK ? USUARIO_DEMO : null
    const usuario = leerClerk()?.user
    if (!usuario || typeof usuario.id !== 'string') return null
    return { id: usuario.id, nombre: usuario.fullName ?? usuario.firstName ?? '' }
  },

  // Entrada: nada · Proceso: revisa si hay usuario · Salida: true si puede reclamar.
  estaAutenticado(): boolean {
    return this.usuarioActual() !== null
  },

  // Entrada: nada · Proceso: pide a Clerk el token de sesión (sin plantilla JWT: integración
  // nativa Third-party auth) · Salida: token o null si no hay sesión, mock o error de red.
  async obtenerToken(): Promise<string | null> {
    if (!CLERK_ACTIVO) return null
    try {
      return (await leerClerk()?.session?.getToken()) ?? null
    } catch {
      return null
    }
  },
}
