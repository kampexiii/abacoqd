# Seguridad — notas de cierre para producción

## Creación de usuarios: solo desde el panel

No existe ni existirá registro público de usuarios. Los usuarios se crean
exclusivamente desde `/admin/users`, accesible solo a `super_admin`
(`UserRequest::authorize()`), y el formulario exige `role` explícito
(`required`, `Rule::enum(UserRole::class)`).

`Features::registration()` está desactivado en `config/fortify.php`; `/register`
devuelve 404.

### Riesgo residual documentado: default `editor` en `users.role`

La migración original (`2026_06_15_000000_add_role_to_users_table.php`) deja
`default('editor')` en la columna. Con el registro público cerrado y el panel
exigiendo rol explícito, ese default ya no es alcanzable por ningún flujo
conocido (`CreateNewUser` ya no se invoca; `UserRequest::rules()` exige
`role` y `authorize()` exige `super_admin`). Queda como riesgo residual solo
si en el futuro algo inserta un usuario sin pasar por esos dos puntos (un
comando, un seeder, una migración de datos).

Se evaluó bajar el default a `viewer` con una migración, pero el motor de BD
de este proyecto es SQLite, que no soporta `ALTER TABLE ... ALTER COLUMN`
(solo `RENAME COLUMN` / `ADD COLUMN` / `DROP COLUMN`); cambiar un default
exige recrear la tabla completa, y no hay `doctrine/dbal` instalado para que
Laravel lo haga por nosotros. Instalar esa dependencia o recrear la tabla a
mano para cerrar un riesgo ya mitigado en la capa de aplicación no se
considera necesario para este cierre. Si se decide abordarlo más adelante,
debe hacerse como cambio de esquema explícito y revisado, no como parche de
última hora.
