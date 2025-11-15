'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useOrderLiveTracking } from '@/utils/hooks/useOrderLiveTracking';
import { cn } from '@/utils/lib/utils';

import { MapPin, Navigation2, Radio, RefreshCcw, Wifi, WifiOff } from 'lucide-react';
import { useMemo } from 'react';

interface OrderLiveTrackingCardProps {
  orderId?: number;
  initialStatus?: string;
  className?: string;
}

const STATUS_CONFIG = {
  UNPAID: { label: 'Chờ thanh toán', badgeClass: 'bg-yellow-500 text-white' },
  VERIFIED: { label: 'Đã xác nhận', badgeClass: 'bg-blue-500 text-white' },
  PROCESSING: { label: 'Đang chuẩn bị', badgeClass: 'bg-blue-500 text-white' },
  IN_DELIVERY: { label: 'Đang giao', badgeClass: 'bg-blue-500 text-white' },
  COMPLETED: { label: 'Hoàn thành', badgeClass: 'bg-green-600 text-white' },
  CANCELLED: { label: 'Đã hủy', badgeClass: 'bg-red-500 text-white' },
} as const;

const getStatusConfig = (value?: string) => {
  if (!value) return null;

  const fromKey = STATUS_CONFIG[value as keyof typeof STATUS_CONFIG];
  if (fromKey) return fromKey;

  const fromLabel = Object.values(STATUS_CONFIG).find((item) => item.label === value);
  if (fromLabel) return fromLabel;

  return { label: value, badgeClass: 'bg-secondary text-foreground' };
};

export function OrderLiveTrackingCard({ orderId, initialStatus, className }: OrderLiveTrackingCardProps) {
  const hasOrder = Boolean(orderId);

  const {
    currentStatus,
    statusMessage,
    lastUpdatedAt,
    shipperLocation,
    isStatusConnected,
    isLocationConnected,
  } = useOrderLiveTracking({
    orderId,
    initialStatus,
    enabled: hasOrder,
  });

  const statusBadge = useMemo(() => {
    if (!currentStatus) return null;
    const config = getStatusConfig(currentStatus);
    if (!config) return null;

    return <Badge className={config.badgeClass}>{config.label}</Badge>;
  }, [currentStatus]);

  if (!hasOrder) {
    return null;
  }

  return (
    <Card className={cn('border border-foreground/10 shadow-sm', className)}>
      <CardHeader className='space-y-3'>
        <div className='flex items-center justify-between gap-4 flex-wrap'>
          <CardTitle className='text-lg font-semibold flex items-center gap-2'>
            <Radio className='h-5 w-5 text-primary' />
            Theo dõi trạng thái theo thời gian thực
          </CardTitle>
          <div className='flex flex-wrap gap-2 text-xs'>
            <Badge
              variant={isStatusConnected ? 'secondary' : 'outline'}
              className={cn('flex items-center gap-1', isStatusConnected ? 'text-primary' : 'text-muted-foreground')}
            >
              {isStatusConnected ? (
                <>
                  <Wifi className='h-3 w-3' />
                  Đã đồng bộ trạng thái
                </>
              ) : (
                <>
                  <WifiOff className='h-3 w-3' />
                  Mất kết nối trạng thái
                </>
              )}
            </Badge>
            <Badge
              variant={isLocationConnected ? 'secondary' : 'outline'}
              className={cn('flex items-center gap-1', isLocationConnected ? 'text-primary' : 'text-muted-foreground')}
            >
              {isLocationConnected ? (
                <>
                  <Navigation2 className='h-3 w-3' />
                  Đang nhận vị trí
                </>
              ) : (
                <>
                  <Navigation2 className='h-3 w-3 opacity-50' />
                  Đợi tín hiệu vị trí
                </>
              )}
            </Badge>
          </div>
        </div>
        {lastUpdatedAt && (
          <p className='text-xs text-muted-foreground flex items-center gap-1'>
            <RefreshCcw className='h-3 w-3' />
            Cập nhật gần nhất {lastUpdatedAt.toLocaleTimeString()}
          </p>
        )}
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-2'>
          <p className='text-sm text-muted-foreground'>Trạng thái hiện tại</p>
          {statusBadge}
          {statusMessage && <p className='text-sm text-foreground/80'>{statusMessage}</p>}
        </div>

        <Separator />

        <div className='space-y-3'>
          <div className='flex items-center gap-2 text-sm font-medium text-foreground'>
            <MapPin className='h-4 w-4 text-primary' />
            Vị trí shipper
          </div>
          {shipperLocation ? (
            <div className='rounded-lg border border-primary/10 bg-primary/5 p-3 text-sm space-y-1'>
              <div className='flex items-center gap-2'>
                <span className='font-medium'>Kinh độ:</span>
                <span>{shipperLocation.longitude.toFixed(5)}</span>
              </div>
              <div className='flex items-center gap-2'>
                <span className='font-medium'>Vĩ độ:</span>
                <span>{shipperLocation.latitude.toFixed(5)}</span>
              </div>
              {shipperLocation.timestamp && (
                <p className='text-xs text-muted-foreground'>
                  {new Date(shipperLocation.timestamp).toLocaleTimeString()} &middot;{' '}
                  {shipperLocation.customerAddress || 'Đang di chuyển'}
                </p>
              )}
            </div>
          ) : (
            <p className='text-sm text-muted-foreground'>
              Dữ liệu vị trí sẽ hiển thị khi shipper bắt đầu di chuyển tới bạn.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default OrderLiveTrackingCard;


