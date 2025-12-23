import React, { useState } from 'react';
import { Product, ProductType } from '@/apis/product.api';
import { DraggableProductItem } from './DraggableProductItem';
import { Input } from '@/components/ui/input';
import { Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { useDroppable } from '@dnd-kit/core';

interface GlobalProductSourceProps {
    products: Product[];
    productTypes?: ProductType[];
    selectedProductType?: number;
    onSelectProductType?: (id: number) => void;
    isLoading?: boolean;
    onAddAll?: () => void;
}

export function GlobalProductSource({
    products,
    productTypes = [],
    selectedProductType = 0,
    onSelectProductType,
    isLoading = false,
    onAddAll
}: GlobalProductSourceProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const { setNodeRef, isOver } = useDroppable({
        id: 'source-container',
        data: {
            type: 'source-container'
        }
    });

    const filteredProducts = products.filter(p =>
        p.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div 
            ref={setNodeRef}
            className={`flex flex-col h-full ${isOver ? 'bg-[#78A243]/5' : ''}`}
        >
            <div className="mb-4 space-y-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Tìm món ăn..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                    />
                </div>

                {/* Product Type Filter */}
                {productTypes && productTypes.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                        <Button
                            variant={selectedProductType === 0 ? "default" : "outline"}
                            size="sm"
                            className={`whitespace-nowrap h-8 text-xs ${selectedProductType === 0 ? 'bg-[#EC6426] hover:bg-[#EC6426]/90' : ''}`}
                            onClick={() => onSelectProductType?.(0)}
                        >
                            Tất cả
                        </Button>
                        {productTypes.map(type => (
                            <Button
                                key={type.id}
                                variant={selectedProductType === type.id ? "default" : "outline"}
                                size="sm"
                                className={`whitespace-nowrap h-8 text-xs ${selectedProductType === type.id ? 'bg-[#EC6426] hover:bg-[#EC6426]/90' : ''}`}
                                onClick={() => onSelectProductType?.(type.id)}
                            >
                                {type.name}
                            </Button>
                        ))}
                    </div>
                )}

                {/* Add All Button */}
                {onAddAll && filteredProducts.length > 0 && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onAddAll}
                        className="w-full h-8 text-xs border-[#EC6426] text-[#EC6426] hover:bg-[#EC6426]/10"
                    >
                        <Plus className="h-3 w-3 mr-1" />
                        Thêm tất cả ({filteredProducts.length})
                    </Button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto pr-2">
                {isLoading ? (
                    <div className="flex items-center justify-center h-40">
                        <LoadingSpinner className="h-8 w-8 text-[#EC6426]" />
                    </div>
                ) : (
                    <>
                        {filteredProducts.map(product => (
                            <DraggableProductItem key={product.productId} product={product} source="source" />
                        ))}
                        {filteredProducts.length === 0 && (
                            <p className="text-center text-gray-500 text-sm mt-4">Không tìm thấy món ăn</p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
