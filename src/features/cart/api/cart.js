import { apiClient } from '../../../lib/apiClient.js';
import { endpoints } from '../../../lib/endpoints.js';

/**
 * Cart works both as a guest (Laravel session cookie — needs
 * VITE_API_CREDENTIALS=include) and for logged-in customers.
 */

/** GET /cart */
export async function fetchCart() {
  return apiClient.get(endpoints.cart.get);
}

/** POST /cart/items — unit price snapshots final_price at the moment of adding. */
export async function addCartItem({ product_id, quantity }) {
  return apiClient.post(endpoints.cart.addItem, { product_id, quantity });
}

/** PUT /cart/items/:itemId */
export async function updateCartItem(itemId, { quantity }) {
  return apiClient.put(endpoints.cart.updateItem(itemId), { quantity });
}

/** DELETE /cart/items/:itemId */
export async function removeCartItem(itemId) {
  return apiClient.delete(endpoints.cart.removeItem(itemId));
}

/** DELETE /cart */
export async function clearCart() {
  return apiClient.delete(endpoints.cart.clear);
}
