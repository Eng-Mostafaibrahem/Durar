import { fetchBanners } from '../../banners/api/banners.js';
import { fetchProducts } from '../../products/api/products.js';

/** There is no dedicated /offers endpoint: offers = offer banners + discounted products. */
const OFFER_PRODUCT_PAGE_SIZE = 48;

/** GET /banners?type=offer — offer campaign banners (optionally coupon-linked). */
export function fetchOfferBanners() {
  return fetchBanners({ type: 'offer' });
}

/** GET /products (page 1, large page) — discounted filtering happens client-side. */
export async function fetchOfferProducts({ page = 1 } = {}) {
  return fetchProducts({ page, per_page: OFFER_PRODUCT_PAGE_SIZE });
}