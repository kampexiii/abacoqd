<?php

use App\Enums\UserRole;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\ServiceController as AdminServiceController;
use App\Http\Controllers\Public\AboutController;
use App\Http\Controllers\Public\BlogController;
use App\Http\Controllers\Public\BookingController;
use App\Http\Controllers\Public\ContactController;
use App\Http\Controllers\Public\HomeController;
use App\Http\Controllers\Public\ProjectController;
use App\Http\Controllers\Public\ServiceController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::inertia('/metodologia', 'Public/Methodology')->name('methodology.show');
Route::get('/servicios', [ServiceController::class, 'index'])->name('services.show');
Route::get('/servicios/{slug}', [ServiceController::class, 'show'])->name('services.detail');
Route::get('/proyectos', [ProjectController::class, 'index'])->name('projects.show');
Route::get('/proyectos/{slug}', [ProjectController::class, 'show'])->name('projects.detail');
Route::get('/quienes-somos', [AboutController::class, 'index'])->name('about.show');
Route::get('/blog', [BlogController::class, 'index'])->name('blog.show');
Route::get('/blog/{slug}', [BlogController::class, 'show'])->name('blog.detail');

Route::inertia('/aviso-legal', 'Public/LegalPage', ['kind' => 'notice'])->name('legal.notice');
Route::inertia('/privacidad', 'Public/LegalPage', ['kind' => 'privacy'])->name('legal.privacy');
Route::inertia('/cookies', 'Public/LegalPage', ['kind' => 'cookies'])->name('legal.cookies');

Route::get('/contacto', [ContactController::class, 'create'])->name('contact.show');
Route::post('/contacto', [ContactController::class, 'store'])
    ->middleware('throttle:public-forms')
    ->name('contact.store');

Route::get('/reserva', [BookingController::class, 'create'])->name('booking.show');
Route::post('/reserva', [BookingController::class, 'store'])
    ->middleware('throttle:public-forms')
    ->name('booking.store');

// El dashboard real vive en /admin/dashboard. /dashboard (destino por defecto
// de Fortify tras login/registro/verificación) reenvía a los roles de gestión
// al panel admin y al resto a la home pública; no renderiza dashboard propio.
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function (Request $request) {
        $user = $request->user();

        $canAccessAdmin = $user !== null && in_array($user->role, [
            UserRole::SuperAdmin,
            UserRole::Admin,
            UserRole::Editor,
        ], true);

        return $canAccessAdmin
            ? redirect()->route('admin.dashboard')
            : redirect('/');
    })->name('dashboard');
});

Route::middleware(['auth', 'admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::redirect('/', '/admin/dashboard');
        Route::get('dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

        Route::get('services', [AdminServiceController::class, 'index'])->name('services.index');
        Route::get('services/create', [AdminServiceController::class, 'create'])->name('services.create');
        Route::post('services', [AdminServiceController::class, 'store'])->name('services.store');
        Route::get('services/{service}/edit', [AdminServiceController::class, 'edit'])->name('services.edit');
        Route::match(['put', 'patch'], 'services/{service}', [AdminServiceController::class, 'update'])->name('services.update');
        Route::delete('services/{service}', [AdminServiceController::class, 'destroy'])->name('services.destroy');

        Route::patch('services/{service}/toggle-status', [AdminServiceController::class, 'toggleStatus'])->name('services.toggle-status');
        Route::patch('services/{service}/toggle-active', [AdminServiceController::class, 'toggleActive'])->name('services.toggle-active');
        Route::patch('services/{service}/toggle-featured', [AdminServiceController::class, 'toggleFeatured'])->name('services.toggle-featured');
        Route::patch('services/{service}/toggle-home', [AdminServiceController::class, 'toggleHome'])->name('services.toggle-home');
        Route::patch('services/{service}/toggle-detail', [AdminServiceController::class, 'toggleDetail'])->name('services.toggle-detail');
    });

require __DIR__.'/settings.php';
