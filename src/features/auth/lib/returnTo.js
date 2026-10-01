import { paths } from '../../../lib/paths.js';

/**
 * Normalizes a `?returnTo=` value. Only same-site paths are allowed, so a
 * crafted absolute URL can't be used for an open redirect.
 */
export function safeReturnTo(value, fallback = paths.home) {
  if (typeof value !== 'string' || value.length > 500) return fallback;
  if (value[0] !== '/' || value[1] === '/') return fallback;

  return value;
}
