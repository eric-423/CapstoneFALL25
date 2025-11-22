'use client';

import { useAuthContext } from '@/utils/contexts/AuthContext';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { useNavigation } from '@/utils/hooks/useNavigation';
import { useEffect, useState } from 'react';

interface AuthGuardProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    redirectTo?: string;
}

/**
 * AuthGuard cho Next.js App Router
 * Bảo vệ routes cần authentication
 */
export function AuthGuard({
    children,
    fallback,
    redirectTo = '/login'
}: AuthGuardProps) {
    const { isAuthenticated, isLoading } = useAuthContext();
    const { navigateWithParams } = useNavigation();
    const [shouldRedirect, setShouldRedirect] = useState(false);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            const timer = setTimeout(() => {
                setShouldRedirect(true);
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [isLoading, isAuthenticated]);

    useEffect(() => {
        if (shouldRedirect) {
            const currentPath = window.location.pathname;
            navigateWithParams(redirectTo, { callbackUrl: currentPath }, { replace: true });
        }
    }, [shouldRedirect, redirectTo, navigateWithParams]);

    if (isLoading) {
        return fallback || (
            <div className='min-h-screen fixed inset-0 flex items-center justify-center z-50'>
                <div className='flex flex-col items-center justify-center space-y-4'>
                    <LoadingSpinner />
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null; // Will redirect
    }

    return <>{children}</>;
}