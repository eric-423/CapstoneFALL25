import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Thanh toán thất bại | Tấm Tắc',
    description: 'Thanh toán không thành công. Vui lòng thử lại hoặc liên hệ hỗ trợ.',
    keywords: ['thanh toán thất bại', 'lỗi thanh toán', 'Tấm Tắc'],
    openGraph: {
        title: 'Thanh toán thất bại | Tấm Tắc',
        description: 'Thanh toán không thành công',
        url: '/payment-failed',
        type: 'website',
    },
    robots: 'noindex, nofollow', 
};

export default function PaymentFailedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}