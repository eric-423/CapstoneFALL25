"use client";

import React, { useState, useEffect, useMemo } from 'react';
import {
    DndContext,
    DragOverlay,
    pointerWithin,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragEndEvent,
    defaultDropAnimationSideEffects,
    DropAnimation,
    useDroppable,
    useDraggable
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Product, ProductType } from '@/apis/product.api';
import { GlobalProductSource } from '@/app/admin/branches/menu-manager/components/GlobalProductSource';
import { ProductDragOverlay } from '@/app/admin/branches/menu-manager/components/ProductDragOverlay';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface DragDropProductManagerProps {
    sourceProducts: Product[];
    productTypes?: ProductType[];
    selectedProductType?: number;
    onSelectProductType?: (id: number) => void;
    isLoadingSource?: boolean;

    targetProducts: Product[];
    targetTitle: string;
    onTargetChange: (products: Product[]) => void;

    onAddToTarget?: (productId: number) => Promise<void>;
    onRemoveFromTarget?: (productId: number) => Promise<void>;
    onAddAll?: () => void;

    filterSourceProducts?: (source: Product[], target: Product[]) => Product[];
}

export function DragDropProductManager({
    sourceProducts,
    productTypes = [],
    selectedProductType = 0,
    onSelectProductType,
    isLoadingSource = false,
    targetProducts,
    targetTitle,
    onTargetChange,
    onAddToTarget,
    onRemoveFromTarget,
    onAddAll,
    filterSourceProducts
}: DragDropProductManagerProps) {
    const [activeDragItem, setActiveDragItem] = useState<Product | null>(null);
    const [localTargetProducts, setLocalTargetProducts] = useState<Product[]>(targetProducts);
    const isInternalUpdateRef = React.useRef(false);
    const prevTargetProductsRef = React.useRef<Product[]>(targetProducts);

    useEffect(() => {
        if (!isInternalUpdateRef.current) {
            const prevIds = prevTargetProductsRef.current.map(p => p.productId).sort().join(',');
            const propIds = targetProducts.map(p => p.productId).sort().join(',');
            if (prevIds !== propIds) {
                setLocalTargetProducts(targetProducts);
            }
        }
        isInternalUpdateRef.current = false;
        prevTargetProductsRef.current = targetProducts;
    }, [targetProducts]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const filteredSourceProducts = filterSourceProducts
        ? filterSourceProducts(sourceProducts, localTargetProducts)
        : sourceProducts.filter(sp =>
            !localTargetProducts.some(tp => tp.productId === sp.productId)
        );

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const activeData = active.data.current as { product: Product, source: 'source' | 'target' };
        if (activeData?.product) {
            setActiveDragItem(activeData.product);
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveDragItem(null);

        if (!over) return;

        const activeData = active.data.current as { product: Product, source: 'source' | 'target' };
        const overData = over.data.current as { type: 'target-container' } | { type: 'source-container' };

        if (activeData.source === 'source' && overData && 'type' in overData && overData.type === 'target-container') {
            if (localTargetProducts.some(p => p.productId === activeData.product.productId)) {
                return;
            }

            const newTargetProducts = [...localTargetProducts, activeData.product];
            setLocalTargetProducts(newTargetProducts);
            isInternalUpdateRef.current = true;
            onTargetChange(newTargetProducts);

            if (onAddToTarget) {
                try {
                    await onAddToTarget(activeData.product.productId);
                } catch (error) {
                    console.error('Failed to add product:', error);
                    setLocalTargetProducts(localTargetProducts);
                    isInternalUpdateRef.current = true;
                    onTargetChange(localTargetProducts);
                }
            }
        }

        if (activeData.source === 'target' && overData && 'type' in overData && overData.type === 'source-container') {
            const newTargetProducts = localTargetProducts.filter(
                p => p.productId !== activeData.product.productId
            );
            setLocalTargetProducts(newTargetProducts);
            isInternalUpdateRef.current = true;
            onTargetChange(newTargetProducts);

            if (onRemoveFromTarget) {
                try {
                    await onRemoveFromTarget(activeData.product.productId);
                } catch (error) {
                    console.error('Failed to remove product:', error);
                    setLocalTargetProducts(localTargetProducts);
                    isInternalUpdateRef.current = true;
                    onTargetChange(localTargetProducts);
                }
            }
        }
    };

    const handleRemoveProduct = async (productId: number) => {
        const newTargetProducts = localTargetProducts.filter(p => p.productId !== productId);
        setLocalTargetProducts(newTargetProducts);
        isInternalUpdateRef.current = true;
        onTargetChange(newTargetProducts);

        if (onRemoveFromTarget) {
            try {
                await onRemoveFromTarget(productId);
            } catch (error) {
                console.error('Failed to remove product:', error);
                setLocalTargetProducts(localTargetProducts);
                isInternalUpdateRef.current = true;
                onTargetChange(localTargetProducts);
            }
        }
    };

    const dropAnimation: DropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: {
                active: {
                    opacity: '0.5',
                },
            },
        }),
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={pointerWithin}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="flex h-[600px] gap-6">
                <div className="w-1/3 bg-white rounded-xl border-2 border-gray-200 flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                        <h3 className="font-bold text-gray-700 flex items-center gap-2">
                            Danh sách món ăn
                        </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                        <GlobalProductSource
                            products={filteredSourceProducts}
                            productTypes={productTypes}
                            selectedProductType={selectedProductType}
                            onSelectProductType={onSelectProductType}
                            isLoading={isLoadingSource}
                            onAddAll={onAddAll}
                        />
                    </div>
                </div>

                {/* Right Panel: Target */}
                <div className="flex-1 bg-white rounded-xl border-2 border-gray-200 flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50">
                        <h3 className="font-bold text-gray-700">{targetTitle}</h3>
                    </div>
                    <div className="flex-1 bg-white p-4 overflow-y-auto">
                        <TargetContainer
                            products={localTargetProducts}
                            onRemove={handleRemoveProduct}
                        />
                    </div>
                </div>
            </div>

            <DragOverlay dropAnimation={dropAnimation}>
                {activeDragItem ? <ProductDragOverlay product={activeDragItem} /> : null}
            </DragOverlay>
        </DndContext>
    );
}

