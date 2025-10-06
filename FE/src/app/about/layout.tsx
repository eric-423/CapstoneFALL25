import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Về chúng tôi | Tấm Tắc',
    description: 'Tìm hiểu về Tấm Tắc - thương hiệu cơm tấm hiện đại được tạo ra bởi sinh viên, dành cho sinh viên. Câu chuyện thành lập và sứ mệnh của chúng tôi.',
    keywords: ['về chúng tôi', 'Tấm Tắc', 'câu chuyện thương hiệu', 'sinh viên', 'cơm tấm'],
    openGraph: {
        title: 'Về chúng tôi | Tấm Tắc',
        description: 'Tìm hiểu về Tấm Tắc - thương hiệu cơm tấm hiện đại được tạo ra bởi sinh viên',
        url: '/about',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Về chúng tôi | Tấm Tắc',
        description: 'Tìm hiểu về Tấm Tắc - thương hiệu cơm tấm hiện đại được tạo ra bởi sinh viên',
    },
};

export default function AboutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}