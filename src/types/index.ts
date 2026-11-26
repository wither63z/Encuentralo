// Contrato de tipos del proyecto. NO renombrar: todo el equipo depende de estos nombres.

export type Estado = 'Disponible' | 'Reclamado' | 'Entregado'

export type Categoria = 'Ropa' | 'Útiles' | 'Tecnología' | 'Deportes' | 'Otros'

export interface Objeto {
  id: number
  nombre: string
  categoria: Categoria
  lugar: string
  /** Fecha del hallazgo en formato YYYY-MM-DD */
  fecha: string
  estado: Estado
  descripcion: string
}

export interface DatosReclamo {
  nombre: string
  curso: string
  sena: string
}

export type ErroresReclamo = Partial<Record<keyof DatosReclamo, string>>

export interface ResultadoReclamo {
  ok: boolean
  mensaje?: string
}

export interface FiltrosObjetos {
  texto: string
  categoria: Categoria | 'Todas'
  estado: Estado | 'Todos'
}

export type Vista =
  | { tipo: 'inicio' }
  | { tipo: 'login' }
  | { tipo: 'listado' }
  | { tipo: 'detalle'; id: number }
  | { tipo: 'reclamo'; id: number }
  | { tipo: 'confirmacion'; resultado: 'exito' | 'error' }
  | { tipo: 'inspector' }
  | { tipo: 'coincidencias' }

export interface Usuario {
  id: string
  nombre: string
}
