import { useState } from 'react';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  HiAdjustmentsHorizontal,
  HiExclamationTriangle,
  HiFunnel,
  HiOutlineMagnifyingGlass,
} from 'react-icons/hi2';
import { Seo } from '../../../components/Seo.jsx';
import { Container } from '../../../components/Container.jsx';
import { Drawer } from '../../../components/ui/Drawer.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Select } from '../../../components/ui/Select.jsx';
import { EmptyState } from '../../../components/ui/EmptyState.jsx';
import { useProducts } from '../hooks/useProducts.js';
import { useCategories } from '../../categories/hooks/useCategories.js';
import { ProductFilters } from '../components/ProductFilters.jsx';
import { ProductGrid } from '../components/ProductGrid.jsx';
import { ProductListSkeleton } from '../components/ProductListSkeleton.jsx';
import { isOnOffer } from '../lib/productOffer.js';
import { cn } from '../../../utils/cn.js';
import { PageHero } from '../../../components/PageHero.jsx';
import banner from '../../../assets/shop-banner.webp';

const SORT_OPTIONS = ['newest', 'priceAsc', 'priceDesc', 'popular'];

function readFilters(searchParams) {
  return {
    q: searchParams.get('q') ?? '',
    category_id: searchParams.get('category_id') ?? '',
    type: searchParams.get('type') ?? '',
    price_min: searchParams.get('price_min') ?? '',
    price_max: searchParams.get('price_max') ?? '',
    availability: searchParams.get('availability') ?? '',
    onOffer: searchParams.get('onOffer') ?? '',
    sort: searchParams.get('sort') ?? 'newest',
  };
}

function commitFilters(searchParams, setSearchParams, patch) {
  const next = new URLSearchParams(searchParams);

  for (const [key, value] of Object.entries(patch)) {
    if (value === undefined || value === null || value === '') next.delete(key);
    else next.set(key, String(value));
  }

  next.delete('page');
  setSearchParams(next);
}

export default function ShopPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filters = useMemo(() => readFilters(searchParams), [searchParams]);

  const productsQuery = useProducts(filters);
  const categories = useCategories();

  const rawProducts = useMemo(
    () => productsQuery.data?.pages.flatMap((page) => page.items) ?? [],
    [productsQuery.data],
  );

  // The backend has no discount filter, so "on offer" is applied client-side.
  const products = useMemo(
    () => (filters.onOffer === '1' ? rawProducts.filter(isOnOffer) : rawProducts),
    [rawProducts, filters.onOffer],
  );

  const serverCount =
    typeof productsQuery.data?.pages[0]?.meta?.total === 'number'
      ? productsQuery.data.pages[0].meta.total
      : products.length;

  const filteredCount = filters.onOffer === '1' ? products.length : serverCount;

  const hasActiveFilters = Object.entries(filters).some(
    ([key, value]) => key !== 'sort' && value !== '',
  );

  const apply = (patch) => commitFilters(searchParams, setSearchParams, patch);

  const reset = () => setSearchParams({});

  const sortOptions = SORT_OPTIONS.map((value) => ({
    value,
    label: t(`products:sort.${value}`),
  }));
  const categoryItems = categories.data?.items ?? [];

  return (
    <>
      <Seo title={t('products:title')} description={t('products:description')} />

      <PageHero
        image={banner}
        eyebrow={t('common:appName')}
        title={t('products:title')}
        subtitle={t('products:description')}
        showSearch
        showTags={false}
        searchValue={filters.q}
        searchPlaceholder={t('products:filters.search')}
        searchButtonLabel={t('common:actions.search')}
        onSearch={(q) => commitFilters(searchParams, setSearchParams, { q })}
        minHeight="min-h-[420px] md:min-h-[520px]"
        className="bg-dark-gradient"
        filterAction={
          <Button
            variant="outline"
            size="md"
            className="border-white/60 bg-white/10 text-white hover:bg-white/20 lg:hidden"
            onClick={() => setFiltersOpen(true)}
          >
            <HiFunnel aria-hidden="true" className="size-4" />
            {t('products:filters.button')}
            {hasActiveFilters && (
              <span className="ms-1 rounded-full bg-white px-1.5 text-xs text-primary-500">•</span>
            )}
          </Button>
        }
      />
      <Container className="py-10">
        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[16rem_1fr]">
          <aside className="sticky top-24 hidden lg:block">
            <div className="rounded-2xl border border-border-500/15 bg-white p-5">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-sm font-bold text-base-dark">
                  <HiAdjustmentsHorizontal aria-hidden="true" className="size-4 text-primary-500" />
                  {t('common:actions.filter')}
                </h2>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={reset}
                    className="text-xs text-primary-500 underline underline-offset-2 hover:text-primary-700"
                  >
                    {t('products:filters.reset')}
                  </button>
                )}
              </div>
              <ProductFilters
                key={`filters:${JSON.stringify(filters)}`}
                active={filters}
                categories={categoryItems}
                isLoadingCategories={categories.isPending}
                onApply={apply}
                onReset={reset}
                showSearch={false}
              />
            </div>
          </aside>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <p
                  className={cn(
                    'text-sm text-hue-500',
                    productsQuery.isPending && 'h-4 w-24 animate-pulse rounded-full bg-hue-100',
                  )}
                >
                  {!productsQuery.isPending && t('products:resultsCount', { count: filteredCount })}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-hue-500">{t('products:sortLabel')}</span>
                <Select
                  value={filters.sort}
                  onChange={(event) =>
                    commitFilters(searchParams, setSearchParams, { sort: event.target.value })
                  }
                  options={sortOptions}
                  className="h-11 w-44 text-sm"
                  aria-label={t('products:sortLabel')}
                />
              </div>
            </div>

            <div className="mt-6">
              {productsQuery.isPending ? (
                <ProductListSkeleton count={8} />
              ) : productsQuery.isError ? (
                <EmptyState
                  icon={HiExclamationTriangle}
                  title={t('common:states.error')}
                  description={t('common:states.noResults')}
                  action={
                    <Button variant="outline" onClick={() => productsQuery.refetch()}>
                      {t('common:actions.retry')}
                    </Button>
                  }
                />
              ) : products.length === 0 ? (
                <EmptyState
                  icon={HiOutlineMagnifyingGlass}
                  title={t('products:empty.title')}
                  description={t('products:empty.hint')}
                  action={
                    hasActiveFilters ? (
                      <Button variant="outline" onClick={reset}>
                        {t('products:filters.reset')}
                      </Button>
                    ) : undefined
                  }
                />
              ) : (
                <>
                  <ProductGrid products={products} />
                  {productsQuery.hasNextPage && (
                    <div className="mt-10 flex justify-center">
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => productsQuery.fetchNextPage()}
                        loading={productsQuery.isFetchingNextPage}
                      >
                        {t('common:actions.loadMore')}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </Container>

      <Drawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        side="start"
        title={t('products:filters.button')}
        className="lg:hidden"
      >
        <ProductFilters
          key={`drawer-filters:${JSON.stringify(filters)}`}
          active={filters}
          categories={categoryItems}
          isLoadingCategories={categories.isPending}
          onApply={apply}
          onReset={reset}
          onClose={() => setFiltersOpen(false)}
          showSearch={false}
        />
      </Drawer>
    </>
  );
}
