'use client';

import { AuthGuard } from '@/components/guards/AuthGuard';
import { ReactNode } from 'react';

interface ProtectedLayoutProps {
    children: ReactNode;
}

/**
 * Layout template cho các pages cần authentication
 * Sử dụng thay vì React Router's Outlet + Guards
 */
export function ProtectedLayout({ children }: ProtectedLayoutProps) {
    return (
        <AuthGuard>
            {children}
        </AuthGuard>
    );
}