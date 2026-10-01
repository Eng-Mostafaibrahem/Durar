const NAMESPACE = 'validation';

const messages = {
  required: 'required',
  email: 'email',
  minLength: 'minLength',
  maxLength: 'maxLength',
  passwordMin: 'passwordMin',
  passwordMatch: 'passwordMatch',
  phone: 'phone',
  number: 'number',
  min: 'min',
  max: 'max',
  acceptTerms: 'acceptTerms',
};

/**
 * Builds an i18n key + options for React Hook Form validation messages.
 * Call it with the `t` function from useTranslation.
 */
export function validationMessage(t, type, options = {}) {
  return { key: `${NAMESPACE}:${messages[type] || type}`, options };
}
