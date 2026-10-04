import { tokenStore } from './tokenStore.js';
import i18n from './i18n.js';
import { paths } from './paths.js';

const BASE_URL = (
  import.meta.env.DEV ? '/api' : import.meta.env.VITE_API_URL || ''
).replace(/\/+$/, '');
const CREDENTIALS =
  (import.meta.env.VITE_API_CREDENTIALS || 'include') === 'omit' ? 'omit' : 'include';

export class ApiError extends Error {
  constructor({ status, message, errors, data, url } = {}) {
    super(message || 'Request failed');
    this.name = 'ApiError';
    this.status = status ?? 0;
    this.message = message || 'Request failed';
    this.errors = errors || null;
    this.data = data ?? null;
    this.url = url;
  }

  get isNetworkError() {
    return this.status === 0;
  }

  get isUnauthorized() {
    return this.status === 401;
  }
}

const unauthorizedHandlers = new Set();

export function onUnauthorized(handler) {
  unauthorizedHandlers.add(handler);
  return () => unauthorizedHandlers.delete(handler);
}

/**
 * Last server timestamp seen on a successful response, paired with the moment
 * the client received it. Countdowns subtract the difference so device clock
 * skew cannot shift an auction's end time.
 */
let lastServerClock = { serverAt: null, receivedAt: Date.now() };

function stampServerClock(payload) {
  const body = payload && typeof payload === 'object' ? payload : {};
  const source = body.data && typeof body.data === 'object' ? body.data : body;
  const serverAt = source.serverTimestamp ?? source.serverTime ?? source.timestamp ?? null;

  lastServerClock = { serverAt, receivedAt: Date.now() };
}

function currentLanguage() {
  return i18n.resolvedLanguage || i18n.language || 'ar';
}

async function safeParse(response) {
  if (response.status === 204 || response.headers.get('content-length') === '0') return null;

  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function toApiError(response, data, url) {
  const payload = data && typeof data === 'object' ? data : {};
  const message =
    payload.message ||
    payload.error ||
    (typeof data === 'string' ? data : undefined) ||
    response.statusText;

  return new ApiError({
    status: response.status,
    message,
    errors: payload.errors ?? null,
    data: payload.data ?? data ?? null,
    url,
  });
}

async function request(path, { method = 'GET', body, headers = {}, signal, params, _retry } = {}) {
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
  const url = `${BASE_URL}${path}${buildQueryString(params)}`;
  const token = tokenStore.get();

  const response = await fetch(url, {
    method,
    signal,
    credentials: CREDENTIALS,
    headers: {
      Accept: 'application/json',
      'Accept-Language': currentLanguage(),
      // FormData keeps its own multipart boundary — never set Content-Type for it.
      ...(!isFormData && body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body:
      body === undefined || body === null ? undefined : isFormData ? body : JSON.stringify(body),
  });

  if (response.status === 401 && !_retry) {
    tokenStore.clear();

    for (const handler of unauthorizedHandlers) handler(buildReturnTo());
  }

  const data = await safeParse(response);

  if (!response.ok) throw toApiError(response, data, url);

  stampServerClock(data);

  // The backend wraps everything in { success, message, data }. Unwrap exactly
  // one level; a paginated `data` keeps its own `data` array + pagination
  // fields so feature api/*.js can read both.
  return data && typeof data === 'object' && Object.hasOwn(data, 'data') ? data.data : data;
}

function buildReturnTo() {
  const current = `${window.location.pathname}${window.location.search}`;
  return current && current !== '/' ? current : paths.home;
}

function buildQueryString(params) {
  if (!params) return '';

  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue;
    search.append(key, Array.isArray(value) ? value.join(',') : String(value));
  }

  const query = search.toString();
  return query ? `?${query}` : '';
}

export const apiClient = {
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
  put: (path, body, options) => request(path, { ...options, method: 'PUT', body }),
  patch: (path, body, options) => request(path, { ...options, method: 'PATCH', body }),
  delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
  buildQueryString,
  getServerClock: () => lastServerClock,
  ApiError,
};
