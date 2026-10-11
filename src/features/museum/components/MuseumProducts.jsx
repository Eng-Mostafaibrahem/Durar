import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { HiArrowRight, HiExclamationTriangle, HiOutlineSparkles } from 'react-icons/hi2';
import { Container } from '../../../components/Container.jsx';
import { paths } from '../../../lib/paths.js';
import { Button } from '../../../components/ui/Button.jsx';
import { SkeletonCard } from '../../../components/ui/Skeleton.jsx';
import { useProducts } from '../../products/hooks/useProducts.js';
import { ProductGrid } from '../../home/components/ProductGrid.jsx';

// const MUSEUM_PICKS = 4;

export function MuseumProducts() {
  const { t } = useTranslation('museum');
  const query = useProducts({ scope: 'museum', page: 1 });
  const products = (query.data?.items ?? [])

  return (
    <section className="bg-bg-main py-16 sm:py-20">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm text-hue-500">{t('products.subtitle')}</p>
            <h2 className="mt-1 font-display text-2xl font-bold text-base-dark sm:text-3xl">
              {t('products.title')}
            </h2>
          </div>
          {/* <Link
            to={paths.shop}
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary-500 transition-colors hover:text-primary-600"
          >
            {t('products.viewAll')}
            <HiArrowRight
              aria-hidden="true"
              className="size-4 transition-transform rtl:-scale-x-100 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
            />
          </Link> */}
        </div>

        {query.isPending ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((item) => (
              <SkeletonCard key={item} imageClassName="h-72" bodyClassName="h-20" />
            ))}
          </div>
        ) : query.isError ? (
          <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl bg-bg-secondary px-6 py-14 text-center">
            <HiExclamationTriangle aria-hidden="true" className="size-8 text-hue-500/60" />
            <p className="text-sm font-medium text-base-dark/70">{t('common:states.error')}</p>
            <Button variant="outline" size="sm" onClick={() => query.refetch()}>
              {t('common:actions.retry')}
            </Button>
          </div>
        ) : products.length === 0 ? (
          <div className="mt-10 flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border-300 bg-bg-secondary px-6 py-14 text-center">
            <HiOutlineSparkles aria-hidden="true" className="size-8 text-hue-500/60" />
            <p className="text-sm font-medium text-base-dark/70">{t('products.empty')}</p>
            <p className="text-xs text-hue-500">{t('products.emptyHint')}</p>
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </Container>
    </section>
  );
}
