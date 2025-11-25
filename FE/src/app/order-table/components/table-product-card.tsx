'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, Plus } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import type { Product } from '@/apis/product.api';


interface TableProductCardProps {
    product: Product;
    onAddToCart: (product: Product) => void;
}

export default function TableProductCard({ product, onAddToCart }: TableProductCardProps) {
    const [isAdding, setIsAdding] = useState(false);
    const isOutOfStock = product.inStock === false;

    const handleAddToCart = async () => {
        if (isOutOfStock) return;
        setIsAdding(true);
        onAddToCart(product);
        setTimeout(() => setIsAdding(false), 500);
    };

    return (
        <Card className={`group hover:shadow-lg transition-all duration-200 border-0 shadow-sm py-0 ${isOutOfStock ? 'bg-gray-100' : 'bg-white'}`}>
            <CardContent className='p-0'>
                <div className='relative'>
                    <div className='relative h-36 sm:h-40 md:h-48 w-full overflow-hidden rounded-t-lg bg-gradient-to-br from-gray-50 to-gray-100'>
                        {product.productImage ? (
                            <>
                                <Image
                                    src={`${product.productImage}`}
                                    alt={product.productName}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className={`object-cover group-hover:scale-105 transition-transform duration-300 ${isOutOfStock ? 'grayscale opacity-50' : ''}`}
                                />
                                {isOutOfStock && (
                                    <div className='absolute inset-0 flex items-center justify-center bg-black/40'>
                                        <div className='bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-sm sm:text-base shadow-lg transform rotate-[-15deg]'>
                                            HẾT HÀNG
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className='flex items-center justify-center h-full text-gray-400'>
                                <ShoppingCart className='h-12 w-12' />
                            </div>
                        )}
                    </div>

                    <div className='p-3 sm:p-4 space-y-2 sm:space-y-3'>
                        <div>
                            <h3 className={`font-semibold text-base sm:text-lg line-clamp-2 transition-colors ${isOutOfStock ? 'text-gray-500' : 'text-gray-900 group-hover:text-primary'}`}>
                                {product.productName}
                            </h3>
                            <p className={`text-xs sm:text-sm line-clamp-2 mt-1 ${isOutOfStock ? 'text-gray-400' : 'text-gray-600'}`}>
                                {product.productDescription}
                            </p>
                        </div>

                        <div className='flex items-center justify-between'>
                            <div className='flex flex-col'>
                                <span className={`text-base sm:text-lg font-bold ${isOutOfStock ? 'text-gray-400' : 'text-primary'}`}>
                                    {product.productPrice.toLocaleString()}đ
                                </span>
                                {product.calories !== undefined && (
                                    <span className={`text-xs ${isOutOfStock ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {product.calories.toFixed(1)} kcal
                                    </span>
                                )}
                            </div>
                        </div>

                        <Button
                            onClick={handleAddToCart}
                            disabled={isAdding || isOutOfStock}
                            className={`w-full text-sm sm:text-base transition-all duration-200 ${isOutOfStock ? 'cursor-not-allowed' : 'group-hover:bg-primary group-hover:text-white'}`}
                            variant='outline'
                        >
                            {isOutOfStock ? (
                                <>
                                    Hết hàng
                                </>
                            ) : isAdding ? (
                                <>
                                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2'></div>
                                    Đang thêm...
                                </>
                            ) : (
                                <>
                                    <Plus className='h-4 w-4 mr-2' />
                                    Thêm món
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
