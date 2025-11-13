'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

import type { UserAuthData } from '@/utils/types/user.type';

type AuthState = {
  user: UserAuthData | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isInitialized: false,
};

const useAuth = () => {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>(initialState);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log('[useAuth] /api/auth/me failed:', response.status, errorData);

        setAuthState({
          user: null,
          isAuthenticated: false,
          isInitialized: true,
        });
        return;
      }

      const data = await response.json();

      const userData: UserAuthData = {
        id: data.id,
        phoneNumber: data.phoneNumber,
        fullName: data.fullName,
        role: data.role,
        isNewUser: data.isNewUser,
      };

      setAuthState({
        user: userData,
        isAuthenticated: true,
        isInitialized: true,
      });
    } catch (error) {
      console.error('[useAuth] Failed to fetch current user:', error);
      setAuthState({
        user: null,
        isAuthenticated: false,
        isInitialized: true,
      });
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      try {
        localStorage.clear();
      } catch (error) {
        console.error('Failed to clear localStorage during logout:', error);
      }

      try {
        sessionStorage.clear();
      } catch (error) {
        console.error('Failed to clear sessionStorage during logout:', error);
      }

      setAuthState({
        user: null,
        isAuthenticated: false,
        isInitialized: true,
      });

      router.push('/login');
    }
  }, [router]);

  const redirectAfterLogin = useCallback(
    (userRole: string) => {
      fetchCurrentUser();

      const searchParams = new URLSearchParams(window.location.search);
      const callbackUrl = searchParams.get('callbackUrl');

      if (callbackUrl) {
        router.push(callbackUrl);
        return;
      }

      switch (userRole.toUpperCase()) {
        case 'ADMIN':
          router.push('/admin');
          break;
        case 'MANAGER':
        case 'BRANCH_MANAGER':
          router.push('/manager');
          break;
        case 'CHEF':
          router.push('/chef');
          break;
        case 'WAITER':
          router.push('/waiter');
          break;
        case 'SHIPPER':
          router.push('/shipper');
          break;
        case 'CUSTOMER':
          router.push('/');
          break;
        default:
          router.push('/');
          break;
      }
    },
    [fetchCurrentUser, router],
  );

  return useMemo(
    () => ({
      user: authState.user,
      isAuthenticated: authState.isAuthenticated,
      isLoading: !authState.isInitialized,
      logout,
      redirectAfterLogin,
      refresh: fetchCurrentUser,
    }),
    [authState.user, authState.isAuthenticated, authState.isInitialized, logout, redirectAfterLogin, fetchCurrentUser],
  );
};

export default useAuth;