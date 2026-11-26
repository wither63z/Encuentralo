-- 05_reiniciar_demo.sql · Encuéntralo
-- Entrada: base con datos de prueba ya modificados (reclamos y entregas hechos al probar).
-- Proceso: devuelve los 10 objetos oficiales al estado del enunciado y borra los reclamos de los
-- objetos que vuelven a quedar Disponibles. Los extras (ids 11–25 y reportados) no se tocan.
-- Salida: la base lista para empezar la demostración ante el jurado.

update public.objetos o set estado = v.estado
from (values
  (1, 'Disponible'), (2, 'Disponible'), (3, 'Reclamado'), (4, 'Disponible'), (5, 'Entregado'),
  (6, 'Disponible'), (7, 'Disponible'), (8, 'Reclamado'), (9, 'Disponible'), (10, 'Disponible')
) as v(id, estado)
where o.id = v.id;

delete from public.reclamos r
using public.objetos o
where r.objeto_id = o.id and o.estado = 'Disponible';

select id, nombre, estado from public.objetos where id <= 10 order by id;
