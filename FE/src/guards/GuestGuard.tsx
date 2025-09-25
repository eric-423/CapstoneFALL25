import { LoadingSpinner } from '@/components/common/loading-spinner';
import configs from '@/configs';
import { useAuth } from '@/hooks';

import { FC, PropsWithChildren } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
// GuestGuard is a component that will be used to protect routes
// that should only be accessed by unauthenticated users.
const GuestGuard: FC<PropsWithChildren> = () => {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) return <LoadingSpinner />;

  if (isAuthenticated) return <Navigate to={configs.routes.home} replace />;

  return <Outlet />;
};

export default GuestGuard;
