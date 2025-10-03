import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Thanh toán | Tấm Tắc',
    description: 'Xác nhận đơn hàng và thanh toán nhanh chóng, tiện lợi tại Tấm Tắc. Hỗ trợ nhiều phương thức thanh toán an toàn.',
    keywords: ['thanh toán', 'đặt hàng', 'checkout', 'Tấm Tắc'],
    openGraph: {
        title: 'Thanh toán | Tấm Tắc',
        description: 'Xác nhận đơn hàng và thanh toán nhanh chóng, tiện lợi tại Tấm Tắc',
        url: '/checkout',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Thanh toán | Tấm Tắc',
        description: 'Xác nhận đơn hàng và thanh toán nhanh chóng, tiện lợi tại Tấm Tắc',
    },
};

export default function CheckoutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}