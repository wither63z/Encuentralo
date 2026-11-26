// Verificador de seguridad de Supabase para Encuéntralo (Node puro + @supabase/supabase-js).
// Uso: npm run verificar:supabase  [-- --escribir]
// Entrada: VITE_SUPABASE_URL y VITE_SUPABASE_PUBLISHABLE_KEY (de .env si existe; NUNCA se imprimen)
// Proceso: prueba RLS y la función reclamar_objeto con la clave PUBLICABLE (rol anon)
// Salida: una línea OK/FALLA por prueba y código 1 si alguna falla.
import { createClient } from '@supabase/supabase-js'

const url = process.env.VITE_SUPABASE_URL ?? ''
const clave = process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? ''
const ESCRIBIR = process.argv.includes('--escribir')
const IDS_OFICIALES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const SIN_PERMISO = '42501' // Variante B de 02_clerk.sql: anon no puede ejecutar la función.

if (!url || !clave || url.includes('TU-PROYECTO') || clave.includes('TU-CLAVE') || clave.startsWith('tu-')) {
  console.error('✗ Faltan VITE_SUPABASE_URL o VITE_SUPABASE_PUBLISHABLE_KEY reales en .env.')
  console.error('  Copia .env.example a .env y pega la URL y la clave PUBLICABLE (nunca service_role).')
  process.exit(1)
}
if (clave.startsWith('sb_secret_') || clave.includes('service_role')) {
  console.error('✗ La clave parece secreta/service_role. Usa SOLO la clave publicable en el front.')
  process.exit(1)
}

const supabase = createClient(url, clave, { auth: { persistSession: false } })
const resultados = []

// Entrada: nombre y función async que devuelve { ok, detalle } · Proceso: la ejecuta y atrapa
// errores · Salida: registra y muestra OK/FALLA (sin datos sensibles).
async function probar(nombre, prueba) {
  let ok = false
  let detalle = ''
  try {
    ;({ ok, detalle } = await prueba())
  } catch (error) {
    detalle = `excepción: ${error instanceof Error ? error.message : String(error)}`
  }
  resultados.push(ok)
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${nombre}${detalle ? ` — ${detalle}` : ''}`)
}

// Entrada: respuesta de rpc · Proceso: false o sin-permiso cuentan como rechazo · Salida: { ok, detalle }.
function esRechazo({ data, error }) {
  if (error) return { ok: error.code === SIN_PERMISO, detalle: `error ${error.code ?? '?'}` }
  return { ok: data === false, detalle: `devolvió ${JSON.stringify(data)}` }
}

await probar('select objetos incluye los 10 oficiales (más extras ficticios)', async () => {
  const { data, error } = await supabase.from('objetos').select('id').order('id')
  if (error) return { ok: false, detalle: `error ${error.code ?? '?'}: ${error.message}` }
  const ids = (data ?? []).map((fila) => Number(fila.id))
  const ok = IDS_OFICIALES.every((id) => ids.includes(id))
  return { ok, detalle: `${ids.length} filas` }
})

await probar('select reclamos vacío o denegado (RLS)', async () => {
  const { data, error } = await supabase.from('reclamos').select('id').limit(1)
  if (error) return { ok: true, detalle: `denegado (${error.code ?? '?'})` }
  return { ok: (data ?? []).length === 0, detalle: `${(data ?? []).length} filas visibles` }
})

// Se "actualiza" al mismo valor para que, si RLS fallara, no cambie ningún dato.
await probar('update directo a objetos no afecta filas', async () => {
  const { data: fila } = await supabase.from('objetos').select('estado').eq('id', 1).maybeSingle()
  const estado = fila?.estado ?? 'Disponible'
  const { data, error } = await supabase.from('objetos').update({ estado }).eq('id', 1).select('id')
  if (error) return { ok: true, detalle: `denegado (${error.code ?? '?'})` }
  return { ok: (data ?? []).length === 0, detalle: `${(data ?? []).length} filas afectadas` }
})

await probar('rpc reclamar_objeto(3) ya Reclamado → false', async () =>
  esRechazo(await supabase.rpc('reclamar_objeto', {
    p_objeto: 3, p_nombre: 'Verificador', p_curso: '2do BGU', p_sena: 'seña larga de prueba',
  })))

// La validación de seña ocurre antes del update: no escribe aunque el objeto esté Disponible.
await probar('rpc con seña < 10 caracteres → false', async () =>
  esRechazo(await supabase.rpc('reclamar_objeto', {
    p_objeto: 1, p_nombre: 'Verificador', p_curso: '2do BGU', p_sena: 'corta',
  })))

if (ESCRIBIR) {
  // ATENCIÓN: cambia de verdad un objeto Disponible a Reclamado e inserta un reclamo.
  await probar('--escribir: reclamar un Disponible → true y luego false', async () => {
    const { data: libres } = await supabase.from('objetos').select('id').eq('estado', 'Disponible').order('id', { ascending: false }).limit(1)
    const id = libres?.[0]?.id
    if (id === undefined) return { ok: false, detalle: 'no hay objetos Disponibles' }
    const datos = { p_objeto: id, p_nombre: 'Verificador', p_curso: '2do BGU', p_sena: 'seña larga de prueba' }
    const primera = await supabase.rpc('reclamar_objeto', datos)
    const segunda = await supabase.rpc('reclamar_objeto', datos)
    const ok = primera.data === true && segunda.data === false
    return { ok, detalle: `objeto ${id}: ${JSON.stringify(primera.data)} / ${JSON.stringify(segunda.data)}` }
  })
} else {
  console.log('—     prueba de escritura omitida (usa -- --escribir para reclamar un objeto real)')
}

const fallas = resultados.filter((ok) => !ok).length
console.log(fallas === 0 ? `\n✓ ${resultados.length} pruebas OK` : `\n✗ ${fallas} de ${resultados.length} pruebas fallaron`)
process.exit(fallas === 0 ? 0 : 1)
