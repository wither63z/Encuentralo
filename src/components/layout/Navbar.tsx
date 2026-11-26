import { Search } from 'lucide-react'
import { CLERK_ACTIVO, TEXTOS } from '../../config'
import type { Vista } from '../../types'

export interface NavbarProps {
  vistaActual: Vista
  onIr: (vista: Vista) => void
}

/** Vistas que pertenecen a la sección «Objetos»: el menú la marca activa en todas. */
const VISTAS_DE_OBJETOS: readonly Vista['tipo'][] = ['listado', 'detalle', 'reclamo', 'confirmacion']

// Entrada: vista actual y función para navegar · Proceso: marca la opción activa
// Salida: barra superior con logo y menú (Inicio, Objetos e Ingresar si hay login).
export function Navbar({ vistaActual, onIr }: NavbarProps) {
  const opciones: { etiqueta: string; vista: Vista }[] = [
    { etiqueta: TEXTOS.menu.inicio, vista: { tipo: 'inicio' } },
    { etiqueta: TEXTOS.menu.listado, vista: { tipo: 'listado' } },
    ...(CLERK_ACTIVO ? [{ etiqueta: TEXTOS.menu.ingresar, vista: { tipo: 'login' } as Vista }] : []),
  ]
  return (
    <header className="border-b border-borde bg-superficie">
      <nav className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-4 py-2" aria-label="Menú principal">
        <button type="button" onClick={() => onIr({ tipo: 'inicio' })} className="flex min-h-11 items-center gap-2 font-bold text-marca">
          <span className="grid size-9 place-items-center rounded-lg bg-marca text-alerta"><Search size={20} aria-hidden="true" /></span>
          {TEXTOS.app.nombre}
        </button>
        <ul className="flex gap-1">
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
      </nav>
    </header>
  )
}
