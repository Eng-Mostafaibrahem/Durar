import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { checkoutCart, fetchOrder, fetchOrderPayment, fetchOrders } from '../api/orders.js';
import { queryKeys } from '../../../lib/queryKeys.js';

export function useOrders(filters) {
  return useInfiniteQuery({
    queryKey: queryKeys.orders.list(filters ?? {}),
    queryFn: ({ pageParam }) => fetchOrders({ page: pageParam, ...(filters ?? {}) }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.page < lastPage.meta.lastPage ? lastPage.meta.page + 1 : undefined,
    staleTime: 60 * 1000,
  });
}

export function useOrder(id) {
  return useQuery({
    queryKey: queryKeys.orders.details(id),
    queryFn: () => fetchOrder(id),
    enabled: Boolean(id),
    staleTime: 60 * 1000,
  });
}

/** GET /orders/:id/payment — triggered by the "pay now" action. */
export function useOrderPayment(id) {
  return useMutation({
    mutationFn: () => fetchOrderPayment(id),
  });
}

/** Creates an order from the current cart and resets the cart. */
export function useCheckout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => checkoutCart(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
    },
  });
}
