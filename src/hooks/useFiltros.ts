import { useMemo, useState } from 'react'
import type { FiltrosObjetos, Objeto } from '../types'
import { FILTROS_INICIALES, filtrarObjetos } from '../utils'

// Entrada: lista completa · Proceso: guarda filtros y calcula el resultado
// Salida: { filtros, setFiltros, limpiar, resultado, sinResultados }.
export function useFiltros(objetos: readonly Objeto[]) {
  const [filtros, setFiltros] = useState<FiltrosObjetos>(FILTROS_INICIALES)
  const resultado = useMemo(() => filtrarObjetos(objetos, filtros), [objetos, filtros])
  const sinResultados = objetos.length > 0 && resultado.length === 0

  return { filtros, setFiltros, limpiar: () => setFiltros(FILTROS_INICIALES), resultado, sinResultados }
}
