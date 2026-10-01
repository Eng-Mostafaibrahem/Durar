import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchProducts } from '../api/products.js';
import { queryKeys } from '../../../lib/queryKeys.js';

/**
 * Paginated product list driven by URL filters (see ShopPage).
 * `filters` is the stable object used as the query key.
 */
export function useProducts(filters) {
  return useInfiniteQuery({
    queryKey: queryKeys.products.list(filters),
    queryFn: ({ pageParam = 1 }) => fetchProducts({ ...filters, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.page < lastPage.meta.lastPage ? lastPage.meta.page + 1 : undefined,
    staleTime: 60 * 1000,
  });
}
