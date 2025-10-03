'use client';

import { AddToCartDialog, AddToCartDrawer } from '@/components/common/add-to-cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import type { Product } from '@/types/product.type';

import { ShoppingBag, Star } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface FeaturedProductProps {
    product: Product;
}

const FeaturedProduct = ({ product }: FeaturedProductProps) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const isMobile = useIsMobile();

    return (
        <div className='mb-10 relative w-full'>
            <div className='absolute top-0 right-0 z-20 w-[200px] h-[200px] pointer-events-none overflow-hidden'>
                <div className='absolute top-6 right-[-45px] rotate-35'>
                    <div className='bg-gradient-to-br from-secondary to-primary text-white text-[18px] font-extrabold px-12 py-1 shadow-md tracking-wide rounded-sm'>
                        SIGNATURE
                    </div>
                </div>
            </div>
            <Card className='relative rounded-2xl overflow-hidden shadow-lg bg-gray-50 border-0'>
                <div className='grid grid-cols-1 lg:grid-cols-2 min-h-[200px] lg:min-h-[250px]'>
                    {/* Image Section */}
                    <div className='relative h-64 sm:h-80 lg:h-full bg-gradient-to-br from-gray-100 to-gray-200'>
                        <div className={`absolute inset-0 flex items-center justify-center ${isMobile ? 'overflow-hidden' : ''}`}>
                            {product?.productImage && (
                                <Image
                                    src={product.productImage}
                                    alt={product.productName}
                                    fill
                                    className='object-contain drop-shadow-lg'
                                />
                            )}
                        </div>
                    </div>

                    {/* Content Section */}
                    <CardContent className='bg-white p-6 sm:p-8 flex flex-col justify-center'>
                        <div className='space-y-2'>
                            <div>
                                <h2 className='text-xl md:text-3xl font-bold mb-3 text-foreground leading-tight'>
                                    {product?.productName}
                                </h2>

                                {/* Rating and Time */}
                                <div className='flex flex-col sm:flex-row sm:items-center gap-3 mb-4'>
                                    <div className='flex items-center text-yellow-500'>
                                        <Star className='h-4 w-4 fill-yellow-500 mr-1' />
                                        <span className='font-medium text-foreground'>5.0</span>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <p className='text-foreground leading-relaxed text-sm sm:text-base'>
                                Món cơm tấm đặc biệt với sườn nướng mềm, topping tự chọn và đồ chua. Phục vụ kèm canh và nước ngọt.
                            </p>

                            {/* Price and Favorite */}
                            <div className='flex items-center justify-between py-2'>
                                <div className='flex flex-col'>
                                    <span className='text-3xl sm:text-4xl font-bold text-primary'>
                                        {product?.productPrice.toLocaleString()}đ
                                    </span>
                                </div>
                                {/* <Button
                  variant='outline'
                  size='icon'
                  className='rounded-full border-gray-200 hover:border-red-300 hover:bg-red-50 transition-colors bg-transparent'
                >
                  <Heart className='h-5 w-5 text-gray-500 hover:text-red-500 transition-colors' />
                </Button> */}
                            </div>

                            {/* Add to Cart Button */}
                            <Button
                                className='w-full bg-primary hover:bg-[#C04A00] text-white py-3 text-base font-medium transition-all duration-200 hover:shadow-lg'
                                onClick={() => setDialogOpen(true)}
                            >
                                <ShoppingBag className='h-5 w-5 mr-2' />
                                Thêm vào giỏ hàng
                            </Button>
                        </div>
                    </CardContent>
                </div>
            </Card>

            {dialogOpen && !isMobile && <AddToCartDialog product={product} open={dialogOpen} onOpenChange={setDialogOpen} />}
            {dialogOpen && isMobile && <AddToCartDrawer product={product} open={dialogOpen} onOpenChange={setDialogOpen} />}
        </div>
    );
};

export default FeaturedProduct;