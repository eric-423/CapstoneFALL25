'use client';

import { LoadingSpinner } from '@/components/common/loading-spinner';
import { config } from '@/configs/app';
import { useAuth } from '@/hooks';
import { Role } from '@/utils/enum';

import { FC, PropsWithChildren, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// CustomerGuard is component that will be used to protect routes
// that should only be accessed by customer users.

const CustomerGuard: FC<PropsWithChildren> = ({ children }) => {
  const { isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user && !Role.USER.includes(user.role)) {
      router.replace(config.routes.login);
    }
  }, [isLoading, user, router]);

  if (isLoading) return <LoadingSpinner />;

  if (!user || !Role.USER.includes(user.role)) {
    return null; // Let useEffect handle navigation
  }

  return <>{children}</>;
};

export default CustomerGuard;
