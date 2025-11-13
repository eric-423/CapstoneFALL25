'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, ChefHat, Loader2, AlertCircle } from 'lucide-react';
import { getChefOrders, markOrderAsCooked, BranchOrderResponse } from '@/apis/order.api';
import { useAuthContext } from '@/utils/contexts/AuthContext';
import WaitingLayout from './components/WaitingLayout';

export default function ChefPage() {
    const { user } = useAuthContext();
    const [orders, setOrders] = useState<BranchOrderResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [completedItems, setCompletedItems] = useState<number[]>([]);

    useEffect(() => {
        if (!user?.id) {
            setError('Không thể lấy thông tin người dùng');
            setLoading(false);
            return;
        }

        const fetchOrders = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const chefId = user.id;
                console.log('🔄 [Chef Page] Fetching orders for chef:', chefId, 'with status: COOKING');
                const response = await getChefOrders(chefId, 'COOKING');
                console.log('📥 [Chef Page] Response received:', response);
                
                if (response.status === 0 && response.data) {
                    console.log('✅ [Chef Page] Orders fetched successfully:', response.data.length);
                    setOrders(response.data);
                } else {
                    const errorMsg = response.desc || response.error || 'Không thể tải danh sách đơn hàng';
                    console.error('❌ [Chef Page] API returned error:', response);
                    setError(errorMsg);
                }
            } catch (err) {
                console.error('💥 [Chef Page] Error fetching orders:', err);
                
                const error = err as Error & { response?: { data?: { error?: string; details?: unknown; status?: number } } };
                
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
                setLoading(false);
            }
        };

        fetchOrders();

        const interval = setInterval(fetchOrders, 30000);
        return () => clearInterval(interval);
    }, [user?.id]);

    const handleMarkAsCompleted = async (orderId: number) => {
        if (completedItems.includes(orderId)) {
            return;
        }

        setCompletedItems(prev => [...prev, orderId]);
        
        try {
            const result = await markOrderAsCooked(orderId);

            if (result.success) {
                setTimeout(() => {
                    setOrders(prev => prev.filter(order => order.id !== orderId));
                    setCompletedItems(prev => prev.filter(id => id !== orderId));
                }, 1000);
            } else {
                setCompletedItems(prev => prev.filter(id => id !== orderId));
                alert('Không thể cập nhật trạng thái đơn hàng');
            }
        } catch (error) {
            console.error('Error marking order as cooked:', error);
            setCompletedItems(prev => prev.filter(id => id !== orderId));
            
            const errorObj = error as Error & { response?: { data?: { error?: string; status?: number } } };
            const errorMessage = errorObj.response?.data?.error || 'Có lỗi xảy ra khi cập nhật trạng thái đơn hàng';
            alert(errorMessage);
        }
    };

    const getTimeRemaining = (orderDate: string) => {
        const orderDateTime = new Date(orderDate);
        const now = new Date();
        const diffMinutes = Math.ceil((now.getTime() - orderDateTime.getTime()) / 60000);

        if (diffMinutes <= 0) {
            return 'Vừa đặt';
        }

        if (diffMinutes > 60) {
            const hours = Math.floor(diffMinutes / 60);
            return `${hours} giờ ${diffMinutes % 60} phút`;
        }

        return `${diffMinutes} phút`;
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

    const sortByDate = (orders: BranchOrderResponse[]) => {
        return [...orders].sort((a, b) => {
            return new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime();
        });
    };

    return (
        <WaitingLayout>
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
                                    <p className='text-sm font-medium text-gray-600'>Hoàn thành hôm nay</p>
                                    <p className='text-2xl font-bold text-gray-900'>{completedItems.length}</p>
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
                            {sortByDate(orders).map((order) => (
                                <Card key={order.id} className={`transition-all duration-200 hover:shadow-md ${completedItems.includes(order.id) ? 'opacity-50' : ''
                                    }`}>
                                    <CardContent className='p-6'>
                                        <div className='flex items-center justify-between'>
                                            <div className='flex-1'>
                                                <div className='flex items-center gap-3 mb-2'>
                                                    <h3 className='text-lg font-semibold text-gray-800'>
                                                        Đơn hàng #{order.id}
                                                    </h3>
                                                    <Badge className='bg-orange-50 text-orange-700 border-orange-200'>
                                                        Đang nấu
                                                    </Badge>
                                                    <span className='text-sm text-gray-500'>
                                                        {order.itemCount} món
                                                    </span>
                                                </div>

                                                <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3'>
                                                    <div>
                                                        <span className='font-medium'>Khách hàng:</span> {order.customerName}
                                                    </div>
                                                    <div>
                                                        <span className='font-medium'>SĐT:</span> {order.customerPhone}
                                                    </div>
                                                    <div>
                                                        <span className='font-medium'>Đặt lúc:</span> {formatDate(order.orderDate)}
                                                    </div>
                                                </div>

                                                {order.address && (
                                                    <div className='mb-2'>
                                                        <span className='font-medium text-sm text-gray-600'>Địa chỉ:</span>
                                                        <p className='text-sm text-gray-700 bg-gray-50 p-2 rounded mt-1'>
                                                            {order.address}
                                                        </p>
                                                    </div>
                                                )}

                                                <div className='mt-3 flex items-center gap-4'>
                                                    <div className='flex items-center text-sm'>
                                                        <Clock className='h-4 w-4 text-orange-500 mr-1' />
                                                        <span className='text-gray-600'>Thời gian đã qua:</span>
                                                        <span className='ml-1 font-medium text-orange-600'>
                                                            {getTimeRemaining(order.orderDate)}
                                                        </span>
                                                    </div>
                                                    <div className='flex items-center text-sm'>
                                                        <span className='text-gray-600'>Tổng tiền:</span>
                                                        <span className='ml-1 font-medium text-green-600'>
                                                            {order.amount.toLocaleString('vi-VN')} đ
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='ml-6'>
                                                <Button
                                                    onClick={() => handleMarkAsCompleted(order.id)}
                                                    disabled={completedItems.includes(order.id)}
                                                    className={`px-6 py-2 ${completedItems.includes(order.id)
                                                        ? 'bg-gray-400 cursor-not-allowed'
                                                        : 'bg-green-600 hover:bg-green-700'
                                                        } text-white font-medium`}
                                                >
                                                    {completedItems.includes(order.id) ? (
                                                        <>
                                                            <CheckCircle className='h-4 w-4 mr-2' />
                                                            Đang xử lý...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <CheckCircle className='h-4 w-4 mr-2' />
                                                            Xác nhận hoàn thành
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </WaitingLayout>
    );
}
