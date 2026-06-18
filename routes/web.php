<?php

use App\Http\Controllers\Public\BookingController;
use App\Http\Controllers\Public\ContactController;
use App\Http\Controllers\Public\ProjectController;
use App\Http\Controllers\Public\ServiceController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'Public/Home')->name('home');
Route::inertia('/metodologia', 'Public/Methodology')->name('methodology.show');
Route::get('/servicios', [ServiceController::class, 'index'])->name('services.show');
Route::get('/servicios/{slug}', [ServiceController::class, 'show'])->name('services.detail');
Route::get('/proyectos', [ProjectController::class, 'index'])->name('projects.show');

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
