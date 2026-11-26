# Declaración de uso de IA (Anexo B)

La IA fue una herramienta de apoyo. Cada resultado se revisó, se probó con comandos y, cuando hizo falta, se corrigió. El registro completo (herramienta, instrucción, qué devolvió, qué aceptamos o cambiamos y cómo lo verificamos) está en `docs/BITACORA_IA.md`.

## 1. Herramientas y para qué tarea
| Herramienta | Tarea |
|---|---|
| Claude Code (Anthropic) | Estructura inicial (scaffold), lógica, validaciones, pruebas, integración de ramas, Supabase y Clerk, empaquetado (.exe y APK), depuración y revisión de código. |
| Claude (chat) y v0.dev | Ideación y bocetos de las páginas, guía visual (paleta y tipografías). |
| Codex (ChatGPT) | Función «¿Dónde buscar?» (`predecirLugares`, 6 pruebas y componente), revisada y verificada por el equipo. |

No se introdujeron contraseñas, tokens, claves privadas ni datos personales en las herramientas de IA. Las únicas claves del repositorio son **publicables** (públicas por diseño: Supabase *publishable* y Clerk `pk_test_`).

## 2. Instrucciones (prompts) utilizadas, sin datos privados
1. "Implementa «¿Qué perdiste?»: muestra los 3 objetos Disponibles más parecidos; +20 por palabra (tope 60), +25 por categoría, +15 por lugar, con razones y tests."
2. "Revisa los 12 componentes contra las reglas del reto (Reclamar desactivado si no está Disponible, error bajo el campo, mensaje sin resultados, paleta) y corrige solo lo que falte, sin renombrar ni cambiar props."
3. "Que solo los profesores puedan usar el modo inspector y los estudiantes no; que no se puedan crear cuentas falsas."
4. "Agrega «¿Dónde buscar?» en «¿Qué perdiste?»: cuando no haya coincidencias, muestra los 3 lugares donde más se encuentran objetos parecidos." (Codex)
5. "Cambia SOLO las tipografías en src/index.css: Bricolage Grotesque en títulos y Atkinson Hyperlegible en el texto."

## 3. Resultado de la IA que revisamos y corregimos
- **«¿Qué perdiste?»:** la primera versión sugería objetos solo por coincidir la categoría (25 puntos), lo que daba resultados sin sentido. Lo corregimos con `PUNTAJE_MINIMO = 40` (hace falta al menos una palabra en común) y ajustamos 3 pruebas que esperaban el comportamiento viejo.
- **Inicio de sesión:** la IA conectó Clerk, pero al probarlo en el navegador el registro fallaba («versión obsoleta de Clerk») y el botón «Sign up» sacaba al usuario de la app. Actualizamos a `@clerk/react` 6 y pusimos el registro dentro de la app.
- **Rol de profesor:** la primera versión leía el rol una sola vez y el botón del inspector no aparecía tras iniciar sesión; lo cambiamos al hook `useUser` (reactivo).
- **Cómo lo comprobamos:** `npm run typecheck`, `npm run verificar` (máx. 150 líneas por archivo), `npm run test` (48 pruebas, incluidas las reglas 1–6) y `npm run build`; además, pruebas en el navegador: registro con código de verificación, reclamo, y un intento sin rol de profesor de marcar Entregado, que Supabase rechazó con «permission denied».

## 4. Explicación de código asistido por IA
### `src/features/coincidencias/calcularCoincidencia.ts`
```ts
return objetos
  .filter((objeto) => objeto.estado === 'Disponible')
  .map((objeto) => calcularCoincidencia(objeto, descripcion))
  .filter((coincidencia) => coincidencia.puntaje >= PUNTAJE_MINIMO)
  .sort((a, b) => b.puntaje - a.puntaje || b.objeto.fecha.localeCompare(a.objeto.fecha))
  .slice(0, maximo)
```
Primero se quedan solo los objetos Disponibles (regla 2: lo demás no se puede reclamar). A cada uno se le calcula un puntaje, se descartan los que no llegan al mínimo, se ordenan de mayor a menor (si empatan, gana el hallado más reciente) y se devuelven los 3 primeros.

### `supabase/04_roles.sql` (seguridad en el servidor)
```sql
if coalesce(auth.jwt()->>'rol', '') <> 'profesor' then
  return false;
end if;
update public.objetos set estado = 'Entregado' where id = p_objeto and estado = 'Reclamado';
```
Aunque alguien modifique la app, la base de datos revisa el token de Clerk: si no trae `rol = profesor`, no marca nada. Y solo pasa a Entregado un objeto que estaba Reclamado.
