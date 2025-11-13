'use client';

import { ChefGuard } from '@/components/guards/RoleGuard';

export default function ChefLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ChefGuard>
            {children}
        </ChefGuard>
    );
}

