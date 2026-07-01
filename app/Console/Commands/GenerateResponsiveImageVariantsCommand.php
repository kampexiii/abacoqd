<?php

namespace App\Console\Commands;

use App\Models\Partner;
use App\Models\Post;
use App\Models\Project;
use App\Models\Service;
use App\Models\TeamMember;
use App\Support\Media\ImageVariantService;
use Illuminate\Console\Command;

class GenerateResponsiveImageVariantsCommand extends Command
{
    protected $signature = 'media:generate-responsive-variants
        {--dry-run : Show pending variants without writing files}';

    protected $description = 'Generate missing responsive WebP variants for existing referenced uploads.';

    public function __construct(private readonly ImageVariantService $images)
    {
        parent::__construct();
    }

    public function handle(): int
    {
        $dryRun = (bool) $this->option('dry-run');
        $targets = $this->collectTargets();
        $missingCount = 0;
        $createdCount = 0;
        $skipped = [];

        $this->info(($dryRun ? 'Dry run' : 'Backfill').' responsive upload variants');
        $this->line('Referenced upload images: '.count($targets));

        foreach ($targets as $target) {
            $result = $this->images->generateVariantsForExistingPublicPath(
                $target['path'],
                $target['widths'],
                $dryRun,
            );

            if ($result['skipped']) {
                $reason = $result['reason'] ?? 'unknown';
                $skipped[$reason] = ($skipped[$reason] ?? 0) + 1;

                continue;
            }

            $missingCount += count($result['missing']);
            $createdCount += count($result['created']);

            if ($result['missing'] !== [] || $result['created'] !== []) {
                $this->line(sprintf(
                    '- %s [%s]: %d pending, %d created',
                    $target['path'],
                    implode(', ', $target['sources']),
                    count($result['missing']),
                    count($result['created']),
                ));
            }
        }

        $this->newLine();
        $this->line('Missing variants: '.$missingCount);
        $this->line('Created variants: '.$createdCount);

        foreach ($skipped as $reason => $count) {
            $this->line("Skipped {$reason}: {$count}");
        }

        if ($dryRun) {
            $this->comment('Dry run complete. No files were written.');
        }

        return self::SUCCESS;
    }

    /**
     * @return array<string, array{path: string, widths: list<int>, sources: list<string>}>
     */
    private function collectTargets(): array
    {
        $targets = [];

        Service::query()
            ->whereNotNull('image')
            ->pluck('image')
            ->each(function (mixed $path) use (&$targets): void {
                $this->addTarget(
                    $targets,
                    $path,
                    ImageVariantService::SERVICE_WIDTHS,
                    'services.image',
                );
            });

        Post::query()
            ->whereNotNull('featured_image')
            ->pluck('featured_image')
            ->each(function (mixed $path) use (&$targets): void {
                $this->addTarget(
                    $targets,
                    $path,
                    ImageVariantService::BLOG_WIDTHS,
                    'posts.featured_image',
                );
            });

        Project::query()
            ->get(['cover_image', 'thumbnail_image', 'gallery', 'logo', 'logo_dark'])
            ->each(function (Project $project) use (&$targets): void {
                $this->addTarget(
                    $targets,
                    $project->cover_image,
                    ImageVariantService::PROJECT_WIDTHS,
                    'projects.cover_image',
                );
                $this->addTarget(
                    $targets,
                    $project->thumbnail_image,
                    ImageVariantService::PROJECT_WIDTHS,
                    'projects.thumbnail_image',
                );
                $this->addTarget(
                    $targets,
                    $project->logo,
                    ImageVariantService::LOGO_WIDTHS,
                    'projects.logo',
                );
                $this->addTarget(
                    $targets,
                    $project->logo_dark,
                    ImageVariantService::LOGO_WIDTHS,
                    'projects.logo_dark',
                );

                foreach ($this->stringList($project->gallery) as $galleryPath) {
                    $this->addTarget(
                        $targets,
                        $galleryPath,
                        ImageVariantService::PROJECT_WIDTHS,
                        'projects.gallery',
                    );
                }
            });

        Partner::query()
            ->get(['logo', 'logo_dark'])
            ->each(function (Partner $partner) use (&$targets): void {
                $this->addTarget(
                    $targets,
                    $partner->logo,
                    ImageVariantService::LOGO_WIDTHS,
                    'partners.logo',
                );
                $this->addTarget(
                    $targets,
                    $partner->logo_dark,
                    ImageVariantService::LOGO_WIDTHS,
                    'partners.logo_dark',
                );
            });

        TeamMember::query()
            ->whereNotNull('photo')
            ->pluck('photo')
            ->each(function (mixed $path) use (&$targets): void {
                $this->addTarget(
                    $targets,
                    $path,
                    ImageVariantService::TEAM_MEMBER_WIDTHS,
                    'team_members.photo',
                );
            });

        ksort($targets);

        return $targets;
    }

    /**
     * @param  array<string, array{path: string, widths: list<int>, sources: list<string>}>  $targets
     * @param  list<int>  $widths
     */
    private function addTarget(array &$targets, mixed $path, array $widths, string $source): void
    {
        if (! is_string($path) || $path === '' || ! str_starts_with($path, '/uploads/')) {
            return;
        }

        if (preg_match('/-\d+w\.webp$/', $path) === 1) {
            return;
        }

        if (! isset($targets[$path])) {
            $targets[$path] = [
                'path' => $path,
                'widths' => [],
                'sources' => [],
            ];
        }

        $targets[$path]['widths'] = $this->mergeWidths($targets[$path]['widths'], $widths);

        if (! in_array($source, $targets[$path]['sources'], true)) {
            $targets[$path]['sources'][] = $source;
        }
    }

    /**
     * @param  list<int>  $current
     * @param  list<int>  $incoming
     * @return list<int>
     */
    private function mergeWidths(array $current, array $incoming): array
    {
        $merged = array_values(array_unique(array_filter(
            [...$current, ...array_map('intval', $incoming)],
            fn (int $width): bool => $width > 0,
        )));

        sort($merged);

        return $merged;
    }

    /**
     * @return list<string>
     */
    private function stringList(mixed $value): array
    {
        if (! is_array($value)) {
            return [];
        }

        $items = [];

        foreach ($value as $item) {
            if (is_string($item) && $item !== '') {
                $items[] = $item;
            }
        }

        return $items;
    }
}
