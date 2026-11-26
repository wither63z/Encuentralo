import { CLERK_ACTIVO } from '../config'
import type { Usuario } from '../types'

const USUARIO_DEMO: Usuario = { id: 'demo', nombre: 'Estudiante de prueba' }

interface ClerkGlobal {
  user?: { id: string; fullName: string | null } | null
}

// Lee la sesión que Clerk expone en window (solo si Clerk está activo).
function leerClerk(): ClerkGlobal | undefined {
  return (window as unknown as { Clerk?: ClerkGlobal }).Clerk
}

export const servicioAuth = {
  // Entrada: nada · Proceso: con mock devuelve un usuario ficticio; con Clerk lee la sesión
  // Salida: usuario actual o null.
  usuarioActual(): Usuario | null {
    if (!CLERK_ACTIVO) return USUARIO_DEMO
    const usuario = leerClerk()?.user
    return usuario ? { id: usuario.id, nombre: usuario.fullName ?? '' } : null
  },

  // Entrada: nada · Proceso: revisa si hay usuario · Salida: true si puede reclamar.
  estaAutenticado(): boolean {
    return this.usuarioActual() !== null
  },
}
