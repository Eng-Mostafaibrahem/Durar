import { useTranslation } from 'react-i18next';
import { useRelatedProducts } from '../hooks/useRelatedProducts.js';
import { ProductGrid } from './ProductGrid.jsx';
import { ProductListSkeleton } from './ProductListSkeleton.jsx';

export function RelatedProducts({ product }) {
  const { t } = useTranslation();
  const { data: related, isPending, isError } = useRelatedProducts(product);

  if (isPending) {
    return (
      <section className="mt-16">
        <SkeletonHeader />
        <ProductListSkeleton count={4} />
      </section>
    );
  }

  if (isError || !related?.length) return null;

  return (
    <section className="mt-16">
      <SkeletonHeader label={t('products:related')} />
      <ProductGrid products={related} />
    </section>
  );
}

function SkeletonHeader({ label }) {
  if (!label) {
    return <div className="mb-6 h-8 w-56 animate-pulse rounded-full bg-hue-100" />;
  }

  return (
    <div className="mb-6 flex items-center gap-4">
      <h2 className="font-display text-2xl font-bold text-base-dark">{label}</h2>
      <span className="h-px flex-1 bg-border-500/15" aria-hidden="true" />
    </div>
  );
}
