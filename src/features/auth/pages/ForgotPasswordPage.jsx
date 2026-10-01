import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HiEnvelope } from 'react-icons/hi2';
import { Seo } from '../../../components/Seo.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { AuthCard } from '../components/AuthCard.jsx';
import { paths } from '../../../lib/paths.js';

/**
 * The current backend contract has no /auth/forgot-password endpoint
 * (see AGENTS.md §8). Password resets are handled by the support team until
 * the endpoint ships — this page guides users to contact instead of hitting
 * a route that does not exist.
 */
export default function ForgotPasswordPage() {
  const { t } = useTranslation();

  return (
    <>
      <Seo title={t('auth:forgotPassword.title')} />

      <AuthCard
        title={t('auth:forgotPassword.title')}
        subtitle={t('auth:forgotPassword.subtitle')}
        actions={
          <Link
            to={paths.login}
            className="font-medium text-primary-500 transition-colors hover:text-primary-700"
          >
            {t('auth:backToLogin')}
          </Link>
        }
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="grid size-14 place-items-center rounded-2xl bg-secondary-100 text-secondary-500">
            <HiEnvelope aria-hidden="true" className="size-7" />
          </span>
          <p className="max-w-sm text-sm leading-6 text-hue-500">{t('auth:forgotPassword.info')}</p>
          <Button to={paths.contact} variant="outline" className="mt-1 w-full">
            {t('auth:forgotPassword.contact')}
          </Button>
        </div>
      </AuthCard>
    </>
  );
}
