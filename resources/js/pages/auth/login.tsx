import { Form, Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    BarChart3,
    LogIn,
    Lock,
    ShieldCheck,
    Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import ThemeTogglerButton from '@/components/animate-ui/components/buttons/theme-toggler';
import InputError from '@/components/input-error';
import PasskeyVerify from '@/components/passkey-verify';
import PasswordInput from '@/components/password-input';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useLanguage } from '@/hooks/use-language';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

function Brand({ className }: { readonly className?: string }) {
    return (
        <span
            className={`flex items-baseline gap-1 text-2xl font-extrabold tracking-tight ${className ?? ''}`}
        >
            <span>Abaco</span>
            <span className="text-qd-teal-2 dark:text-qd-teal">QD</span>
        </span>
    );
}

const FEATURES: readonly { key: string; icon: LucideIcon }[] = [
    { key: 'secure', icon: ShieldCheck },
    { key: 'centralized', icon: Users },
    { key: 'efficient', icon: BarChart3 },
];

export default function Login({ status, canResetPassword }: Props) {
    const { t, locale, setLocale } = useLanguage();
    const nextLocale = locale === 'es' ? 'en' : 'es';

    return (
        <div className="relative flex min-h-svh flex-col bg-qd-bg font-sans text-qd-ink dark:bg-qd-ink dark:text-qd-white">
            <Head title={t('adminLogin.metaTitle')} />
            <PasskeyVerify />

            {/* Top bar */}
            <header className="flex items-center justify-between px-5 py-5 sm:px-8">
                <Brand className="text-qd-ink dark:text-qd-white" />
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setLocale(nextLocale)}
                        className="flex h-9 items-center rounded-lg border border-qd-mist px-3 text-sm font-semibold text-qd-text-high transition hover:border-qd-teal-2/40 dark:border-qd-white/10 dark:text-qd-white/70"
                        aria-label={t('adminLogin.switchLanguage')}
                    >
                        {locale.toUpperCase()}
                    </button>
                    <ThemeTogglerButton modes={['light', 'dark', 'system']} />
                </div>
            </header>

            <div className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-8 px-5 py-8 sm:px-8 lg:grid-cols-2">
                {/* Brand panel */}
                <section className="hidden flex-col justify-center rounded-3xl border border-qd-mist bg-qd-white p-10 lg:flex dark:border-qd-white/10 dark:bg-qd-surface">
                    <span className="inline-flex w-fit items-center gap-2 rounded-full bg-qd-teal-2/10 px-3 py-1 text-xs font-bold tracking-[0.18em] text-qd-teal-2 dark:bg-qd-teal/10 dark:text-qd-teal">
                        {t('adminLogin.badge')}
                    </span>
                    <h1 className="mt-6 text-4xl leading-tight font-extrabold tracking-tight text-qd-ink dark:text-qd-white">
                        {t('adminLogin.panelTitle')}
                    </h1>
                    <p className="mt-4 max-w-md text-base leading-relaxed text-qd-text-high">
                        {t('adminLogin.panelSubtitle')}
                    </p>

                    <div className="mt-10 grid grid-cols-3 gap-5">
                        {FEATURES.map((feature) => {
                            const Icon = feature.icon;

                            return (
                                <div key={feature.key} className="flex flex-col gap-2">
                                    <span className="flex size-11 items-center justify-center rounded-xl bg-qd-teal-2/10 text-qd-teal-2 dark:bg-qd-teal/10 dark:text-qd-teal">
                                        <Icon aria-hidden="true" size={22} strokeWidth={1.7} />
                                    </span>
                                    <p className="text-sm font-bold text-qd-ink dark:text-qd-white">
                                        {t(`adminLogin.features.${feature.key}.title`)}
                                    </p>
                                    <p className="text-xs leading-relaxed text-qd-text-medium dark:text-qd-white/50">
                                        {t(`adminLogin.features.${feature.key}.description`)}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Form card */}
                <section className="mx-auto w-full max-w-md rounded-3xl border border-qd-mist bg-qd-white p-8 shadow-[0_24px_80px_-48px_rgba(7,17,26,0.45)] sm:p-10 dark:border-qd-white/10 dark:bg-qd-surface">
                    <div className="flex flex-col items-center text-center">
                        <span className="inline-flex items-center gap-2 rounded-full border border-qd-teal-2/30 px-3 py-1 text-[11px] font-bold tracking-[0.2em] text-qd-teal-2 dark:border-qd-teal/40 dark:text-qd-teal">
                            {t('adminLogin.badge')}
                        </span>
                        <Brand className="mt-4 text-3xl text-qd-ink dark:text-qd-white" />
                        <h2 className="mt-6 text-2xl font-bold text-qd-ink dark:text-qd-white">
                            {t('adminLogin.title')}
                        </h2>
                        <p className="mt-1.5 text-sm text-qd-text-medium dark:text-qd-white/50">
                            {t('adminLogin.subtitle')}
                        </p>
                    </div>

                    {status && (
                        <div className="mt-6 rounded-lg bg-emerald-50 px-4 py-2 text-center text-sm font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                            {status}
                        </div>
                    )}

                    <Form
                        {...store.form()}
                        resetOnSuccess={['password']}
                        className="mt-8 flex flex-col gap-5"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="email">{t('adminLogin.email')}</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        placeholder={t('adminLogin.emailPlaceholder')}
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">
                                            {t('adminLogin.password')}
                                        </Label>
                                        {canResetPassword && (
                                            <Link
                                                href={request()}
                                                className="ml-auto text-sm font-medium text-qd-teal-2 hover:underline dark:text-qd-teal"
                                                tabIndex={5}
                                            >
                                                {t('adminLogin.forgot')}
                                            </Link>
                                        )}
                                    </div>
                                    <PasswordInput
                                        id="password"
                                        name="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder="••••••••••"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="flex items-center gap-3">
                                    <Checkbox id="remember" name="remember" tabIndex={3} />
                                    <Label htmlFor="remember" className="font-normal">
                                        {t('adminLogin.remember')}
                                    </Label>
                                </div>

                                <button
                                    type="submit"
                                    tabIndex={4}
                                    disabled={processing}
                                    data-test="login-button"
                                    className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-qd-lime px-5 py-3 text-sm font-bold text-qd-ink transition hover:brightness-95 disabled:opacity-60"
                                >
                                    {processing ? <Spinner /> : <LogIn aria-hidden="true" size={16} />}
                                    {t('adminLogin.submit')}
                                </button>
                            </>
                        )}
                    </Form>

                    <div className="mt-7 border-t border-qd-mist pt-6 dark:border-qd-white/10">
                        <a
                            href="/"
                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-qd-mist px-5 py-3 text-sm font-semibold text-qd-text-high transition hover:border-qd-teal-2/40 hover:text-qd-teal-2 dark:border-qd-white/10 dark:text-qd-white/70 dark:hover:text-qd-teal"
                        >
                            {t('adminLogin.backToSite')}
                            <ArrowRight aria-hidden="true" size={15} />
                        </a>
                        <p className="mt-5 flex items-center justify-center gap-2 text-xs text-qd-text-medium dark:text-qd-white/40">
                            <Lock aria-hidden="true" size={13} />
                            {t('adminLogin.restricted')}
                        </p>
                    </div>
                </section>
            </div>

            <footer className="px-5 py-6 text-center text-xs text-qd-text-medium sm:px-8 dark:text-qd-white/40">
                © {new Date().getFullYear()} AbacoQD. {t('adminLogin.rights')}
            </footer>
        </div>
    );
}
