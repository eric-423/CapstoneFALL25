import { LoadingSpinner } from '@/components/common/loading-spinner';
import { config } from '@/configs/app';
import { useAuth } from '@/hooks';
import { Role } from '@/utils/enum';

import { FC, PropsWithChildren } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// AuthGuard is component that will be used to protect routes
// that should only be accessed by authenticated users.

const CustomerGuard: FC<PropsWithChildren> = () => {
  const { isLoading, user } = useAuth();

  if (isLoading) return <LoadingSpinner />;

  if (user && !Role.USER.includes(user.role)) return <Navigate to={config.routes.login} replace />;

  return <Outlet />;
};

export default CustomerGuard;
