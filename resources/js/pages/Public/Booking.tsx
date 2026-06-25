import { Form } from '@inertiajs/react';
import {
    ArrowRight,
    CalendarDays,
    CheckCircle2,
    Clock,
    MailQuestion,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { emitInternalEvent } from '@/components/privacy/internal-events';
import BookingCalendarPicker from '@/components/public/BookingCalendarPicker';
import FormField, {
    formFieldInputClass,
    formFieldSelectClass,
} from '@/components/public/FormField';
import HoneypotField from '@/components/public/HoneypotField';
import PublicPageHero from '@/components/public/PublicPageHero';
import SeoHead from '@/components/seo/SeoHead';
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
    readonly time: string;
    readonly endTime: string;
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
    readonly time: string;
    readonly endTime: string;
    readonly durationMinutes: number;
};

type BookingProps = {
    readonly days: readonly Day[];
    readonly services: ServiceOption[];
    readonly confirmedBooking: ConfirmedBooking | null;
};

const STEP_KEYS = ['process', 'needs', 'approach'] as const;

function formatDate(value: string, locale: Locale): string {
    // value es 'YYYY-MM-DD'; se ancla a medianoche local para evitar que la
    // conversión de zona horaria desplace el día.
    return new Intl.DateTimeFormat(locale === 'es' ? 'es-ES' : 'en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    }).format(new Date(`${value}T00:00:00`));
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

    // Evento interno no invasivo (sin PII): intención de iniciar reserva, una
    // sola vez al elegir el primer hueco. No altera la selección ni el submit.
    const bookingStartTracked = useRef(false);

    useEffect(() => {
        if (selectedSlotId !== null && !bookingStartTracked.current) {
            bookingStartTracked.current = true;
            emitInternalEvent('booking_start_intent', { type: 'booking' });
        }
    }, [selectedSlotId]);

    return (
        <PublicLayout>
            <SeoHead />

            <PublicPageHero
                eyebrow={t('booking.eyebrow')}
                title={t('booking.title')}
                subtitle={t('booking.subtitle')}
                currentLabel={t('booking.eyebrow')}
                taglineTitle={t('booking.afterTitle')}
                taglineSubtitle={t('booking.afterDescription')}
                taglineIcon={CalendarDays}
            />

            {!confirmedBooking && (
                <section className="bg-qd-white dark:bg-qd-ink">
                    <div className="mx-auto max-w-310 px-5 py-14 sm:px-8">
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
                <div className="mx-auto max-w-310 px-5 py-14 sm:px-8">
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
                                    {confirmedBooking.time} –{' '}
                                    {confirmedBooking.endTime}
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
                        <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
                            <div>
                                <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-qd-ink dark:text-qd-white">
                                    <CalendarDays aria-hidden="true" size={16} />
                                    {t('booking.dayLabel')}
                                </h2>
                                <BookingCalendarPicker
                                    days={days}
                                    selectedDate={selectedDay?.date ?? null}
                                    onSelect={(_, dayId) => {
                                        setSelectedDayId(dayId);
                                        setSelectedSlotId(null);
                                    }}
                                    locale={locale}
                                />
                            </div>

                            {selectedDay && (
                                <div>
                                    <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-qd-ink capitalize dark:text-qd-white">
                                        <Clock aria-hidden="true" size={16} />
                                        {formatDate(selectedDay.date, locale)}
                                    </h2>
                                    {selectedDay.slots.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {selectedDay.slots.map((slot) => (
                                                <button
                                                    key={slot.id}
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedSlotId(slot.id)
                                                    }
                                                    aria-pressed={
                                                        slot.id === selectedSlotId
                                                    }
                                                    className={cn(
                                                        'rounded-xl border px-4 py-2.5 text-sm font-semibold transition',
                                                        slot.id === selectedSlotId
                                                            ? 'border-qd-teal-2 bg-qd-teal-2/10 text-qd-ink dark:border-qd-teal dark:text-qd-white'
                                                            : 'border-qd-mist text-qd-text-high hover:border-qd-teal-2 dark:border-white/10',
                                                    )}
                                                >
                                                    {slot.time} – {slot.endTime}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-qd-text-medium">
                                            —
                                        </p>
                                    )}
                                </div>
                            )}

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
                                                    onClick={() =>
                                                        emitInternalEvent(
                                                            'booking_submit_intent',
                                                            { type: 'booking' },
                                                        )
                                                    }
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
                    <div className="mx-auto max-w-310 px-5 py-10 text-center sm:px-8">
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
