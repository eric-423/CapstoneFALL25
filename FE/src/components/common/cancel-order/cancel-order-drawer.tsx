import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { useCustomerOrders } from '@/hooks/useCustomerOrders';
import { OrderStatus } from '@/utils/enum';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CANCEL_ORDER_MESSAGES } from './cancel-order-contents';

interface CancelOrderDrawerProps {
  onCloseDrawer: () => void;
  onProceed: () => void;
  orderId: number;
  orderStatus?: OrderStatus;
}

export const CancelOrderDrawer = ({ onCloseDrawer, onProceed, orderId, orderStatus }: CancelOrderDrawerProps) => {
  const [cancelDrawerOpen, setCancelDrawerOpen] = useState(false);
  const [state, setState] = useState<'confirmation' | 'success' | 'success_unpaid' | 'error'>('confirmation');
  const { cancelOrderMutation } = useCustomerOrders();
  const navigate = useNavigate();
  const contents = CANCEL_ORDER_MESSAGES[state];

  const handleCloseDrawer = () => {
    onCloseDrawer();
    setCancelDrawerOpen(false);
    setState('confirmation');
  };

  const handleCancelOrder = () => {
    if (state !== 'confirmation') return;
    cancelOrderMutation(orderId, {
      onSuccess: () => {
        setState(`success${orderStatus === OrderStatus.UNPAID ? '_unpaid' : ''}`);
        window.location.reload();
      },
      onError: (error) => {
        setState('error');
        console.error('Error canceling order:', error);
      },
    });
    onProceed();
  };
  return (
    <Drawer open={cancelDrawerOpen} onOpenChange={handleCloseDrawer}>
      <Button variant='outline' className='w-full sm:w-auto' onClick={() => setCancelDrawerOpen(true)}>
        Hủy đơn
      </Button>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className='flex items-center flex-col'>{contents.title}</DrawerTitle>
        </DrawerHeader>
        {contents.description && <DrawerDescription className='text-center'>{contents.description}</DrawerDescription>}
        <DrawerFooter className='flex sm:justify-center gap-3'>
          <Button variant='outline' onClick={handleCloseDrawer}>
            {contents.noButton}
          </Button>
          <Button
            variant='destructive'
            onClick={state === 'confirmation' ? handleCancelOrder : () => navigate('/menu')}
          >
            {contents.yesButton}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
