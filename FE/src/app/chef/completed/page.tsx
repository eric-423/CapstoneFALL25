'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, ChefHat, Users } from 'lucide-react';
import {
    mockCompletedItems,
    priorityColors,
    priorityLabels,
    type CompletedFoodItem
} from '../mock-data';
import CompleteLayout from '../components/CompleteLayout';

export default function CompletedPage() {
    const [completedItems, setCompletedItems] = useState<CompletedFoodItem[]>(mockCompletedItems);

    const getProcessingTime = (orderTime: string, completedTime: string) => {
        const [orderHours, orderMinutes] = orderTime.split(':').map(Number);
        const [completedHours, completedMinutes] = completedTime.split(':').map(Number);

        const orderDateTime = new Date();
        orderDateTime.setHours(orderHours, orderMinutes, 0, 0);

        const completedDateTime = new Date();
        completedDateTime.setHours(completedHours, completedMinutes, 0, 0);

        const diffMinutes = Math.ceil((completedDateTime.getTime() - orderDateTime.getTime()) / 60000);
        return diffMinutes;
    };

    const sortByCompletedTime = (items: CompletedFoodItem[]) => {
        return [...items].sort((a, b) => {
            const [aHours, aMinutes] = a.completedTime.split(':').map(Number);
            const [bHours, bMinutes] = b.completedTime.split(':').map(Number);

            const aDateTime = new Date();
            aDateTime.setHours(aHours, aMinutes, 0, 0);

            const bDateTime = new Date();
            bDateTime.setHours(bHours, bMinutes, 0, 0);

            return bDateTime.getTime() - aDateTime.getTime();
        });
    };

    const totalCompleted = completedItems.length;
    const avgProcessingTime = completedItems.length > 0
        ? Math.round(completedItems.reduce((sum, item) => sum + getProcessingTime(item.orderTime, item.completedTime), 0) / completedItems.length)
        : 0;

    return (
        <CompleteLayout title='Đã hoàn thành' icon={CheckCircle} description='Các món ăn đã hoàn thành' >
            <div className='max-w-6xl mx-auto'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
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
                                    <p className='text-sm font-medium text-gray-600'>Thời gian TB</p>
                                    <p className='text-2xl font-bold text-gray-900'>{avgProcessingTime}p</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className='p-6'>
                            <div className='flex items-center'>
                                <ChefHat className='h-8 w-8 text-orange-500' />
                                <div className='ml-4'>
                                    <p className='text-sm font-medium text-gray-600'>Hiệu suất</p>
                                    <p className='text-2xl font-bold text-gray-900'>{totalCompleted > 0 ? '100%' : '0%'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className='space-y-4'>
                    <h2 className='text-2xl font-bold text-gray-800 mb-6'>Danh sách món ăn đã hoàn thành</h2>

                    {completedItems.length === 0 ? (
                        <Card>
                            <CardContent className='p-12 text-center'>
                                <CheckCircle className='h-16 w-16 text-gray-400 mx-auto mb-4' />
                                <h3 className='text-lg font-medium text-gray-600 mb-2'>Chưa có món ăn nào hoàn thành</h3>
                                <p className='text-gray-500'>Các món ăn đã hoàn thành sẽ hiển thị ở đây!</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className='grid gap-4'>
                            {sortByCompletedTime(completedItems).map((item) => (
                                <Card key={item.id} className='bg-green-50 border-green-200'>
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
                                                    <Badge className='bg-green-100 text-green-800 border-green-200'>
                                                        Đã hoàn thành
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
                                                        <CheckCircle className='h-4 w-4 text-green-500 mr-1' />
                                                        <span className='text-gray-600'>Hoàn thành lúc:</span>
                                                        <span className='ml-1 font-medium text-green-600'>{item.completedTime}</span>
                                                    </div>
                                                    <div className='flex items-center text-sm'>
                                                        <Clock className='h-4 w-4 text-blue-500 mr-1' />
                                                        <span className='text-gray-600'>Thời gian chế biến:</span>
                                                        <span className='ml-1 font-medium text-blue-600'>
                                                            {getProcessingTime(item.orderTime, item.completedTime)} phút
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
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </CompleteLayout>
    );
}
