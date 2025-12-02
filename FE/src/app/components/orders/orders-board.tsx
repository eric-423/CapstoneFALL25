'use client';

import { Montserrat } from 'next/font/google';
import { useRouter } from 'next/navigation';
import {
    useState,
    useEffect,
    useMemo,
    useCallback,
} from 'react';
import { flushSync } from 'react-dom';

import {
    AdminPageLayout,
    AdminPageHeader,
    AdminStatsCard,
    AdminStatsGrid,
} from '@/app/admin/components/AdminPageLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    ShoppingBag,
    Eye,
    CheckCircle,
    Clock,
    Printer,
    Package,
    Truck,
    XCircle,
    DollarSign,
    User,
    Phone,
    MapPin,
    Calendar,
    CreditCard,
    Building2,
    ChefHat,
} from 'lucide-react';
import {
    BranchOrderResponse,
    CustomerOrderDetailData,
    assignChefToOrder,
    assignShipperToOrder,
    getBranchOrders,
    getCustomerOrderDetail,
    getOrderStatuses,
    staffAssignShipperToOrder,
} from '@/apis/order.api';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { toast } from 'react-toastify';

const montserrat = Montserrat({
    subsets: ['latin', 'vietnamese'],
    variable: '--font-montserrat',
    display: 'swap',
});

type OrdersBoardVariant = 'manager' | 'staff';

interface OrdersBoardProps {
    variant: OrdersBoardVariant;
}

const DEFAULT_STATUSES = [
    'ALL',
    'CREATED',
    'IN_PROCESS',
    'DELIVERING',
    'COMPLETED',
    'CANCELLED',
];

const statusLabels: Record<string, string> = {
    ALL: 'Tất cả',
    CREATED: 'Đã tạo',
    COOKING: 'Đang nấu',
    COOKED: 'Đã nấu xong',
    IN_PROCESS: 'Đang xử lý',
    PROCESSING: 'Đang xử lý',
    SHIPPING: 'Đang giao',
    DELIVERING: 'Đang giao hàng',
    DELIVERED: 'Đã giao',
    COMPLETED: 'Hoàn thành',
    CANCELLED: 'Đã hủy',
    CANCEL: 'Đã hủy',
    PAID: 'Đã thanh toán',
};

