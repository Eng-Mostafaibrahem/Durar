import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HiKey } from 'react-icons/hi2';
import { Seo } from '../../../components/Seo.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { AuthCard } from '../components/AuthCard.jsx';
import { paths } from '../../../lib/paths.js';

/**
 * No /auth/reset-password endpoint exists yet (see AGENTS.md §8). Reset
 * links are issued by the team; this page explains expired/invalid links.
 */
export default function ResetPasswordPage() {
  const { t } = useTranslation();

  return (
    <>
      <Seo title={t('auth:resetPassword.title')} />

      <AuthCard
        title={t('auth:resetPassword.title')}
        subtitle={t('auth:resetPassword.subtitle')}
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
          <span className="grid size-14 place-items-center rounded-2xl bg-warning-100 text-warning-500">
            <HiKey aria-hidden="true" className="size-7" />
          </span>
          <p className="max-w-sm text-sm leading-6 text-hue-500">
            {t('auth:resetPassword.invalid')}
          </p>
          <Button to={paths.contact} variant="outline" className="mt-1 w-full">
            {t('auth:resetPassword.contact')}
          </Button>
        </div>
      </AuthCard>
    </>
  );
}
