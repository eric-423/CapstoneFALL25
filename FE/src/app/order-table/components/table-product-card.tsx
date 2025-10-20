'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Plus } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import type { Product } from '@/types/product.type';

interface TableProductCardProps {
    product: Product;
    onAddToCart: (product: Product) => void;
}

export default function TableProductCard({ product, onAddToCart }: TableProductCardProps) {
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = async () => {
        setIsAdding(true);
        onAddToCart(product);
        setTimeout(() => setIsAdding(false), 500);
    };

    return (
        <Card className='group hover:shadow-lg transition-all duration-200 border-0 shadow-sm bg-white'>
            <CardContent className='p-0'>
                <div className='relative'>
                    <div className='relative h-36 sm:h-40 md:h-48 w-full overflow-hidden rounded-t-lg bg-gradient-to-br from-gray-50 to-gray-100'>
                        {product.productImage ? (
                            <Image
                                src={product.productImage}
                                alt={product.productName}
                                fill
                                className='object-cover group-hover:scale-105 transition-transform duration-300'
                            />
                        ) : (
                            <div className='flex items-center justify-center h-full text-gray-400'>
                                <ShoppingCart className='h-12 w-12' />
                            </div>
                        )}

                        {product.isPromotion && (
                            <Badge className='absolute top-2 right-2 bg-red-500 text-white'>
                                Khuyến mãi
                            </Badge>
                        )}
                    </div>

                    <div className='p-3 sm:p-4 space-y-2 sm:space-y-3'>
                        <div>
                            <h3 className='font-semibold text-base sm:text-lg text-gray-900 line-clamp-2 group-hover:text-primary transition-colors'>
                                {product.productName}
                            </h3>
                            <p className='text-xs sm:text-sm text-gray-600 line-clamp-2 mt-1'>
                                {product.description}
                            </p>
                        </div>

                        <div className='flex items-center justify-between'>
                            <div className='flex flex-col'>
                                <span className='text-base sm:text-lg font-bold text-primary'>
                                    {(product.price || 0).toLocaleString()}đ
                                </span>
                                {product.originalPrice && product.originalPrice > (product.price || 0) && (
                                    <span className='text-xs sm:text-sm text-gray-500 line-through'>
                                        {(product.originalPrice || 0).toLocaleString()}đ
                                    </span>
                                )}
                            </div>
                        </div>

                        <Button
                            onClick={handleAddToCart}
                            disabled={isAdding}
                            className='w-full text-sm sm:text-base group-hover:bg-primary group-hover:text-white transition-all duration-200'
                            variant='outline'
                        >
                            {isAdding ? (
                                <>
                                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2'></div>
                                    Đang thêm...
                                </>
                            ) : (
                                <>
                                    <Plus className='h-4 w-4 mr-2' />
                                    Thêm vào giỏ
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