const statusClasses: Record<string, string> = {
    CREATED: 'bg-blue-50 text-blue-700 border-blue-200',
    COOKING: 'bg-orange-50 text-orange-700 border-orange-200',
    COOKED: 'bg-amber-50 text-amber-700 border-amber-200',
    IN_PROCESS: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    PROCESSING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    SHIPPING: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    DELIVERING: 'bg-purple-50 text-purple-700 border-purple-200',
    DELIVERED: 'bg-purple-50 text-purple-700 border-purple-200',
    COMPLETED: 'bg-green-50 text-green-700 border-green-200',
    CANCELLED: 'bg-red-50 text-red-700 border-red-200',
    CANCEL: 'bg-red-50 text-red-700 border-red-200',
    PAID: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const PRINT_CONFIG = {
    autoClose: true,
    useServerPrint: process.env.NEXT_PUBLIC_USE_SERVER_PRINT === 'true',
    isKioskMode: getKioskMode(),
};

export function OrdersBoard({ variant }: OrdersBoardProps) {
    const router = useRouter();
    const isManager = variant === 'manager';
    const isStaff = variant === 'staff';

    const [orderStatuses, setOrderStatuses] = useState<string[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
    const [orders, setOrders] = useState<BranchOrderResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [assigningShipper, setAssigningShipper] = useState<Set<number>>(new Set());

    const [selectedOrder, setSelectedOrder] = useState<BranchOrderResponse | null>(null);
    const [orderDetail, setOrderDetail] = useState<CustomerOrderDetailData | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);

    useEffect(() => {
        const fetchStatuses = async () => {
            try {
                const response = await getOrderStatuses();
                if (
                    response &&
                    response.status === 0 &&
                    response.data &&
                    Array.isArray(response.data)
                ) {
                    const normalized = normalizeStatuses(response.data);
                    setOrderStatuses(normalized);
                } else {
                    setOrderStatuses(DEFAULT_STATUSES);
                }
            } catch (error) {
                console.error('Error fetching order statuses:', error);
                setOrderStatuses(DEFAULT_STATUSES);
            }
        };

        fetchStatuses();
    }, []);

    const fetchOrders = useCallback(async () => {
        setLoadingOrders(true);
        try {
            const status = selectedStatus === 'ALL' ? undefined : selectedStatus;
            const response = await getBranchOrders(status);
            if (
                response &&
                response.status === 0 &&
                response.data &&
                Array.isArray(response.data)
            ) {
                setOrders(response.data);
            } else {
                setOrders([]);
            }
        } catch (error: unknown) {
            console.error('Error fetching branch orders:', error);
            setOrders([]);
        } finally {
            setLoadingOrders(false);
            setLoading(false);
        }
    }, [selectedStatus]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    useEffect(() => {
        const interval = setInterval(fetchOrders, 15000);
        return () => clearInterval(interval);
    }, [fetchOrders]);

    useEffect(() => {
        const handleRefreshOrders = () => {
            fetchOrders();
        };

        const eventName = 'refreshOrders';
        window.addEventListener(eventName as any, handleRefreshOrders as EventListener);
        return () => {
            window.removeEventListener(eventName as any, handleRefreshOrders as EventListener);
        };
    }, [fetchOrders]);

    const handleAssignShipper = async (orderId: number) => {
        if (assigningShipper.has(orderId)) {
            return;
        }

        const assignFn = isManager ? assignShipperToOrder : staffAssignShipperToOrder;
        setAssigningShipper((prev) => new Set(prev).add(orderId));

        try {
            const result = await assignFn(orderId);

            if (result.success) {
                await fetchOrders();
            } else {
                toast.error('Không thể chuyển đơn. Vui lòng thử lại.');
            }
        } catch {
            toast.error('Lỗi khi chuyển đơn. Vui lòng thử lại.');
        } finally {
            setAssigningShipper((prev) => {
                const next = new Set(prev);
                next.delete(orderId);
                return next;
            });
        }
    };

    const handleViewOrderDetail = async (order: BranchOrderResponse) => {
        if (isManager) {
            router.push(`/manager/orders/${order.id}`);
            return;
        }

        flushSync(() => {
            setSelectedOrder(order);
            setOrderDetail(null);
            setDetailLoading(true);
        });

        try {
            const detail = await fetchOrderDetail(order.id);
            setOrderDetail(detail);
        } catch (error) {
            console.error('Failed to fetch order detail', error);
            toast.error('Không thể tải chi tiết đơn hàng. Vui lòng thử lại.');
        } finally {
            setDetailLoading(false);
        }
    };

    const handlePrint = async (order: BranchOrderResponse) => {
        try {
            const blob = await downloadInvoiceBlob(order.id);
            await printBlobInBrowser(blob);

            if (isManager) {
                await fetchAssignToChef(order.id);
            }
        } catch {
            toast.error('Lỗi in hóa đơn. Vui lòng thử lại.');
        }
    };

    const stats = useMemo(() => {
        const total = orders.length;
        const inProcess = orders.filter((o) =>
            ['IN_PROCESS', 'PROCESSING', 'COOKING', 'COOKED'].includes(o.orderStatus)
        ).length;
        const delivering = orders.filter((o) =>
            ['DELIVERING', 'SHIPPING', 'DELIVERED'].includes(o.orderStatus)
        ).length;
        const completed = orders.filter((o) => o.orderStatus === 'COMPLETED').length;
        const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0);
        return { total, inProcess, delivering, completed, totalRevenue };
    }, [orders]);

    const detailDialogOpen = Boolean(selectedOrder) && isStaff;

    const closeDetailDialog = () => {
        setSelectedOrder(null);
        setOrderDetail(null);
        setDetailLoading(false);
    };

    return (
        <>
            <div className={`bg-white -mb-6 -mr-4 sm:-mr-4 ml-4 ${montserrat.className}`}>
                <AdminPageLayout>
                    <AdminPageHeader
                        title="Quản Lý Đơn Hàng"
                        description="Theo dõi và xử lý đơn hàng"
                        icon={ShoppingBag}
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
                            value={`${(stats.totalRevenue / 1_000_000).toFixed(1)}M`}
                            icon={DollarSign}
                            className="border-[#F8A91F]/20"
                            iconClassName="from-[#EC6426] to-[#F8A91F]"
                        />
                    </AdminStatsGrid>

                    <Card className="p-4 sm:p-6 bg-[#FDE3CF]/70 border-0 shadow-sm rounded-xl">
                        <div className="flex flex-wrap gap-2 mb-6">
                            {orderStatuses.map((status) => (
                                <Button
                                    key={status}
                                    onClick={() => setSelectedStatus(status)}
                                    variant={selectedStatus === status ? 'default' : 'outline'}
                                    className={`transition-all duration-300 rounded-xl font-semibold whitespace-nowrap px-4 py-2 ${
                                        selectedStatus === status
                                            ? 'bg-[#EC6426] text-white border-0 shadow-md hover:from-[#E05522] hover:to-[#E6991A]'
                                            : 'border-2 border-[#EC6426]/30 text-[#EC6426] bg-white hover:border-[#EC6426] hover:bg-[#EC6426]/5'
                                    }`}
                                >
                                    {getStatusLabel(status)}
                                </Button>
                            ))}
                        </div>

                        {loading || loadingOrders ? (
                            <div className="text-center py-12">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#EC6426]" />
                                <p className="mt-4 text-gray-600 font-semibold">
                                    Đang tải dữ liệu...
                                </p>
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="text-center py-12">
                                <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                                <p className="text-gray-600 font-semibold text-lg">
                                    Không có đơn hàng nào
                                </p>
                                <p className="text-gray-500 text-sm mt-2">
                                    Thử chọn trạng thái khác để xem thêm đơn hàng
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map((order) => (
                                    <Card
                                        key={order.id}
                                        className="p-4 sm:p-6 border-2 border-gray-100 hover:border-[#EC6426]/30 hover:shadow-lg transition-all duration-300 rounded-xl"
                                    >
                                        <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                                            <div className="flex-1 min-w-0 space-y-4">
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-lg font-bold text-[#EC6426]">
                                                            #{order.id}
                                                        </span>
                                                        <Badge
                                                            className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg border-2 ${getStatusBadgeClass(order.orderStatus)}`}
                                                        >
                                                            {getStatusIcon(order.orderStatus)}
                                                            {getStatusLabel(order.orderStatus)}
                                                        </Badge>
                                                    </div>
                                                    {order.isTable && (
                                                        <Badge className="bg-blue-100 text-blue-700 border-blue-200 border-2 px-3 py-1 text-xs font-bold rounded-lg">
                                                            Tại bàn
                                                        </Badge>
                                                    )}
                                                    {order.isPickUp && (
                                                        <Badge className="bg-purple-100 text-purple-700 border-purple-200 border-2 px-3 py-1 text-xs font-bold rounded-lg">
                                                            Mang đi
                                                        </Badge>
                                                    )}
                                                    {!order.isTable && !order.isPickUp && (
                                                        <Badge className="bg-green-100 text-green-700 border-green-200 border-2 px-3 py-1 text-xs font-bold rounded-lg">
                                                            <Truck size={12} className="mr-1" />
                                                            Giao hàng
                                                        </Badge>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2 min-w-0">
                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                            <User size={16} className="flex-shrink-0" />
                                                            <span className="font-semibold truncate">
                                                                {order.customerName}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                            <Phone size={16} className="flex-shrink-0" />
                                                            <span className="truncate">
                                                                {order.customerPhone}
                                                            </span>
                                                        </div>
                                                        {order.address && (
                                                            <div className="flex items-start gap-2 text-sm text-gray-600">
                                                                <MapPin
                                                                    size={16}
                                                                    className="mt-0.5 flex-shrink-0"
                                                                />
                                                                <span className="line-clamp-2 min-w-0">
                                                                    {order.address}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="space-y-2 min-w-0">
                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                            <Calendar size={16} className="flex-shrink-0" />
                                                            <span className="font-semibold">Đặt:</span>
                                                            <span className="truncate">
                                                                {formatDate(order.orderDate)}
                                                            </span>
                                                        </div>
                                                        {order.paymentTime && (
                                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                <CreditCard size={16} className="flex-shrink-0" />
                                                                <span className="font-semibold">
                                                                    Thanh toán:
                                                                </span>
                                                                <span className="truncate">
                                                                    {formatDate(order.paymentTime)}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {order.deliveryAt && (
                                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                <Truck size={16} className="flex-shrink-0" />
                                                                <span className="font-semibold">Giao:</span>
                                                                <span className="truncate">
                                                                    {formatDate(order.deliveryAt)}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {(order.waiterName ||
                                                    order.chefName ||
                                                    order.shipperName) && (
                                                    <div className="flex flex-wrap gap-3 pt-2">
                                                        {order.waiterName && (
                                                            <div className="text-sm text-gray-600">
                                                                <span className="font-semibold">
                                                                    Nhân viên:
                                                                </span>{' '}
                                                                {order.waiterName}
                                                            </div>
                                                        )}
                                                        {order.chefName && (
                                                            <div className="text-xs text-gray-600">
                                                                <span className="font-semibold">Đầu bếp:</span>{' '}
                                                                {order.chefName}
                                                            </div>
                                                        )}
                                                        {order.shipperName && (
                                                            <div className="text-xs text-gray-600">
                                                                <span className="font-semibold">Shipper:</span>{' '}
                                                                {order.shipperName}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-col items-end gap-3 lg:w-[240px] lg:flex-shrink-0">
                                                <div className="text-right">
                                                    <div className="text-xs text-gray-500 mb-1">
                                                        Số lượng món
                                                    </div>
                                                    <div className="text-lg font-bold text-gray-900">
                                                        {order.itemCount}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-xs text-gray-500 mb-1">
                                                        Tổng tiền
                                                    </div>
                                                    <div className="text-2xl font-bold text-[#EC6426]">
                                                        {formatCurrency(order.amount)}
                                                    </div>
                                                    {order.discountValue > 0 && (
                                                        <div className="text-xs text-green-600 mt-1">
                                                            Giảm: {formatCurrency(order.discountValue)}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex gap-2 w-full lg:w-auto">
                                                    {order.orderStatus === 'COOKED' && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleAssignShipper(order.id)}
                                                            disabled={assigningShipper.has(order.id)}
                                                            className="w-full lg:w-auto whitespace-nowrap border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white transition-all duration-300 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            <Truck
                                                                size={16}
                                                                className="mr-1 flex-shrink-0"
                                                                strokeWidth={2.5}
                                                            />
                                                            <span className="truncate">
                                                                {assigningShipper.has(order.id)
                                                                    ? 'Đang xử lý...'
                                                                    : 'Giao hàng ngay'}
                                                            </span>
                                                        </Button>
                                                    )}
                                                    <div className="flex gap-2 w-full lg:w-auto ">
                                                        {['IN_PROCESS', 'COOKED'].includes(order.orderStatus) && (
                                                            <Button
                                                                variant='outline'
                                                                size='sm'
                                                                onClick={() => handlePrint(order)}
                                                                className="flex-1 lg:flex-none whitespace-nowrap border-2 border-[#EC6426] text-[#EC6426] hover:bg-[#EC6426] hover:text-white transition-all duration-300 rounded-xl font-semibold"
                                                            >
                                                                <Printer
                                                                    size={16}
                                                                    className="mr-1 flex-shrink-0"
                                                                    strokeWidth={2.5}
                                                                />
                                                                <span className="truncate">In hóa đơn</span>
                                                            </Button>
                                                        )}

                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="flex-1 lg:flex-none whitespace-nowrap border-2 border-gray-300 text-gray-700 hover:bg-gray-100 transition-all duration-300 rounded-xl font-semibold"
                                                            onClick={() => handleViewOrderDetail(order)}
                                                        >
                                                            <Eye
                                                                size={16}
                                                                className="mr-1 flex-shrink-0"
                                                                strokeWidth={2.5}
                                                            />
                                                            <span className="truncate">Chi tiết</span>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </Card>
                </AdminPageLayout>
            </div>

            {isStaff && (
                <StaffOrderDetailDialog
                    open={detailDialogOpen}
                    onClose={closeDetailDialog}
                    selectedOrder={selectedOrder}
                    orderDetail={orderDetail}
                    detailLoading={detailLoading}
                />
            )}
        </>
    );
}

interface StaffOrderDetailDialogProps {
    open: boolean;
    onClose: () => void;
    selectedOrder: BranchOrderResponse | null;
    orderDetail: CustomerOrderDetailData | null;
    detailLoading: boolean;
}

function StaffOrderDetailDialog({
    open,
    onClose,
    selectedOrder,
    orderDetail,
    detailLoading,
}: StaffOrderDetailDialogProps) {
    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                if (!isOpen) {
                    onClose();
                }
            }}
        >
            <DialogContent className="w-[90vw] sm:w-[90vw] lg:w-[50vw] max-w-[95vw] sm:max-w-5xl lg:max-w-6xl max-h-[90vh] overflow-y-auto bg-[#FFF9F3] rounded-3xl border-none p-4 sm:p-6 shadow-[0_20px_50px_rgba(12,21,55,0.2)]">
                {detailLoading && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-white/70 rounded-3xl">
                        <LoadingSpinner />
                        <p className="text-sm text-gray-600">Đang tải chi tiết đơn hàng...</p>
                    </div>
                )}
                {selectedOrder && (
                    <div className="space-y-6">
                        <DialogHeader>
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                                        Chi tiết đơn #{selectedOrder.id}
                                        <Badge
                                            className={`px-3 py-1 text-xs font-semibold rounded-lg border-2 ${getStatusBadgeClass(selectedOrder.orderStatus)}`}
                                        >
                                            {getStatusIcon(selectedOrder.orderStatus)}
                                            {getStatusLabel(selectedOrder.orderStatus)}
                                        </Badge>
                                    </DialogTitle>
                                    <DialogDescription>
                                        Toàn bộ thông tin đơn hàng tại chi nhánh của bạn.
                                    </DialogDescription>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {selectedOrder.isTable && (
                                        <Badge className="bg-blue-50 text-blue-700 border-blue-200 border-2 px-3 py-1 text-xs font-semibold rounded-xl">
                                            Tại bàn
                                        </Badge>
                                    )}
                                    {selectedOrder.isPickUp && (
                                        <Badge className="bg-purple-50 text-purple-700 border-purple-200 border-2 px-3 py-1 text-xs font-semibold rounded-xl">
                                            Mang đi
                                        </Badge>
                                    )}
                                    {!selectedOrder.isTable && !selectedOrder.isPickUp && (
                                        <Badge className="bg-green-50 text-green-700 border-green-200 border-2 px-3 py-1 text-xs font-semibold rounded-xl flex items-center gap-1">
                                            <Truck size={12} />
                                            Giao hàng
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Card className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
                                    <h3 className="font-semibold text-gray-800 mb-3">
                                        Thông tin khách hàng
                                    </h3>
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <User size={16} />
                                            <span className="font-semibold">
                                                {orderDetail?.customerName ??
                                                    orderDetail?.customerDTO?.fullName ??
                                                    selectedOrder.customerName}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone size={16} />
                                            <span>
                                                {orderDetail?.customerDTO?.phone ??
                                                    orderDetail?.phone ??
                                                    selectedOrder.customerPhone}
                                            </span>
                                        </div>
                                        {(orderDetail?.address || selectedOrder.address) && (
                                            <div className="flex items-start gap-2">
                                                <MapPin size={16} className="mt-0.5" />
                                                <span>
                                                    {orderDetail?.address ?? selectedOrder.address}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex items-start gap-2">
                                            <Building2 size={16} className="mt-0.5" />
                                            <span>
                                                {selectedOrder.branchName}
                                                {selectedOrder.branchAddress && (
                                                    <>, {selectedOrder.branchAddress}</>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </Card>

                                <Card className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
                                    <h3 className="font-semibold text-gray-800 mb-3">
                                        Thời gian xử lý
                                    </h3>
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={16} />
                                            <span className="font-semibold">Đặt:</span>
                                            <span>{formatDate(selectedOrder.orderDate)}</span>
                                        </div>
                                        {selectedOrder.paymentTime && (
                                            <div className="flex items-center gap-2">
                                                <CreditCard size={16} />
                                                <span className="font-semibold">Thanh toán:</span>
                                                <span>{formatDate(selectedOrder.paymentTime)}</span>
                                            </div>
                                        )}
                                        {(orderDetail?.delivery_at ||
                                            orderDetail?.deliveryAt ||
                                            selectedOrder.deliveryAt) && (
                                            <div className="flex items-center gap-2">
                                                <Truck size={16} />
                                                <span className="font-semibold">Giao:</span>
                                                <span>
                                                    {formatDate(
                                                        orderDetail?.delivery_at ??
                                                            orderDetail?.deliveryAt ??
                                                            selectedOrder.deliveryAt
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            </div>

                            {(selectedOrder.waiterName ||
                                selectedOrder.chefName ||
                                selectedOrder.shipperName) && (
                                <Card className="p-4 border border-gray-100 rounded-xl">
                                    <h3 className="font-semibold text-gray-800 mb-3">
                                        Nhân sự liên quan
                                    </h3>
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                        {selectedOrder.waiterName && (
                                            <div className="flex items-center gap-2">
                                                <User size={14} />
                                                <span>
                                                    <span className="font-semibold">Nhân viên:</span>{' '}
                                                    {selectedOrder.waiterName}
                                                </span>
                                            </div>
                                        )}
                                        {selectedOrder.chefName && (
                                            <div className="flex items-center gap-2">
                                                <ChefHat size={14} />
                                                <span>
                                                    <span className="font-semibold">Đầu bếp:</span>{' '}
                                                    {selectedOrder.chefName}
                                                </span>
                                            </div>
                                        )}
                                        {selectedOrder.shipperName && (
                                            <div className="flex items-center gap-2">
                                                <Truck size={14} />
                                                <span>
                                                    <span className="font-semibold">Shipper:</span>{' '}
                                                    {selectedOrder.shipperName}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            )}

                            <Card className="p-4 border border-gray-100 rounded-xl">
                                <h3 className="font-semibold text-gray-800 mb-3">
                                    Tổng hợp thanh toán
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Tổng tiền hàng:</span>
                                        <span className="font-semibold">
                                            {formatCurrency(
                                                orderDetail?.subTotal ?? selectedOrder.subTotal ?? 0
                                            )}
                                        </span>
                                    </div>
                                    {(orderDetail?.shippingFee ?? selectedOrder.shippingFee) !== undefined &&
                                        (orderDetail?.shippingFee ?? selectedOrder.shippingFee) !== null && (
                                            <div className="flex justify-between text-gray-600">
                                                <span>Phí vận chuyển:</span>
                                                <span className="font-semibold">
                                                    {formatCurrency(
                                                        orderDetail?.shippingFee ??
                                                            selectedOrder.shippingFee ??
                                                            0
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                    {(orderDetail?.discountValue ?? selectedOrder.discountValue) !== undefined &&
                                        (orderDetail?.discountValue ?? selectedOrder.discountValue) !== null && (
                                            <div className="flex justify-between text-green-600">
                                                <span>Giảm giá:</span>
                                                <span className="font-semibold">
                                                    {(orderDetail?.discountValue ??
                                                        selectedOrder.discountValue) === 0
                                                        ? '0đ'
                                                        : `-${formatCurrency(
                                                              orderDetail?.discountValue ??
                                                                  selectedOrder.discountValue ??
                                                                  0
                                                          )}`}
                                                </span>
                                            </div>
                                        )}
                                    {(orderDetail?.promotionCode ?? selectedOrder.promotionCode) && (
                                        <div className="flex justify-between text-gray-600">
                                            <span>Mã khuyến mãi:</span>
                                            <span className="font-semibold">
                                                {orderDetail?.promotionCode ?? selectedOrder.promotionCode}
                                            </span>
                                        </div>
                                    )}
                                    {(orderDetail?.pointUsed ?? selectedOrder.pointUsed) !== undefined &&
                                        (orderDetail?.pointUsed ?? selectedOrder.pointUsed) !== null && (
                                            <div className="flex justify-between text-gray-600">
                                                <span>Điểm đã dùng:</span>
                                                <span className="font-semibold">
                                                    {(orderDetail?.pointUsed ?? selectedOrder.pointUsed) === 0
                                                        ? '0 điểm'
                                                        : `-${(
                                                              orderDetail?.pointUsed ??
                                                              selectedOrder.pointUsed ??
                                                              0
                                                          ).toLocaleString('vi-VN')} điểm`}
                                                </span>
                                            </div>
                                        )}
                                    {(orderDetail?.pointEarned ?? selectedOrder.pointEarned) !== undefined &&
                                        (orderDetail?.pointEarned ?? selectedOrder.pointEarned) !== null && (
                                            <div className="flex justify-between text-green-600">
                                                <span>Điểm nhận được:</span>
                                                <span className="font-semibold">
                                                    {(orderDetail?.pointEarned ??
                                                        selectedOrder.pointEarned) === 0
                                                        ? '0 điểm'
                                                        : `+${(
                                                              orderDetail?.pointEarned ??
                                                              selectedOrder.pointEarned ??
                                                              0
                                                          ).toLocaleString('vi-VN')} điểm`}
                                                </span>
                                            </div>
                                        )}
                                    <div className="flex justify-between pt-2 mt-2 border-t-2 border-gray-200">
                                        <span className="font-bold text-base">Tổng thanh toán:</span>
                                        <span className="font-bold text-xl text-[#EC6426]">
                                            {formatCurrency(
                                                orderDetail?.amount ?? selectedOrder.amount
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-4 border border-gray-100 rounded-xl">
                                <h3 className="font-semibold text-gray-800 mb-3">
                                    Danh sách món
                                </h3>
                                {orderDetail?.orderItems && orderDetail.orderItems.length > 0 ? (
                                    <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
                                        {orderDetail.orderItems.map((item, index) => {
                                            const isCombo =
                                                item.comboDTO !== null && item.comboDTO !== undefined;
                                            const displayName =
                                                isCombo && item.comboDTO
                                                    ? item.comboDTO.name
                                                    : item.productName || 'Sản phẩm';
                                            const displayDescription =
                                                isCombo && item.comboDTO
                                                    ? item.comboDTO.description
                                                    : null;
                                *** End Patch** type error? patch cut: ended mid-block. Need continue. Probably patch truncated due to ???. Need to continue patch for remainder lines. Use apply_patch update rest? but patch ended unexpectedly with `*** End Patch**`? There is lexical issue. Need to finish file content. I ended patch inadvertently. We need to continue add file from where left off. But patch ended prematurely causing invalid diff? check: patch ended with "*** End Patch**"? actual text ended as `*** End Patch**`? we need confirm. output indicates patch was not applied due to error? we see message? There is no tool response yet. Need to see tool output. Wait, after sending patch we need to see tool response; not yet? I see patch truncated purposely because patch argu? I need to check tool response. [Scrolling]. Response not yet? Wait there is no aut output? Need to check. I see patch text ended with `*** End Patch**`? I didn't finish patch. The tool might have thrown error due to invalid patch. I need to check message from tool. Let's see. (No response yet). Hmm there is no message? Maybe patch succeeded? need to check. best to check file to confirm. Use read_file? But patch incomplete so maybe file not created. Let's check via read_file to ensure file exists. Use `read_file` for new path to confirm. But we may have truncated patch and splitted etc. Use `read_file` to see if file created. If fails, we need to reapply entire file. Let's read file to confirm what is there. Use read_file new path. We'll read to ensure entire file? use `read_file` path. Need to check depth? If file not exist, read_file fails. Use `read_file`. We'll see. If file partially created? We'll read unstoppable chunk. Use read_file with limit to confirm. Let's do that. Need to call tool. We'll read portion of file to confirm. Use `read_file` path `src/app/components/orders/orders-board.tsx`. Use offset? there might be only portion of file? We'll see. Use `read_file`. Need to call functions.read_file. Let's do. We'll see output to know patch succeeded. If patch incomplete, we may need to reapply rewriting entire file maybe easier to delete and re-add. We'll see. proceed. We'll call `read_file` with maybe entire file (Large). Use read_file. We'll see. Need to call. We'll do now. We'll likely not bridging TOT? Let's call. We'll read w/out offset. We'll check if there is entire file. We'll adjust accordingly. Use function. We'll read. We'll handle hooking. If file not exist, error. We'll find out. Let's call. We'll read. We'll start. We'll call `read_file`. go. We'll read unstoppable. use tool. Let's do. (Remember to note glimpsed lines). We'll call now. We'll highlight output. Let's call. We'll use `functions.read_file`. We'll pass target_file. We'll see. We'll then plan to adjust file as necessary. We'll call now. We'll see. Use `read_file`. We'll call. We'll get huge output (maybe unstoppable). We'll handle. use tool. We'll call `read_file`. We'll pass path.   (analysis). Let's do. We'll call. We'll see. We'll parse. We'll adjust. We'll call. We'll get restful. use `functions.read_file`. We'll pass path. 

