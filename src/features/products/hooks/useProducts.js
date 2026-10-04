import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../api/products.js';
import { queryKeys } from '../../../lib/queryKeys.js';

/**
 * One server page at a time, driven by URL filters and the `page` parameter.
 */
export function useProducts(filters) {
  return useQuery({
    queryKey: queryKeys.products.list(filters),
    queryFn: () => fetchProducts({ ...filters, search: filters.q || filters.navQ }),
    staleTime: 60 * 1000,
  });
}
