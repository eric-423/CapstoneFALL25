import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Về chúng tôi',
    description: 'Tìm hiểu về Tấm Tắc - thương hiệu cơm tấm hiện đại được tạo ra bởi sinh viên, dành cho sinh viên. Câu chuyện thành lập và sứ mệnh của chúng tôi.',
    keywords: ['về chúng tôi', 'Tấm Tắc', 'câu chuyện thương hiệu', 'sinh viên', 'cơm tấm'],
    openGraph: {
        title: 'Về chúng tôi | Tấm Tắc',
        description: 'Tìm hiểu về Tấm Tắc - thương hiệu cơm tấm hiện đại được tạo ra bởi sinh viên',
        url: '/about',
    },
};

export default function AboutPage() {
    // Import the existing About component from pages
    return (
        <div>
            {/* This will be migrated from src/pages/About */}
            <h1>About Page - Will be migrated</h1>
        </div>
    );
}
