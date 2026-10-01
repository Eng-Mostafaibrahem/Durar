/**
 * Live backend contract (Laravel 11 + Sanctum + Spatie). Sync with the
 * Postman collection "Durar Store API". Every storefront response is
 * { success, message, data }; the apiClient unwraps one level, so these
 * helpers call endpoints and get the business payload back.
 *
 * Admin routes (admin/*) belong to the separate dashboard project and are
 * intentionally not listed here.
 */
export const endpoints = {
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    logout: '/auth/logout',
    me: '/auth/me',
  },
  products: {
    list: '/products',
    details: (id) => `/products/${id}`,
    reviews: (id) => `/products/${id}/reviews`,
    submitReview: (id) => `/products/${id}/reviews`,
  },
  categories: {
    list: '/categories',
    details: (id) => `/categories/${id}`,
  },
  banners: {
    list: '/banners',
  },
  auctions: {
    list: '/auctions',
    details: (id) => `/auctions/${id}`,
    bids: (id) => `/auctions/${id}/bids`,
    placeBid: (id) => `/auctions/${id}/bids`,
    checkoutWin: (id) => `/auctions/${id}/checkout`,
  },
  cart: {
    get: '/cart',
    addItem: '/cart/items',
    updateItem: (itemId) => `/cart/items/${itemId}`,
    removeItem: (itemId) => `/cart/items/${itemId}`,
    clear: '/cart',
  },
  coupons: {
    check: '/coupons/check',
  },
  orders: {
    checkout: '/orders/checkout',
    list: '/orders',
    details: (id) => `/orders/${id}`,
    payment: (id) => `/orders/${id}/payment`,
  },
};