// Target Container Component
interface TargetContainerProps {
    products: Product[];
    onRemove: (productId: number) => void;
}

function TargetContainer({ products, onRemove }: TargetContainerProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: 'target-container',
        data: {
            type: 'target-container'
        }
    });

    const [imageFallbacks, setImageFallbacks] = React.useState<Record<number, boolean>>({});

    return (
        <div
            ref={setNodeRef}
            className={`
                min-h-full rounded-xl border-2 border-dashed transition-colors p-4
                ${isOver ? 'border-[#78A243] bg-[#78A243]/10' : 'border-gray-200 bg-gray-50/50'}
            `}
        >
            {products.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <p>Kéo món ăn vào đây để thêm</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {products.map((product) => {
                        const imageSrc = imageFallbacks[product.productId]
                            ? '/images/default-product-image.png'
                            : product.productImage;

                        return (
                            <DraggableProductCard
                                key={product.productId}
                                product={product}
                                imageSrc={imageSrc}
                                onImageError={() =>
                                    setImageFallbacks((prev) => ({
                                        ...prev,
                                        [product.productId]: true,
                                    }))
                                }
                                onRemove={onRemove}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}

// Draggable Product Card for Target
interface DraggableProductCardProps {
    product: Product;
    imageSrc: string;
    onImageError: () => void;
    onRemove: (productId: number) => void;
}

function DraggableProductCard({ product, imageSrc, onImageError, onRemove }: DraggableProductCardProps) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `target-${product.productId}`,
        data: {
            product,
            source: 'target'
        }
    });

    const dragListeners = useMemo(() => {
        if (!listeners) return undefined;

        const originalPointerDown = listeners.onPointerDown;

        return {
            ...listeners,
            onPointerDown: (e: React.PointerEvent) => {
                const target = e.target as HTMLElement;
                if (target.closest('button')) {
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                }
                originalPointerDown?.(e);
            }
        };
    }, [listeners]);

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onRemove(product.productId);
    };

    return (
        <div
            ref={setNodeRef}
            {...(dragListeners || {})}
            {...attributes}
            className={`
                bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex flex-col group relative cursor-grab
                ${isDragging ? 'opacity-50' : 'opacity-100'}
            `}
        >
            <div className="aspect-video bg-gray-100 rounded-md mb-2 overflow-hidden relative">
                {product.productImage ? (
                    <Image
                        src={imageSrc}
                        alt={product.productName}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover"
                        onError={onImageError}
                    />
                ) : (
                    <div className="h-full w-full flex items-center justify-center text-xs text-gray-400">
                        Img
                    </div>
                )}
            </div>
            <h4 className="font-semibold text-gray-800 text-sm line-clamp-1" title={product.productName}>
                {product.productName}
            </h4>
            <p className="text-xs text-gray-500 mb-2">{product.productPrice.toLocaleString()}đ</p>

            <Button
                size="sm"
                variant="destructive"
                onClick={handleDeleteClick}
                onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
                onPointerDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
                className="w-full mt-auto opacity-0 group-hover:opacity-100 transition-opacity h-8 text-xs pointer-events-auto"
            >
                <Trash2 className="h-3 w-3 mr-1" />
                Xóa
            </Button>
        </div>
    );
}
