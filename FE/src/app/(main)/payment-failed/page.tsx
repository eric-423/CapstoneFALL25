'use client';

import useScrollTop from '@/utils/hooks/useScrollTop';
import { removeCookie } from '@/utils/cookies';

import { useEffect } from 'react';

import { PaymentResultContent } from '@/app/components/payment/payment-result-content';

export default function PaymentFailedPage() {
    useScrollTop();

    useEffect(() => {
        return () => {
            removeCookie('is_paying');
        };
    }, []);

    return <PaymentResultContent isSuccess={false} />;
}
