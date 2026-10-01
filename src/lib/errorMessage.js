import { ApiError } from './apiClient.js';

const STATUS_KEYS = {
  0: 'network',
  400: 'generic',
  401: 'unauthorized',
  403: 'forbidden',
  404: 'notFound',
  409: 'conflict',
  422: 'generic',
  500: 'server',
  502: 'server',
  503: 'server',
  504: 'server',
};

/** Maps any thrown value to an `errors:*` translation key. */
export function getErrorKey(error) {
  if (error instanceof ApiError) return `errors:${STATUS_KEYS[error.status] || 'unknown'}`;
  if (error?.name === 'AbortError') return null;
  if (error instanceof TypeError) return 'errors:network';
  return 'errors:unknown';
}

/** Messages that are expected and already surfaced inline should not also toast. */
export function shouldToast(error) {
  if (!error) return false;
  if (error instanceof ApiError && error.status === 401) return false;
  if (error?.name === 'AbortError') return false;
  if (error?.silent) return false;
  return true;
}
