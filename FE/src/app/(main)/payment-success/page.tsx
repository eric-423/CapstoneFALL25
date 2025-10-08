'use client';

import { useCart } from '@/contexts/cart/CartContext';
import useScrollTop from '@/hooks/useScrollTop';
import { removeCookie } from '@/utils/cookies';

import { useEffect } from 'react';

import { PaymentResultContent } from '@/app/components/payment/payment-result-content';

export default function PaymentSuccessPage() {
    useScrollTop();
    const { clearCart } = useCart();

    useEffect(() => {
        return () => {
            removeCookie('is_paying');
            clearCart();
        };
    }, [clearCart]);

    return <PaymentResultContent isSuccess={true} />;
}
