-- ARCHIVO GENERADO por scripts/armar-sql-instalacion.mjs. No editar a mano.
-- Esquema Supabase de Encuéntralo. Ejecutar en el SQL Editor del proyecto.
-- RLS activado en TODAS las tablas. Solo se usa la clave PUBLICABLE en el front.

create table if not exists objetos (
  id bigint primary key,
  nombre text not null,
  categoria text not null check (categoria in ('Ropa','Útiles','Tecnología','Deportes','Otros')),
  lugar text not null,
  fecha date not null,
  estado text not null default 'Disponible' check (estado in ('Disponible','Reclamado','Entregado')),
  descripcion text not null
);

create table if not exists reclamos (
  id uuid primary key default gen_random_uuid(),
  objeto_id bigint not null references objetos(id),
  clerk_user_id text,
  nombre text not null check (length(trim(nombre)) between 1 and 80),
  curso text not null check (length(trim(curso)) between 1 and 40),
  sena text not null check (length(trim(sena)) between 10 and 300),
  creado_en timestamptz not null default now()
);

alter table objetos enable row level security;
alter table reclamos enable row level security;

-- Lectura pública de objetos. Sin políticas de escritura: nadie actualiza directo.
drop policy if exists "objetos lectura publica" on objetos;
create policy "objetos lectura publica" on objetos for select using (true);
-- reclamos: sin políticas => anon no puede leer ni escribir directamente.
-- Defensa extra: quitar permisos de escritura de tabla aunque cambien las políticas.
revoke insert, update, delete on public.objetos from anon, authenticated;
revoke all on public.reclamos from anon, authenticated;

-- Única vía de escritura: cambia a Reclamado SOLO si estaba Disponible (reglas 2 y 3).
create or replace function reclamar_objeto(p_objeto bigint, p_nombre text, p_curso text, p_sena text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  if length(trim(coalesce(p_nombre,''))) not between 1 and 80
     or length(trim(coalesce(p_curso,''))) not between 1 and 40
     or length(trim(coalesce(p_sena,''))) not between 10 and 300 then
    return false;
  end if;
  update public.objetos set estado = 'Reclamado' where id = p_objeto and estado = 'Disponible';
  if not found then
    return false;
  end if;
  insert into public.reclamos (objeto_id, nombre, curso, sena) values (p_objeto, trim(p_nombre), trim(p_curso), trim(p_sena));
  return true;
end;
$$;

revoke all on function reclamar_objeto(bigint, text, text, text) from public;
grant execute on function reclamar_objeto(bigint, text, text, text) to anon, authenticated;

-- Inspector: única vía para pasar de Reclamado a Entregado (nunca desde Disponible).
-- DEMO: se concede a anon para la presentación. En producción se restringiría a inspectores
-- (por ejemplo, revisar un rol en auth.jwt() y conceder solo a authenticated).
create or replace function marcar_entregado(p_objeto bigint)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.objetos set estado = 'Entregado' where id = p_objeto and estado = 'Reclamado';
  return found;
end;
$$;

revoke all on function marcar_entregado(bigint) from public;
grant execute on function marcar_entregado(bigint) to anon, authenticated;

-- Seed: los 10 objetos oficiales tal cual.
insert into objetos (id, nombre, categoria, lugar, fecha, estado, descripcion) values
 (1,'Chompa azul con capucha','Ropa','Cancha de básquet','2026-11-18','Disponible','Talla M con cierre plateado'),
 (2,'Cartuchera roja','Útiles','Aula 2do BGU A','2026-11-19','Disponible','Contiene esferos y un borrador'),
 (3,'Calculadora científica','Tecnología','Laboratorio de Física','2026-11-19','Reclamado','Color negro con tapa deslizable'),
 (4,'Termo metálico','Otros','Bar del colegio','2026-11-20','Disponible','Color verde de 500 ml'),
 (5,'Balón de fútbol','Deportes','Cancha principal','2026-11-20','Entregado','Número 5 con franjas amarillas'),
 (6,'Audífonos inalámbricos','Tecnología','Biblioteca','2026-11-23','Disponible','Estuche blanco de carga'),
 (7,'Cuaderno universitario','Útiles','Aula 1ro BGU B','2026-11-23','Disponible','Cien hojas de cuadros con forro verde'),
 (8,'Gorra negra','Ropa','Patio central','2026-11-24','Reclamado','Visera plana con logotipo bordado'),
 (9,'Llaves con llavero','Otros','Entrada principal','2026-11-24','Disponible','Tres llaves y un llavero de madera'),
 (10,'Flauta dulce','Otros','Sala de música','2026-11-24','Disponible','Color crema con funda de tela')
on conflict (id) do nothing;

-- CÓMO COMPROBAR RLS (con la clave publicable, NO marcar como hecho sin ejecutarlo):
-- 1) select * from reclamos;                      -> debe venir vacío o fallar.
-- 2) update objetos set estado='Entregado' where id=1;  -> no debe afectar filas.
-- 3) select reclamar_objeto(3,'Ana','2do','seña larga 123'); -> false (ya Reclamado).
-- 4) select marcar_entregado(1); -> false (Disponible no se entrega directo).


