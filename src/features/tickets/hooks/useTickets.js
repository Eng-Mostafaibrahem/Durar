import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../../lib/queryKeys.js';
import { bookTickets, fetchMyTickets, fetchTickets } from '../api/tickets.js';

export function useTickets() {
  return useQuery({
    queryKey: queryKeys.tickets.list(),
    queryFn: ({ signal }) => fetchTickets({ signal }),
    staleTime: 60 * 1000,
    retry: 1,
  });
}

export function useMyTickets(filters) {
  return useInfiniteQuery({
    queryKey: queryKeys.tickets.mine(filters ?? {}),
    queryFn: ({ pageParam, signal }) => fetchMyTickets({ page: pageParam, signal }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.page < lastPage.meta.lastPage ? lastPage.meta.page + 1 : undefined,
    staleTime: 60 * 1000,
  });
}

export function useBookTickets() {
  return useMutation({
    mutationFn: bookTickets,
  });
}
