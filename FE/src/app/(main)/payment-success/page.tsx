'use client';

import { useCart } from '@/utils/contexts/cart/CartContext';
import useScrollTop from '@/utils/hooks/useScrollTop';
import { removeCookie } from '@/utils/cookies.client';

import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

import { PaymentResultContent } from '@/app/components/payment/payment-result-content';

export default function PaymentSuccessPage() {
    useScrollTop();
    const { clearCart } = useCart();
    const hasClearedCart = useRef(false);
    const searchParams = useSearchParams();
    const orderCode = searchParams.get('orderCode');

    useEffect(() => {
        if (!hasClearedCart.current) {
            clearCart();
            hasClearedCart.current = true;
        }

        return () => {
            removeCookie('is_paying');
        };
    }, [clearCart]);

    return <PaymentResultContent isSuccess={true} orderCode={orderCode} />;
}
