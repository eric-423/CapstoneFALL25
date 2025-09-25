import { STORE_INFO } from '@/utils/mockupData';

import { AlertCircle } from 'lucide-react';

interface CancelOrderMessages {
  title: React.ReactNode;
  description?: React.ReactNode;
  noButton: string;
  yesButton: string;
}

export const CANCEL_ORDER_MESSAGES = {
  confirmation: {
    title: (
      <>
        <AlertCircle className='h-8 w-8 mb-3 text-red-500' />
        <p>Bạn có chắc chắn muốn hủy đơn hàng này?</p>
      </>
    ),
    noButton: 'Không, giữ đơn hàng',
    yesButton: 'Có, hủy đơn hàng',
  } as CancelOrderMessages,
  success: {
    title: (
      <>
        <AlertCircle className='h-8 w-8 mb-3 text-green-500' />
        <p>Đơn hàng đã được hủy thành công!</p>
      </>
    ),
    description: (
      <>
        <p className='px-5'>Chúng tôi sẽ liên hệ bạn trong vòng 48h tới để xác nhận thông tin hoàn tiền</p>
        <div className={`rounded-lg mt-3 shadow-sm  border-none bg-foreground text-center py-3`}>
          <p className='text-lg text-white'>
            <>
              Nếu bạn cần hỗ trợ, vui lòng liên hệ:
              <br />
              <span className='text-secondary font-bold'>{STORE_INFO.phone}</span>
            </>
          </p>
        </div>
      </>
    ),
    noButton: 'Quay lại',
    yesButton: 'Đặt đơn hàng mới',
  } as CancelOrderMessages,
  success_unpaid: {
    title: (
      <>
        <AlertCircle className='h-8 w-8 mb-3 text-green-500' />
        <p>Đơn hàng đã được hủy thành công!</p>
      </>
    ),
    description: (
      <>
        <div className={`rounded-lg shadow-sm  border-none bg-foreground text-center py-3`}>
          <p className='text-lg text-white'>
            <>
              Nếu bạn cần hỗ trợ, vui lòng liên hệ:
              <br />
              <span className='text-secondary font-bold'>{STORE_INFO.phone}</span>
            </>
          </p>
        </div>
      </>
    ),
    noButton: 'Quay lại',
    yesButton: 'Đặt đơn hàng mới',
  } as CancelOrderMessages,
  error: {
    title: (
      <>
        <AlertCircle className='h-8 w-8 mb-3 text-red-500' />
        <p>Đã có lỗi xảy ra khi hủy đơn hàng.</p>
      </>
    ),
    description: (
      <>
        <p className='px-5'>Vui lòng thử lại sau hoặc liên hệ với chúng tôi nếu vấn đề vẫn tiếp diễn</p>
        <div className={`rounded-lg mt-3 shadow-sm  border-none bg-foreground text-center py-3`}>
          <p className='text-lg text-white'>
            <>
              Nếu bạn cần hỗ trợ, vui lòng liên hệ:
              <br />
              <span className='text-secondary font-bold'>{STORE_INFO.phone}</span>
            </>
          </p>
        </div>
      </>
    ),
    noButton: 'Quay lại',
    yesButton: 'Đặt đơn hàng mới',
  } as CancelOrderMessages,
};
