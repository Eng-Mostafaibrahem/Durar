import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth.js';
import { Spinner } from '../components/ui/Spinner.jsx';

/**
 * Login is only required at checkout submission and bid placement; browsing
 * and adding to cart stay public.
 */
export function ProtectedRoute({ children, redirectTo = '/login' }) {
  const { isAuthenticated, isReady } = useAuth();
  const location = useLocation();

  if (!isReady) {
    return (
      <div className="grid min-h-[60dvh] place-items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    const returnTo = `${location.pathname}${location.search}`;
    return <Navigate to={`${redirectTo}?returnTo=${encodeURIComponent(returnTo)}`} replace />;
  }

  return children;
}
