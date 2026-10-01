import { useTranslation } from 'react-i18next';
import { ProductCard } from '../../../components/ProductCard.jsx';
import { localized } from '../../../lib/response.js';
import { resolveImageUrl } from '../../../utils/media.js';
import { contentText } from '../assets/content.js';

export function ProductGrid({ products }) {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage || 'ar';

  return (
    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={{
            ...product,
            name: contentText(product.name ?? localized(product, ['name'], language).name),
            categoryLabel: product.category?.name ?? product.category_name ?? product.categoryLabel,
            categoryId: product.category?.id ?? product.category_id ?? product.categoryId,
            image: product.image ?? resolveImageUrl(product.cover_image ?? product.main_image?.[0]),
          }}
        />
      ))}
    </div>
  );
}