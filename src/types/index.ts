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
  /** Foto del objeto: URL pública (Supabase) o data URL JPEG comprimida (modo demo). */
  foto?: string
}

/** Datos del formulario «Reportar objeto encontrado». */
export interface DatosNuevoObjeto {
  nombre: string
  categoria: Categoria | ''
  lugar: string
  fecha: string
  descripcion: string
  foto?: string
}

export type ErroresNuevoObjeto = Partial<Record<keyof DatosNuevoObjeto, string>>

export interface ResultadoReporte {
  ok: boolean
  id?: number
  mensaje?: string
  errores?: ErroresNuevoObjeto
}

export interface DatosReclamo {
  nombre: string
  curso: string
  sena: string
}

/** Reclamo guardado: lo ve el profesor en el Modo inspector para verificar al dueño. */
export interface ReclamoRegistrado {
  objetoId: number
  nombre: string
  curso: string
  sena: string
  creadoEn?: string
}

export type ErroresReclamo = Partial<Record<keyof DatosReclamo, string>>

export interface ResultadoReclamo {
  ok: boolean
  mensaje?: string
  /** Errores por campo cuando la validación falla (no se envía nada al repositorio). */
  errores?: ErroresReclamo
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
  | { tipo: 'reportar' }

export interface Usuario {
  id: string
  nombre: string
}
