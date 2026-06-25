/**
 * Compuerta de carga de scripts externos — preparada pero INERTE en esta fase.
 *
 * Para que un loader externo pudiera ejecutarse deben cumplirse TODAS:
 *   1. La persona usuaria ha consentido la categoría correspondiente.
 *   2. `ABACO_EXTERNAL_TRACKING_ENABLED` es true (prop `consent.externalTracking`).
 *   3. Hay un loader registrado para esa categoría.
 *
 * En esta fase NO se registra ningún loader y `externalTracking` es false, así
 * que NO se carga nada externo aunque se acepte todo. Las funciones
 * `register*Loader` existen para el futuro; hoy no cargan nada.
 */

import type { ConsentCategories } from '@/hooks/use-consent';

export type ScriptLoader = () => void;

export type GateContext = {
    readonly categories: ConsentCategories;
    readonly externalTrackingEnabled: boolean;
};

const analyticsLoaders: ScriptLoader[] = [];
const marketingLoaders: ScriptLoader[] = [];

export function canLoadAnalytics(ctx: GateContext): boolean {
    return ctx.externalTrackingEnabled && ctx.categories.analytics;
}

export function canLoadMarketing(ctx: GateContext): boolean {
    return ctx.externalTrackingEnabled && ctx.categories.marketing;
}

/** Registra un loader externo de analítica (no se ejecuta hasta abrir la compuerta). */
export function registerAnalyticsLoader(loader: ScriptLoader): void {
    analyticsLoaders.push(loader);
}

/** Registra un loader externo de marketing/comportamiento (inerte hoy). */
export function registerMarketingLoader(loader: ScriptLoader): void {
    marketingLoaders.push(loader);
}

/**
 * Ejecuta los loaders permitidos por el consentimiento actual. En esta fase no
 * hay loaders registrados y `externalTrackingEnabled` es false, así que es un
 * no-op: NO carga ningún script externo.
 */
export function runPermittedLoaders(ctx: GateContext): void {
    if (canLoadAnalytics(ctx)) {
        analyticsLoaders.forEach((load) => load());
    }

    if (canLoadMarketing(ctx)) {
        marketingLoaders.forEach((load) => load());
    }
}
