import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { toastStore } from './toastStore.js';
import { getErrorKey, shouldToast } from './errorMessage.js';

function reportError(error) {
  if (!shouldToast(error)) return;

  const key = getErrorKey(error);

  if (!key) return;

  toastStore.push({ type: 'error', messageKey: key, duration: 6000 });
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: reportError }),
  mutationCache: new MutationCache({ onError: reportError }),
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (error?.status === 401 || error?.status === 403 || error?.status === 404) return false;
        return failureCount < 2;
      },
    },
    mutations: {
      retry: false,
    },
  },
});
