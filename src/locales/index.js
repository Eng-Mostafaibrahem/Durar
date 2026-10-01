import ar from './ar/index.js';
import en from './en/index.js';

export const defaultLanguage = 'ar';

export const languages = [
  { code: 'ar', label: 'العربية', shortLabel: 'ع', dir: 'rtl', locale: 'ar-EG' },
  { code: 'en', label: 'English', shortLabel: 'EN', dir: 'ltr', locale: 'en-US' },
];

export function detectDirection(language) {
  return languages.find((item) => item.code === language)?.dir || 'rtl';
}

export function getLocaleFor(language) {
  return languages.find((item) => item.code === language)?.locale || 'en-US';
}

function buildResources(language) {
  return Object.fromEntries(Object.entries(language).map(([ns, json]) => [ns, json]));
}

export const resources = {
  ar: buildResources(ar),
  en: buildResources(en),
};
