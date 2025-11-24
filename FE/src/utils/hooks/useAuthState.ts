'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

import type { UserAuthData } from '@/utils/types/user.type';
import { removeToken, removeAccessToken, removeRefreshToken, removeUserRole, removeAuthToken } from '@/utils/cookies.client';

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

const useAuthState = () => {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>(initialState);

  const getRoleBasedRoute = useCallback((role: string): string => {
    switch (role.toUpperCase()) {
      case 'ADMIN':
        return '/admin';
      case 'MANAGER':
      case 'BRANCH_MANAGER':
        return '/manager';
      case 'STAFF':
        return '/staff/orders';
      case 'CHEFF':
        return '/chef';
      case 'STAFF':
      case 'WAITER':
        return '/staff/tables';
      case 'SHIPPER':
        return '/shipper';
      case 'CUSTOMER':
        return '/';
      default:
        return '/';
    }
  }, []);

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
    // Only fetch if not already initialized to prevent unnecessary calls
    if (!authState.isInitialized) {
      fetchCurrentUser();
    }
  }, [authState.isInitialized, fetchCurrentUser]);

  useEffect(() => {
    if (!authState.isInitialized || !authState.isAuthenticated || !authState.user) {
      return;
    }

    const currentPath = window.location.pathname;
    const userRole = authState.user.role?.toUpperCase();
    const expectedRoute = getRoleBasedRoute(userRole);

    if (!userRole || !expectedRoute) {
      return;
    }

    const publicRoutes = ['/login', '/register', '/about', '/menu'];
    const allowedRoutes = [
      '/profile',
      '/checkout',
      '/payment-success',
      '/payment-failed',
      '/order-table',
      '/my-orders',
    ];

    const roleBasedRoutes: Record<string, string[]> = {
      ADMIN: ['/admin'],
      MANAGER: ['/admin', '/manager'],
      BRANCH_MANAGER: ['/admin', '/manager'],
      STAFF: ['/staff'],
      CHEFF: ['/chef'],
      STAFF: ['/staff'],
      WAITER: ['/staff'],
      SHIPPER: ['/shipper'],
      CUSTOMER: ['/'],
    };

    const isPublicRoute = publicRoutes.some(route => currentPath === route || currentPath.startsWith(route));
    const isAllowedRoute = allowedRoutes.some(route => currentPath.startsWith(route));
    const roleRoutes = roleBasedRoutes[userRole] || [];
    const isRoleRoute = roleRoutes.some(route => currentPath.startsWith(route));

    if (isPublicRoute || isAllowedRoute || isRoleRoute) {
      return;
    }

    if (currentPath !== expectedRoute && !currentPath.startsWith(expectedRoute)) {
      const timer = setTimeout(() => {
        router.replace(expectedRoute);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [authState.isInitialized, authState.isAuthenticated, authState.user, getRoleBasedRoute, router]);

  const logout = useCallback(async () => {

    const currentRole = authState.user?.role?.toUpperCase();
    const employeeRoles = ['ADMIN', 'MANAGER', 'BRANCH_MANAGER', 'STAFF', 'CHEF', 'CHEFF', 'WAITER', 'SHIPPER'];
    const isEmployee = currentRole && employeeRoles.includes(currentRole);
    const redirectPath = isEmployee ? '/inside/login' : '/login';

    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

    } catch (error) {
      console.error('[useAuth] Logout API failed:', error);
    }


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
          router.push('/manager');
          break;
        case 'STAFF':
        case 'Staff':
          router.push('/staff/orders');
          break;
        case 'CHEFF':
          router.push('/chef');
          break;
        case 'STAFF':
        case 'WAITER':
          router.push('/staff/tables');
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

export default useAuthState;

