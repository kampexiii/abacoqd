<?php

namespace App\Support\Media;

use App\Support\SvgSafetyGuard;
use GdImage;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use InvalidArgumentException;
use RuntimeException;

class ImageVariantService
{
    public const BLOG_WIDTHS = [480, 640, 960, 1280];

    public const PROJECT_WIDTHS = [640, 960, 1280, 1600];

    public const SERVICE_WIDTHS = [480, 640, 960, 1280];

    public const TEAM_MEMBER_WIDTHS = [320, 512, 768];

    public const LOGO_WIDTHS = [320, 640];

    private const DISK = 'public_uploads';

    private const PUBLIC_PREFIX = '/uploads/';

    private const QUALITY = 88;

    /**
     * @param  list<int>  $widths
     * @return array{path: string, variants: list<string>}
     */
    public function storeFromPath(
        string|UploadedFile $source,
        string $directory,
        string $basename,
        array $widths,
        ?string $extensionHint = null,
        bool $allowSvg = false,
    ): array {
        [$sourcePath, $extension] = $this->resolveSource($source, $extensionHint);
        [$directory, $basename] = $this->normalizeTarget($directory, $basename);

        if ($extension === 'svg') {
            if (! $allowSvg) {
                throw new InvalidArgumentException('Formato de imagen no soportado: usa PNG, JPEG o WebP.');
            }

            return $this->storeSvg($sourcePath, $directory, $basename);
        }

        return $this->storeRaster($sourcePath, $directory, $basename, $widths);
    }

    /**
     * @param  list<int>  $widths
     * @return list<array{width: int, src: string}>
     */
    public function existingVariants(?string $publicPath, array $widths): array
    {
        $relative = $this->relativePathFromPublic($publicPath);

        if ($relative === null || ! $this->isRasterRelativePath($relative)) {
            return [];
        }

        $variants = [];

        foreach ($this->normalizedWidths($widths, null) as $width) {
            $variantRelative = $this->variantRelativePath($relative, $width);

            if (Storage::disk(self::DISK)->exists($variantRelative)) {
                $variants[] = [
                    'width' => $width,
                    'src' => self::PUBLIC_PREFIX.$variantRelative,
                ];
            }
        }

        return $variants;
    }

    public function deletePublicPath(?string $publicPath): void
    {
        $relative = $this->relativePathFromPublic($publicPath);

        if ($relative === null) {
            return;
        }

        $paths = [$relative, ...$this->associatedVariantRelativePaths($relative)];

        Storage::disk(self::DISK)->delete(array_values(array_unique($paths)));
    }

    /**
     * @param  list<int>  $widths
     * @return array{
     *     path: string,
     *     skipped: bool,
     *     reason: string|null,
     *     original_width: int|null,
     *     original_height: int|null,
     *     expected: list<string>,
     *     missing: list<string>,
     *     created: list<string>
     * }
     */
    public function generateVariantsForExistingPublicPath(string $publicPath, array $widths, bool $dryRun = false): array
    {
        $emptyResult = [
            'path' => $publicPath,
            'skipped' => true,
            'reason' => null,
            'original_width' => null,
            'original_height' => null,
            'expected' => [],
            'missing' => [],
            'created' => [],
        ];

        $relative = $this->relativePathFromPublic($publicPath);

        if ($relative === null) {
            return [...$emptyResult, 'reason' => 'outside_uploads'];
        }

        if ($this->isVariantRelativePath($relative)) {
            return [...$emptyResult, 'reason' => 'already_variant'];
        }

        $extension = strtolower(pathinfo($relative, PATHINFO_EXTENSION));

        if ($extension === 'svg') {
            return [...$emptyResult, 'reason' => 'svg'];
        }

        if (! $this->isRasterExtension($extension)) {
            return [...$emptyResult, 'reason' => 'unsupported_extension'];
        }

        if (! Storage::disk(self::DISK)->exists($relative)) {
            return [...$emptyResult, 'reason' => 'missing_source'];
        }

        $sourcePath = Storage::disk(self::DISK)->path($relative);
        $info = getimagesize($sourcePath);

        if ($info === false || empty($info[0]) || empty($info[1])) {
            return [...$emptyResult, 'reason' => 'invalid_image'];
        }

        $sourceWidth = (int) $info[0];
        $sourceHeight = (int) $info[1];
        $expected = [];
        $missing = [];

        foreach ($this->normalizedWidths($widths, $sourceWidth) as $width) {
            $variantRelative = $this->variantRelativePath($relative, $width);
            $variantPublic = self::PUBLIC_PREFIX.$variantRelative;
            $expected[] = $variantPublic;

            if (! Storage::disk(self::DISK)->exists($variantRelative)) {
                $missing[] = $variantPublic;
            }
        }

        if ($missing === [] || $dryRun) {
            return [
                ...$emptyResult,
                'skipped' => false,
                'reason' => null,
                'original_width' => $sourceWidth,
                'original_height' => $sourceHeight,
                'expected' => $expected,
                'missing' => $missing,
            ];
        }

        $this->assertGdCanWriteWebp();

        $image = $this->readImage($sourcePath, (int) $info[2]);
        $created = [];

        try {
            $this->prepareImage($image);

            foreach ($missing as $variantPublic) {
                $variantRelative = Str::after($variantPublic, self::PUBLIC_PREFIX);
                $width = $this->variantWidthFromRelativePath($variantRelative);

                if ($width === null) {
                    continue;
                }

                $resized = $this->resizeImage($image, $sourceWidth, $sourceHeight, $width);

                try {
                    Storage::disk(self::DISK)->put($variantRelative, $this->webpContents($resized, $sourcePath));
                    $created[] = $variantPublic;
                } finally {
                    imagedestroy($resized);
                }
            }
        } finally {
            imagedestroy($image);
        }

        return [
            ...$emptyResult,
            'skipped' => false,
            'reason' => null,
            'original_width' => $sourceWidth,
            'original_height' => $sourceHeight,
            'expected' => $expected,
            'missing' => $missing,
            'created' => $created,
        ];
    }

