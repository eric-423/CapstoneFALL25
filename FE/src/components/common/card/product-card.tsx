import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useIsMobile } from '@/utils/hooks/use-mobile';
import { Product } from '@/apis/product.api';
import { contentOverflow } from '@/utils/contentOverflow';

import { Plus, Star } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import { AddToCartDialog } from '../add-to-cart/add-to-cart-dialog';
import { AddToCartDrawer } from '../add-to-cart/add-to-cart-drawer';

type ProductCardProps = {
  item: Product;
  descriptionOverflow?: number;
};

export const ProductCard = ({ item, descriptionOverflow = 40 }: ProductCardProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const isMobile = useIsMobile();
  return (
    <Card className='group p-0 overflow-hidden gap-4 bg-white/80 backdrop-blur-sm border-none shadow-lg hover:shadow-xl transition-all duration-300'>
      <div className='relative h-50 overflow-hidden'>
        <Image
          src={item.productImage || '/placeholder.svg'}
          alt={item.productName}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className='object-cover transition-transform duration-500 group-hover:scale-105'
        />
        <div className='absolute top-4 right-4 bg-white rounded-full px-3 py-1 flex items-center shadow-md'>
          <Star className='h-4 w-4 text-yellow-500 mr-1' fill='#F59E0B' />
          <span className='text-sm font-medium'>{item.rating}</span>
        </div>
      </div>
      <div className='p-4 pt-0'>
        <h3 className='text-base font-bold mb-1'>{item.productName}</h3>
        <p className='text-gray-600 text-sm mb-2 h-10'>
          {contentOverflow(item.productDescription, descriptionOverflow)}
        </p>

        {/* <div className='flex justify-between items-center mb-4'> */}
        <div className='flex items-center justify-between '>
          <span className='font-bold text-primary text-xl'>{item.productPrice.toLocaleString()}đ</span>
          <Button
            size='sm'
            className='bg-secondary !px-4 hover:bg-primary hover:text-white '
            onClick={() => setDialogOpen(true)}
          >
            <Plus className='h-4 w-4 mr-1' />
            Thêm
          </Button>
        </div>
      </div>
      {dialogOpen && !isMobile && <AddToCartDialog product={item} open={dialogOpen} onOpenChange={setDialogOpen} />}
      {dialogOpen && isMobile && <AddToCartDrawer product={item} open={dialogOpen} onOpenChange={setDialogOpen} />}
    </Card>
  );
};
