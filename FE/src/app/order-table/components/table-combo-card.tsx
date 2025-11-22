'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Users } from 'lucide-react';
import { useState } from 'react';
import type { Combo } from '@/apis/combo.api';

interface TableComboCardProps {
    combo: Combo;
    onAddToCart: (combo: Combo) => void;
}

export default function TableComboCard({ combo, onAddToCart }: TableComboCardProps) {
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = async () => {
        setIsAdding(true);
        onAddToCart(combo);
        setTimeout(() => setIsAdding(false), 500);
    };

    return (
        <Card className='group hover:shadow-lg transition-all duration-200 border-2 border-orange-200 shadow-sm bg-gradient-to-br from-orange-50 to-white'>
            <CardContent className='p-0'>
                <div className='relative'>
                    <div className='relative h-36 sm:h-40 md:h-48 w-full overflow-hidden rounded-t-lg bg-gradient-to-br from-orange-100 to-orange-50'>
                        <div className='flex items-center justify-center h-full'>
                            <Users className='h-20 w-20 text-orange-400' />
                        </div>

                        {/* Combo Badge */}
                        <div className='absolute top-2 right-2'>
                            <Badge className='bg-orange-500 hover:bg-orange-600 text-white font-semibold'>
                                COMBO
                            </Badge>
                        </div>
                    </div>

                    <div className='p-3 sm:p-4 space-y-2 sm:space-y-3'>
                        <div className='min-h-[60px] sm:min-h-[70px]'>
                            <h3 className='font-semibold text-base sm:text-lg text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors'>
                                {combo.name}
                            </h3>
                            <p className='text-xs sm:text-sm text-gray-600 line-clamp-2 mt-1'>
                                {combo.description}
                            </p>
                        </div>

                        <div className='space-y-1'>
                            <div className='text-base sm:text-lg font-bold text-orange-600'>
                                {combo.price.toLocaleString()}đ
                            </div>
                            <div className='text-xs text-gray-500'>
                                Chi nhánh: Chi nhánh chính
                            </div>
                        </div>

                        <Button
                            onClick={handleAddToCart}
                            disabled={isAdding}
                            className='w-full text-sm sm:text-base bg-orange-500 hover:bg-orange-600 text-white transition-all duration-200 h-10'
                        >
                            {isAdding ? (
                                <>
                                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                                    Đang thêm...
                                </>
                            ) : (
                                <>
                                    <Plus className='h-4 w-4 mr-2' />
                                    Thêm combo
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
