import { LoadingSpinner } from '@/components/common/loading-spinner';
import { config } from '@/configs/app';
import { useAuth } from '@/hooks';

import { FC, PropsWithChildren } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ManagerGuard: FC<PropsWithChildren> = () => {
  const { isLoading, user, isAuthenticated } = useAuth();

  if (isLoading) return <LoadingSpinner />;

  if (!isAuthenticated) return <Navigate to={config.routes.login} replace />;

  if (user && user.role !== 'Manager') {
    return <Navigate to={config.routes.home} replace />;
  }

  return <Outlet />;
};

export default ManagerGuard; 