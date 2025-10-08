import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Thanh toán thành công | Tấm Tắc',
    description: 'Đơn hàng của bạn đã được thanh toán thành công. Cảm ơn bạn đã tin tưởng Tấm Tắc!',
    keywords: ['thanh toán thành công', 'đặt hàng', 'Tấm Tắc'],
    openGraph: {
        title: 'Thanh toán thành công | Tấm Tắc',
        description: 'Đơn hàng của bạn đã được thanh toán thành công',
        url: '/payment-success',
        type: 'website',
    },
    robots: 'noindex, nofollow', // Payment result pages should not be indexed
};

export default function PaymentSuccessLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}