import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Product } from '@/apis/product.api';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BranchTabContentProps {
    branchId: number;
    products: Product[];
    onRemove: (productId: number) => void;
}

export function BranchTabContent({ branchId, products, onRemove }: BranchTabContentProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: `branch-${branchId}`,
        data: {
            type: 'branch-container',
            branchId
        }
    });

    return (
        <div
            ref={setNodeRef}
            className={`
                min-h-full rounded-xl border-2 border-dashed transition-colors p-4
                ${isOver ? 'border-orange-400 bg-orange-50' : 'border-gray-200 bg-gray-50/50'}
            `}
        >
            {products.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <p>Kéo món ăn vào đây để thêm vào menu</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {products.map(product => (
                        <div
                            key={product.productId}
                            className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex flex-col group relative"
                        >
                            <div className="aspect-video bg-gray-100 rounded-md mb-2 overflow-hidden">
                                {product.productImage ? (
                                    <img src={product.productImage} alt={product.productName} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-xs text-gray-400">Img</div>
                                )}
                            </div>
                            <h4 className="font-semibold text-gray-800 text-sm line-clamp-1" title={product.productName}>
                                {product.productName}
                            </h4>
                            <p className="text-xs text-gray-500 mb-2">{product.productPrice.toLocaleString()}đ</p>

                            <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => onRemove(product.productId)}
                                className="w-full mt-auto opacity-0 group-hover:opacity-100 transition-opacity h-8 text-xs"
                            >
                                <Trash2 className="h-3 w-3 mr-1" />
                                Xóa
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
