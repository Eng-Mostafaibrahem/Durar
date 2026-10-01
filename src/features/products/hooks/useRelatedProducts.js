import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../api/products.js';
import { queryKeys } from '../../../lib/queryKeys.js';

/**
 * Related pieces: same category as the current product (if any),
 * excluding the product itself. Falls back to the newest pieces.
 */
export function useRelatedProducts(product) {
  const categoryId = product?.category?.id ?? product?.category_id;
  const enabled = Boolean(product?.id);

  return useQuery({
    queryKey: queryKeys.products.related(product?.id),
    queryFn: () =>
      fetchProducts({
        category_id: categoryId,
        per_page: 5,
      }),
    enabled,
    select: (data) => data.items.filter((item) => item.id !== product.id).slice(0, 4),
    staleTime: 60 * 1000,
  });
}
