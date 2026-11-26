import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { CLERK_ACTIVO } from '../config'
import { servicioAuth } from './servicioAuth'

let cliente: SupabaseClient | null = null

// Entrada: variables VITE_SUPABASE_URL y VITE_SUPABASE_PUBLISHABLE_KEY (clave PUBLICABLE)
// Proceso: crea el cliente una sola vez; si Clerk está activo, cada petición lleva el token de
// sesión de Clerk (opción accessToken) · Salida: cliente o error claro si faltan variables.
// Fuente: https://supabase.com/docs/guides/auth/third-party/clerk y
// https://supabase.com/blog/clerk-tpa-pricing (createClient(url, key, { accessToken })).
// Si accessToken devuelve null (visitante sin sesión), supabase-js usa la clave publicable y
// la petición va con rol anon. Con accessToken, supabase.auth.* queda deshabilitado (Clerk manda).
export function obtenerClienteSupabase(): SupabaseClient {
  if (cliente) return cliente
  const url = import.meta.env.VITE_SUPABASE_URL
  const clave = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
  if (!url || !clave) throw new Error('Faltan VITE_SUPABASE_URL o VITE_SUPABASE_PUBLISHABLE_KEY en .env')
  cliente = CLERK_ACTIVO
    ? createClient(url, clave, { accessToken: () => servicioAuth.obtenerToken() })
    : createClient(url, clave)
  return cliente
}
