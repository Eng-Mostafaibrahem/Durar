/**
 * Normalizes the backend's paginated payload into { items, meta } so feature
 * api functions never leak Laravel field names into components.
 *
 * Backend shape (post unwrap): { data: [...], current_page, per_page, total, last_page }
 */
export function normalizePage(payload) {
  const source = Array.isArray(payload) ? { data: payload } : (payload ?? {});
  const items = Array.isArray(source.data) ? source.data : [];
  const page = Number(source.current_page) || 1;
  const perPage = Number(source.per_page) || items.length || null;
  const total = Number(source.total) || items.length;
  const lastPage =
    Number(source.last_page) || (perPage ? Math.max(1, Math.ceil(total / perPage)) : 1);

  return {
    items,
    meta: { page, perPage, total, lastPage },
  };
}

/**
 * Resolves a localized record. Some responses expose both `name_ar`/`name_en`
 * style fields; pick the current language's value when present.
 */
export function localized(record, fields, language = 'ar') {
  const source = record ?? {};
  const result = {};

  for (const field of fields) {
    const ar = source[`${field}_ar`];
    const en = source[`${field}_en`];

    if (ar !== undefined || en !== undefined) {
      result[field] = language === 'ar' ? (ar ?? en) : (en ?? ar);
    } else if (source[field] !== undefined) {
      result[field] = source[field];
    }
  }

  return result;
}
