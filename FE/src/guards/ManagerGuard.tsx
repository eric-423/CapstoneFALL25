'use client';

import { LoadingSpinner } from '@/components/common/loading-spinner';
import { config } from '@/utils/configs/app';
import { useAuth } from '@/utils/hooks';

import { FC, PropsWithChildren, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ManagerGuard: FC<PropsWithChildren> = ({ children }) => {
  const { isLoading, user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace(config.routes.login);
      } else if (user && user.role !== 'Manager') {
        router.replace(config.routes.home);
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) return <LoadingSpinner />;

  if (!isAuthenticated || (user && user.role !== 'Manager')) {
    return null; // Let useEffect handle navigation
  }

  return <>{children}</>;
};

export default ManagerGuard; 