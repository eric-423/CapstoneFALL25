'use client';

import { LoadingSpinner } from '@/components/common/loading-spinner';
import { useAuth } from '@/hooks';
import { useRouter } from 'next/navigation';
import { type FC, type PropsWithChildren, useEffect } from 'react';

interface ClientAuthGuardProps extends PropsWithChildren {
    requireAuth?: boolean;
    allowedRoles?: string[];
    fallbackPath?: string;
}

const ClientAuthGuard: FC<ClientAuthGuardProps> = ({
    children,
    requireAuth = true,
    allowedRoles,
    fallbackPath = '/login'
}) => {
    const { isLoading, isAuthenticated, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;

        // If authentication is required but user is not authenticated
        if (requireAuth && !isAuthenticated) {
            router.push(fallbackPath);
            return;
        }

        // If specific roles are required, check user role
        if (allowedRoles && user && !allowedRoles.includes(user.role)) {
            router.push('/');
            return;
        }

        // If authentication is not required but user is authenticated (guest only routes)
        if (!requireAuth && isAuthenticated) {
            router.push('/');
            return;
        }
    }, [isLoading, isAuthenticated, user, requireAuth, allowedRoles, fallbackPath, router]);

    if (isLoading) {
        return (
            <div className='min-h-screen fixed inset-0 flex items-center justify-center z-50'>
                <div className='flex flex-col items-center justify-center space-y-4'>
                    <LoadingSpinner />
                </div>
            </div>
        );
    }

    // If authentication is required but user is not authenticated, don't render children
    if (requireAuth && !isAuthenticated) {
        return null;
    }

    // If specific roles are required but user doesn't have them, don't render children
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return null;
    }

    // If this is a guest-only route but user is authenticated, don't render children
    if (!requireAuth && isAuthenticated) {
        return null;
    }

    return <>{children}</>;
};

export default ClientAuthGuard;