import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HiChevronLeft, HiDocumentText, HiShoppingBag } from 'react-icons/hi2';
import { Seo } from '../../../components/Seo.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { EmptyState } from '../../../components/ui/EmptyState.jsx';
import { Skeleton } from '../../../components/ui/Skeleton.jsx';
import { useOrders } from '../../orders/hooks/useOrders.js';
import { normalizeOrder } from '../../orders/lib/orderHelpers.js';
import { OrderStatusBadge } from '../../orders/components/OrderStatusBadge.jsx';
import { formatCurrency } from '../../../utils/formatCurrency.js';
import { formatDate } from '../../../utils/formatDate.js';
import { paths } from '../../../lib/paths.js';

export default function OrdersPage() {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage || 'ar';

  const { data, isPending, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useOrders(
    {},
  );

  if (isPending) {
    return (
      <>
        <Seo title={t('account:orders')} description={t('common:tagline')} noIndex />
        <div className="flex flex-col gap-4" aria-hidden="true">
          <Skeleton className="h-20 rounded-2xl" />
          <Skeleton className="h-20 rounded-2xl" />
          <Skeleton className="h-20 rounded-2xl" />
        </div>
      </>
    );
  }

  const orders = (data?.pages ?? []).flatMap((page) => page.items?.map(normalizeOrder) ?? []);

  return (
    <>
      <Seo title={t('account:orders')} description={t('common:tagline')} noIndex />

      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-base-dark">{t('account:orders')}</h1>
          <p className="mt-1 text-sm text-hue-500">{t('account:ordersList.emptyHint')}</p>
        </div>

        {isError ? (
          <EmptyState icon={HiShoppingBag} title={t('cart:loadError')} />
        ) : orders.length === 0 ? (
          <EmptyState
            icon={HiDocumentText}
            title={t('account:ordersList.empty')}
            description={t('account:ordersList.emptyHint')}
            action={<Button to={paths.shop}>{t('common:actions.browse')}</Button>}
          />
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                to={paths.accountOrderDetails(order.id)}
                className="group grid gap-4 rounded-2xl border border-border-100 bg-white p-5 shadow-sm transition-colors hover:border-border-300 sm:grid-cols-[1fr_auto] sm:items-center"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <p className="font-sans font-bold text-base-dark">{order.number}</p>
                    <OrderStatusBadge order={order} />
                    {order.paymentStatus && order.paymentStatus !== 'paid' && (
                      <Badge variant="outline" size="sm">
                        {t(`account:orderStatus.${order.paymentStatus}`)}
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1.5 text-sm text-hue-500">
                    {order.createdAt ? formatDate(order.createdAt, { language }) : `#${order.id}`}
                    <span aria-hidden="true" className="mx-2 text-hue-300">
                      •
                    </span>
                    {t('cart:itemsCount', { count: order.count })}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <span className="font-sans font-bold text-primary-700">
                    {formatCurrency(order.total, { language })}
                  </span>
                  <HiChevronLeft
                    aria-hidden="true"
                    className="size-5 text-hue-400 transition-transform group-hover:-translate-x-0.5 rtl:rotate-180 rtl:group-hover:translate-x-0.5"
                  />
                </div>
              </Link>
            ))}

            {hasNextPage && (
              <div className="mt-2">
                <Button
                  variant="outline"
                  onClick={() => fetchNextPage()}
                  loading={isFetchingNextPage}
                >
                  {t('account:ordersList.loadMore')}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
