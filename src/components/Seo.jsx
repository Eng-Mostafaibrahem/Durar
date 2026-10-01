import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

export function Seo({ title, description, image, type = 'website', noIndex = false }) {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage || 'ar';
  const resolvedTitle = title ? `${title} | ${t('common:appName')}` : t('common:appName');
  const resolvedDescription = description || t('common:tagline');

  return (
    <Helmet>
      <html lang={language} dir={i18n.dir()} />
      <title>{resolvedTitle}</title>
      <meta name="description" content={resolvedDescription} />
      <meta property="og:title" content={resolvedTitle} />
      <meta property="og:description" content={resolvedDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content={language} />
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content="summary_large_image" />
      {noIndex && <meta name="robots" content="noindex,nofollow" />}
    </Helmet>
  );
}
