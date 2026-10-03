import { useTranslation } from 'react-i18next';
import { HiExclamationTriangle, HiOutlineGift } from 'react-icons/hi2';
import { Container } from '../../../components/Container.jsx';
import { PageHero } from '../../../components/PageHero.jsx';
import { Seo } from '../../../components/Seo.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { EmptyState } from '../../../components/ui/EmptyState.jsx';
import { paths } from '../../../lib/paths.js';
import { ProductGrid } from '../../products/components/ProductGrid.jsx';
import { ProductListSkeleton } from '../../products/components/ProductListSkeleton.jsx';
import { OfferBanner } from '../components/OfferBanner.jsx';
import { useOfferBanners, useOffersProducts } from '../hooks/useOffers.js';
import banner from '../../../assets/shop-banner.webp';

export default function OffersPage() {
  const { t } = useTranslation();
  const banners = useOfferBanners();
  const offers = useOffersProducts();

  const offerBanners = banners.data?.items ?? [];
  const list = offers.data?.items ?? [];

  return (
    <>
      <Seo title={t('offers:title')} description={t('offers:subtitle')} />

      <PageHero
        image={banner}

        eyebrow={t('offers:hero.eyebrow')}
        title={t('offers:hero.title')}
        subtitle={t('offers:hero.subtitle')}
        primaryCta={t('offers:hero.primaryCta')}
        // primaryTo={paths.shop}
        secondaryCta={t('offers:hero.secondaryCta')}
        // secondaryTo={paths.auctions}
        showSearch={false}
        showTags={false}
        minHeight="min-h-[360px] md:min-h-[440px]"
        className="bg-dark-gradient"
      />

      <Container className="py-10">
        {/* {offerBanners.length > 0 && (
          <div className="mt-8 space-y-6">
            {offerBanners.map((banner) => (
              <OfferBanner key={banner.id} banner={banner} />
            ))}
          </div>
        )} */}

        <div className="mt-10">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="font-display text-2xl font-bold text-base-dark">
              {t('offers:productsHeading')}
            </h2>
            {!offers.isPending && list.length > 0 && (
              <p className="text-sm text-hue-500">
                {t('offers:resultsCount', { count: list.length })}
              </p>
            )}
          </div>

          <div className="mt-6">
            {offers.isPending ? (
              <ProductListSkeleton count={8} />
            ) : offers.isError ? (
              <EmptyState
                icon={HiExclamationTriangle}
                title={t('common:states.error')}
                description={t('common:states.noResults')}
                action={
                  <Button variant="outline" onClick={() => offers.refetch()}>
                    {t('common:actions.retry')}
                  </Button>
                }
              />
            ) : list.length === 0 ? (
              <EmptyState
                icon={HiOutlineGift}
                title={t('offers:empty')}
                description={t('offers:emptyHint')}
                action={
                  <Button to={paths.shop} variant="primary">
                    {t('offers:shopAll')}
                  </Button>
                }
              />
            ) : (
              <ProductGrid products={list} />
            )}
          </div>
        </div>
      </Container>
    </>
  );
}
