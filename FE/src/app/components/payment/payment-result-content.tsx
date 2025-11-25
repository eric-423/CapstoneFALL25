'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { STORE_INFO } from '@/utils/mockupData';

import { CheckCircle2, Home, ShoppingBag, XCircle, ClipboardList } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function PaymentResultContent({ isSuccess = true }) {
    const router = useRouter();
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        // Get role from cookie
        const role = document.cookie
            .split('; ')
            .find(row => row.startsWith('role='))
            ?.split('=')[1];
        setUserRole(role || null);
    }, []);

    return (
        <div className='from-orange-50 to-amber-50 py-8 px-4 md:px-6'>
            <div className='container mx-auto max-w-2xl'>
                {/* Status Header */}
                <div className='text-center mb-6'>
                    <div
                        className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${isSuccess ? 'bg-green-100' : 'bg-red-100'
                            }`}
                    >
                        {isSuccess ? (
                            <CheckCircle2 className='w-10 h-10 text-green-600' />
                        ) : (
                            <XCircle className='w-10 h-10 text-red-600' />
                        )}
                    </div>

                    <h1 className={`text-3xl font-bold mb-2 ${isSuccess ? 'text-green-700' : 'text-red-700'}`}>
                        {isSuccess ? 'Thanh toán thành công!' : 'Thanh toán thất bại!'}
                    </h1>

                    <p className='text-muted-foreground text-lg'>
                        {isSuccess ? (
                            <>Đơn hàng của bạn đã được xác nhận và đang được chuẩn bị.</>
                        ) : (
                            'Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.'
                        )}
                    </p>
                </div>

                {/* Action Buttons */}
                <div className='space-y-3'>
                    {isSuccess ? (
                        <>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                                {userRole === 'STAFF' || userRole === 'WAITER' ? (
                                    <Button
                                        variant='outline'
                                        className='py-3 bg-gradient-to-r from-[#EC6426] to-[#F8A91F] hover:opacity-90 text-white border-0'
                                        onClick={() => router.push('/staff/tables')}
                                    >
                                        <ClipboardList className='h-4 w-4 mr-2' />
                                        Quay về quản lý bàn
                                    </Button>
                                ) : (
                                    <>
                                        <Button
                                            variant='outline'
                                            className='py-3 bg-black/30 hover:bg-black/70'
                                            onClick={() => router.push('/')}
                                        >
                                            <Home className='h-4 w-4 mr-2' />
                                            Về trang chủ
                                        </Button>
                                        <Button
                                            variant='outline'
                                            className='py-3 bg-black/30 hover:bg-black/70'
                                            onClick={() => router.push('/menu')}
                                        >
                                            <ShoppingBag className='h-4 w-4 mr-2' />
                                            Tiếp tục đặt hàng
                                        </Button>
                                    </>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <div className='flex items-center justify-center gap-3'>
                                <Button variant='outline' className='py-3' onClick={() => router.push('/')}>
                                    <Home className='h-4 w-4 mr-2' />
                                    Về trang chủ
                                </Button>
                                {(userRole === 'STAFF' || userRole === 'WAITER') && (
                                    <Button
                                        variant='outline'
                                        className='py-3 bg-gradient-to-r from-[#EC6426] to-[#F8A91F] text-white border-0'
                                        onClick={() => router.push('/staff/tables')}
                                    >
                                        <ClipboardList className='h-4 w-4 mr-2' />
                                        Quay về quản lý bàn
                                    </Button>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Additional Info */}
                <Card className='mt-6 shadow-sm bg-primary/90 mb-20 mt-15'>
                    <CardContent className='p-0 text-center'>
                        <p className='text-lg text-white'>Nếu bạn cần hỗ trợ, vui lòng liên hệ:
                            <br />
                            <span className='text-primary-foreground font-bold'>{STORE_INFO.phone}</span>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}