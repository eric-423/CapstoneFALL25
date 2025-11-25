import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Product } from '@/apis/product.api';
import { GripVertical } from 'lucide-react';

interface DraggableProductItemProps {
    product: Product;
}

export function DraggableProductItem({ product }: DraggableProductItemProps) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `global-${product.productId}`,
        data: {
            product,
            source: 'global'
        }
    });

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={`
                flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg mb-2 cursor-grab hover:border-orange-300 hover:shadow-sm transition-all
                ${isDragging ? 'opacity-50' : 'opacity-100'}
            `}
        >
            <GripVertical className="h-4 w-4 text-gray-400" />
            <div className="h-10 w-10 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                {product.productImage ? (
                    <img src={product.productImage} alt={product.productName} className="h-full w-full object-cover" />
                ) : (
                    <div className="h-full w-full flex items-center justify-center text-xs text-gray-400">Img</div>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 text-sm truncate">{product.productName}</p>
                <p className="text-xs text-gray-500">{product.productPrice.toLocaleString()}đ</p>
            </div>
        </div>
    );
}
