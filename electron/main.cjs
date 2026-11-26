// Entrada: dist/ (app web compilada) · Proceso: abre una ventana de escritorio que carga
// dist/index.html, sin integración con Node (más seguro) · Salida: Encuéntralo como .exe.
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
  void ventana.loadFile(path.join(__dirname, '..', 'dist', 'index.html'))
}

app.whenReady().then(crearVentana)
app.on('window-all-closed', () => app.quit())
