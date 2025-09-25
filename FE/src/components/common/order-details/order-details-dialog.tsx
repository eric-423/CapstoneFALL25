'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCustomerOrders } from '@/hooks/useCustomerOrders';
import { OrderResponse } from '@/types/order.type';
import { OrderStatus } from '@/utils/enum';
import { STORE_INFO } from '@/utils/mockupData';

import { Calendar, CheckCircle2, Clock, MapPin, Phone, Receipt, ShoppingBag, User } from 'lucide-react';
import { useState } from 'react';

import { CancelOrderDialog } from '../cancel-order';
import { LoadingSpinner } from '../loading-spinner';
import OrderProgressTracker from '../order-progress-tracker';

interface OrderDetailsDialogProps {
  order: OrderResponse;
  open: boolean;
  onClose: () => void;
}

export function OrderDetailsDialog({ order, open, onClose }: OrderDetailsDialogProps) {
  const { isCancelingOrder } = useCustomerOrders();
  const [closable, setClosable] = useState(open);

  const withdrawable = [OrderStatus.UNPAID, OrderStatus.VERIFIED];

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case OrderStatus.UNPAID:
        return <Badge className='bg-yellow-500'>Chờ xác nhận</Badge>;
      case OrderStatus.PROCESSING || OrderStatus.VERIFIED || OrderStatus.IN_DELIVERY:
        return <Badge className='bg-blue-500'>{status}</Badge>;
      case OrderStatus.COMPLETED:
        return <Badge className='bg-green-500'>{OrderStatus.COMPLETED}</Badge>;
      case OrderStatus.CANCELLED:
        return <Badge className='bg-red-500'>{OrderStatus.CANCELLED}</Badge>;
      default:
        return null;
    }
  };

  const redirectToPayment = () => {
    window.location.href = `https://pay.payos.vn/web/${order.payment_code}`;
  };

  // Get payment status badge
  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case OrderStatus.PAID:
        return <Badge className='bg-green-500'>{OrderStatus.PAID}</Badge>;
      case OrderStatus.PROCESSING:
        return <Badge className='bg-yellow-500'>{OrderStatus.PROCESSING}</Badge>;
      default:
        return null;
    }
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
          <div>
            <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
              <div className='flex items-center justify-center h-full'>
                <div className='text-center'>
                  <LoadingSpinner />
                  <p className='text-red-500 mt-5'>Đang xử lý hủy đơn hàng...</p>
                </div>
              </div>
            </DialogContent>
          </div>
        ) : (
          <>
            <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
              <DialogHeader>
                <div className='flex items-center justify-between'>
                  <DialogTitle className='text-2xl font-bold'>Chi tiết đơn hàng</DialogTitle>
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
                      </div>
                      <div className='space-y-3'>
                        <div className='flex items-start'>
                          <Calendar className='h-4 w-4 mr-2 text-primary mt-0.5' />
                          <div>
                            <p className='text-xs text-muted-foreground'>Thời gian đặt hàng</p>
                            <p className='font-medium text-sm'>{order.date.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className='flex items-start'>
                          <MapPin className='h-4 w-4 mr-2 text-primary mt-0.5' />
                          <div>
                            <p className='text-xs text-muted-foreground'>Cửa hàng</p>
                            <p className='font-medium text-sm'>
                              {STORE_INFO.name} - {STORE_INFO.phone}
                            </p>
                          </div>
                        </div>
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

                {/* Order Progress Tracker */}
                <OrderProgressTracker currentStatus={order.orderStatus} className='mb-6' />

                {/* Order items */}
                <Card className='border-none shadow-sm gap-0'>
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

                {/* Order summary */}
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
                {order.orderStatus === OrderStatus.COMPLETED && (
                  <div className='flex items-center justify-center p-3 bg-green-50 rounded-lg border border-green-200'>
                    <CheckCircle2 className='h-4 w-4 mr-2 text-green-500' />
                    <span className='text-green-700 text-sm'>
                      Đơn hàng đã được giao thành công. Cảm ơn bạn đã sử dụng dịch vụ của Tấm Tắc!
                    </span>
                  </div>
                )}
              </div>

              <DialogFooter className='flex flex-col sm:flex-row gap-3'>
                {withdrawable.includes(order.orderStatus) && (
                  <CancelOrderDialog
                    onCloseDialog={() => {
                      setClosable(true);
                    }}
                    onProceed={handleCancelledOrder}
                    orderId={order.id}
                  />
                )}
                {order.orderStatus === OrderStatus.UNPAID && (
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
      </Dialog>
    </>
  );
}
