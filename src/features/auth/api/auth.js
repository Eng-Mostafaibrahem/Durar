import { apiClient } from '../../../lib/apiClient.js';
import { endpoints } from '../../../lib/endpoints.js';

/**
 * POST /auth/register → { token, user? }
 * POST /auth/login  → { token, user? }
 */
export async function loginRequest({ email, password }) {
  return apiClient.post(endpoints.auth.login, { email, password });
}

export async function registerRequest({ name, email, phone, password, password_confirmation }) {
  return apiClient.post(endpoints.auth.register, {
    name,
    email,
    phone,
    password,
    password_confirmation,
  });
}

export async function logoutRequest() {
  return apiClient.post(endpoints.auth.logout, undefined);
}

/** GET /auth/me — restores the session on reload. */
export async function fetchMe() {
  return apiClient.get(endpoints.auth.me);
}

/** POST /auth/profile — updates the signed-in user's name, phone, and avatar. */
export async function updateProfileRequest({ name, phone, avatar }) {
  const body = new FormData();
  body.append('name', name);
  body.append('phone', phone);
  if (avatar) body.append('avatar', avatar);

  return apiClient.post(endpoints.auth.profile, body);
}

export function extractToken(authResult) {
  const payload = authResult?.data ?? authResult;
  const token =
    payload?.token ??
    payload?.access_token ??
    payload?.accessToken ??
    payload?.plainTextToken ??
    payload?.plain_text_token;

  return typeof token === 'string' && token.trim() ? token : null;
}

export function extractUser(authResult) {
  const payload = authResult?.data ?? authResult;
  return payload?.user ?? null;
}
