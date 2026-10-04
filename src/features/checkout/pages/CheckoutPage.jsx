import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FaGem } from 'react-icons/fa';
import {
  HiBanknotes,
  HiCheckCircle,
  HiCreditCard,
  HiShieldCheck,
  HiShoppingBag,
  HiTicket,
  HiTruck,
} from 'react-icons/hi2';
import { Seo } from '../../../components/Seo.jsx';
import { Container } from '../../../components/Container.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Input } from '../../../components/ui/Input.jsx';
import { EmptyState } from '../../../components/ui/EmptyState.jsx';
import { Skeleton } from '../../../components/ui/Skeleton.jsx';
import { useCart } from '../../cart/hooks/useCart.js';
import { normalizeCart } from '../../cart/lib/cartHelpers.js';
import { useCheckout } from '../../orders/hooks/useOrders.js';
import { useCheckCoupon } from '../../coupons/hooks/useCheckCoupon.js';
import { loadAddress, saveAddress } from '../lib/addressStorage.js';
import { messageFor, applyFieldErrors } from '../../auth/lib/formErrors.js';
import { resolveImageUrl } from '../../../utils/media.js';
import { formatCurrency } from '../../../utils/formatCurrency.js';
import { cn } from '../../../utils/cn.js';
import { paths } from '../../../lib/paths.js';

const STEPS = [
  { key: 'address', labelKey: 'checkout:steps.address' },
  { key: 'payment', labelKey: 'checkout:steps.payment' },
  { key: 'review', labelKey: 'checkout:steps.review' },
];

const PHONE_PATTERN = /^[0-9+\s-]{8,}$/;

const PAYMENT_OPTIONS = [
  { key: 'card', icon: HiCreditCard, labelKey: 'checkout:payment.card' },
  { key: 'bankTransfer', icon: HiBanknotes, labelKey: 'checkout:payment.bankTransfer' },
  { key: 'cashOnDelivery', icon: HiTruck, labelKey: 'checkout:payment.cashOnDelivery' },
];

export default function CheckoutPage() {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage || 'ar';
  const navigate = useNavigate();

  const [savedAddress] = useState(loadAddress);
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [submitError, setSubmitError] = useState(null);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState(null);

  const cart = useCart();
  const placeOrder = useCheckout();
  const couponCheck = useCheckCoupon();

  const { items, count, subtotal } = normalizeCart(cart.data);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: savedAddress?.name ?? '',
      phone: savedAddress?.phone ?? '',
      city: savedAddress?.city ?? '',
      addressLine: savedAddress?.addressLine ?? '',
    },
  });

  const couponDiscount =
    Number(appliedCoupon?.data?.discount ?? appliedCoupon?.data?.amount ?? 0) || 0;

  const applyCoupon = () => {
    const code = couponInput.trim();
    if (!code || couponCheck.isPending) return;

    couponCheck.mutate(
      { code, category_ids: [] },
      {
        onSuccess: (data) => {
          setAppliedCoupon({ code, data });
          setCouponMessage({ type: 'success', text: t('checkout:couponApplied') });
        },
        onError: () => {
          setAppliedCoupon(null);
          setCouponMessage({ type: 'error', text: t('checkout:couponInvalid') });
        },
      },
    );
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponMessage({ type: 'info', text: t('checkout:couponRemoved') });
  };

  const onSubmit = (values) => {
    setSubmitError(null);
    saveAddress(values);

    placeOrder.mutate(
      {
        shipping_address: {
          name: values.name,
          phone: values.phone,
          city: values.city,
          address_line: values.addressLine,
        },
        coupon_code: appliedCoupon?.code || undefined,
      },
      {
        onSuccess: (response) => {
          const order = response?.order ?? response ?? null;
          const orderId = order?.id ?? response?.id;
          navigate(orderId ? paths.checkoutSuccess(orderId) : paths.accountOrders, {
            replace: true,
          });
        },
        onError: (error) => {
          setSubmitError(messageFor(error, t, 'checkout:placeOrderError'));
          applyFieldErrors(error, setError, {
            name: 'name',
            phone: 'phone',
            city: 'city',
            address_line: 'addressLine',
          });
        },
      },
    );
  };

  const onSubmitSafe = handleSubmit(onSubmit, () => setStep(1));

  return (
    <>
      <Seo title={t('checkout:title')} description={t('common:tagline')} noIndex />

      <Container className="py-10">
        <h1 className="font-display text-3xl font-bold text-base-dark">{t('checkout:title')}</h1>

        {cart.isPending ? (
          <CheckoutSkeleton />
        ) : items.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              icon={HiShoppingBag}
              title={t('checkout:orderEmpty')}
              description={t('checkout:orderEmptyHint')}
              action={<Button to={paths.shop}>{t('common:actions.browse')}</Button>}
            />
          </div>
        ) : (
          <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <section aria-label={t('checkout:title')} className="flex flex-col gap-6">
              <StepsNav current={step} steps={STEPS} onSelect={setStep} />

              <div className={step === 1 ? '' : 'hidden'}>
                <AddressStep register={register} errors={errors} t={t} />
              </div>

              <div className={step === 2 ? '' : 'hidden'}>
                <PaymentStep paymentMethod={paymentMethod} onChange={setPaymentMethod} t={t} />
              </div>

              <div className={step === 3 ? '' : 'hidden'}>
                <ReviewStep language={language} />
              </div>

              {submitError && (
                <div
                  role="alert"
                  className="rounded-xl bg-error-100 px-4 py-3 text-sm text-error-500"
                >
                  {submitError}
                </div>
              )}

              <div className="flex items-center justify-between gap-3">
                {step > 1 ? (
                  <Button variant="ghost" onClick={() => setStep((current) => current - 1)}>
                    {t('checkout:back')}
                  </Button>
                ) : (
                  <Button to={paths.cart} variant="ghost">
                    {t('checkout:backToCart')}
                  </Button>
                )}

                {step < STEPS.length ? (
                  <Button onClick={() => setStep((current) => current + 1)}>
                    {t('checkout:next')}
                  </Button>
                ) : (
                  <Button size="lg" onClick={onSubmitSafe} loading={placeOrder.isPending}>
                    {t('checkout:placeOrder')}
                  </Button>
                )}
              </div>
            </section>

            <SummarySidebar
              language={language}
              count={count}
              subtotal={subtotal}
              couponDiscount={couponDiscount}
              appliedCoupon={appliedCoupon}
              couponInput={couponInput}
              couponCheckPending={couponCheck.isPending}
              couponMessage={couponMessage}
              onInputChange={setCouponInput}
              onApply={applyCoupon}
              onRemove={removeCoupon}
              t={t}
            />
          </div>
        )}
      </Container>
    </>
  );
}

