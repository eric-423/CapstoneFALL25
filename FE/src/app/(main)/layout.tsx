import MainLayout from '@/layout/MainLayout/MainLayout';

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
