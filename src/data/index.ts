import type { Objeto } from '../types'
import { OBJETOS_OFICIALES } from './objetosPrueba'

export { OBJETOS_OFICIALES }

/** Extras ficticios (id ≥ 11). Gabriel los completa hasta 25 y los declara en la Ficha. */
export const OBJETOS_EXTRA: readonly Objeto[] = []

export const OBJETOS_PRUEBA: readonly Objeto[] = [...OBJETOS_OFICIALES, ...OBJETOS_EXTRA]
