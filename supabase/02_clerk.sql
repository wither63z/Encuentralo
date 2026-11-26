-- 02_clerk.sql · Migración OPCIONAL de Encuéntralo. Ejecutar DESPUÉS de schema.sql en el SQL Editor.
-- Requiere Clerk como Third-party auth (Supabase → Authentication → Third-party auth) para que
-- auth.jwt()->>'sub' sea el id de usuario de Clerk. Fuente:
-- https://supabase.com/docs/guides/auth/third-party/clerk (ids de Clerk NO son uuid: usar
-- auth.jwt()->>'sub' en columnas text, nunca auth.uid()).
-- Entrada: tablas de schema.sql · Proceso: guarda quién reclama, limita abuso y endurece la
-- función · Salida: reclamar_objeto con clerk_user_id y tabla opcional perfiles con RLS.

-- Anti-abuso 1: un solo reclamo por objeto (el estado solo pasa una vez de Disponible a Reclamado).
-- Para reiniciar la demo: borrar los reclamos del objeto ANTES de volverlo a 'Disponible'.
create unique index if not exists reclamos_objeto_unico on public.reclamos (objeto_id);
create index if not exists reclamos_por_usuario on public.reclamos (clerk_user_id);

-- VARIANTE A (por defecto): sesión opcional. Anónimo → clerk_user_id null.
-- Anti-abuso 2: máximo 3 reclamos por cuenta de Clerk (MAX_RECLAMOS_POR_USUARIO en constantes.ts).
create or replace function public.reclamar_objeto(p_objeto bigint, p_nombre text, p_curso text, p_sena text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_usuario text := nullif(auth.jwt()->>'sub', '');
begin
  if length(trim(coalesce(p_nombre, ''))) = 0 or length(trim(coalesce(p_curso, ''))) = 0
     or length(trim(coalesce(p_sena, ''))) < 10 then
    return false;
  end if;
  if v_usuario is not null
     and (select count(*) from public.reclamos r where r.clerk_user_id = v_usuario) >= 3 then
    return false;
  end if;
  update public.objetos set estado = 'Reclamado' where id = p_objeto and estado = 'Disponible';
  if not found then
    return false;
  end if;
  insert into public.reclamos (objeto_id, clerk_user_id, nombre, curso, sena)
  values (p_objeto, v_usuario, trim(p_nombre), trim(p_curso), trim(p_sena));
  return true;
end;
$$;

revoke all on function public.reclamar_objeto(bigint, text, text, text) from public, anon, authenticated;
grant execute on function public.reclamar_objeto(bigint, text, text, text) to anon, authenticated;

-- VARIANTE B (descomentar para EXIGIR sesión de Clerk): sin 'sub' rechaza; solo authenticated.
-- create or replace function public.reclamar_objeto(p_objeto bigint, p_nombre text, p_curso text, p_sena text)
-- returns boolean
-- language plpgsql
-- security definer
-- set search_path = ''
-- as $$
-- declare
--   v_usuario text := nullif(auth.jwt()->>'sub', '');
-- begin
--   if v_usuario is null then
--     return false;
--   end if;
--   if length(trim(coalesce(p_nombre, ''))) = 0 or length(trim(coalesce(p_curso, ''))) = 0
--      or length(trim(coalesce(p_sena, ''))) < 10 then
--     return false;
--   end if;
--   if (select count(*) from public.reclamos r where r.clerk_user_id = v_usuario) >= 3 then
--     return false;
--   end if;
--   update public.objetos set estado = 'Reclamado' where id = p_objeto and estado = 'Disponible';
--   if not found then
--     return false;
--   end if;
--   insert into public.reclamos (objeto_id, clerk_user_id, nombre, curso, sena)
--   values (p_objeto, v_usuario, trim(p_nombre), trim(p_curso), trim(p_sena));
--   return true;
-- end;
-- $$;
-- revoke all on function public.reclamar_objeto(bigint, text, text, text) from public, anon, authenticated;
-- grant execute on function public.reclamar_objeto(bigint, text, text, text) to authenticated;

-- OPCIONAL: perfiles de estudiante ligados a Clerk. Cada quien ve y edita solo su fila.
create table if not exists public.perfiles (
  clerk_user_id text primary key default (auth.jwt()->>'sub'),
  nombre text not null check (length(trim(nombre)) > 0),
  curso text not null check (length(trim(curso)) > 0),
  actualizado_en timestamptz not null default now()
);

alter table public.perfiles enable row level security;

drop policy if exists "perfiles leer propio" on public.perfiles;
create policy "perfiles leer propio" on public.perfiles for select to authenticated
  using (clerk_user_id = (select auth.jwt()->>'sub'));

drop policy if exists "perfiles crear propio" on public.perfiles;
create policy "perfiles crear propio" on public.perfiles for insert to authenticated
  with check (clerk_user_id = (select auth.jwt()->>'sub'));

drop policy if exists "perfiles editar propio" on public.perfiles;
create policy "perfiles editar propio" on public.perfiles for update to authenticated
  using (clerk_user_id = (select auth.jwt()->>'sub'))
  with check (clerk_user_id = (select auth.jwt()->>'sub'));

revoke all on table public.perfiles from anon;

-- CÓMO COMPROBAR (no marcar como hecho sin ejecutarlo): npm run verificar:supabase
-- Con sesión de Clerk: reclamar un objeto Disponible y revisar que reclamos.clerk_user_id = 'user_...'.
