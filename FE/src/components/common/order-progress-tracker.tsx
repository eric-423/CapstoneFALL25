'use client';

import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { OrderStatus } from '@/utils/enum';

import { CheckCircle2, ChefHat, CreditCard, Package, XCircle } from 'lucide-react';

interface OrderProgressTrackerProps {
  currentStatus: string;
  className?: string;
}

const ORDER_STATUSES = [
  {
    key: OrderStatus.UNPAID,
    label: OrderStatus.UNPAID,
    icon: CreditCard,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-300',
    percent: 10, // Example percentage for unpaid status
  },
  {
    key: OrderStatus.VERIFIED,
    label: OrderStatus.VERIFIED,
    icon: CheckCircle2,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-300',
    percent: 35,
  },
  {
    key: OrderStatus.PROCESSING,
    label: OrderStatus.PROCESSING,
    icon: ChefHat,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-300',
    percent: 70,
  },
  {
    key: OrderStatus.COMPLETED,
    label: OrderStatus.COMPLETED,
    icon: Package,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-300',
    percent: 100,
  },
];

const CANCELLED_STATUS = {
  key: OrderStatus.CANCELLED,
  label: OrderStatus.CANCELLED,
  icon: XCircle,
  color: 'text-red-600',
  bgColor: 'bg-red-100',
  borderColor: 'border-red-300',
};

export default function OrderProgressTracker({ currentStatus, className }: OrderProgressTrackerProps) {
  // Handle cancelled orders separately
  if (currentStatus === OrderStatus.CANCELLED) {
    const CancelledIcon = CANCELLED_STATUS.icon;
    return (
      <div className={cn('w-full p-4 bg-red-50 rounded-lg border border-red-200', className)}>
        <div className='flex items-center justify-center space-x-2'>
          <CancelledIcon className='h-5 w-5 text-red-600' />
          <span className='font-medium text-red-700'>Đơn hàng đã bị hủy</span>
        </div>
      </div>
    );
  }

  // Find current status index
  const currentIndex = ORDER_STATUSES.findIndex((status) => status.key === currentStatus);

  return (
    <div className={cn('w-full space-y-4 ', className)}>
      {/* Progress Bar */}
      <div className='relative mx-5'>
        <Progress value={ORDER_STATUSES[currentIndex].percent} className='h-2' />
        <div className='absolute inset-0 flex justify-between items-center'>
          {ORDER_STATUSES.map((status, index) => {
            const Icon = status.icon;
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;

            return (
              <div
                key={status.key}
                className={cn(
                  'flex items-center justify-center w-8 h-8 rounded-full border-2 bg-white transition-all duration-300 mx-5',
                  isCompleted ? `${status.borderColor} ${status.bgColor}` : 'border-gray-300 bg-gray-100',
                  isCurrent && 'ring-2 ring-offset-2 ring-primary/50',
                )}
              >
                <Icon
                  className={cn('h-4 w-4 transition-colors duration-300', isCompleted ? status.color : 'text-gray-400')}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Status Labels */}
      <div className='flex justify-between text-xs'>
        {ORDER_STATUSES.map((status, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div
              key={status.key}
              className={cn(
                'flex flex-col space-y-1 flex-1 items-center transition-all duration-300',
                isCurrent && 'transform scale-105',
              )}
            >
              <span
                className={cn(
                  'font-medium transition-colors duration-300 text-center max-w-[80px] break-words',
                  isCompleted ? status.color : 'text-gray-500',
                  isCurrent && 'font-semibold',
                )}
              >
                {status.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Current Status Description */}
      <div className='text-center p-3 pt-0'>
        <p className='text-sm text-primary font-medium'>
          {currentStatus === OrderStatus.UNPAID && 'Vui lòng hoàn tất thanh toán để xử lý đơn hàng'}
          {currentStatus === OrderStatus.VERIFIED && 'Đơn hàng đã được xác nhận và đang chờ chuẩn bị'}
          {currentStatus === OrderStatus.PROCESSING && 'Đầu bếp đang chuẩn bị món ăn của bạn'}
          {currentStatus === OrderStatus.COMPLETED && 'Đơn hàng đã hoàn tất'}
        </p>
      </div>
    </div>
  );
}
