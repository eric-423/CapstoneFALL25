'use client';

import { LoadingSpinner } from '@/components/common/loading-spinner';
import configs from '@/utils/configs';
import { useAuth } from '@/utils/hooks';

import { FC, PropsWithChildren, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// GuestGuard is a component that will be used to protect routes
// that should only be accessed by unauthenticated users.
const GuestGuard: FC<PropsWithChildren> = ({ children }) => {
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(configs.routes.home);
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) return <LoadingSpinner />;

  if (isAuthenticated) {
    return null; // Let useEffect handle navigation
  }

  return <>{children}</>;
};

export default GuestGuard;
