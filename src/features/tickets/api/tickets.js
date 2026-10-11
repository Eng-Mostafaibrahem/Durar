import { apiClient } from '../../../lib/apiClient.js';
import { endpoints } from '../../../lib/endpoints.js';
import { normalizePage } from '../../../lib/response.js';

/**
 * GET /tickets — available museum visit tickets. The backend may return a
 * plain array or a Laravel paginator inside the { data } envelope; detect the
 * paginator and normalize both shapes so components never see field names.
 */
export async function fetchTickets({ signal } = {}) {
  const envelope = await apiClient.get(endpoints.tickets.list, { signal, unwrapData: false });
  const inner = envelope?.data;
  const payload =
    inner && typeof inner === 'object' && Array.isArray(inner.data) ? inner : envelope;

  return normalizePage(payload);
}

/** GET /my-ticket — authenticated visitor ticket bookings. */
export async function fetchMyTickets({ page = 1, signal } = {}) {
  const payload = await apiClient.get(endpoints.tickets.mine, {
    params: { page },
    signal,
  });
  const pagePayload =
    payload && !Array.isArray(payload) && Array.isArray(payload.tickets)
      ? { ...payload, data: payload.tickets }
      : payload;

  return normalizePage(pagePayload);
}

/**
 * POST /tickets/book — books visit tickets for a guest visitor.
 * Payload: { customer_name, national_id, phone, items: [{ ticket_id, quantity }] }.
 * The server owns every amount and answers with
 * { booking_id, order_number, total, redirect_url, items[] }.
 */
export function bookTickets(payload) {
  return apiClient.post(endpoints.tickets.book, payload);
}
