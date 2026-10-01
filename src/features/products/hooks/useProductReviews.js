import { useQuery } from '@tanstack/react-query';
import { fetchProductReviews } from '../api/products.js';
import { queryKeys } from '../../../lib/queryKeys.js';

export function useProductReviews(id) {
  return useQuery({
    queryKey: queryKeys.products.reviews(id),
    queryFn: () => fetchProductReviews(id),
    enabled: Boolean(id),
    staleTime: 30 * 1000,
  });
}
