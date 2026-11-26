import { Box, Dumbbell, Laptop, PencilRuler, Shirt, type LucideIcon } from 'lucide-react'
import type { Categoria } from '../../types'

const ICONOS: Record<Categoria, LucideIcon> = {
  Ropa: Shirt,
  Útiles: PencilRuler,
  Tecnología: Laptop,
  Deportes: Dumbbell,
  Otros: Box,
}

// Entrada: categoría y tamaño · Proceso: elige el ícono · Salida: ícono decorativo.
export function CategoriaIcono({ categoria, tamano = 24 }: { categoria: Categoria; tamano?: number }) {
  const Icono = ICONOS[categoria]
  return <Icono size={tamano} aria-hidden="true" className="text-marca" />
}
