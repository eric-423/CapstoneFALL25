'use client';

import useScrollTop from '@/utils/hooks/useScrollTop';
import { removeCookie } from '@/utils/cookies.client';
import { useCart } from '@/utils/contexts/cart/CartContext';

import { useEffect, useRef } from 'react';

import { PaymentResultContent } from '@/app/components/payment/payment-result-content';

export default function PaymentFailedPage() {
    useScrollTop();
    const { clearCart } = useCart();
    const hasClearedCart = useRef(false);

    useEffect(() => {
        if (!hasClearedCart.current) {
            clearCart();
            hasClearedCart.current = true;
        }

        return () => {
            removeCookie('is_paying');
        };
    }, [clearCart]);

    return <PaymentResultContent isSuccess={false} />;
}
