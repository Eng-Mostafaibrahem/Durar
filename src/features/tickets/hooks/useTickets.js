import { useMutation, useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../../lib/queryKeys.js';
import { bookTickets, fetchTickets } from '../api/tickets.js';

export function useTickets() {
  return useQuery({
    queryKey: queryKeys.tickets.list(),
    queryFn: ({ signal }) => fetchTickets({ signal }),
    staleTime: 60 * 1000,
    retry: 1,
  });
}

export function useBookTickets() {
  return useMutation({
    mutationFn: bookTickets,
  });
}
