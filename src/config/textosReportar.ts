import { FOTO, LIMITES_REPORTE } from './constantes'

// Textos de «Reportar objeto encontrado» (se exponen como TEXTOS.reportar).
export const TEXTOS_REPORTAR = {
  titulo: 'Reportar un objeto encontrado',
  botonFlotante: 'Reportar objeto',
  intro: 'Registra lo que encontraste para que su dueño lo pueda ubicar. Fotografía solo el objeto, nunca a personas.',
  nombre: 'Qué objeto es',
  categoria: 'Categoría',
  elegirCategoria: 'Elige una categoría',
  lugar: 'Dónde lo encontraste',
  fecha: 'Fecha del hallazgo',
  descripcion: 'Descripción visible (color, tamaño, marca)',
  foto: 'Foto del objeto (opcional)',
  ayudaFoto: `Se reduce a ${FOTO.maxLado} px para que ocupe poco espacio.`,
  elegirFoto: 'Tomar o elegir foto',
  quitarFoto: 'Quitar foto',
  procesandoFoto: 'Preparando la foto…',
  altVistaPrevia: 'Vista previa de la foto del objeto',
  enviar: 'Registrar objeto',
  enviando: 'Registrando…',
  errores: {
    nombre: `Escribe qué objeto es (entre ${LIMITES_REPORTE.nombre.min} y ${LIMITES_REPORTE.nombre.max} caracteres).`,
    categoria: 'Elige una categoría.',
    lugar: `Escribe dónde lo encontraste (entre ${LIMITES_REPORTE.lugar.min} y ${LIMITES_REPORTE.lugar.max} caracteres).`,
    fecha: 'Elige una fecha válida que no sea futura.',
    descripcion: `Describe el objeto (entre ${LIMITES_REPORTE.descripcion.min} y ${LIMITES_REPORTE.descripcion.max} caracteres).`,
    foto: 'La foto no es válida. Usa una imagen JPG, PNG o WebP.',
    fotoNoGuardada: 'El objeto se registró, pero la foto no cabe en el almacenamiento del dispositivo.',
    enviar: 'No pudimos registrar el objeto. Inténtalo otra vez.',
  },
} as const
