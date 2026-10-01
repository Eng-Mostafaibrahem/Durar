/**
 * Maps normalized ApiError payloads into React Hook Form field errors,
 * so server-side validation messages (Laravel `errors`) render inline.
 */

export function messageFor(error, t, fallback = 'errors:generic') {
  if (error?.isNetworkError) return t('errors:network');
  return error?.message || t(fallback);
}

export function firstFieldError(error, field) {
  const errors = error?.errors;

  if (!errors || typeof errors !== 'object') return null;

  const value = errors[field];

  if (Array.isArray(value) && value.length) return value[0];
  if (typeof value === 'string') return value;

  return null;
}

/**
 * `fields` maps backend field names → RHF field names, e.g.
 * { email: 'email', password: 'password' }.
 */
export function applyFieldErrors(error, setError, fields) {
  for (const [apiField, formField] of Object.entries(fields)) {
    const message = firstFieldError(error, apiField);
    if (message) setError(formField, { message });
  }
}
