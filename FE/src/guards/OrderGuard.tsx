'use client';

import { LoadingSpinner } from '@/components/common/loading-spinner';
import configs from '@/configs';
import { useCart } from '@/contexts/cart/CartContext';
import { useAuth } from '@/hooks';

import { FC, PropsWithChildren, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const OrderGuard: FC<PropsWithChildren> = ({ children }) => {
  const { getTotalItems, isLoading: isCartLoading } = useCart();
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isCartLoading && !isLoading) {
      if (!isAuthenticated || getTotalItems() <= 0) {
        router.replace(configs.routes.login);
      }
    }
  }, [isCartLoading, isLoading, isAuthenticated, getTotalItems, router]);

  if (isCartLoading || isLoading) return <LoadingSpinner />;

  if (!isAuthenticated || getTotalItems() <= 0) {
    return null; // Let useEffect handle navigation
  }

  return <>{children}</>;
};

export default OrderGuard;
