'use client';

import { LoadingSpinner } from '@/components/common/loading-spinner';
import { config } from '@/utils/configs/app';
import { useAuth } from '@/utils/hooks';
import { Role } from '@/utils/enum';

import { FC, PropsWithChildren, useEffect } from 'react';
import { useRouter } from 'next/navigation';


const CustomerGuard: FC<PropsWithChildren> = ({ children }) => {
  const { isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user && user.role !== Role.USER) {
      router.replace(config.routes.login);
    }
  }, [isLoading, user, router]);

  if (isLoading) return <LoadingSpinner />;

  if (!user || user.role !== Role.USER) {
    return null;
  }

  return <>{children}</>;
};

export default CustomerGuard;
