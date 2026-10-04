import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HiArrowRight } from 'react-icons/hi2';
import { Container } from '../../../components/Container.jsx';
import { SkeletonCard } from '../../../components/ui/Skeleton.jsx';
import { paths } from '../../../lib/paths.js';
import { SectionHeader } from './SectionHeader.jsx';
import { ProductGrid } from './ProductGrid.jsx';
import { useFeaturedPicks } from '../hooks/useFeaturedPicks.js';

export function SelectedPieces() {
  const { t } = useTranslation();
  const query = useFeaturedPicks('best_selling');

  const products = (query.data?.items ?? []).slice(0, 4);

  if (products.length === 0) return null;

  return (
    <section className="bg-bg-secondary py-16 sm:py-20">
      <Container>
        <SectionHeader
          title={t('home:selected.title')}
          action={
            <Link
              to={paths.shop}
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 transition-colors hover:text-primary-600"
            >
              {t('common:actions.viewAll')}
              <HiArrowRight
                aria-hidden="true"
                className="size-4 transition-transform rtl:-scale-x-100 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
              />
            </Link>
          }
        />

        {query.isPending ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((item) => (
              <SkeletonCard key={item} imageClassName="h-72" bodyClassName="h-20" />
            ))}
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </Container>
    </section>
  );
}
