'use client';

import { useCart } from '@/utils/contexts/cart/CartContext';
import useScrollTop from '@/utils/hooks/useScrollTop';
import { removeCookie } from '@/utils/cookies.client';

import { useEffect, useRef } from 'react';

import { PaymentResultContent } from '@/app/components/payment/payment-result-content';

export default function PaymentSuccessPage() {
    useScrollTop();
    const { clearCart } = useCart();
    const hasClearedCart = useRef(false);

    useEffect(() => {
        // Xóa giỏ hàng ngay khi vào trang thanh toán thành công
        if (!hasClearedCart.current) {
            clearCart();
            hasClearedCart.current = true;
        }

        return () => {
            removeCookie('is_paying');
        };
    }, [clearCart]);

    return <PaymentResultContent isSuccess={true} />;
}
