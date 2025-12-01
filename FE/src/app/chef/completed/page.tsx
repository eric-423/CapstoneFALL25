'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Loader2, AlertCircle } from 'lucide-react';
import { getChefOrders, ChefOrderResponse } from '@/apis/order.api';
import { useAuthContext } from '@/utils/contexts/AuthContext';
import CompleteLayout from '../components/CompleteLayout';

export default function CompletedPage() {
    const { user } = useAuthContext();
    const [orders, setOrders] = useState<ChefOrderResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user?.id) {
            setError('Không thể lấy thông tin người dùng');
            setLoading(false);
            return;
        }

        const fetchCompletedOrders = async () => {
            try {
                setLoading(true);
                setError(null);

                const chefId = user.id;
                const response = await getChefOrders(chefId, 'COOKED');

                if (response.status === 0 && response.data) {
                    setOrders(response.data);
                } else {
                    const errorMsg = response.desc || 'Không thể tải danh sách đơn hàng đã hoàn thành';
                    setError(errorMsg);
                }
            } catch (err) {
                console.error('Error fetching completed orders:', err);
                const error = err as Error & { response?: { data?: { error?: string; status?: number; details?: { error?: string } }; status?: number } };

                if (error.response?.data) {
                    const errorData = error.response.data;
                    const status = error.response.data.status || error.response.status;

                    if (status === 403) {
                        setError('Bạn không có quyền truy cập API này. Vui lòng liên hệ quản trị viên.');
                    } else if (status === 401) {
                        setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                    } else {
                        const errorMsg = errorData.error || errorData.details?.error || 'Không thể tải danh sách đơn hàng đã hoàn thành';
                        setError(errorMsg);
                    }
                } else {
                    setError('Có lỗi xảy ra khi tải danh sách đơn hàng đã hoàn thành. Vui lòng thử lại sau.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCompletedOrders();

        const interval = setInterval(fetchCompletedOrders, 30000);
        return () => clearInterval(interval);
    }, [user?.id]);

    const getProcessingTime = (confirmAt: string, cookedAt: string | null) => {
        const confirmDateTime = new Date(confirmAt);
        const completedDateTime = cookedAt ? new Date(cookedAt) : new Date();
        const diffMinutes = Math.ceil((completedDateTime.getTime() - confirmDateTime.getTime()) / 60000);

        if (diffMinutes <= 0) {
            return 0;
        }

        return diffMinutes;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const sortByDate = (orders: ChefOrderResponse[]) => {
        return [...orders].sort((a, b) => {
            const aDate = a.orderItems[0]?.confirmAt || '';
            const bDate = b.orderItems[0]?.confirmAt || '';
            return new Date(bDate).getTime() - new Date(aDate).getTime();
        });
    };

    const getTotalAmount = (order: ChefOrderResponse) => {
        return order.orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const totalCompleted = orders.length;
    const avgProcessingTime = orders.length > 0
        ? Math.round(orders.reduce((sum, order) => {
            const firstItem = order.orderItems[0];
            if (!firstItem) return sum;
            const cookedAt = order.orderItems.find(item => item.cookedAt)?.cookedAt || null;
            return sum + getProcessingTime(firstItem.confirmAt, cookedAt);
        }, 0) / orders.length)
        : 0;

    return (
        <CompleteLayout title='Đã hoàn thành' icon={CheckCircle} description='Các món ăn đã hoàn thành' >
            <div className='max-w-6xl mx-auto'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
                    <Card>
                        <CardContent className='p-6'>
                            <div className='flex items-center'>
                                <CheckCircle className='h-8 w-8 text-green-500' />
                                <div className='ml-4'>
                                    <p className='text-sm font-medium text-gray-600'>Tổng đã hoàn thành</p>
                                    <p className='text-2xl font-bold text-gray-900'>{totalCompleted}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className='p-6'>
                            <div className='flex items-center'>
                                <Clock className='h-8 w-8 text-blue-500' />
                                <div className='ml-4'>
                                    <p className='text-sm font-medium text-gray-600'>Thời gian trung bình</p>
                                    <p className='text-2xl font-bold text-gray-900'>{avgProcessingTime}p</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* <Card>
                        <CardContent className='p-6'>
                            <div className='flex items-center'>
                                <ChefHat className='h-8 w-8 text-orange-500' />
                                <div className='ml-4'>
                                    <p className='text-sm font-medium text-gray-600'>Hiệu suất</p>
                                    <p className='text-2xl font-bold text-gray-900'>{totalCompleted > 0 ? '100%' : '0%'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card> */}
                </div>

                <div className='space-y-4'>
                    <h2 className='text-2xl font-bold text-gray-800 mb-6'>Danh sách đơn hàng đã hoàn thành</h2>

                    {loading ? (
                        <Card>
                            <CardContent className='p-12 text-center'>
                                <Loader2 className='h-16 w-16 text-green-500 mx-auto mb-4 animate-spin' />
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
                                <CheckCircle className='h-16 w-16 text-gray-400 mx-auto mb-4' />
                                <h3 className='text-lg font-medium text-gray-600 mb-2'>Chưa có đơn hàng nào đã hoàn thành</h3>
                                <p className='text-gray-500'>Các đơn hàng đã hoàn thành sẽ hiển thị ở đây!</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className='grid gap-4'>
                            {sortByDate(orders).map((order) => {
                                const firstItem = order.orderItems[0];
                                const totalAmount = getTotalAmount(order);
                                const totalItems = order.orderItems.reduce((sum, item) => sum + item.quantity, 0);
                                const cookedItem = order.orderItems.find(item => item.cookedAt);
                                const cookedAt = cookedItem?.cookedAt;
                                
                                return (
                                    <Card key={order.orderId} className='bg-green-50 border-green-200 transition-all duration-200 hover:shadow-md'>
                                        <CardContent className='p-6'>
                                            <div className='flex items-center justify-between'>
                                                <div className='flex-1'>
                                                    <div className='flex items-center gap-3 mb-2'>
                                                        <h3 className='text-lg font-semibold text-gray-800'>
                                                            Đơn hàng #{order.orderId}
                                                        </h3>
                                                        <Badge className='bg-green-100 text-green-800 border-green-200'>
                                                            Đã hoàn thành
                                                        </Badge>
                                                        <span className='text-sm text-gray-500'>
                                                            {totalItems} món
                                                        </span>
                                                    </div>

                                                    {firstItem && (
                                                        <div className='mb-3'>
                                                            <span className='font-medium text-sm text-gray-600'>Xác nhận lúc:</span>
                                                            <span className='ml-2 text-sm text-gray-700'>
                                                                {formatDate(firstItem.confirmAt)}
                                                            </span>
                                                        </div>
                                                    )}

                                                    <div className='mb-4 space-y-2'>
                                                        <p className='text-sm font-medium text-gray-700'>Danh sách món:</p>
                                                        <div className='space-y-2'>
                                                            {order.orderItems.map((item, index) => (
                                                                <div key={index} className='flex items-start gap-3 p-3 bg-white rounded-lg'>
                                                                    {item.productImg && (
                                                                        <img 
                                                                            src={item.productImg} 
                                                                            alt={item.productName}
                                                                            className='w-16 h-16 object-cover rounded'
                                                                        />
                                                                    )}
                                                                    <div className='flex-1'>
                                                                        <div className='flex items-center justify-between'>
                                                                            <p className='font-medium text-gray-800'>{item.productName}</p>
                                                                            <p className='text-sm text-gray-600'>
                                                                                {item.price.toLocaleString('vi-VN')} đ × {item.quantity}
                                                                            </p>
                                                                        </div>
                                                                        {item.note && (
                                                                            <p className='text-xs text-gray-500 mt-1'>
                                                                                Ghi chú: {item.note}
                                                                            </p>
                                                                        )}
                                                                        {item.comboDTO && (
                                                                            <Badge className='mt-1 bg-blue-50 text-blue-700 border-blue-200 text-xs'>
                                                                                Combo
                                                                            </Badge>
                                                                        )}
                                                                        {item.cookedAt && (
                                                                            <p className='text-xs text-green-600 mt-1'>
                                                                                Đã nấu: {formatDate(item.cookedAt)}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className='mt-3 flex items-center gap-4'>
                                                        {cookedAt && firstItem && (
                                                            <>
                                                                <div className='flex items-center text-sm'>
                                                                    <CheckCircle className='h-4 w-4 text-green-500 mr-1' />
                                                                    <span className='text-gray-600'>Hoàn thành:</span>
                                                                    <span className='ml-1 font-medium text-green-600'>
                                                                        {formatDate(cookedAt)}
                                                                    </span>
                                                                </div>
                                                                <div className='flex items-center text-sm'>
                                                                    <Clock className='h-4 w-4 text-blue-500 mr-1' />
                                                                    <span className='text-gray-600'>Thời gian chế biến:</span>
                                                                    <span className='ml-1 font-medium text-blue-600'>
                                                                        {getProcessingTime(firstItem.confirmAt, cookedAt)} phút
                                                                    </span>
                                                                </div>
                                                            </>
                                                        )}
                                                        <div className='flex items-center text-sm'>
                                                            <span className='text-gray-600'>Tổng tiền:</span>
                                                            <span className='ml-1 font-medium text-green-600'>
                                                                {totalAmount.toLocaleString('vi-VN')} đ
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className='ml-6'>
                                                    <div className='flex items-center justify-center w-16 h-16 bg-green-100 rounded-full'>
                                                        <CheckCircle className='h-8 w-8 text-green-600' />
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
        </CompleteLayout>
    );
}