    /**
     * @return array{0: string, 1: string}
     */
    private function resolveSource(string|UploadedFile $source, ?string $extensionHint): array
    {
        if ($source instanceof UploadedFile) {
            $sourcePath = $source->getRealPath();

            if (! is_string($sourcePath) || $sourcePath === '') {
                throw new InvalidArgumentException('Source image not found.');
            }

            $extension = strtolower($extensionHint ?? $source->getClientOriginalExtension());

            return [$sourcePath, $extension];
        }

        if (! is_file($source)) {
            throw new InvalidArgumentException("Source image not found: {$source}");
        }

        return [$source, strtolower($extensionHint ?? pathinfo($source, PATHINFO_EXTENSION))];
    }

    /**
     * @return array{0: string, 1: string}
     */
    private function normalizeTarget(string $directory, string $basename): array
    {
        $directory = trim($directory, '/');
        $basename = trim($basename, '/');

        if (
            $directory === ''
            || $basename === ''
            || Str::contains($directory, ['..', '\\'])
            || Str::contains($basename, ['..', '/', '\\'])
        ) {
            throw new InvalidArgumentException('Invalid upload target path.');
        }

        return [$directory, $basename];
    }

    /**
     * @return array{path: string, variants: list<string>}
     */
    private function storeSvg(string $sourcePath, string $directory, string $basename): array
    {
        $contents = file_get_contents($sourcePath);

        if ($contents === false || ! str_contains(strtolower($contents), '<svg')) {
            throw new InvalidArgumentException("File is not a valid SVG: {$sourcePath}");
        }

        try {
            SvgSafetyGuard::ensureSafe($contents);
        } catch (InvalidArgumentException $exception) {
            throw new InvalidArgumentException("{$exception->getMessage()} ({$sourcePath})", previous: $exception);
        }

        $relative = "{$directory}/{$basename}.svg";

        Storage::disk(self::DISK)->put($relative, $contents);

        return [
            'path' => self::PUBLIC_PREFIX.$relative,
            'variants' => [],
        ];
    }

    /**
     * @param  list<int>  $widths
     * @return array{path: string, variants: list<string>}
     */
    private function storeRaster(string $sourcePath, string $directory, string $basename, array $widths): array
    {
        $this->assertGdCanWriteWebp();

        $info = getimagesize($sourcePath);

        if ($info === false || empty($info[0]) || empty($info[1])) {
            throw new InvalidArgumentException("File is not a valid image: {$sourcePath}");
        }

        $sourceWidth = (int) $info[0];
        $sourceHeight = (int) $info[1];
        $image = $this->readImage($sourcePath, (int) $info[2]);
        $relative = "{$directory}/{$basename}.webp";
        $variantPaths = [];

        try {
            $this->prepareImage($image);
            Storage::disk(self::DISK)->put($relative, $this->webpContents($image, $sourcePath));

            foreach ($this->normalizedWidths($widths, $sourceWidth) as $width) {
                $resized = $this->resizeImage($image, $sourceWidth, $sourceHeight, $width);
                $variantRelative = "{$directory}/{$basename}-{$width}w.webp";

                try {
                    Storage::disk(self::DISK)->put($variantRelative, $this->webpContents($resized, $sourcePath));
                    $variantPaths[] = self::PUBLIC_PREFIX.$variantRelative;
                } finally {
                    imagedestroy($resized);
                }
            }
        } finally {
            imagedestroy($image);
        }

        return [
            'path' => self::PUBLIC_PREFIX.$relative,
            'variants' => $variantPaths,
        ];
    }

    private function assertGdCanWriteWebp(): void
    {
        if (! extension_loaded('gd') || ! function_exists('imagewebp')) {
            throw new RuntimeException('La extensión GD con soporte WebP no está disponible en este entorno.');
        }
    }

