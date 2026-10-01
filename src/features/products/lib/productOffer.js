/**
 * Client-side "is on offer" check. The backend owns the authoritative price
 * (price + discount_percentage + final_price); we only use these fields to
 * decide whether a product qualifies for the offers page and store filter.
 */
export function isOnOffer(product) {
  if (!product) return false;
  const price = Number(product.price) || 0;
  const hasFinalPrice = product.final_price != null;
  const finalPrice = Number(product.final_price ?? product.price) || 0;
  const serverDiscount = Math.round(Number(product.discount_percentage) || 0);

  return serverDiscount > 0 || (hasFinalPrice && finalPrice > 0 && finalPrice < price);
}