function StepsNav({ current, steps, onSelect }) {
  const { t } = useTranslation();

  return (
    <ol className="flex flex-wrap items-center gap-2">
      {steps.map((step, index) => {
        const position = index + 1;
        const state = position === current ? 'current' : position < current ? 'done' : 'upcoming';

        return (
          <li key={step.key}>
            <button
              type="button"
              onClick={() => onSelect(position)}
              aria-current={state === 'current' ? 'step' : undefined}
              className={cn(
                'flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors',
                state === 'current' && 'border-primary-500 bg-primary-100 text-primary-700',
                state === 'done' && 'border-secondary-500/40 bg-secondary-100 text-secondary-700',
                state === 'upcoming' && 'border-border-100 bg-white text-hue-500 hover:bg-hue-100',
              )}
            >
              <span
                className={cn(
                  'grid size-5 place-items-center rounded-full text-[11px] font-bold',
                  (state === 'current' || state === 'done') && 'bg-primary-500 text-white',
                  state === 'upcoming' && 'bg-hue-100 text-hue-500',
                )}
              >
                {state === 'done' ? <HiCheckCircle aria-hidden="true" /> : position}
              </span>
              {t(step.labelKey)}
            </button>
          </li>
        );
      })}
    </ol>
  );
}

function AddressStep({ register, errors, t }) {
  return (
    <div className="grid gap-5 rounded-2xl border border-border-100 bg-white p-6 sm:grid-cols-2">
      <Input
        label={t('checkout:fields.name')}
        placeholder={t('checkout:fields.name')}
        autoComplete="name"
        error={errors.name?.message}
        {...register('name', { required: t('validation:required') })}
      />
      <Input
        label={t('checkout:fields.phone')}
        type="tel"
        autoComplete="tel"
        error={errors.phone?.message}
        {...register('phone', {
          required: t('validation:required'),
          pattern: { value: PHONE_PATTERN, message: t('validation:phone') },
        })}
      />
      <Input
        label={t('checkout:fields.city')}
        autoComplete="address-level2"
        error={errors.city?.message}
        {...register('city', { required: t('validation:required') })}
      />
      <div className="sm:col-span-2">
        <Input
          label={t('checkout:fields.addressLine')}
          placeholder={t('checkout:fields.addressPlaceholder')}
          autoComplete="street-address"
          error={errors.addressLine?.message}
          {...register('addressLine', { required: t('validation:required') })}
        />
      </div>
    </div>
  );
}

