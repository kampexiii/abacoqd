<?php

namespace Database\Seeders;

use App\Enums\PostStatus;
use App\Models\Post;
use App\Models\PostCategory;
use App\Models\Tag;
use App\Services\Media\PostCoverImageService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;

/**
 * Posts iniciales reales del blog de AbacoQD / Abaco Developments.
 * Idempotente vía búsqueda por `slug_es` + fill/save (no duplica al
 * re-ejecutar `migrate:fresh --seed`).
 *
 * Los covers se procesan desde 4 PNG temporales aportados en la raíz del
 * proyecto (`blog-*.png`, fuera de control de versiones) con
 * `PostCoverImageService`, el mismo servicio que reutilizará el futuro CRUD
 * admin. Prioridad para resolver el cover (idéntico patrón que
 * `TeamMemberSeeder`): 1) PNG temporal en raíz; 2) WebP ya versionado en
 * `public/uploads/blog/posts`; 3) cover ya guardado en BD; 4) null. Así un
 * clon limpio sin los PNG temporales pero con los WebP commiteados sigue
 * mostrando los covers, y si falta del todo la imagen el post se crea sin
 * cover (la UI cae al patrón de marca, sin enlaces rotos).
 */
class BlogPostSeeder extends Seeder
{
    public function run(PostCoverImageService $covers): void
    {
        $categories = $this->seedCategories();
        $tags = $this->seedTags();

        foreach ($this->posts() as $data) {
            $slugEs = $data['slug']['es'];
            $existing = Post::query()->where('slug_es', $slugEs)->first();
            $cover = $this->resolveCover(
                $covers,
                $data['cover_source'],
                $slugEs,
                $existing?->featured_image,
            );

            $contentEs = $data['content']['es'];
            $words = str_word_count(strip_tags($contentEs));
            $readingTime = max(1, (int) ceil($words / 200));

            $post = $existing ?? new Post;
            $post->fill([
                'post_category_id' => $categories[$data['category']]->id,
                'user_id' => null,
                'title' => $data['title'],
                'slug' => $data['slug'],
                'excerpt' => $data['excerpt'],
                'content' => $data['content'],
                'featured_image' => $cover,
                'status' => PostStatus::Published->value,
                'published_at' => Carbon::parse($data['published_at']),
                'is_featured' => $data['is_featured'],
                'featured_order' => $data['featured_order'],
                'show_on_home' => true,
                'reading_time' => $readingTime,
                'settings' => $data['settings'],
            ]);
            $post->save();

            $tagIds = array_map(
                fn (string $tagSlug): int => $tags[$tagSlug]->id,
                $data['tags'],
            );
            $post->tags()->sync($tagIds);
        }
    }

    /**
     * @return array<string, PostCategory> categorías indexadas por slug ES
     */
    private function seedCategories(): array
    {
        $definitions = [
            'abacoqd' => ['AbacoQD', 'AbacoQD'],
            'desarrollo-a-medida' => ['Desarrollo a medida', 'Custom development'],
            'ia-aplicada' => ['IA aplicada', 'Applied AI'],
            'crm-y-datos' => ['CRM y datos', 'CRM and data'],
        ];

        $result = [];

        foreach (array_values($definitions) as $index => [$nameEs, $nameEn]) {
            $slugEs = array_keys($definitions)[$index];
            $slugEn = str($nameEn)->slug()->toString();

            $category = PostCategory::query()->where('slug_es', $slugEs)->first()
                ?? new PostCategory;

            $category->fill([
                'name' => ['es' => $nameEs, 'en' => $nameEn],
                'slug' => ['es' => $slugEs, 'en' => $slugEn],
                'is_active' => true,
            ]);

            if ($category->getAttribute('sort_order') === null) {
                $category->setAttribute('sort_order', $index + 1);
            }

            $category->save();
            $result[$slugEs] = $category;
        }

        return $result;
    }

