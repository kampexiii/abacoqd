# Assets institucionales

Logos del bloque institucional discreto del footer (docs/02_MODELO_DATOS.md
§ `settings.institutional`): cofinanciación UE, Fondos Europeos y partners
de certificación/red. No son `partners` ni `projects`; no se mezclan con
colaboraciones salvo decisión explícita.

## Estructura

- `originales/`: archivo oficial descargado sin alterar.
- `optimizados/`: versión final para web (SVG o WEBP), con sufijo `-dark`
  cuando existe variante para fondo oscuro.

## Estado por logo

Ver `logos-manifest.json` para fuente, licencia y notas de cada logo.

- `eu-cofinanciado`: verificado, oficial (Comisión Europea), con variante
  clara y oscura.
- `fondos-europeos`: verificado, fuente pública (Gobierno de España vía
  Wikimedia Commons, CC BY 4.0), sin variante oscura oficial — se muestra
  sobre una tarjeta clara en el footer para no recolorear el original.
- `benow-partner`: pendiente. No se ha podido verificar la empresa/red
  correcta; falta que el cliente aporte el archivo o la web oficial.

## Normas de nombres

Mismas reglas que `public/assets/branding/empresas/README.md`: `kebab-case`,
sin espacios/tildes/mayúsculas, sin sufijos sucios.
