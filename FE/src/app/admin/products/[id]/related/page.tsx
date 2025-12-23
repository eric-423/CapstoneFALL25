"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { DragDropProductManager } from '@/components/common/drag-drop-product-manager/DragDropProductManager';
import { Product, ProductType, getAllBranchProducts, getProductType, updatePairedProducts, getPairedProducts, getProductById } from '@/apis/product.api';
import { toast } from 'react-toastify';
import { ArrowLeft, Save } from 'lucide-react';
import { AdminGuard } from '@/components/guards';
import { AdminPageLayout, AdminPageHeader } from '@/app/admin/components/AdminPageLayout';
import { UtensilsCrossed } from 'lucide-react';

export default function ProductRelatedPage() {
    const router = useRouter();
    const params = useParams();
    const productId = params?.id ? parseInt(params.id as string, 10) : 0;

    const [targetProducts, setTargetProducts] = useState<Product[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedProductType, setSelectedProductType] = useState<number>(0);

    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [productTypes, setProductTypes] = useState<ProductType[]>([]);
    const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

    const [isLoadingAll, setIsLoadingAll] = useState(false);
    const [isLoadingPaired, setIsLoadingPaired] = useState(false);
    const [isLoadingProduct, setIsLoadingProduct] = useState(false);

    useEffect(() => {
        if (productId > 0) {
            const fetchAllProducts = async () => {
                try {
                    setIsLoadingAll(true);
                    const response = await getAllBranchProducts({ page: 0, size: 1000 });
                    const products = response?.content || response || [];
                    setAllProducts(products);
                } catch (error) {
                    console.error('Failed to fetch all products:', error);
                    toast.error('Không thể tải danh sách sản phẩm');
                } finally {
                    setIsLoadingAll(false);
                }
            };
            fetchAllProducts();
        }
    }, [productId]);

    useEffect(() => {
        const fetchProductTypes = async () => {
            try {
                const types = await getProductType();
                setProductTypes(types || []);
            } catch (error) {
                console.error('Failed to fetch product types:', error);
            }
        };
        fetchProductTypes();
    }, []);

    useEffect(() => {
        if (productId > 0) {
            const fetchPairedProducts = async () => {
                try {
                    setIsLoadingPaired(true);
                    const paired = await getPairedProducts(productId);
                    if (paired && paired.length > 0) {
                        setTargetProducts(paired);
                    } else {
                        setTargetProducts([]);
                    }
                } catch (error) {
                    console.error('Failed to fetch paired products:', error);
                    setTargetProducts([]);
                } finally {
                    setIsLoadingPaired(false);
                }
            };
            fetchPairedProducts();
        }
    }, [productId]);

    useEffect(() => {
        if (productId > 0) {
            const fetchCurrentProduct = async () => {
                try {
                    setIsLoadingProduct(true);
                    const product = await getProductById(productId);
                    setCurrentProduct(product);
                } catch (error) {
                    console.error('Failed to fetch current product:', error);
                } finally {
                    setIsLoadingProduct(false);
                }
            };
            fetchCurrentProduct();
        }
    }, [productId]);

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

            toast.success('Đã lưu món ăn liên quan thành công');
            router.push('/admin/products');
        } catch (error) {
            console.error('Failed to save paired products:', error);
            toast.error('Không thể lưu món ăn liên quan');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        router.push('/admin/products');
    };

    if (!productId || productId === 0) {
        return (
            <AdminGuard>
                <AdminPageLayout>
                    <AdminPageHeader
                        title="Món ăn liên quan"
                        icon={UtensilsCrossed}
                    />
                    <div className="p-6 text-center text-gray-500">
                        Không tìm thấy sản phẩm
                    </div>
                </AdminPageLayout>
            </AdminGuard>
        );
    }

    return (
        <AdminGuard>
            <AdminPageLayout>
                <AdminPageHeader
                    title={`Món ăn liên quan: ${currentProduct?.productName || `Sản phẩm #${productId}`}`}
                    icon={UtensilsCrossed}
                    actions={
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={handleCancel}
                                disabled={isSaving}
                                className="border-gray-300"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Quay lại
                            </Button>
                            <Button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="bg-[#78A243] hover:bg-[#78A243]/90"
                            >
                                <Save className="h-4 w-4 mr-2" />
                                {isSaving ? 'Đang lưu...' : 'Lưu'}
                            </Button>
                        </div>
                    }
                />

                <div className="p-6">
                    {(isLoadingAll || isLoadingPaired || isLoadingProduct) ? (
                        <div className="flex items-center justify-center h-[600px]">
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
            </AdminPageLayout>
        </AdminGuard>
    );
}

