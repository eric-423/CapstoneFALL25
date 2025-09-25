import { LoadingSpinner } from '@/components/common/loading-spinner';
import configs from '@/configs';
import { useCart } from '@/contexts/cart/CartContext';
import { useAuth } from '@/hooks';

import { FC, PropsWithChildren } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const OrderGuard: FC<PropsWithChildren> = () => {
  const { getTotalItems, isLoading: isCartLoading } = useCart();
  const { isAuthenticated, isLoading } = useAuth();

  if (isCartLoading || isLoading) return <LoadingSpinner />;

  if (!isAuthenticated || getTotalItems() <= 0) return <Navigate to={configs.routes.login} replace />;

  return <Outlet />;
};
export default OrderGuard;
