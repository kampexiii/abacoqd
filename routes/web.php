<?php

use App\Enums\UserRole;
use App\Http\Controllers\Admin\AppointmentBookingController as AdminAppointmentBookingController;
use App\Http\Controllers\Admin\AppointmentCalendarController as AdminAppointmentCalendarController;
use App\Http\Controllers\Admin\AppointmentDayController as AdminAppointmentDayController;
use App\Http\Controllers\Admin\AppointmentSlotController as AdminAppointmentSlotController;
use App\Http\Controllers\Admin\BookingSettingController as AdminBookingSettingController;
use App\Http\Controllers\Admin\ContactMessageController as AdminContactMessageController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\FaqController as AdminFaqController;
use App\Http\Controllers\Admin\PartnerController as AdminPartnerController;
use App\Http\Controllers\Admin\PostCategoryController as AdminPostCategoryController;
use App\Http\Controllers\Admin\PostController as AdminPostController;
use App\Http\Controllers\Admin\ProjectController as AdminProjectController;
use App\Http\Controllers\Admin\ServiceController as AdminServiceController;
use App\Http\Controllers\Admin\SettingController as AdminSettingController;
use App\Http\Controllers\Admin\TagController as AdminTagController;
use App\Http\Controllers\Admin\TeamMemberController as AdminTeamMemberController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Public\AboutController;
use App\Http\Controllers\Public\BlogController;
use App\Http\Controllers\Public\BookingController;
use App\Http\Controllers\Public\ContactController;
use App\Http\Controllers\Public\HomeController;
use App\Http\Controllers\Public\ProjectController;
use App\Http\Controllers\Public\ServiceController;
use App\Http\Controllers\Public\SitemapController;
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

