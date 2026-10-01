import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { resources, defaultLanguage, languages, detectDirection } from '../locales/index.js';
import { queryClient } from './queryClient.js';

const STORAGE_KEY = 'durar:language';
const AVAILABLE_NAMESPACES = Object.keys(resources[defaultLanguage]);

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    ns: AVAILABLE_NAMESPACES,
    defaultNS: 'common',
    fallbackLng: defaultLanguage,
    supportedLngs: languages.map((language) => language.code),
    nonExplicitSupportedLngs: true,
    load: 'currentOnly',
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'htmlTag'],
      lookupLocalStorage: STORAGE_KEY,
      caches: ['localStorage'],
    },
    react: { useSuspense: false },
  });

function applyDocumentLanguage(language) {
  const root = document.documentElement;
  root.lang = language;
  root.dir = detectDirection(language);
}

let lastLanguage = i18n.resolvedLanguage || defaultLanguage;
applyDocumentLanguage(lastLanguage);
i18n.on('languageChanged', (language) => {
  applyDocumentLanguage(language);

  if (language !== lastLanguage) {
    lastLanguage = language;
    // Refetch server data so localized records come back in the new language.
    queryClient.invalidateQueries();
  }
});

export default i18n;
