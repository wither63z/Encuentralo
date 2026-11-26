const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
] as const

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
