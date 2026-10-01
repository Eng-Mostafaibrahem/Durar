import { apiClient } from '../../../lib/apiClient.js';
import { endpoints } from '../../../lib/endpoints.js';

/**
 * POST /coupons/check — validates a code against the selected categories.
 * Discount is applied only to items of the coupon's categories.
 */
export async function checkCoupon({ code, category_ids }) {
  return apiClient.post(endpoints.coupons.check, { code, category_ids: category_ids ?? [] });
}