-- Permisos explícitos (Data API sin "grant automático"): solo lectura de objetos.
grant usage on schema public to anon, authenticated;
grant select on public.objetos to anon, authenticated;

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

-- Migración 03: fotos de objetos y «Reportar objeto encontrado».
-- Ejecutar DESPUÉS de schema.sql (y de 02_clerk.sql si se usa). Idempotente.

alter table public.objetos add column if not exists foto_url text
  check (foto_url is null or foto_url like 'https://%');

-- ids nuevos a partir de 1000 (los oficiales 1–10 y los ficticios 11–25 no chocan).
create sequence if not exists public.objetos_id_seq start 1000;

-- Única vía para crear objetos: valida igual que el front (utils/validarNuevoObjeto.ts).
create or replace function public.reportar_objeto(
  p_nombre text, p_categoria text, p_lugar text, p_fecha date, p_descripcion text, p_foto_url text
) returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  nuevo_id bigint;
begin
  if length(trim(coalesce(p_nombre,''))) not between 3 and 80
     or p_categoria not in ('Ropa','Útiles','Tecnología','Deportes','Otros')
     or length(trim(coalesce(p_lugar,''))) not between 2 and 60
     or p_fecha is null or p_fecha > current_date
     or length(trim(coalesce(p_descripcion,''))) not between 10 and 300
     or (p_foto_url is not null and p_foto_url not like 'https://%') then
    return null;
  end if;
  insert into public.objetos (id, nombre, categoria, lugar, fecha, estado, descripcion, foto_url)
  values (nextval('public.objetos_id_seq'), trim(p_nombre), p_categoria, trim(p_lugar), p_fecha,
          'Disponible', trim(p_descripcion), p_foto_url)
  returning id into nuevo_id;
  return nuevo_id;
end;
$$;

revoke all on function public.reportar_objeto(text, text, text, date, text, text) from public;
grant execute on function public.reportar_objeto(text, text, text, date, text, text) to anon, authenticated;
-- Con Clerk obligatorio: cambiar el grant anterior por "to authenticated" solamente.

-- Bucket público de fotos: solo imágenes, máximo 1 MB (el front ya las reduce a ~100 KB).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('fotos', 'fotos', true, 1048576, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = true, file_size_limit = 1048576,
  allowed_mime_types = array['image/jpeg','image/png','image/webp'];

-- Subir: solo al bucket "fotos" (lectura es pública por ser bucket público). Sin update ni delete.
drop policy if exists "fotos subir" on storage.objects;
create policy "fotos subir" on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'fotos');

-- PRUEBAS (no marcar como hechas sin ejecutarlas):
-- select public.reportar_objeto('Botella azul','Otros','Patio','2026-11-25','Botella de aluminio azul', null); -> id ≥ 1000
-- select public.reportar_objeto('x','Otros','Patio','2026-11-25','corta', null); -> null


-- Seed: objetos FICTICIOS adicionales 11–25 (declarados en la Ficha).
insert into public.objetos (id, nombre, categoria, lugar, fecha, estado, descripcion) values
 (11,'Mochila gris','Útiles','Coliseo','2026-11-17','Disponible','Dos compartimentos y un llavero de búho'),
 (12,'Casaca deportiva del colegio','Ropa','Vestidores','2026-11-17','Entregado','Talla S con nombre borrado en la etiqueta'),
 (13,'Memoria USB de 32 GB','Tecnología','Laboratorio de Computación','2026-11-18','Disponible','Color rojo con tapa y cordón negro'),
 (14,'Raqueta de tenis de mesa','Deportes','Sala de profesores','2026-11-18','Disponible','Mango de madera con goma roja y negra'),
 (15,'Lonchera térmica','Otros','Bar del colegio','2026-11-19','Reclamado','Color morado con cierre y asa larga'),
 (16,'Juego geométrico','Útiles','Aula 3ro BGU C','2026-11-20','Disponible','Escuadras, regla y graduador transparentes'),
 (17,'Gafas de lectura','Otros','Biblioteca','2026-11-20','Disponible','Marco café dentro de un estuche duro'),
 (18,'Cargador de celular','Tecnología','Aula 1ro BGU A','2026-11-21','Disponible','Cable tipo C blanco con adaptador'),
 (19,'Canilleras de fútbol','Deportes','Cancha principal','2026-11-21','Disponible','Par de canilleras negras con tobillera'),
 (20,'Bufanda tejida','Ropa','Capilla','2026-11-21','Disponible','Rayas rojas y blancas con flecos'),
 (21,'Libro de Matemática','Útiles','Aula 2do BGU B','2026-11-22','Reclamado','Forrado con papel kraft y etiqueta escrita'),
 (22,'Reloj de pulsera','Otros','Coliseo','2026-11-22','Disponible','Correa de silicona negra y pantalla digital'),
 (23,'Cuerda para saltar','Deportes','Patio central','2026-11-23','Entregado','Mangos naranjas con cuerda de plástico'),
 (24,'Mouse inalámbrico','Tecnología','Laboratorio de Computación','2026-11-24','Disponible','Color plomo con receptor USB pequeño'),
 (25,'Sombrero de paja','Ropa','Entrada principal','2026-11-25','Disponible','Ala ancha con cinta negra alrededor')
on conflict (id) do nothing;
