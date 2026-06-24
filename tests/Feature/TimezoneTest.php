<?php

/**
 * Bloquea la zona horaria de la aplicación.
 *
 * El negocio opera en una sola región (España) y todo el dominio razona en
 * "hora de pared" local: franjas de reserva, fecha de publicación de posts,
 * consentimientos, etc. Con `UTC`, `now()` quedaba por detrás de las fechas
 * que el equipo introduce en local y reaparecían bugs (posts recién publicados
 * ocultos, compuertas de reserva desfasadas). Si alguien revierte la zona a
 * UTC, este test falla y avisa antes de que el bug vuelva.
 */
test('the application timezone is Europe/Madrid', function () {
    expect(config('app.timezone'))->toBe('Europe/Madrid')
        ->and(now()->getTimezone()->getName())->toBe('Europe/Madrid');
});
