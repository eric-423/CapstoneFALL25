'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { STORE_INFO } from '@/utils/mockupData';

import { ArrowRight, CheckCircle2, Home, ShoppingBag, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function PaymentResultContent({ isSuccess = true }) {
  const navigate = useNavigate();
  return (
    <div className='from-orange-50 to-amber-50 py-8 px-4 md:px-6'>
      <div className='container mx-auto max-w-2xl'>
        {/* Status Header */}
        <div className='text-center mb-6'>
          <div
            className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
              isSuccess ? 'bg-green-100' : 'bg-red-100'
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

        {/* Status Badge */}
        <div className='text-center mb-6'>
          <Badge
            className={`text-sm px-4 py-2 ${
              isSuccess ? 'bg-green-600 hover:bg-green-800' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isSuccess ? 'Đã thanh toán' : 'Thanh toán thất bại'}
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className='space-y-3'>
          {isSuccess ? (
            <>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
                <Button variant='outline' className='py-3' onClick={() => navigate('/')}>
                  <Home className='h-4 w-4 mr-2' />
                  Về trang chủ
                </Button>
                <Button variant='outline' className='py-3' onClick={() => navigate('/menu')}>
                  <ShoppingBag className='h-4 w-4 mr-2' />
                  Tiếp tục đặt hàng
                </Button>

                <Button
                  className='w-full bg-primary hover:bg-primary/90 text-white py-3'
                  onClick={() => navigate('/profile')}
                >
                  Xem chi tiết đơn hàng
                  <ArrowRight className='h-4 w-4' />
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className='flex items-center justify-center'>
                <Button variant='outline' className='py-3 w-50' onClick={() => navigate('/')}>
                  <Home className='h-4 w-4 mr-2' />
                  Về trang chủ
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Additional Info */}
        <Card className={`mt-6 shadow-sm  border-none ${isSuccess ? 'bg-secondary' : 'bg-foreground'}`}>
          <CardContent className='p-0 text-center'>
            <p className='text-lg text-white'>
              {isSuccess ? (
                <span className=' font-bold'>Cảm ơn bạn đã tin tưởng Tấm Tắc!</span>
              ) : (
                <>
                  Nếu bạn cần hỗ trợ, vui lòng liên hệ:
                  <br />
                  <span className='text-secondary font-bold'>{STORE_INFO.phone}</span>
                </>
              )}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
