import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCustomerOrders } from '@/hooks/useCustomerOrders';
import { OrderStatus } from '@/utils/enum';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CANCEL_ORDER_MESSAGES } from './cancel-order-contents';

import { DialogDescription } from '@radix-ui/react-dialog';

interface CancelOrderDialogProps {
  onCloseDialog: () => void;
  onProceed: () => void;
  orderId: number;
  orderStatus?: OrderStatus;
}

export const CancelOrderDialog = ({ onCloseDialog, onProceed, orderId, orderStatus }: CancelOrderDialogProps) => {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [state, setState] = useState<'confirmation' | 'success' | 'success_unpaid' | 'error'>('confirmation');
  const { cancelOrderMutation } = useCustomerOrders();
  const navigate = useNavigate();
  const contents = CANCEL_ORDER_MESSAGES[state];

  const handleCloseDialog = () => {
    onCloseDialog();
    setCancelDialogOpen(false);
    if (state === 'success' || state === 'success_unpaid') {
      window.location.reload();
    }
    setState('confirmation');
  };

  const handleCancelOrder = () => {
    if (state !== 'confirmation') return;
    cancelOrderMutation(orderId, {
      onSuccess: () => {
        setState(`success${orderStatus === OrderStatus.UNPAID ? '_unpaid' : ''}`);
      },
      onError: (error) => {
        setState('error');
        console.error('Error canceling order:', error);
      },
    });
    onProceed();
  };
  return (
    <Dialog open={cancelDialogOpen} onOpenChange={handleCloseDialog}>
      <Button variant='outline' className='w-full sm:w-auto' onClick={() => setCancelDialogOpen(true)}>
        Hủy đơn
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='flex items-center flex-col'>{contents.title}</DialogTitle>
        </DialogHeader>
        {contents.description && <DialogDescription className='text-center'>{contents.description}</DialogDescription>}
        <DialogFooter className='flex sm:justify-center gap-3'>
          <Button variant='outline' onClick={handleCloseDialog}>
            {contents.noButton}
          </Button>
          <Button
            variant='destructive'
            onClick={state === 'confirmation' ? handleCancelOrder : () => navigate('/menu')}
          >
            {contents.yesButton}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
