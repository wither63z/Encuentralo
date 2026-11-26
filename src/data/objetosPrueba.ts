import type { Objeto } from '../types'

// Datos de prueba OFICIALES del enunciado (ids 1–10), cargados tal cual.
// Gabriel: añadir extras ficticios desde el id 11 en objetosExtra.ts y marcarlos en la Ficha.
export const OBJETOS_OFICIALES: readonly Objeto[] = [
  { id: 1, nombre: 'Chompa azul con capucha', categoria: 'Ropa', lugar: 'Cancha de básquet', fecha: '2026-11-18', estado: 'Disponible', descripcion: 'Talla M con cierre plateado' },
  { id: 2, nombre: 'Cartuchera roja', categoria: 'Útiles', lugar: 'Aula 2do BGU A', fecha: '2026-11-19', estado: 'Disponible', descripcion: 'Contiene esferos y un borrador' },
  { id: 3, nombre: 'Calculadora científica', categoria: 'Tecnología', lugar: 'Laboratorio de Física', fecha: '2026-11-19', estado: 'Reclamado', descripcion: 'Color negro con tapa deslizable' },
  { id: 4, nombre: 'Termo metálico', categoria: 'Otros', lugar: 'Bar del colegio', fecha: '2026-11-20', estado: 'Disponible', descripcion: 'Color verde de 500 ml' },
  { id: 5, nombre: 'Balón de fútbol', categoria: 'Deportes', lugar: 'Cancha principal', fecha: '2026-11-20', estado: 'Entregado', descripcion: 'Número 5 con franjas amarillas' },
  { id: 6, nombre: 'Audífonos inalámbricos', categoria: 'Tecnología', lugar: 'Biblioteca', fecha: '2026-11-23', estado: 'Disponible', descripcion: 'Estuche blanco de carga' },
  { id: 7, nombre: 'Cuaderno universitario', categoria: 'Útiles', lugar: 'Aula 1ro BGU B', fecha: '2026-11-23', estado: 'Disponible', descripcion: 'Cien hojas de cuadros con forro verde' },
  { id: 8, nombre: 'Gorra negra', categoria: 'Ropa', lugar: 'Patio central', fecha: '2026-11-24', estado: 'Reclamado', descripcion: 'Visera plana con logotipo bordado' },
  { id: 9, nombre: 'Llaves con llavero', categoria: 'Otros', lugar: 'Entrada principal', fecha: '2026-11-24', estado: 'Disponible', descripcion: 'Tres llaves y un llavero de madera' },
  { id: 10, nombre: 'Flauta dulce', categoria: 'Otros', lugar: 'Sala de música', fecha: '2026-11-24', estado: 'Disponible', descripcion: 'Color crema con funda de tela' },
]
