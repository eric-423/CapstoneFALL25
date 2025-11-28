'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { useCustomerOrders } from '@/utils/hooks/useCustomerOrders';
import { OrderResponse } from '@/apis/order.api';
import { Calendar, CheckCircle2, Clock, Home, Phone, Receipt, ShoppingBag, User, CreditCard, Truck, ChefHat, UserCircle, Gift, Coins, Hash, Building2 } from 'lucide-react';
import { useState } from 'react';

import { CancelOrderDrawer } from '../cancel-order';
import { LoadingSpinner } from '../loading-spinner';
import OrderProgressTracker from '../order-progress-tracker';
import OrderLiveTrackingCard from '../order-live-tracking-card';

interface OrderDetailsDrawerProps {
  order: OrderResponse;
  open: boolean;
  onClose: () => void;
  isLoading?: boolean;
}

export function OrderDetailsDrawer({ order, open, onClose, isLoading = false }: OrderDetailsDrawerProps) {
  const { isCancelingOrder } = useCustomerOrders();
  const [closable, setClosable] = useState(open);
  const withdrawable = ['UNPAID', 'CREATED', 'VERIFIED'];
  const normalizedStatus = order?.orderStatus?.toUpperCase?.() || '';
  const computedSubTotal =
    typeof order?.subTotal === 'number' && !Number.isNaN(order.subTotal)
      ? order.subTotal
      : order?.items?.reduce((sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 0), 0) ?? null;
  const subTotalDisplay = computedSubTotal ?? order?.amount ?? 0;
  const hasPromotionCode =
    typeof order?.promotionCode === 'string' &&
    order.promotionCode.trim().length > 0 &&
    order.promotionCode.trim() !== '00';

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

  const redirectToPayment = () => {
    window.location.href = `https://pay.payos.vn/web/${order.payment_code}`;
  };

  // Handle cancel order
  const handleCancelledOrder = () => {
    setClosable(true);
  };

  if (!order) return null;

  return (
    <>
      <Drawer open={open} onOpenChange={(isOpen) => closable && !isOpen && onClose()}>
        {isCancelingOrder ? (
          <div>
            <DrawerContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
              <div className='flex items-center justify-center h-full'>
                <div className='text-center'>
                  <LoadingSpinner />
                  <p className='text-red-500 mt-5'>Đang xử lý hủy đơn hàng...</p>
                </div>
              </div>
            </DrawerContent>
          </div>
        ) : (
          <>
            <DrawerContent
              data-vaul-custom-container='true'
              className='max-w-4xl p-4 max-h-[90vh] overflow-y-auto relative [*[data-vaul-stack-indicator]]:hidden [*[data-vaul-stack-indicator]]:before:hidden'>

              {isLoading && (
                <div className='absolute inset-0 z-20 flex items-center justify-center bg-white/80'>
                  <LoadingSpinner />
                </div>
              )}

              <DrawerHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <DrawerTitle className='text-2xl font-bold'>Chi tiết đơn hàng</DrawerTitle>
                    <DrawerDescription className='sr-only'>
                      Theo dõi các thông tin và trạng thái vận chuyển của đơn hàng {order.id}.
                    </DrawerDescription>
                  </div>
                  <div className='flex flex-col items-end gap-2'>
                    {getStatusBadge(order.orderStatus)}
                    {getPaymentStatusBadge(order.paymentStatus)}
                  </div>
                </div>
              </DrawerHeader>

              <div className='space-y-6'>
                {/* Order information */}
                <Card className='border-none shadow-none bg-transparent p-0'>
                  <CardContent className='p-4 py-2'>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                      {/* Basic Info */}
                      <div className='space-y-3'>
                        <div className='flex items-start'>
                          <Hash className='h-4 w-4 mr-2 text-primary mt-0.5' />
                          <div>
                            <p className='text-xs text-muted-foreground'>Mã đơn hàng</p>
                            <p className='font-medium text-sm'>#{order.id}</p>
                          </div>
                        </div>
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
                      </div>

                      {/* Dates & Times */}
                      <div className='space-y-3'>
                        <div className='flex items-start'>
                          <Calendar className='h-4 w-4 mr-2 text-primary mt-0.5' />
                          <div>
                            <p className='text-xs text-muted-foreground'>Ngày đặt hàng</p>
                            <p className='font-medium text-sm'>
                              {order.orderDate ? new Date(order.orderDate).toLocaleString('vi-VN') : order.date.toLocaleString('vi-VN')}
                            </p>
                          </div>
                        </div>
                        {order.paymentTime && (
                          <div className='flex items-start'>
                            <CreditCard className='h-4 w-4 mr-2 text-primary mt-0.5' />
                            <div>
                              <p className='text-xs text-muted-foreground'>Thời gian thanh toán</p>
                              <p className='font-medium text-sm'>{new Date(order.paymentTime).toLocaleString('vi-VN')}</p>
                            </div>
                          </div>
                        )}
                        {order.deliveryAt && (
                          <div className='flex items-start'>
                            <Truck className='h-4 w-4 mr-2 text-primary mt-0.5' />
                            <div>
                              <p className='text-xs text-muted-foreground'>Thời gian giao hàng</p>
                              <p className='font-medium text-sm'>{new Date(order.deliveryAt).toLocaleString('vi-VN')}</p>
                            </div>
                          </div>
                        )}
                        <div className='flex items-start'>
                          <Clock className='h-4 w-4 mr-2 text-primary mt-0.5' />
                          <div>
                            <p className='text-xs text-muted-foreground'>Thời gian nhận hàng</p>
                            <p className='font-medium text-sm'>{new Date(order.pickupTime).toLocaleString('vi-VN')}</p>
                          </div>
                        </div>
                      </div>

                      {/* Address & Branch */}
                      <div className='space-y-3'>
                        {order.address && (
                          <div className='flex items-start'>
                            <Home className='h-4 w-4 mr-2 text-primary mt-0.5' />
                            <div>
                              <p className='text-xs text-muted-foreground'>Địa chỉ giao hàng</p>
                              <p className='font-medium text-sm line-clamp-2'>{order.address}</p>
                            </div>
                          </div>
                        )}
                        {order.branchName && (
                          <div className='flex items-start'>
                            <Building2 className='h-4 w-4 mr-2 text-primary mt-0.5' />
                            <div>
                              <p className='text-xs text-muted-foreground'>Chi nhánh</p>
                              <p className='font-medium text-sm'>{order.branchName}</p>
                              {order.branchAddress && (
                                <p className='text-xs text-muted-foreground mt-0.5 line-clamp-2'>{order.branchAddress}</p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Staff Information */}
                {(order.chefName || order.shipperName || order.waiterName) && (
                  <Card className='border-none shadow-none bg-transparent p-0'>
                    <CardContent className='p-4 py-2'>
                      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                        {order.chefName && (
                          <div className='flex items-center'>
                            <ChefHat className='h-4 w-4 mr-2 text-primary' />
                            <div>
                              <p className='text-xs text-muted-foreground'>Đầu bếp</p>
                              <p className='font-medium text-sm'>{order.chefName}</p>
                            </div>
                          </div>
                        )}
                        {order.shipperName && (
                          <div className='flex items-center'>
                            <Truck className='h-4 w-4 mr-2 text-primary' />
                            <div>
                              <p className='text-xs text-muted-foreground'>Shipper</p>
                              <p className='font-medium text-sm'>{order.shipperName}</p>
                            </div>
                          </div>
                        )}
                        {order.waiterName && (
                          <div className='flex items-center'>
                            <UserCircle className='h-4 w-4 mr-2 text-primary' />
                            <div>
                              <p className='text-xs text-muted-foreground'>Nhân viên phục vụ</p>
                              <p className='font-medium text-sm'>{order.waiterName}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <OrderProgressTracker currentStatus={order.orderStatus} className='mb-6' />

                {/* Chỉ hiển thị theo dõi real-time khi đơn hàng đang giao */}
                {['SHIPPING', 'DELIVERING', 'IN_DELIVERY'].includes(normalizedStatus) && (
                  <OrderLiveTrackingCard
                    orderId={order.id}
                    initialStatus={order.orderStatus}
                    destinationAddress={order.address}
                  />
                )}

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
                      {order.items.map((item, index) => {
                        const isCombo = item.comboDTO !== null && item.comboDTO !== undefined;
                        const displayName = isCombo && item.comboDTO ? item.comboDTO.name : item.productName;
                        const displayDescription = isCombo && item.comboDTO ? item.comboDTO.description : null;
                        const displayPrice = isCombo && item.comboDTO ? item.comboDTO.price : item.price;

                        return (
                          <div 
                            key={`${isCombo ? 'combo' : 'product'}-${item.productId}-${index}`} 
                            className='py-4 px-5 border-b border-gray-200'
                          >
                            <div className='flex justify-between items-start'>
                              <div className='flex-1'>
                                <div className='flex items-center gap-2'>
                                  <h4 className='font-medium text-sm text-gray-900'>
                                    {displayName}
                                  </h4>
                                  {isCombo && (
                                    <span className='text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full font-medium'>
                                      COMBO
                                    </span>
                                  )}
                                </div>
                                {displayDescription && (
                                  <p className='text-xs text-gray-600 mt-1'>{displayDescription}</p>
                                )}
                                {item.note && (
                                  <p className='text-xs text-muted-foreground mt-1 whitespace-pre-line bg-gray-50 rounded-md p-2'>
                                    {item.note}
                                  </p>
                                )}
                              </div>
                              <div className='text-right'>
                                <div className='font-medium text-sm text-primary'>
                                  {displayPrice.toLocaleString()}đ
                                </div>
                                <div className='text-xs text-muted-foreground mt-1'>x {item.quantity}</div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Order Summary - Pricing */}

                <Card className='border-none shadow-sm bg-gray-50/50'>
                  <CardHeader>
                    <CardTitle className='text-lg flex items-center'>
                      <Receipt className='h-5 w-5 mr-2 text-primary' />
                      Chi tiết thanh toán
                    </CardTitle>
                  </CardHeader>


                  <CardContent className='space-y-2'>
                    <div className='flex justify-between text-sm'>
                      <span className='text-muted-foreground'>Tổng tiền hàng:</span>
                      <span className='font-medium'>{subTotalDisplay.toLocaleString('vi-VN')}đ</span>
                    </div>


                    {(order.shippingFee !== undefined && order.shippingFee !== null && order.shippingFee > 0) && (
                      <div className='flex justify-between text-sm'>
                        <span className='text-muted-foreground'>Phí vận chuyển:</span>
                        <span className='font-medium'>{order.shippingFee.toLocaleString('vi-VN')}đ</span>
                      </div>
                    )}


                    {(typeof order.discountValue === 'number' && order.discountValue > 0) && (
                      <div className='flex justify-between text-sm text-green-600'>
                        <span>Giảm giá:</span>
                        <span className='font-medium'>
                          -{Number(order.discountValue).toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                    )}


                    {hasPromotionCode && (
                      <div className='flex items-center gap-2 text-sm text-muted-foreground pt-1 border-t border-gray-200'>
                        <Gift className='h-4 w-4' />
                        <span>
                          Mã khuyến mãi: <span className='font-medium'>{order.promotionCode}</span>
                        </span>
                      </div>
                    )}


                    {(order.pointUsed !== undefined && order.pointUsed !== null && order.pointUsed > 0) && (
                      <div className='flex justify-between text-sm text-muted-foreground'>
                        <span className='flex items-center gap-1'>
                          <Coins className='h-4 w-4' />
                          Điểm đã dùng:
                        </span>
                        <span className='font-medium'>{order.pointUsed} điểm</span>
                      </div>
                    )}


                    {(order.pointEarned !== undefined && order.pointEarned !== null && order.pointEarned > 0) && (
                      <div className='flex justify-between text-sm text-green-600'>
                        <span className='flex items-center gap-1'>
                          <Coins className='h-4 w-4' />
                          Điểm nhận được:
                        </span>
                        <span className='font-medium'>+{order.pointEarned} điểm</span>
                      </div>
                    )}


                    <div className='flex justify-between pt-2 border-t-2 border-gray-300 mt-2'>
                      <span className='font-bold text-base'>Tổng thanh toán:</span>
                      <span className='font-bold text-primary text-xl'>{order.amount?.toLocaleString('vi-VN')}đ</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Order status message */}
                {normalizedStatus === 'COMPLETED' && (
                  <div className='flex items-center justify-center p-3 bg-green-50 rounded-lg border border-green-200'>
                    <CheckCircle2 className='h-4 w-4 mr-2 text-green-500' />
                    <span className='text-green-700 text-sm'>
                      Đơn hàng đã được giao thành công. Cảm ơn bạn đã sử dụng dịch vụ của Tấm Tắc!
                    </span>
                  </div>
                )}
              </div>

              <DrawerFooter className='flex flex-col sm:flex-row gap-3'>
                {normalizedStatus === 'UNPAID' && (
                  <Button variant='default' className='w-full sm:w-auto' onClick={redirectToPayment}>
                    Tiếp tục thanh toán
                  </Button>
                )}
                {withdrawable.includes(normalizedStatus) && (
                  <CancelOrderDrawer
                    onCloseDrawer={() => {
                      setClosable(true);
                    }}
                    onProceed={handleCancelledOrder}
                    orderId={order.id}
                  />
                )}
                <Button className='w-full sm:w-auto bg-[#4CAF50] hover:bg-[#43A047] text-white' onClick={onClose}>
                  Tiếp tục đặt hàng
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </>
        )}
      </Drawer>
    </>
  );
}
