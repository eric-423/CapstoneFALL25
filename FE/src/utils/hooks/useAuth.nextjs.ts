'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

import type { UserAuthData } from '@/utils/types/user.type';
import { removeToken, removeAccessToken, removeRefreshToken, removeUserRole, removeAuthToken } from '@/utils/cookies';

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
    // Lưu role hiện tại trước khi reset state để xác định redirect path
    const currentRole = authState.user?.role?.toUpperCase();
    const isEmployee = currentRole && ['ADMIN', 'MANAGER', 'BRANCH_MANAGER', 'CHEF', 'WAITER', 'SHIPPER'].includes(currentRole);
    const redirectPath = isEmployee ? '/inside/login' : '/login';

    try {
      // Gọi API logout để clear cookies ở server
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('[useAuth] Logout API failed:', error);
      // Tiếp tục clear ở client dù API có lỗi
    }

    // Clear tất cả cookies ở client
    try {
      removeToken();
      removeAccessToken();
      removeRefreshToken();
      removeUserRole();
      removeAuthToken();

      // Clear cookie 'role' và các cookie khác nếu có
      if (typeof document !== 'undefined') {
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
        document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
        document.cookie = 'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
        document.cookie = 'userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
        document.cookie = 'role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
      }
    } catch (error) {
      console.error('[useAuth] Failed to clear cookies during logout:', error);
    }

    // Clear localStorage và sessionStorage
    try {
      // Lưu lại một số giá trị cần thiết trước khi clear (nếu có)
      const insideRememberedEmail = localStorage.getItem('insideRememberedEmail');
      const insideRememberMe = localStorage.getItem('insideRememberMe');

      localStorage.clear();

      // Khôi phục lại giá trị cần thiết (nếu có)
      if (insideRememberedEmail && insideRememberMe === 'true') {
        localStorage.setItem('insideRememberedEmail', insideRememberedEmail);
        localStorage.setItem('insideRememberMe', 'true');
      }
    } catch (error) {
      console.error('[useAuth] Failed to clear localStorage during logout:', error);
    }

    try {
      sessionStorage.clear();
    } catch (error) {
      console.error('[useAuth] Failed to clear sessionStorage during logout:', error);
    }

    // Reset auth state
    setAuthState({
      user: null,
      isAuthenticated: false,
      isInitialized: true,
    });

    // Sử dụng window.location.href để đảm bảo reload hoàn toàn và clear tất cả state
    if (typeof window !== 'undefined') {
      window.location.href = redirectPath;
    } else {
      router.push(redirectPath);
    }
  }, [router, authState.user?.role]);

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
          // router.push('/manager');

          router.push('/admin');

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