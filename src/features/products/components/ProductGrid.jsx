import { useTranslation } from 'react-i18next';
import { ProductCard } from '../../../components/ProductCard.jsx';
import { localized } from '../../../lib/response.js';
import { resolveImageUrl } from '../../../utils/media.js';

export function ProductGrid({ products, unavailableIds }) {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage || 'ar';
  const unavailableSet = new Set(unavailableIds ?? []);

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={{
            ...product,
            name: product.name ?? localized(product, ['name'], language).name,
            categoryId: product.category?.id ?? product.category_id,
            categoryLabel: product.category?.name ?? product.category_name,
            image: resolveImageUrl(product.cover_image ?? product.main_image?.[0]),
            backgroundVariant: product.background_variant ?? product.silk_variant,
          }}
          unavailable={unavailableSet.has(product.id)}
        />
      ))}
    </div>
  );
}
