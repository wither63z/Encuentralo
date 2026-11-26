import { FOTO } from '../config'

// Entrada: archivo de imagen elegido o tomado con la cámara · Proceso: lo dibuja en un canvas
// reducido (lado máximo FOTO.maxLado) y lo exporta como JPEG · Salida: data URL liviano.
// Así una foto de celular de 4 MB queda en ~60–120 KB y se guarda rápido en el dispositivo.
export async function comprimirFoto(archivo: File): Promise<string> {
  if (!archivo.type.startsWith('image/')) throw new Error('El archivo no es una imagen')
  const imagen = await createImageBitmap(archivo)
  const escala = Math.min(1, FOTO.maxLado / Math.max(imagen.width, imagen.height))
  const lienzo = document.createElement('canvas')
  lienzo.width = Math.round(imagen.width * escala)
  lienzo.height = Math.round(imagen.height * escala)
  const contexto = lienzo.getContext('2d')
  if (!contexto) throw new Error('No se pudo procesar la imagen')
  contexto.drawImage(imagen, 0, 0, lienzo.width, lienzo.height)
  imagen.close()
  return lienzo.toDataURL('image/jpeg', FOTO.calidad)
}

// Entrada: data URL · Proceso: lo convierte a bytes para subirlo a Supabase Storage
// Salida: Blob JPEG.
export function dataUrlABlob(dataUrl: string): Blob {
  const [cabecera = '', base64 = ''] = dataUrl.split(',')
  const tipo = /data:(.*?);/.exec(cabecera)?.[1] ?? 'image/jpeg'
  const binario = atob(base64)
  const bytes = new Uint8Array(binario.length)
  for (let i = 0; i < binario.length; i += 1) bytes[i] = binario.charCodeAt(i)
  return new Blob([bytes], { type: tipo })
}
