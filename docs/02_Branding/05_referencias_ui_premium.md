# Referencias UI premium — estado de aplicacion real

Ultima revision: 11 de junio de 2026.

## Objetivo del documento

Mantener separadas las referencias visuales de lo que realmente esta construido.

## Estado actual

El proyecto solo tiene implementada la primera capa visual de la landing y el hero. El resto de patrones deben leerse como inspiracion o trabajo futuro.

## Patrones revisados y estado real

| Patron / referencia | Estado real | Nota |
|---|---|---|
| Header flotante | Aplicado | Existe en la landing actual. |
| Hero con profundidad visual | Aplicado | Existe en la portada actual. |
| Carruseles de logos en el hero | Aplicado parcialmente | La capa visual esta hecha; la fuente de datos sigue siendo estatica. |
| Separacion visual entre colaboraciones y clientes directos | Aplicado parcialmente | Existe a nivel de estructura y dataset temporal. |
| Sistema completo de cards de servicios | No implementado todavia | Queda para fases posteriores. |
| Seccion de proceso / timeline | No implementado todavia | Era referencia, no estado actual. |
| Grid de casos de exito | No implementado todavia | Queda ligado a proyectos reales y base de datos. |
| Blog teaser real | No implementado todavia | No hay blog funcional. |
| Social proof con logos reales validados | No implementado todavia | Requiere autorizacion y datos reales. |

## Decision de uso

Estas referencias siguen siendo utiles para orientar la evolucion visual, pero no deben usarse como prueba de funcionalidad implementada.

## Criterio para siguientes fases

- mantener la calidad visual del hero;
- no introducir UI ficticia para simular modulos inexistentes;
- conectar primero datos reales y estructura tecnica antes de ampliar secciones visuales;
- reutilizar los componentes ya creados cuando cambie la fuente de datos.
