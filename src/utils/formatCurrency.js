/**
 * Display-only formatting. The server always owns the authoritative price,
 * including any offer discount — never compute a price here.
 */
export function formatCurrency(amount, { language = 'ar', options = {} } = {}) {
  const locale = import.meta.env[`VITE_LOCALE_${language.toUpperCase()}`] || undefined;

  return new Intl.NumberFormat(locale, {
    // style: 'currency',
    // currency: CURRENCY,
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
    ...options,
  }).format(Number(amount) || 0);
}

/** Display-only helper for offer badges. The server still returns the final price. */
export function formatDiscountPercent(originalPrice, offerPrice) {
  const original = Number(originalPrice);
  const offer = Number(offerPrice);

  if (!original || !offer || offer >= original) return 0;

  return Math.round(((original - offer) / original) * 100);
}
