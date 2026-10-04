  import { Link } from 'react-router-dom';
  import { useTranslation } from 'react-i18next';
  import { FaGem } from 'react-icons/fa';
  import { HiHeart } from 'react-icons/hi2';
  import { cn } from '../utils/cn.js';
  import { paths } from '../lib/paths.js';
  import { silkBackgroundStyle } from '../assets/card-bg/silk.js';
  import { formatCurrency, formatDiscountPercent } from '../utils/formatCurrency.js';
  import { Badge } from './ui/Badge.jsx';
  import { useFavorites } from '../features/favorites/hooks/useFavorites.js';
  import curencyLogo from '../assets/Riyal-Icon.webp';

  export function ProductCard({ product, unavailable = false, className }) {
    const { t, i18n } = useTranslation();
    const { isFavorite, toggleFavorite } = useFavorites();

    const language = i18n.resolvedLanguage || 'ar';
    const favorited = isFavorite(product.id);

    const price = Number(product.price) || 0;
    const hasFinalPrice = product.final_price != null;
    const finalPrice = Number(product.final_price ?? product.price) || 0;
    const serverDiscount = Math.round(Number(product.discount_percentage) || 0);
    const hasOffer = serverDiscount > 0 || (hasFinalPrice && finalPrice > 0 && finalPrice < price);
    const discount = serverDiscount > 0 ? serverDiscount : formatDiscountPercent(price, finalPrice);

    const categoryId = product.categoryId ?? product.category?.id ?? product.category_id;
    const categoryLabel =
      product.categoryLabel ?? product.category?.name ?? product.category_name ?? product.category;

    const handleToggleFavorite = (event) => {
      event.preventDefault();
      toggleFavorite(product);
    };

    return (
      <article
        className={cn(
          'group rounded-xl border border-border-500/20 bg-white p-2 transition-[transform,box-shadow] duration-300 ease-(--ease-luxury)',
          'hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-500/10',
          className,
        )}
      >
        <Link
          to={paths.productDetails(product.id)}
          className="relative block aspect-[4/5] overflow-hidden rounded-lg"
        >
          <div
            style={silkBackgroundStyle("card3") ?? undefined}
            className={cn(
              'absolute inset-0',
              silkBackgroundStyle("card3")
                ? 'bg-cover bg-center'
                : 'bg-silk-fallback',
            )}
          >
            <div className="grid h-full place-items-center">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.imageAlt ?? product.name}
                  width={320}
                  height={400}
                  loading="lazy"
                  className="h-full w-full scale-75 object-cover transition-transform duration-500 ease-(--ease-luxury) group-hover:scale-85"
                />
              ) : (
                <FaGem
                  aria-hidden="true"
                  className="size-16 text-white/40 transition-transform duration-500 ease-(--ease-luxury) group-hover:scale-110"
                />
              )}
            </div>
          </div>

          {hasOffer && (
            <Badge variant="warning" size="sm" className="absolute start-2 top-2">
              -{discount}%
            </Badge>
          )}

          {unavailable && (
            <div className="absolute inset-0 grid place-items-center bg-black/45 backdrop-blur-[1px]">
              <Badge variant="error">{t('products:stock.outOfStock')}</Badge>
            </div>
          )}

          <button
            type="button"
            onClick={handleToggleFavorite}
            aria-label={t('common:actions.addToFavorites')}
            aria-pressed={favorited}
            className="absolute end-2 top-2 grid size-9 place-items-center rounded-full bg-white/85 text-base-dark shadow-sm backdrop-blur transition-colors hover:bg-white"
          >
            <HiHeart
              aria-hidden="true"
              className={cn('size-5', favorited && 'fill-primary-500 text-primary-500')}
            />
          </button>
        </Link>

        <div className="px-2 pb-2 pt-3">
          {categoryLabel ? (
            categoryId ? (
              <Link
                to={paths.collection(categoryId)}
                className="text-xs font-medium uppercase tracking-wide text-hue-500 transition-colors hover:text-primary-500"
              >
                {categoryLabel}
              </Link>
            ) : (
              <span className="text-xs font-medium uppercase tracking-wide text-hue-500">
                {categoryLabel}
              </span>
            )
          ) : null}

          <h3 className="mt-1 line-clamp-1 font-display text-lg font-bold text-base-dark">
            <Link
              to={paths.productDetails(product.id)}
              className="transition-colors hover:text-primary-500"
            >
              {product.name}
            </Link>
          </h3>

          <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-base font-bold text-primary-700">
              {formatCurrency(finalPrice, { language })}
            </span>
            {hasOffer && finalPrice < price && (
              <span className="text-sm text-hue-500 line-through">
                {formatCurrency(price, { language })}
              </span>

            )}

              <img src={curencyLogo} alt="" decoding="async" />
          </div>
        </div>
      </article>
    );
  }
