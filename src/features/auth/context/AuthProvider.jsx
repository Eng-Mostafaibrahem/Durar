import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { tokenStore } from '../../../lib/tokenStore.js';
import { queryKeys } from '../../../lib/queryKeys.js';
import { AuthContext } from './authContext.js';
import {
  extractToken,
  fetchMe,
  loginRequest,
  logoutRequest,
  registerRequest,
} from '../api/auth.js';

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [tokenVersion, setTokenVersion] = useState(0);
  const hasToken = Boolean(tokenStore.get());

  useEffect(() => tokenStore.subscribe(() => setTokenVersion((version) => version + 1)), []);

  const { data: user, isPending } = useQuery({
    queryKey: queryKeys.me,
    queryFn: fetchMe,
    enabled: hasToken,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const beginSession = useCallback(
    async (request) => {
      const result = await request();
      tokenStore.set(extractToken(result));

      await queryClient.invalidateQueries({ queryKey: queryKeys.me });

      return result?.user ?? null;
    },
    [queryClient],
  );

  const login = useCallback(
    (credentials) => beginSession(() => loginRequest(credentials)),
    [beginSession],
  );

  const register = useCallback(
    (payload) => beginSession(() => registerRequest(payload)),
    [beginSession],
  );

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } catch {
      /* the local session is cleared regardless */
    }

    tokenStore.clear();
    queryClient.clear();
  }, [queryClient]);

  const value = useMemo(
    () => ({
      user: user ?? null,
      isAuthenticated: Boolean(user),
      isReady: !hasToken || !isPending,
      login,
      register,
      logout,
    }),
    // tokenVersion is read for its reactive side effect (re-running the memo
    // when a session starts/ends) and is intentionally part of the deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, hasToken, isPending, login, register, logout, tokenVersion],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
