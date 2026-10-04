import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaGem } from 'react-icons/fa';
import { HiArrowRight, HiCreditCard, HiExclamationTriangle, HiShoppingBag } from 'react-icons/hi2';
import { Seo } from '../../../components/Seo.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { EmptyState } from '../../../components/ui/EmptyState.jsx';
import { Skeleton } from '../../../components/ui/Skeleton.jsx';
import { useOrder, useOrderPayment } from '../hooks/useOrders.js';
import { OrderStatusBadge } from '../components/OrderStatusBadge.jsx';
import { OrderStatusTimeline } from '../components/OrderStatusTimeline.jsx';
import { normalizeOrder, paymentUrl, paymentBadgeVariant } from '../lib/orderHelpers.js';
import { formatCurrency } from '../../../utils/formatCurrency.js';
import { formatDate } from '../../../utils/formatDate.js';
import { resolveImageUrl } from '../../../utils/media.js';
import { paths } from '../../../lib/paths.js';

export default function OrderDetailsPage() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage || 'ar';

  const { data, isPending, isError } = useOrder(id);
  const order = normalizeOrder(data);
  const payment = useOrderPayment(id);

  const handlePay = () => {
    if (payment.isPending) return;
    payment.mutate(undefined, {
      onSuccess: (response) => {
        const url = paymentUrl(response?.payment ?? response ?? null);
        if (url) {
          window.open(url, '_blank', 'noopener,noreferrer');
        }
      },
    });
  };

  if (isPending) {
    return (
      <>
        <Seo title={t('account:orderDetails.order')} description={t('common:tagline')} noIndex />
        <div className="flex flex-col gap-4" aria-hidden="true">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-40 rounded-2xl" />
        </div>
      </>
    );
  }

  if (isError || !order) {
    return (
      <>
        <Seo title={t('account:orderDetails.order')} description={t('common:tagline')} noIndex />
        <EmptyState
          icon={HiShoppingBag}
          title={t('cart:loadError')}
          action={<Button to={paths.accountOrders}>{t('account:orderDetails.back')}</Button>}
        />
      </>
    );
  }

  const address = order.shippingAddress ?? {};

  return (
    <>
      <Seo
        title={`${t('account:orderDetails.order')} #${order.number}`}
        description={t('common:tagline')}
        noIndex
      />

      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <h1 className="font-display text-2xl font-bold text-base-dark">
              {t('account:orderDetails.order')} #{order.number}
            </h1>
            <OrderStatusBadge order={order} />
            <Badge variant={paymentBadgeVariant(order.paymentStatus)}>
              {t(`account:orderStatus.${order.paymentStatus}`)}
            </Badge>
          </div>

          {order.paymentStatus === 'unpaid' && (
            <Button onClick={handlePay} loading={payment.isPending} size="sm">
              <HiCreditCard aria-hidden="true" />
              {t('account:orderDetails.payNow')}
            </Button>
          )}
        </div>

        {order.createdAt && (
          <p className="text-sm text-hue-500">
            {t('account:orderDetails.placedOn')}:{' '}
            <span className="font-medium text-base-dark">
              {formatDate(order.createdAt, { language })}
            </span>
          </p>
        )}

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="flex flex-col gap-6">
            <section className="rounded-2xl border border-border-100 bg-white p-6 shadow-sm">
              <h2 className="font-display text-lg font-bold text-base-dark">
                {t('account:orderDetails.items')}
              </h2>
              <ul className="mt-4 flex flex-col divide-y divide-border-100">
                {order.items.map((item) => (
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
                        {item.quantity} × {formatCurrency(item.unitPrice, { language })}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-primary-700">
                      {formatCurrency(item.lineTotal, { language })}
                    </span>
                  </li>
                ))}
              </ul>

              <dl className="mt-4 flex flex-col gap-2 border-t border-border-100 pt-4 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-hue-500">{t('account:orderDetails.subtotal')}</dt>
                  <dd className="font-medium text-base-dark">
                    {formatCurrency(order.subtotal, { language })}
                  </dd>
                </div>
                {order.discount > 0 && (
                  <div className="flex items-center justify-between">
                    <dt className="text-hue-500">{t('account:orderDetails.discount')}</dt>
                    <dd className="font-medium text-secondary-700">
                      -{formatCurrency(order.discount, { language })}
                    </dd>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <dt className="text-hue-500">{t('account:orderDetails.shippingFee')}</dt>
                  <dd className="font-medium text-base-dark">
                    {formatCurrency(order.shipping, { language })}
                  </dd>
                </div>
                <div className="flex items-center justify-between border-t border-border-100 pt-2 text-base">
                  <dt className="font-sans font-bold text-base-dark">
                    {t('account:orderDetails.total')}
                  </dt>
                  <dd className="font-sans font-bold text-primary-700">
                    {formatCurrency(order.total, { language })}
                  </dd>
                </div>
              </dl>
            </section>

            <section className="rounded-2xl border border-border-100 bg-white p-6 shadow-sm">
              <h2 className="font-display text-lg font-bold text-base-dark">
                {t('account:orderDetails.statusTimeline')}
              </h2>
              <div className="mt-5">
                <OrderStatusTimeline status={order.status} />
              </div>
            </section>
          </div>

          <aside className="flex flex-col gap-4 rounded-2xl border border-border-100 bg-white p-6 shadow-sm">
            <h2 className="font-display text-lg font-bold text-base-dark">
              {t('account:orderDetails.shipping')}
            </h2>
            <dl className="flex flex-col gap-3 text-sm">
              {address.name && (
                <div className="flex justify-between gap-3">
                  <dt className="text-hue-500">{t('account:orderDetails.name')}</dt>
                  <dd className="text-end font-medium text-base-dark">{address.name}</dd>
                </div>
              )}
              {address.phone && (
                <div className="flex justify-between gap-3">
                  <dt className="text-hue-500">{t('account:orderDetails.phone')}</dt>
                  <dd className="font-medium text-base-dark" dir="ltr">
                    {address.phone}
                  </dd>
                </div>
              )}
              {address.city && (
                <div className="flex justify-between gap-3">
                  <dt className="text-hue-500">{t('account:orderDetails.city')}</dt>
                  <dd className="text-end font-medium text-base-dark">{address.city}</dd>
                </div>
              )}
              {(address.address_line ?? address.address) && (
                <div className="flex justify-between gap-3">
                  <dt className="text-hue-500">{t('account:orderDetails.addressLine')}</dt>
                  <dd className="min-w-0 text-end font-medium text-base-dark">
                    {address.address_line ?? address.address}
                  </dd>
                </div>
              )}
            </dl>

            {order.paymentStatus === 'unpaid' && (
              <div className="rounded-xl bg-warning-100 px-4 py-3 text-xs leading-5 text-warning-500">
                <p className="flex items-start gap-2">
                  <HiExclamationTriangle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                  <span>{t('account:orderDetails.paymentPending')}</span>
                </p>
              </div>
            )}
          </aside>
        </div>

        <div>
          <Button to={paths.accountOrders} variant="ghost">
            <HiArrowRight aria-hidden="true" className="rtl:-scale-x-100" />
            {t('account:orderDetails.back')}
          </Button>
        </div>
      </div>
    </>
  );
}
