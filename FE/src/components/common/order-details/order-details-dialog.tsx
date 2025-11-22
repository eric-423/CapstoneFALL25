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
import {
  Calendar,
  CheckCircle2,
  Clock,
  Home,
  MapPin,
  Phone,
  Receipt,
  User,
  CreditCard,
  Truck,
  ChefHat,
  UserCircle,
  Gift,
  Coins,
  Hash,
  Building2,
  ShoppingBag,
} from 'lucide-react';
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
  const normalizedStatus = order?.orderStatus?.toUpperCase?.() || '';
  const extendedOrder = order as OrderResponse & {
    table?: boolean;
    pickUp?: boolean;
    itemCount?: number;
  };
  const orderItems = Array.isArray(order?.items) ? order.items : [];
  const totalItemQuantity = orderItems.reduce((sum, item) => sum + (item.quantity ?? 0), 0);
  const orderTypeBadges = [
    extendedOrder.table ? { label: 'Dùng tại bàn', color: 'bg-blue-50 text-blue-700 border-blue-200' } : null,
    extendedOrder.pickUp ? { label: 'Tự đến lấy', color: 'bg-purple-50 text-purple-700 border-purple-200' } : null,
    !extendedOrder.table && !extendedOrder.pickUp ? { label: 'Giao tận nơi', color: 'bg-green-50 text-green-700 border-green-200' } : null,
  ].filter(Boolean) as { label: string; color: string }[];
  const recordedItemsCount =
    extendedOrder.totalItems ??
    extendedOrder.itemCount ??
    (orderItems.length > 0 ? totalItemQuantity || orderItems.length : undefined);

  const formatDateTime = (value?: string | Date | null) => {
    if (!value) return 'Chưa cập nhật';
    const date = typeof value === 'string' ? new Date(value) : value;
    if (Number.isNaN(date.getTime())) return 'Không xác định';
    return date.toLocaleString('vi-VN');
  };

  const formatCurrency = (value?: number | null) => {
    if (typeof value !== 'number' || Number.isNaN(value)) return 'Chưa cập nhật';
    return `${value.toLocaleString('vi-VN')}đ`;
  };

  const formatDiscount = (value?: number | null) => {
    if (typeof value !== 'number' || Number.isNaN(value)) return 'Chưa cập nhật';
    return value === 0 ? '0đ' : `-${value.toLocaleString('vi-VN')}đ`;
  };

  const displayText = (value?: string | null, fallback = 'Chưa cập nhật') => {
    if (typeof value !== 'string') {
      return value ?? fallback;
    }
    return value.trim() || fallback;
  };

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
                <div className='flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between'>
                  <div>
                    <DialogTitle className='text-2xl font-bold flex items-center gap-2'>
                      Chi tiết đơn #{order.id}
                    </DialogTitle>
                    <DialogDescription>
                      Theo dõi đầy đủ thông tin khách, quá trình xử lý và thanh toán của đơn hàng.
                    </DialogDescription>
                  </div>
                  <div className='flex flex-col gap-2 items-start lg:items-end'>
                    <div className='flex flex-wrap gap-2 justify-end'>
                      {getStatusBadge(order.orderStatus)}
                      {getPaymentStatusBadge(order.paymentStatus)}
                    </div>
                    <div className='flex flex-wrap gap-2 justify-end'>
                      {orderTypeBadges.map((badge) => (
                        <Badge key={badge.label} className={`border ${badge.color} px-3 py-1 rounded-xl`}>
                          {badge.label}
                        </Badge>
                      ))}
                      {typeof recordedItemsCount === 'number' && (
                        <Badge className='bg-gray-100 text-gray-700 border border-gray-200 px-3 py-1 rounded-xl'>
                          {recordedItemsCount} món
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </DialogHeader>

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
                            <p className='font-medium text-sm'>{displayText(order.customerName)}</p>
                          </div>
                        </div>
                        <div className='flex items-start'>
                          <Phone className='h-4 w-4 mr-2 text-primary mt-0.5' />
                          <div>
                            <p className='text-xs text-muted-foreground'>Số điện thoại</p>
                            <p className='font-medium text-sm'>{displayText(order.customerPhone)}</p>
                          </div>
                        </div>
                      </div>

                      {/* Dates & Times */}
                      <div className='space-y-3'>
                        <div className='flex items-start'>
                          <Calendar className='h-4 w-4 mr-2 text-primary mt-0.5' />
                          <div>
                            <p className='text-xs text-muted-foreground'>Ngày đặt hàng</p>
                            <p className='font-medium text-sm'>{order.orderDate ? formatDateTime(order.orderDate) : formatDateTime(order.date)}</p>
                          </div>
                        </div>
                        {order.paymentTime && (
                          <div className='flex items-start'>
                            <CreditCard className='h-4 w-4 mr-2 text-primary mt-0.5' />
                            <div>
                              <p className='text-xs text-muted-foreground'>Thời gian thanh toán</p>
                              <p className='font-medium text-sm'>{formatDateTime(order.paymentTime)}</p>
                            </div>
                          </div>
                        )}
                        {order.deliveryAt && (
                          <div className='flex items-start'>
                            <Truck className='h-4 w-4 mr-2 text-primary mt-0.5' />
                            <div>
                              <p className='text-xs text-muted-foreground'>Thời gian giao hàng</p>
                              <p className='font-medium text-sm'>{formatDateTime(order.deliveryAt)}</p>
                            </div>
                          </div>
                        )}
                        {order.pickupTime && (
                          <div className='flex items-start'>
                            <Clock className='h-4 w-4 mr-2 text-primary mt-0.5' />
                            <div>
                              <p className='text-xs text-muted-foreground'>Thời gian nhận hàng</p>
                              <p className='font-medium text-sm'>{formatDateTime(order.pickupTime)}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Address & Branch */}
                      <div className='space-y-3'>
                        <div className='flex items-start'>
                          <Home className='h-4 w-4 mr-2 text-primary mt-0.5' />
                          <div>
                            <p className='text-xs text-muted-foreground'>Địa chỉ giao hàng</p>
                            <p className='font-medium text-sm line-clamp-2'>{displayText(order.address)}</p>
                          </div>
                        </div>
                        <div className='flex items-start'>
                          <Building2 className='h-4 w-4 mr-2 text-primary mt-0.5' />
                          <div>
                            <p className='text-xs text-muted-foreground'>Chi nhánh</p>
                            <p className='font-medium text-sm'>{displayText(order.branchName)}</p>
                          </div>
                        </div>
                        <div className='flex items-start'>
                          <MapPin className='h-4 w-4 mr-2 text-primary mt-0.5' />
                          <div>
                            <p className='text-xs text-muted-foreground'>Địa chỉ chi nhánh</p>
                            <p className='font-medium text-sm line-clamp-2'>{displayText(order.branchAddress)}</p>
                          </div>
                        </div>
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

                <Card className='border-none shadow-sm bg-white/70'>
                  <CardHeader className='pb-2'>
                    <div className='flex items-center justify-between'>
                      <CardTitle className='text-lg flex items-center'>
                        <ShoppingBag className='h-5 w-5 mr-2 text-primary' />
                        Danh sách món
                      </CardTitle>
                      {orderItems.length > 0 && (
                        <span className='text-sm text-muted-foreground'>
                          Tổng số lượng: <span className='font-semibold'>{totalItemQuantity}</span>
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className='px-1'>
                    {orderItems.length > 0 ? (
                      <div className='divide-y max-h-64 overflow-y-auto rounded-lg border border-dashed border-gray-200 bg-white'>
                        {orderItems.map((item) => (
                          <div key={item.productId} className='py-4 px-5'>
                            <div className='flex justify-between items-start gap-4'>
                              <div className='flex-1'>
                                <h4 className='font-medium text-sm text-gray-900'>{displayText(item.productName)}</h4>
                                {item.note && (
                                  <p className='text-xs text-muted-foreground mt-1 whitespace-pre-line bg-gray-50 rounded-md p-2'>
                                    {item.note}
                                  </p>
                                )}
                              </div>
                              <div className='text-right'>
                                <div className='text-primary font-semibold text-sm'>{formatCurrency(item.price)}</div>
                                <div className='text-xs text-muted-foreground mt-1'>x {item.quantity}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className='px-5 py-6 text-sm text-muted-foreground text-center'>
                        Chưa có thông tin món ăn cho đơn này.
                      </div>
                    )}
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
                      <span className='font-medium'>{formatCurrency(order.subTotal)}</span>
                    </div>
                    {(order.shippingFee !== undefined && order.shippingFee !== null) && (
                      <div className='flex justify-between text-sm'>
                        <span className='text-muted-foreground'>Phí vận chuyển:</span>
                        <span className='font-medium'>{formatCurrency(order.shippingFee)}</span>
                      </div>
                    )}

                    {(order.discountValue !== undefined && order.discountValue !== null) && (
                      <div className='flex justify-between text-sm text-green-600'>
                        <span>Giảm giá:</span>
                        <span className='font-medium'>{formatDiscount(order.discountValue)}</span>
                      </div>
                    )}
                    {order.promotionCode && (
                      <div className='flex items-center gap-2 text-sm text-muted-foreground pt-1 border-t border-gray-200'>
                        <Gift className='h-4 w-4' />
                        <span>
                          Mã khuyến mãi: <span className='font-medium'>{displayText(order.promotionCode)}</span>
                        </span>
                      </div>
                    )}
                    {order.pointUsed !== undefined && order.pointUsed !== null && (
                      <div className='flex justify-between text-sm text-muted-foreground'>
                        <span className='flex items-center gap-1'>
                          <Coins className='h-4 w-4' />
                          Điểm đã dùng:
                        </span>
                        <span className='font-medium'>
                          {order.pointUsed === 0 ? '0 điểm' : `-${order.pointUsed.toLocaleString('vi-VN')} điểm`}
                        </span>
                      </div>
                    )}

                    {order.pointEarned !== undefined && order.pointEarned !== null && (
                      <div className='flex justify-between text-sm text-green-600'>
                        <span className='flex items-center gap-1'>
                          <Coins className='h-4 w-4' />
                          Điểm nhận được:
                        </span>
                        <span className='font-medium'>
                          {order.pointEarned === 0 ? '0 điểm' : `+${order.pointEarned.toLocaleString('vi-VN')} điểm`}
                        </span>
                      </div>
                    )}

                    <div className='flex justify-between pt-2 border-t-2 border-gray-300 mt-2'>
                      <span className='font-bold text-base'>Tổng thanh toán:</span>
                      <span className='font-bold text-primary text-xl'>{formatCurrency(order.amount)}</span>
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

              <DialogFooter className='flex flex-col sm:flex-row gap-3'>
                {withdrawable.includes(normalizedStatus) && (
                  <CancelOrderDialog
                    onCloseDialog={() => {
                      setClosable(true);
                    }}
                    onProceed={handleCancelledOrder}
                    orderId={order.id}
                  />
                )}
                {normalizedStatus === 'UNPAID' && (
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
