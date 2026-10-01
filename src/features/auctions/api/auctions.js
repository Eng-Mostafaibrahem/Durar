import { apiClient } from '../../../lib/apiClient.js';
import { endpoints } from '../../../lib/endpoints.js';
import { normalizePage } from '../../../lib/response.js';

/** GET /auctions?status=live|upcoming|ended */
export async function fetchAuctions({ status, page = 1 } = {}) {
  const payload = await apiClient.get(endpoints.auctions.list, { params: { status, page } });

  return normalizePage(payload);
}

/** GET /auctions/:id */
export async function fetchAuction(id) {
  return apiClient.get(endpoints.auctions.details(id));
}

/** GET /auctions/:id/bids */
export async function fetchAuctionBids(id) {
  return apiClient.get(endpoints.auctions.bids(id));
}

/** POST /auctions/:id/bids — authenticated. Min acceptable bid = current_price + min_bid_increment. */
export async function placeBid(id, { amount }) {
  return apiClient.post(endpoints.auctions.placeBid(id), { amount });
}

/** POST /auctions/:id/checkout — authenticated. Creates an order for a won auction. */
export async function checkoutWonAuction(id, { shipping_address }) {
  return apiClient.post(endpoints.auctions.checkoutWin(id), { shipping_address });
}
