import type { DatosReclamo, Objeto, ResultadoReclamo } from '../types'

// Contrato del repositorio (patrón Repository). Hooks y páginas dependen de esta
// interfaz, nunca de un adapter concreto (mock o Supabase).
export interface RepositorioObjetos {
  listar(): Promise<Objeto[]>
  obtener(id: number): Promise<Objeto | null>
  crearReclamo(objetoId: number, datos: DatosReclamo): Promise<ResultadoReclamo>
}
