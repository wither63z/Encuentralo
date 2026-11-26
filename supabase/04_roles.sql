-- 04_roles.sql · Encuéntralo
-- Entrada: proyecto con instalar_todo.sql aplicado y Clerk como proveedor externo.
-- Proceso: el modo inspector (marcar Entregado) queda SOLO para profesores.
-- Salida: marcar_entregado exige el claim «rol» = 'profesor' del token de Clerk.
--
-- Requisitos en Clerk (panel):
--   1) Sessions → Customize session token → { "rol": "{{user.public_metadata.rol}}" }
--   2) Users → (profesor) → Metadata → Public → { "rol": "profesor" }
-- El estudiante no puede editar publicMetadata: solo el panel o la API secreta de Clerk.

create or replace function public.marcar_entregado(p_objeto bigint)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  if coalesce(auth.jwt()->>'rol', '') <> 'profesor' then
    return false;
  end if;
  update public.objetos set estado = 'Entregado' where id = p_objeto and estado = 'Reclamado';
  return found;
end;
$$;

revoke all on function public.marcar_entregado(bigint) from public, anon, authenticated;
grant execute on function public.marcar_entregado(bigint) to authenticated;

-- Prueba rápida (SQL Editor, rol anon): select public.marcar_entregado(1); -> false o error de permiso.
