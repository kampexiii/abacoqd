import { Form, Head } from '@inertiajs/react';
import { ArrowRight, ShieldCheck, Users } from 'lucide-react';

import ThemeTogglerButton from '@/components/animate-ui/components/buttons/theme-toggler';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import MethodologyCube from '@/components/public/MethodologyCube';
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

// Logo de marca AbacoQD (lockup: isotipo + wordmark). Mismo asset y patrón
// claro/oscuro que usa el header/footer público.
function BrandLockup({ className }: { readonly className?: string }) {
    return (
        <>
            <img
                src="/assets/branding/marca/logos/abacoqd-lockup.svg"
                alt="AbacoQD"
                className={`w-auto dark:hidden ${className ?? ''}`}
            />
            <img
                src="/assets/branding/marca/logos/abacoqd-lockup-inverse.svg"
                alt="AbacoQD"
                className={`hidden w-auto dark:block ${className ?? ''}`}
            />
        </>
    );
}

export default function Login({ status, canResetPassword }: Props) {
    const { t, locale, setLocale } = useLanguage();
    const nextLocale = locale === 'es' ? 'en' : 'es';

    return (
        <div className="relative flex min-h-svh flex-col bg-qd-bg font-sans text-qd-ink dark:bg-qd-ink dark:text-qd-white">
            <Head title={t('adminLogin.metaTitle')} />

            {/* Top bar */}
            <header className="flex items-center justify-between px-5 py-5 sm:px-8">
                <a href="/" aria-label="AbacoQD" className="shrink-0">
                    <BrandLockup className="h-8" />
                </a>
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

            <div className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 items-stretch gap-8 px-5 py-8 sm:px-8 lg:grid-cols-2">
                {/* Brand panel + hero cube */}
                <section className="relative hidden flex-col overflow-hidden rounded-3xl border border-qd-mist bg-qd-white p-10 lg:flex dark:border-qd-white/10 dark:bg-qd-surface">
                    <span className="text-xs font-bold tracking-[0.22em] text-qd-teal-2 dark:text-qd-teal">
                        {t('adminLogin.eyebrow')}
                    </span>
                    <h1 className="mt-5 text-4xl leading-tight font-extrabold tracking-tight text-qd-ink dark:text-qd-white">
                        {t('adminLogin.panelTitle')}
                    </h1>
                    <p className="mt-4 max-w-md text-base leading-relaxed text-qd-text-high">
                        {t('adminLogin.panelSubtitle')}
                    </p>

                    {/* Mismo MethodologyCube del hero interno (/metodologia, /blog, /quienes-somos...), reutilizado sin tocarlo. Escalado desde este contenedor, no desde el componente. */}
                    <div className="flex flex-1 items-center justify-center">
                        <div className="scale-125 sm:scale-150">
                            <MethodologyCube />
                        </div>
                    </div>

                    <div className="mt-6 flex items-center gap-5 text-xs font-semibold text-qd-text-medium dark:text-qd-white/50">
                        <span className="flex items-center gap-1.5">
                            <ShieldCheck aria-hidden="true" size={15} className="text-qd-teal-2 dark:text-qd-teal" />
                            {t('adminLogin.points.secure')}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Users aria-hidden="true" size={15} className="text-qd-teal-2 dark:text-qd-teal" />
                            {t('adminLogin.points.centralized')}
                        </span>
                    </div>
                </section>

                {/* Form card */}
                <section className="mx-auto flex w-full max-w-md flex-col justify-center rounded-3xl border border-qd-mist bg-qd-white p-8 shadow-[0_24px_80px_-48px_rgba(7,17,26,0.45)] sm:p-10 dark:border-qd-white/10 dark:bg-qd-surface">
                    <div className="flex flex-col items-center text-center">
                        <BrandLockup className="h-10" />
                        <h2 className="mt-7 text-2xl font-bold text-qd-ink dark:text-qd-white">
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
                                    <div className="flex flex-wrap items-center justify-between gap-1">
                                        <Label htmlFor="password">
                                            {t('adminLogin.password')}
                                        </Label>
                                        {canResetPassword && (
                                            <a
                                                href={request().url}
                                                className="text-sm font-medium text-qd-teal-2 hover:underline dark:text-qd-teal"
                                                tabIndex={5}
                                            >
                                                {t('adminLogin.forgot')}
                                            </a>
                                        )}
                                    </div>
                                    <PasswordInput
                                        id="password"
                                        name="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder={t('adminLogin.passwordPlaceholder')}
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
                                    {processing ? (
                                        <Spinner />
                                    ) : (
                                        <>
                                            {t('adminLogin.submit')}
                                            <ArrowRight aria-hidden="true" size={16} />
                                        </>
                                    )}
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
                            <ShieldCheck aria-hidden="true" size={14} className="shrink-0" />
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
