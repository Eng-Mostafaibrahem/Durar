import { QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { queryClient } from '../lib/queryClient.js';
import { AppRouter } from './router.jsx';
import { ToastProvider } from '../components/feedback/ToastProvider.jsx';
import { AuthProvider } from '../features/auth/context/AuthProvider.jsx';
import { FavoritesProvider } from '../features/favorites/context/FavoritesProvider.jsx';
import { CartDrawerProvider } from '../features/cart/context/CartDrawerProvider.jsx';
import { onUnauthorized } from '../lib/apiClient.js';
import { paths } from '../lib/paths.js';

export function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <BrowserRouter>
            <AuthProvider>
              <FavoritesProvider>
                <CartDrawerProvider>
                  <AppRouter unauthorizedRedirect={paths.login} onUnauthorized={onUnauthorized} />
                </CartDrawerProvider>
              </FavoritesProvider>
            </AuthProvider>
          </BrowserRouter>
        </ToastProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}