Route::get('/sitemap.xml', SitemapController::class)->name('sitemap');

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
        Route::patch('services/{service}/toggle-home', [AdminServiceController::class, 'toggleHome'])->name('services.toggle-home');
        Route::patch('services/{service}/toggle-detail', [AdminServiceController::class, 'toggleDetail'])->name('services.toggle-detail');

        Route::get('posts', [AdminPostController::class, 'index'])->name('posts.index');
        Route::get('posts/create', [AdminPostController::class, 'create'])->name('posts.create');
        Route::post('posts', [AdminPostController::class, 'store'])->name('posts.store');
        Route::get('posts/{post}/edit', [AdminPostController::class, 'edit'])->name('posts.edit');
        Route::match(['put', 'patch'], 'posts/{post}', [AdminPostController::class, 'update'])->name('posts.update');
        Route::delete('posts/{post}', [AdminPostController::class, 'destroy'])->name('posts.destroy');
        Route::patch('posts/{post}/toggle-featured', [AdminPostController::class, 'toggleFeatured'])->name('posts.toggle-featured');

        Route::get('post-categories', [AdminPostCategoryController::class, 'index'])->name('post-categories.index');
        Route::post('post-categories', [AdminPostCategoryController::class, 'store'])->name('post-categories.store');
        Route::match(['put', 'patch'], 'post-categories/{postCategory}', [AdminPostCategoryController::class, 'update'])->name('post-categories.update');
        Route::delete('post-categories/{postCategory}', [AdminPostCategoryController::class, 'destroy'])->name('post-categories.destroy');

        Route::get('tags', [AdminTagController::class, 'index'])->name('tags.index');
        Route::post('tags', [AdminTagController::class, 'store'])->name('tags.store');
        Route::match(['put', 'patch'], 'tags/{tag}', [AdminTagController::class, 'update'])->name('tags.update');
        Route::delete('tags/{tag}', [AdminTagController::class, 'destroy'])->name('tags.destroy');

        Route::get('partners', [AdminPartnerController::class, 'index'])->name('partners.index');
        Route::get('partners/create', [AdminPartnerController::class, 'create'])->name('partners.create');
        Route::post('partners', [AdminPartnerController::class, 'store'])->name('partners.store');
        Route::get('partners/{partner}/edit', [AdminPartnerController::class, 'edit'])->name('partners.edit');
        Route::match(['put', 'patch'], 'partners/{partner}', [AdminPartnerController::class, 'update'])->name('partners.update');
        Route::delete('partners/{partner}', [AdminPartnerController::class, 'destroy'])->name('partners.destroy');
        Route::patch('partners/{partner}/toggle-active', [AdminPartnerController::class, 'toggleActive'])->name('partners.toggle-active');
        Route::patch('partners/{partner}/toggle-collaborations', [AdminPartnerController::class, 'toggleCollaborations'])->name('partners.toggle-collaborations');

        Route::get('projects', [AdminProjectController::class, 'index'])->name('projects.index');
        Route::get('projects/create', [AdminProjectController::class, 'create'])->name('projects.create');
        Route::post('projects', [AdminProjectController::class, 'store'])->name('projects.store');
        Route::get('projects/{project}/edit', [AdminProjectController::class, 'edit'])->name('projects.edit');
        Route::match(['put', 'patch'], 'projects/{project}', [AdminProjectController::class, 'update'])->name('projects.update');
        Route::delete('projects/{project}', [AdminProjectController::class, 'destroy'])->name('projects.destroy');
        Route::patch('projects/{project}/toggle-active', [AdminProjectController::class, 'toggleActive'])->name('projects.toggle-active');
        Route::patch('projects/{project}/toggle-home', [AdminProjectController::class, 'toggleHome'])->name('projects.toggle-home');
        Route::patch('projects/{project}/toggle-projects', [AdminProjectController::class, 'toggleProjects'])->name('projects.toggle-projects');
        Route::patch('projects/{project}/toggle-collaborations', [AdminProjectController::class, 'toggleCollaborations'])->name('projects.toggle-collaborations');

        Route::get('team-members', [AdminTeamMemberController::class, 'index'])->name('team-members.index');
        Route::get('team-members/create', [AdminTeamMemberController::class, 'create'])->name('team-members.create');
        Route::post('team-members', [AdminTeamMemberController::class, 'store'])->name('team-members.store');
        Route::get('team-members/{teamMember}/edit', [AdminTeamMemberController::class, 'edit'])->name('team-members.edit');
        Route::match(['put', 'patch'], 'team-members/{teamMember}', [AdminTeamMemberController::class, 'update'])->name('team-members.update');
        Route::delete('team-members/{teamMember}', [AdminTeamMemberController::class, 'destroy'])->name('team-members.destroy');
        Route::patch('team-members/{teamMember}/toggle-active', [AdminTeamMemberController::class, 'toggleActive'])->name('team-members.toggle-active');
        Route::patch('team-members/{teamMember}/toggle-visible', [AdminTeamMemberController::class, 'toggleVisible'])->name('team-members.toggle-visible');

        Route::redirect('booking', '/admin/booking/calendar');

        // Reservas/agenda contienen PII y disponibilidad operativa: solo
        // super_admin/admin, igual que contacts/users/settings más abajo.
        Route::middleware('role:super_admin,admin')->group(function () {
            Route::get('booking/calendar', [AdminAppointmentCalendarController::class, 'index'])->name('booking.calendar.index');
            Route::post('booking/calendar/generate', [AdminAppointmentCalendarController::class, 'generate'])->name('booking.calendar.generate');
            Route::post('booking/calendar/block', [AdminAppointmentCalendarController::class, 'block'])->name('booking.calendar.block');

            Route::get('booking/days', [AdminAppointmentDayController::class, 'index'])->name('booking.days.index');
            Route::get('booking/days/create', [AdminAppointmentDayController::class, 'create'])->name('booking.days.create');
            Route::post('booking/days', [AdminAppointmentDayController::class, 'store'])->name('booking.days.store');
            Route::get('booking/days/{day}/edit', [AdminAppointmentDayController::class, 'edit'])->name('booking.days.edit');
            Route::match(['put', 'patch'], 'booking/days/{day}', [AdminAppointmentDayController::class, 'update'])->name('booking.days.update');
            Route::delete('booking/days/{day}', [AdminAppointmentDayController::class, 'destroy'])->name('booking.days.destroy');
            Route::patch('booking/days/{day}/toggle-available', [AdminAppointmentDayController::class, 'toggleAvailable'])->name('booking.days.toggle-available');
            Route::patch('booking/days/{day}/toggle-blocked', [AdminAppointmentDayController::class, 'toggleBlocked'])->name('booking.days.toggle-blocked');

            Route::get('booking/slots', [AdminAppointmentSlotController::class, 'index'])->name('booking.slots.index');
            Route::get('booking/slots/create', [AdminAppointmentSlotController::class, 'create'])->name('booking.slots.create');
            Route::post('booking/slots', [AdminAppointmentSlotController::class, 'store'])->name('booking.slots.store');
            Route::get('booking/slots/{slot}/edit', [AdminAppointmentSlotController::class, 'edit'])->name('booking.slots.edit');
            Route::match(['put', 'patch'], 'booking/slots/{slot}', [AdminAppointmentSlotController::class, 'update'])->name('booking.slots.update');
            Route::delete('booking/slots/{slot}', [AdminAppointmentSlotController::class, 'destroy'])->name('booking.slots.destroy');
            Route::patch('booking/slots/{slot}/toggle-blocked', [AdminAppointmentSlotController::class, 'toggleBlocked'])->name('booking.slots.toggle-blocked');

            Route::get('booking/bookings', [AdminAppointmentBookingController::class, 'index'])->name('booking.bookings.index');
            Route::get('booking/bookings/{booking}', [AdminAppointmentBookingController::class, 'show'])->name('booking.bookings.show');
            Route::match(['put', 'patch'], 'booking/bookings/{booking}', [AdminAppointmentBookingController::class, 'update'])->name('booking.bookings.update');

            Route::get('booking/settings', [AdminBookingSettingController::class, 'edit'])->name('booking.settings.edit');
            Route::match(['put', 'patch'], 'booking/settings', [AdminBookingSettingController::class, 'update'])->name('booking.settings.update');
        });

        Route::get('faqs', [AdminFaqController::class, 'index'])->name('faqs.index');
        Route::get('faqs/create', [AdminFaqController::class, 'create'])->name('faqs.create');
        Route::post('faqs', [AdminFaqController::class, 'store'])->name('faqs.store');
        Route::get('faqs/{faq}/edit', [AdminFaqController::class, 'edit'])->name('faqs.edit');
        Route::match(['put', 'patch'], 'faqs/{faq}', [AdminFaqController::class, 'update'])->name('faqs.update');
        Route::delete('faqs/{faq}', [AdminFaqController::class, 'destroy'])->name('faqs.destroy');
        Route::patch('faqs/{faq}/toggle-active', [AdminFaqController::class, 'toggleActive'])->name('faqs.toggle-active');
        Route::patch('faqs/{faq}/toggle-chatbot', [AdminFaqController::class, 'toggleChatbot'])->name('faqs.toggle-chatbot');
        Route::patch('faqs/{faq}/toggle-page', [AdminFaqController::class, 'togglePage'])->name('faqs.toggle-page');

        // Gestión de usuarios: exclusiva de super_admin.
        Route::middleware('role:super_admin')->group(function () {
            Route::get('users', [AdminUserController::class, 'index'])->name('users.index');
            Route::get('users/create', [AdminUserController::class, 'create'])->name('users.create');
            Route::post('users', [AdminUserController::class, 'store'])->name('users.store');
            Route::get('users/{user}/edit', [AdminUserController::class, 'edit'])->name('users.edit');
            Route::match(['put', 'patch'], 'users/{user}', [AdminUserController::class, 'update'])->name('users.update');
            Route::delete('users/{user}', [AdminUserController::class, 'destroy'])->name('users.destroy');
            Route::patch('users/{user}/reset-password', [AdminUserController::class, 'resetPassword'])->name('users.reset-password');
        });

        // Contactos/leads contienen PII: editor sin acceso, solo super_admin/admin.
        Route::middleware('role:super_admin,admin')->group(function () {
            Route::get('contacts', [AdminContactMessageController::class, 'index'])->name('contacts.index');
            Route::get('contacts/{contactMessage}', [AdminContactMessageController::class, 'show'])->name('contacts.show');
            Route::match(['put', 'patch'], 'contacts/{contactMessage}', [AdminContactMessageController::class, 'update'])->name('contacts.update');
            Route::delete('contacts/{contactMessage}', [AdminContactMessageController::class, 'destroy'])->name('contacts.destroy');
            Route::delete('contacts', [AdminContactMessageController::class, 'purge'])->name('contacts.purge');
        });

        Route::middleware('role:super_admin,admin')->group(function () {
            Route::get('settings', [AdminSettingController::class, 'edit'])->name('settings.edit');
            Route::match(['put', 'patch'], 'settings', [AdminSettingController::class, 'update'])->name('settings.update');
        });
    });

require __DIR__.'/settings.php';
