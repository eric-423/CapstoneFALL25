'use client';

import { Progress } from '@/components/ui/progress';
import { cn } from '@/utils/lib/utils';

import { CheckCircle2, ChefHat, CreditCard, Package, Truck, UtensilsCrossed, XCircle } from 'lucide-react';

interface OrderProgressTrackerProps {
  currentStatus: string;
  className?: string;
}

const ORDER_STATUSES = [
  {
    key: 'CREATED',
    label: 'Đã tạo đơn',
    icon: CreditCard,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-300',
    percent: 0,
  },
  {
    key: 'IN_PROCESS',
    label: 'Đang xử lý',
    icon: CheckCircle2,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-300',
    percent: 17.5,
  },
  {
    key: 'COOKING',
    label: 'Đang nấu',
    icon: ChefHat,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-300',
    percent: 35,
  },
  {
    key: 'COOKED',
    label: 'Đã nấu xong',
    icon: UtensilsCrossed,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    borderColor: 'border-amber-300',
    percent: 50,
  },
  {
    key: 'SHIPPING',
    label: 'Đang giao',
    icon: Truck,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    borderColor: 'border-purple-300',
    percent: 67.5,
  },
  {
    key: 'DELIVERED',
    label: 'Đã giao',
    icon: Package,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-300',
    percent: 83,
  },
  {
    key: 'COMPLETED',
    label: 'Hoàn tất',
    icon: CheckCircle2,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
    borderColor: 'border-emerald-300',
    percent: 100,
  },
];

const CANCELLED_STATUS = {
  key: 'CANCEL',
  label: 'Đơn hàng đã hủy',
  icon: XCircle,
  color: 'text-red-600',
  bgColor: 'bg-red-100',
  borderColor: 'border-red-300',
};

// Map backend status to frontend progress tracker status
const mapStatusToProgressStatus = (status: string): string => {
  const normalized = status?.toUpperCase?.() || '';

  // Map các status từ backend sang status trong progress tracker
  const statusMap: Record<string, string> = {
    // Status ban đầu
    'UNPAID': 'CREATED',
    'CREATED': 'CREATED',
    'VERIFIED': 'CREATED', // VERIFIED được coi như CREATED trong progress

    // Status nấu ăn
    'PROCESSING': 'COOKING', // PROCESSING có thể là COOKING hoặc IN_PROCESS
    'COOKING': 'COOKING',
    'COOKED': 'COOKED',

    // Status xử lý
    'IN_PROCESS': 'IN_PROCESS',

    // Status giao hàng
    'SHIPPING': 'SHIPPING',
    'DELIVERING': 'SHIPPING', // DELIVERING map sang SHIPPING
    'IN_DELIVERY': 'SHIPPING', // IN_DELIVERY map sang SHIPPING

    // Status hoàn thành
    'DELIVERED': 'DELIVERED',
    'COMPLETED': 'COMPLETED',
    'PAID': 'COMPLETED', // PAID được coi như COMPLETED
  };

  return statusMap[normalized] || normalized;
};

export default function OrderProgressTracker({ currentStatus, className }: OrderProgressTrackerProps) {
  const normalizedStatus = currentStatus?.toUpperCase?.() || '';
  const isCancelled = normalizedStatus === 'CANCEL' || normalizedStatus === 'CANCELLED';

  if (isCancelled) {
    const CancelledIcon = CANCELLED_STATUS.icon;
    return (
      <div className={cn('w-full p-4 bg-red-50 rounded-lg border border-red-200', className)}>
        <div className='flex items-center justify-center space-x-2'>
          <CancelledIcon className='h-5 w-5 text-red-600' />
          <span className='font-medium   text-red-700'>{CANCELLED_STATUS.label}</span>
        </div>
      </div>
    );
  }


  const mappedStatus = mapStatusToProgressStatus(normalizedStatus);
  const currentIndex = ORDER_STATUSES.findIndex((status) => status.key === mappedStatus);


  const finalIndex = currentIndex === -1
    ? ORDER_STATUSES.findIndex((status) => status.key === normalizedStatus)
    : currentIndex;


  const safeIndex = finalIndex === -1 ? 0 : finalIndex;
  const progressValue = ORDER_STATUSES[safeIndex]?.percent ?? 0;


  return (
    <div className={cn('w-full space-y-4 mt-[4rem]', className)}>
      <div className='relative px-5'>
        <Progress value={progressValue} className='h-2' />
        <div className='absolute inset-0 flex justify-between items-center px-5'>
          {ORDER_STATUSES.map((status, index) => {
            const Icon = status.icon;
            const isCompleted = index <= safeIndex;
            const isCurrent = index === safeIndex;

            return (
              <div
                key={status.key}
                className={cn(
                  'flex items-center justify-center w-8 h-8 rounded-full border-2 bg-card transition-all duration-300 relative',
                  isCompleted ? `${status.borderColor} ${status.bgColor}` : 'border-gray-300 bg-gray-100',
                  isCurrent && 'ring-2 ring-offset-2 ring-primary/50',
                )}
                style={{
                  transform: 'translateX(0)',
                }}
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
      <div className='flex justify-between text-xs px-5'>
        {ORDER_STATUSES.map((status, index) => {
          const isCompleted = index <= safeIndex;
          const isCurrent = index === safeIndex;

          return (
            <div
              key={status.key}
              className={cn(
                'flex flex-col space-y-1 items-center transition-all duration-300 w-8',
                isCurrent && 'transform scale-105',
              )}
            >
              <span
                className={cn(
                  'font-medium transition-colors duration-300 text-center whitespace-nowrap',
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
      {/* <div className='text-center p-3 pt-0'>
        <p className='text-sm text-primary font-medium'>
          {STATUS_DESCRIPTIONS[normalizedStatus] || STATUS_DESCRIPTIONS[mappedStatus] || 'Đơn hàng đang được xử lý.'}
        </p>
      </div> */}
    </div>
  );
}
