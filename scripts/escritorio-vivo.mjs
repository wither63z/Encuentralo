// Entrada: nada (usa vite y electron ya instalados en node_modules) · Proceso: levanta Vite en el
// puerto 5173, espera a que responda y abre Electron apuntando a él · Salida: app de escritorio con recarga en caliente.
// Puerto alternativo: ENCUENTRALO_PUERTO=5174 npm run escritorio:vivo
import { spawn, spawnSync } from 'node:child_process'
import { setTimeout as esperar } from 'node:timers/promises'

const PUERTO = Number(process.env.ENCUENTRALO_PUERTO ?? 5173)
const URL_VIVO = `http://localhost:${PUERTO}`
const ES_WINDOWS = process.platform === 'win32'
const procesos = []

// Entrada: comando completo · Proceso: lo lanza con la salida en esta terminal
// Salida: el proceso hijo (queda registrado para cerrarlo al final).
function lanzar(comando, entorno = process.env) {
  const hijo = spawn(comando, { stdio: 'inherit', env: entorno, shell: true })
  procesos.push(hijo)
  return hijo
}

// Entrada: nada · Proceso: intenta una petición a la URL de Vite · Salida: true si alguien responde.
async function respondePuerto() {
  try {
    return (await fetch(URL_VIVO)).ok
  } catch {
    return false
  }
}

// Entrada: proceso de Vite · Proceso: consulta la URL cada 300 ms hasta 30 s, mientras Vite siga vivo
// Salida: true si respondió, false si Vite terminó o se agotó el tiempo.
async function esperarVite(vite) {
  for (let intento = 0; intento < 100 && vite.exitCode === null; intento += 1) {
    if (await respondePuerto()) return vite.exitCode === null
    await esperar(300)
  }
  return false
}

// Entrada: código de salida · Proceso: termina Vite y Electron (en Windows, todo el árbol con taskkill)
// Salida: fin del script sin dejar el puerto ocupado.
function cerrarTodo(codigo = 0) {
  for (const hijo of procesos) {
    if (hijo.exitCode !== null || hijo.pid === undefined) continue
    if (ES_WINDOWS) spawnSync('taskkill', ['/pid', String(hijo.pid), '/T', '/F'], { stdio: 'ignore' })
    else hijo.kill()
  }
  process.exit(codigo)
}

process.on('SIGINT', () => cerrarTodo(0))
process.on('SIGTERM', () => cerrarTodo(0))

// Si otro servidor ya usa el puerto, no se abre Electron contra él (podría ser otra app).
if (await respondePuerto()) {
  console.error(`✗ El puerto ${PUERTO} ya está ocupado. Cierra ese servidor o usa ENCUENTRALO_PUERTO=5174.`)
  process.exit(1)
}

const vite = lanzar(`npx vite --port ${PUERTO} --strictPort`)
vite.on('exit', (codigo) => cerrarTodo(codigo ?? 0))

if (!(await esperarVite(vite))) {
  console.error(`✗ Vite no respondió en ${URL_VIVO}.`)
  cerrarTodo(1)
}
console.log(`✓ Vite listo en ${URL_VIVO}. Abriendo Electron en modo vivo (Ctrl+C para cerrar)…`)
const electron = lanzar('npx electron .', { ...process.env, ENCUENTRALO_URL: URL_VIVO })
electron.on('exit', () => cerrarTodo(0))
