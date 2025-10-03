import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Thực đơn',
    description: 'Khám phá thực đơn đa dạng của Tấm Tắc với các món cơm tấm thơm ngon, giá cả phải chăng. Đặt món online ngay hôm nay!',
    keywords: ['thực đơn', 'cơm tấm', 'đặt món online', 'menu', 'Tấm Tắc', 'đồ ăn'],
    openGraph: {
        title: 'Thực đơn | Tấm Tắc',
        description: 'Khám phá thực đơn đa dạng của Tấm Tắc với các món cơm tấm thơm ngon',
        url: '/menu',
        images: [
            {
                url: '/images/menu-og.jpg',
                width: 1200,
                height: 630,
                alt: 'Thực đơn Tấm Tắc',
            },
        ],
    },
};

export default function MenuPage() {
    // This will be migrated from src/pages/Menu
    return (
        <div>
            <h1>Menu Page - Will be migrated</h1>
        </div>
    );
}
