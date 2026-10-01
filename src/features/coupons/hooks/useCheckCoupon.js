import { useMutation } from '@tanstack/react-query';
import { checkCoupon } from '../api/coupons.js';

export function useCheckCoupon() {
  return useMutation({
    mutationFn: (payload) => checkCoupon(payload),
  });
}
