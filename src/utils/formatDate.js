export function formatDate(value, { language = 'ar', options = {} } = {}) {
  if (!value) return '';

  const locale = import.meta.env[`VITE_LOCALE_${language.toUpperCase()}`] || undefined;
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    ...options,
  }).format(date);
}

export function formatDateTime(value, { language = 'ar' } = {}) {
  return formatDate(value, { language, options: { dateStyle: 'medium', timeStyle: 'short' } });
}
