import { useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HiExclamationTriangle, HiOutlineSwatch } from 'react-icons/hi2';
import { Seo } from '../../../components/Seo.jsx';
import { Container } from '../../../components/Container.jsx';
import { PageHero } from '../../../components/PageHero.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Pagination } from '../../../components/ui/Pagination.jsx';
import { EmptyState } from '../../../components/ui/EmptyState.jsx';
import { useCategory } from '../hooks/useCategory.js';
import { useProducts } from '../../products/hooks/useProducts.js';
import { ProductGrid } from '../../products/components/ProductGrid.jsx';
import { ProductListSkeleton } from '../../products/components/ProductListSkeleton.jsx';
import { paths } from '../../../lib/paths.js';
import banner from '../../../assets/shop-banner.webp';

export default function CollectionPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Math.max(1, Number(searchParams.get('page')) || 1);

  const category = useCategory(id);
  const products = useProducts({ category_id: id, page });

  const changePage = (nextPage) => {
    const next = new URLSearchParams(searchParams);
    if (nextPage <= 1) next.delete('page');
    else next.set('page', String(nextPage));
    setSearchParams(next);
    document.getElementById('collection-products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (category.isPending || products.isPending) {
    return (
      <Container className="py-10">
        <div className="mb-6 h-10 w-64 animate-pulse rounded-full bg-hue-100" />
        <div className="mb-4 h-5 w-96 max-w-full animate-pulse rounded-full bg-hue-100" />
        <ProductListSkeleton count={8} />
      </Container>
    );
  }

  if (category.isError || !category.data) {
    return (
      <Container className="py-10">
        <EmptyState
          icon={HiOutlineSwatch}
          title={t('products:notFound.title')}
          description={t('products:notFound.hint')}
          action={<Button to={paths.shop}>{t('products:backToShop')}</Button>}
        />
      </Container>
    );
  }

  const activeCategory = category.data;

  return (
    <>
      <Seo
        title={activeCategory.name ?? t('nav:collections')}
        description={activeCategory.description ?? t('products:description')}
      />

      <PageHero
              image={banner}

        title={activeCategory.name}
        subtitle={activeCategory.description ?? ''}
        showSearch={false}
        showTags={false}
        minHeight="min-h-[320px] md:min-h-[400px]"
        className="bg-dark-gradient"
      />
      <Container className="py-10">
        <div id="collection-products" className="mt-10 scroll-mt-24">
          {products.isError ? (
            <EmptyState
              icon={HiExclamationTriangle}
              title={t('common:states.error')}
              description={t('products:empty.hint')}
              action={
                <Button variant="outline" onClick={() => products.refetch()}>
                  {t('common:actions.retry')}
                </Button>
              }
            />
          ) : products.data?.pages[0]?.items.length === 0 ? (
            <EmptyState
              icon={HiOutlineSwatch}
              title={t('products:empty.title')}
              description={t('products:empty.hint')}
            />
          ) : (
            <>
              <ProductGrid products={products.data.items} />
              <Pagination
                page={products.data.meta.page}
                lastPage={products.data.meta.lastPage}
                onPageChange={changePage}
                className="mt-10"
              />
            </>
          )}
        </div>
      </Container>
    </>
  );
}
