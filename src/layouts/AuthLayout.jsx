import { Link, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container } from '../components/Container.jsx';
import { Logo } from '../components/Logo.jsx';
import { LanguageSwitcher } from '../components/LanguageSwitcher.jsx';
import { paths } from '../lib/paths.js';

export function AuthLayout() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-dvh flex-col bg-bg-secondary">
      <Container className="flex h-20 items-center justify-between">
        <Link to={paths.home} className="flex items-center gap-2">
          <Logo />
          <span className="font-display text-xl font-bold text-primary-500">
            {t('common:appName')}
          </span>
        </Link>

        <LanguageSwitcher />
      </Container>

      <main id="main" className="flex flex-1 items-center justify-center px-5 py-10">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
