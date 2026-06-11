# Propuesta futura — editor, media e i18n

Ultima revision: 11 de junio de 2026.

## Estado actual

Este modulo no esta implementado todavia.

No existen aun:

- blog administrable;
- editor WYSIWYG;
- media library;
- gestion real de imagenes desde admin;
- internacionalizacion de producto;
- estrategia multidioma conectada a base de datos.

## Papel de este documento

Servir como propuesta tecnica futura, no como descripcion de algo ya construido.

## Orden recomendado

Este trabajo no debe abordarse antes de:

1. fase de base de datos;
2. fase de estructura vacia de modulos;
3. fase de panel admin basico para entidades principales.

## Decisiones base que si quedan preparadas

### Editor

- candidato recomendado: Tiptap;
- almacenamiento recomendado: JSON estructurado;
- alt obligatorio en imagenes insertadas;
- sin contenido HTML libre como base principal.

### Media

- los assets publicos del proyecto ya tienen una organizacion clara;
- cuando exista media library, debera respetar la separacion entre marca propia, logos de empresas y contenidos editoriales;
- las rutas y formatos deberan priorizar archivos optimizados para web.

### i18n

- no existe todavia i18n funcional del producto;
- cualquier estrategia multidioma debe aplazarse a una fase posterior;
- primero hay que estabilizar datos, modulos y panel admin en un solo idioma.

## Fuera de alcance ahora

- toolbar de editor;
- subida de imagenes desde admin;
- programacion editorial;
- traduccion de contenido;
- rutas localizadas;
- SEO internacional.
