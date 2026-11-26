-- 06_reclamos_inspector.sql · Encuéntralo
-- Entrada: tabla reclamos con RLS sin políticas (nadie la lee directamente).
-- Proceso: función que devuelve los reclamos SOLO si el token de Clerk trae rol = profesor.
-- Salida: el Modo inspector ve nombre, curso y seña para verificar al dueño antes de entregar.

create or replace function public.listar_reclamos()
returns table (objeto_id bigint, nombre text, curso text, sena text, creado_en timestamptz)
language plpgsql
security definer
set search_path = ''
as $$
begin
  if coalesce(auth.jwt()->>'rol', '') <> 'profesor' then
    return;
  end if;
  return query
    select r.objeto_id, r.nombre, r.curso, r.sena, r.creado_en
    from public.reclamos r
    order by r.creado_en desc;
end;
$$;

revoke all on function public.listar_reclamos() from public, anon, authenticated;
grant execute on function public.listar_reclamos() to authenticated;
