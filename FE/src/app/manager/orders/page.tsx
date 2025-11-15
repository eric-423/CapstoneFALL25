'use client';

import { useState, useEffect, useMemo } from 'react';
import { ManagerGuard } from '@/components/guards';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, FileText, Eye, CheckCircle, Clock, Printer, Package, Truck, XCircle, MapPin, Phone, User, Calendar, DollarSign, CreditCard } from 'lucide-react';
import { getOrderStatuses, getBranchOrders, assignShipperToOrder, BranchOrderResponse } from '@/apis/order.api';
import { AdminPageLayout, AdminPageHeader, AdminStatsCard, AdminStatsGrid } from '@/app/admin/components/AdminPageLayout';
import { printBillAction } from '@/app/actions/printBill';
import { toast } from 'react-toastify';

const getKioskMode = (): boolean => {
    if (typeof window === 'undefined') return false;

    const forceKiosk = process.env.NEXT_PUBLIC_FORCE_KIOSK_MODE === 'true';
    if (forceKiosk) {
        return true;
    }

    const userAgent = window.navigator.userAgent;
    const chrome = (window as Window & { chrome?: { runtime?: unknown; app?: unknown } }).chrome;

    const hasChromeRuntime = chrome?.runtime !== undefined;
    const hasChromeApp = chrome?.app !== undefined;
    const hasChrome = chrome !== undefined;
    const urlHasKiosk = window.location.search.includes('kiosk=true');
    const isKioskUserAgent = userAgent.includes('Kiosk') || userAgent.includes('kiosk');

    const isKiosk = hasChromeRuntime || hasChromeApp || hasChrome || urlHasKiosk || isKioskUserAgent;

    console.log('🖨️ Kiosk detection:', {
        hasChromeRuntime,
        hasChromeApp,
        hasChrome,
        urlHasKiosk,
        isKioskUserAgent,
        isKiosk,
    });

    return isKiosk;
};

const PRINT_CONFIG = {
    autoClose: true,
    useServerPrint: process.env.NEXT_PUBLIC_USE_SERVER_PRINT === 'true',
    isKioskMode: getKioskMode(),
};

const getStatusLabel = (status: string): string => {
    const statusMap: Record<string, string> = {
        'ALL': 'Tất cả',
        'CREATED': 'Đã tạo',
        'COOKING': 'Đang nấu',
        'COOKED': 'Đã nấu xong',
        'IN_PROCESS': 'Đang xử lý',
        'PROCESSING': 'Đang xử lý',
        'SHIPPING': 'Đang giao',
        'DELIVERING': 'Đang giao hàng',
        'DELIVERED': 'Đã giao',
        'COMPLETED': 'Hoàn thành',
        'CANCELLED': 'Đã hủy',
        'CANCEL': 'Đã hủy',
        'PAID': 'Đã thanh toán',
    };
    return statusMap[status] || status;
};

const getStatusBadgeClass = (status: string): string => {
    const statusClasses: Record<string, string> = {
        'CREATED': 'bg-blue-50 text-blue-700 border-blue-200',
        'COOKING': 'bg-orange-50 text-orange-700 border-orange-200',
        'COOKED': 'bg-amber-50 text-amber-700 border-amber-200',
        'IN_PROCESS': 'bg-yellow-50 text-yellow-700 border-yellow-200',
        'PROCESSING': 'bg-yellow-50 text-yellow-700 border-yellow-200',
        'SHIPPING': 'bg-indigo-50 text-indigo-700 border-indigo-200',
        'DELIVERING': 'bg-purple-50 text-purple-700 border-purple-200',
        'DELIVERED': 'bg-purple-50 text-purple-700 border-purple-200',
        'COMPLETED': 'bg-green-50 text-green-700 border-green-200',
        'CANCELLED': 'bg-red-50 text-red-700 border-red-200',
        'CANCEL': 'bg-red-50 text-red-700 border-red-200',
        'PAID': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    };
    return statusClasses[status] || 'bg-gray-50 text-gray-700 border-gray-200';
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'COMPLETED':
            return <CheckCircle size={14} strokeWidth={2.5} />;
        case 'COOKING':
        case 'COOKED':
            return <Clock size={14} strokeWidth={2.5} />;
        case 'IN_PROCESS':
        case 'PROCESSING':
            return <Clock size={14} strokeWidth={2.5} />;
        case 'SHIPPING':
        case 'DELIVERING':
        case 'DELIVERED':
            return <Truck size={14} strokeWidth={2.5} />;
        case 'CANCELLED':
        case 'CANCEL':
            return <XCircle size={14} strokeWidth={2.5} />;
        case 'PAID':
            return <DollarSign size={14} strokeWidth={2.5} />;
        default:
            return <Package size={14} strokeWidth={2.5} />;
    }
};

