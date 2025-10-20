'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, ChefHat } from 'lucide-react';
import {
    mockFoodItems,
    priorityColors,
    priorityLabels,
    type FoodItem
} from './mock-data';
import WaitingLayout from './components/WaitingLayout';

export default function ChefPage() {
    const [foodItems, setFoodItems] = useState<FoodItem[]>(mockFoodItems);
    const [completedItems, setCompletedItems] = useState<number[]>([]);

    const handleMarkAsCompleted = (itemId: number) => {
        setCompletedItems(prev => [...prev, itemId]);
        setTimeout(() => {
            setFoodItems(prev => prev.filter(item => item.id !== itemId));
            setCompletedItems(prev => prev.filter(id => id !== itemId));
        }, 1000);
    };

    const getTimeRemaining = (orderTime: string, estimatedTime: number) => {
        const [hours, minutes] = orderTime.split(':').map(Number);
        const orderDateTime = new Date();
        orderDateTime.setHours(hours, minutes, 0, 0);

        const estimatedCompletionTime = new Date(orderDateTime.getTime() + estimatedTime * 60000);
        const now = new Date();

        const diffMinutes = Math.ceil((estimatedCompletionTime.getTime() - now.getTime()) / 60000);

        if (diffMinutes <= 0) {
            return 'Quá hạn';
        }

        return `${diffMinutes} phút`;
    };

    const sortByPriority = (items: FoodItem[]) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return [...items].sort((a, b) => {
            if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            }
            return new Date(`1970-01-01T${a.orderTime}`).getTime() - new Date(`1970-01-01T${b.orderTime}`).getTime();
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
                                    <p className='text-sm font-medium text-gray-600'>Tổng đơn chờ</p>
                                    <p className='text-2xl font-bold text-gray-900'>{foodItems.length}</p>
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
                    <h2 className='text-2xl font-bold text-gray-800 mb-6'>Danh sách món ăn chờ</h2>

                    {foodItems.length === 0 ? (
                        <Card>
                            <CardContent className='p-12 text-center'>
                                <ChefHat className='h-16 w-16 text-gray-400 mx-auto mb-4' />
                                <h3 className='text-lg font-medium text-gray-600 mb-2'>Không có món ăn nào đang chờ</h3>
                                <p className='text-gray-500'>Tất cả đơn hàng đã được xử lý!</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className='grid gap-4'>
                            {sortByPriority(foodItems).map((item) => (
                                <Card key={item.id} className={`transition-all duration-200 hover:shadow-md ${completedItems.includes(item.id) ? 'opacity-50' : ''
                                    }`}>
                                    <CardContent className='p-6'>
                                        <div className='flex items-center justify-between'>
                                            <div className='flex-1'>
                                                <div className='flex items-center gap-3 mb-2'>
                                                    <h3 className='text-lg font-semibold text-gray-800'>
                                                        {item.name}
                                                    </h3>
                                                    <Badge className={`${priorityColors[item.priority]} border`}>
                                                        {priorityLabels[item.priority]}
                                                    </Badge>
                                                    <span className='text-sm text-gray-500'>
                                                        Số lượng: {item.quantity}
                                                    </span>
                                                </div>

                                                <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600'>
                                                    <div>
                                                        <span className='font-medium'>Mã đơn:</span> #{item.orderId}
                                                    </div>
                                                    <div>
                                                        <span className='font-medium'>Khách hàng:</span> {item.customerName}
                                                    </div>
                                                    <div>
                                                        <span className='font-medium'>Đặt lúc:</span> {item.orderTime}
                                                    </div>
                                                </div>

                                                {item.notes && (
                                                    <div className='mt-2'>
                                                        <span className='font-medium text-sm text-gray-600'>Ghi chú:</span>
                                                        <p className='text-sm text-gray-700 bg-gray-50 p-2 rounded mt-1'>
                                                            {item.notes}
                                                        </p>
                                                    </div>
                                                )}

                                                <div className='mt-3 flex items-center gap-4'>
                                                    <div className='flex items-center text-sm'>
                                                        <Clock className='h-4 w-4 text-orange-500 mr-1' />
                                                        <span className='text-gray-600'>Thời gian ước tính:</span>
                                                        <span className='ml-1 font-medium'>{item.estimatedTime} phút</span>
                                                    </div>
                                                    <div className='flex items-center text-sm'>
                                                        <span className='text-gray-600'>Còn lại:</span>
                                                        <span className={`ml-1 font-medium ${getTimeRemaining(item.orderTime, item.estimatedTime) === 'Quá hạn'
                                                            ? 'text-red-600'
                                                            : 'text-green-600'
                                                            }`}>
                                                            {getTimeRemaining(item.orderTime, item.estimatedTime)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='ml-6'>
                                                <Button
                                                    onClick={() => handleMarkAsCompleted(item.id)}
                                                    disabled={completedItems.includes(item.id)}
                                                    className={`px-6 py-2 ${completedItems.includes(item.id)
                                                        ? 'bg-gray-400 cursor-not-allowed'
                                                        : 'bg-green-600 hover:bg-green-700'
                                                        } text-white font-medium`}
                                                >
                                                    {completedItems.includes(item.id) ? (
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
