import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let cliente: SupabaseClient | null = null

// Entrada: variables VITE_SUPABASE_URL y VITE_SUPABASE_PUBLISHABLE_KEY (clave publicable)
// Proceso: crea el cliente una sola vez · Salida: cliente o error claro si faltan variables.
export function obtenerClienteSupabase(): SupabaseClient {
  if (cliente) return cliente
  const url = import.meta.env.VITE_SUPABASE_URL
  const clave = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
  if (!url || !clave) throw new Error('Faltan VITE_SUPABASE_URL o VITE_SUPABASE_PUBLISHABLE_KEY en .env')
  cliente = createClient(url, clave)
  return cliente
}
