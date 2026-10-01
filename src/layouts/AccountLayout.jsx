import { NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container } from '../components/Container.jsx';
import { paths } from '../lib/paths.js';
import { useAuth } from '../features/auth/hooks/useAuth.js';
import { Button } from '../components/ui/Button.jsx';

const ITEMS = [
  { to: paths.account, labelKey: 'account:profile', end: true },
  { to: paths.accountOrders, labelKey: 'account:orders' },
  { to: paths.accountBids, labelKey: 'account:bids' },
  { to: paths.favorites, labelKey: 'account:favorites' },
];

export function AccountLayout() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-dvh bg-bg-secondary">
      <Container className="flex flex-col gap-8 py-10 lg:flex-row">
        <aside className="lg:w-64">
          <div className="rounded-xl border border-border-100 bg-white p-5">
            <p className="font-display text-lg text-base-dark">
              {user?.name || t('account:title')}
            </p>
            {user?.email && <p className="mt-1 text-xs text-hue-500">{user.email}</p>}

            <nav aria-label={t('account:title')} className="mt-4">
              <ul className="flex flex-col gap-1">
                {ITEMS.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.end}
                      className={({ isActive }) =>
                        `block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-primary-100 text-primary-700'
                            : 'text-base-dark hover:bg-hue-100'
                        }`
                      }
                    >
                      {t(item.labelKey)}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            <Button onClick={logout} variant="ghost" size="sm" className="mt-4 w-full">
              {t('auth:logout')}
            </Button>
          </div>
        </aside>

        <main id="main" className="flex-1">
          <Outlet />
        </main>
      </Container>
    </div>
  );
}
