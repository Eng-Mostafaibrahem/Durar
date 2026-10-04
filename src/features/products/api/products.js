import { apiClient } from '../../../lib/apiClient.js';
import { endpoints } from '../../../lib/endpoints.js';
import { normalizePage } from '../../../lib/response.js';

/**
 * GET /products — paginated storefront list.
 * `filter` picks landing/curated sets: best_selling | newest | rare.
 */
export async function fetchProducts({
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
  sort,
} = {}) {
  const payload = await apiClient.get(endpoints.products.list, {
    params: {
      category_id,
      page,
      per_page,
      search: search ?? q,
      filter,
      type,
      price_min,
      price_max,
      availability,
      on_offer: onOffer === '1' ? 1 : undefined,
      sort,
    },
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
