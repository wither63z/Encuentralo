import type { Objeto } from '../types'
import { OBJETOS_EXTRA } from './objetosExtra'
import { OBJETOS_OFICIALES } from './objetosPrueba'

export { OBJETOS_EXTRA, OBJETOS_OFICIALES }

/** Los 10 oficiales del enunciado + 15 extras ficticios (ids 11–25), declarados en la Ficha. */
export const OBJETOS_PRUEBA: readonly Objeto[] = [...OBJETOS_OFICIALES, ...OBJETOS_EXTRA]
