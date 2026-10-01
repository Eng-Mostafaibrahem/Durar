import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../../lib/queryKeys.js';
import { fetchProducts } from '../../products/api/products.js';

export const LANDING_FILTERS = [
  { value: 'best_selling', labelKey: 'home:featured.tabs.bestSelling' },
  { value: 'newest', labelKey: 'home:featured.tabs.newest' },
  { value: 'rare', labelKey: 'home:featured.tabs.rare' },
];

/**
 * Landing "featured picks" row. The backend ignores `per_page`, so we fetch
 * the whole (small) set and let the component slice the visible count.
 */
export function useFeaturedPicks(filter = 'best_selling') {
  return useQuery({
    queryKey: queryKeys.products.list({ source: 'home', filter }),
    queryFn: () => fetchProducts({ filter }),
    staleTime: 60 * 1000,
  });
}