'use client';

import { LoadingSpinner } from '@/components/common/loading-spinner';
import { config } from '@/utils/configs/app';
import { useAuth } from '@/utils/hooks';

import { type FC, type PropsWithChildren, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const AuthGuard: FC<PropsWithChildren> = ({ children }) => {
  const { isLoading, isAuthenticated } = useAuth();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const router = useRouter();

  console.log('AuthGuard rendered', { isLoading, isAuthenticated });
  // Add a small delay before redirecting to prevent flickering
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Wait a short moment to ensure the auth state is stable
      const timer = setTimeout(() => {
        setShouldRedirect(true);
        router.replace(config.routes.login);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <>
        <div className='min-h-screen fixed inset-0 flex items-center justify-center z-50'>
          <div className='flex flex-col items-center justify-center space-y-4'>
            <LoadingSpinner />
          </div>
        </div>
      </>
    );
  }

  if (shouldRedirect || !isAuthenticated) {
    return null; // Let useEffect handle navigation
  }

  return <>{children}</>;
};

export default AuthGuard;
