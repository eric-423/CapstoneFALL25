
'use client';

import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/utils/contexts/AuthContext';
import { AdminProvider } from '@/utils/contexts/AdminContext';
import { AdminHeader } from './components/AdminHeader';
import { GlobalSearchCommand } from './components/GlobalSearchCommand';
import { GlobalSearchKeyboardHandler } from './components/GlobalSearchKeyboardHandler';
import { BranchesLoader } from './components/BranchesLoader';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    Store,
    ShoppingBag,
    DollarSign,
    Gift,
    MessageSquare,
    Settings,
    LogOut,
    User,
    Edit,
    Package,
    BookOpen,
    GraduationCap
} from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { logout, user } = useAuthContext();
    const pathname = usePathname();

    const menuItems = [
        { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/users', label: 'Người dùng', icon: Users },
        { href: '/admin/branches', label: 'Chi nhánh', icon: Store },
        { href: '/admin/ingredients', label: 'Nguyên liệu', icon: Package },
        { href: '/admin/recipes', label: 'Công thức', icon: BookOpen },
        { href: '/admin/training', label: 'Khóa đào tạo', icon: GraduationCap },
        { href: '/admin/orders', label: 'Đơn hàng', icon: ShoppingBag },
        { href: '/admin/finance', label: 'Tài chính', icon: DollarSign },
        { href: '/admin/promotions', label: 'Khuyến mãi', icon: Gift },
        { href: '/admin/feedback', label: 'Phản hồi', icon: MessageSquare },
        { href: '/admin/settings', label: 'Cài đặt', icon: Settings },
    ];

    return (
        <AdminProvider>
            <GlobalSearchKeyboardHandler />
            <BranchesLoader />
            <div className="min-h-screen bg-[#f9fafb]">
                <GlobalSearchCommand />
                <div className="flex">
                    {/* Sidebar */}
                    <aside className="w-48 bg-gradient-to-b from-[#632713] via-[#1A3F22] to-[#0d1f11] shadow-xl fixed h-screen flex flex-col">
                        {/* Header */}
                        <div className="p-4 border-b border-white/10 flex-shrink-0">
                            <h2 className="font-bold text-lg text-white drop-shadow-md text-center">TamTech Admin</h2>
                        </div>

                        {/* Navigation Menu - Scrollable */}
                        <nav className="flex-1 overflow-y-auto p-4">
                            <div className="space-y-1.5">
                                {menuItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = pathname === item.href;

                                    return (
                                        <Link key={item.href} href={item.href}>
                                            <div className={`
                                            flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all relative group
                                            ${isActive
                                                    ? 'bg-[#EC6426] text-white shadow-lg font-bold transform scale-[1.02]'
                                                    : 'text-white/90 hover:bg-[#F8A91F]/20 hover:text-white hover:translate-x-1'
                                                }
                                        `}>
                                                {isActive && (
                                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#F8A91F] rounded-r-full shadow-lg"></div>
                                                )}
                                                <Icon size={22} className={isActive ? 'text-white' : 'text-white/90 group-hover:text-[#F8A91F]'} />
                                                <span className={`text-sm ${isActive ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
                                                {isActive && (
                                                    <div className="ml-auto w-2 h-2 bg-[#F8A91F] rounded-full animate-pulse shadow-lg"></div>
                                                )}
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </nav>

                        {/* Logout Button - Fixed */}
                        <div className="p-4 flex-shrink-0 border-t border-white/10">
                            <Button
                                variant="outline"
                                className="w-full justify-start gap-3 border-2 border-[#F8A91F]/50 bg-white/10 hover:bg-[#EC6426] hover:text-white hover:border-[#EC6426] text-white font-semibold transition-all hover:scale-[1.02] shadow-lg"
                                onClick={logout}
                            >
                                <LogOut size={20} />
                                <span className="font-medium">Đăng xuất</span>
                            </Button>
                        </div>

                        {/* Footer Info - Fixed */}
                        <div className="p-4 bg-black/10 backdrop-blur border-t border-white/10 flex-shrink-0">
                            <p className="text-xs text-center text-white/70 font-medium">
                                © 2025 Tâm Tắc Restaurant
                            </p>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 ml-48 bg-[#f9fafb] min-w-0">
                        <AdminHeader />
                        <div className="p-6 max-w-full overflow-x-hidden">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </AdminProvider>
    );
}