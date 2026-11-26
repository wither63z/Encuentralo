import type {
  DatosNuevoObjeto, DatosReclamo, Objeto, ReclamoRegistrado, ResultadoReclamo, ResultadoReporte,
} from '../types'

// Contrato del repositorio (patrón Repository). Hooks y páginas dependen de esta
// interfaz, nunca de un adapter concreto (mock o Supabase).
export interface RepositorioObjetos {
  listar(): Promise<Objeto[]>
  obtener(id: number): Promise<Objeto | null>
  crearReclamo(objetoId: number, datos: DatosReclamo): Promise<ResultadoReclamo>
  /** Inspector: solo pasa Reclamado → Entregado; en otro caso { ok:false, mensaje }. */
  marcarEntregado(objetoId: number): Promise<ResultadoReclamo>
  /** Inspector (solo profesores): reclamos con nombre, curso y seña para verificar al dueño. */
  listarReclamos(): Promise<ReclamoRegistrado[]>
  /** Registra un objeto encontrado (estado Disponible), con foto opcional. */
  reportarObjeto(datos: DatosNuevoObjeto): Promise<ResultadoReporte>
}
