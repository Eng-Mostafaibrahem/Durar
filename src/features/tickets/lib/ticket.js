import { localized } from '../../../lib/response.js';
import { resolveImageUrl } from '../../../utils/media.js';

export const PHONE_PATTERN = /^\+?[0-9][0-9\s-]{7,14}$/;
export const NATIONAL_ID_PATTERN = /^[0-9]{6,20}$/;

/**
 * Maps a raw ticket record (admin-created: name, details, price,
 * discount_amount, event_datetime, duration_minutes, quantity, is_active,
 * image) into the view model used by the booking form.
 */
export function normalizeTicket(record, language = 'ar') {
  const source = record ?? {};
  const { name, details } = localized(source, ['name', 'details'], language);
  const price = Number(source.price) || 0;
  const discount = Math.max(Number(source.discount_amount) || 0, 0);

  // `quantity` is the remaining stock; negative / empty means unlimited.
  const rawRemaining = source.quantity;
  const hasLimit =
    rawRemaining !== null &&
    rawRemaining !== undefined &&
    rawRemaining !== '' &&
    Number(rawRemaining) >= 0;
  const remaining = hasLimit ? Number(rawRemaining) : null;

  // The server owns the price; this is display-only for the picker.
  const finalPrice =
    source.final_price != null ? Number(source.final_price) : Math.max(price - discount, 0);

  return {
    id: source.id,
    name: name || '',
    details: details || '',
    price,
    discountAmount: discount,
    finalPrice,
    eventAt: source.event_datetime || null,
    durationMinutes:
      source.duration_minutes != null && source.duration_minutes !== ''
        ? Number(source.duration_minutes)
        : null,
    remaining,
    image: resolveImageUrl(source.image),
    isSoldOut: remaining !== null && remaining <= 0,
  };
}

export function normalizeTickets(items, language = 'ar') {
  if (!Array.isArray(items)) return [];

  return items
    .filter((item) => item && item.is_active !== false)
    .map((item) => normalizeTicket(item, language));
}

/** Turns the quantity map into the POST /tickets/book `items` payload. */
export function buildBookingItems(quantities) {
  return Object.entries(quantities ?? {})
    .map(([ticketId, quantity]) => ({
      ticket_id: Number(ticketId),
      quantity: Math.trunc(Number(quantity)),
    }))
    .filter((item) => Number.isFinite(item.ticket_id) && item.ticket_id > 0 && item.quantity > 0);
}

/**
 * Builds the printable reservation view model from the booking response,
 * the submitted form values and the tickets that were actually selected.
 * Every amount here comes from the server.
 */
export function buildReservation({ booking, form, selectedTickets }) {
  const source = booking ?? {};
  const items = Array.isArray(source.items) ? source.items : [];
  const first = selectedTickets?.[0] ?? null;

  return {
    bookingId: source.booking_id ?? null,
    reference: source.order_number || (source.booking_id != null ? String(source.booking_id) : ''),
    total: Number(source.total) || 0,
    redirectUrl: source.redirect_url || null,
    items,
    name: String(form.customer_name ?? '').trim(),
    phone: form.phone ?? '',
    nationalId: form.national_id ?? '',
    eventAt: first?.eventAt ?? null,
    durationMinutes: first?.durationMinutes ?? null,
  };
}
