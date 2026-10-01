import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addCartItem,
  clearCart as clearCartRequest,
  fetchCart,
  removeCartItem,
  updateCartItem as updateCartItemRequest,
} from '../api/cart.js';
import { queryKeys } from '../../../lib/queryKeys.js';
import { toastStore } from '../../../lib/toastStore.js';
import { useCartDrawer } from './useCartDrawer.js';

export function useCart() {
  return useQuery({
    queryKey: queryKeys.cart.detail(),
    queryFn: fetchCart,
    staleTime: 30 * 1000,
  });
}

function useInvalidateCart() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
}

export function useAddToCart() {
  const invalidateCart = useInvalidateCart();
  const { openCart } = useCartDrawer();

  return useMutation({
    mutationFn: (payload) => addCartItem(payload),
    onSuccess: () => {
      invalidateCart();
      openCart();
    },
  });
}

export function useUpdateCartItem() {
  const invalidateCart = useInvalidateCart();

  return useMutation({
    mutationFn: ({ itemId, quantity }) => updateCartItemRequest(itemId, { quantity }),
    onSuccess: () => invalidateCart(),
  });
}

export function useRemoveCartItem() {
  const invalidateCart = useInvalidateCart();

  return useMutation({
    mutationFn: (itemId) => removeCartItem(itemId),
    onSuccess: () => {
      invalidateCart();
      toastStore.push({ type: 'success', messageKey: 'cart:itemRemoved', duration: 3000 });
    },
  });
}

export function useClearCart() {
  const invalidateCart = useInvalidateCart();

  return useMutation({
    mutationFn: () => clearCartRequest(),
    onSuccess: () => invalidateCart(),
  });
}
