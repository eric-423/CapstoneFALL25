import DifyChatbot from '@/components/common/DifyChatbot';

export default function OrderTableLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <div className="min-h-screen">
                {children}
            </div>
            <DifyChatbot />
        </>
    );
}
