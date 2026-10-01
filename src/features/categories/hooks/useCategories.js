import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '../api/categories.js';
import { queryKeys } from '../../../lib/queryKeys.js';

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.list(),
    queryFn: () => fetchCategories(),
    staleTime: 10 * 60 * 1000,
  });
}
