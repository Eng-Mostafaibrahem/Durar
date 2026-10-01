import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HiChevronLeft, HiExclamationTriangle, HiOutlineCubeTransparent } from 'react-icons/hi2';
import { Seo } from '../../../components/Seo.jsx';
import { Container } from '../../../components/Container.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { EmptyState } from '../../../components/ui/EmptyState.jsx';
import { useProduct } from '../hooks/useProduct.js';
import { ProductGallery } from '../components/ProductGallery.jsx';
import { ProductInfo } from '../components/ProductInfo.jsx';
import { AuctionPanel } from '../components/AuctionPanel.jsx';
import { ProductReviews } from '../components/ProductReviews.jsx';
import { RelatedProducts } from '../components/RelatedProducts.jsx';
import { paths } from '../../../lib/paths.js';
import { resolveImageList } from '../../../utils/media.js';

const TYPE_KEYS = ['stone', 'meteorite', 'jewelry'];

export default function ProductDetailsPage() {
  const { t } = useTranslation();
  const { id } = useParams();

  const { data: product, isPending, isError, refetch } = useProduct(id);

  

  const isAuction = Boolean(product?.is_auction || product?.auction);

  if (isPending) {
    return (
      <Container className="py-10">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="aspect-[4/5] animate-pulse rounded-2xl bg-silk-fallback" />
          <div className="flex animate-pulse flex-col gap-4">
            <div className="h-5 w-1/3 rounded-full bg-hue-100" />
            <div className="h-10 w-2/3 rounded-full bg-hue-100" />
            <div className="h-14 w-full rounded-2xl bg-hue-100" />
            <div className="h-20 w-full rounded-2xl bg-hue-100" />
            <div className="h-6 w-1/2 rounded-full bg-hue-100" />
          </div>
        </div>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container className="py-10">
        <EmptyState
          icon={HiExclamationTriangle}
          title={t('common:states.error')}
          description={t('products:notFound.hint')}
          action={
            <div className="flex gap-3">
              <Button onClick={() => refetch()} variant="outline">
                {t('common:actions.retry')}
              </Button>
              <Button to={paths.shop}>{t('products:backToShop')}</Button>
            </div>
          }
        />
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="py-10">
        <EmptyState
          icon={HiOutlineCubeTransparent}
          title={t('products:notFound.title')}
          description={t('products:notFound.hint')}
          action={
            <Button to={paths.shop}>
              <HiChevronLeft aria-hidden="true" className="size-4 shrink-0 rtl:rotate-180" />
              {t('products:backToShop')}
            </Button>
          }
        />
      </Container>
    );
  }

  const specs = buildSpecs(product, t);
console.log(product);

  return (
    <>
      <Seo title={product.name} description={product.short_description ?? product.description} />

      <Container className="py-8 lg:py-12">
        <nav aria-label="breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-hue-500">
            <li>
              <Link to={paths.home} className="transition-colors hover:text-primary-500">
                {t('nav:home')}
              </Link>
            </li>
            <li aria-hidden="true">
              <HiChevronLeft className="size-3.5 rtl:rotate-180" />
            </li>
            <li>
              <Link to={paths.shop} className="transition-colors hover:text-primary-500">
                {t('products:title')}
              </Link>
            </li>
            <li aria-hidden="true">
              <HiChevronLeft className="size-3.5 rtl:rotate-180" />
            </li>
            <li aria-current="page" className="line-clamp-1 max-w-56 text-base-dark">
              {product.name_ar}
            </li>
          </ol>
        </nav>

        <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
          <ProductGallery
            images={product.gallery}
            name={product.name_ar ?? product.name}
            backgroundVariant={"card3" ?? product.silk_variant}
          />

          <div className="min-w-0">
            {isAuction ? <AuctionPanel product={product} /> : <ProductInfo product={product} />}
          </div>
        </div>

        {!isAuction && specs.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display text-2xl font-bold text-base-dark">
              {t('products:specifications')}
            </h2>
            
            <div className="mt-5 overflow-hidden rounded-2xl border border-border-500/15">
              <dl>
                {specs.map(([key, value], index) => (
                  <div
                    key={key}
                    className={[
                      'grid grid-cols-1 gap-1 px-6 py-4 sm:grid-cols-3',
                      index > 0 && 'border-t border-border-500/10',
                    ].join(' ')}
                  >
                    <dt className="text-sm font-medium text-hue-500">
                      {t(`products:specs.${key}`)}
                    </dt>
                    <dd className="sm:col-span-2">
                      <span className="text-sm text-base-dark">{value}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        )}

        <ProductReviews productId={product.id} />

        <RelatedProducts product={product} />
      </Container>
    </>
  );
}

function buildSpecs(product, t) {
  const typeValue = TYPE_KEYS.includes(product.type)
    ? t(`products:types.${product.type}`)
    : product.type;

  return [
    ['weight', product.weight],
    ['dimensions', product.dimensions],
    ['origin', product.origin],
    ['type', typeValue],
    ['certificate', product.certificate],
    ['sku', product.sku ?? product.code],
  ].filter(([, value]) => value !== undefined && value !== null && value !== '');
}
