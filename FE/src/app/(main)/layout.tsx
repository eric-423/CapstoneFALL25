import MainLayout from '@/layout/MainLayout/MainLayout';
import DifyChatbot from '@/components/common/DifyChatbot';

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <MainLayout>{children}</MainLayout>
        </>
    );
}
