import type { Objeto } from '../types'

// Datos FICTICIOS adicionales (ids 11–25), creados por el equipo para probar búsqueda,
// filtros y la función «¿Qué perdiste?». No son parte del enunciado ni de personas reales.
export const OBJETOS_EXTRA: readonly Objeto[] = [
  { id: 11, nombre: 'Mochila gris', categoria: 'Útiles', lugar: 'Coliseo', fecha: '2026-11-17', estado: 'Disponible', descripcion: 'Dos compartimentos y un llavero de búho' },
  { id: 12, nombre: 'Casaca deportiva del colegio', categoria: 'Ropa', lugar: 'Vestidores', fecha: '2026-11-17', estado: 'Entregado', descripcion: 'Talla S con nombre borrado en la etiqueta' },
  { id: 13, nombre: 'Memoria USB de 32 GB', categoria: 'Tecnología', lugar: 'Laboratorio de Computación', fecha: '2026-11-18', estado: 'Disponible', descripcion: 'Color rojo con tapa y cordón negro' },
  { id: 14, nombre: 'Raqueta de tenis de mesa', categoria: 'Deportes', lugar: 'Sala de profesores', fecha: '2026-11-18', estado: 'Disponible', descripcion: 'Mango de madera con goma roja y negra' },
  { id: 15, nombre: 'Lonchera térmica', categoria: 'Otros', lugar: 'Bar del colegio', fecha: '2026-11-19', estado: 'Reclamado', descripcion: 'Color morado con cierre y asa larga' },
  { id: 16, nombre: 'Juego geométrico', categoria: 'Útiles', lugar: 'Aula 3ro BGU C', fecha: '2026-11-20', estado: 'Disponible', descripcion: 'Escuadras, regla y graduador transparentes' },
  { id: 17, nombre: 'Gafas de lectura', categoria: 'Otros', lugar: 'Biblioteca', fecha: '2026-11-20', estado: 'Disponible', descripcion: 'Marco café dentro de un estuche duro' },
  { id: 18, nombre: 'Cargador de celular', categoria: 'Tecnología', lugar: 'Aula 1ro BGU A', fecha: '2026-11-21', estado: 'Disponible', descripcion: 'Cable tipo C blanco con adaptador' },
  { id: 19, nombre: 'Canilleras de fútbol', categoria: 'Deportes', lugar: 'Cancha principal', fecha: '2026-11-21', estado: 'Disponible', descripcion: 'Par de canilleras negras con tobillera' },
  { id: 20, nombre: 'Bufanda tejida', categoria: 'Ropa', lugar: 'Capilla', fecha: '2026-11-21', estado: 'Disponible', descripcion: 'Rayas rojas y blancas con flecos' },
  { id: 21, nombre: 'Libro de Matemática', categoria: 'Útiles', lugar: 'Aula 2do BGU B', fecha: '2026-11-22', estado: 'Reclamado', descripcion: 'Forrado con papel kraft y etiqueta escrita' },
  { id: 22, nombre: 'Reloj de pulsera', categoria: 'Otros', lugar: 'Coliseo', fecha: '2026-11-22', estado: 'Disponible', descripcion: 'Correa de silicona negra y pantalla digital' },
  { id: 23, nombre: 'Cuerda para saltar', categoria: 'Deportes', lugar: 'Patio central', fecha: '2026-11-23', estado: 'Entregado', descripcion: 'Mangos naranjas con cuerda de plástico' },
  { id: 24, nombre: 'Mouse inalámbrico', categoria: 'Tecnología', lugar: 'Laboratorio de Computación', fecha: '2026-11-24', estado: 'Disponible', descripcion: 'Color plomo con receptor USB pequeño' },
  { id: 25, nombre: 'Sombrero de paja', categoria: 'Ropa', lugar: 'Entrada principal', fecha: '2026-11-25', estado: 'Disponible', descripcion: 'Ala ancha con cinta negra alrededor' },
]
