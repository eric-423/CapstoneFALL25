'use client';

import useScrollTop from '@/hooks/useScrollTop';
import { removeCookie } from '@/utils/cookies';

import { useEffect } from 'react';

import { PaymentResultContent } from '../components/payment/payment-result-content';

export default function PaymentFailedPage() {
    useScrollTop();

    useEffect(() => {
        return () => {
            removeCookie('is_paying');
        };
    }, []);

    return <PaymentResultContent isSuccess={false} />;
}
