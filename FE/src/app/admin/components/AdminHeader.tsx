'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
    Search,
    ChevronDown,
    Bell,
    Settings,
    LogOut,
    User,
    MapPin,
    Calendar,
    Command as CommandIcon,
} from 'lucide-react';
import { useAdminContext } from '@/utils/contexts/AdminContext';
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

const timePeriodLabels = {
    today: 'Hôm nay',
    '7d': '7 ngày qua',
    '30d': '30 ngày qua',
    custom: 'Tùy chỉnh',
};

export function AdminHeader() {
    const pathname = usePathname();
    const router = useRouter();
    const {
        selectedBranch,
        setSelectedBranch,
        branches,
        timePeriod,
        setTimePeriod,
        openSearch,
    } = useAdminContext();

    // Generate breadcrumbs from pathname
    const generateBreadcrumbs = () => {
        const paths = pathname.split('/').filter(Boolean);
        const breadcrumbs = [];

        for (let i = 0; i < paths.length; i++) {
            const path = paths[i];
            const href = '/' + paths.slice(0, i + 1).join('/');

            // Capitalize and format
            let label = path
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');

            // Skip 'admin' root
            if (path === 'admin') continue;

            breadcrumbs.push({ label, href, isLast: i === paths.length - 1 });
        }

        return breadcrumbs;
    };

    const breadcrumbs = generateBreadcrumbs();

    // Mock user data - replace with real auth
    const user = {
        name: 'Quản trị viên',
        email: 'admin@tamtac.com',
        role: 'Quản trị hệ thống',
        avatar: '/avatars/admin.jpg',
    };

    const handleBranchChange = (branch: typeof selectedBranch) => {
        setSelectedBranch(branch);
        // TODO: Trigger data refresh across all components
    };

    const handleTimePeriodChange = (period: typeof timePeriod) => {
        setTimePeriod(period);
        // TODO: Trigger data refresh
    };

    return (
        <header className="sticky top-0 z-40 w-full border-b border-gray-700/50 bg-slate-900">
            <div className="flex h-16 items-center gap-4 px-6 max-w-full overflow-x-auto">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-400">Admin</span>
                    {breadcrumbs.map((crumb, index) => (
                        <React.Fragment key={crumb.href}>
                            <span className="text-gray-600">/</span>
                            {crumb.isLast ? (
                                <span className="font-semibold text-white">
                                    {crumb.label}
                                </span>
                            ) : (
                                <button
                                    onClick={() => router.push(crumb.href)}
                                    className="text-gray-300 hover:text-white transition-colors"
                                >
                                    {crumb.label}
                                </button>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                <div className="flex-1" />

                {/* Global Search Trigger */}
                <Button
                    variant="outline"
                    className="relative h-9 w-full max-w-sm justify-start text-sm text-gray-400 border-gray-700 bg-slate-800/50 hover:bg-slate-800 hover:text-gray-200 sm:pr-12"
                    onClick={openSearch}
                >
                    <Search className="mr-2 h-4 w-4" />
                    <span className="hidden lg:inline-flex">Tìm người dùng, đơn hàng, công thức...</span>
                    <span className="inline-flex lg:hidden">Tìm kiếm...</span>
                    <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-6 select-none items-center gap-1 rounded border border-gray-700 bg-slate-800 px-1.5 font-mono text-xs font-medium text-gray-400 opacity-100 sm:flex">
                        <CommandIcon className="h-3 w-3" />K
                    </kbd>
                </Button>

                {/* Time Period Selector */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-9 gap-2 border-gray-700 bg-slate-800/50 text-gray-300 hover:bg-slate-800 hover:text-white">
                            <Calendar className="h-4 w-4" />
                            <span className="hidden sm:inline-flex">{timePeriodLabels[timePeriod]}</span>
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Thời gian</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleTimePeriodChange('today')}>
                            <span className={timePeriod === 'today' ? 'font-semibold' : ''}>Hôm nay</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleTimePeriodChange('7d')}>
                            <span className={timePeriod === '7d' ? 'font-semibold' : ''}>7 ngày qua</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleTimePeriodChange('30d')}>
                            <span className={timePeriod === '30d' ? 'font-semibold' : ''}>30 ngày qua</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleTimePeriodChange('custom')}>
                            <span className={timePeriod === 'custom' ? 'font-semibold' : ''}>Tùy chỉnh</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Branch Switcher */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-9 gap-2 border-gray-700 bg-slate-800/50 text-gray-300 hover:bg-slate-800 hover:text-white">
                            <MapPin className="h-4 w-4" />
                            <span className="hidden sm:inline-flex">
                                {selectedBranch ? selectedBranch.name : 'All Branches'}
                            </span>
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>Chọn chi nhánh</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleBranchChange(null)}>
                            <MapPin className="mr-2 h-4 w-4" />
                            <div className="flex flex-col">
                                <span className={!selectedBranch ? 'font-semibold' : ''}>Tất cả chi nhánh</span>
                                <span className="text-xs text-gray-500">Xem dữ liệu tổng hợp</span>
                            </div>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {branches.length === 0 ? (
                            <div className="px-2 py-4 text-center text-sm text-gray-500">
                                Không có chi nhánh nào
                            </div>
                        ) : (
                            branches.map((branch) => (
                                <DropdownMenuItem
                                    key={branch.id}
                                    onClick={() => handleBranchChange(branch)}
                                >
                                    <MapPin className="mr-2 h-4 w-4" />
                                    <div className="flex flex-col">
                                        <span className={selectedBranch?.id === branch.id ? 'font-semibold' : ''}>
                                            {branch.name}
                                        </span>
                                        {branch.code && (
                                            <span className="text-xs text-gray-500">{branch.code}</span>
                                        )}
                                    </div>
                                </DropdownMenuItem>
                            ))
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative h-9 w-9 text-gray-300 hover:text-white hover:bg-slate-800">
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-1 top-1 flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
                    </span>
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-9 gap-2 px-2 text-gray-300 hover:text-white hover:bg-slate-800">
                            <Avatar className="h-7 w-7">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="hidden flex-col items-start text-left sm:flex">
                                <span className="text-sm font-medium text-white">{user.name}</span>
                                <span className="text-xs text-gray-400">{user.role}</span>
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
                        <DropdownMenuItem onClick={() => router.push('/admin/profile')}>
                            <User className="mr-2 h-4 w-4" />
                            Hồ sơ
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push('/admin/settings')}>
                            <Settings className="mr-2 h-4 w-4" />
                            Cài đặt
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                                localStorage.clear();
                                router.push('/inside/login');
                            }}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Đăng xuất
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
