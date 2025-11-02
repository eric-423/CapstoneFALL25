'use client';

import { useAuthContext } from '@/utils/contexts/AuthContext';
import { useNavigation } from '@/utils/hooks/useNavigation';
import { useEffect, useState } from 'react';

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
    const [shouldRedirect, setShouldRedirect] = useState(false);

    useEffect(() => {
        if (!isLoading && isAuthenticated && user) {
            // Add small delay to ensure logout state has fully propagated
            const timer = setTimeout(() => {
                // Double-check authentication after delay
                const token = localStorage.getItem('access_token');
                if (token && isAuthenticated && user) {
                    setShouldRedirect(true);
                }
            }, 150);

            return () => clearTimeout(timer);
        } else {
            setShouldRedirect(false);
        }
    }, [isLoading, isAuthenticated, user]);

    useEffect(() => {
        if (shouldRedirect && user) {
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
                    case 'CHEF':
                        defaultRedirect = '/chef';
                        break;
                    case 'WAITER':
                        defaultRedirect = '/waiter';
                        break;
                    case 'SHIPPER':
                        defaultRedirect = '/shipper';
                        break;
                    default:
                        defaultRedirect = '/';
                        break;
                }
            }

            navigate(redirectTo || defaultRedirect, { replace: true });
        }
    }, [shouldRedirect, user, redirectTo, navigate]);

    if (isLoading) {
        return null; // Let the loading state be handled by the page
    }

    if (shouldRedirect) {
        return null; // Will redirect
    }

    return <>{children}</>;
}