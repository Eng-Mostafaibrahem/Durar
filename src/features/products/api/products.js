import { apiClient } from '../../../lib/apiClient.js';
import { endpoints } from '../../../lib/endpoints.js';
import { normalizePage } from '../../../lib/response.js';

/**
 * GET /products — paginated storefront list. Keep the response envelope so
 * Laravel's sibling `meta` pagination object is not discarded by apiClient.
 * `filter` picks landing/curated sets: best_selling | newest | rare.
 * Shop filters are sent to the backend as search, type, min_price, max_price,
 * in_stock, on_offer, and sort (newest | price_asc | price_desc | popular).
 */
export async function fetchProducts(
  {
    category_id,
    page = 1,
    per_page,
    search,
    q,
    filter,
    type,
    price_min,
    price_max,
    availability,
    onOffer,
    rare,
    sort,
  } = {},
  { signal } = {},
) {
  const sortBy = {
    priceAsc: 'price_asc',
    priceDesc: 'price_desc',
  }[sort] ?? sort;

  const payload = await apiClient.get(endpoints.products.list, {
    params: {
      category_id,
      page,
      per_page,
      search: search ?? q,
      filter: rare === '1' ? 'rare' : filter,
      type,
      min_price: price_min,
      max_price: price_max,
      in_stock: availability === '1' ? 1 : undefined,
      on_offer: onOffer === '1' ? 1 : undefined,
      sort: sortBy,
    },
    signal,
    unwrapData: false,
  });

  return normalizePage(payload);
}

/** GET /products/:id */
export async function fetchProduct(id) {
  return apiClient.get(endpoints.products.details(id));
}

/** GET /products/:id/reviews */
export async function fetchProductReviews(id) {
  return apiClient.get(endpoints.products.reviews(id));
}

/** POST /products/:id/reviews — authenticated. */
export async function submitProductReview(id, { rating, comment }) {
  return apiClient.post(endpoints.products.submitReview(id), { rating, comment });
}
