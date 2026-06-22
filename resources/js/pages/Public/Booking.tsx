import { Form, Head } from '@inertiajs/react';
import {
    ArrowRight,
    CalendarDays,
    CheckCircle2,
    Clock,
    MailQuestion,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import FormField, {
    formFieldInputClass,
    formFieldSelectClass,
} from '@/components/public/FormField';
import HoneypotField from '@/components/public/HoneypotField';
import { useLanguage } from '@/hooks/use-language';
import type { Locale } from '@/hooks/use-language';
import PublicLayout from '@/layouts/public-layout';
import { cn } from '@/lib/utils';
import { store } from '@/routes/booking';
import { show as contactShow } from '@/routes/contact';

type Slot = {
    readonly id: number;
    readonly startsAt: string;
    readonly endsAt: string;
    readonly durationMinutes: number;
};

type Day = {
    readonly id: number;
    readonly date: string;
    readonly title: string | null;
    readonly slots: readonly Slot[];
};

type ServiceOption = {
    readonly id: number;
    readonly title: { readonly es: string; readonly en: string };
};

type ConfirmedBooking = {
    readonly name: string;
    readonly email: string;
    readonly date: string;
    readonly startsAt: string;
    readonly endsAt: string;
    readonly durationMinutes: number;
};

type BookingProps = {
    readonly days: readonly Day[];
    readonly services: ServiceOption[];
    readonly confirmedBooking: ConfirmedBooking | null;
};

const STEP_KEYS = ['process', 'needs', 'approach'] as const;

function formatDate(value: string, locale: Locale): string {
    return new Intl.DateTimeFormat(locale === 'es' ? 'es-ES' : 'en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    }).format(new Date(value));
}

function formatTime(value: string, locale: Locale): string {
    return new Intl.DateTimeFormat(locale === 'es' ? 'es-ES' : 'en-GB', {
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(value));
}

/**
 * Vista pública Reserva — sistema propio de citas (appointment_days/slots/
 * bookings). docs/07_VISTAS/PUBLIC_06_CONTACTO_RESERVA.md (sección B).
 */
export default function Booking({
    days,
    services,
    confirmedBooking,
}: BookingProps) {
    const { t, locale } = useLanguage();
    const [selectedDayId, setSelectedDayId] = useState<number | null>(
        days[0]?.id ?? null,
    );
    const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);

    const selectedDay = useMemo(
        () => days.find((day) => day.id === selectedDayId) ?? null,
        [days, selectedDayId],
    );

    const selectedSlot = useMemo(
        () =>
            selectedDay?.slots.find((slot) => slot.id === selectedSlotId) ??
            null,
        [selectedDay, selectedSlotId],
    );

    return (
        <PublicLayout>
            <Head title="Reserva · AbacoQD" />

            <section className="bg-qd-ink text-qd-white">
                <div className="mx-auto max-w-[1240px] px-5 py-16 sm:px-8">
                    <p className="text-sm font-semibold tracking-wide text-qd-lime">
                        {t('booking.eyebrow')}
                    </p>
                    <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
                        {t('booking.title')}
                    </h1>
                    <p className="mt-3 max-w-xl text-qd-text-medium">
                        {t('booking.subtitle')}
                    </p>
                </div>
            </section>

            {!confirmedBooking && (
                <section className="bg-qd-white dark:bg-qd-ink">
                    <div className="mx-auto max-w-[1240px] px-5 py-14 sm:px-8">
                        <h2 className="sr-only">{t('booking.stepsTitle')}</h2>
                        <ol className="grid gap-6 sm:grid-cols-3">
                            {STEP_KEYS.map((key, index) => (
                                <li
                                    key={key}
                                    className="rounded-2xl border border-qd-mist p-5 dark:border-white/10"
                                >
                                    <span className="text-xs font-semibold text-qd-teal-2 dark:text-qd-teal">
                                        0{index + 1}
                                    </span>
                                    <h3 className="mt-1 font-semibold text-qd-ink dark:text-qd-white">
                                        {t(`booking.steps.${key}.title`)}
                                    </h3>
                                    <p className="mt-1 text-sm text-qd-text-high">
                                        {t(`booking.steps.${key}.description`)}
                                    </p>
                                </li>
                            ))}
                        </ol>
                    </div>
                </section>
            )}

            <section className="bg-qd-mist dark:bg-qd-surface">
                <div className="mx-auto max-w-[1240px] px-5 py-14 sm:px-8">
                    {confirmedBooking ? (
                        <div
                            role="status"
                            className="mx-auto flex max-w-lg flex-col items-center gap-4 rounded-2xl border border-qd-mist bg-qd-white p-10 text-center dark:border-white/10 dark:bg-white/5"
                        >
                            <CheckCircle2
                                aria-hidden="true"
                                size={36}
                                className="text-qd-teal-2 dark:text-qd-teal"
                            />
                            <h2 className="text-xl font-semibold text-qd-ink dark:text-qd-white">
                                {t('booking.confirmation.title')}
                            </h2>
                            <p className="text-sm text-qd-text-high">
                                {t('booking.confirmation.subtitle')}
                            </p>
                            <dl className="grid w-full grid-cols-2 gap-3 text-left text-sm">
                                <dt className="text-qd-text-medium">
                                    {t('booking.summary.day')}
                                </dt>
                                <dd className="text-qd-ink dark:text-qd-white">
                                    {formatDate(confirmedBooking.date, locale)}
                                </dd>
                                <dt className="text-qd-text-medium">
                                    {t('booking.summary.hour')}
                                </dt>
                                <dd className="text-qd-ink dark:text-qd-white">
                                    {formatTime(
                                        confirmedBooking.startsAt,
                                        locale,
                                    )}
                                </dd>
                                <dt className="text-qd-text-medium">
                                    {t('booking.summary.duration')}
                                </dt>
                                <dd className="text-qd-ink dark:text-qd-white">
                                    {confirmedBooking.durationMinutes}{' '}
                                    {t('booking.minutes')}
                                </dd>
                                <dt className="text-qd-text-medium">
                                    {t('booking.summary.name')}
                                </dt>
                                <dd className="text-qd-ink dark:text-qd-white">
                                    {confirmedBooking.name}
                                </dd>
                                <dt className="text-qd-text-medium">
                                    {t('booking.summary.email')}
                                </dt>
                                <dd className="text-qd-ink dark:text-qd-white">
                                    {confirmedBooking.email}
                                </dd>
                            </dl>
                            <p className="text-xs text-qd-text-medium">
                                {t('booking.summary.nextStep')}
                            </p>
                        </div>
                    ) : days.length === 0 ? (
                        <div className="mx-auto flex max-w-lg flex-col items-center gap-4 rounded-2xl border border-dashed border-qd-mist bg-qd-white p-10 text-center dark:border-white/10 dark:bg-white/5">
                            <MailQuestion
                                aria-hidden="true"
                                size={32}
                                className="text-qd-text-medium"
                            />
                            <h2 className="text-lg font-semibold text-qd-ink dark:text-qd-white">
                                {t('booking.empty.title')}
                            </h2>
                            <p className="text-sm text-qd-text-high">
                                {t('booking.empty.subtitle')}
                            </p>
                            <a
                                href={contactShow.url()}
                                className="inline-flex items-center gap-2 rounded-xl bg-qd-lime px-5 py-2.5 text-sm font-semibold text-qd-ink transition hover:brightness-95"
                            >
                                {t('booking.empty.cta')}
                            </a>
                        </div>
                    ) : (
                        <div className="grid gap-8 lg:grid-cols-[1fr_1fr_1.3fr]">
                            <div>
                                <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-qd-ink dark:text-qd-white">
                                    <CalendarDays
                                        aria-hidden="true"
                                        size={16}
                                    />
                                    {t('booking.dayLabel')}
                                </h2>
                                <ul className="flex flex-col gap-2">
                                    {days.map((day) => (
                                        <li key={day.id}>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedDayId(day.id);
                                                    setSelectedSlotId(null);
                                                }}
                                                aria-pressed={
                                                    day.id === selectedDayId
                                                }
                                                className={cn(
                                                    'w-full rounded-xl border px-4 py-2.5 text-left text-sm font-medium capitalize transition',
                                                    day.id === selectedDayId
                                                        ? 'border-qd-teal-2 bg-qd-teal-2/10 text-qd-ink dark:border-qd-teal dark:text-qd-white'
                                                        : 'border-qd-mist text-qd-text-high hover:border-qd-teal-2 dark:border-white/10',
                                                )}
                                            >
                                                {formatDate(day.date, locale)}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-qd-ink dark:text-qd-white">
                                    <Clock aria-hidden="true" size={16} />
                                    {t('booking.slotLabel')}
                                </h2>
                                {selectedDay ? (
                                    <ul className="flex flex-col gap-2">
                                        {selectedDay.slots.map((slot) => (
                                            <li key={slot.id}>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedSlotId(
                                                            slot.id,
                                                        )
                                                    }
                                                    aria-pressed={
                                                        slot.id ===
                                                        selectedSlotId
                                                    }
                                                    className={cn(
                                                        'w-full rounded-xl border px-4 py-2.5 text-left text-sm font-medium transition',
                                                        slot.id ===
                                                            selectedSlotId
                                                            ? 'border-qd-teal-2 bg-qd-teal-2/10 text-qd-ink dark:border-qd-teal dark:text-qd-white'
                                                            : 'border-qd-mist text-qd-text-high hover:border-qd-teal-2 dark:border-white/10',
                                                    )}
                                                >
                                                    {formatTime(
                                                        slot.startsAt,
                                                        locale,
                                                    )}{' '}
                                                    · {slot.durationMinutes}{' '}
                                                    {t('booking.minutes')}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-qd-text-medium">
                                        —
                                    </p>
                                )}
                            </div>

                            <div>
                                {selectedSlot ? (
                                    <Form
                                        {...store.form()}
                                        disableWhileProcessing
                                        className="flex flex-col gap-4 rounded-2xl border border-qd-mist bg-qd-white p-6 dark:border-white/10 dark:bg-white/5"
                                    >
                                        {({ processing, errors }) => (
                                            <>
                                                <h2 className="text-sm font-semibold text-qd-ink dark:text-qd-white">
                                                    {t('booking.form.title')}
                                                </h2>

                                                <input
                                                    type="hidden"
                                                    name="appointment_slot_id"
                                                    value={selectedSlot.id}
                                                />
                                                {errors.appointment_slot_id && (
                                                    <p
                                                        role="alert"
                                                        className="text-sm text-red-600 dark:text-red-400"
                                                    >
                                                        {
                                                            errors.appointment_slot_id
                                                        }
                                                    </p>
                                                )}

                                                <FormField
                                                    label={t(
                                                        'booking.form.name',
                                                    )}
                                                    error={errors.name}
                                                >
                                                    <input
                                                        name="name"
                                                        required
                                                        autoComplete="name"
                                                        className={
                                                            formFieldInputClass
                                                        }
                                                    />
                                                </FormField>
                                                <FormField
                                                    label={t(
                                                        'booking.form.company',
                                                    )}
                                                    error={errors.company}
                                                >
                                                    <input
                                                        name="company"
                                                        autoComplete="organization"
                                                        className={
                                                            formFieldInputClass
                                                        }
                                                    />
                                                </FormField>
                                                <FormField
                                                    label={t(
                                                        'booking.form.email',
                                                    )}
                                                    error={errors.email}
                                                >
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        required
                                                        autoComplete="email"
                                                        className={
                                                            formFieldInputClass
                                                        }
                                                    />
                                                </FormField>
                                                <FormField
                                                    label={t(
                                                        'booking.form.phone',
                                                    )}
                                                    error={errors.phone}
                                                >
                                                    <input
                                                        type="tel"
                                                        name="phone"
                                                        autoComplete="tel"
                                                        className={
                                                            formFieldInputClass
                                                        }
                                                    />
                                                </FormField>

                                                {services.length > 0 && (
                                                    <FormField
                                                        label={t(
                                                            'booking.form.service',
                                                        )}
                                                        error={
                                                            errors.service_id
                                                        }
                                                    >
                                                        <select
                                                            name="service_id"
                                                            defaultValue=""
                                                            className={
                                                                formFieldSelectClass
                                                            }
                                                        >
                                                            <option value="">
                                                                {t(
                                                                    'booking.form.servicePlaceholder',
                                                                )}
                                                            </option>
                                                            {services.map(
                                                                (service) => (
                                                                    <option
                                                                        key={
                                                                            service.id
                                                                        }
                                                                        value={
                                                                            service.id
                                                                        }
                                                                    >
                                                                        {service
                                                                            .title[
                                                                            locale
                                                                        ] ??
                                                                            service
                                                                                .title
                                                                                .es}
                                                                    </option>
                                                                ),
                                                            )}
                                                        </select>
                                                    </FormField>
                                                )}

                                                <FormField
                                                    label={t(
                                                        'booking.form.message',
                                                    )}
                                                    error={errors.message}
                                                >
                                                    <textarea
                                                        name="message"
                                                        rows={3}
                                                        placeholder={t(
                                                            'booking.form.messagePlaceholder',
                                                        )}
                                                        className={
                                                            formFieldInputClass
                                                        }
                                                    />
                                                </FormField>

                                                <label className="flex items-start gap-2.5 text-sm text-qd-text-high">
                                                    <input
                                                        type="checkbox"
                                                        name="privacy_consent"
                                                        required
                                                        className="mt-1 size-4 rounded border-qd-mist text-qd-teal-2 focus-visible:outline-2 focus-visible:outline-qd-teal-2"
                                                    />
                                                    <span>
                                                        {t(
                                                            'booking.form.privacyConsent',
                                                        )}{' '}
                                                        <a
                                                            href="/privacidad"
                                                            className="underline hover:text-qd-teal-2 dark:hover:text-qd-teal"
                                                        >
                                                            {t(
                                                                'booking.form.privacyConsentLink',
                                                            )}
                                                        </a>
                                                        .
                                                    </span>
                                                </label>
                                                {errors.privacy_consent && (
                                                    <p
                                                        role="alert"
                                                        className="text-sm text-red-600 dark:text-red-400"
                                                    >
                                                        {errors.privacy_consent}
                                                    </p>
                                                )}

                                                <label className="flex items-start gap-2.5 text-sm text-qd-text-high">
                                                    <input
                                                        type="checkbox"
                                                        name="marketing_consent"
                                                        className="mt-1 size-4 rounded border-qd-mist text-qd-teal-2"
                                                    />
                                                    <span>
                                                        {t(
                                                            'booking.form.marketingConsent',
                                                        )}
                                                    </span>
                                                </label>

                                                <HoneypotField id="booking-honeypot" />

                                                <button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-qd-lime px-5 py-3 text-sm font-semibold text-qd-ink transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
                                                >
                                                    {processing
                                                        ? t(
                                                              'booking.form.submitting',
                                                          )
                                                        : t(
                                                              'booking.form.submit',
                                                          )}
                                                    <ArrowRight
                                                        aria-hidden="true"
                                                        size={16}
                                                    />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedSlotId(null)
                                                    }
                                                    className="text-xs text-qd-text-medium underline"
                                                >
                                                    {t(
                                                        'booking.form.backToSlots',
                                                    )}
                                                </button>
                                            </>
                                        )}
                                    </Form>
                                ) : (
                                    <div className="flex h-full min-h-32 items-center justify-center rounded-2xl border border-dashed border-qd-mist p-6 text-center text-sm text-qd-text-medium dark:border-white/10">
                                        {t('booking.summary.nextStep')}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {!confirmedBooking && days.length > 0 && (
                <section className="bg-qd-white dark:bg-qd-ink">
                    <div className="mx-auto max-w-[1240px] px-5 py-10 text-center sm:px-8">
                        <p className="text-sm font-semibold text-qd-ink dark:text-qd-white">
                            {t('booking.alternative.title')}
                        </p>
                        <a
                            href={contactShow.url()}
                            className="mt-2 inline-flex text-sm font-semibold text-qd-teal-2 underline dark:text-qd-teal"
                        >
                            {t('booking.alternative.cta')}
                        </a>
                        <p className="mx-auto mt-6 max-w-md text-xs text-qd-text-medium">
                            {t('booking.afterDescription')}
                        </p>
                    </div>
                </section>
            )}
        </PublicLayout>
    );
}
