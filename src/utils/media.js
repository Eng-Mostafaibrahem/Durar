const API_URL = import.meta.env.VITE_API_URL || '';

export const API_ORIGIN = (() => {
  try {
    return new URL(API_URL).origin;
  } catch {
    return '';
  }
})();

/**
 * Backend media URLs (storage) are typically relative, e.g.
 * "/storage/products/xxx.webp". Resolve them against the API origin.
 * Absolute URLs pass through untouched.
 */
export function resolveImageUrl(url) {
  if (!url || typeof url !== 'string') return null;

  if (/^https?:\/\//i.test(url)) {
    try {
      const parsed = new URL(url);
      if (parsed.origin === API_ORIGIN && parsed.pathname.startsWith('/auctions/')) {
        parsed.pathname = `/storage${parsed.pathname}`;
        return parsed.toString();
      }
    } catch {
      return url;
    }

    return url;
  }

  if (url.startsWith('/storage/')) return `${API_ORIGIN}${url}`;
  if (url.startsWith('/auctions/')) return `${API_ORIGIN}/storage${url}`;
  if (url.startsWith('/')) return `${API_ORIGIN}/storage${url}`;
  if (/^(data:|blob:)/.test(url)) return url;

  return url;
}

export function resolveImageList(list) {
  if (!Array.isArray(list)) return [];
  return list.map(resolveImageUrl).filter(Boolean);
}
