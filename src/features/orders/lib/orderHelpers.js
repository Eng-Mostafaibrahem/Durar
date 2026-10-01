/** Display order helpers. The server always owns prices and totals. */

const STATUS_BADGE = {
  pending: 'warning',
  processing: 'primary',
  shipped: 'secondary',
  delivered: 'success',
  completed: 'success',
  cancelled: 'error',
  failed: 'error',
};

const PAYMENT_BADGE = {
  paid: 'success',
  unpaid: 'warning',
  pending: 'warning',
  failed: 'error',
  refunded: 'primary',
};

export const ORDER_TIMELINE = ['pending', 'processing', 'shipped', 'delivered'];

export function statusBadgeVariant(status) {
  return STATUS_BADGE[status] ?? 'default';
}

export function paymentBadgeVariant(status) {
  return PAYMENT_BADGE[status] ?? 'default';
}

export function normalizeOrder(order) {
  if (!order) return null;

  const rawItems = Array.isArray(order.items)
    ? order.items
    : Array.isArray(order.order_items)
      ? order.order_items
      : [];

  const items = rawItems.map((item) => {
    const product = item?.product && typeof item.product === 'object' ? item.product : {};
    const unitPrice =
      Number(item?.unit_price ?? item?.price ?? product.final_price ?? product.price) || 0;
    const quantity = Number(item?.quantity) || 1;

    return {
      id: item?.id ?? item?.product_id,
      productId: Number(item?.product_id ?? product.id),
      name: product.name ?? item?.name ?? '',
      image: product.image ?? item?.image ?? product.main_image?.[0] ?? null,
      quantity,
      unitPrice,
      lineTotal: unitPrice * quantity,
    };
  });

  return {
    id: order.id,
    number: order.number ?? order.reference ?? order.id,
    status: order.status ?? 'pending',
    paymentStatus: order.payment_status ?? order.payment?.status ?? 'unpaid',
    items,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: Number(order.subtotal ?? order.items_total ?? 0),
    shipping: Number(order.shipping_fee ?? order.shipping ?? 0),
    discount: Number(order.discount ?? order.coupon_discount ?? 0),
    total: Number(order.total ?? order.grand_total ?? 0),
    currency: order.currency ?? null,
    createdAt: order.created_at ?? order.date ?? order.placed_at ?? null,
    shippingAddress: order.shipping_address ?? order.address ?? null,
  };
}

/** Extracts a redirect URL from the /orders/:id/payment payload. */
export function paymentUrl(payment) {
  if (!payment) return null;
  return (
    payment.redirect_url ??
    payment.url ??
    payment.checkout_url ??
    payment.link ??
    payment.payment_url ??
    payment.gateway_url ??
    null
  );
}
