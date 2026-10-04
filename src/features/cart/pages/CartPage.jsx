import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaGem } from 'react-icons/fa';
import { HiExclamationTriangle, HiShoppingBag, HiTrash } from 'react-icons/hi2';
import { Seo } from '../../../components/Seo.jsx';
import { Container } from '../../../components/Container.jsx';
import { PageHero } from '../../../components/PageHero.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { EmptyState } from '../../../components/ui/EmptyState.jsx';
import { QuantityStepper } from '../../products/components/QuantityStepper.jsx';
import { useCart, useClearCart, useRemoveCartItem, useUpdateCartItem } from '../hooks/useCart.js';
import { normalizeCart } from '../lib/cartHelpers.js';
import { resolveImageUrl } from '../../../utils/media.js';
import { formatCurrency } from '../../../utils/formatCurrency.js';
import { paths } from '../../../lib/paths.js';
import banner from '../../../assets/shop-banner.webp';


export default function CartPage() {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage || 'ar';

  const [busyItemId, setBusyItemId] = useState(null);

  const cart = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const clearCart = useClearCart();

  const { items, count, subtotal, total } = normalizeCart(cart.data);

  const handleUpdate = (item, quantity) => {
    if (quantity === item.quantity) return;
    setBusyItemId(item.id);
    updateItem.mutate({ itemId: item.id, quantity }, { onSettled: () => setBusyItemId(null) });
  };

  const handleRemove = (item) => {
    setBusyItemId(item.id);
    removeItem.mutate(item.id, { onSettled: () => setBusyItemId(null) });
  };

  const handleClear = () => {
    if (window.confirm(t('cart:clearConfirm'))) clearCart.mutate();
  };

  return (
    <>
      <Seo title={t('cart:title')} description={t('common:tagline')} />

      <PageHero
        image={banner}

        eyebrow={count > 0 ? t('cart:itemsCount', { count }) : t('common:appName')}
        title={t('cart:title')}
        subtitle={t('common:tagline')}
        showSearch={false}
        showTags={false}
        minHeight="min-h-[320px] md:min-h-[400px]"
        className="bg-dark-gradient"
      />
      <Container className="py-10">
        {items.length > 0 && (
          <header className="flex flex-wrap justify-end gap-4">
            <Button variant="outline" size="sm" onClick={handleClear} loading={clearCart.isPending}>
              {t('cart:clear')}
            </Button>
          </header>
        )}

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <section aria-label={t('cart:title')}>
            {cart.isPending ? (
              <CartListSkeleton />
            ) : cart.isError ? (
              <EmptyState
                icon={HiExclamationTriangle}
                title={t('common:states.error')}
                description={t('cart:loadError')}
                action={
                  <Button variant="outline" onClick={() => cart.refetch()}>
                    {t('common:actions.retry')}
                  </Button>
                }
              />
            ) : items.length === 0 ? (
              <EmptyState
                icon={HiShoppingBag}
                title={t('cart:empty')}
                description={t('cart:emptyHint')}
                action={<Button to={paths.shop}>{t('common:actions.browse')}</Button>}
              />
            ) : (
              <ul className="flex flex-col gap-4">
                {items.map((item) => (
                  <CartLine
                    key={item.id}
                    item={item}
                    language={language}
                    busy={busyItemId === item.id}
                    onUpdate={handleUpdate}
                    onRemove={handleRemove}
                  />
                ))}
              </ul>
            )}
          </section>

          {items.length > 0 && (
            <aside className="sticky top-28 flex flex-col gap-4 rounded-2xl border border-border-100 bg-white p-6 shadow-sm">
              <h2 className="font-display text-lg font-bold text-base-dark">{t('cart:summary')}</h2>

              <dl className="flex flex-col gap-2 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-hue-500">{t('cart:subtotal')}</dt>
                  <dd className="font-bold text-base-dark">
                    {formatCurrency(total, { language })}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-hue-500">{t('cart:shipping')}</dt>
                  <dd className="text-hue-500">{t('cart:shippingNote')}</dd>
                </div>
              </dl>

              <div className="border-t border-border-100 pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-sans text-base text-base-dark">{t('cart:total')}</span>
                  <span className="font-sans text-xl font-bold text-primary-700">
                    {formatCurrency(subtotal, { language })}
                  </span>
                </div>
              </div>

              <Button to={paths.checkout} className="mt-2 w-full">
                {t('cart:checkout')}
              </Button>
              <Button to={paths.shop} variant="ghost" className="w-full">
                {t('cart:continueShopping')}
              </Button>
            </aside>
          )}
        </div>
      </Container>
    </>
  );
}

function CartLine({ item, language, busy, onUpdate, onRemove }) {
  const { t } = useTranslation();
  const stepperMax = item.stock > 0 ? item.stock : 99;
  const hasDiscount = item.basePrice > item.unitPrice;

  return (
    <li className="flex flex-col gap-4 rounded-2xl border border-border-100 bg-white p-4 sm:flex-row sm:items-center">
      <Link
        to={paths.productDetails(item.productId)}
        className="block size-24 shrink-0 overflow-hidden rounded-xl border border-border-100 bg-secondary-100"
      >
        {item.image ? (
          <img
            src={resolveImageUrl(item.image)}
            alt=""
            width={96}
            height={96}
            loading="lazy"
            className="size-full object-cover"
          />
        ) : (
          <span className="grid size-full place-items-center">
            <FaGem aria-hidden="true" className="size-7 text-secondary-300" />
          </span>
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <Link
            to={paths.productDetails(item.productId)}
            className="line-clamp-2 font-medium text-base-dark transition-colors hover:text-primary-500"
          >
            {item.name}
          </Link>
          <button
            type="button"
            onClick={() => onRemove(item)}
            disabled={busy}
            aria-label={t('cart:removeItem')}
            className="grid size-9 shrink-0 place-items-center rounded-full text-hue-500 transition-colors hover:bg-error-50 hover:text-error-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <HiTrash aria-hidden="true" className="size-4" />
          </button>
        </div>

        <div className="flex items-center justify-between gap-3">
          <QuantityStepper
            value={item.quantity}
            max={stepperMax}
            disabled={busy}
            onChange={(quantity) => onUpdate(item, quantity)}
          />
          <div className="text-end">
            {hasDiscount && (
              <p className="text-xs text-hue-500 line-through">
                {formatCurrency(item.basePrice * item.quantity, { language })}
              </p>
            )}
            <p className="font-bold text-primary-700">
              {formatCurrency(item.lineTotal, { language })}
            </p>
          </div>
        </div>
      </div>
    </li>
  );
}

function CartLineSkeleton() {
  return (
    <li className="flex flex-col gap-4 rounded-2xl border border-border-100 bg-white p-4 sm:flex-row sm:items-center">
      <div className="size-24 shrink-0 animate-pulse rounded-xl bg-hue-100" />
      <div className="flex flex-1 flex-col gap-2" aria-hidden="true">
        <div className="h-4 w-1/2 animate-pulse rounded-md bg-hue-100" />
        <div className="h-9 w-full animate-pulse rounded-xl bg-hue-100" />
      </div>
    </li>
  );
}

function CartListSkeleton() {
  return (
    <ul className="flex flex-col gap-4" aria-label={''}>
      {Array.from({ length: 3 }, (_, index) => (
        <CartLineSkeleton key={index} />
      ))}
    </ul>
  );
}
