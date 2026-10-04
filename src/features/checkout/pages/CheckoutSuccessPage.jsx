import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HiArrowLeft, HiCheckCircle, HiCreditCard, HiShoppingBag } from 'react-icons/hi2';
import { Seo } from '../../../components/Seo.jsx';
import { Container } from '../../../components/Container.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { Skeleton } from '../../../components/ui/Skeleton.jsx';
import { EmptyState } from '../../../components/ui/EmptyState.jsx';
import { useOrder, useOrderPayment } from '../../orders/hooks/useOrders.js';
import { normalizeOrder, paymentUrl, paymentBadgeVariant } from '../../orders/lib/orderHelpers.js';
import { formatCurrency } from '../../../utils/formatCurrency.js';
import { formatDate } from '../../../utils/formatDate.js';
import { paths } from '../../../lib/paths.js';

export default function CheckoutSuccessPage() {
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

  return (
    <>
      <Seo title={t('checkout:success.title')} description={t('common:tagline')} noIndex />

      <Container className="py-16">
        <div className="mx-auto flex max-w-xl flex-col items-center gap-6 text-center">
          <span className="grid size-16 place-items-center rounded-full bg-secondary-100 text-secondary-500">
            <HiCheckCircle aria-hidden="true" className="size-9" />
          </span>
          <h1 className="font-display text-3xl font-bold text-base-dark">
            {t('checkout:success.title')}
          </h1>
          <p className="max-w-md text-sm leading-7 text-hue-500">{t('checkout:success.body')}</p>

          {isPending ? (
            <Skeleton className="h-48 w-full rounded-2xl" />
          ) : isError || !order ? (
            <EmptyState
              icon={HiShoppingBag}
              title={t('cart:loadError')}
              action={<Button to={paths.shop}>{t('common:actions.browse')}</Button>}
            />
          ) : (
            <div className="w-full rounded-2xl border border-border-100 bg-white p-6 text-start shadow-sm">
              <dl className="flex flex-col gap-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-hue-500">{t('checkout:success.orderNumber')}</dt>
                  <dd className="font-sans font-bold text-base-dark">{order.number}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-hue-500">{t('cart:total')}</dt>
                  <dd className="font-sans font-bold text-primary-700">
                    {formatCurrency(order.total, { language })}
                  </dd>
                </div>
                {order.createdAt && (
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-hue-500">{t('account:orderDetails.placedOn')}</dt>
                    <dd className="font-medium text-base-dark">
                      {formatDate(order.createdAt, { language })}
                    </dd>
                  </div>
                )}
              </dl>

              <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border-100 pt-5">
                <Badge variant={paymentBadgeVariant(order.paymentStatus)}>
                  {t(`account:orderStatus.${order.paymentStatus}`)}
                </Badge>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Button onClick={handlePay} loading={payment.isPending} className="flex-1">
                  <HiCreditCard aria-hidden="true" />
                  {t('checkout:success.payNow')}
                </Button>
                <Button
                  to={paths.accountOrderDetails(order.id)}
                  variant="outline"
                  className="flex-1"
                >
                  {t('account:orders')}
                </Button>
              </div>
            </div>
          )}

          <Button to={paths.home} variant="ghost">
            <HiArrowLeft aria-hidden="true" className="rtl:rotate-180" />
            {t('checkout:success.backHome')}
          </Button>
        </div>
      </Container>
    </>
  );
}
