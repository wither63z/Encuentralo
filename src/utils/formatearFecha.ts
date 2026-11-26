const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
] as const

const MESES_CORTOS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'] as const

// Entrada: fecha "YYYY-MM-DD" · Proceso: igual que formatearFecha pero con mes abreviado
// Salida: "18 nov 2026" (para tarjetas, como en el Whimsical).
export function formatearFechaCorta(iso: string): string {
  const [anio, mes, dia] = iso.split('-').map(Number)
  const nombreMes = mes === undefined ? undefined : MESES_CORTOS[mes - 1]
  if (anio === undefined || dia === undefined || nombreMes === undefined || Number.isNaN(dia)) return iso
  return `${dia} ${nombreMes} ${anio}`
}

// Entrada: fecha "YYYY-MM-DD" · Proceso: separa partes sin usar zona horaria
// Salida: "18 de noviembre de 2026" (o el texto original si el formato es inválido).
export function formatearFecha(iso: string): string {
  const [anio, mes, dia] = iso.split('-').map(Number)
  const nombreMes = mes === undefined ? undefined : MESES[mes - 1]
  if (anio === undefined || dia === undefined || nombreMes === undefined || Number.isNaN(dia)) {
    return iso
  }
  return `${dia} de ${nombreMes} de ${anio}`
}
