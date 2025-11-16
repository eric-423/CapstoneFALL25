'use client';

import { OrderCard } from '@/components/common/card';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { OrderDetailsDialog, OrderDetailsDrawer } from '@/components/common/order-details';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useIsMobile } from '@/utils/hooks/use-mobile';
import { OrderResponse } from '@/apis/order.api';
import { CustomerOrderStatusUpdate } from '@/utils/hooks/useCustomerOrderSocket';
import { CustomerOrderStatus } from '@/utils/hooks/useCustomerOrders';

import { Badge } from '@/components/ui/badge';

import { ShoppingBag, Wifi, WifiOff } from 'lucide-react';
import { useEffect, useState } from 'react';

interface OrderHistorySectionProps {
    orders: OrderResponse[];
    isLoadingOrders?: boolean;
    isFetchingOrders?: boolean;
    isRealtimeConnected?: boolean;
    lastRealtimeUpdate?: CustomerOrderStatusUpdate | null;
    statusFilter: CustomerOrderStatus;
    onStatusChange: (status: CustomerOrderStatus) => void;
}

const ORDER_STATUS_FILTERS: { label: string; value: CustomerOrderStatus }[] = [
    { label: 'Tất cả', value: 'ALL' },
    { label: 'Đã tạo', value: 'CREATED' },
    { label: 'Đang nấu', value: 'COOKING' },
    { label: 'Đã nấu xong', value: 'COOKED' },
    { label: 'Đang xử lý', value: 'IN_PROCESS' },
    { label: 'Đang giao', value: 'SHIPPING' },
    { label: 'Đã giao', value: 'DELIVERED' },
    { label: 'Hoàn tất', value: 'COMPLETED' },
    { label: 'Đã hủy', value: 'CANCEL' },
    { label: 'Đã thanh toán', value: 'PAID' },
];

export default function OrderHistorySection({
    orders,
    isLoadingOrders,
    isFetchingOrders,
    isRealtimeConnected,
    lastRealtimeUpdate,
    statusFilter,
    onStatusChange,
}: OrderHistorySectionProps) {
    const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);
    const isMobile = useIsMobile();
    const latestRealtimeTimestamp = lastRealtimeUpdate?.timestamp ? new Date(lastRealtimeUpdate.timestamp) : null;

    const handleOrderClick = (order: OrderResponse) => {
        setSelectedOrder(order); // For debugging
    };

    const handleCloseDialog = () => {
        setSelectedOrder(null);
    };

    useEffect(() => {
        if (!selectedOrder) return;
        const updatedOrder = orders.find((order) => order.id === selectedOrder.id);

        if (!updatedOrder) {
            setSelectedOrder(null);
            return;
        }

        if (updatedOrder !== selectedOrder) {
            setSelectedOrder(updatedOrder);
        }
    }, [orders, selectedOrder]);

    const getStatusLabel = (value: CustomerOrderStatus) => {
        const status = ORDER_STATUS_FILTERS.find((s) => s.value === value);
        return status ? status.label : value;
    };

    return (
        <div className='space-y-6'>
            <Card>
                {isLoadingOrders ? (
                    <div className='flex items-center justify-center min-h-screen'>
                        <LoadingSpinner />
                    </div>
                ) : (
                    <>
                        <CardHeader>
                            <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
                                <div>
                                    <CardTitle className='flex items-center gap-2 mb-2'>
                                        <ShoppingBag className='h-5 w-5' />
                                        Lịch sử đơn hàng
                                    </CardTitle>
                                    {/* <CardDescription>Xem lại các đơn hàng bạn đã đặt</CardDescription> */}
                                    {lastRealtimeUpdate && (
                                        <p className='text-xs text-muted-foreground mt-2'>
                                            Cập nhật mới nhất: đơn #{lastRealtimeUpdate.orderId}{' '}
                                            {latestRealtimeTimestamp
                                                ? `lúc ${latestRealtimeTimestamp.toLocaleTimeString()}`
                                                : ''}
                                        </p>
                                    )}
                                </div>

                                <div className='flex flex-col gap-3 w-full lg:w-auto'>
                                    {/* này test connect */}

                                    {/* {typeof isRealtimeConnected === 'boolean' && (
                                        <Badge
                                            variant={isRealtimeConnected ? 'secondary' : 'outline'}
                                            className='self-end flex items-center gap-1 text-xs'
                                        >
                                            {isRealtimeConnected ? (
                                                <>
                                                    <Wifi className='h-3 w-3' />
                                                    Đang đồng bộ
                                                </>
                                            ) : (
                                                <>
                                                    <WifiOff className='h-3 w-3' />
                                                    Mất kết nối
                                                </>
                                            )}
                                        </Badge>
                                    )} */}

                                    <div className='flex w-full sm:w-60'>
                                        <Select
                                            value={statusFilter}
                                            onValueChange={(value) => onStatusChange(value as CustomerOrderStatus)}
                                        >
                                            <SelectTrigger className='w-full'>
                                                <SelectValue>
                                                    <div className='flex items-center gap-2'>
                                                        <ShoppingBag className='h-4 w-4' />
                                                        {getStatusLabel(statusFilter)}
                                                    </div>
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {ORDER_STATUS_FILTERS.map((status) => (
                                                    <SelectItem key={status.value} value={status.value}>
                                                        <div className='flex items-center gap-2'>{status.label}</div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {/* Mobile Filter - Select Dropdown */}

                            {/* Orders Display */}
                            <div className='space-y-4'>
                                {isFetchingOrders && !isLoadingOrders && (
                                    <div className='flex items-center justify-center py-4'>
                                        <LoadingSpinner size='sm' />
                                    </div>
                                )}
                                {orders.length === 0 ? (
                                    <div className='text-center py-12 bg-white rounded-lg border border-gray-200'>
                                        <ShoppingBag className='h-12 w-12 text-secondary mx-auto mb-4' />
                                        <p className='text-secondary'>
                                            {statusFilter === 'ALL'
                                                ? 'Bạn chưa có đơn hàng nào'
                                                : `Không có đơn hàng nào ${getStatusLabel(statusFilter).toLowerCase()}`}
                                        </p>
                                    </div>
                                ) : (
                                    <div className='flex flex-col gap-7'>
                                        <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-7'>
                                            {orders.map((order) => (
                                                <OrderCard key={order.id} order={order} onViewDetails={() => handleOrderClick(order)} />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </>
                )}
            </Card>

            {selectedOrder !== null &&
                (isMobile ? (
                    <OrderDetailsDrawer order={selectedOrder} open={!!selectedOrder} onClose={handleCloseDialog} />
                ) : (
                    <OrderDetailsDialog order={selectedOrder} open={!!selectedOrder} onClose={handleCloseDialog} />
                ))}
        </div>
    );
}