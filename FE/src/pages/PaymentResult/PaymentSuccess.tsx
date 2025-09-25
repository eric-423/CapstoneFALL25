import { useCart } from '@/contexts/cart/CartContext';
import useDocumentTitle from '@/hooks/useDocumentTitle';
import useScrollTop from '@/hooks/useScrollTop';
import { removeCookie } from '@/utils/cookies';

import { useEffect } from 'react';

import { PaymentResultContent } from './PaymentResult';

export default function PaymentSuccess() {
  useDocumentTitle('Tấm Tắc | Kết quả thanh toán');
  useScrollTop();
  const { clearCart } = useCart();
  useEffect(() => {
    return () => {
      removeCookie('is_paying');
      clearCart();
    };
  }, []);
  return <PaymentResultContent isSuccess={true} />;
}
