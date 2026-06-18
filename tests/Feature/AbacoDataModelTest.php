<?php

use App\Enums\ContactMessageStatus;
use App\Enums\PermissionStatus;
use App\Enums\PostStatus;
use App\Enums\ProjectStatus;
use App\Models\ContactMessage;
use App\Models\Partner;
use App\Models\Post;
use App\Models\PostCategory;
use App\Models\Project;
use App\Models\Review;
use App\Models\SeoMetadata;
use App\Models\Service;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Support\Facades\Schema;

test('abacoqd core tables expose the expected structural columns', function () {
    expect(Schema::hasColumns('settings', ['group', 'key', 'value', 'type', 'is_public']))->toBeTrue()
        ->and(Schema::hasColumns('page_sections', ['page', 'key', 'title', 'subtitle', 'show_on_home', 'settings']))->toBeTrue()
        ->and(Schema::hasColumns('section_blocks', ['page_section_id', 'type', 'title', 'content', 'cta', 'settings']))->toBeTrue()
        ->and(Schema::hasColumns('methodology_steps', ['number', 'title', 'slug', 'summary', 'description', 'is_free_initial_study']))->toBeTrue()
        ->and(Schema::hasColumns('services', ['title', 'slug', 'summary', 'description', 'show_on_home', 'status']))->toBeTrue()
        ->and(Schema::hasColumns('partners', ['name', 'slug', 'type', 'permission_status', 'show_in_collaborations']))->toBeTrue()
        ->and(Schema::hasColumns('projects', ['title', 'slug', 'summary', 'challenge', 'solution', 'result', 'client_partner_id']))->toBeTrue()
        ->and(Schema::hasColumns('posts', ['post_category_id', 'user_id', 'title', 'slug', 'status', 'published_at']))->toBeTrue()
        ->and(Schema::hasColumns('seo_metadata', ['seoable_type', 'seoable_id', 'page_key', 'locale', 'schema_data']))->toBeTrue()
        ->and(Schema::hasColumn('users', 'role'))->toBeTrue();
});

test('projects partners reviews and seo metadata relationships are wired', function () {
    $partner = Partner::factory()->create([
        'permission_status' => PermissionStatus::Approved->value,
        'is_active' => true,
        'show_in_projects' => true,
        'show_in_collaborations' => true,
    ]);

    $project = Project::factory()->create([
        'client_partner_id' => $partner->id,
        'status' => ProjectStatus::Published->value,
        'permission_status' => PermissionStatus::Approved->value,
        'is_active' => true,
        'show_on_home' => true,
        'show_in_projects' => true,
        'show_in_collaborations' => true,
    ]);

    $project->partners()->attach($partner->id, ['role' => 'client', 'sort_order' => 1]);

    $review = Review::factory()->create([
        'partner_id' => $partner->id,
        'project_id' => $project->id,
        'permission_status' => PermissionStatus::Approved->value,
        'is_active' => true,
    ]);

    $seo = SeoMetadata::factory()->create([
        'seoable_type' => Project::class,
        'seoable_id' => $project->id,
        'page_key' => null,
        'locale' => 'es',
    ]);

    expect($project->clientPartner->is($partner))->toBeTrue()
        ->and($project->partners()->first()->is($partner))->toBeTrue()
        ->and($partner->projects()->first()->is($project))->toBeTrue()
        ->and($partner->reviews()->first()->is($review))->toBeTrue()
        ->and($project->reviews()->first()->is($review))->toBeTrue()
        ->and($project->seoMetadata->first()->is($seo))->toBeTrue()
        ->and(Project::published()->active()->permitted()->projects()->collaborations()->home()->count())->toBe(1);
});

test('posts tags authors and contact message scopes are wired', function () {
    $user = User::factory()->create();
    $category = PostCategory::factory()->create();
    $tag = Tag::factory()->create();

    $post = Post::factory()->create([
        'post_category_id' => $category->id,
        'user_id' => $user->id,
        'status' => PostStatus::Published->value,
        'published_at' => now()->subMinute(),
        'is_featured' => true,
        'show_on_home' => true,
    ]);

    $post->tags()->attach($tag->id);

    $service = Service::factory()->create();
    ContactMessage::factory()->create([
        'service_id' => $service->id,
        'status' => ContactMessageStatus::New->value,
    ]);

    expect($post->category->is($category))->toBeTrue()
        ->and($post->user->is($user))->toBeTrue()
        ->and($post->tags()->first()->is($tag))->toBeTrue()
        ->and($user->posts()->first()->is($post))->toBeTrue()
        ->and(Post::published()->featured()->home()->count())->toBe(1)
        ->and(ContactMessage::newMessages()->count())->toBe(1)
        ->and($service->contactMessages()->count())->toBe(1);
});
