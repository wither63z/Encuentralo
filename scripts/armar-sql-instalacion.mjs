// Entrada: supabase/schema.sql, 02_clerk.sql, 03_fotos.sql y src/data/objetosExtra.ts
// Proceso: los une en orden y agrega permisos explícitos (el proyecto no expone tablas por defecto)
// y el seed de los objetos ficticios 11–25 · Salida: supabase/instalar_todo.sql (pegar en SQL Editor).
import { readFileSync, writeFileSync } from 'node:fs'

const leer = (ruta) => readFileSync(ruta, 'utf8').replace(/\r\n/g, '\n')
const sqlTexto = (t) => `'${t.replace(/'/g, "''")}'`

// Lee los objetos extra del archivo de datos (formato { id: 11, nombre: '...', ... }).
const extras = [...leer('src/data/objetosExtra.ts').matchAll(/\{ id: (\d+), nombre: '([^']*)', categoria: '([^']*)', lugar: '([^']*)', fecha: '([^']*)', estado: '([^']*)', descripcion: '([^']*)' \}/g)]
  .map(([, id, nombre, categoria, lugar, fecha, estado, descripcion]) =>
    ` (${id},${sqlTexto(nombre)},${sqlTexto(categoria)},${sqlTexto(lugar)},'${fecha}',${sqlTexto(estado)},${sqlTexto(descripcion)})`)

if (extras.length !== 15) throw new Error(`Se esperaban 15 objetos extra y hay ${extras.length}`)

const permisos = `
-- Permisos explícitos (Data API sin "grant automático"): solo lectura de objetos.
grant usage on schema public to anon, authenticated;
grant select on public.objetos to anon, authenticated;
`
const seedExtras = `
-- Seed: objetos FICTICIOS adicionales 11–25 (declarados en la Ficha).
insert into public.objetos (id, nombre, categoria, lugar, fecha, estado, descripcion) values
${extras.join(',\n')}
on conflict (id) do nothing;
`
const salida = [
  '-- ARCHIVO GENERADO por scripts/armar-sql-instalacion.mjs. No editar a mano.',
  leer('supabase/schema.sql'), permisos, leer('supabase/02_clerk.sql'), leer('supabase/03_fotos.sql'), seedExtras,
].join('\n')
writeFileSync('supabase/instalar_todo.sql', salida)
console.log(`✓ supabase/instalar_todo.sql (${salida.split('\n').length} líneas, ${extras.length} extras)`)
