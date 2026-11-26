import type { FiltrosObjetos, Objeto } from '../types'

// Entrada: texto · Proceso: minúsculas y sin tildes · Salida: texto comparable.
export function normalizarTexto(texto: string): string {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()
}

// Entrada: lista de objetos y filtros · Proceso: aplica texto (nombre, lugar, descripción),
// categoría y estado · Salida: nueva lista con los objetos que cumplen todo.
export function filtrarObjetos(objetos: readonly Objeto[], filtros: FiltrosObjetos): Objeto[] {
  const buscado = normalizarTexto(filtros.texto)
  return objetos.filter((objeto) => {
    const textoObjeto = normalizarTexto(`${objeto.nombre} ${objeto.lugar} ${objeto.descripcion}`)
    const coincideTexto = buscado === '' || textoObjeto.includes(buscado)
    const coincideCategoria = filtros.categoria === 'Todas' || objeto.categoria === filtros.categoria
    const coincideEstado = filtros.estado === 'Todos' || objeto.estado === filtros.estado
    return coincideTexto && coincideCategoria && coincideEstado
  })
}

export const FILTROS_INICIALES: FiltrosObjetos = { texto: '', categoria: 'Todas', estado: 'Todos' }