const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'Chưa có';
    try {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return 'Không hợp lệ';
    }
};

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
};

const handlePrintInvoice = async (order: BranchOrderResponse) => {
    console.log('Bắt đầu in hóa đơn cho order:', order.id);
    console.log('PRINT_CONFIG.useServerPrint:', PRINT_CONFIG.useServerPrint);

    if (PRINT_CONFIG.useServerPrint) {
        console.log(' Đang gọi server action để in...');
        try {
            const result = await printBillAction(order.id);
            console.log('Kết quả từ server:', result);
            if (result.success) {
                console.log('In hóa đơn thành công!');
                alert('In hóa đơn thành công!');
                return;
            } else {
                console.warn('Server print thất bại, fallback về browser print:', result.error);
                const useBrowserPrint = confirm(
                    `Không thể kết nối máy in: ${result.error}\n\n` +
                    `Bạn có muốn in qua trình duyệt không?`
                );
                if (!useBrowserPrint) {
                    return;
                }
            }
        } catch (error) {
            console.error('Error printing via server:', error);
            const useBrowserPrint = confirm(
                'Có lỗi xảy ra khi in qua server.\n\n' +
                'Bạn có muốn in qua trình duyệt không?'
            );
            if (!useBrowserPrint) {
                return;
            }
        }
    }

    console.log('Dùng browser print mode...');

    try {
        const response = await fetch(`/api/orders/${order.id}/bill/download`, {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Failed to download bill' }));
            console.error('Error downloading bill:', errorData);
            alert('Không thể tải hóa đơn. Vui lòng thử lại.');
            return;
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = '0';
        iframe.style.opacity = '0';
        iframe.style.pointerEvents = 'none';
        document.body.appendChild(iframe);

        iframe.src = url;

        const simulateEnterKey = () => {
            try {
                const enterEventDown = new KeyboardEvent('keydown', {
                    key: 'Enter',
                    code: 'Enter',
                    keyCode: 13,
                    which: 13,
                    bubbles: true,
                    cancelable: false,
                });

                const enterEventPress = new KeyboardEvent('keypress', {
                    key: 'Enter',
                    code: 'Enter',
                    keyCode: 13,
                    which: 13,
                    bubbles: true,
                    cancelable: false,
                });

                const enterEventUp = new KeyboardEvent('keyup', {
                    key: 'Enter',
                    code: 'Enter',
                    keyCode: 13,
                    which: 13,
                    bubbles: true,
                    cancelable: false,
                });

                window.dispatchEvent(enterEventDown);
                window.dispatchEvent(enterEventPress);
                window.dispatchEvent(enterEventUp);

                document.dispatchEvent(enterEventDown);
                document.dispatchEvent(enterEventPress);
                document.dispatchEvent(enterEventUp);

                if (iframe.contentWindow) {
                    iframe.contentWindow.dispatchEvent(enterEventDown);
                    iframe.contentWindow.dispatchEvent(enterEventPress);
                    iframe.contentWindow.dispatchEvent(enterEventUp);

                    if (iframe.contentWindow.document) {
                        iframe.contentWindow.document.dispatchEvent(enterEventDown);
                        iframe.contentWindow.document.dispatchEvent(enterEventPress);
                        iframe.contentWindow.document.dispatchEvent(enterEventUp);
                    }
                }
            } catch (error) {
                console.error('Error simulating Enter key:', error);
            }
        };

        const triggerPrint = () => {
            try {
                if (iframe.contentWindow) {
                    iframe.contentWindow.focus();

                    setTimeout(() => {
                        console.log('🖨️ isKioskMode:', PRINT_CONFIG.isKioskMode);

                        if (PRINT_CONFIG.isKioskMode) {
                            console.log('🖨️ Kiosk mode: Tự động in không dialog');
                            iframe.contentWindow?.print();

                            setTimeout(() => {
                                iframe.contentWindow?.print();
                            }, 500);
                        } else {
                            console.log('🖨️ Normal mode: Hiện dialog print');
                            iframe.contentWindow?.print();

                            setTimeout(() => {
                                simulateEnterKey();

                                setTimeout(() => {
                                    simulateEnterKey();
                                }, 200);

                                setTimeout(() => {
                                    simulateEnterKey();
                                }, 400);
                            }, 300);
                        }
                    }, 100);
                }
            } catch (error) {
                console.error('Error triggering print:', error);
            }
        };

        iframe.onload = () => {
            setTimeout(() => {
                triggerPrint();

                if (PRINT_CONFIG.autoClose) {
                    const cleanup = () => {
                        setTimeout(() => {
                            if (iframe.parentNode) {
                                document.body.removeChild(iframe);
                            }
                            window.URL.revokeObjectURL(url);
                        }, 1000);
                    };

                    iframe.contentWindow?.addEventListener('afterprint', cleanup, { once: true });

                    setTimeout(() => {
                        if (iframe.parentNode) {
                            document.body.removeChild(iframe);
                            window.URL.revokeObjectURL(url);
                        }
                    }, 5000);
                }
            }, 1000);
        };

        setTimeout(() => {
            if (iframe.contentDocument?.readyState === 'complete') {
                triggerPrint();
            }
        }, 1500);
    } catch (error) {
        console.error('Error printing invoice:', error);
        alert('Có lỗi xảy ra khi in hóa đơn. Vui lòng thử lại.');
    }
};

export default function ManagerOrdersPage() {
    const [orderStatuses, setOrderStatuses] = useState<string[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
    const [orders, setOrders] = useState<BranchOrderResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [assigningShipper, setAssigningShipper] = useState<Set<number>>(new Set());

    useEffect(() => {
        const fetchStatuses = async () => {
            try {
                const response = await getOrderStatuses();
                if (response && response.status === 0 && response.data && Array.isArray(response.data)) {
                    setOrderStatuses(response.data);
                } else {
                    console.warn('Invalid response format for order statuses:', response);
                    setOrderStatuses(['ALL', 'CREATED', 'IN_PROCESS', 'DELIVERING', 'COMPLETED', 'CANCELLED', 'PAID']);
                }
            } catch (error) {
                console.error('Error fetching order statuses:', error);
                setOrderStatuses(['ALL', 'CREATED', 'IN_PROCESS', 'DELIVERING', 'COMPLETED', 'CANCELLED', 'PAID']);
            }
        };
        fetchStatuses();
    }, []);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoadingOrders(true);
            try {
                const status = selectedStatus === 'ALL' ? undefined : selectedStatus;
                console.log('Fetching orders with status:', status || 'ALL (no filter)');
                const response = await getBranchOrders(status);
                if (response && response.status === 0 && response.data && Array.isArray(response.data)) {
                    setOrders(response.data);
                } else {
                    console.warn('Invalid response format for branch orders:', response);
                    setOrders([]);
                }
            } catch (error: unknown) {
                console.error('Error fetching orders:', error);
                const err = error as { message?: string; response?: { status?: number; data?: unknown } };
                console.error('Error details:', {
                    message: err?.message,
                    status: err?.response?.status,
                    data: err?.response?.data,
                });
                setOrders([]);
            } finally {
                setLoadingOrders(false);
                setLoading(false);
            }
        };
        fetchOrders();
    }, [selectedStatus]);

    const handleAssignShipper = async (orderId: number) => {
        if (assigningShipper.has(orderId)) {
            return;
        }

        setAssigningShipper(prev => new Set(prev).add(orderId));

        try {
            const result = await assignShipperToOrder(orderId);

            if (result.success) {
                const status = selectedStatus === 'ALL' ? undefined : selectedStatus;
                const response = await getBranchOrders(status);
                if (response && response.status === 0 && response.data && Array.isArray(response.data)) {
                    setOrders(response.data);
                }
            } else {
                toast.error('Không thể assign shipper. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Error assigning shipper:', error);
            toast.error('Lỗi khi chuyển cho shipper. Vui lòng thử lại.');
        } finally {
            setAssigningShipper(prev => {
                const newSet = new Set(prev);
                newSet.delete(orderId);
                return newSet;
            });
        }
    };

    const stats = useMemo(() => {
        const total = orders.length;
        const inProcess = orders.filter(o =>
            ['IN_PROCESS', 'PROCESSING', 'COOKING', 'COOKED'].includes(o.orderStatus)
        ).length;
        const delivering = orders.filter(o =>
            ['DELIVERING', 'SHIPPING', 'DELIVERED'].includes(o.orderStatus)
        ).length;
        const completed = orders.filter(o => o.orderStatus === 'COMPLETED').length;
        const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0);
        return { total, inProcess, delivering, completed, totalRevenue };
    }, [orders]);

    return (
        <ManagerGuard>
            <AdminPageLayout>
                <AdminPageHeader
                    title="Quản Lý Đơn Hàng"
                    description="Theo dõi và xử lý đơn hàng"
                    icon={ShoppingBag}
                    actions={
                        <Button className="bg-gradient-to-r from-[#EC6426] to-[#F8A91F] hover:from-[#EC6426]/90 hover:to-[#F8A91F]/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold text-sm sm:text-base">
                            <FileText size={18} className="mr-2" strokeWidth={2.5} />
                            Xuất Báo Cáo
                        </Button>
                    }
                />

                <AdminStatsGrid>
                    <AdminStatsCard
                        title="Tổng đơn hàng"
                        value={stats.total}
                        icon={ShoppingBag}
                    />
                    <AdminStatsCard
                        title="Đang xử lý"
                        value={stats.inProcess}
                        icon={Clock}
                        className="border-yellow-200"
                        iconClassName="from-yellow-400 to-yellow-600"
                    />
                    <AdminStatsCard
                        title="Hoàn thành"
                        value={stats.completed}
                        icon={CheckCircle}
                        className="border-green-200"
                        iconClassName="from-green-400 to-green-600"
                    />
                    <AdminStatsCard
                        title="Tổng doanh thu"
                        value={`${(stats.totalRevenue / 1000000).toFixed(1)}M`}
                        icon={DollarSign}
                        className="border-[#F8A91F]/20"
                        iconClassName="from-[#EC6426] to-[#F8A91F]"
                    />
                </AdminStatsGrid>

                <Card className="p-4 sm:p-6 bg-white border-0 shadow-sm rounded-xl">
                    <div className="flex flex-wrap gap-2 mb-6">
                        {orderStatuses.map((status) => (
                            <Button
                                key={status}
                                onClick={() => setSelectedStatus(status)}
                                variant={selectedStatus === status ? 'default' : 'outline'}
                                className={`transition-all duration-300 rounded-xl font-semibold whitespace-nowrap px-4 py-2 ${selectedStatus === status
                                    ? 'bg-gradient-to-r from-[#EC6426] to-[#F8A91F] text-white border-0 shadow-md'
                                    : 'border-2 border-gray-300 text-gray-700 hover:border-[#EC6426] hover:text-[#EC6426] hover:bg-[#EC6426]/5'
                                    }`}
                            >
                                {getStatusLabel(status)}
                            </Button>
                        ))}
                    </div>

                    {loading || loadingOrders ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#EC6426]"></div>
                            <p className="mt-4 text-gray-600 font-semibold">Đang tải dữ liệu...</p>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-12">
                            <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                            <p className="text-gray-600 font-semibold text-lg">Không có đơn hàng nào</p>
                            <p className="text-gray-500 text-sm mt-2">Thử chọn trạng thái khác để xem thêm đơn hàng</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <Card key={order.id} className="p-4 sm:p-6 border-2 border-gray-100 hover:border-[#EC6426]/30 hover:shadow-lg transition-all duration-300 rounded-xl">
                                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                        <div className="flex-1 space-y-4">
                                            <div className="flex flex-wrap items-center gap-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg font-bold text-[#EC6426]">#{order.id}</span>
                                                    <Badge className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg border-2 ${getStatusBadgeClass(order.orderStatus)}`}>
                                                        {getStatusIcon(order.orderStatus)}
                                                        {getStatusLabel(order.orderStatus)}
                                                    </Badge>
                                                </div>
                                                {order.table && (
                                                    <Badge className="bg-blue-100 text-blue-700 border-blue-200 border-2 px-3 py-1 text-xs font-bold rounded-lg">
                                                        Tại bàn
                                                    </Badge>
                                                )}
                                                {order.pickUp && (
                                                    <Badge className="bg-purple-100 text-purple-700 border-purple-200 border-2 px-3 py-1 text-xs font-bold rounded-lg">
                                                        Mang đi
                                                    </Badge>
                                                )}
                                                {!order.table && !order.pickUp && (
                                                    <Badge className="bg-green-100 text-green-700 border-green-200 border-2 px-3 py-1 text-xs font-bold rounded-lg">
                                                        <Truck size={12} className="mr-1" />
                                                        Giao hàng
                                                    </Badge>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <User size={16} />
                                                        <span className="font-semibold">{order.customerName}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Phone size={16} />
                                                        <span>{order.customerPhone}</span>
                                                    </div>
                                                    {order.address && (
                                                        <div className="flex items-start gap-2 text-sm text-gray-600">
                                                            <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                                                            <span className="line-clamp-2">{order.address}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Calendar size={16} />
                                                        <span className="font-semibold">Đặt:</span>
                                                        <span>{formatDate(order.orderDate)}</span>
                                                    </div>
                                                    {order.paymentTime && (
                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                            <CreditCard size={16} />
                                                            <span className="font-semibold">Thanh toán:</span>
                                                            <span>{formatDate(order.paymentTime)}</span>
                                                        </div>
                                                    )}
                                                    {order.deliveryAt && (
                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                            <Truck size={16} />
                                                            <span className="font-semibold">Giao:</span>
                                                            <span>{formatDate(order.deliveryAt)}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {(order.waiterName || order.chefName || order.shipperName) && (
                                                <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-200">
                                                    {order.waiterName && (
                                                        <div className="text-xs text-gray-600">
                                                            <span className="font-semibold">Nhân viên:</span> {order.waiterName}
                                                        </div>
                                                    )}
                                                    {order.chefName && (
                                                        <div className="text-xs text-gray-600">
                                                            <span className="font-semibold">Đầu bếp:</span> {order.chefName}
                                                        </div>
                                                    )}
                                                    {order.shipperName && (
                                                        <div className="text-xs text-gray-600">
                                                            <span className="font-semibold">Shipper:</span> {order.shipperName}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col items-end gap-3 lg:min-w-[200px]">
                                            <div className="text-right">
                                                <div className="text-xs text-gray-500 mb-1">Số lượng món</div>
                                                <div className="text-lg font-bold text-gray-900">{order.itemCount}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs text-gray-500 mb-1">Tổng tiền</div>
                                                <div className="text-2xl font-bold text-[#EC6426]">{formatCurrency(order.amount)}</div>
                                                {order.discountValue > 0 && (
                                                    <div className="text-xs text-green-600 mt-1">
                                                        Giảm: {formatCurrency(order.discountValue)}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-2 w-full lg:w-auto">
                                                <div className="flex gap-2 w-full lg:w-auto">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handlePrintInvoice(order)}
                                                        className="flex-1 lg:flex-none whitespace-nowrap border-2 border-[#EC6426] text-[#EC6426] hover:bg-[#EC6426] hover:text-white transition-all duration-300 rounded-xl font-semibold"
                                                    >
                                                        <Printer size={16} className="mr-1 flex-shrink-0" strokeWidth={2.5} />
                                                        <span className="truncate">In hóa đơn</span>
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="flex-1 lg:flex-none whitespace-nowrap border-2 border-gray-300 text-gray-700 hover:bg-gray-100 transition-all duration-300 rounded-xl font-semibold"
                                                    >
                                                        <Eye size={16} className="mr-1 flex-shrink-0" strokeWidth={2.5} />
                                                        <span className="truncate">Chi tiết</span>
                                                    </Button>
                                                </div>
                                                {order.orderStatus === 'COOKED' && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleAssignShipper(order.id)}
                                                        disabled={assigningShipper.has(order.id)}
                                                        className="w-full lg:w-auto whitespace-nowrap border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white transition-all duration-300 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <Truck size={16} className="mr-1 flex-shrink-0" strokeWidth={2.5} />
                                                        <span className="truncate">{assigningShipper.has(order.id) ? 'Đang xử lý...' : 'Giao hàng ngay'}</span>
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </Card>
            </AdminPageLayout>
        </ManagerGuard>
    );
}

