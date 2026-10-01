import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HiExclamationTriangle, HiOutlineSwatch } from 'react-icons/hi2';
import { Seo } from '../../../components/Seo.jsx';
import { Container } from '../../../components/Container.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { EmptyState } from '../../../components/ui/EmptyState.jsx';
import { useCategory } from '../hooks/useCategory.js';
import { useProducts } from '../../products/hooks/useProducts.js';
import { ProductGrid } from '../../products/components/ProductGrid.jsx';
import { ProductListSkeleton } from '../../products/components/ProductListSkeleton.jsx';
import { paths } from '../../../lib/paths.js';

export default function CollectionPage() {
  const { t } = useTranslation();
  const { id } = useParams();

  const category = useCategory(id);
  const products = useProducts({ category_id: id });

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

      <Container className="py-10">
        <header className="rounded-2xl bg-gradient-to-b from-[#044B4A] to-[#002045] px-6 py-10 text-white lg:px-10">
          <h1 className="font-display text-3xl font-bold lg:text-4xl">{activeCategory.name}</h1>
          {activeCategory.description && (
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/80">
              {activeCategory.description}
            </p>
          )}
        </header>

        <div className="mt-10">
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
              <ProductGrid products={products.data.pages.flatMap((page) => page.items)} />
              {products.hasNextPage && (
                <div className="mt-10 flex justify-center">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => products.fetchNextPage()}
                    loading={products.isFetchingNextPage}
                  >
                    {t('common:actions.loadMore')}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </Container>
    </>
  );
}
