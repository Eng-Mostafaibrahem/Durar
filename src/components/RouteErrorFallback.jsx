import { useTranslation } from 'react-i18next';
import { HiExclamationTriangle, HiArrowPath } from 'react-icons/hi2';
import { Button } from './ui/Button.jsx';

export function RouteErrorFallback({ error, reset }) {
  const { t } = useTranslation();

  return (
    <div className="container-page flex min-h-[50dvh] flex-col items-center justify-center gap-5 py-20 text-center">
      <span className="grid size-16 place-items-center rounded-full bg-error-100 text-error-500">
        <HiExclamationTriangle aria-hidden="true" className="size-8" />
      </span>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl text-base-dark">{t('common:states.error')}</h1>
        <p className="max-w-md text-sm text-hue-500">{t('errors:generic')}</p>
        {import.meta.env.DEV && error?.message && (
          <pre className="mt-2 max-w-2xl overflow-auto rounded-lg bg-hue-100 p-3 text-start text-xs text-error-500">
            {error.message}
          </pre>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button onClick={reset} variant="primary">
          <HiArrowPath aria-hidden="true" className="size-4 rtl:rotate-180" />
          {t('common:actions.retry')}
        </Button>
        <Button onClick={() => window.location.assign('/')} variant="ghost">
          {t('pages:notFound.backHome')}
        </Button>
      </div>
    </div>
  );
}
