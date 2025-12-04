'use client';

import React, { useState, useEffect } from 'react';
import {
    DndContext,
    DragOverlay,
    pointerWithin,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
    defaultDropAnimationSideEffects,
    DropAnimation
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { toast } from 'react-toastify';
import { AdminPageLayout, AdminPageHeader } from '@/app/admin/components/AdminPageLayout';
import { FilterDropdown } from '@/components/common/FilterDropdown';
import { Store, Search } from 'lucide-react';
import { getAllBranchProducts, getProduct, getProductType, addProductToBranch, removeProductFromBranch, type Product, type ProductType } from '@/apis/product.api';
import { getBranches, type Branch } from '@/apis/branch.api';

import { GlobalProductSource } from '@/app/admin/branches/menu-manager/components/GlobalProductSource';
import { BranchTabContent } from '@/app/admin/branches/menu-manager/components/BranchTabContent';
import { ProductDragOverlay } from '@/app/admin/branches/menu-manager/components/ProductDragOverlay';

export default function BranchMenuManagerPage() {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [globalProducts, setGlobalProducts] = useState<Product[]>([]);
    const [productTypes, setProductTypes] = useState<ProductType[]>([]);
    const [selectedProductType, setSelectedProductType] = useState<number>(0);
    const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);
    const [branchProducts, setBranchProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [activeDragItem, setActiveDragItem] = useState<Product | null>(null);

    // Sensors for Drag and Drop
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Fetch initial data
    useEffect(() => {
        const initData = async () => {
            try {
                setLoading(true);
                const [branchesData, productsResponse, typesData] = await Promise.all([
                    getBranches(),
                    getAllBranchProducts({ page: 0, size: 1000 }),
                    getProductType()
                ]);
                setBranches(branchesData);
                const products = productsResponse.content || productsResponse;
                setGlobalProducts(products);
                setProductTypes(typesData);
            } catch (error) {
                console.error('Failed to load initial data:', error);
                toast.error('Failed to load data');
            } finally {
                setLoading(false);
            }
        };
        initData();
    }, []);

    // Fetch branch menu when a branch is selected
    useEffect(() => {
        if (selectedBranchId) {
            fetchBranchMenu(selectedBranchId);
        } else {
            setBranchProducts([]);
        }
    }, [selectedBranchId]);

    const fetchBranchMenu = async (branchId: number) => {
        try {
            const response = await getProduct(
                branchId,
                '', // keyword
                true, // isActive
                0, // minPrice
                999999999, // maxPrice
                0, // page
                1000, // size - fetch all
                'name', // sortBy
                'ASC', // sortDirection
                undefined // productTypeId
            );
            setBranchProducts(response.data.content);
        } catch (error) {
            console.error(`Failed to load menu for branch ${branchId}:`, error);
            toast.error('Failed to load branch menu');
        }
    };

    // Filter global products: remove products already in the selected branch
    const filteredGlobalProducts = globalProducts.filter(gp =>
        !branchProducts.some(bp => bp.productId === gp.productId)
    );

    // Fetch global products when filter changes (if needed, but we have all products)
    // We can keep the existing logic if we want to support server-side filtering for global products
    // But for now, let's assume we have all products and filter client-side against the branch menu
    useEffect(() => {
        const fetchFilteredProducts = async () => {
            try {
                setLoadingProducts(true);
                const productsResponse = await getAllBranchProducts({
                    page: 0,
                    size: 1000,
                    productTypeId: selectedProductType === 0 ? undefined : selectedProductType
                });
                const products = productsResponse.content || productsResponse;
                setGlobalProducts(products);
            } catch (error) {
                console.error('Failed to filter products:', error);
            } finally {
                setLoadingProducts(false);
            }
        };

        if (!loading) {
            fetchFilteredProducts();
        }
    }, [selectedProductType]);


    // Drag and Drop Handlers
    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const activeData = active.data.current as { product: Product, source: 'global' | 'branch' };
        if (activeData?.product) {
            setActiveDragItem(activeData.product);
        }
    };

    const handleDragOver = (event: DragOverEvent) => {
        // Logic to handle dragging over different containers
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveDragItem(null);

        if (!over || !selectedBranchId) return;

        const activeData = active.data.current as { product: Product, source: 'global' | 'branch', branchId?: number };
        const overData = over.data.current as { type: 'branch-container', branchId: number } | { type: 'global-container' };

        // Case 1: Drag from Global to Branch
        if (activeData.source === 'global' && overData && 'branchId' in overData && overData.branchId === selectedBranchId) {
            try {
                await addProductToBranch(selectedBranchId, [activeData.product.productId]);
                toast.success('Đã thêm món vào menu chi nhánh');
                fetchBranchMenu(selectedBranchId); // Refresh menu
            } catch (error) {
                console.error('Failed to add product:', error);
                toast.error('Không thể thêm món vào menu');
            }
        }

        // Case 2: Drag from Branch to Global (Remove)
        if (activeData.source === 'branch' && overData && 'type' in overData && overData.type === 'global-container') {
            try {
                await removeProductFromBranch(selectedBranchId, activeData.product.productId);
                toast.success('Đã xóa món khỏi menu chi nhánh');
                fetchBranchMenu(selectedBranchId); // Refresh menu
            } catch (error) {
                console.error('Failed to remove product:', error);
                toast.error('Không thể xóa món khỏi menu');
            }
        }
    };

    const handleRemoveProduct = async (productId: number) => {
        if (!selectedBranchId) return;
        try {
            await removeProductFromBranch(selectedBranchId, productId);
            toast.success('Đã xóa món khỏi menu chi nhánh');
            fetchBranchMenu(selectedBranchId);
        } catch (error) {
            console.error('Failed to remove product:', error);
            toast.error('Không thể xóa món khỏi menu');
        }
    };

    const handleAddAll = async () => {
        if (!selectedBranchId || filteredGlobalProducts.length === 0) return;

        const productIds = filteredGlobalProducts.map(p => p.productId);
        try {
            await addProductToBranch(selectedBranchId, productIds);
            toast.success(`Đã thêm ${productIds.length} món vào menu chi nhánh`);
            fetchBranchMenu(selectedBranchId);
        } catch (error) {
            console.error('Failed to add all products:', error);
            toast.error('Không thể thêm các món vào menu');
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
        <AdminPageLayout>
            <AdminPageHeader
                title="Quản lý Menu Chi nhánh"
                icon={Store}
            />

            <div className="mb-4 flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2">
                    <Store className="h-5 w-5 text-[#EC6426]" />
                    <span className="font-semibold text-gray-700">Chọn chi nhánh:</span>
                </div>
                <FilterDropdown
                    label="-- Chọn chi nhánh --"
                    title="Danh sách chi nhánh"
                    value={selectedBranchId?.toString() || ""}
                    onChange={(value) => setSelectedBranchId(Number(value) || null)}
                    items={branches.map(branch => ({
                        value: branch.id.toString(),
                        label: branch.name
                    }))}
                    className="w-[200px]"
                    showAllOption={false}
                />
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={pointerWithin}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="flex h-[calc(100vh-280px)] gap-6">
                    {/* Left Panel: Global Source */}
                    <div className="w-1/3 bg-white rounded-xl border-2 border-gray-200 flex flex-col overflow-hidden">
                        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                            <h3 className="font-bold text-gray-700 flex items-center gap-2">
                                <Search className="h-4 w-4" />
                                Danh sách món ăn
                            </h3>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4">
                            <GlobalProductSource
                                products={filteredGlobalProducts}
                                productTypes={productTypes}
                                selectedProductType={selectedProductType}
                                onSelectProductType={setSelectedProductType}
                                isLoading={loadingProducts}
                                onAddAll={selectedBranchId ? handleAddAll : undefined}
                            />
                        </div>
                    </div>

                    {/* Right Panel: Branch Workspace */}
                    <div className="flex-1 bg-white rounded-xl border-2 border-gray-200 flex flex-col overflow-hidden">
                        <div className="p-4 border-b border-gray-100 bg-gray-50">
                            <h3 className="font-bold text-gray-700">
                                Menu Chi nhánh: {branches.find(b => b.id === selectedBranchId)?.name || 'Chưa chọn'}
                            </h3>
                        </div>

                        <div className="flex-1 bg-white p-4 overflow-y-auto">
                            {selectedBranchId ? (
                                <BranchTabContent
                                    branchId={selectedBranchId}
                                    products={branchProducts}
                                    onRemove={handleRemoveProduct}
                                />
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                    <Store className="h-16 w-16 mb-4 opacity-20" />
                                    <p>Chọn một chi nhánh để bắt đầu quản lý menu</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <DragOverlay dropAnimation={dropAnimation}>
                    {activeDragItem ? <ProductDragOverlay product={activeDragItem} /> : null}
                </DragOverlay>
            </DndContext>
        </AdminPageLayout>
    );
}
