<?php

namespace App\Providers;

use App\Actions\Fortify\CreateNewUser;
use App\Actions\Fortify\ResetUserPassword;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use Laravel\Fortify\Fortify;

class FortifyServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureActions();
        $this->configureViews();
        $this->configureRateLimiting();
        $this->throttlePasswordResetRoutes();
    }

    /**
     * Configure Fortify actions.
     */
    private function configureActions(): void
    {
        Fortify::resetUserPasswordsUsing(ResetUserPassword::class);
        Fortify::createUsersUsing(CreateNewUser::class);
    }

    /**
     * Configure Fortify views.
     */
    private function configureViews(): void
    {
        Fortify::loginView(fn (Request $request) => Inertia::render('auth/login', [
            'canResetPassword' => Features::enabled(Features::resetPasswords()),
            'status' => $request->session()->get('status'),
        ]));

        Fortify::resetPasswordView(fn (Request $request) => Inertia::render('auth/reset-password', [
            'email' => $request->email,
            'token' => $request->route('token'),
            'passwordRules' => Password::defaults()->toPasswordRulesString(),
        ]));

        Fortify::requestPasswordResetLinkView(fn (Request $request) => Inertia::render('auth/forgot-password', [
            'status' => $request->session()->get('status'),
        ]));

        Fortify::verifyEmailView(fn (Request $request) => Inertia::render('auth/verify-email', [
            'status' => $request->session()->get('status'),
        ]));

        // Sin Fortify::registerView(): el registro público está desactivado
        // (config/fortify.php) y la página `auth/register.tsx` se eliminó al
        // quedar inalcanzable; este callback nunca se invoca mientras el
        // feature siga apagado.

        Fortify::twoFactorChallengeView(fn () => Inertia::render('auth/two-factor-challenge'));

        Fortify::confirmPasswordView(fn () => Inertia::render('auth/confirm-password'));
    }

    /**
     * Configure rate limiting.
     */
    private function configureRateLimiting(): void
    {
        RateLimiter::for('two-factor', function (Request $request) {
            return Limit::perMinute(5)->by($request->session()->get('login.id'));
        });

        RateLimiter::for('login', function (Request $request) {
            $throttleKey = Str::transliterate(Str::lower($request->input(Fortify::username())).'|'.$request->ip());

            return Limit::perMinute(5)->by($throttleKey);
        });

        RateLimiter::for('passkeys', function (Request $request) {
            return Limit::perMinute(10)->by(
                ($request->input('credential.id') ?: $request->session()->getId()).'|'.$request->ip(),
            );
        });

        // Por IP, no por email+IP como `login`: el riesgo aquí es pulverizar
        // `/forgot-password` con muchos emails distintos para enumerar
        // cuentas, no solo repetir el mismo. El propio password broker de
        // Laravel ya throttla por email (un email no recibe dos enlaces en
        // menos de 60s); esto cubre el caso que ese mecanismo no toca.
        RateLimiter::for('password-reset', function (Request $request) {
            return Limit::perMinute(6)->by($request->ip());
        });
    }

    /**
     * Fortify no expone una clave en `fortify.limiters` para sus rutas de
     * "olvidé mi contraseña" (a diferencia de login/two-factor/passkeys), así
     * que `/forgot-password` y `/reset-password` salen sin throttle alguno
     * por defecto: una vía abierta para enumerar emails o bombardear
     * bandejas de entrada con enlaces de reseteo. Se añade aquí el
     * middleware sobre las rutas ya registradas, tras que todos los
     * providers hayan arrancado (las rutas de Fortify se registran en su
     * propio provider, no en `routes/web.php`).
     *
     * No se usa `RouteCollection::getByName()`: su `nameList` interno se
     * reconstruye en un callback `booted()` que el `RouteServiceProvider` de
     * Laravel registra DESPUÉS de este (arranca más tarde que los providers
     * de la app), así que en este punto el lookup por nombre aún está
     * obsoleto. `Route::getName()` sí lee el nombre real ya asignado, así
     * que se recorre la colección comparándolo directamente.
     */
    private function throttlePasswordResetRoutes(): void
    {
        $this->app->booted(function (): void {
            foreach (Route::getRoutes()->get() as $route) {
                if (in_array($route->getName(), ['password.email', 'password.update'], true)) {
                    $route->middleware('throttle:password-reset');
                }
            }
        });
    }
}
