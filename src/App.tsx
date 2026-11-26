import { useState } from 'react'
import { Boton, Navbar } from './components'
import { TEXTOS } from './config'
import { PaginaInspector } from './features'
import { useNavegacion } from './hooks'
import {
  PaginaConfirmacion, PaginaDetalle, PaginaInicio, PaginaListado, PaginaLogin, PaginaReclamo,
} from './pages'
import { servicioAuth } from './services'
import type { ResultadoReclamo, Vista } from './types'

// Entrada: nada · Proceso: única fuente de verdad de la navegación; elige la página según Vista
// Salida: layout con Navbar, la vista actual y un pie con acceso al modo inspector.
export default function App() {
  const { vista, irA, volver } = useNavegacion()
  const [mensajeResultado, setMensajeResultado] = useState<string | undefined>()

  function irAReclamo(id: number) {
    irA(servicioAuth.estaAutenticado() ? { tipo: 'reclamo', id } : { tipo: 'login' })
  }

  function mostrarResultado(resultado: ResultadoReclamo) {
    setMensajeResultado(resultado.mensaje)
    irA({ tipo: 'confirmacion', resultado: resultado.ok ? 'exito' : 'error' })
  }

  return (
    <div className="min-h-dvh bg-fondo text-texto">
      <Navbar vistaActual={vista} onIr={irA} />
      <main id="contenido-principal" tabIndex={-1} className="mx-auto max-w-5xl px-4 py-6 outline-none">
        {renderizarVista(vista)}
      </main>
      <footer aria-label={TEXTOS.pie.etiqueta} className="border-t border-borde bg-superficie">
        <div className="mx-auto flex max-w-5xl justify-center px-4 py-2">
          <Boton variante="texto" onClick={() => irA({ tipo: 'inspector' })}>{TEXTOS.pie.modoInspector}</Boton>
        </div>
      </footer>
    </div>
  )

  function renderizarVista(actual: Vista) {
    switch (actual.tipo) {
      case 'inicio':
        return <PaginaInicio onVerObjetos={() => irA({ tipo: 'listado' })} />
      case 'login':
        return <PaginaLogin onVolver={volver} />
      case 'listado':
        return <PaginaListado onAbrir={(id) => irA({ tipo: 'detalle', id })} />
      case 'detalle':
        return <PaginaDetalle id={actual.id} onReclamar={irAReclamo} onVolver={() => irA({ tipo: 'listado' })} />
      case 'reclamo':
        return <PaginaReclamo id={actual.id} onResultado={mostrarResultado} onCancelar={volver} />
      case 'confirmacion':
        return <PaginaConfirmacion resultado={actual.resultado} mensaje={mensajeResultado} onVolverListado={() => irA({ tipo: 'listado' })} />
      case 'inspector':
        return <PaginaInspector />
    }
  }
}
