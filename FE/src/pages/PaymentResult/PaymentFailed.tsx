import useDocumentTitle from '@/hooks/useDocumentTitle';
import useScrollTop from '@/hooks/useScrollTop';
import { removeCookie } from '@/utils/cookies';

import { useEffect } from 'react';

import { PaymentResultContent } from './PaymentResult';

export default function PaymentFailed() {
  useDocumentTitle('Tấm Tắc | Kết quả thanh toán');
  useScrollTop();
  useEffect(() => {
    return () => {
      removeCookie('is_paying');
    };
  });
  return <PaymentResultContent isSuccess={false} />;
}
