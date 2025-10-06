'use client';

import { GuestGuard } from '@/components/guards/GuestGuard';
import { ReactNode } from 'react';

interface GuestLayoutProps {
    children: ReactNode;
}

/**
 * Layout template cho các pages chỉ dành cho guest (login, register)
 */
export function GuestLayout({ children }: GuestLayoutProps) {
    return (
        <GuestGuard>
            {children}
        </GuestGuard>
    );
}