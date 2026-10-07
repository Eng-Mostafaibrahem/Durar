import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchProducts } from '../api/products.js';
import { queryKeys } from '../../../lib/queryKeys.js';

/**
 * One server page at a time, driven by URL filters and the `page` parameter.
 */
export function useProducts(filters) {
  const queryClient = useQueryClient();
  const productsQuery = useQuery({
    queryKey: queryKeys.products.list(filters),
    queryFn: ({ signal }) =>
      fetchProducts({ ...filters, search: filters.q || filters.navQ }, { signal }),
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    const currentPage = productsQuery.data?.meta?.page ?? (Number(filters.page) || 1);
    const lastPage = productsQuery.data?.meta?.lastPage;

    if (
      !productsQuery.isSuccess ||
      !Number.isFinite(lastPage) ||
      currentPage >= lastPage
    ) {
      return;
    }

    const nextFilters = { ...filters, page: currentPage + 1 };
    queryClient.prefetchQuery({
      queryKey: queryKeys.products.list(nextFilters),
      queryFn: ({ signal }) =>
        fetchProducts(
          { ...nextFilters, search: nextFilters.q || nextFilters.navQ },
          { signal },
        ),
      staleTime: 60 * 1000,
    });
  }, [filters, productsQuery.data, productsQuery.isSuccess, queryClient]);

  return productsQuery;
}
