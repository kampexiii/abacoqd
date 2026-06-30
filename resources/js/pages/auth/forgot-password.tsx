import { Form, Head } from '@inertiajs/react';
import { ArrowRight, LoaderCircle } from 'lucide-react';

import BrandedAuthShell from '@/components/auth/BrandedAuthShell';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/hooks/use-language';
import { email } from '@/routes/password';

export default function ForgotPassword({ status }: { status?: string }) {
    const { t } = useLanguage();

    return (
        <>
            <Head title={t('adminPasswordRecovery.metaTitle')} />

            <BrandedAuthShell
                eyebrow={t('adminPasswordRecovery.eyebrow')}
                panelTitle={t('adminPasswordRecovery.panelTitle')}
                panelSubtitle={t('adminPasswordRecovery.panelSubtitle')}
                title={t('adminPasswordRecovery.title')}
                subtitle={t('adminPasswordRecovery.subtitle')}
            >
                {status && (
                    <div className="mt-6 rounded-lg bg-emerald-50 px-4 py-2 text-center text-sm font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                        {t('adminPasswordRecovery.status')}
                    </div>
                )}

                <Form {...email.form()} className="mt-8 flex flex-col gap-5">
                    {({ processing, errors }) => (
                        <>
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="email">
                                    {t('adminPasswordRecovery.email')}
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    autoComplete="email"
                                    placeholder={t(
                                        'adminPasswordRecovery.emailPlaceholder',
                                    )}
                                />
                                <InputError message={errors.email} />
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                data-test="email-password-reset-link-button"
                                className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-qd-lime px-5 py-3 text-sm font-bold text-qd-ink transition hover:brightness-95 disabled:opacity-60"
                            >
                                {processing ? (
                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                ) : (
                                    <>
                                        {t('adminPasswordRecovery.submit')}
                                        <ArrowRight
                                            aria-hidden="true"
                                            size={16}
                                        />
                                    </>
                                )}
                            </button>
                        </>
                    )}
                </Form>

                <div className="mt-7 border-t border-qd-mist pt-6 dark:border-qd-white/10">
                    <a
                        href="/login"
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-qd-mist px-5 py-3 text-sm font-semibold text-qd-text-high transition hover:border-qd-teal-2/40 hover:text-qd-teal-2 dark:border-qd-white/10 dark:text-qd-white/70 dark:hover:text-qd-teal"
                    >
                        {t('adminPasswordRecovery.backToLogin')}
                    </a>
                    <a
                        href="/"
                        className="mt-3 flex w-full items-center justify-center gap-2 text-sm font-medium text-qd-text-medium transition hover:text-qd-teal-2 dark:text-qd-white/50 dark:hover:text-qd-teal"
                    >
                        {t('adminPasswordRecovery.backToSite')}
                    </a>
                </div>
            </BrandedAuthShell>
        </>
    );
}
