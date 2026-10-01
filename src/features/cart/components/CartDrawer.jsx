import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaGem } from 'react-icons/fa';
import { HiShoppingBag, HiTrash } from 'react-icons/hi2';
import { useCartDrawer } from '../hooks/useCartDrawer.js';
import { useCart, useRemoveCartItem, useUpdateCartItem } from '../hooks/useCart.js';
import { normalizeCart } from '../lib/cartHelpers.js';
import { Drawer } from '../../../components/ui/Drawer.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { EmptyState } from '../../../components/ui/EmptyState.jsx';
import { Skeleton } from '../../../components/ui/Skeleton.jsx';
import { QuantityStepper } from '../../products/components/QuantityStepper.jsx';
import { resolveImageUrl } from '../../../utils/media.js';
import { formatCurrency } from '../../../utils/formatCurrency.js';
import { paths } from '../../../lib/paths.js';

export function CartDrawer() {
  const { t, i18n } = useTranslation();
  const { isOpen, closeCart } = useCartDrawer();
  const navigate = useNavigate();

  const [busyItemId, setBusyItemId] = useState(null);

  const cart = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();

  const { items, count, subtotal } = normalizeCart(cart.data);
  const language = i18n.resolvedLanguage || 'ar';

  const handleUpdate = (item, quantity) => {
    if (quantity === item.quantity) return;
    setBusyItemId(item.id);
    updateItem.mutate({ itemId: item.id, quantity }, { onSettled: () => setBusyItemId(null) });
  };

  const handleRemove = (item) => {
    setBusyItemId(item.id);
    removeItem.mutate(item.id, { onSettled: () => setBusyItemId(null) });
  };

  const handleCheckout = () => {
    closeCart();
    navigate(paths.checkout);
  };

  return (
    <Drawer
      open={isOpen}
      onClose={closeCart}
      side="end"
      title={t('cart:title')}
      footer={
        <div className="flex flex-col gap-3">
          {items.length > 0 && (
            <>
              <div className="flex items-center justify-between text-sm">
                <span className="text-hue-500">{t('cart:subtotal')}</span>
                <span className="font-bold text-base-dark">
                  {formatCurrency(subtotal, { language })}
                </span>
              </div>
              <p className="text-xs text-hue-500">{t('cart:shippingNote')}</p>
              <Link
                to={paths.cart}
                onClick={closeCart}
                className="text-center text-sm font-medium text-primary-500 transition-colors hover:text-primary-700"
              >
                {t('cart:viewCart')}
              </Link>
            </>
          )}
          <Button onClick={handleCheckout} className="w-full" disabled={items.length === 0}>
            {t('cart:checkout')}
          </Button>
          <Button variant="ghost" onClick={closeCart} className="w-full">
            {t('cart:continueShopping')}
          </Button>
        </div>
      }
    >
      {cart.isPending ? (
        <CartSkeleton />
      ) : items.length === 0 ? (
        <div className="grid h-full place-items-center">
          <EmptyState
            icon={HiShoppingBag}
            title={t('cart:empty')}
            description={t('cart:emptyHint')}
            action={
              <Button to={paths.shop} onClick={closeCart}>
                {t('common:actions.browse')}
              </Button>
            }
          />
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <p className="text-sm text-hue-500">{t('cart:itemsCount', { count })}</p>
          <ul className="flex flex-col gap-5">
            {items.map((item) => {
              const disabled = busyItemId === item.id;
              const stepperMax = item.stock > 0 ? item.stock : 99;

              return (
                <li key={item.id} className="flex gap-3">
                  <Link
                    to={paths.productDetails(item.productId)}
                    onClick={closeCart}
                    className="block size-20 shrink-0 overflow-hidden rounded-lg border border-border-100 bg-secondary-100"
                  >
                    {item.image ? (
                      <img
                        src={resolveImageUrl(item.image)}
                        alt=""
                        width={80}
                        height={80}
                        loading="lazy"
                        className="size-full object-cover"
                      />
                    ) : (
                      <span className="grid size-full place-items-center">
                        <FaGem aria-hidden="true" className="size-6 text-secondary-300" />
                      </span>
                    )}
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        to={paths.productDetails(item.productId)}
                        onClick={closeCart}
                        className="line-clamp-2 text-sm font-medium text-base-dark transition-colors hover:text-primary-500"
                      >
                        {item.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleRemove(item)}
                        disabled={disabled}
                        aria-label={t('cart:removeItem')}
                        className="grid size-8 shrink-0 place-items-center rounded-full text-hue-500 transition-colors hover:bg-error-50 hover:text-error-500 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <HiTrash aria-hidden="true" className="size-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <QuantityStepper
                        value={item.quantity}
                        max={stepperMax}
                        disabled={disabled}
                        onChange={(quantity) => handleUpdate(item, quantity)}
                      />
                      <div className="text-end">
                        {item.discount > 0 ||
                          (item.basePrice > item.unitPrice && (
                            <p className="text-xs text-hue-500 line-through">
                              {formatCurrency(item.basePrice * item.quantity, { language })}
                            </p>
                          ))}
                        <p className="text-sm font-bold text-primary-700">
                          {formatCurrency(item.lineTotal, { language })}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </Drawer>
  );
}

function CartSkeleton() {
  return (
    <div className="flex flex-col gap-5" aria-hidden="true">
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="flex gap-3">
          <Skeleton className="size-20 shrink-0" rounded="rounded-lg" />
          <div className="flex flex-1 flex-col justify-between gap-2">
            <Skeleton className="h-4 w-3/4" rounded="rounded-md" />
            <Skeleton className="h-9 w-full" rounded="rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}
