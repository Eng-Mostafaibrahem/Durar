import { useQuery } from '@tanstack/react-query';
import { fetchProduct } from '../api/products.js';
import { queryKeys } from '../../../lib/queryKeys.js';

export function useProduct(id) {
  return useQuery({
    queryKey: queryKeys.products.details(id),
    queryFn: () => fetchProduct(id),
    enabled: Boolean(id),
    staleTime: 60 * 1000,
  });
}
