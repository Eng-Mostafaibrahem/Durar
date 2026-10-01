const TOKEN_KEY = 'durar:auth:token';

let token = readToken();
const listeners = new Set();

/**
 * Sanctum bearer token for the storefront session. The backend issues a plain
 * token (no refresh token / httpOnly cookie), so it is persisted here to keep
 * the user logged in across reloads. On 401 the apiClient clears it.
 */
function readToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || null;
  } catch {
    return null;
  }
}

function writeToken(value) {
  try {
    if (value) {
      localStorage.setItem(TOKEN_KEY, value);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    /* storage unavailable — session lives in memory only */
  }
}

export const tokenStore = {
  get() {
    return token;
  },
  set(value) {
    token = value ?? null;
    writeToken(token);
    notify();
  },
  clear() {
    token = null;
    writeToken(null);
    notify();
  },
  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

function notify() {
  for (const listener of listeners) listener();
}
