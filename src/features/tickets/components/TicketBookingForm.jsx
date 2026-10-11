import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  HiExclamationTriangle,
  HiOutlineCalendarDays,
  HiOutlineClock,
} from 'react-icons/hi2';
import { Button } from '../../../components/ui/Button.jsx';
import { Input } from '../../../components/ui/Input.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { EmptyState } from '../../../components/ui/EmptyState.jsx';
import { Skeleton } from '../../../components/ui/Skeleton.jsx';
import { QuantityStepper } from '../../products/components/QuantityStepper.jsx';
import { applyFieldErrors, firstFieldError, messageFor } from '../../auth/lib/formErrors.js';
import { formatCurrency } from '../../../utils/formatCurrency.js';
import { formatDateTime } from '../../../utils/formatDate.js';
import { cn } from '../../../utils/cn.js';
import {
  NATIONAL_ID_PATTERN,
  PHONE_PATTERN,
  buildBookingItems,
} from '../lib/ticket.js';

const BOOKING_FIELDS = {
  customer_name: 'customer_name',
  national_id: 'national_id',
  phone: 'phone',
  items: 'items',
};

function TicketCard({ ticket, quantity, onChange, language, t }) {
  const selected = quantity > 0;
  const soldOut = ticket.isSoldOut;
  const max = ticket.remaining !== null ? Math.max(ticket.remaining, 1) : 99;

  return (
    <li
      className={cn(
        'rounded-xl border p-4 transition-colors',
        selected
          ? 'border-secondary-500 bg-secondary-500/5 ring-1 ring-secondary-500/40'
          : 'border-border-100 hover:border-border-300',
        soldOut && 'bg-hue-100/50 opacity-80',
      )}
    >
      <div className="flex gap-3">
        {/* <div className="size-16 shrink-0 overflow-hidden rounded-lg bg-linear-to-br from-secondary-500 to-secondary-700">
          {ticket.image ? (
            <img
              src={ticket.image}
              alt=""
              loading="lazy"
              decoding="async"
              className="size-full object-cover"
            />
          ) : null}
        </div> */}

        <div className="min-w-0 flex-1">
          <p className="font-display text-sm font-bold text-base-dark" dir="auto">
            {ticket.name}
          </p>
          {ticket.details && (
            <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-hue-500" dir="auto">
              {ticket.details}
            </p>
          )}

          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-hue-500">
            {ticket.eventAt && (
              <span className="flex items-center gap-1">
                <HiOutlineCalendarDays aria-hidden="true" className="size-3.5" />
                {formatDateTime(ticket.eventAt, { language })}
              </span>
            )}
            {ticket.durationMinutes != null && ticket.durationMinutes > 0 && (
              <span className="flex items-center gap-1">
                <HiOutlineClock aria-hidden="true" className="size-3.5" />
                {t('form.durationMinutes', { count: ticket.durationMinutes })}
              </span>
            )}
            {!soldOut && ticket.remaining !== null && (
              <span>{t('form.remaining', { count: ticket.remaining })}</span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-baseline gap-2">
          <span className="text-base font-bold text-primary-700">
            {formatCurrency(ticket.finalPrice, { language })}
          </span>
          {ticket.discountAmount > 0 && ticket.finalPrice < ticket.price && (
            <span className="text-xs text-hue-500 line-through">
              {formatCurrency(ticket.price, { language })}
            </span>
          )}
        </div>

        {soldOut ? (
          <Badge variant="error" size="sm">
            {t('form.soldOut')}
          </Badge>
        ) : (
          <QuantityStepper
            value={quantity}
            onChange={(next) => onChange(next)}
            min={0}
            max={max}
          />
        )}
      </div>
    </li>
  );
}

export function TicketBookingForm({
  tickets,
  isLoading,
  isError,
  loadError,
  onRetry,
  onSubmit,
}) {
  const { t, i18n } = useTranslation('tickets');
  const language = i18n.resolvedLanguage || 'ar';
  const [quantities, setQuantities] = useState({});
  const [submitError, setSubmitError] = useState(null);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { customer_name: '', national_id: '', phone: '' },
  });

  const changeQuantity = (ticketId, next) => {
    setQuantities((previous) => ({ ...previous, [ticketId]: next }));
    clearErrors('items');
  };

  const handleFormSubmit = handleSubmit(async (values) => {
    setSubmitError(null);

    const items = buildBookingItems(quantities);

    if (!items.length) {
      setError('items', { message: t('form.selectAtLeastOne') });
      return;
    }

    try {
      await onSubmit({ ...values, items });
    } catch (error) {
      applyFieldErrors(error, setError, BOOKING_FIELDS);
      const hasFieldError = Object.keys(BOOKING_FIELDS).some((field) =>
        firstFieldError(error, field),
      );
      if (!hasFieldError) setSubmitError(messageFor(error, t, 'tickets:form.error'));
    }
  });

  return (
    <form onSubmit={handleFormSubmit} className="flex flex-col gap-5" noValidate>
      <div>
        <h2 className="font-display text-2xl font-bold text-base-dark">{t('form.title')}</h2>
        <p className="mt-2 text-sm text-hue-500">{t('form.subtitle')}</p>
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1 text-sm font-medium text-base-dark">
          {t('form.ticketsLabel')}
        </legend>
        <p className="mb-1 text-xs text-hue-500">{t('form.ticketsHint')}</p>

        {isLoading && (
          <ul className="flex flex-col gap-3" aria-hidden="true">
            {[0, 1, 2].map((index) => (
              <li key={index} className="rounded-xl border border-border-100 p-4">
                <div className="flex gap-3">
                  <Skeleton className="size-16 shrink-0" rounded="rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-3 w-3/5" />
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-12 w-28" />
                </div>
              </li>
            ))}
          </ul>
        )}

        {!isLoading && isError && (
          <EmptyState
            compact
            icon={HiExclamationTriangle}
            title={t('form.loadErrorTitle')}
            description={messageFor(loadError, t, 'tickets:form.loadError')}
            action={
              <Button type="button" variant="outline" onClick={onRetry}>
                {t('common:actions.retry')}
              </Button>
            }
          />
        )}

        {!isLoading && !isError && !tickets.length && (
          <EmptyState compact title={t('form.empty')} description={t('form.emptyHint')} />
        )}

        {!isLoading && !isError && tickets.length > 0 && (
          <ul className="flex flex-col gap-3">
            {tickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                t={t}
                language={language}
                quantity={quantities[ticket.id] ?? 0}
                onChange={(next) => changeQuantity(ticket.id, next)}
              />
            ))}
          </ul>
        )}

        {errors.items && (
          <p role="alert" className="text-xs font-medium text-error-500">
            {errors.items.message}
          </p>
        )}
      </fieldset>

      <div className="flex flex-col gap-5 border-t border-border-100 pt-5">
        <Input
          label={t('form.name')}
          autoComplete="name"
          error={errors.customer_name?.message}
          {...register('customer_name', {
            required: t('validation:required'),
            minLength: { value: 2, message: t('validation:minLength', { count: 2 }) },
          })}
        />

        <Input
          label={t('form.nationalId')}
          inputMode="numeric"
          dir="ltr"
          autoComplete="off"
          hint={t('form.nationalIdHint')}
          error={errors.national_id?.message}
          {...register('national_id', {
            required: t('validation:required'),
            validate: (value) =>
              NATIONAL_ID_PATTERN.test(value.trim()) || t('form.nationalIdInvalid'),
          })}
        />

        <Input
          label={t('form.phone')}
          type="tel"
          dir="ltr"
          inputMode="tel"
          autoComplete="tel"
          error={errors.phone?.message}
          {...register('phone', {
            required: t('validation:required'),
            validate: (value) => PHONE_PATTERN.test(value.trim()) || t('validation:phone'),
          })}
        />

        {submitError && (
          <div role="alert" className="rounded-xl bg-error-100 px-4 py-3 text-sm text-error-500">
            {submitError}
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          loading={isSubmitting}
          disabled={isLoading || isError || tickets.length === 0}
          className="w-full"
        >
          {t('form.submit')}
        </Button>
      </div>
    </form>
  );
}
