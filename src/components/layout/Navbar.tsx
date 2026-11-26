import type { ReactNode } from 'react'
import { TEXTOS } from '../../config'
import type { Vista } from '../../types'

const LOGO = `${import.meta.env.BASE_URL}icono-encuentralo.png`

export interface NavbarProps {
  vistaActual: Vista
  onIr: (vista: Vista) => void
  /** Contenido extra a la derecha (por ejemplo, el botón de usuario de Clerk). */
  extra?: ReactNode
}

/** Vistas que pertenecen a la sección «Objetos»: el menú la marca activa en todas. */
const VISTAS_DE_OBJETOS: readonly Vista['tipo'][] = ['listado', 'detalle', 'reclamo', 'confirmacion']

// Entrada: vista actual y función para navegar · Proceso: marca la opción activa
// Salida: barra superior con logo y menú (Inicio, Objetos) y el extra opcional.
export function Navbar({ vistaActual, onIr, extra }: NavbarProps) {
  const opciones: { etiqueta: string; vista: Vista }[] = [
    { etiqueta: TEXTOS.menu.inicio, vista: { tipo: 'inicio' } },
    { etiqueta: TEXTOS.menu.listado, vista: { tipo: 'listado' } },
  ]
  return (
    <header className="border-b border-borde bg-superficie">
      <nav className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-4 py-2" aria-label="Menú principal">
        <button type="button" onClick={() => onIr({ tipo: 'inicio' })} className="flex min-h-11 items-center gap-2 font-bold text-marca">
          <img src={LOGO} alt="" width={36} height={36} className="size-9 rounded-lg" />
          {TEXTOS.app.nombre}
        </button>
        <ul className="ml-auto flex gap-1">
          {opciones.map(({ etiqueta, vista }) => {
            const activa = vista.tipo === vistaActual.tipo
              || (vista.tipo === 'listado' && VISTAS_DE_OBJETOS.includes(vistaActual.tipo))
            return (
              <li key={etiqueta}>
                <button type="button" aria-current={activa ? 'page' : undefined} onClick={() => onIr(vista)}
                  className={`min-h-11 rounded-lg px-3 font-semibold ${activa ? 'bg-marca-suave text-marca' : 'text-texto-suave'}`}>
                  {etiqueta}
                </button>
              </li>
            )
          })}
        </ul>
        {extra}
      </nav>
    </header>
  )
}
