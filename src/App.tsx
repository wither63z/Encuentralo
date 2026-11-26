import { useState } from 'react'
import { Navbar } from './components'
import { useNavegacion } from './hooks'
import {
  PaginaConfirmacion, PaginaDetalle, PaginaInicio, PaginaListado, PaginaLogin, PaginaReclamo,
} from './pages'
import { servicioAuth } from './services'
import type { ResultadoReclamo, Vista } from './types'

// Entrada: nada · Proceso: única fuente de verdad de la navegación; elige la página según Vista
// Salida: layout con Navbar y la vista actual.
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
    }
  }
}
