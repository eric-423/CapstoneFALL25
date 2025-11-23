'use client';

import { useAuthContext } from '@/utils/contexts/AuthContext';
import { useNavigation } from '@/utils/hooks/useNavigation';
import { useEffect } from 'react';

interface RoleGuardProps {
    children: React.ReactNode;
    allowedRoles: string[];
    fallbackPath?: string;
}

/**
 * RoleGuard cho Next.js App Router
 * Bảo vệ routes dựa trên role của user
 */
export function RoleGuard({
    children,
    allowedRoles,
    fallbackPath = '/403'
}: RoleGuardProps) {
    const { user, isAuthenticated, isLoading } = useAuthContext();
    const { navigate } = useNavigation();

    useEffect(() => {
        if (!isLoading && isAuthenticated && user) {
            const hasPermission = allowedRoles.includes(user.role);

            if (!hasPermission) {
                navigate(fallbackPath, { replace: true });
            }
        }
    }, [isLoading, isAuthenticated, user, allowedRoles, fallbackPath, navigate]);

    if (isLoading) {
        return null; // Let AuthGuard handle loading
    }

    if (!isAuthenticated || !user) {
        return null; // Let AuthGuard handle auth
    }

    const hasPermission = allowedRoles.includes(user.role);

    if (!hasPermission) {
        return null; // Will redirect
    }

    return <>{children}</>;
}

/**
 * AdminGuard - Chỉ cho phép ADMIN
 */
export function AdminGuard({ children }: { children: React.ReactNode }) {
    return (
        <RoleGuard allowedRoles={['ADMIN']}>
            {children}
        </RoleGuard>
    );
}

/**
 * ManagerGuard - Cho phép ADMIN và MANAGER
 */
export function ManagerGuard({ children }: { children: React.ReactNode }) {
    return (
        <RoleGuard allowedRoles={['ADMIN', 'MANAGER']}>
            {children}
        </RoleGuard>
    );
}

/**
 * CustomerGuard - Cho phép CUSTOMER, MANAGER và ADMIN
 */
export function CustomerGuard({ children }: { children: React.ReactNode }) {
    return (
        <RoleGuard allowedRoles={['CUSTOMER', 'MANAGER', 'ADMIN']}>
            {children}
        </RoleGuard>
    );
}

/**
 * ChefGuard - Chỉ cho phép CHEFF
 */
export function ChefGuard({ children }: { children: React.ReactNode }) {
    return (
        <RoleGuard allowedRoles={['CHEFF']}>
            {children}
        </RoleGuard>
    );
}

/**
 * StaffGuard - Chỉ cho phép STAFF
 */
export function StaffGuard({ children }: { children: React.ReactNode }) {
    return (
        <RoleGuard allowedRoles={['STAFF', 'Staff']}>
            {children}
        </RoleGuard>
    );
}