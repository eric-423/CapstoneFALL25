import React from 'react';
import Image from 'next/image';
import { Product } from '@/apis/product.api';
import { GripVertical } from 'lucide-react';

interface ProductDragOverlayProps {
    product: Product;
}

export function ProductDragOverlay({ product }: ProductDragOverlayProps) {
    return (
        <div className="flex items-center gap-3 p-3 bg-white border-2 border-[#78A243] shadow-xl rounded-lg w-[300px] cursor-grabbing opacity-90">
            <GripVertical className="h-4 w-4 text-[#78A243]" />
            <div className="h-10 w-10 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                {product.productImage ? (
                    <Image src={product.productImage} alt={product.productName} width={40} height={40} className="h-full w-full object-cover" />
                ) : (
                    <div className="h-full w-full flex items-center justify-center text-xs text-gray-400">Img</div>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-sm truncate">{product.productName}</p>
                <p className="text-xs text-[#78A243] font-medium">{product.productPrice.toLocaleString()}đ</p>
            </div>
        </div>
    );
}
