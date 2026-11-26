import { USAR_MOCK } from '../config'
import type { RepositorioObjetos } from './RepositorioObjetos'
import { repositorioMock } from './repositorioMock'
import { repositorioSupabase } from './repositorioSupabase'

// Entrada: VITE_USE_MOCK · Proceso: Factory que elige el adapter
// Salida: repositorio mock (por defecto) o Supabase.
export function obtenerRepositorio(): RepositorioObjetos {
  return USAR_MOCK ? repositorioMock : repositorioSupabase
}
