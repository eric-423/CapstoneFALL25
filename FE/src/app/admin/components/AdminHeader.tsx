'use client';

import React, { useMemo, useCallback, memo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
    ChevronDown,
    Bell,
    Settings,
    LogOut,
    User,
} from 'lucide-react';
import { useAuthContext } from '@/utils/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const AdminHeader = memo(function AdminHeader() {
    const pathname = usePathname();
    const router = useRouter();
    const { logout } = useAuthContext();

    const breadcrumbs = useMemo(() => {
        const paths = pathname.split('/').filter(Boolean);
        const breadcrumbs = [];
        const isManager = pathname.startsWith('/manager');

        for (let i = 0; i < paths.length; i++) {
            const path = paths[i];
            const href = '/' + paths.slice(0, i + 1).join('/');

            const label = path
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');

            if (path === 'admin' || path === 'manager') continue;

            breadcrumbs.push({ label, href, isLast: i === paths.length - 1 });
        }

        return { breadcrumbs, isManager };
    }, [pathname]);

    const user = useMemo(() => ({
        name: 'Quản trị viên',
        email: 'admin@tamtac.com',
        role: 'Quản trị hệ thống',
        avatar: '/avatars/admin.jpg',
    }), []);

    const handleProfileClick = useCallback(() => {
        router.push('/admin/profile');
    }, [router]);

    const handleSettingsClick = useCallback(() => {
        router.push('/admin/settings');
    }, [router]);

    return (
        <header className="sticky top-0 z-40 w-full border-b border-gray-300/50 bg-[#EFE6DB] shadow-md">
            <div className="flex h-16 items-center gap-4 px-6 max-w-full overflow-x-auto">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-600">{breadcrumbs.isManager ? 'Manager' : 'Admin'}</span>
                    {breadcrumbs.breadcrumbs.map((crumb) => (
                        <React.Fragment key={crumb.href}>
                            <span className="text-gray-500">/</span>
                            {crumb.isLast ? (
                                <span className="font-semibold text-gray-900">
                                    {crumb.label}
                                </span>
                            ) : (
                                <button
                                    onClick={() => router.push(crumb.href)}
                                    className="text-gray-700 hover:text-gray-900 transition-colors"
                                >
                                    {crumb.label}
                                </button>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                <div className="flex-1"></div>

                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative h-9 w-9 text-gray-700 hover:text-gray-900 hover:bg-white/50">
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-1 top-1 flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
                    </span>
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-9 gap-2 px-2 text-gray-700 hover:text-gray-900 hover:bg-white/50">
                            <Avatar className="h-7 w-7">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="hidden flex-col items-start text-left sm:flex">
                                <span className="text-sm font-medium text-gray-900">{user.name}</span>
                                <span className="text-xs text-gray-600">{user.role}</span>
                            </div>
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{user.name}</p>
                                <p className="text-xs leading-none text-gray-500">{user.email}</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleProfileClick}>
                            <User className="mr-2 h-4 w-4" />
                            Hồ sơ
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleSettingsClick}>
                            <Settings className="mr-2 h-4 w-4" />
                            Cài đặt
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-red-600"
                            onClick={logout}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Đăng xuất
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
});
