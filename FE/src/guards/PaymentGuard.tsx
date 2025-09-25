import { LoadingSpinner } from '@/components/common/loading-spinner';
import configs from '@/configs';
import { useAuth } from '@/hooks';
import { getCookie } from '@/utils/cookies';

import { FC, PropsWithChildren } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PaymentGuard: FC<PropsWithChildren> = () => {
  const isPaying = getCookie('is_paying') === true;
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;

  if (!isAuthenticated || !isPaying) return <Navigate to={configs.routes.home} replace />;

  return <Outlet />;
};
export default PaymentGuard;
