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
