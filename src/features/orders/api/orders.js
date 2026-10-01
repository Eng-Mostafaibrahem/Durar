import { apiClient } from '../../../lib/apiClient.js';
import { endpoints } from '../../../lib/endpoints.js';
import { normalizePage } from '../../../lib/response.js';

/**
 * POST /orders/checkout — creates an order from the current cart. Auth required.
 */
export async function checkoutCart({ shipping_address, coupon_code, shipping_fee }) {
  return apiClient.post(endpoints.orders.checkout, {
    shipping_address,
    coupon_code,
    shipping_fee,
  });
}

/**
 * POST /auctions/:id/checkout — "Complete payment" for a won auction.
 * Creates an order for the won item (win must exist for the user).
 */
export async function checkoutAuctionWin(auctionId, { shipping_address }) {
  return apiClient.post(endpoints.auctions.checkoutWin(auctionId), { shipping_address });
}

/** GET /orders */
export async function fetchOrders({ page = 1, status } = {}) {
  const payload = await apiClient.get(endpoints.orders.list, { params: { page, status } });

  return normalizePage(payload);
}

/** GET /orders/:id */
export async function fetchOrder(id) {
  return apiClient.get(endpoints.orders.details(id));
}

/** GET /orders/:id/payment — EdfaPay redirect/link data. */
export async function fetchOrderPayment(id) {
  return apiClient.get(endpoints.orders.payment(id));
}
