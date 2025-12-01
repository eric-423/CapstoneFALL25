'use client';

import React from 'react';
import { AdminPageLayout, AdminPageHeader } from '../components/AdminPageLayout';
import { useBodyScrollLock } from '../components/useBodyScrollLock';
import { ScheduleManagement } from '@/components/common/schedule/ScheduleManagement';

export default function SchedulePage() {
    return (
        <ScheduleManagement
            AdminPageLayout={AdminPageLayout}
            AdminPageHeader={AdminPageHeader}
            useBodyScrollLock={useBodyScrollLock}
        />
    );
}

