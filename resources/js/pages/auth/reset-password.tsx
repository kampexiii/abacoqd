import { Form, Head } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

import BrandedAuthShell from '@/components/auth/BrandedAuthShell';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useLanguage } from '@/hooks/use-language';
import { update } from '@/routes/password';

type Props = {
    token: string;
    email: string;
    passwordRules: string;
};

export default function ResetPassword({ token, email, passwordRules }: Props) {
    const { t } = useLanguage();

    return (
        <>
            <Head title={t('adminPasswordReset.metaTitle')} />

            <BrandedAuthShell
                eyebrow={t('adminPasswordReset.eyebrow')}
                panelTitle={t('adminPasswordReset.panelTitle')}
                panelSubtitle={t('adminPasswordReset.panelSubtitle')}
                title={t('adminPasswordReset.title')}
                subtitle={t('adminPasswordReset.subtitle')}
            >
                <Form
                    {...update.form()}
                    transform={(data) => ({ ...data, token, email })}
                    resetOnSuccess={['password', 'password_confirmation']}
                    className="mt-8 grid gap-5"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="email">
                                    {t('adminPasswordReset.email')}
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="email"
                                    value={email}
                                    readOnly
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">
                                    {t('adminPasswordReset.password')}
                                </Label>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    autoComplete="new-password"
                                    autoFocus
                                    placeholder={t(
                                        'adminPasswordReset.passwordPlaceholder',
                                    )}
                                    passwordrules={passwordRules}
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">
                                    {t(
                                        'adminPasswordReset.passwordConfirmation',
                                    )}
                                </Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    autoComplete="new-password"
                                    placeholder={t(
                                        'adminPasswordReset.passwordConfirmationPlaceholder',
                                    )}
                                    passwordrules={passwordRules}
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <button
                                type="submit"
                                className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-qd-lime px-5 py-3 text-sm font-bold text-qd-ink transition hover:brightness-95 disabled:opacity-60"
                                disabled={processing}
                                data-test="reset-password-button"
                            >
                                {processing ? (
                                    <Spinner />
                                ) : (
                                    <>
                                        {t('adminPasswordReset.submit')}
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
                        {t('adminPasswordReset.backToLogin')}
                    </a>
                    <a
                        href="/"
                        className="mt-3 flex w-full items-center justify-center gap-2 text-sm font-medium text-qd-text-medium transition hover:text-qd-teal-2 dark:text-qd-white/50 dark:hover:text-qd-teal"
                    >
                        {t('adminPasswordReset.backToSite')}
                    </a>
                </div>
            </BrandedAuthShell>
        </>
    );
}
