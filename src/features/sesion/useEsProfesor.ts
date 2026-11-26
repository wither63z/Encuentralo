import { useUser } from '@clerk/react'
import { CLERK_ACTIVO, ROL_PROFESOR, USAR_MOCK } from '../../config'

// Entrada: nada · Proceso: con Clerk lee publicMetadata.rol de forma reactiva (se actualiza al
// iniciar sesión); sin Clerk solo el modo mock local lo permite · Salida: true si es profesor.
// CLERK_ACTIVO es constante en cada compilación, así que el orden de hooks no cambia.
export function useEsProfesor(): boolean {
  if (!CLERK_ACTIVO) return USAR_MOCK
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { user } = useUser()
  return user?.publicMetadata?.rol === ROL_PROFESOR
}
