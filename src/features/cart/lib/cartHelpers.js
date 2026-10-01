/**
 * Normalizes the raw cart payload (Laravel cart shape is not fully fixed yet)
 * into a display-friendly structure. The server always owns prices — anything
 * computed here is for display only.
 */
export function normalizeCart(cart) {
  if (!cart) return { items: [], count: 0, subtotal: 0, discounts: 0, total: 0 };

  const rawItems = Array.isArray(cart.items) ? cart.items : Array.isArray(cart) ? cart : [];

  const items = rawItems.map((item) => {
    const product = item?.product && typeof item.product === 'object' ? item.product : {};
    const quantity = Number(item?.quantity) || 1;

    const unitPrice =
      Number(
        item?.unit_price ??
          item?.final_price ??
          item?.price ??
          product.final_price ??
          product.price,
      ) || 0;
    const basePrice = Number(item?.price ?? product.price) || 0;

    return {
      id: item?.id ?? item?.item_id,
      productId: Number(item?.product_id ?? product.id),
      quantity,
      unitPrice,
      basePrice,
      discount: Number(item?.discount_percentage ?? product.discount_percentage) || 0,
      lineTotal: unitPrice * quantity,
      name: product.name ?? item?.name ?? '',
      image: product.image ?? item?.image ?? product.main_image?.[0] ?? null,
      stock: Number(product.stock ?? product.quantity ?? 0),
      categoryId: product.category?.id ?? product.category_id ?? null,
      categoryName: product.category?.name ?? product.category_name ?? null,
    };
  });

  const computedSubtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);

  return {
    items,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: Number(cart.subtotal ?? computedSubtotal) || 0,
    discounts: Number(cart.discounts ?? 0) || 0,
    shipping: cart.shipping != null ? Number(cart.shipping) : null,
    total: cart.total != null ? Number(cart.total) : Math.max(computedSubtotal, 0),
  };
}
