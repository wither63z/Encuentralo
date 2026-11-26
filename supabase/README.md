# Supabase + Clerk para Encuéntralo (guía para el equipo)

> **Plan B, siempre:** la demo del jurado funciona en modo mock (`VITE_USE_MOCK=true`) sin
> internet, sin claves y sin cuentas. Supabase y Clerk son opcionales. Si algo falla el día de
> la presentación, vuelve a mock (paso 8) y sigue.

Datos 100 % ficticios. En el front solo van claves **publicables**. Nunca `service_role` ni la
*secret key* de Supabase, nunca la *Secret key* (`sk_...`) de Clerk. No subas `.env` a git.

## 1. Crear el proyecto Supabase
1. Entra a <https://supabase.com/dashboard> → **New project** (plan gratuito).
2. Elige región cercana (p. ej. `South America (São Paulo)`), pon una contraseña de base de
   datos fuerte y guárdala en tu gestor de contraseñas (no en el repo).

## 2. Crear tablas, RLS, función y los 10 objetos
1. En el proyecto: **SQL Editor** → **New query**.
2. Pega el contenido completo de `supabase/schema.sql` → **Run**.
3. Revisa en **Table Editor** que `objetos` tenga 10 filas y que `objetos` y `reclamos`
   muestren RLS activado.

## 3. (Opcional) Migración de Clerk
Solo si vas a usar Clerk. Ejecuta `supabase/02_clerk.sql` **después** de `schema.sql`:
- `reclamar_objeto` guarda `clerk_user_id = auth.jwt()->>'sub'` (null si es anónimo).
- Anti-abuso: un reclamo por objeto (índice único) y máximo 3 reclamos por cuenta de Clerk.
- Funciones con `security definer` y `set search_path = ''`.
- **Variante B** (comentada): exige sesión; solo el rol `authenticated` puede ejecutar.
- Tabla opcional `perfiles` con RLS: cada usuario ve/edita solo su fila.

Para reiniciar la demo con esta migración: borra los reclamos del objeto antes de devolverlo a
`Disponible` (el índice único impide un segundo reclamo del mismo objeto).

## 4. Conectar Clerk como Third-party auth
Fuente oficial: <https://supabase.com/docs/guides/auth/third-party/clerk>
1. Crea la app en <https://dashboard.clerk.com> (instancia *Development*).
2. En Clerk abre **Connect with Supabase** (<https://dashboard.clerk.com/setup/supabase>) y
   actívalo: añade el claim `role: "authenticated"` al token de sesión. Copia el dominio de
   Clerk que muestra (p. ej. `xxxx.clerk.accounts.dev`).
3. En Supabase: **Authentication → Sign In / Providers → Third-party auth → Add provider →
   Clerk**, pega ese dominio y guarda.
4. No hace falta plantilla JWT: la app envía el token de sesión normal de Clerk
   (`Clerk.session.getToken()`) mediante la opción `accessToken` de `createClient`.

## 5. Copiar las claves (solo publicables)
- Supabase: **Project Settings → API Keys** → *Project URL* y *Publishable key*
  (`sb_publishable_...`). Si tu proyecto solo muestra claves *legacy*, usa la `anon` `public`.
  **Nunca** la *secret* ni la `service_role`.
- Clerk: **Configure → API Keys** → *Publishable key* (`pk_test_...`). **Nunca** `sk_...`.

## 6. Configurar `.env`
Copia `.env.example` a `.env` (en la raíz) y completa:
```
VITE_USE_MOCK=false
VITE_SUPABASE_URL=https://<tu-proyecto>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...   # vacío = sin Clerk
```
Con `VITE_USE_MOCK=false` y sin Clerk nadie queda autenticado: no se podrá reclamar.
Reinicia `npm run dev` después de editar `.env`.

## 7. Verificar seguridad
```
npm run verificar:supabase
```
Usa la clave publicable (rol anónimo) y no imprime claves. Comprueba:
1. `objetos` devuelve los 10 oficiales.
2. `reclamos` sale vacío o denegado (RLS).
3. Un `update` directo a `objetos` no afecta filas.
4. `reclamar_objeto(3)` (ya Reclamado) devuelve `false`.
5. Una seña de menos de 10 caracteres devuelve `false`.

Con la variante B de `02_clerk.sql`, las pruebas 4 y 5 aceptan "sin permiso" (`42501`) como
rechazo correcto. `npm run verificar:supabase -- --escribir` además reclama **de verdad** un
objeto Disponible (cambia los datos): úsalo solo en un proyecto de pruebas y, con variante B,
fallará porque el verificador no tiene sesión de Clerk.

Luego prueba a mano en la app: reclamar un objeto Disponible → pasa a Reclamado en el listado;
con Clerk, en **Table Editor → reclamos** la columna `clerk_user_id` debe tener `user_...`.

## 8. Volver a mock (sin internet o si algo falla)
En `.env` pon `VITE_USE_MOCK=true` (o borra `.env`) y reinicia `npm run dev`. La app vuelve a
los 10 objetos en memoria, sin Supabase ni Clerk. Para una versión compilada, repite
`npm run build` tras el cambio: las variables `VITE_*` se fijan al compilar.
