'use client';

import { LoadingSpinner } from '@/components/common/loading-spinner';
import configs from '@/utils/configs';
import { useAuth } from '@/utils/hooks';
import { getCookie } from '@/utils/cookies';

import { FC, PropsWithChildren, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const PaymentGuard: FC<PropsWithChildren> = ({ children }) => {
  const isPaying = getCookie('is_paying') === true;
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isPaying)) {
      router.replace(configs.routes.home);
    }
  }, [isLoading, isAuthenticated, isPaying, router]);

  if (isLoading) return <LoadingSpinner />;

  if (!isAuthenticated || !isPaying) {
    return null; // Let useEffect handle navigation
  }

  return <>{children}</>;
};

export default PaymentGuard;
