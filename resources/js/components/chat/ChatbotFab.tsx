import { usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Mail,
    MessageCircle,
    MessageSquare,
    Phone,
    RotateCcw,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { useLanguage } from '@/hooks/use-language';
import type { LocalizedText } from '@/lib/blog';
import { localizedText } from '@/lib/blog';
import { useSiteSettings, whatsappHref } from '@/lib/site';

/**
 * Chatbot / asistente — botón flotante DERECHO (producto base).
 * docs/04_IDENTIDAD_UI_COMPONENTES.md §7 · PUBLIC_09_LAYOUT_GLOBAL.md.
 *
 * Panel accesible (Sheet/Radix Dialog) con focus trap y cierre por Esc/overlay.
 * Asistente basado en `faqs` (canal `show_in_chatbot`): el usuario elige una
 * pregunta frecuente y el panel responde con la respuesta documentada y, si
 * existe, un enlace de ampliación. No inventa respuestas, precios ni
 * disponibilidad; siempre mantiene el FALLBACK directo a contacto / email /
 * WhatsApp.
 */

type ChatbotFaq = {
    readonly id: number;
    readonly question: LocalizedText;
    readonly answer: LocalizedText;
    readonly category: string | null;
    readonly redirectUrl: string | null;
    readonly redirectSection: string | null;
};

type ChatbotPageProps = {
    readonly chatbotFaqs?: readonly ChatbotFaq[];
};

type Message = {
    readonly id: string;
    readonly role: 'user' | 'bot';
    readonly text: string;
    readonly redirectUrl?: string | null;
};

export default function ChatbotFab() {
    const { t, locale } = useLanguage();
    const { contact } = useSiteSettings();
    const { chatbotFaqs = [] } = usePage<ChatbotPageProps>().props;

    const [messages, setMessages] = useState<readonly Message[]>([]);
    const [askedIds, setAskedIds] = useState<readonly number[]>([]);
    const threadEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        threadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleAsk = (faq: ChatbotFaq): void => {
        const question = localizedText(faq.question, locale);
        const answer = localizedText(faq.answer, locale);

        setMessages((prev) => [
            ...prev,
            { id: `${faq.id}-q-${prev.length}`, role: 'user', text: question },
            {
                id: `${faq.id}-a-${prev.length}`,
                role: 'bot',
                text: answer,
                redirectUrl: faq.redirectUrl,
            },
        ]);
        setAskedIds((prev) =>
            prev.includes(faq.id) ? prev : [...prev, faq.id],
        );
    };

    const handleRestart = (): void => {
        setMessages([]);
        setAskedIds([]);
    };

    const remainingFaqs = chatbotFaqs.filter(
        (faq) => !askedIds.includes(faq.id),
    );
    const hasFaqs = chatbotFaqs.length > 0;
    const hasConversation = messages.length > 0;

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

                    {/* Conversación */}
                    {messages.map((message) =>
                        message.role === 'user' ? (
                            <div
                                key={message.id}
                                className="max-w-[85%] self-end rounded-2xl rounded-tr-sm bg-qd-teal px-4 py-3 text-sm leading-relaxed font-medium text-qd-ink"
                            >
                                {message.text}
                            </div>
                        ) : (
                            <div
                                key={message.id}
                                className="max-w-[85%] self-start rounded-2xl rounded-tl-sm border border-qd-ink/10 bg-qd-white px-4 py-3 text-sm leading-relaxed text-qd-ink dark:border-white/10 dark:bg-qd-surface dark:text-qd-white"
                            >
                                {message.text}
                                {message.redirectUrl ? (
                                    <a
                                        href={message.redirectUrl}
                                        className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-qd-teal-2 transition-colors hover:text-qd-teal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qd-teal-2 dark:text-qd-teal dark:focus-visible:outline-qd-lime"
                                    >
                                        {t('chatbot.moreInfo')}
                                        <ArrowRight aria-hidden="true" size={14} />
                                    </a>
                                ) : null}
                            </div>
                        ),
                    )}
                    <div ref={threadEndRef} />

                    {/* Preguntas frecuentes (canal chatbot) */}
                    {hasFaqs && remainingFaqs.length > 0 ? (
                        <div>
                            <p className="mb-2 text-xs font-semibold tracking-wide text-qd-text-high uppercase">
                                {t('chatbot.suggestionsTitle')}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {remainingFaqs.map((faq) => (
                                    <button
                                        key={faq.id}
                                        type="button"
                                        onClick={() => handleAsk(faq)}
                                        className="rounded-full border border-qd-teal/40 bg-qd-teal/10 px-3 py-1.5 text-left text-xs font-medium text-qd-teal-2 transition-colors hover:bg-qd-teal/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qd-teal-2 dark:text-qd-teal dark:focus-visible:outline-qd-lime"
                                    >
                                        {localizedText(faq.question, locale)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : null}

                    {hasConversation ? (
                        <button
                            type="button"
                            onClick={handleRestart}
                            className="inline-flex w-fit items-center gap-1.5 text-xs font-medium text-qd-text-high transition-colors hover:text-qd-teal-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qd-teal-2 dark:hover:text-qd-teal dark:focus-visible:outline-qd-lime"
                        >
                            <RotateCcw aria-hidden="true" size={14} />
                            {t('chatbot.restart')}
                        </button>
                    ) : null}

                    {/* Fallback de contacto directo */}
                    <div className="mt-auto rounded-2xl border border-qd-ink/10 bg-qd-white p-4 dark:border-white/10 dark:bg-qd-surface">
                        <p className="mb-3 text-sm font-medium text-qd-ink dark:text-qd-white">
                            {hasFaqs
                                ? t('chatbot.fallbackTitle')
                                : t('chatbot.emptyState')}
                        </p>
                        <div className="flex flex-col gap-2">
                            <a
                                href="/contacto"
                                className="inline-flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm text-qd-text-high transition-colors hover:text-qd-teal-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qd-teal-2 dark:hover:text-qd-teal dark:focus-visible:outline-qd-lime"
                            >
                                <MessageCircle aria-hidden="true" size={16} className="text-qd-teal" />
                                {t('chatbot.goToContact')}
                            </a>
                            <a
                                href={`mailto:${contact.email ?? ''}`}
                                className="inline-flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm text-qd-text-high transition-colors hover:text-qd-teal-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qd-teal-2 dark:hover:text-qd-teal dark:focus-visible:outline-qd-lime"
                            >
                                <Mail aria-hidden="true" size={16} className="text-qd-teal" />
                                {contact.email}
                            </a>
                            <a
                                href={whatsappHref(contact.whatsapp) ?? undefined}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm text-qd-text-high transition-colors hover:text-qd-teal-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qd-teal-2 dark:hover:text-qd-teal dark:focus-visible:outline-qd-lime"
                            >
                                <Phone aria-hidden="true" size={16} className="text-qd-teal" />
                                {t('chatbot.whatsapp')} {contact.whatsapp}
                            </a>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
