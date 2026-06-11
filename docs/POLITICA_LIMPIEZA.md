# Política de Limpieza y Eliminación de Código

## Principio General

El repositorio no debe almacenar código, componentes, archivos, dependencias o configuraciones que no formen parte del producto final.

Git constituye el historial del proyecto.

Por tanto:

- No se conservarán archivos "por si acaso".
- No se conservarán implementaciones antiguas.
- No se conservarán versiones duplicadas.
- No se conservarán pruebas temporales una vez finalizadas.
- No se conservarán dependencias sin uso verificable.

---

## Regla de Eliminación

Un elemento debe eliminarse cuando se cumplan simultáneamente las siguientes condiciones:

1. Se ha comprobado que no existe ninguna referencia activa.
2. No forma parte del roadmap aprobado.
3. No existe una tarea futura que dependa de él.
4. La eliminación ha sido validada mediante búsqueda global y revisión técnica.

Cumplidas estas condiciones: **el elemento se elimina definitivamente.**

---

## Prohibiciones

Queda prohibido:

- Crear carpetas `Backup/`, `Old/`, `Legacy/`
- Crear archivos `*_old.*`, `*_backup.*`, `*_final_v2.*`
- Comentar bloques completos de código para conservarlos

Todo historial pertenece al sistema de control de versiones.

---

## Revisión Obligatoria

Al finalizar cada sprint deberá realizarse una auditoría de:

| Categoría | Qué revisar |
|-----------|-------------|
| Archivos | Sin referencias desde ningún otro archivo |
| Componentes React | Sin imports activos |
| Rutas | Sin controlador asociado o sin enlace que las invoque |
| Controladores | Sin ruta que los llame |
| Tablas / migraciones | Sin modelo Eloquent que las use |
| Dependencias npm | Sin import en ningún archivo fuente |
| Dependencias Composer | Sin `use` en ninguna clase |
| Variables CSS | Sin clase Tailwind ni referencia directa |
| Traducciones | Sin clave `t()` que las invoque |
| Documentos | Sin referencia desde el índice ni desde otro doc activo |

Cualquier elemento confirmado como innecesario deberá eliminarse antes de comenzar el siguiente sprint.

---

## Aplicación a la documentación

Esta política aplica también a los archivos de `docs/`. Un documento de documentación se elimina cuando:

- Existe otro documento que cubre el mismo tema con más detalle y está marcado como vigente.
- El documento original no añade información que no esté ya en el sustituto.
- No hay ninguna referencia activa desde el índice (`00-indice.md`) ni desde otro doc vigente.

Los documentos marcados como "Histórico" en el índice son candidatos inmediatos a eliminación bajo esta regla.

---

## Objetivo

Mantener una base de código pequeña, comprensible, mantenible y alineada únicamente con el producto real.
