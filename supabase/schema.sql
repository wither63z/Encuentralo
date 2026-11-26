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
