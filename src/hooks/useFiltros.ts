import { useMemo, useState } from 'react'
import type { FiltrosObjetos, Objeto } from '../types'
import { FILTROS_INICIALES, filtrarObjetos } from '../utils'

// Últimos filtros usados: se conservan al ir al Detalle y volver al Listado (sesión actual).
let ultimosFiltros: FiltrosObjetos = FILTROS_INICIALES

// Entrada: lista completa · Proceso: guarda filtros (recordando los últimos) y calcula el resultado
// Salida: { filtros, setFiltros, limpiar, resultado, sinResultados }.
export function useFiltros(objetos: readonly Objeto[]) {
  const [filtros, setFiltrosEstado] = useState<FiltrosObjetos>(ultimosFiltros)
  const resultado = useMemo(() => filtrarObjetos(objetos, filtros), [objetos, filtros])
  const sinResultados = objetos.length > 0 && resultado.length === 0

  function setFiltros(nuevos: FiltrosObjetos) {
    ultimosFiltros = nuevos
    setFiltrosEstado(nuevos)
  }

  return { filtros, setFiltros, limpiar: () => setFiltros(FILTROS_INICIALES), resultado, sinResultados }
}
