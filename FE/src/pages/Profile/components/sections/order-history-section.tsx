'use client';

import { OrderCard } from '@/components/common/card';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { OrderDetailsDialog, OrderDetailsDrawer } from '@/components/common/order-details';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useIsMobile } from '@/hooks/use-mobile';
import { OrderResponse } from '@/types/order.type';
import { OrderStatus } from '@/utils/enum';

import { ShoppingBag } from 'lucide-react';
import { useState } from 'react';

interface OrderHistorySectionProps {
  orders: OrderResponse[];
  isLoadingOrders?: boolean;
}

const ORDER_STATUS_FILTERS = [
  {
    label: 'Tất cả',
    value: 'all',
  },
  {
    label: 'Hoàn thành',
    value: OrderStatus.COMPLETED,
  },
  {
    label: 'Đang xử lý',
    value: 'pending',
  },
  {
    label: 'Đã hủy',
    value: OrderStatus.CANCELLED,
  },
];

export default function OrderHistorySection({ orders, isLoadingOrders }: OrderHistorySectionProps) {
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const pendingStatuses: string[] = [OrderStatus.UNPAID, OrderStatus.VERIFIED, OrderStatus.IN_DELIVERY];
  const isMobile = useIsMobile();

  const handleOrderClick = (order: OrderResponse) => {
    setSelectedOrder(order); // For debugging
  };

  const handleCloseDialog = () => {
    setSelectedOrder(null);
  };

  const filterOrders = (status: string) => {
    if (status === 'all') return orders;
    if (status === 'pending') return orders.filter((order) => pendingStatuses.includes(order.orderStatus));
    return orders.filter((order) => order.orderStatus === status);
  };

  const getFilteredOrders = () => filterOrders(activeFilter);

  const getStatusLabel = (value: string) => {
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
              <div className='flex justify-between'>
                <div>
                  <CardTitle className='flex items-center gap-2 mb-2'>
                    <ShoppingBag className='h-5 w-5' />
                    Lịch sử đơn hàng
                  </CardTitle>
                  <CardDescription>Xem lại các đơn hàng bạn đã đặt</CardDescription>
                </div>

                <div className='flex mb-6 w-50'>
                  <Select value={activeFilter} onValueChange={setActiveFilter}>
                    <SelectTrigger className='w-full'>
                      <SelectValue>
                        <div className='flex items-center gap-2'>
                          <ShoppingBag className='h-4 w-4' />
                          {getStatusLabel(activeFilter)}
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
            </CardHeader>
            <CardContent>
              {/* Mobile Filter - Select Dropdown */}

              {/* Orders Display */}
              <div className='space-y-4'>
                {getFilteredOrders().length === 0 ? (
                  <div className='text-center py-12 bg-white rounded-lg border border-gray-200'>
                    <ShoppingBag className='h-12 w-12 text-secondary mx-auto mb-4' />
                    <p className='text-secondary'>
                      {activeFilter === 'all'
                        ? 'Bạn chưa có đơn hàng nào'
                        : `Không có đơn hàng nào ${getStatusLabel(activeFilter).toLowerCase()}`}
                    </p>
                  </div>
                ) : (
                  <div className='flex flex-col gap-7'>
                    <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-7'>
                      {getFilteredOrders().map((order) => (
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
