'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/contexts/cart/CartContext';
import { Product } from '@/types/product.type';

import { ShoppingBag, X } from 'lucide-react';
import { useState } from 'react';

import { QuantitySelector } from '../quantity-selector';

interface AddToCartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
}

export function AddToCartDialog({ open, onOpenChange, product }: AddToCartDialogProps) {
  const { addItem } = useCart();
  const [mainQuantity, setMainQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  const handleQuantityChange = (value: number) => {
    // if (item === 'main') {
    setMainQuantity(Math.max(1, mainQuantity + value));
    // } else {
    //   setExtras({
    //     ...extras,
    //     [item]: Math.max(0, extras[item as keyof typeof extras] + value),
    //   });
    // }
  };

  const handleAddToCart = () => {
    const cartItem = {
      productId: product.productId,
      productName: product.productName,
      productPrice: product.productPrice,
      quantity: mainQuantity,
      note: notes,
    };
    addItem(cartItem);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px] p-0 bg-background overflow-hidden rounded-xl gap-1'>
        <div className='sticky top-0 z-10 bg-background pt-4 px-6'>
          <div className='flex items-center justify-between mb-2'>
            <DialogTitle className='text-xl font-bold'>Thêm món ăn</DialogTitle>
            <DialogClose className='h-8 w-8 rounded-full hover:bg-gray-100 flex items-center justify-center'>
              <X className='h-4 w-4' />
              <span className='sr-only'>Close</span>
            </DialogClose>
          </div>
          <Separator className='mb-4' />
        </div>

        <div className='px-6 max-h-[80vh] overflow-y-auto custom-scrollbar'>
          {/* Main Dish */}
          <div className='flex gap-4 mb-6'>
            <div className='relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 object-cover'>
              <img src={product.productImage} alt={product.productName} className='object-cover h-full w-full' />
            </div>
            <div className='flex-grow'>
              <h3 className='font-bold text-lg'>{product.productName}</h3>
              <div className='text-sm mt-1 mb-1'>{product.productDescription}</div>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <span className='font-bold text-primary'>{product.productPrice.toLocaleString()}đ</span>
                  {/* <span className='text-gray-500 text-sm line-through'>{product.productPrice.toLocaleString()}đ</span> */}
                  {/* <Badge className='bg-primary/10 text-primary hover:bg-primary/20 ml-1'>-30%</Badge> */}
                </div>
                <QuantitySelector
                  value={mainQuantity}
                  onDecrease={() => handleQuantityChange(-1)}
                  onIncrease={() => handleQuantityChange(1)}
                />
              </div>
            </div>
          </div>

          {/* Extra Items */}
          <div>
            <h3 className='font-medium text-lg mb-3'>Ghi chú</h3>
            <Textarea
              value={notes}
              placeholder='Đối với combo hãy ghi chú cả topping đặc biệt ở đây, hoặc tụi mình sẽ tự chọn cho bạn'
              className='resize-none h-24 mb-1'
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        {/* Footer with Add to Cart Button */}
        <div className='sticky bottom-0 bg-background border-t border-gray-200 p-4 m-2 mt-0'>
          <Button
            className='w-full bg-[#4CAF50] hover:bg-[#43A047] text-white h-12 rounded-lg'
            onClick={handleAddToCart}
          >
            <ShoppingBag className='h-5 w-5 mr-2' />
            {(product.productPrice * mainQuantity).toLocaleString()}đ - Thêm vào giỏ hàng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
