// Entrada: dist/ (app web compilada) o ENCUENTRALO_URL (servidor Vite en vivo) · Proceso: abre una
// ventana sin integración con Node (más seguro) · Salida: Encuéntralo como .exe o en modo vivo.
const { app, BrowserWindow, shell } = require('electron')
const path = require('node:path')

function crearVentana() {
  const ventana = new BrowserWindow({
    width: 1100,
    height: 760,
    minWidth: 360,
    minHeight: 600,
    title: 'Encuéntralo',
    backgroundColor: '#F8FAFC',
    autoHideMenuBar: true,
    webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true },
  })
  // Los enlaces externos se abren en el navegador del sistema, no dentro de la app.
  ventana.webContents.setWindowOpenHandler(({ url }) => {
    void shell.openExternal(url)
    return { action: 'deny' }
  })
  // Modo vivo (npm run escritorio:vivo): carga el servidor de Vite con recarga en caliente.
  // Solo sin empaquetar: el .exe final ignora la variable y siempre abre dist/ (offline).
  const urlEnVivo = app.isPackaged ? undefined : process.env.ENCUENTRALO_URL
  if (urlEnVivo) void ventana.loadURL(urlEnVivo)
  else void ventana.loadFile(path.join(__dirname, '..', 'dist', 'index.html'))
}

app.whenReady().then(crearVentana)
app.on('window-all-closed', () => app.quit())
