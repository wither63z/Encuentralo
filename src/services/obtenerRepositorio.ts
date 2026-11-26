import { USAR_MOCK } from '../config'
import type { RepositorioObjetos } from './RepositorioObjetos'
import { repositorioMock } from './repositorioMock'
import { repositorioSupabase } from './repositorioSupabase'

/** true cuando Supabase falló (sin internet o caído) y la app pasó al modo demo offline. */
let enModoRespaldo = false

// Entrada: nada · Proceso: indica si se está usando el respaldo offline · Salida: true/false.
export function usandoRespaldo(): boolean {
  return enModoRespaldo
}

// Entrada: una operación de lectura · Proceso: la intenta en Supabase y, si falla por red,
// cambia al mock para el resto de la sesión · Salida: el resultado de Supabase o del mock.
async function conRespaldo<T>(operacion: (repo: RepositorioObjetos) => Promise<T>): Promise<T> {
  if (enModoRespaldo) return operacion(repositorioMock)
  try {
    return await operacion(repositorioSupabase)
  } catch {
    enModoRespaldo = true
    return operacion(repositorioMock)
  }
}

// Supabase con red de seguridad: si no hay internet, la demo sigue funcionando offline.
const repositorioResiliente: RepositorioObjetos = {
  listar: () => conRespaldo((r) => r.listar()),
  obtener: (id) => conRespaldo((r) => r.obtener(id)),
  crearReclamo: (id, datos) => (enModoRespaldo ? repositorioMock : repositorioSupabase).crearReclamo(id, datos),
  marcarEntregado: (id) => (enModoRespaldo ? repositorioMock : repositorioSupabase).marcarEntregado(id),
  reportarObjeto: (datos) => (enModoRespaldo ? repositorioMock : repositorioSupabase).reportarObjeto(datos),
}

// Entrada: VITE_USE_MOCK · Proceso: Factory que elige el adapter
// Salida: mock (por defecto) o Supabase con respaldo offline automático.
export function obtenerRepositorio(): RepositorioObjetos {
  return USAR_MOCK ? repositorioMock : repositorioResiliente
}
