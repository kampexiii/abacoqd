import {
    ArrowRight,
    CheckCircle2,
    FileText,
    Folder,
    GitBranch,
    LayoutGrid,
    Play,
    Search,
    Send,
    Timer,
    X,
    Zap,
} from 'lucide-react';

import { useInView } from '@/hooks/use-in-view';
import { useLanguage } from '@/hooks/use-language';
import { cn } from '@/lib/utils';

export default function FinalCtaSection() {
    const { t } = useLanguage();
    const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.18 });

    return (
        <section id="contacto" className="abaco-section qd-cta-section">
            <div className="abaco-section__inner">
                <div
                    ref={ref}
                    className={cn(
                        'qd-cta-card abaco-reveal',
                        inView && 'is-visible',
                    )}
                >
                    <div className="qd-cta-card__content">
                        <p className="qd-cta-card__eyebrow">
                            {t('home.cta.eyebrow')}
                        </p>
                        <div className="qd-cta-card__logo" aria-hidden="true">
                            <img
                                src="/assets/branding/marca/logos/abacoqd-lockup.svg"
                                alt=""
                                width={140}
                                height={40}
                                className="h-10 w-auto dark:hidden"
                            />
                            <img
                                src="/assets/branding/marca/logos/abacoqd-lockup-inverse.svg"
                                alt=""
                                width={140}
                                height={40}
                                className="hidden h-10 w-auto dark:block"
                            />
                        </div>
                        <h2 className="qd-cta-card__title">
                            {t('home.cta.title')}
                        </h2>
                        <p className="qd-cta-card__lead">
                            {t('home.cta.lead')}
                        </p>
                        <div
                            className="qd-cta-badges"
                            aria-label={t('home.cta.badgesAria')}
                        >
                            <span className="qd-cta-badge">
                                <Zap aria-hidden="true" size={14} />
                                {t('home.cta.badgeDev')}
                            </span>
                            <span className="qd-cta-badge">
                                <Timer aria-hidden="true" size={14} />
                                {t('home.cta.badgeReply')}
                            </span>
                        </div>
                    </div>

                    <div className="qd-cta-editor" aria-hidden="true">
                        <div className="qd-cta-editor__title">
                            <span className="qd-cta-editor__dot" />
                            <span className="qd-cta-editor__dot" />
                            <span className="qd-cta-editor__dot" />
                            <span className="qd-cta-editor__tabname">
                                Tu-Idea
                            </span>
                        </div>
                        <div className="qd-cta-editor__body">
                            <div className="qd-cta-editor__activity">
                                <FileText aria-hidden="true" size={14} />
                                <Search aria-hidden="true" size={14} />
                                <GitBranch aria-hidden="true" size={14} />
                                <Play aria-hidden="true" size={14} />
                                <LayoutGrid aria-hidden="true" size={14} />
                            </div>
                            <div className="qd-cta-editor__sidebar">
                                <span className="qd-cta-editor__sidebar-title">
                                    Proyecto
                                </span>
                                {[
                                    { name: 'src', type: 'folder' },
                                    { name: 'components', type: 'folder' },
                                    { name: 'services', type: 'folder' },
                                    { name: 'app.js', type: 'js' },
                                ].map((file) => (
                                    <span
                                        key={file.name}
                                        className={cn(
                                            'qd-cta-editor__file',
                                            file.type === 'js' &&
                                                'is-active',
                                        )}
                                    >
                                        {file.type === 'folder' ? (
                                            <Folder
                                                aria-hidden="true"
                                                size={11}
                                            />
                                        ) : (
                                            <span
                                                className="qd-cta-editor__js-badge"
                                                aria-hidden="true"
                                            >
                                                JS
                                            </span>
                                        )}
                                        {file.name}
                                    </span>
                                ))}
                            </div>
                            <div className="qd-cta-editor__pane">
                                <div className="qd-cta-editor__tabbar">
                                    <span className="qd-cta-editor__tab is-active">
                                        <span
                                            className="qd-cta-editor__js-badge"
                                            aria-hidden="true"
                                        >
                                            JS
                                        </span>
                                        app.js
                                        <X
                                            aria-hidden="true"
                                            size={11}
                                            className="qd-cta-editor__tab-close"
                                        />
                                    </span>
                                </div>
                                <div className="qd-cta-editor__code">
                                    <pre>
                                        <code>
                                            <span className="qd-cta-kw">
                                                import
                                            </span>{' '}
                                            {'{ '}
                                            AbacoQD
                                            {' }'}{' '}
                                            <span className="qd-cta-kw">
                                                from
                                            </span>{' '}
                                            <span className="qd-cta-str">
                                                '@abacoqd/core'
                                            </span>
                                            ;{'\n'}
                                            <span className="qd-cta-cm">
                                                // Tu traes la idea.
                                                Nosotros, el código que
                                                dura.
                                            </span>
                                            {'\n'}
                                            <span className="qd-cta-kw">
                                                export async function
                                            </span>{' '}
                                            <span className="qd-cta-fn">
                                                lanzarProyecto
                                            </span>
                                            (idea) {'{'}
                                            {'\n'} {' '}
                                            <span className="qd-cta-kw">
                                                const
                                            </span>{' '}
                                            app ={' '}
                                            <span className="qd-cta-kw">
                                                await
                                            </span>{' '}
                                            AbacoQD.
                                            <span className="qd-cta-fn">
                                                construir
                                            </span>
                                            (idea);{'\n'} {' '}
                                            <span className="qd-cta-kw">
                                                return
                                            </span>{' '}
                                            app.
                                            <span className="qd-cta-fn">
                                                listoParaCrecer
                                            </span>
                                            ();{'\n'}
                                            {'}'}
                                        </code>
                                    </pre>
                                    <div className="qd-cta-preview">
                                        <span className="qd-cta-preview__label">
                                            Vista previa
                                        </span>
                                        <CheckCircle2
                                            aria-hidden="true"
                                            size={34}
                                        />
                                        <strong>Sistema optimizado</strong>
                                        <span className="qd-cta-preview__sub">
                                            Listo para crecer contigo.
                                        </span>
                                        <span
                                            className="qd-cta-preview__bar"
                                            aria-hidden="true"
                                        >
                                            <span className="qd-cta-preview__bar-fill" />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="qd-cta-actions">
                        <a href="/reserva" className="qd-cta-btn-primary">
                            {t('home.cta.primaryCta')}
                            <Send aria-hidden="true" size={16} />
                        </a>
                        <a href="/metodologia" className="qd-cta-btn-secondary">
                            {t('home.cta.secondaryCta')}
                            <ArrowRight aria-hidden="true" size={16} />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
