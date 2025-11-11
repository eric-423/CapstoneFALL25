'use client';

import { refetchToken } from '@/apis/user.api';
import configs from '@/utils/configs';
import type { UserAuthData } from '@/utils/types/user.type';

import {
    getCookie,
    removeAccessToken,
    removeRefreshToken,
    setUserRole,
    setAuthToken,
    removeUserRole,
    removeAuthToken
} from '@/utils/cookies';

import JwtDecode from '@/utils/jwtDecode';
import { useRouter } from 'next/navigation';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useMutation } from '@tanstack/react-query';

const useAuth = () => {
    const router = useRouter();


    const [authState, setAuthState] = useState<{
        user: UserAuthData | null;
        isAuthenticated: boolean;
        isInitialized: boolean;
    }>({
        user: null,
        isAuthenticated: false,
        isInitialized: false,
    });


    const lastTokenRef = useRef<string | null>(null);


    const [cookies] = useCookies([configs.cookies.accessToken, configs.cookies.refreshToken]);
    const accessToken = (typeof window !== 'undefined' ? localStorage.getItem('access_token') : null) || cookies[configs.cookies.accessToken];
    const refreshToken = cookies[configs.cookies.refreshToken];



    const isMountedRef = useRef(true);

    const { mutate: refreshTokenMutation } = useMutation({
        mutationFn: () => refetchToken(refreshToken),
        onSuccess: (data) => {
            if (!isMountedRef.current) return;

            if (data?.data.access_token) {
                const decodedData = JwtDecode(data.data.access_token);
                const userData: UserAuthData = {
                    id: decodedData.id,
                    phoneNumber: decodedData.phoneNumber,
                    role: decodedData.role,
                    isNewUser: getCookie(configs.cookies.isNew) === 'true',
                };

                setAuthState((prev) => ({
                    ...prev,
                    user: userData,
                    isAuthenticated: true,
                }));

                setAuthToken(data.data.access_token);
                setUserRole(userData.role);
            }
        },
        onError: (error) => {
            if (!isMountedRef.current) return;
            console.error('Token refresh failed:', error);
            removeAccessToken();
            removeRefreshToken();
            removeAuthToken();
            removeUserRole();

            setAuthState((prev) => ({
                ...prev,
                user: null,
                isAuthenticated: false,
            }));

            router.refresh();
        },
    });

    const processToken = useCallback(
        (token: string | undefined) => {
            if (!token) {
                setAuthState((prev) => ({
                    ...prev,
                    user: null,
                    isAuthenticated: false,
                    isInitialized: true,
                }));
                return;
            }

            try {
                const decodedToken = JwtDecode(token);

                if (!decodedToken || decodedToken.exp < Date.now() / 1000) {
                    if (refreshToken) {
                        refreshTokenMutation();
                    } else {
                        setAuthState((prev) => ({
                            ...prev,
                            user: null,
                            isAuthenticated: false,
                            isInitialized: true,
                        }));
                    }
                    return;
                }

                const userData: UserAuthData = {
                    id: decodedToken.id,
                    phoneNumber: decodedToken.phoneNumber,
                    role: decodedToken.role,
                    isNewUser: getCookie(configs.cookies.isNew) === 'true',
                };

                setAuthState((prev) => ({
                    ...prev,
                    user: userData,
                    isAuthenticated: true,
                    isInitialized: true,
                }));

                if (token) {
                    setAuthToken(token);
                    setUserRole(userData.role);
                }
            } catch (error) {
                console.error('Error processing token:', error);
                setAuthState((prev) => ({
                    ...prev,
                    user: null,
                    isAuthenticated: false,
                    isInitialized: true,
                }));
            }
        },
        [refreshToken, refreshTokenMutation],
    );

    useEffect(() => {
        if (lastTokenRef.current === accessToken) return;

        lastTokenRef.current = accessToken;
        processToken(accessToken);
    }, [accessToken, processToken]);

    useEffect(() => {
        if (!authState.isAuthenticated || !accessToken) return;

        const checkTokenExpiration = () => {
            try {
                const decodedToken = JwtDecode(accessToken);

                const willExpireSoon = decodedToken && decodedToken.exp < Date.now() / 1000 + 60;

                if (willExpireSoon && refreshToken) {
                    refreshTokenMutation();
                }
            } catch (error) {
                console.error('Error checking token expiration:', error);
            }
        };

        const intervalId = setInterval(checkTokenExpiration, 30000);

        return () => clearInterval(intervalId);
    }, [accessToken, refreshToken, authState.isAuthenticated, refreshTokenMutation]);

    useEffect(() => {
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    const logout = useCallback(() => {
        const currentUserRole = authState.user?.role;

        localStorage.clear();

        removeAccessToken();
        removeRefreshToken();
        removeAuthToken();
        removeUserRole();

        if (typeof document !== 'undefined') {
            document.cookie.split(';').forEach((c) => {
                document.cookie = c
                    .replace(/^ +/, '')
                    .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
            });
        }

        setAuthState({
            user: null,
            isAuthenticated: false,
            isInitialized: true,
        });

        lastTokenRef.current = null;

        if (currentUserRole && currentUserRole !== 'CUSTOMER') {
            router.push('/inside/login');
        } else {
            router.push('/login');
        }
    }, [authState.user?.role, router]);

    const redirectAfterLogin = useCallback((userRole: string) => {
        const searchParams = new URLSearchParams(window.location.search);
        const callbackUrl = searchParams.get('callbackUrl');

        if (callbackUrl) {
            router.push(callbackUrl);
        } else {

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
        }
    }, [router]);

    return useMemo(
        () => ({
            user: authState.user,
            isAuthenticated: authState.isAuthenticated,
            isLoading: !authState.isInitialized,
            logout,
            redirectAfterLogin,
        }),
        [authState.user, authState.isAuthenticated, authState.isInitialized, logout, redirectAfterLogin],
    );
};

export default useAuth;