    private function readImage(string $sourcePath, int $imageType): GdImage
    {
        $image = match ($imageType) {
            IMAGETYPE_PNG => imagecreatefrompng($sourcePath),
            IMAGETYPE_JPEG => imagecreatefromjpeg($sourcePath),
            IMAGETYPE_WEBP => imagecreatefromwebp($sourcePath),
            default => throw new InvalidArgumentException('Formato de imagen no soportado: usa PNG, JPEG o WebP.'),
        };

        if (! $image instanceof GdImage) {
            throw new RuntimeException("No se pudo leer la imagen: {$sourcePath}");
        }

        return $image;
    }

    private function prepareImage(GdImage $image): void
    {
        imagepalettetotruecolor($image);
        imagealphablending($image, true);
        imagesavealpha($image, true);
    }

    private function resizeImage(GdImage $source, int $sourceWidth, int $sourceHeight, int $targetWidth): GdImage
    {
        if ($targetWidth < 1) {
            throw new InvalidArgumentException('La anchura de la variante debe ser positiva.');
        }

        $targetHeight = max(1, (int) round($targetWidth * $sourceHeight / $sourceWidth));
        $target = imagecreatetruecolor($targetWidth, $targetHeight);

        if (! $target instanceof GdImage) {
            throw new RuntimeException('No se pudo crear la variante de imagen.');
        }

        imagealphablending($target, false);
        imagesavealpha($target, true);

        $transparent = imagecolorallocatealpha($target, 0, 0, 0, 127);

        if ($transparent !== false) {
            imagefilledrectangle($target, 0, 0, $targetWidth, $targetHeight, $transparent);
        }

        imagecopyresampled(
            $target,
            $source,
            0,
            0,
            0,
            0,
            $targetWidth,
            $targetHeight,
            $sourceWidth,
            $sourceHeight,
        );

        return $target;
    }

    private function webpContents(GdImage $image, string $sourcePath): string
    {
        ob_start();
        $converted = imagewebp($image, null, self::QUALITY);
        $contents = ob_get_clean();

        if (! $converted || ! is_string($contents) || $contents === '') {
            throw new RuntimeException("No se pudo convertir la imagen a WebP: {$sourcePath}");
        }

        return $contents;
    }

    /**
     * @param  list<int>  $widths
     * @return list<int>
     */
    private function normalizedWidths(array $widths, ?int $sourceWidth): array
    {
        $normalized = array_values(array_unique(array_filter(
            array_map('intval', $widths),
            fn (int $width): bool => $width > 0 && ($sourceWidth === null || $width < $sourceWidth),
        )));

        sort($normalized);

        return $normalized;
    }

    private function relativePathFromPublic(?string $publicPath): ?string
    {
        if ($publicPath === null || $publicPath === '' || ! Str::startsWith($publicPath, self::PUBLIC_PREFIX)) {
            return null;
        }

        $relative = Str::after($publicPath, self::PUBLIC_PREFIX);

        if ($relative === '' || $relative === $publicPath || Str::contains($relative, '..')) {
            return null;
        }

        return $relative;
    }

    /**
     * @return list<string>
     */
    private function associatedVariantRelativePaths(string $relative): array
    {
        if (! $this->isRasterRelativePath($relative)) {
            return [];
        }

        $directory = trim((string) pathinfo($relative, PATHINFO_DIRNAME), '.');
        $basename = preg_quote(pathinfo($relative, PATHINFO_FILENAME), '/');
        $prefix = $directory !== '' ? $directory.'/' : '';
        $pattern = '/^'.preg_quote($prefix, '/').$basename.'-\d+w\.webp$/';

        return array_values(array_filter(
            Storage::disk(self::DISK)->files($directory),
            fn (string $path): bool => preg_match($pattern, $path) === 1,
        ));
    }

    private function variantRelativePath(string $relative, int $width): string
    {
        $directory = trim((string) pathinfo($relative, PATHINFO_DIRNAME), '.');
        $basename = pathinfo($relative, PATHINFO_FILENAME);

        return ($directory !== '' ? $directory.'/' : '')."{$basename}-{$width}w.webp";
    }

    private function isVariantRelativePath(string $relative): bool
    {
        return preg_match('/-\d+w\.webp$/', $relative) === 1;
    }

    private function isRasterRelativePath(string $relative): bool
    {
        return $this->isRasterExtension(strtolower(pathinfo($relative, PATHINFO_EXTENSION)));
    }

    private function isRasterExtension(string $extension): bool
    {
        return in_array($extension, ['jpg', 'jpeg', 'png', 'webp'], true);
    }

    private function variantWidthFromRelativePath(string $relative): ?int
    {
        if (preg_match('/-(\d+)w\.webp$/', $relative, $matches) !== 1) {
            return null;
        }

        $width = (int) $matches[1];

        return $width > 0 ? $width : null;
    }
}
