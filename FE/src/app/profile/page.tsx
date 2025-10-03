'use client';

import { CustomerGuard } from '@/guards';
import ProfileContent from '@/app/components/profile/profile-content';

export default function ProfilePage() {
    return (
        <CustomerGuard>
            <ProfileContent />
        </CustomerGuard>
    );
}