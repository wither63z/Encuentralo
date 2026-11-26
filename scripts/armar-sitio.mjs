// Entrada: landing/ y el código de la app · Proceso: compila la app (npm run build) y arma sitio/ con la
// landing en la raíz y la app en sitio/app/ · Salida: carpeta sitio/ lista para Cloudflare o GitHub.
import { spawnSync } from 'node:child_process'
import { cpSync, existsSync, rmSync } from 'node:fs'

const SALTAR_BUILD = process.argv.includes('--sin-build')

// Entrada: nada · Proceso: ejecuta "npm run build" en esta terminal · Salida: dist/ actualizado.
function compilarApp() {
  const resultado = spawnSync('npm run build', { stdio: 'inherit', shell: true })
  if (resultado.status !== 0) {
    console.error('✗ Falló npm run build: no se armó sitio/.')
    process.exit(resultado.status ?? 1)
  }
}

if (!SALTAR_BUILD) compilarApp()
if (!existsSync('dist/index.html')) {
  console.error('✗ No existe dist/index.html. Ejecuta npm run build primero.')
  process.exit(1)
}

rmSync('sitio', { recursive: true, force: true })
cpSync('landing', 'sitio', { recursive: true })
cpSync('dist', 'sitio/app', { recursive: true })
console.log('✓ sitio/ listo: landing en / y la app en /app/.')
