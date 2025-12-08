'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Loader2, AlertCircle } from 'lucide-react';
import { getChefOrders, ChefOrderResponse } from '@/apis/order.api';
import { useAuthContext } from '@/utils/contexts/AuthContext';
import CompleteLayout from '../components/CompleteLayout';
import Image from 'next/image';

export default function CompletedPage() {
    const { user } = useAuthContext();
    const [orders, setOrders] = useState<ChefOrderResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const isInitialFetchRef = useRef(true);

    useEffect(() => {
        isInitialFetchRef.current = true;

        if (!user?.id) {
            setError('Không thể lấy thông tin người dùng');
            setLoading(false);
            return;
        }

        const fetchCompletedOrders = async () => {
            const shouldShowInitialLoader = isInitialFetchRef.current;
            if (shouldShowInitialLoader) {
                setLoading(true);
            }

            try {
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
                if (shouldShowInitialLoader) {
                    setLoading(false);
                    isInitialFetchRef.current = false;
                }
            }
        };

        fetchCompletedOrders();

        const interval = setInterval(fetchCompletedOrders, 30000);
        return () => clearInterval(interval);
    }, [user?.id]);

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

    const getProcessingTime = (confirmAt: string, cookedAt: string | null): number => {
        if (!cookedAt) return 0;
        const confirmDateTime = new Date(confirmAt);
        const cookedDateTime = new Date(cookedAt);
        const diffMinutes = Math.ceil((cookedDateTime.getTime() - confirmDateTime.getTime()) / 60000);
        return diffMinutes > 0 ? diffMinutes : 0;
    };

    const formatProcessingDuration = (minutes: number): string => {
        if (minutes <= 0 || Number.isNaN(minutes)) {
            return '0 phút';
        }

        const minutesPerDay = 60 * 24;
        const days = Math.floor(minutes / minutesPerDay);
        const hours = Math.floor((minutes % minutesPerDay) / 60);
        const remainingMinutes = minutes % 60;

        if (days > 0) {
            const parts = [`${days} ngày`];
            if (hours > 0) {
                parts.push(`${hours} giờ`);
            } else if (remainingMinutes > 0) {
                parts.push(`${remainingMinutes} phút`);
            }
            return parts.join(' ');
        }

        if (hours > 0) {
            const parts = [`${hours} giờ`];
            if (remainingMinutes > 0) {
                parts.push(`${remainingMinutes} phút`);
            }
            return parts.join(' ');
        }

        return `${remainingMinutes} phút`;
    };

    const sortByDate = (orders: ChefOrderResponse[]) => {
        return [...orders].sort((a, b) => {
            const aDate = a.orderItems[0]?.confirmAt || '';
            const bDate = b.orderItems[0]?.confirmAt || '';
            return new Date(bDate).getTime() - new Date(aDate).getTime();
        });
    };



    const totalCompleted = orders.length;

    let totalProcessingTime = 0;
    let totalOrdersWithCookedAt = 0;

    orders.forEach(order => {
        const firstItem = order.orderItems[0];
        if (!firstItem?.confirmAt) return;

        const cookedItem = order.orderItems.find(item => item.cookedAt);
        if (!cookedItem?.cookedAt) return;

        const processingTime = getProcessingTime(firstItem.confirmAt, cookedItem.cookedAt);
        if (processingTime > 0) {
            totalProcessingTime += processingTime;
            totalOrdersWithCookedAt += 1;
        }
    });

    const avgProcessingTime = totalOrdersWithCookedAt > 0
        ? Math.round(totalProcessingTime / totalOrdersWithCookedAt)
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
                                    <p className='text-2xl font-bold text-gray-900'>
                                        {formatProcessingDuration(avgProcessingTime)}
                                    </p>
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
                                const totalItems = order.orderItems.reduce((sum, item) => sum + item.quantity, 0);

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

                                                    {/* {firstItem && (
                                                        <div className='mb-3'>
                                                            <span className='font-medium text-sm text-gray-600'>Xác nhận lúc:</span>
                                                            <span className='ml-2 text-sm text-gray-700'>
                                                                {formatDate(firstItem.confirmAt)}
                                                            </span>
                                                        </div>
                                                    )} */}

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
                                                                        {comboItems.map((item) => {
                                                                            if (!item.comboDTO) return null;

                                                                            if (processedComboIds.has(item.comboDTO.id)) {
                                                                                return null;
                                                                            }
                                                                            processedComboIds.add(item.comboDTO.id);

                                                                            return (
                                                                                <div key={`combo-${item.comboDTO.id}`}>
                                                                                    <div className='flex items-start gap-3 p-3 bg-white rounded-lg'>
                                                                                        {item.productImg && (
                                                                                            <Image
                                                                                                src={item.productImg}
                                                                                                alt={item.productName || 'Hình món ăn'}
                                                                                                width={64}
                                                                                                height={64}
                                                                                                loading='lazy'
                                                                                                className='object-cover rounded w-16 h-16'
                                                                                            />
                                                                                        )}
                                                                                        <div className='flex-1'>
                                                                                            <div className='flex items-center justify-between'>
                                                                                                <div className='flex items-center gap-2'>
                                                                                                    <p className='font-medium text-gray-800'>
                                                                                                        {item.comboDTO ? item.comboDTO.name : item.productName}
                                                                                                    </p>
                                                                                                    {item.comboDTO && (
                                                                                                        <Badge className='bg-blue-50 text-blue-700 border-blue-200 text-xs'>
                                                                                                            Combo
                                                                                                        </Badge>
                                                                                                    )}
                                                                                                </div>
                                                                                                <p className='text-sm text-gray-600'>
                                                                                                    {item.price.toLocaleString('vi-VN')} đ × {item.quantity}
                                                                                                </p>
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
                                                                                            {item.comboDTO.description && (
                                                                                                <p className='text-sm text-gray-600 mb-2 italic'>
                                                                                                    {item.comboDTO.description}
                                                                                                </p>
                                                                                            )}
                                                                                            {item.comboDTO.comboItems.map((comboItem, idx) => (
                                                                                                <div key={idx} className='flex items-start gap-3 p-3 bg-white rounded-lg'>
                                                                                                    <div className='flex-1'>
                                                                                                        <div className='flex items-center justify-between'>
                                                                                                            <p className='font-medium text-gray-800'>
                                                                                                                {comboItem.productName || comboItem.note || `Sản phẩm #${comboItem.productId}`}
                                                                                                            </p>
                                                                                                            <p className='text-sm text-gray-600'>
                                                                                                                × {comboItem.quantity}
                                                                                                            </p>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>


                                                                                            ))}

                                                                                            {item.cookedAt && (
                                                                                                <p className='text-xs text-gray-500 mt-1 flex items-center gap-1'>
                                                                                                    <CheckCircle className='h-3 w-3 text-green-500' />
                                                                                                    Hoàn thành: {formatDate(item.cookedAt)}
                                                                                                </p>
                                                                                            )}

                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            );
                                                                        })}


                                                                        {regularItems.map((item, index) => (
                                                                            <div key={index} className='flex items-start gap-3 p-3 bg-white rounded-lg'>
                                                                                {item.productImg && (
                                                                                    <Image
                                                                                        src={item.productImg}
                                                                                        alt={item.productName || 'Hình món ăn'}
                                                                                        width={64}
                                                                                        height={64}
                                                                                        loading='lazy'
                                                                                        className='object-cover rounded w-16 h-16'
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

                                                                                    {item.cookedAt && (
                                                                                        <p className='text-xs text-gray-500 mt-1 flex items-center gap-1'>
                                                                                            <CheckCircle className='h-3 w-3 text-green-500' />
                                                                                            Hoàn thành: {formatDate(item.cookedAt)}
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
