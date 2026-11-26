import type { Categoria, Estado } from '../types'

export const CATEGORIAS: readonly Categoria[] = ['Ropa', 'Útiles', 'Tecnología', 'Deportes', 'Otros']

export const ESTADOS: readonly Estado[] = ['Disponible', 'Reclamado', 'Entregado']

/** Regla 4 del enunciado: la seña particular debe tener al menos este número de caracteres. */
export const MIN_CARACTERES_SENA = 10

/** Límites máximos (iguales a los checks de supabase/schema.sql) para evitar textos abusivos. */
export const MAX_CARACTERES = { nombre: 80, curso: 40, sena: 300 } as const

/** Latencia simulada del repositorio mock (ms), para ver estados de carga. */
export const LATENCIA_MOCK_MS = 300

/** true: el modo demo conserva los reclamos al recargar (opcional "para destacar"); false: cada recarga reinicia los datos. */
export const CONSERVAR_DATOS_DEMO = true

/** Clave de localStorage donde el mock conserva los datos entre recargas (subir la versión si cambia el formato). */
export const CLAVE_ALMACEN = 'encuentralo-datos-v2'

/** true por defecto: la app funciona sin Supabase ni Clerk. */
export const USAR_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

export const CLAVE_CLERK = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ?? ''

/** Clerk se activa solo con una clave publicable válida en .env (independiente del modo de datos). */
export const CLERK_ACTIVO = CLAVE_CLERK.startsWith('pk_')

/** Ruta a la que Clerk regresa tras cerrar sesión (la app no usa router). */
export const CLERK_URL_TRAS_SALIR = '/'

/** Máximo de reclamos por cuenta de Clerk; debe coincidir con supabase/02_clerk.sql. */
export const MAX_RECLAMOS_POR_USUARIO = 3
