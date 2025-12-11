'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, ChefHat, Loader2, AlertCircle } from 'lucide-react';
import { getChefOrders, markOrderAsCooked, ChefOrderResponse } from '@/apis/order.api';
import { useAuthContext } from '@/utils/contexts/AuthContext';
import ChefLayout from './components/CompleteLayout';

export default function ChefPage() {
   const { user } = useAuthContext();
   const [orders, setOrders] = useState<ChefOrderResponse[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [completedItems, setCompletedItems] = useState<number[]>([]);
   const [completedOrdersCount, setCompletedOrdersCount] = useState(0);
   const isInitialFetchRef = useRef(true);

   useEffect(() => {
      isInitialFetchRef.current = true;

      if (!user?.id) {
         setError('Không thể lấy thông tin người dùng');
         setLoading(false);
         return;
      }

      const chefId = user.id;
      let isMounted = true;

      const fetchCompletedOrdersCount = async () => {
         try {
            const response = await getChefOrders(chefId, 'COOKED');

            if (response.status === 0 && response.data && isMounted) {
               setCompletedOrdersCount(response.data.length);
            }
         } catch (err) {
            console.error('Error fetching completed orders count:', err);
         }
      };

      const fetchOrders = async () => {
         const shouldShowInitialLoader = isInitialFetchRef.current;
         if (shouldShowInitialLoader) {
            setLoading(true);
         }

         try {
            setError(null);

            const response = await getChefOrders(chefId, 'COOKING');

            if (response.status === 0 && response.data) {
               setOrders(response.data);
            } else {
               const errorMsg = response.desc || 'Không thể tải danh sách đơn hàng';
               setError(errorMsg);
            }
         } catch (err) {
            const error = err as Error & { response?: { data?: { error?: string; details?: { error?: string; userRole?: string }; status?: number; userRole?: string }; status?: number } };

            if (error.response?.data) {
               const errorData = error.response.data;
               const status = error.response.data.status || error.response.status;
               const userRole = errorData.userRole || 'Unknown';

               if (status === 403) {
                  const errorMsg = errorData.error || errorData.details?.error || 'Bạn không có quyền truy cập API này';
                  setError(`${errorMsg}. Role hiện tại: ${userRole}. Vui lòng liên hệ quản trị viên để được cấp quyền truy cập.`);
               } else if (status === 401) {
                  setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
               } else {
                  const errorMsg = errorData.error || errorData.details?.error || 'Không thể tải danh sách đơn hàng';
                  setError(errorMsg);
               }
            } else {
               setError('Có lỗi xảy ra khi tải danh sách đơn hàng. Vui lòng thử lại sau.');
            }
         } finally {
            if (shouldShowInitialLoader) {
               setLoading(false);
               isInitialFetchRef.current = false;
            }
         }
      };

      fetchOrders();
      fetchCompletedOrdersCount();

      const interval = setInterval(() => {
         fetchOrders();
         fetchCompletedOrdersCount();
      }, 10000);
      return () => {
         clearInterval(interval);
         isMounted = false;
      };
   }, [user?.id]);



   const handleMarkAsCompleted = async (orderId: number, orderItemId: number[]) => {
      if (completedItems.includes(orderId)) {
         return;
      }

      setCompletedItems(prev => [...prev, orderId]);

      try {
         const result = await markOrderAsCooked(orderId, orderItemId);

         if (result.success) {
            // Update trạng thái các món đã cooked trong order
            setOrders(prev => prev.map(order => {
               if (order.orderId === orderId) {
                  const updatedOrderItems = order.orderItems.map(item =>
                     orderItemId.includes(item.orderItemId)
                        ? { ...item, isCooked: true }
                        : item
                  );

                  // Kiểm tra xem tất cả món đã cooked chưa
                  const allCooked = updatedOrderItems.every(item => item.isCooked);

                  // Nếu tất cả món đã cooked, xóa order sau 1 giây
                  if (allCooked) {
                     setTimeout(() => {
                        setOrders(prevOrders => prevOrders.filter(o => o.orderId !== orderId));
                        setCompletedItems(prevItems => prevItems.filter(id => id !== orderId));
                     }, 1000);
                  }

                  return {
                     ...order,
                     orderItems: updatedOrderItems
                  };
               }
               return order;
            }));

            setTimeout(() => {
               setCompletedItems(prev => prev.filter(id => id !== orderId));
            }, 100);
         } else {
            setCompletedItems(prev => prev.filter(id => id !== orderId));
         }
      } catch (error) {
         console.log('Error marking order as cooked:', error);
         setCompletedItems(prev => prev.filter(id => id !== orderId));
      }
   };


   const sortByDate = (orders: ChefOrderResponse[]) => {
      return [...orders].sort((a, b) => {
         const aDate = a.orderItems[0]?.confirmAt || '';
         const bDate = b.orderItems[0]?.confirmAt || '';
         return new Date(aDate).getTime() - new Date(bDate).getTime();
      });
   };

   const getTotalAmount = (order: ChefOrderResponse) => {
      return order.orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
   };

   return (
      <ChefLayout>
         <div className='max-w-6xl mx-auto'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
               <Card>
                  <CardContent className='p-6'>
                     <div className='flex items-center'>
                        <Clock className='h-8 w-8 text-orange-500' />
                        <div className='ml-4'>
                           <p className='text-sm font-medium text-gray-600'>Tổng đơn đang nấu</p>
                           <p className='text-2xl font-bold text-gray-900'>{orders.length}</p>
                        </div>
                     </div>
                  </CardContent>
               </Card>

               <Card>
                  <CardContent className='p-6'>
                     <div className='flex items-center'>
                        <CheckCircle className='h-8 w-8 text-green-500' />
                        <div className='ml-4'>
                           <p className='text-sm font-medium text-gray-600'>Đơn Đã Hoàn Thành</p>
                           <p className='text-2xl font-bold text-gray-900'>{completedOrdersCount}</p>
                        </div>
                     </div>
                  </CardContent>
               </Card>
            </div>

            <div className='space-y-4'>
               <h2 className='text-2xl font-bold text-gray-800 mb-6'>Danh sách đơn hàng đang nấu</h2>

               {loading ? (
                  <Card>
                     <CardContent className='p-12 text-center'>
                        <Loader2 className='h-16 w-16 text-orange-500 mx-auto mb-4 animate-spin' />
                        <h3 className='text-lg font-medium text-gray-600 mb-2'>Đang tải danh sách đơn hàng...</h3>
                     </CardContent>
                  </Card>
               ) : error ? (
                  <Card>
                     <CardContent className='p-12 text-center'>
                        <AlertCircle className='h-16 w-16 text-red-500 mx-auto mb-4' />
                        <h3 className='text-lg font-medium text-gray-600 mb-2'>Có lỗi xảy ra</h3>
                        <p className='text-gray-500'>{error}</p>
                     </CardContent>
                  </Card>
               ) : orders.length === 0 ? (
                  <Card>
                     <CardContent className='p-12 text-center'>
                        <ChefHat className='h-16 w-16 text-gray-400 mx-auto mb-4' />
                        <h3 className='text-lg font-medium text-gray-600 mb-2'>Không có đơn hàng nào đang nấu</h3>
                        <p className='text-gray-500'>Tất cả đơn hàng đã được xử lý!</p>
                     </CardContent>
                  </Card>
               ) : (
                  <div className='grid gap-4'>
                     {sortByDate(orders).map((order) => {
                        const totalAmount = getTotalAmount(order);
                        const totalItems = order.orderItems.reduce((sum, item) => sum + item.quantity, 0);

                        return (
                           <Card key={order.orderId} className={`transition-all duration-200 hover:shadow-md ${completedItems.includes(order.orderId) ? 'opacity-50' : ''
                              }`}>
                              <CardContent className='p-6'>
                                 <div className='flex flex-col gap-3'>
                                    <div className='flex items-start justify-between'>
                                       <div>
                                          <div className='flex items-center gap-3 mb-2'>
                                             <h3 className='text-lg font-semibold text-gray-800'>
                                                Đơn hàng #{order.orderId}
                                             </h3>
                                             <Badge className='bg-orange-50 text-orange-700 border-orange-200'>
                                                Đang nấu
                                             </Badge>
                                             <span className='text-sm text-gray-500'>
                                                {totalItems} món
                                             </span>
                                          </div>
                                          {/* {firstItem && (
                                             <div className='mb-1'>
                                                <span className='font-medium text-sm text-gray-600'>Xác nhận lúc:</span>
                                                <span className='ml-2 text-sm text-gray-700'>
                                                   {formatDate(firstItem.confirmAt)}
                                                </span>
                                             </div>
                                          )} */}
                                       </div>

                                       <Button
                                          onClick={() => handleMarkAsCompleted(order.orderId, order.orderItems.map(item => item.orderItemId))}
                                          disabled={completedItems.includes(order.orderId)}
                                          className={`px-4 py-2 ${completedItems.includes(order.orderId)
                                             ? 'bg-gray-400 cursor-not-allowed'
                                             : 'bg-green-600 hover:bg-green-700'
                                             } text-white font-medium whitespace-nowrap`}
                                       >
                                          {completedItems.includes(order.orderId) ? (
                                             <>
                                                <CheckCircle className='h-4 w-4 mr-2' />
                                                Đang xử lý...
                                             </>
                                          ) : (
                                             <>
                                                <CheckCircle className='h-4 w-4 mr-2' />
                                                Hoàn thành hết
                                             </>
                                          )}
                                       </Button>
                                    </div>

                                    <div className='mb-4 space-y-2'>
                                       <p className='text-sm font-medium text-gray-700'>Danh sách món:</p>
                                       <div className='space-y-2'>
                                          {(() => {
                                             // Tách items có combo và không có combo
                                             const comboItems = order.orderItems.filter(item => item.comboDTO);
                                             const regularItems = order.orderItems.filter(item => !item.comboDTO);
                                             const processedComboIds = new Set<number>();

                                             return (
                                                <>
                                                   {/* Hiển thị combo items */}
                                                   {comboItems.map((item) => {
                                                      if (!item.comboDTO) return null;

                                                      // Chỉ hiển thị combo 1 lần cho mỗi comboId
                                                      if (processedComboIds.has(item.comboDTO.id)) {
                                                         return null;
                                                      }
                                                      processedComboIds.add(item.comboDTO.id);

                                                      return (
                                                         <div key={`combo-${item.comboDTO.id}`}>
                                                            {/* Header combo */}
                                                            <div className='flex items-start gap-3 p-3 bg-gray-50 rounded-lg'>
                                                               {item.productImg && (
                                                                  <Image
                                                                     src={item.productImg}
                                                                     alt={item.productName}
                                                                     width={64}
                                                                     height={64}
                                                                     className='w-16 h-16 object-cover rounded'
                                                                  />
                                                               )}
                                                               <div className='flex-1'>
                                                                  <div className='flex items-center justify-between gap-4'>
                                                                     <div className='flex items-center gap-2'>
                                                                        <p className='font-medium text-gray-800'>
                                                                           {item.productName}
                                                                        </p>
                                                                        <Badge className='bg-blue-50 text-blue-700 border-blue-200 text-xs'>
                                                                           Combo
                                                                        </Badge>
                                                                     </div>
                                                                     <div className='flex items-center gap-3'>
                                                                        <p className='text-md text-primary text-bold'>
                                                                           {item.price.toLocaleString('vi-VN')} đ × {item.quantity}
                                                                        </p>
                                                                        {
                                                                           item.isCooked ? (
                                                                              <Badge className='bg-gray-100 text-green-800 border-green-200'>Đã hoàn thành</Badge>
                                                                           ) : (
                                                                              <Button
                                                                                 size='sm'
                                                                                 className='bg-green-600 hover:bg-green-700 text-white whitespace-nowrap'
                                                                                 onClick={() => handleMarkAsCompleted(order.orderId, [item.orderItemId])}
                                                                              >
                                                                                 Hoàn thành
                                                                              </Button>
                                                                           )
                                                                        }
                                                                     </div>
                                                                  </div>
                                                                  {item.note && (
                                                                     <p className='text-xs text-gray-500 mt-1'>
                                                                        Ghi chú: {item.note}
                                                                     </p>
                                                                  )}
                                                               </div>
                                                            </div>


                                                            {item.comboDTO.comboItems && item.comboDTO.comboItems.length > 0 && (
                                                               <div className='ml-4 mt-2 space-y-2 border-l-2 border-blue-300 pl-4'>
                                                                  {item.comboDTO.comboItems.map((comboItem, idx) => (
                                                                     <div key={idx} className='flex items-start gap-3 p-3 bg-gray-50 rounded-lg'>
                                                                        <div className='flex-1'>
                                                                           <div className='flex items-center justify-between gap-4'>
                                                                              <p className='font-medium text-gray-800'>
                                                                                 {comboItem.note || `Sản phẩm #${comboItem.productId}`}
                                                                              </p>
                                                                              <p className='text-md text-primary text-bold'>
                                                                                 × {comboItem.quantity}
                                                                              </p>
                                                                           </div>
                                                                        </div>
                                                                     </div>
                                                                  ))}
                                                               </div>
                                                            )}
                                                         </div>
                                                      );
                                                   })}



                                                   {regularItems.map((item, index) => (
                                                      <div key={index} className='flex items-start gap-3 p-3 bg-gray-50 rounded-lg'>
                                                         {item.productImg && (
                                                            <Image
                                                               src={item.productImg}
                                                               alt={item.productName}
                                                               width={64}
                                                               height={64}
                                                               className='w-16 h-16 object-cover rounded'
                                                            />
                                                         )}

                                                         <div className='flex-1'>
                                                            <div className='flex items-center justify-between gap-4'>
                                                               <p className='font-medium text-gray-800'>
                                                                  {item.productName}
                                                               </p>
                                                               <div className='flex items-center gap-3'>
                                                                  <p className='text-md text-primary text-bold'>
                                                                     {item.price.toLocaleString('vi-VN')} đ × {item.quantity}
                                                                  </p>
                                                                  {
                                                                     item.isCooked ? (
                                                                        <Badge className='bg-gray-100 text-green-800 border-green-200'>Đã hoàn thành</Badge>
                                                                     ) : (
                                                                        <Button
                                                                           size='sm'
                                                                           className='bg-green-600 hover:bg-green-700 text-white whitespace-nowrap'
                                                                           onClick={() => handleMarkAsCompleted(order.orderId, [item.orderItemId])}
                                                                        >
                                                                           Hoàn thành
                                                                        </Button>
                                                                     )
                                                                  }
                                                               </div>
                                                            </div>
                                                            {item.note && (
                                                               <p className='text-xs text-gray-500 mt-1'>
                                                                  Ghi chú: {item.note}
                                                               </p>
                                                            )}
                                                         </div>
                                                      </div>
                                                   ))}
                                                </>
                                             );
                                          })()}
                                       </div>
                                    </div>

                                    <div className='mt-1 flex items-center gap-4'>
                                       <div className='flex items-center text-sm'>
                                          <span className='text-gray-600'>Tổng tiền:</span>
                                          <span className='ml-1 font-medium text-green-600'>
                                             {totalAmount.toLocaleString('vi-VN')} đ
                                          </span>
                                       </div>
                                    </div>
                                 </div>
                              </CardContent>
                           </Card>
                        );
                     })}
                  </div>
               )}
            </div>
         </div>
      </ChefLayout>
   );
}
