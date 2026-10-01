import { apiClient } from '../../../lib/apiClient.js';
import { endpoints } from '../../../lib/endpoints.js';
import { normalizePage } from '../../../lib/response.js';

/** GET /categories */
export async function fetchCategories() {
  const payload = await apiClient.get(endpoints.categories.list);

  return Array.isArray(payload) ? { items: payload } : normalizePage(payload);
}

/** GET /categories/:id */
export async function fetchCategory(id) {
  return apiClient.get(endpoints.categories.details(id));
}
