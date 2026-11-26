import type { Categoria, Estado } from '../types'

export const CATEGORIAS: readonly Categoria[] = ['Ropa', 'Útiles', 'Tecnología', 'Deportes', 'Otros']

export const ESTADOS: readonly Estado[] = ['Disponible', 'Reclamado', 'Entregado']

/** Regla 4 del enunciado: la seña particular debe tener al menos este número de caracteres. */
export const MIN_CARACTERES_SENA = 10

/** Latencia simulada del repositorio mock (ms), para ver estados de carga. */
export const LATENCIA_MOCK_MS = 300

/** true por defecto: la app funciona sin Supabase ni Clerk. */
export const USAR_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

export const CLAVE_CLERK = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ?? ''

export const CLERK_ACTIVO = !USAR_MOCK && CLAVE_CLERK.length > 0
