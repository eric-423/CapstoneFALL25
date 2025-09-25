'use client';

import { LoadingSpinner } from '@/components/common/loading-spinner';
import { config } from '@/configs/app';
import { useAuth } from '@/hooks';

import { type FC, type PropsWithChildren, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AuthGuard: FC<PropsWithChildren> = () => {
  const { isLoading, isAuthenticated } = useAuth();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  console.log('AuthGuard rendered', { isLoading, isAuthenticated });
  // Add a small delay before redirecting to prevent flickering
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Wait a short moment to ensure the auth state is stable
      const timer = setTimeout(() => {
        setShouldRedirect(true);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isLoading, isAuthenticated]);

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

  if (shouldRedirect) {
    return <Navigate to={config.routes.login} replace />;
  }

  return <Outlet />;
};

export default AuthGuard;
