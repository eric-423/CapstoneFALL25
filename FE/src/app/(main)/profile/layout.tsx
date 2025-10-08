import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Thông tin cá nhân | Tấm Tắc',
    description: 'Quản lý thông tin tài khoản, lịch sử đơn hàng và cài đặt bảo mật của bạn tại Tấm Tắc.',
    keywords: ['hồ sơ cá nhân', 'thông tin tài khoản', 'lịch sử đơn hàng', 'Tấm Tắc'],
    openGraph: {
        title: 'Thông tin cá nhân | Tấm Tắc',
        description: 'Quản lý thông tin tài khoản và lịch sử đơn hàng của bạn',
        url: '/profile',
        type: 'website',
    },
    robots: 'noindex, nofollow', // Profile pages should not be indexed for privacy
};

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}