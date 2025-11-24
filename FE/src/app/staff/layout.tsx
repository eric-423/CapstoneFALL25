'use client';

import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/utils/contexts/AuthContext';
import { AdminProvider } from '@/utils/contexts/AdminContext';
import { useBarcodeScanner, type BarcodeProcessContext } from '@/utils/hooks/useBarcodeScanner';
import { assignChefToOrder, assignShipperToOrder, getBranchOrders } from '@/apis/order.api';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useMemo, memo, useCallback } from 'react';
import { toast } from 'react-toastify';
import {
    ShoppingBag,
    LogOut,
    Menu,
    X,
} from 'lucide-react';

const MenuItem = memo(({
    item,
    isActive
}: {
    item: { href: string; label: string; icon: React.ElementType };
    isActive: boolean;
}) => {
    const Icon = item.icon;

    return (
        <Link
            href={item.href}
            prefetch={true}
            className="block"
        >
            <div className={`
                flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl 
                transition-all duration-200 relative group
                ${isActive
                    ? 'bg-white/20 text-white shadow-lg font-semibold backdrop-blur-sm'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }
            `}>
                {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#F8A91F] rounded-r-full shadow-lg"></div>
                )}
                <Icon
                    size={20}
                    className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-white/80 group-hover:text-[#F8A91F]'} transition-colors`}
                    strokeWidth={isActive ? 2.5 : 2}
                />
                <span className={`text-sm sm:text-base ${isActive ? 'font-semibold' : 'font-medium'} truncate`}>
                    {item.label}
                </span>
                {isActive && (
                    <div className="ml-auto w-2 h-2 bg-[#F8A91F] rounded-full animate-pulse shadow-lg flex-shrink-0"></div>
                )}
            </div>
        </Link>
    );
});

MenuItem.displayName = 'MenuItem';

