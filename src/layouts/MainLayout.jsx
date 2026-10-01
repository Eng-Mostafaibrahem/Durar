import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CartDrawer } from '../features/cart/components/CartDrawer.jsx';
import { Navbar } from './components/NavBar.jsx';
import { Footer } from './components/Footer.jsx';

export function MainLayout() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-dvh flex-col bg-bg-main">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:start-3 focus:z-200 focus:rounded-full focus:bg-primary-500 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        {t('nav:skipToContent')}
      </a>

      <Navbar />

      <main id="main" className="flex-1">
        <Outlet />
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
}