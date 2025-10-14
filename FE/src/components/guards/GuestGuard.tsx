'use client';

import { useAuthContext } from '@/utils/contexts/AuthContext';
import { useNavigation } from '@/utils/hooks/useNavigation';
import { useEffect } from 'react';

interface GuestGuardProps {
    children: React.ReactNode;
    redirectTo?: string;
}

/**
 * GuestGuard cho Next.js App Router
 * Redirect authenticated users away from guest-only pages (login, register)
 */
export function GuestGuard({
    children,
    redirectTo
}: GuestGuardProps) {
    const { isAuthenticated, isLoading, user } = useAuthContext();
    const { navigate } = useNavigation();

    useEffect(() => {
        if (!isLoading && isAuthenticated && user) {
            let defaultRedirect = '/';

            // Redirect based on user role if no specific redirect is provided
            if (!redirectTo) {
                switch (user.role) {
                    case 'ADMIN':
                        defaultRedirect = '/admin';
                        break;
                    case 'MANAGER':
                        defaultRedirect = '/manager';
                        break;
                    default:
                        defaultRedirect = '/';
                        break;
                }
            }

            navigate(redirectTo || defaultRedirect, { replace: true });
        }
    }, [isLoading, isAuthenticated, user, redirectTo, navigate]);

    if (isLoading) {
        return null; // Let the loading state be handled by the page
    }

    if (isAuthenticated) {
        return null; // Will redirect
    }

    return <>{children}</>;
}