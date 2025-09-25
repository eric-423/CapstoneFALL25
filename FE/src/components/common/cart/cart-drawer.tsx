'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/cart/CartContext';
import { STORE_INFO } from '@/utils/mockupData';

import { ChevronRight, Edit, MapPin, ShoppingCart, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import ControlledButton from '../controlled-button';
import { QuantitySelector } from '../quantity-selector';

export function CartDrawer() {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCart();
  const [open, setOpen] = useState(false);
  function handleCheckoutClicked() {
    toast('Tụi mình đóng cửa mất rồi, cảm ơn bạn đã ghé thăm!', {
      theme: 'light',
      hideProgressBar: false,
    });
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant='ghost' size={'icon'} className='text-primary hover:text-[#B84A0E] hover:bg-[#FFE8D6] mx-12'>
          <div className='relative flex items-center justify-center h-10 w-10 rounded-full transition-colors'>
            <ShoppingCart className='h-5 w-5 text-primary' />
            <Badge className='absolute -top-1 -right-3 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-primary hover:bg-primary'>
              {getTotalItems()}
            </Badge>
          </div>

          <span className='ml-2'>Giỏ hàng</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className='max-w-[100vw] sm:max-w-[500px] mx-auto'>
        <div className='mx-auto w-full max-w-[500px]'>
          <DrawerHeader className='px-6 pt-6 pb-4 border-b border-foreground/10'>
            <DrawerTitle className='font-bold text-lg'>Giỏ hàng của bạn</DrawerTitle>
            <div className='flex items-center text-sm text-gray-600 mt-1'>
              <MapPin className='h-3.5 w-3.5 mr-1 flex-shrink-0' />
              <p className='line-clamp-1'>
                {STORE_INFO.name} - {STORE_INFO.address}
              </p>
              <ControlledButton title='Đổi cửa hàng' className='ml-2'>
                <Edit className='h-3.5 w-3.5' />
              </ControlledButton>
            </div>
          </DrawerHeader>

          {/* Cart Items */}
          {getTotalItems() > 0 ? (
            <>
              <ScrollArea className='flex-1 px-6 py-4' style={{ maxHeight: 'calc(70vh - 200px)' }}>
                <div className='space-y-4'>
                  {items.map((item, index) => (
                    <div key={item.productId} className='group'>
                      <div className='flex gap-3'>
                        {/* Remove button (visible on hover) */}
                        <button
                          className='opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 flex-shrink-0 rounded-full bg-foreground/5 hover:bg-foreground/15 transition-colors flex items-center justify-center'
                          onClick={() => removeItem(item)}
                        >
                          <X className='h-3 w-3 text-foreground/50' />
                        </button>

                        {/* Item content */}
                        <div className='flex-grow'>
                          <div className='flex justify-between'>
                            <h4 className='font-medium'>{item.productName}</h4>
                            <div className='text-primary font-medium'>
                              {item.productPrice.toLocaleString()}đ × {item.quantity}
                            </div>
                          </div>

                          {item.note && item.note.length > 0 && (
                            <div className='text-sm text-gray-600 mt-1'>
                              <span className='font-medium'>Ghi chú:</span> {item.note}
                            </div>
                          )}
                          {/* Item actions */}
                          <div className='flex items-center justify-between mt-2'>
                            <QuantitySelector
                              value={item.quantity}
                              onIncrease={() => updateQuantity({ ...item, quantity: item.quantity + 1 })}
                              onDecrease={() => updateQuantity({ ...item, quantity: item.quantity - 1 })}
                            />

                            <div className='flex items-center gap-1'>
                              <ControlledButton>
                                <Edit className='h-3.5 w-3.5' />
                              </ControlledButton>
                            </div>
                          </div>
                        </div>
                      </div>

                      {index < items.length - 1 && <Separator className='mt-4 bg-foreground/10' />}
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Subtotal and Checkout */}
              <DrawerFooter className='px-6 pt-4 pb-6 border-t border-foreground/10'>
                <div className='flex justify-between items-center mb-4'>
                  <span className='font-medium text-lg'>Tạm tính</span>
                  <span className='font-bold text-xl text-primary'>{getTotalPrice().toLocaleString()}đ</span>
                </div>

                {/* <Link to='/checkout'> */}
                <Button
                  className='w-full h-12 bg-[#4CAF50] hover:bg-[#43A047] text-white rounded-lg font-medium'
                  onClick={handleCheckoutClicked}
                >
                  Xác nhận đơn hàng
                  <ChevronRight className='h-4 w-4 ml-1' />
                </Button>
                {/* </Link> */}
                <DrawerClose asChild>
                  <Button variant='outline' className='w-full'>
                    Tiếp tục mua hàng
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </>
          ) : (
            <div className='text-center py-8'>
              <p className='text-gray-500'>Giỏ hàng của bạn hiện đang trống</p>
              <Link to='/menu'>
                <Button variant='outline' className='mt-4' onClick={() => setOpen(false)}>
                  Tiếp tục mua sắm
                </Button>
              </Link>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
