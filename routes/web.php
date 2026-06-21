<?php

use App\Http\Controllers\Public\AboutController;
use App\Http\Controllers\Public\BlogController;
use App\Http\Controllers\Public\BookingController;
use App\Http\Controllers\Public\ContactController;
use App\Http\Controllers\Public\HomeController;
use App\Http\Controllers\Public\ProjectController;
use App\Http\Controllers\Public\ServiceController;
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

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
