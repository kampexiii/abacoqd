<?php

namespace Database\Seeders;

use App\Models\PostCategory;
use App\Models\Tag;
use Illuminate\Database\Seeder;

class BlogTaxonomySeeder extends Seeder
{
    /**
     * Seed base blog taxonomy without creating fake posts.
     */
    public function run(): void
    {
        $categories = [
            ['IA aplicada', 'Applied AI'],
            ['Desarrollo', 'Development'],
            ['Automatización', 'Automation'],
            ['CRM y datos', 'CRM and data'],
        ];

        foreach ($categories as $index => [$nameEs, $nameEn]) {
            PostCategory::updateOrCreate(
                ['sort_order' => $index + 1],
                [
                    'name' => ['es' => $nameEs, 'en' => $nameEn],
                    'slug' => [
                        'es' => str($nameEs)->slug()->toString(),
                        'en' => str($nameEn)->slug()->toString(),
                    ],
                    'description' => null,
                    'is_active' => true,
                ],
            );
        }

        $tags = [
            ['IA', 'AI'],
            ['Laravel', 'Laravel'],
            ['CRM', 'CRM'],
            ['Automatización', 'Automation'],
            ['MVP', 'MVP'],
        ];

        foreach ($tags as [$nameEs, $nameEn]) {
            $slugEs = str($nameEs)->slug()->toString();
            $tag = Tag::query()
                ->get()
                ->first(function (Tag $tag) use ($slugEs): bool {
                    $slug = $tag->getAttribute('slug');

                    return is_array($slug) && ($slug['es'] ?? null) === $slugEs;
                });

            if (! $tag instanceof Tag) {
                $tag = new Tag;
            }

            $tag->fill([
                'name' => ['es' => $nameEs, 'en' => $nameEn],
                'slug' => [
                    'es' => $slugEs,
                    'en' => str($nameEn)->slug()->toString(),
                ],
            ])->save();
        }
    }
}
