'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCustomerOrders } from '@/utils/hooks/useCustomerOrders';
import { OrderResponse } from '@/apis/order.api';
import { Calendar, CheckCircle2, Clock, Home, MapPin, Phone, Receipt, User } from 'lucide-react';
import { useState } from 'react';

import { CancelOrderDialog } from '../cancel-order';
import { LoadingSpinner } from '../loading-spinner';
import OrderProgressTracker from '../order-progress-tracker';
import OrderLiveTrackingCard from '../order-live-tracking-card';

interface OrderDetailsDialogProps {
  order: OrderResponse;
  open: boolean;
  onClose: () => void;
}

export function OrderDetailsDialog({ order, open, onClose }: OrderDetailsDialogProps) {
  const { isCancelingOrder } = useCustomerOrders();
  const [closable, setClosable] = useState(open);

  const withdrawable = ['UNPAID', 'CREATED', 'VERIFIED'];

  const statusLabelMap: Record<string, string> = {
    UNPAID: 'Chờ xác nhận',
    CREATED: 'Đã tạo đơn',
    VERIFIED: 'Đã xác nhận',
    COOKING: 'Đang nấu',
    COOKED: 'Đã nấu xong',
    IN_PROCESS: 'Đang xử lý',
    SHIPPING: 'Đang giao',
    DELIVERED: 'Đã giao',
    COMPLETED: 'Hoàn tất',
    CANCEL: 'Đã hủy',
    CANCELLED: 'Đã hủy',
  };

  const getStatusBadge = (status: string) => {
    const normalized = status?.toUpperCase?.() || '';
    if (!normalized) return null;

    if (normalized === 'UNPAID' || normalized === 'CREATED' || normalized === 'VERIFIED') {
      return <Badge className='bg-yellow-500 text-white'>{statusLabelMap[normalized] || normalized}</Badge>;
    }
    if (['COOKING', 'COOKED', 'IN_PROCESS', 'SHIPPING', 'DELIVERED'].includes(normalized)) {
      return <Badge className='bg-blue-500 text-white'>{statusLabelMap[normalized] || normalized}</Badge>;
    }
    if (normalized === 'COMPLETED' || normalized === 'PAID') {
      return <Badge className='bg-green-500 text-white'>{statusLabelMap[normalized] || 'Đã hoàn tất'}</Badge>;
    }
    if (normalized === 'CANCEL' || normalized === 'CANCELLED') {
      return <Badge className='bg-red-500 text-white'>{statusLabelMap[normalized]}</Badge>;
    }
    return <Badge className='bg-gray-500 text-white'>{normalized}</Badge>;
  };

  const redirectToPayment = () => {
    window.location.href = `https://pay.payos.vn/web/${order.payment_code}`;
  };

  // Get payment status badge
  const getPaymentStatusBadge = (status: string) => {
    const normalized = status?.toUpperCase?.() || '';
    if (!normalized) return null;
    if (normalized === 'PAID' || normalized === 'COMPLETED') {
      return <Badge className='bg-green-500 text-white'>Đã thanh toán</Badge>;
    }
    if (normalized === 'UNPAID') {
      return <Badge className='bg-yellow-500 text-white'>Chưa thanh toán</Badge>;
    }
    return null;
  };

  // Handle cancel order
  const handleCancelledOrder = () => {
    setClosable(true);
  };

  if (!order) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={(isOpen) => closable && !isOpen && onClose()}>
        {isCancelingOrder ? (
          <DialogContent className='max-w-[80rem] sm:max-w-[80rem] w-full max-h-[90vh] overflow-y-auto'>
            <div className='flex items-center justify-center h-full'>
              <div className='text-center'>
                <LoadingSpinner />
                <p className='text-red-500 mt-5'>Đang xử lý hủy đơn hàng...</p>
              </div>
            </div>
          </DialogContent>
        ) : (
          <>
            <DialogContent className='max-w-[80rem] sm:max-w-[80rem] w-full max-h-[90vh] overflow-y-auto'>
              <DialogHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <DialogTitle className='text-2xl font-bold'>Chi tiết đơn hàng</DialogTitle>
                    <DialogDescription className='sr-only'>
                      Hiển thị thông tin chi tiết và trạng thái theo thời gian thực của đơn hàng {order.id}.
                    </DialogDescription>
                  </div>
                  <div className='flex items-center gap-2'>
                    {getStatusBadge(order.orderStatus)}
                    {getPaymentStatusBadge(order.paymentStatus)}
                  </div>
                </div>
              </DialogHeader>

              <div className='space-y-6'>
                {/* Order information */}
                <Card className='border-none shadow-none bg-transparent p-0'>
                  <CardContent className='p-4 py-2'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-0'>
                      <div className='space-y-3'>
                        <div className='flex items-start'>
                          <User className='h-4 w-4 mr-2 text-primary mt-0.5' />
                          <div>
                            <p className='text-xs text-muted-foreground'>Tên khách hàng</p>
                            <p className='font-medium text-sm'>{order.customerName}</p>
                          </div>
                        </div>
                        <div className='flex items-start'>
                          <Phone className='h-4 w-4 mr-2 text-primary mt-0.5' />
                          <div>
                            <p className='text-xs text-muted-foreground'>Số điện thoại</p>
                            <p className='font-medium text-sm'>{order.customerPhone}</p>
                          </div>
                        </div>
                        <div className='flex items-start'>
                          <Receipt className='h-4 w-4 mr-2 text-primary mt-0.5' />
                          <div>
                            <p className='text-xs text-muted-foreground'>Mã đơn hàng</p>
                            <p className='font-medium text-sm'>{order.id}</p>
                          </div>
                        </div>
                        <div className='flex items-start'>
                          <MapPin className='h-4 w-4 mr-2 text-primary mt-0.5' />
                          <div>
                            <p className='text-xs text-muted-foreground'>Cửa hàng</p>
                            <p className='font-medium text-sm'>{order.branchName || order.restaurant}</p>
                            {order.branchAddress && (
                              <p className='text-xs text-muted-foreground mt-0.5'>{order.branchAddress}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className='space-y-3'>
                        <div className='flex items-start'>
                          <Calendar className='h-4 w-4 mr-2 text-primary mt-0.5' />
                          <div>
                            <p className='text-xs text-muted-foreground'>Thời gian đặt hàng</p>
                            <p className='font-medium text-sm'>{order.date.toLocaleString()}</p>
                          </div>
                        </div>
                        {order.address && (
                          <div className='flex items-start'>
                            <Home className='h-4 w-4 mr-2 text-primary mt-0.5' />
                            <div>
                              <p className='text-xs text-muted-foreground'>Địa chỉ giao hàng</p>
                              <p className='font-medium text-sm'>{order.address}</p>
                            </div>
                          </div>
                        )}
                        <div className='flex items-start'>
                          <Clock className='h-4 w-4 mr-2 text-primary mt-0.5' />
                          <div>
                            <p className='text-xs text-muted-foreground'>Thời gian nhận hàng</p>
                            <p className='font-medium text-sm'>{new Date(order.pickupTime).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>


                <OrderProgressTracker currentStatus={order.orderStatus} className='mb-6' />

                <OrderLiveTrackingCard
                  orderId={order.id}
                  initialStatus={order.orderStatus}
                  destinationAddress={order.address}
                />

                {/* <Card className='border-none shadow-sm gap-0'>
                  <CardHeader className='pb-0 m-0'>
                    <CardTitle className='text-lg flex items-center'>
                      <ShoppingBag className='h-5 w-5 mr-2 text-primary' />
                      Thông tin đơn hàng
                    </CardTitle>
                  </CardHeader>


                  <CardContent className='px-1'>
                    <div className='divide-y max-h-60 overflow-y-auto'>
                      {order.items.map((item) => (
                        <div key={item.productId} className='py-4 px-5 border-foreground/20 '>
                          <div className='flex justify-between items-start'>
                            <div className='flex-1'>
                              <h4 className='font-medium text-sm'>{item.productName}</h4>
                              {item.note && (
                                <p className='text-xs text-muted-foreground mt-1 whitespace-pre-line'>{item.note}</p>
                              )}
                            </div>

                            <div className='text-right'>
                              <div className='text-primary font-medium text-sm'>{item.price.toLocaleString()}đ</div>
                              <div className='text-xs text-muted-foreground mt-1'>x {item.quantity}</div>
                            </div>
                            
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>


                </Card>
 */}
                <Card className='border-none shadow-none bg-transparent px-5 py-0'>
                  <CardHeader className='p-0'>
                    <div className='flex justify-between font-medium'>
                      <CardTitle className='text-lg flex items-center'>
                        <Receipt className='h-5 w-5 mr-2 text-primary' />
                        Tổng thanh toán
                      </CardTitle>
                      <span className='text-lg text-primary font-bold'>{order.subTotal.toLocaleString()}đ</span>
                    </div>
                  </CardHeader>
                </Card>

                {/* Order status message */}
                {(order.orderStatus?.toUpperCase?.() || '') === 'COMPLETED' && (
                  <div className='flex items-center justify-center p-3 bg-green-50 rounded-lg border border-green-200'>
                    <CheckCircle2 className='h-4 w-4 mr-2 text-green-500' />
                    <span className='text-green-700 text-sm'>
                      Đơn hàng đã được giao thành công. Cảm ơn bạn đã sử dụng dịch vụ của Tấm Tắc!
                    </span>
                  </div>
                )}
              </div>

              <DialogFooter className='flex flex-col sm:flex-row gap-3'>
                {withdrawable.includes(order.orderStatus?.toUpperCase?.() || '') && (
                  <CancelOrderDialog
                    onCloseDialog={() => {
                      setClosable(true);
                    }}
                    onProceed={handleCancelledOrder}
                    orderId={order.id}
                  />
                )}
                {(order.orderStatus?.toUpperCase?.() || '') === 'UNPAID' && (
                  <Button variant='default' className='w-full sm:w-auto' onClick={redirectToPayment}>
                    Tiếp tục thanh toán
                  </Button>
                )}
                <Button className='w-full sm:w-auto bg-[#4CAF50] hover:bg-[#43A047] text-white' onClick={onClose}>
                  Tiếp tục đặt hàng
                </Button>
              </DialogFooter>
            </DialogContent>
          </>
        )}
      </Dialog >
    </>
  );
}
