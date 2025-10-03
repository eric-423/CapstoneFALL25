'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const RedirectToDashboard = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/manager/dashboard');
  }, [router]);

  return null; // No UI needed during redirect
};

export default RedirectToDashboard; 