    /**
     * @return array<string, Tag> tags indexados por slug ES
     */
    private function seedTags(): array
    {
        $definitions = [
            'abacoqd' => ['AbacoQD', 'AbacoQD'],
            'identidad-digital' => ['Identidad digital', 'Digital identity'],
            'nueva-web' => ['Nueva web', 'New website'],
            'desarrollo-a-medida' => ['Desarrollo a medida', 'Custom development'],
            'ia-supervisada' => ['IA supervisada', 'Supervised AI'],
            'producto-digital' => ['Producto digital', 'Digital product'],
            'arquitectura' => ['Arquitectura', 'Architecture'],
            'procesos' => ['Procesos', 'Processes'],
            'ia-aplicada' => ['IA aplicada', 'Applied AI'],
            'automatizacion' => ['Automatización', 'Automation'],
            'calidad-tecnica' => ['Calidad técnica', 'Technical quality'],
            'crm' => ['CRM', 'CRM'],
            'datos' => ['Datos', 'Data'],
            'reporting' => ['Reporting', 'Reporting'],
        ];

        $result = [];

        foreach ($definitions as $slugEs => [$nameEs, $nameEn]) {
            $tag = Tag::query()->where('slug_es', $slugEs)->first() ?? new Tag;

            $tag->fill([
                'name' => ['es' => $nameEs, 'en' => $nameEn],
                'slug' => ['es' => $slugEs, 'en' => str($nameEn)->slug()->toString()],
            ]);
            $tag->save();
            $result[$slugEs] = $tag;
        }

        return $result;
    }

