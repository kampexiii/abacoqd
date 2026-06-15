import { Mail, MessageCircle, MessageSquare, Phone } from 'lucide-react';

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { SITE_CONFIG } from '@/config/site';
import { useLanguage } from '@/hooks/use-language';

/**
 * Chatbot / asistente — botón flotante DERECHO (producto base).
 * docs/04_IDENTIDAD_UI_COMPONENTES.md §7 · PUBLIC_09_LAYOUT_GLOBAL.md.
 *
 * Panel accesible (Sheet/Radix Dialog) con focus trap y cierre por Esc/overlay.
 * PENDIENTE: proveedor/back del asistente y conexión a `faqs`. Mientras tanto el
 * panel ofrece FALLBACK directo a contacto / email / WhatsApp (comportamiento
 * documentado), sin inventar respuestas, precios ni disponibilidad.
 */

const SUGGESTION_KEYS = ['services', 'time', 'budget'] as const;

export default function ChatbotFab() {
    const { t } = useLanguage();

    return (
        <Sheet>
            <SheetTrigger asChild>
                <button
                    type="button"
                    aria-label={t('chatbot.openLabel')}
                    className="qd-fab qd-fab--right bg-qd-teal text-qd-ink shadow-[0_14px_34px_-14px_rgba(24,183,176,0.7)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qd-teal-2 dark:focus-visible:outline-qd-lime"
                >
                    <MessageSquare aria-hidden="true" size={22} />
                </button>
            </SheetTrigger>
            <SheetContent
                side="right"
                className="flex w-full flex-col bg-qd-bg p-0 text-qd-ink sm:max-w-sm dark:bg-qd-ink dark:text-qd-white"
            >
                <SheetHeader className="border-b border-qd-ink/10 px-5 pt-6 pb-4 dark:border-white/10">
                    <SheetTitle className="flex items-center gap-2 text-qd-ink dark:text-qd-white">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-qd-teal text-qd-ink">
                            <MessageSquare aria-hidden="true" size={18} />
                        </span>
                        {t('chatbot.title')}
                    </SheetTitle>
                    <SheetDescription className="text-qd-text-high">
                        {t('chatbot.intro')}
                    </SheetDescription>
                </SheetHeader>

                <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-5 py-5">
                    {/* Mensaje de bienvenida del asistente */}
                    <div className="max-w-[85%] self-start rounded-2xl rounded-tl-sm border border-qd-ink/10 bg-qd-white px-4 py-3 text-sm leading-relaxed text-qd-ink dark:border-white/10 dark:bg-qd-surface dark:text-qd-white">
                        {t('chatbot.welcome')}
                    </div>

                    {/* Sugerencias rápidas (placeholder hasta conectar faqs) */}
                    <div>
                        <p className="mb-2 text-xs font-semibold tracking-wide text-qd-text-high uppercase">
                            {t('chatbot.suggestionsTitle')}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {SUGGESTION_KEYS.map((key) => (
                                <span
                                    key={key}
                                    className="rounded-full border border-qd-teal/40 bg-qd-teal/10 px-3 py-1.5 text-xs font-medium text-qd-teal-2 dark:text-qd-teal"
                                >
                                    {t(`chatbot.suggestions.${key}`)}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Fallback de contacto directo */}
                    <div className="mt-auto rounded-2xl border border-qd-ink/10 bg-qd-white p-4 dark:border-white/10 dark:bg-qd-surface">
                        <p className="mb-3 text-sm font-medium text-qd-ink dark:text-qd-white">
                            {t('chatbot.fallbackTitle')}
                        </p>
                        <div className="flex flex-col gap-2">
                            <a
                                href="#contacto"
                                className="inline-flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm text-qd-text-high transition-colors hover:text-qd-teal-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qd-teal-2 dark:hover:text-qd-teal dark:focus-visible:outline-qd-lime"
                            >
                                <MessageCircle aria-hidden="true" size={16} className="text-qd-teal" />
                                {t('chatbot.goToContact')}
                            </a>
                            <a
                                href={`mailto:${SITE_CONFIG.contact.email}`}
                                className="inline-flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm text-qd-text-high transition-colors hover:text-qd-teal-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qd-teal-2 dark:hover:text-qd-teal dark:focus-visible:outline-qd-lime"
                            >
                                <Mail aria-hidden="true" size={16} className="text-qd-teal" />
                                {SITE_CONFIG.contact.email}
                            </a>
                            <a
                                href={SITE_CONFIG.contact.whatsappHref}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm text-qd-text-high transition-colors hover:text-qd-teal-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qd-teal-2 dark:hover:text-qd-teal dark:focus-visible:outline-qd-lime"
                            >
                                <Phone aria-hidden="true" size={16} className="text-qd-teal" />
                                {t('chatbot.whatsapp')} {SITE_CONFIG.contact.whatsapp}
                            </a>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
