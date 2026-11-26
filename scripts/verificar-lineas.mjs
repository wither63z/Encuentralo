// Entrada: archivos dentro de src/ · Proceso: cuenta líneas de cada uno
// Salida: código 1 y lista de infractores si alguno supera el máximo.
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const MAXIMO_LINEAS = 150

function listarArchivos(carpeta) {
  return readdirSync(carpeta).flatMap((nombre) => {
    const ruta = join(carpeta, nombre)
    return statSync(ruta).isDirectory() ? listarArchivos(ruta) : [ruta]
  })
}

const infractores = listarArchivos('src')
  .map((ruta) => ({ ruta, lineas: readFileSync(ruta, 'utf8').split('\n').length }))
  .filter((archivo) => archivo.lineas > MAXIMO_LINEAS)

if (infractores.length > 0) {
  for (const { ruta, lineas } of infractores) console.error(`✗ ${ruta}: ${lineas} líneas`)
  console.error(`Máximo permitido: ${MAXIMO_LINEAS} líneas por archivo.`)
  process.exit(1)
}
console.log(`✓ Todos los archivos de src/ tienen ${MAXIMO_LINEAS} líneas o menos.`)
