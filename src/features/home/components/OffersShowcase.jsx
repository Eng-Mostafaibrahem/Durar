import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { HiArrowRight } from 'react-icons/hi2';
import { Container } from '../../../components/Container.jsx';
import { Skeleton, SkeletonCard } from '../../../components/ui/Skeleton.jsx';
import { paths } from '../../../lib/paths.js';
import { OfferBanner } from '../../offers/components/OfferBanner.jsx';
import { useOfferBanners, useOffersProducts } from '../../offers/hooks/useOffers.js';
import { ProductGrid } from '../../products/components/ProductGrid.jsx';

export function OffersShowcase() {
  const { t } = useTranslation();
  const banners = useOfferBanners();
  const offers = useOffersProducts();

  const banner = banners.data?.items?.[0];
  const products = (offers.data?.items ?? []).slice(0, 4);
  const hasContent = Boolean(banner) || products.length > 0;

  if (!banners.isPending && !offers.isPending && !hasContent) return null;

  return (
    <section className="bg-bg-main py-16 sm:py-20">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-widest text-primary-500">
              {t('offers:subtitle')}
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-base-dark sm:text-4xl">
              {t('offers:title')}
            </h2>
          </div>

          <Link
            to={paths.offers}
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary-500 transition-colors hover:text-primary-600"
          >
            {t('common:actions.viewAll')}
            <HiArrowRight
              aria-hidden="true"
              className="size-4 transition-transform rtl:-scale-x-100 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
            />
          </Link>
        </div>

        {banner ? (
          <div className="mt-8">
            <OfferBanner banner={banner} />
          </div>
        ) : banners.isPending ? (
          <Skeleton className="mt-8 h-44 rounded-2xl" />
        ) : null}

        <div className="mt-10">
          {offers.isPending ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[0, 1, 2, 3].map((item) => (
                <SkeletonCard key={item} imageClassName="h-72" bodyClassName="h-20" />
              ))}
            </div>
          ) : (
            <ProductGrid products={products} />
          )}
        </div>
      </Container>
    </section>
  );
}
