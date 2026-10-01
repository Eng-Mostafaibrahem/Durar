import { useQuery } from '@tanstack/react-query';
import { fetchCategory } from '../api/categories.js';
import { queryKeys } from '../../../lib/queryKeys.js';

export function useCategory(id) {
  return useQuery({
    queryKey: queryKeys.categories.details(id),
    queryFn: () => fetchCategory(id),
    enabled: Boolean(id),
    staleTime: 10 * 60 * 1000,
  });
}
