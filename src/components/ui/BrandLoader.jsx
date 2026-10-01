import { useTranslation } from 'react-i18next';
import { Logo } from '../Logo.jsx';

export function BrandLoader() {
  const { t } = useTranslation();

  return (
    <div
      role="status"
      aria-label={t('common:a11y.loading')}
      className="grid min-h-[60dvh] place-items-center"
    >
      <div className="flex flex-col items-center gap-5">
        <span className="animate-pulse">
          <Logo className="h-16 w-auto" />
        </span>
        <p className="font-display text-2xl font-bold text-primary-500">
          {t('common:appName')}
        </p>
        <span aria-hidden="true" className="h-0.5 w-24 overflow-hidden rounded-full bg-primary-200">
          <span className="block h-full w-1/2 animate-loading-bar rounded-full bg-primary-500" />
        </span>
      </div>
    </div>
  );
}