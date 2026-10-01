export function formatNumber(value, { language = 'ar' } = {}) {
  const locale = import.meta.env[`VITE_LOCALE_${language.toUpperCase()}`] || undefined;
  return new Intl.NumberFormat(locale).format(Number(value) || 0);
}

export function formatWeight(value, unit = 'g') {
  return `${formatNumber(value)} ${unit}`;
}
