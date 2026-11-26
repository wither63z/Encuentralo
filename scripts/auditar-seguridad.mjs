// Entrada: repositorio git actual · Proceso: busca secretos, revisa .gitignore, npm audit y schema.sql
// Salida: informe por consola y código 1 si hay hallazgos críticos o altos.
import { execSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'

const EXCLUIDOS = new Set(['.env.example', 'package-lock.json', 'scripts/auditar-seguridad.mjs',
  // Menciona service_role solo para RECHAZAR esas claves (falso positivo revisado).
  'scripts/verificar-supabase.mjs'])
const ENV_PUBLICABLES = new Set(['.env.production', '.env.web'])
const EXTENSIONES_CODIGO = /\.(ts|tsx|js|mjs|cjs|jsx|sql|html|json)$/
const PATRONES_SECRETOS = [
  { nombre: 'Clave secreta sk_/sk-', regex: /\bsk[_-](?:live_|test_|ant-|proj-)?[A-Za-z0-9_-]{20,}/, severidad: 'crítico' },
  { nombre: 'Clave live pk_live_ (publicable de producción)', regex: /\bpk_live_[A-Za-z0-9]{10,}/, severidad: 'medio' },
  { nombre: 'Clave service_role asignada', regex: /service_role\w*["']?\s*[:=]\s*["']?[A-Za-z0-9._-]{20,}/i, severidad: 'crítico' },
  { nombre: 'JWT (eyJhbGci…)', regex: /eyJhbGci[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/, severidad: 'alto' },
  { nombre: 'Clave NVIDIA nvapi-', regex: /nvapi-[A-Za-z0-9_-]{20,}/, severidad: 'crítico' },
  { nombre: 'Token GitHub ghp_', regex: /\bgh[pousr]_[A-Za-z0-9]{30,}/, severidad: 'crítico' },
  { nombre: 'Clave AWS AKIA', regex: /\bAKIA[0-9A-Z]{16}\b/, severidad: 'crítico' },
  {
    nombre: 'Contraseña/secreto en asignación',
    regex: /(?:^|[^a-z])(password|passwd|pwd|contrase(?:ñ|n)a|secret|api_?key|token)(?:_\w+|key|token|secret)?["']?\s*[:=]\s*["'][^"'\s]{6,}["']/i,
    severidad: 'alto',
  },
]
const ENTRADAS_GITIGNORE = ['.env', '.ai/', 'secrets/', '.claude/settings.local.json']
const hallazgos = []

// Entrada: severidad, ubicación y texto · Proceso: acumula el hallazgo
// Salida: nada (modifica la lista global `hallazgos`).
function registrar(severidad, ubicacion, detalle) {
  hallazgos.push({ severidad, ubicacion, detalle })
}

// Entrada: texto coincidente · Proceso: deja solo 4 caracteres visibles · Salida: texto enmascarado.
function enmascarar(texto) {
  return `${texto.slice(0, 4)}…(${texto.length} car.)`
}

// Entrada: comando de consola · Proceso: lo ejecuta y captura stdout aunque falle
// Salida: { salida, codigo }.
function ejecutar(comando) {
  try {
    return { salida: execSync(comando, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }), codigo: 0 }
  } catch (error) {
    return { salida: String(error.stdout ?? ''), codigo: error.status ?? 1, error: String(error.stderr ?? error.message) }
  }
}

// Entrada: archivos de `git ls-files` · Proceso: aplica PATRONES_SECRETOS línea por línea
// Salida: hallazgos registrados (secreto enmascarado, nunca completo).
function buscarSecretos(archivos) {
  // .claude/skills: documentación de terceros con ejemplos de configuración (no es código del proyecto).
  for (const archivo of archivos.filter((a) => !EXCLUIDOS.has(a) && !a.startsWith('.claude/skills/') && existsSync(a))) {
    const lineas = readFileSync(archivo, 'utf8').split('\n')
    lineas.forEach((linea, indice) => {
      for (const { nombre, regex, severidad } of PATRONES_SECRETOS) {
        const coincidencia = linea.match(regex)
        if (coincidencia) registrar(severidad, `${archivo}:${indice + 1}`, `${nombre}: ${enmascarar(coincidencia[0])}`)
      }
      if (/service_role/i.test(linea) && EXTENSIONES_CODIGO.test(archivo)) {
        registrar('medio', `${archivo}:${indice + 1}`, 'Mención de service_role en código')
      }
    })
  }
}

// Entrada: archivos versionados · Proceso: verifica que .env no esté en git y revisa .gitignore
// Salida: hallazgos críticos/altos si falta protección.
function revisarIgnorados(archivos) {
  const envVersionados = archivos.filter((a) => /(^|\/)\.env(\..+)?$/.test(a) && !a.endsWith('.env.example'))
  for (const archivo of envVersionados) {
    // .env.production y .env.web se versionan a propósito con SOLO claves publicables (van al JS público).
    // Siguen revisándose: cualquier clave secreta dentro los vuelve críticos.
    const publicable = ENV_PUBLICABLES.has(archivo) && !/sb_secret_|service_role|sk_(test|live)_/i.test(readFileSync(archivo, 'utf8'))
    if (!publicable) registrar('crítico', archivo, 'Archivo .env versionado en git')
  }
  const reglas = existsSync('.gitignore') ? readFileSync('.gitignore', 'utf8').split(/\r?\n/).map((l) => l.trim()) : []
  for (const entrada of ENTRADAS_GITIGNORE) {
    if (!reglas.includes(entrada)) registrar('alto', '.gitignore', `Falta la entrada "${entrada}"`)
  }
}

// Entrada: nada · Proceso: ejecuta `npm audit --omit=dev --json` (solo lo que se entrega) y lee metadata.vulnerabilities
// Salida: resumen por severidad y hallazgos si hay críticas/altas.
function revisarDependencias() {
  const { salida, error } = ejecutar('npm audit --omit=dev --json')
  let datos
  try { datos = JSON.parse(salida) } catch { datos = null }
  const conteo = datos?.metadata?.vulnerabilities
  if (!conteo) {
    registrar('medio', 'npm audit', `No se pudo obtener el informe (${(error ?? 'sin JSON').split('\n')[0]})`)
    return 'no disponible'
  }
  const mapa = { critical: 'crítico', high: 'alto', moderate: 'medio', low: 'bajo' }
  for (const [clave, severidad] of Object.entries(mapa)) {
    if (conteo[clave] > 0) registrar(severidad, 'npm audit', `${conteo[clave]} vulnerabilidad(es) ${clave}`)
  }
  return `critical=${conteo.critical} high=${conteo.high} moderate=${conteo.moderate} low=${conteo.low} info=${conteo.info} total=${conteo.total}`
}

// Entrada: supabase/schema.sql · Proceso: compara tablas creadas con RLS activado, revisa
// funciones security definer (search_path) y políticas permisivas · Salida: hallazgos.
function revisarEsquema(ruta = 'supabase/schema.sql') {
  if (!existsSync(ruta)) return registrar('medio', ruta, 'No existe el esquema')
  const sql = readFileSync(ruta, 'utf8').replace(/--.*$/gm, '')
  const sinEsquema = (nombre) => nombre.replace(/^public\./i, '').toLowerCase()
  const tablas = [...sql.matchAll(/create\s+table\s+(?:if\s+not\s+exists\s+)?([\w.]+)/gi)].map((m) => sinEsquema(m[1]))
  const conRls = new Set(
    [...sql.matchAll(/alter\s+table\s+(?:only\s+)?([\w.]+)\s+enable\s+row\s+level\s+security/gi)].map((m) => sinEsquema(m[1])),
  )
  for (const tabla of tablas) if (!conRls.has(tabla)) registrar('crítico', ruta, `Tabla "${tabla}" sin RLS activado`)
  for (const [, nombre, cabecera] of sql.matchAll(/create\s+(?:or\s+replace\s+)?function\s+([\w.]+)([\s\S]*?)\bas\s+\$\w*\$/gi)) {
    if (!/security\s+definer/i.test(cabecera)) continue
    const ruta_busqueda = cabecera.match(/set\s+search_path\s*(?:=|to)\s*([^\n]+)/i)
    if (!ruta_busqueda) registrar('alto', ruta, `Función security definer "${nombre}" sin set search_path`)
    else if (!/''|pg_temp/.test(ruta_busqueda[1])) {
      registrar('bajo', ruta, `"${nombre}": search_path = ${ruta_busqueda[1].trim()} (recomendado '' o incluir pg_temp al final)`)
    }
    if (!new RegExp(`revoke\\s+all\\s+on\\s+function\\s+${nombre}[\\s\\S]*?from\\s+public`, 'i').test(sql)) {
      registrar('medio', ruta, `Función "${nombre}" sin revoke ... from public`)
    }
  }
  const permisivas = sql.match(/for\s+(insert|update|delete|all)\b[^;]*(using|with\s+check)\s*\(\s*true\s*\)/gi) ?? []
  for (const politica of permisivas) registrar('alto', ruta, `Política de escritura abierta: ${politica.slice(0, 60)}`)
  return `${tablas.length} tabla(s), ${conRls.size} con RLS`
}

// Entrada: nada · Proceso: orquesta todas las revisiones e imprime el resumen
// Salida: código de salida 1 si hay hallazgos críticos o altos; 0 en otro caso.
function principal() {
  const archivos = ejecutar('git ls-files').salida.split(/\r?\n/).filter(Boolean)
  console.log(`Auditoría de seguridad local · ${archivos.length} archivos versionados`)
  buscarSecretos(archivos)
  revisarIgnorados(archivos)
  const resumenEsquema = revisarEsquema()
  const resumenAudit = revisarDependencias()
  console.log(`npm audit: ${resumenAudit}`)
  console.log(`schema.sql: ${resumenEsquema}`)
  const orden = ['crítico', 'alto', 'medio', 'bajo']
  for (const severidad of orden) {
    for (const h of hallazgos.filter((x) => x.severidad === severidad)) {
      console.log(`[${severidad.toUpperCase()}] ${h.ubicacion} · ${h.detalle}`)
    }
  }
  const conteo = orden.map((s) => `${s}=${hallazgos.filter((h) => h.severidad === s).length}`).join(' ')
  console.log(`Resumen: ${conteo}`)
  const graves = hallazgos.some((h) => h.severidad === 'crítico' || h.severidad === 'alto')
  console.log(graves ? '✗ Hay hallazgos críticos o altos.' : '✓ Sin hallazgos críticos ni altos.')
  process.exit(graves ? 1 : 0)
}

principal()
