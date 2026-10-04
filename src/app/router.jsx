import { Suspense, lazy, useCallback, useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MainLayout } from '../layouts/MainLayout.jsx';
import { AuthLayout } from '../layouts/AuthLayout.jsx';
import { AccountLayout } from '../layouts/AccountLayout.jsx';
import { ProtectedRoute } from './ProtectedRoute.jsx';
import { RouteErrorFallback } from '../components/RouteErrorFallback.jsx';
import { ErrorBoundary } from '../components/ErrorBoundary.jsx';
import { BrandLoader } from '../components/ui/BrandLoader.jsx';
import { paths } from '../lib/paths.js';
import { detectDirection } from '../locales/index.js';

const HomePage = lazy(() => import('../features/home/pages/HomePage.jsx'));
const ShopPage = lazy(() => import('../features/products/pages/ShopPage.jsx'));
const ProductDetailsPage = lazy(() => import('../features/products/pages/ProductDetailsPage.jsx'));
const CategoriesPage = lazy(() => import('../features/categories/pages/CategoriesPage.jsx'));
const CollectionPage = lazy(() => import('../features/categories/pages/CollectionPage.jsx'));
const AuctionsPage = lazy(() => import('../features/auctions/pages/AuctionsPage.jsx'));
const AuctionDetailsPage = lazy(() => import('../features/auctions/pages/AuctionDetailsPage.jsx'));
const OffersPage = lazy(() => import('../features/offers/pages/OffersPage.jsx'));
const FavoritesPage = lazy(() => import('../features/favorites/pages/FavoritesPage.jsx'));
const CartPage = lazy(() => import('../features/cart/pages/CartPage.jsx'));
const CheckoutPage = lazy(() => import('../features/checkout/pages/CheckoutPage.jsx'));
const CheckoutSuccessPage = lazy(
  () => import('../features/checkout/pages/CheckoutSuccessPage.jsx'),
);
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage.jsx'));
const RegisterPage = lazy(() => import('../features/auth/pages/RegisterPage.jsx'));
const ForgotPasswordPage = lazy(() => import('../features/auth/pages/ForgotPasswordPage.jsx'));
const ResetPasswordPage = lazy(() => import('../features/auth/pages/ResetPasswordPage.jsx'));
const AccountPage = lazy(() => import('../features/account/pages/AccountPage.jsx'));
const OrdersPage = lazy(() => import('../features/account/pages/OrdersPage.jsx'));
const OrderDetailsPage = lazy(() => import('../features/orders/pages/OrderDetailsPage.jsx'));
const MyBidsPage = lazy(() => import('../features/account/pages/MyBidsPage.jsx'));
const AboutPage = lazy(() => import('../features/pages/AboutPage.jsx'));
const ContactPage = lazy(() => import('../features/pages/ContactPage.jsx'));
const FaqPage = lazy(() => import('../features/pages/FaqPage.jsx'));
const NotFoundPage = lazy(() => import('../features/pages/NotFoundPage.jsx'));

function RouteFallback() {
  return <BrandLoader />;
}

/** Restores scroll position to the top on every navigation. */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

/**
 * Forces the correct `lang`/`dir` on <html> on every navigation and language
 * change, independent of per-page <Seo> mounts. Pages that render without a
 * Seo (loading / error / empty states, 404) rely on this so nav bar, footer
 * and page content never render in the wrong direction.
 */
function DocumentDirection() {
  const { pathname } = useLocation();
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage || i18n.language || 'ar';

  useEffect(() => {
    const root = document.documentElement;
    root.lang = language;
    root.dir = detectDirection(language);
  }, [pathname, language, i18n]);

  return null;
}

export function AppRouter({ onUnauthorized, unauthorizedRedirect = '/login' }) {
  const navigate = useNavigate();

  const handleUnauthorized = useCallback(
    (returnTo) => {
      navigate(`${unauthorizedRedirect}?returnTo=${encodeURIComponent(returnTo || paths.home)}`, {
        replace: true,
      });
    },
    [navigate, unauthorizedRedirect],
  );

  useEffect(() => {
    if (!onUnauthorized) return undefined;

    return onUnauthorized(handleUnauthorized);
  }, [onUnauthorized, handleUnauthorized]);

  return (
    <ErrorBoundary fallback={RouteErrorFallback}>
      <ScrollToTop />
      <DocumentDirection />

      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<HomePage />} />

            <Route path="shop" element={<ShopPage />} />
            <Route path="shop/:id" element={<ProductDetailsPage />} />
            <Route path="collections" element={<CategoriesPage />} />
            <Route path="collections/:id" element={<CollectionPage />} />

            <Route path="auctions" element={<AuctionsPage />} />
            <Route path="auctions/:id" element={<AuctionDetailsPage />} />
            <Route path="offers" element={<OffersPage />} />
            <Route path="favorites" element={<FavoritesPage />} />
            <Route path="cart" element={<CartPage />} />

            <Route
              path="checkout"
              element={
                <ProtectedRoute redirectTo={unauthorizedRedirect}>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />
            <Route path="checkout/success/:id" element={<CheckoutSuccessPage />} />

            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="faq" element={<FaqPage />} />

            <Route
              path="account"
              element={
                <ProtectedRoute redirectTo={unauthorizedRedirect}>
                  <AccountLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AccountPage />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="orders/:id" element={<OrderDetailsPage />} />
              <Route path="bids" element={<MyBidsPage />} />
            </Route>
          </Route>

          <Route element={<AuthLayout />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            <Route path="reset-password" element={<ResetPasswordPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
