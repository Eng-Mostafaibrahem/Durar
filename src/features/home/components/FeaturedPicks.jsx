import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HiArrowRight, HiExclamationTriangle, HiOutlineSparkles } from 'react-icons/hi2';
import { Container } from '../../../components/Container.jsx';
import { paths } from '../../../lib/paths.js';
import { cn } from '../../../utils/cn.js';
import { Button } from '../../../components/ui/Button.jsx';
import { SkeletonCard } from '../../../components/ui/Skeleton.jsx';
import { SectionHeader } from './SectionHeader.jsx';
import { ProductGrid } from './ProductGrid.jsx';
import { LANDING_FILTERS, useFeaturedPicks } from '../hooks/useFeaturedPicks.js';

export function FeaturedPicks() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('best_selling');
  const query = useFeaturedPicks(filter);

  const products = (query.data?.items ?? []).slice(0, 4);

  return (
    <section id="featured" className="bg-bg-main py-16 sm:py-20">
      <Container>
        <SectionHeader
          eyebrow={t('home:featured.subtitle')}
          title={t('home:featured.title')}
          action={
            <Link
              to={paths.shop}
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary-500 transition-colors hover:text-primary-600"
            >
              {t('common:actions.viewAll')}
              <HiArrowRight
                aria-hidden="true"
                className="size-4 transition-transform rtl:-scale-x-100 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
              />
            </Link>
          }
        />

        <div
          role="tablist"
          aria-label={t('home:featured.title')}
          className="mt-8 inline-flex flex-wrap gap-1 rounded-2xl border border-border-100 bg-bg-secondary p-1.5"
        >
          {LANDING_FILTERS.map((item) => {
            const active = filter === item.value;
            return (
              <button
                key={item.value}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(item.value)}
                className={cn(
                  'rounded-xl px-4 py-2 text-sm font-semibold transition-colors sm:px-5',
                  active
                    ? 'bg-primary-500 text-white shadow-sm'
                    : 'text-hue-500 hover:bg-white hover:text-base-dark',
                )}
              >
                {t(item.labelKey)}
              </button>
            );
          })}
        </div>

        {query.isPending ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((item) => (
              <SkeletonCard key={`${filter}-${item}`} imageClassName="h-72" bodyClassName="h-20" />
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
            <p className="text-sm font-medium text-base-dark/70">{t('home:featured.empty')}</p>
            <p className="text-xs text-hue-500">{t('home:featured.emptyHint')}</p>
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </Container>
    </section>
  );
}