import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { OrderResponse } from '@/types/order.type';
import { OrderStatus } from '@/utils/enum';

import { Calendar, Clock, MapPin, RotateCw, Star } from 'lucide-react';

interface OrderCardProps {
  order: OrderResponse;
  onViewDetails: () => void;
}

export function OrderCard({ order, onViewDetails }: OrderCardProps) {
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case OrderStatus.UNPAID:
        return <Badge className='bg-yellow-500'>{OrderStatus.UNPAID}</Badge>;
      case OrderStatus.PROCESSING:
      case OrderStatus.VERIFIED:
      case OrderStatus.IN_DELIVERY:
        return <Badge className='bg-blue-500'>{status}</Badge>;
      case OrderStatus.COMPLETED:
        return <Badge className='bg-green-500'>{OrderStatus.COMPLETED}</Badge>;
      case OrderStatus.CANCELLED:
        return <Badge className='bg-red-500'>{OrderStatus.CANCELLED}</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card
      className='overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow p-0 gap-3'
      onClick={onViewDetails}
    >
      <CardContent className='p-0'>
        {/* Order image */}

        {/* Order details */}
        <div className='flex-1 p-4 md:p-6 pb-0 md:pb-0'>
          <div className='flex justify-between items-start'>
            <div>
              <div className='flex items-center text-sm text-muted-foreground mb-4'>
                <Calendar className='h-4 w-4 mr-1' />
                <span>{order.date.toLocaleDateString()}</span>
                <Clock className='h-4 w-4 ml-3 mr-1' />
                <span>{order.date.toLocaleTimeString()}</span>
              </div>
              <div className='flex items-start mb-3 '>
                <MapPin className='h-4 w-4 mr-2 flex-shrink-0 text-primary' />
                <p className='text-sm '>{order.restaurant}</p>
              </div>
              <p className='text-sm font-medium'>
                {order.subTotal.toLocaleString()}đ ({order.totalItems} món)
              </p>
              <div className='mt-3'>{getStatusBadge(order.orderStatus)}</div>
            </div>
          </div>
        </div>
      </CardContent>

      <Separator className='bg-foreground/20 mx-5 ' style={{ width: 'inherit' }} />

      <CardFooter className='p-5 pt-0 pb-4 flex flex-wrap gap-2 justify-end'>
        {order.orderStatus === OrderStatus.CANCELLED && (
          <Button
            variant='outline'
            className='text-primary border-primary/20 hover:bg-primary/5'
            size={'sm'}
            // onClick={() => router.push(`/reorder/${order.id}`)}
          >
            <RotateCw className='h-4 w-4 mr-2' />
            Đặt lại
          </Button>
        )}
        {order.orderStatus === OrderStatus.COMPLETED && (
          <Button
            variant='outline'
            className='text-primary border-primary/20 hover:bg-primary/5'
            size={'sm'}
            // onClick={() => router.push(`/menu`)}
          >
            <Star className='h-4 w-4 mr-1' />
            Đánh giá
          </Button>
        )}
        <Button
          variant='default'
          className='bg-primary hover:bg-primary/90'
          size={'sm'}
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails?.();
          }}
        >
          Chi tiết
        </Button>
      </CardFooter>
    </Card>
  );
}
