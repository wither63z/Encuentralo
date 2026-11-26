import { MIN_CARACTERES_SENA } from './constantes'

// Todo texto visible en pantalla vive aquí. Cambiar un texto = tocar solo este archivo.
export const TEXTOS = {
  app: {
    nombre: 'Encuéntralo',
    lema: 'Objetos perdidos · Técnico Salesiano',
    explicacion:
      'Busca entre los objetos encontrados en el colegio. Si alguno es tuyo, ábrelo y regístralo como reclamo.',
  },
  menu: { inicio: 'Inicio', listado: 'Objetos', ingresar: 'Ingresar' },
  acciones: {
    verObjetos: 'Ver objetos',
    reclamar: 'Reclamar este objeto',
    enviar: 'Enviar reclamo',
    enviando: 'Enviando…',
    cancelar: 'Cancelar',
    volverListado: 'Volver al listado',
    volver: 'Volver',
    reintentar: 'Reintentar',
    limpiarFiltros: 'Limpiar búsqueda',
  },
  listado: {
    titulo: 'Objetos encontrados',
    buscar: 'Buscar por nombre, lugar o descripción',
    categoria: 'Categoría',
    estado: 'Estado',
    todas: 'Todas',
    todos: 'Todos',
    sinResultados: 'No encontramos objetos con esa búsqueda. Prueba con otra palabra o quita los filtros.',
    vacio: 'Todavía no hay objetos registrados.',
  },
  detalle: {
    lugar: 'Lugar',
    fecha: 'Fecha del hallazgo',
    categoria: 'Categoría',
    descripcion: 'Descripción',
    noEncontrado: 'No encontramos este objeto.',
    razonReclamado: 'Este objeto ya fue reclamado.',
    razonEntregado: 'Este objeto ya fue entregado a su dueño.',
  },
  reclamo: {
    titulo: 'Reclamar objeto',
    intro: 'Completa tus datos. Los tres campos son obligatorios.',
    nombre: 'Nombre completo',
    curso: 'Curso',
    sena: 'Seña particular del objeto',
    ayudaSena: `Describe algo que solo el dueño sabría (mínimo ${MIN_CARACTERES_SENA} caracteres).`,
  },
  validacion: {
    nombreVacio: 'Escribe tu nombre.',
    cursoVacio: 'Escribe tu curso, por ejemplo "2do BGU A".',
    senaVacia: 'Describe una seña particular del objeto.',
    senaCorta: (lleva: number) =>
      `La seña debe tener al menos ${MIN_CARACTERES_SENA} caracteres; llevas ${lleva}.`,
  },
  confirmacion: {
    tituloExito: '¡Reclamo registrado!',
    textoExito: 'El objeto ahora aparece como Reclamado. Acércate a inspección para retirarlo.',
    tituloError: 'No pudimos registrar el reclamo',
    textoError: 'Revisa la información e inténtalo de nuevo.',
  },
  errores: {
    cargar: 'No pudimos cargar los objetos. Revisa tu conexión e inténtalo otra vez.',
    noDisponible: 'Este objeto ya no está disponible para reclamar.',
    noExiste: 'Este objeto no existe.',
    enviar: 'No pudimos enviar el reclamo. Inténtalo otra vez.',
  },
  login: {
    titulo: 'Ingresa para reclamar',
    sinLogin: 'El ingreso no está activo en esta demostración; puedes reclamar directamente.',
  },
  cargando: 'Cargando…',
} as const
