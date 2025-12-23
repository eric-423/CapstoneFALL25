"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DragDropProductManager } from '@/components/common/drag-drop-product-manager/DragDropProductManager';
import { Product, ProductType, getAllBranchProducts, getProductType, updatePairedProducts, getPairedProducts } from '@/apis/product.api';
import { toast } from 'react-toastify';
import { X, Save } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface ProductRelatedDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    productId: number;
    productName: string;
}

export function ProductRelatedDialog({
    open,
    onOpenChange,
    productId,
    productName
}: ProductRelatedDialogProps) {
    const [targetProducts, setTargetProducts] = useState<Product[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const queryClient = useQueryClient();

    const { data: allProductsResponse, isLoading: isLoadingAll } = useQuery({
        queryKey: ['all-products-for-related', productId],
        queryFn: () => getAllBranchProducts({ page: 0, size: 1000 }),
        enabled: open,
        staleTime: 5 * 60 * 1000,
    });

    const { data: productTypes = [] } = useQuery<ProductType[]>({
        queryKey: ['product-types-for-related'],
        queryFn: () => getProductType(),
        enabled: open,
        staleTime: 30 * 60 * 1000,
    });

    const { data: pairedProducts = [], isLoading: isLoadingPaired } = useQuery<Product[]>({
        queryKey: ['paired-products', productId],
        queryFn: () => getPairedProducts(productId),
        enabled: open && productId > 0,
        staleTime: 5 * 60 * 1000,
    });

    const prevPairedProductsRef = React.useRef<string>('');

    useEffect(() => {
        if (open && pairedProducts !== undefined) {
            const newIds = pairedProducts.map(p => p.productId).sort().join(',');
            if (prevPairedProductsRef.current !== newIds) {
                prevPairedProductsRef.current = newIds;
                setTargetProducts(pairedProducts.length > 0 ? pairedProducts : []);
            }
        }
    }, [open, pairedProducts]);

    const [selectedProductType, setSelectedProductType] = useState<number>(0);

    const allProducts = useMemo<Product[]>(() => {
        return (allProductsResponse?.content || allProductsResponse || []) as Product[];
    }, [allProductsResponse]);

    const filteredSourceProducts = useMemo(() => {
        return allProducts.filter((p: Product) => {
            const matchesType = selectedProductType === 0 || p.productTypeId === selectedProductType;
            const isNotCurrent = p.productId !== productId;
            const isNotInTarget = !targetProducts.some(tp => tp.productId === p.productId);
            return matchesType && isNotCurrent && isNotInTarget;
        });
    }, [allProducts, selectedProductType, productId, targetProducts]);


    const handleSave = async () => {
        try {
            setIsSaving(true);
            const productIds = targetProducts.map(p => p.productId);
            await updatePairedProducts(productId, productIds);

            await queryClient.invalidateQueries({ queryKey: ['paired-products', productId] });

            toast.success('Đã lưu món ăn liên quan thành công');
            onOpenChange(false);
        } catch (error) {
            console.error('Failed to save paired products:', error);
            toast.error('Không thể lưu món ăn liên quan');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        if (pairedProducts && pairedProducts.length > 0) {
            setTargetProducts(pairedProducts);
        } else {
            setTargetProducts([]);
        }
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[90vw] w-full h-[90vh] flex flex-col p-0">
                <DialogTitle className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900">
                            Món ăn liên quan: {productName}
                        </h2>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCancel}
                            className="h-8 w-8 p-0"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </DialogTitle>

                <div className="flex-1 overflow-hidden p-6">
                    {(isLoadingAll || isLoadingPaired) ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-gray-600">Đang tải...</div>
                        </div>
                    ) : (
                        <DragDropProductManager
                            sourceProducts={filteredSourceProducts}
                            productTypes={productTypes.filter(t => t.id !== 0)}
                            selectedProductType={selectedProductType}
                            onSelectProductType={setSelectedProductType}
                            isLoadingSource={isLoadingAll}
                            targetProducts={targetProducts}
                            targetTitle={`Món ăn liên quan (${targetProducts.length})`}
                            onTargetChange={setTargetProducts}
                        />
                    )}
                </div>

                <DialogFooter className="p-6 border-t border-gray-200">
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isSaving}
                    >
                        <X className="h-4 w-4 mr-2" />
                        Hủy
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-[#78A243] hover:bg-[#78A243]/90"
                    >
                        <Save className="h-4 w-4 mr-2" />
                        {isSaving ? 'Đang lưu...' : 'Lưu'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

