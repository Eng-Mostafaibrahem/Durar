import { apiClient } from '../../../lib/apiClient.js';
import { endpoints } from '../../../lib/endpoints.js';
import { normalizePage } from '../../../lib/response.js';

/** GET /banners?type=normal|offer — active banners. */
export async function fetchBanners({ type } = {}) {
  const payload = await apiClient.get(endpoints.banners.list, { params: { type } });

  return Array.isArray(payload) ? { items: payload } : normalizePage(payload);
}
