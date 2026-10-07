import { Link, Outlet } from 'react-router-dom';
import { Container } from '../components/Container.jsx';
import { Logo } from '../components/Logo.jsx';
import { LanguageSwitcher } from '../components/LanguageSwitcher.jsx';
import { paths } from '../lib/paths.js';

export function AuthLayout() {
  return (
    <div className="flex min-h-dvh flex-col bg-bg-secondary">
      <Container className="flex h-20 items-center justify-between">
        <Link to={paths.home} className="flex items-center gap-2">
          <Logo className="h-20 w-auto" />
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