export default function StaffLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { logout } = useAuthContext();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const menuItems = useMemo(() => [
        { href: '/staff/orders', label: 'Đơn hàng', icon: ShoppingBag },
    ], []);

    const handleLogout = useCallback(() => {
        logout();
    }, [logout]);

    useEffect(() => {
        setSidebarOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (!sidebarOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (window.innerWidth < 1024) {
                const target = event.target as HTMLElement;
                if (!target.closest('aside') && !target.closest('button[aria-label="Toggle sidebar"]')) {
                    setSidebarOpen(false);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [sidebarOpen]);

    const processScannedOrder = useCallback(async (orderId: number) => {
        const response = await getBranchOrders();
        const branchOrders = Array.isArray(response?.data) ? response.data : [];
        const order = branchOrders.find((item) => item.id === orderId);

        if (!order) {
            throw new Error(`Không tìm thấy đơn hàng #${orderId} trong chi nhánh của bạn.`);
        }

        const status = (order.orderStatus || '').toUpperCase();
        const contextBase: BarcodeProcessContext = { status };

        if (['IN_PROCESS', 'PROCESSING'].includes(status)) {
            const assignResult = await assignChefToOrder(orderId);
            if (!assignResult.success) {
                return {
                    success: false,
                    context: {
                        ...contextBase,
                        action: 'assign-chef' as const,
                        message: 'Không thể chuyển đơn cho bếp. Vui lòng thử lại.',
                    },
                };
            }
            return {
                success: true,
                context: {
                    ...contextBase,
                    action: 'assign-chef' as const,
                },
            };
        }

        if (status === 'COOKED') {
            const assignResult = await assignShipperToOrder(orderId);
            if (!assignResult.success) {
                return {
                    success: false,
                    context: {
                        ...contextBase,
                        action: 'assign-shipper' as const,
                        message: 'Không thể giao đơn cho shipper. Vui lòng thử lại.',
                    },
                };
            }
            return {
                success: true,
                context: {
                    ...contextBase,
                    action: 'assign-shipper' as const,
                },
            };
        }

        return {
            success: false,
            context: {
                ...contextBase,
                action: 'no-action' as const,
                message: `Đơn #${orderId} đang ở trạng thái ${status || 'khác'}, không thể xử lý.`,
            },
        };
    }, []);

    const handleBarcodeSuccess = useCallback((orderId: number, context?: BarcodeProcessContext) => {
        if (context?.action === 'assign-chef') {
            toast.success(`Đã chuyển đơn #${orderId} cho bếp`, {
                position: 'top-right',
                autoClose: 3000,
            });
        } else if (context?.action === 'assign-shipper') {
            toast.success(`Đã bàn giao đơn #${orderId} cho shipper`, {
                position: 'top-right',
                autoClose: 3000,
            });
        } else {
            toast.success(`Đã xử lý đơn hàng #${orderId}`, {
                position: 'top-right',
                autoClose: 3000,
            });
        }

        window.dispatchEvent(new CustomEvent('refreshOrders'));
    }, []);

    const handleBarcodeError = useCallback((error: Error) => {
        const errorMessage = error.message || 'Có lỗi xảy ra khi xử lý đơn';
        toast.error(`Lỗi: ${errorMessage}`, {
            position: 'top-right',
            autoClose: 5000,
        });
    }, []);

    const handleBarcodeAlreadyHandled = useCallback((orderId: number, context?: BarcodeProcessContext) => {
        if (context?.action === 'no-action') {
            toast.info(context?.message || `Đơn #${orderId} đang ở trạng thái ${context?.status || 'không xác định'}`, {
                position: 'top-right',
                autoClose: 4000,
            });
            return;
        }

        toast.warning(`Đơn hàng #${orderId} đã được xử lý trước đó`, {
            position: 'top-right',
            autoClose: 3000,
        });
    }, []);

    useBarcodeScanner({
        enabled: true,
        processOrder: processScannedOrder,
        onSuccess: handleBarcodeSuccess,
        onError: handleBarcodeError,
        onAlreadyHandled: handleBarcodeAlreadyHandled,
    });

    return (
        <AdminProvider>
            <div className="min-h-screen bg-[#EFE6DB]">
                <div className="flex relative">
                    {sidebarOpen && (
                        <div
                            className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
                            onClick={() => setSidebarOpen(false)}
                        />
                    )}

                    <aside className={`
                        fixed top-0 left-0 h-screen z-50
                        w-64 lg:w-56 xl:w-64
                        bg-gradient-to-b from-[#EC6426] via-[#EC6426]/95 to-[#EC6426]/90
                        shadow-xl lg:shadow-none
                        flex flex-col
                        transition-transform duration-300 ease-in-out
                        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    `}>
                        <div className="p-4 sm:p-5 border-b border-white/20 flex-shrink-0 flex items-center justify-between lg:justify-center">
                            <h2 className="font-bold text-base sm:text-lg lg:text-xl text-white drop-shadow-md text-center flex-1 lg:flex-none">
                                TamTech Staff
                            </h2>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
                                aria-label="Close sidebar"
                            >
                                <X className="w-5 h-5 text-white" />
                            </button>
                        </div>

                        <nav className="flex-1 overflow-y-auto p-3 sm:p-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                            <div className="space-y-1.5">
                                {menuItems.map((item) => (
                                    <MenuItem
                                        key={item.href}
                                        item={item}
                                        isActive={pathname === item.href}
                                    />
                                ))}
                            </div>
                        </nav>

                        <div className="p-3 sm:p-4 flex-shrink-0 border-t border-white/20">
                            <Button
                                variant="outline"
                                className="w-full justify-start gap-3 border-2 border-white/30 bg-white/10 hover:bg-white/20 hover:border-white/50 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl py-2.5 sm:py-3"
                                onClick={handleLogout}
                            >
                                <LogOut size={18} className="flex-shrink-0" />
                                <span className="text-sm sm:text-base font-semibold">Đăng xuất</span>
                            </Button>
                        </div>

                        <div className="p-3 sm:p-4 bg-black/10 backdrop-blur border-t border-white/20 flex-shrink-0">
                            <p className="text-xs text-center text-white/70 font-medium">
                                © 2025 Tâm Tắc Restaurant
                            </p>
                        </div>
                    </aside>

                    <main className="flex-1 w-full bg-[#EFE6DB] min-w-0 lg:ml-56 xl:ml-64">
                        <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 shadow-sm">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                aria-label="Toggle sidebar"
                            >
                                <Menu className="w-6 h-6 text-gray-700" />
                            </button>
                            <div className="flex-1">
                                <h1 className="text-lg font-bold text-gray-900">TamTech Staff</h1>
                            </div>
                        </div>

                        <div className="p-4 sm:p-6 max-w-full overflow-x-hidden">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </AdminProvider>
    );
}