    private function resolveCover(
        PostCoverImageService $covers,
        string $sourceFilename,
        string $slugEs,
        ?string $existing,
    ): ?string {
        $sourcePath = base_path($sourceFilename);

        if (is_file($sourcePath)) {
            return $covers->storeFromPath($sourcePath, $slugEs);
        }

        $relativePath = "blog/posts/{$slugEs}.webp";

        if (Storage::disk('public_uploads')->exists($relativePath)) {
            return '/uploads/'.$relativePath;
        }

        $this->command->warn(
            "BlogPostSeeder: no se encontró {$sourceFilename} ni un WebP versionado; el post '{$slugEs}' queda sin cover.",
        );

        return $existing;
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function posts(): array
    {
        return [
            [
                'cover_source' => 'blog-abacoqd-identidad.png',
                'category' => 'abacoqd',
                'title' => [
                    'es' => 'AbacoQD: renovamos nuestra identidad para construir software a medida con más rapidez y criterio',
                    'en' => 'AbacoQD: a renewed identity to build custom software faster and with stronger technical focus',
                ],
                'slug' => [
                    'es' => 'abacoqd-renovamos-identidad-software-a-medida',
                    'en' => 'abacoqd-renewed-identity-custom-software',
                ],
                'excerpt' => [
                    'es' => 'Seguimos siendo Abaco Developments, pero evolucionamos nuestra presencia digital con una identidad más clara, tecnológica y enfocada en desarrollos rápidos a medida.',
                    'en' => 'We remain Abaco Developments, but we are evolving our digital presence with a clearer, more technical identity focused on fast custom development.',
                ],
                'content' => [
                    'es' => <<<'MD'
## Seguimos siendo Abaco Developments

La renovación de identidad no rompe con lo anterior. AbacoQD nace como una forma más clara de explicar una línea de trabajo enfocada en desarrollos rápidos, útiles y a medida.

## Por qué renovar ahora

El mercado exige más claridad, más foco y más velocidad. La nueva presencia digital ayuda a explicar mejor qué hacemos, cómo lo hacemos y qué tipo de soluciones podemos construir.

## Qué significa AbacoQD

AbacoQD significa Ábaco Quick Developments: desarrollo rápido, moderno y adaptado a cada cliente. La IA puede acelerar partes del proceso, pero siempre con supervisión, criterio técnico y revisión humana.

## Una web más clara para explicar lo que hacemos

La nueva estructura organiza el contenido en metodología, servicios, proyectos, equipo, blog y contacto. La intención es que cualquier cliente pueda entender mejor el enfoque antes de dar el siguiente paso.

## Lo que no cambia

No cambia el criterio técnico, la orientación a soluciones reales ni la importancia de construir productos mantenibles y útiles.

## Lo que viene

La web seguirá evolucionando con nuevos artículos, proyectos publicables cuando exista permiso, contenido bilingüe y una administración preparada para gestionar la información de forma ordenada.

Si tienes una idea o proceso que quieres transformar en una solución digital, cuéntanos tu proyecto.
MD,
                    'en' => <<<'MD'
## We are still Abaco Developments

The identity refresh doesn't break with the past. AbacoQD is born as a clearer way to explain a line of work focused on fast, useful and custom development.

## Why refresh now

The market demands more clarity, more focus and more speed. The new digital presence helps explain better what we do, how we do it and what kind of solutions we can build.

## What AbacoQD means

AbacoQD stands for Ábaco Quick Developments: fast, modern development adapted to each client. AI can speed up parts of the process, but always with supervision, technical judgement and human review.

## A clearer site to explain what we do

The new structure organizes content into methodology, services, projects, team, blog and contact. The aim is that any client can better understand the approach before taking the next step.

## What doesn't change

What doesn't change is the technical judgement, the focus on real solutions or the importance of building maintainable, useful products.

## What's coming

The site will keep evolving with new articles, publishable projects once permission exists, bilingual content and an admin prepared to manage information in an orderly way.

If you have an idea or process you want to turn into a digital solution, tell us about your project.
MD,
                ],
                'published_at' => '2026-06-18 09:00:00',
                'is_featured' => true,
                'featured_order' => 1,
                'settings' => ['home_featured' => true],
                'tags' => ['abacoqd', 'identidad-digital', 'nueva-web', 'desarrollo-a-medida', 'ia-supervisada'],
            ],
            [
                'cover_source' => 'blog-desarrollo-a-medida.png',
                'category' => 'desarrollo-a-medida',
                'title' => [
                    'es' => 'Cómo plantear un desarrollo a medida antes de escribir la primera línea de código',
                    'en' => 'How to plan a custom software project before writing the first line of code',
                ],
                'slug' => [
                    'es' => 'como-plantear-desarrollo-a-medida-antes-de-programar',
                    'en' => 'how-to-plan-custom-software-before-coding',
                ],
                'excerpt' => [
                    'es' => 'Un buen proyecto empieza antes del código: entender objetivos, procesos, usuarios y límites evita rehacer trabajo después.',
                    'en' => 'A good project starts before the code: understanding goals, processes, users and limits avoids redoing work later.',
                ],
                'content' => [
                    'es' => <<<'MD'
## Antes del código está el problema

Empezar un desarrollo por las pantallas suele parecer rápido, pero muchas veces genera retrabajo. Antes conviene entender qué problema se quiere resolver y por qué.

## Define el objetivo real

No basta con decir “necesito una aplicación”. Hay que concretar qué proceso mejora, quién la usará y qué resultado debe facilitar.

## Separa lo imprescindible de lo deseable

Una primera versión útil no tiene que hacerlo todo. Debe resolver bien lo esencial y dejar preparada la evolución.

## Piensa en datos y flujo, no solo en diseño

El diseño importa, pero los datos, permisos, estados, integraciones y reglas de negocio suelen determinar si una solución funciona de verdad.

## Cuándo ayuda la IA

La IA puede acelerar análisis, prototipos, documentación y partes del desarrollo, pero siempre necesita dirección técnica y revisión.

## Conclusión

Un desarrollo a medida bien planteado no empieza programando más rápido, sino decidiendo mejor qué merece la pena construir.
MD,
                    'en' => <<<'MD'
## Before the code comes the problem

Starting development from the screens often seems fast, but it frequently creates rework. First it's worth understanding what problem you want to solve and why.

## Define the real goal

Saying “I need an application” isn't enough. You have to pin down which process it improves, who will use it and what result it should enable.

## Separate the essential from the desirable

A first useful version doesn't have to do everything. It should solve the essentials well and leave room to evolve.

## Think in data and flow, not just design

Design matters, but data, permissions, states, integrations and business rules usually determine whether a solution really works.

## When AI helps

AI can speed up analysis, prototypes, documentation and parts of development, but it always needs technical direction and review.

## Conclusion

A well-planned custom development doesn't start by coding faster, but by deciding better what is worth building.
MD,
                ],
                'published_at' => '2026-06-05 09:00:00',
                'is_featured' => false,
                'featured_order' => null,
                'settings' => null,
                'tags' => ['desarrollo-a-medida', 'producto-digital', 'arquitectura', 'procesos'],
            ],
            [
                'cover_source' => 'blog-ia-supervisada.png',
                'category' => 'ia-aplicada',
                'title' => [
                    'es' => 'IA supervisada: acelerar un proyecto sin perder control técnico',
                    'en' => 'Supervised AI: speeding up a project without losing technical control',
                ],
                'slug' => [
                    'es' => 'ia-supervisada-acelerar-proyecto-sin-perder-control-tecnico',
                    'en' => 'supervised-ai-speed-up-project-without-losing-control',
                ],
                'excerpt' => [
                    'es' => 'La IA puede acelerar análisis, prototipado y desarrollo, pero necesita revisión, arquitectura y criterio humano para generar valor real.',
                    'en' => 'AI can speed up analysis, prototyping and development, but it needs review, architecture and human judgement to create real value.',
                ],
                'content' => [
                    'es' => <<<'MD'
## La IA no sustituye el criterio

Usar IA en desarrollo no significa delegar decisiones críticas. Significa apoyarse en herramientas que pueden acelerar tareas concretas si existe una dirección clara.

## Dónde puede aportar valor

Puede ayudar en documentación, exploración de soluciones, generación de estructuras iniciales, pruebas, refactorización controlada y revisión de patrones.

## Qué no debe delegarse ciegamente

Arquitectura, seguridad, permisos, datos sensibles, rendimiento, accesibilidad y decisiones de producto requieren supervisión humana.

## Revisión y mantenimiento

Un proyecto no termina cuando compila. Debe poder entenderse, mantenerse y evolucionar sin depender de una solución opaca.

## Una forma más responsable de acelerar

La IA tiene sentido cuando reduce fricción sin reducir calidad. El valor está en combinar velocidad, revisión y claridad técnica.
MD,
                    'en' => <<<'MD'
## AI doesn't replace judgement

Using AI in development doesn't mean delegating critical decisions. It means relying on tools that can speed up specific tasks when there is a clear direction.

## Where it can add value

It can help with documentation, exploring solutions, generating initial structures, testing, controlled refactoring and reviewing patterns.

## What shouldn't be delegated blindly

Architecture, security, permissions, sensitive data, performance, accessibility and product decisions require human supervision.

## Review and maintenance

A project doesn't end when it compiles. It must be understandable, maintainable and able to evolve without depending on an opaque solution.

## A more responsible way to go faster

AI makes sense when it reduces friction without reducing quality. The value lies in combining speed, review and technical clarity.
MD,
                ],
                'published_at' => '2026-06-12 09:00:00',
                'is_featured' => false,
                'featured_order' => null,
                'settings' => null,
                'tags' => ['ia-aplicada', 'ia-supervisada', 'automatizacion', 'calidad-tecnica'],
            ],
            [
                'cover_source' => 'blog-crm-datos.png',
                'category' => 'crm-y-datos',
                'title' => [
                    'es' => 'CRM, datos y procesos: por qué muchas empresas necesitan una solución propia',
                    'en' => 'CRM, data and processes: why many companies need their own solution',
                ],
                'slug' => [
                    'es' => 'crm-datos-procesos-solucion-propia',
                    'en' => 'crm-data-processes-custom-solution',
                ],
                'excerpt' => [
                    'es' => 'Cuando los procesos no encajan en herramientas estándar, una solución a medida puede ordenar datos, automatizar tareas y mejorar decisiones.',
                    'en' => "When processes don't fit standard tools, a custom solution can organize data, automate tasks and improve decisions.",
                ],
                'content' => [
                    'es' => <<<'MD'
## El problema no siempre es la herramienta

Muchas empresas trabajan con datos repartidos, hojas de cálculo, procesos manuales y sistemas que no terminan de comunicarse entre sí.

## Cuando lo estándar se queda corto

Una herramienta genérica puede ser suficiente al principio, pero puede quedarse limitada cuando el proceso tiene reglas propias o necesita integraciones concretas.

## El valor de ordenar los datos

Un CRM bien planteado no es solo una base de contactos. Es una forma de entender relaciones, acciones, oportunidades y decisiones.

## Automatizar sin perder control

Automatizar no significa ocultar el proceso. Significa reducir tareas repetitivas y mantener visibilidad sobre lo importante.

## Reporting y visión de negocio

Cuando los datos están mejor conectados, los equipos pueden analizar, priorizar y decidir con más claridad.

## Cuándo merece la pena una solución propia

Tiene sentido cuando el proceso es importante para el negocio, cuando las herramientas actuales generan fricción o cuando la información necesita una estructura más adaptada.
MD,
                    'en' => <<<'MD'
## The problem isn't always the tool

Many companies work with scattered data, spreadsheets, manual processes and systems that never quite talk to each other.

## When off-the-shelf falls short

A generic tool can be enough at first, but it can become limiting when the process has its own rules or needs specific integrations.

## The value of organizing data

A well-designed CRM isn't just a contact database. It's a way to understand relationships, actions, opportunities and decisions.

## Automate without losing control

Automating doesn't mean hiding the process. It means reducing repetitive tasks while keeping visibility over what matters.

## Reporting and business insight

When data is better connected, teams can analyze, prioritize and decide with more clarity.

## When a custom solution is worth it

It makes sense when the process is important to the business, when current tools create friction or when the information needs a more tailored structure.
MD,
                ],
                'published_at' => '2026-05-28 09:00:00',
                'is_featured' => false,
                'featured_order' => null,
                'settings' => null,
                'tags' => ['crm', 'datos', 'automatizacion', 'reporting', 'procesos'],
            ],
        ];
    }
}
