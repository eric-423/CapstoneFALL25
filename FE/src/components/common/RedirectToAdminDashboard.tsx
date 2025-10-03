'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const RedirectToAdminDashboard = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/dashboard');
  }, [router]);

  return null; // No UI needed during redirect
};

export default RedirectToAdminDashboard; 