import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HiHeart, HiShieldCheck } from 'react-icons/hi2';
import { cn } from '../../../utils/cn.js';
import { paths } from '../../../lib/paths.js';
import { formatDiscountPercent } from '../../../utils/formatCurrency.js';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { QuantityStepper } from './QuantityStepper.jsx';
import { useAddToCart } from '../../cart/hooks/useCart.js';
import { useFavorites } from '../../favorites/hooks/useFavorites.js';
import currencyLogo from '../../../assets/Riyal-Icon.png';

// يختار name_ar / name_en حسب اللغة، ولو الحقل ناقص يرجع للتاني
function pickLocalized(obj, field, language) {
  if (!obj) return undefined;
  const primary = obj[`${field}_${language}`];
  const fallback = obj[`${field}_${language === 'ar' ? 'en' : 'ar'}`];
  return primary || fallback || obj[field];
}

function Price({ value, language, className, iconClassName }) {
  const formatted = new Intl.NumberFormat(language === 'ar' ? 'ar-EG' : 'en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);

  return (
    <span className={cn('inline-flex items-center gap-1', className)}>
      <span>{formatted}</span>
      <img src={currencyLogo} alt="" aria-hidden="true" className={cn('h-[0.8em] w-auto', iconClassName)} />
    </span>
  );
}

export function ProductInfo({ product }) {
  const { t, i18n } = useTranslation();
  const [quantity, setQuantity] = useState(1);
  const { isFavorite, toggleFavorite } = useFavorites();

  const addToCart = useAddToCart();

  const language = i18n.resolvedLanguage?.startsWith('en') ? 'en' : 'ar';
  const favorited = isFavorite(product.id);
  const price = Number(product.price) || 0;
  const finalPrice = Number(product.final_price ?? product.price) || 0;
  const hasFinalPrice = product.final_price != null;
  const serverDiscount = Math.round(Number(product.discount_percentage) || 0);
  const hasOffer = serverDiscount > 0 || (hasFinalPrice && finalPrice > 0 && finalPrice < price);
  const discount = serverDiscount > 0 ? serverDiscount : formatDiscountPercent(price, finalPrice);

  const stock = Number(product.stock ?? product.quantity ?? 0);
  const unavailable = stock <= 0;
  const lowStock = !unavailable && stock <= 5;

  const categoryId = product.category?.id ?? product.category_id;
  const categoryLabel = pickLocalized(product.category, 'name', language) ?? product.category_name;

  const name = pickLocalized(product, 'name', language);
  const description = pickLocalized(product, 'description', language);

  const handleAdd = () => {
    addToCart.mutate({ product_id: product.id, quantity });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        {categoryLabel &&
          (categoryId ? (
            <Link
              to={paths.collection(categoryId)}
              className="text-sm font-medium text-hue-500 transition-colors hover:text-primary-500"
            >
              {categoryLabel}
            </Link>
          ) : (
            <span className="text-sm font-medium text-hue-500">{categoryLabel}</span>
          ))}

        <h1 className="font-display text-3xl font-bold leading-tight text-base-dark">{name}</h1>
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <Price value={finalPrice} language={language} className="text-3xl font-bold text-primary-700" />
        {hasOffer && finalPrice < price && (
          <Price value={price} language={language} className="text-lg text-hue-500 line-through" />
        )}
        {hasOffer && (
          <Badge variant="warning" size="md">
            -{discount}%
          </Badge>
        )}
      </div>

      {unavailable ? (
        <Badge variant="error" size="md">
          {t('products:stock.outOfStock')}
        </Badge>
      ) : lowStock ? (
        <Badge variant="warning" size="md">
          {t('products:stock.lowStock', { count: stock })}
        </Badge>
      ) : (
        <Badge variant="success" size="md">
          {t('products:stock.inStock')}
        </Badge>
      )}

      {description && <p className="text-sm leading-7 text-base-dark/80">{description}</p>}

      <div className="flex flex-wrap items-center gap-3">
        <QuantityStepper
          value={quantity}
          onChange={setQuantity}
          disabled={unavailable}
          max={Math.max(stock, 1)}
        />
        <Button
          size="lg"
          className="flex-1 min-w-44"
          onClick={handleAdd}
          loading={addToCart.isPending}
          disabled={unavailable}
        >
          {t('common:actions.addToCart')}
        </Button>

        <button
          type="button"
          onClick={() => toggleFavorite(product)}
          aria-label={t('common:actions.addToFavorites')}
          aria-pressed={favorited}
          className={cn(
            'grid size-14 shrink-0 place-items-center rounded-full border transition-colors',
            favorited
              ? 'border-primary-500 bg-primary-100 text-primary-500'
              : 'border-border-200 bg-white text-base-dark hover:border-primary-300 hover:text-primary-500',
          )}
        >
          <HiHeart aria-hidden="true" className={cn('size-6', favorited && 'fill-primary-500')} />
        </button>
      </div>

      <div className="flex items-center gap-2 rounded-xl bg-secondary-50 px-4 py-3 text-sm text-secondary-700">
        <HiShieldCheck aria-hidden="true" className="size-5 shrink-0 text-secondary-500" />
        {t('products:certifiedBadge')}
      </div>
    </div>
  );
}