import type { CapacitorConfig } from '@capacitor/cli'

// Empaquetado Android (APK) con Capacitor: envuelve la app web ya compilada en dist/ (offline).
// Modo vivo opcional: si CAP_SERVER_URL existe (p. ej. http://192.168.1.20:5173), la APK carga el
// servidor de Vite del PC por WiFi con recarga en caliente. Ver README → "Cambios rápidos en la defensa".
const urlEnVivo = process.env.CAP_SERVER_URL

const configuracion: CapacitorConfig = {
  appId: 'ec.tecnicosalesiano.encuentralo',
  appName: 'Encuéntralo',
  webDir: 'dist',
  ...(urlEnVivo ? { server: { url: urlEnVivo, cleartext: true } } : {}),
}

export default configuracion