function PaymentStep({ paymentMethod, onChange, t }) {
  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-border-100 bg-white p-6">
      <div>
        <p className="text-sm font-medium text-base-dark">{t('checkout:paymentOptionLabel')}</p>
        <div className="mt-3 flex flex-col gap-3">
          {PAYMENT_OPTIONS.map(({ key, icon: Icon, labelKey }) => (
            <label
              key={key}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-border-100 px-4 py-3 transition-colors has-[:checked]:border-secondary-500 has-[:checked]:bg-secondary-50"
            >
              <input
                type="radio"
                name="payment-method"
                value={key}
                checked={paymentMethod === key}
                onChange={() => onChange(key)}
                className="size-4 text-secondary-500 accent-secondary-500"
              />
              <Icon aria-hidden="true" className="size-5 text-secondary-500" />
              <span className="text-sm font-medium text-base-dark">{t(labelKey)}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-xl bg-secondary-50 px-4 py-4 text-sm leading-7 text-secondary-700">
        <HiShieldCheck aria-hidden="true" className="mt-1 size-5 shrink-0 text-secondary-500" />
        <div>
          <p className="font-medium">{t('checkout:paymentNoteTitle')}</p>
          <p className="text-secondary-600">{t('checkout:paymentNoteBody')}</p>
        </div>
      </div>
    </div>
  );
}

function ReviewStep({ language }) {
  const { t, i18n } = useTranslation();
  const { items } = normalizeCart(useCart().data);
  const resolvedLanguage = language || i18n.resolvedLanguage || 'ar';

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border-100 bg-white p-6">
      <h2 className="font-display text-lg font-bold text-base-dark">
        {t('checkout:reviewSummary')}
      </h2>
      <ul className="flex flex-col divide-y divide-border-100">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
            <span className="block size-14 shrink-0 overflow-hidden rounded-lg bg-secondary-100">
              {item.image ? (
                <img
                  src={resolveImageUrl(item.image)}
                  alt=""
                  width={56}
                  height={56}
                  loading="lazy"
                  className="size-full object-cover"
                />
              ) : (
                <span className="grid size-full place-items-center">
                  <FaGem aria-hidden="true" className="size-4 text-secondary-300" />
                </span>
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-1 text-sm font-medium text-base-dark">{item.name}</p>
              <p className="text-xs text-hue-500">
                {item.quantity} × {formatCurrency(item.unitPrice, { language: resolvedLanguage })}
              </p>
            </div>
            <span className="text-sm font-bold text-primary-700">
              {formatCurrency(item.lineTotal, { language: resolvedLanguage })}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SummarySidebar({
  language,
  count,
  subtotal,
  couponDiscount,
  appliedCoupon,
  couponInput,
  couponCheckPending,
  couponMessage,
  onInputChange,
  onApply,
  onRemove,
  t,
}) {
  return (
    <aside className="flex flex-col gap-4 rounded-2xl border border-border-100 bg-white p-6 shadow-sm lg:sticky lg:top-28">
      <h2 className="font-display text-lg font-bold text-base-dark">
        {t('checkout:reviewSummary')}
      </h2>

      <div>
        <p className="text-xs text-hue-500">{t('checkout:items')}</p>
        <p className="mt-1 text-sm font-medium text-base-dark">{t('cart:itemsCount', { count })}</p>
      </div>

      <div className="flex flex-col gap-4 rounded-xl bg-bg-secondary p-4">
        <label className="flex flex-col gap-1.5">
          <span className="flex items-center gap-1.5 text-sm font-medium text-base-dark">
            <HiTicket aria-hidden="true" className="size-4 text-primary-500" />
            {t('checkout:coupon')}
          </span>
          <div className="flex gap-2">
            <input
              value={couponInput}
              onChange={(event) => onInputChange(event.target.value)}
              placeholder={t('checkout:couponPlaceholder')}
              disabled={Boolean(appliedCoupon)}
              className="h-11 w-full min-w-0 rounded-xl border border-border-100 bg-white px-3 text-sm text-base-dark transition-colors focus:border-secondary-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500/30 disabled:bg-hue-100"
            />
            {appliedCoupon ? (
              <Button type="button" variant="outline" size="sm" onClick={onRemove}>
                {t('common:actions.remove')}
              </Button>
            ) : (
              <Button
                type="button"
                size="sm"
                onClick={onApply}
                loading={couponCheckPending}
                disabled={!couponInput.trim()}
              >
                {t('checkout:applyCoupon')}
              </Button>
            )}
          </div>
        </label>

        {couponMessage && (
          <p
            role="status"
            className={cn(
              'text-xs font-medium',
              couponMessage.type === 'error' ? 'text-error-500' : 'text-secondary-700',
            )}
          >
            {couponMessage.text}
          </p>
        )}

        <dl className="flex flex-col gap-2 border-t border-border-100 pt-4 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-hue-500">{t('cart:subtotal')}</dt>
            <dd className="font-bold text-base-dark">{formatCurrency(subtotal, { language })}</dd>
          </div>
          {couponDiscount > 0 && (
            <div className="flex items-center justify-between">
              <dt className="text-hue-500">{t('checkout:discount')}</dt>
              <dd className="font-bold text-secondary-700">
                -{formatCurrency(couponDiscount, { language })}
              </dd>
            </div>
          )}
          <div className="flex items-center justify-between border-t border-border-100 pt-2 text-base">
            <dt className="font-sans text-base-dark">{t('cart:total')}</dt>
            <dd className="font-sans font-bold text-primary-700">
              {formatCurrency(Math.max(subtotal - couponDiscount, 0), { language })}
            </dd>
          </div>
        </dl>
        <p className="text-xs leading-5 text-hue-500">{t('checkout:shippingNote')}</p>
      </div>
    </aside>
  );
}

function CheckoutSkeleton() {
  return (
    <div className="mt-8" aria-hidden="true">
      <Skeleton className="h-10 w-72 rounded-full" />
      <div className="mt-6 h-64 rounded-2xl bg-hue-100/60" />
    </div>
  );
}
