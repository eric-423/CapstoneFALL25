import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Quản trị viên',
    description: 'Khu vực dành cho quản trị viên hệ thống',
    robots: 'noindex, nofollow',
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex">
                {/* Sidebar will be here */}
                <aside className="w-64 bg-white shadow-sm">
                    <div className="p-4">
                        <h2 className="font-semibold text-gray-800">Admin Panel</h2>
                    </div>
                </aside>

                {/* Main content */}
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}