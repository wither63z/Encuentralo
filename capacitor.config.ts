import type { CapacitorConfig } from '@capacitor/cli'

// Empaquetado Android (APK) con Capacitor: envuelve la app web ya compilada en dist/.
const configuracion: CapacitorConfig = {
  appId: 'ec.tecnicosalesiano.encuentralo',
  appName: 'Encuéntralo',
  webDir: 'dist',
}

export default configuracion
