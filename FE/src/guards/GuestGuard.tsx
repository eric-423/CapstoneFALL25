'use client';

import { LoadingSpinner } from '@/components/common/loading-spinner';
import configs from '@/utils/configs';
import { useAuth } from '@/utils/hooks';
import { getAccessToken } from '@/utils/cookies.client';

import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const GuestGuard: FC<PropsWithChildren> = ({ children }) => {
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const timer = setTimeout(() => {
        const token = getAccessToken();
        if (token && isAuthenticated) {
          setShouldRedirect(true);
        }
      }, 100);

      return () => clearTimeout(timer);
    } else {
      setShouldRedirect(false);
    }
  }, [isLoading, isAuthenticated]);

  useEffect(() => {
    if (shouldRedirect) {
      router.replace(configs.routes.home);
    }
  }, [shouldRedirect, router]);

  if (isLoading) return <LoadingSpinner />;

  if (shouldRedirect) {
    return null;
  }

  return <>{children}</>;
};

export default GuestGuard;
