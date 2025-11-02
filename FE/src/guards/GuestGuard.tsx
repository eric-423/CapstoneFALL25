'use client';

import { LoadingSpinner } from '@/components/common/loading-spinner';
import configs from '@/utils/configs';
import { useAuth } from '@/utils/hooks';

import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// GuestGuard is a component that will be used to protect routes
// that should only be accessed by unauthenticated users.
const GuestGuard: FC<PropsWithChildren> = ({ children }) => {
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    // Only redirect if truly authenticated and not in the middle of logout
    if (!isLoading && isAuthenticated) {
      // Small delay to ensure logout state has propagated
      const timer = setTimeout(() => {
        // Double-check authentication after delay
        const token = localStorage.getItem('access_token');
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
    return null; // Let useEffect handle navigation
  }

  return <>{children}</>;
};

export default GuestGuard;
