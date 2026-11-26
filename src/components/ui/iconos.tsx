// Entrada: nada · Proceso: adapta Phosphor Icons (estilo Duotone, bicolor) con los nombres que ya
// usaba la app · Salida: íconos listos para usar con className y aria-hidden.
// Fuente: https://phosphoricons.com/ (@phosphor-icons/react 2.x, sufijo «Icon»).
import {
  ArrowLeftIcon, BarbellIcon, CameraIcon, CheckCircleIcon, CircleNotchIcon, ClockIcon, EyeIcon,
  HandHeartIcon, InfoIcon, LaptopIcon, MagnifyingGlassIcon, MagnifyingGlassMinusIcon, PackageIcon,
  PencilRulerIcon, PlusIcon, SealCheckIcon, SparkleIcon, TShirtIcon, WarningCircleIcon, XCircleIcon, XIcon,
  type Icon, type IconProps,
} from '@phosphor-icons/react'
import type { ComponentType } from 'react'

export type Icono = ComponentType<IconProps>

// Entrada: un ícono de Phosphor · Proceso: le pone peso duotone por defecto · Salida: componente.
function duotono(Base: Icon): Icono {
  const Envuelto = (props: IconProps) => <Base weight="duotone" {...props} />
  Envuelto.displayName = Base.displayName
  return Envuelto
}

export const AlertCircle = duotono(WarningCircleIcon)
export const ArrowLeft = duotono(ArrowLeftIcon)
export const Box = duotono(PackageIcon)
export const Camera = duotono(CameraIcon)
export const CircleCheck = duotono(CheckCircleIcon)
export const CircleX = duotono(XCircleIcon)
export const Clock = duotono(ClockIcon)
export const Dumbbell = duotono(BarbellIcon)
export const Eye = duotono(EyeIcon)
export const HandHeart = duotono(HandHeartIcon)
export const Info = duotono(InfoIcon)
export const Laptop = duotono(LaptopIcon)
export const Loader2 = duotono(CircleNotchIcon)
export const PackageCheck = duotono(SealCheckIcon)
export const PencilRuler = duotono(PencilRulerIcon)
export const Plus = duotono(PlusIcon)
export const Search = duotono(MagnifyingGlassIcon)
export const SearchX = duotono(MagnifyingGlassMinusIcon)
export const Shirt = duotono(TShirtIcon)
export const Sparkles = duotono(SparkleIcon)
export const X = duotono(XIcon)
