'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { toast } from 'react-toastify';
import { AdminPageLayout, AdminPageHeader } from '@/app/admin/components/AdminPageLayout';
import { Button } from '@/components/ui/button';
import { Save, Plus, X, Store, Search, GripVertical } from 'lucide-react';
import { getProducts, getProductsByBranch, getAllBranchProducts, getProduct, getProductType, type Product, type ProductType } from '@/apis/product.api';
import { getBranches, type Branch } from '@/apis/branch.api';

// Placeholder components - will be implemented in separate files
import { GlobalProductSource } from '@/app/admin/branches/menu-manager/components/GlobalProductSource';
import { BranchTabContent } from '@/app/admin/branches/menu-manager/components/BranchTabContent';
import { ProductDragOverlay } from '@/app/admin/branches/menu-manager/components/ProductDragOverlay';

export default function BranchMenuManagerPage() {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [globalProducts, setGlobalProducts] = useState<Product[]>([]);
    const [productTypes, setProductTypes] = useState<ProductType[]>([]);
    const [selectedProductType, setSelectedProductType] = useState<number>(0);
    const [activeBranchTabs, setActiveBranchTabs] = useState<number[]>([]);
    const [activeTabId, setActiveTabId] = useState<number | null>(null);
    const [branchMenus, setBranchMenus] = useState<Record<number, Product[]>>({});
    const [loading, setLoading] = useState(true);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [activeDragItem, setActiveDragItem] = useState<Product | null>(null);
    const [isDirty, setIsDirty] = useState(false);

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
                // Handle potential response structure differences
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

    // Fetch global products when filter changes
    useEffect(() => {
        const fetchFilteredProducts = async () => {
            try {
                setLoadingProducts(true);
                // If 0 (All), we might want to fetch all or just filter client side?
                // The user request implies fetching like order-table page.
                // order-table page fetches when type changes.
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

        // Skip initial fetch as it's handled by initData, but initData doesn't depend on state.
        // Actually, let's just let this run. But initData runs once. 
        // To avoid double fetch on mount, we can check if it's not the initial load.
        // However, simplest is to just let it run or rely on this effect for products and initData for branches/types.
        // Let's keep initData for initial load to ensure everything is ready, and this for updates.
        if (!loading) {
            fetchFilteredProducts();
        }
    }, [selectedProductType]);

    // Fetch branch menu when a tab is opened
    const handleOpenBranchTab = async (branchId: number) => {
        if (activeBranchTabs.includes(branchId)) {
            setActiveTabId(branchId);
            return;
        }

        try {
            if (!branchMenus[branchId]) {
                const response = await getProduct(
                    branchId,
                    '', // keyword
                    true, // isActive
                    0, // minPrice
                    999999999, // maxPrice
                    0, // page
                    100, // size
                    'name', // sortBy
                    'ASC', // sortDirection
                    undefined // productTypeId
                );
                setBranchMenus(prev => ({
                    ...prev,
                    [branchId]: response.data.content
                }));
            }

            setActiveBranchTabs(prev => [...prev, branchId]);
            setActiveTabId(branchId);
        } catch (error) {
            console.error(`Failed to load menu for branch ${branchId}:`, error);
            toast.error('Failed to load branch menu');
        }
    };

    const handleCloseTab = (e: React.MouseEvent, branchId: number) => {
        e.stopPropagation();
        setActiveBranchTabs(prev => prev.filter(id => id !== branchId));
        if (activeTabId === branchId) {
            setActiveTabId(null);
        }
    };

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
        // This is mainly for visual feedback and sorting within lists
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveDragItem(null);

        if (!over) return;

        const activeData = active.data.current as { product: Product, source: 'global' | 'branch', branchId?: number };
        const overData = over.data.current as { type: 'branch-container', branchId: number } | { type: 'item', product: Product, branchId: number };

        // Case 1: Drag from Global to Branch Tab
        if (activeData.source === 'global' && overData) {
            const targetBranchId = overData.branchId;

            // Check if product already exists in target branch
            const currentMenu = branchMenus[targetBranchId] || [];
            if (currentMenu.find(p => p.productId === activeData.product.productId)) {
                toast.warning('Product already exists in this branch');
                return;
            }

            setBranchMenus(prev => ({
                ...prev,
                [targetBranchId]: [...currentMenu, activeData.product]
            }));
            setIsDirty(true);
            toast.success('Added to branch menu');
        }

        // Case 2: Reordering within Branch (Sortable) - To be implemented if needed

        // Case 3: Drag from Branch to "Remove Area" or outside - To be implemented
    };

    const handleSave = async () => {
        // Mock Save
        toast.info('Saving changes... (Mock)');
        setTimeout(() => {
            setIsDirty(false);
            toast.success('Changes saved successfully!');
        }, 1000);
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
                description="Kéo thả món ăn để thiết lập menu cho từng chi nhánh"
                icon={Store}
                actions={
                    <Button
                        onClick={handleSave}
                        disabled={!isDirty}
                        className="bg-[#EC6426] hover:bg-[#EC6426]/90 text-white"
                    >
                        <Save className="mr-2 h-4 w-4" />
                        Lưu thay đổi
                    </Button>
                }
            />

            <DndContext
                sensors={sensors}
                collisionDetection={pointerWithin}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="flex h-[calc(100vh-200px)] gap-6">
                    {/* Left Panel: Global Source */}
                    <div className="w-1/3 bg-white rounded-xl border-2 border-gray-200 flex flex-col overflow-hidden">
                        <div className="p-4 border-b border-gray-100 bg-gray-50">
                            <h3 className="font-bold text-gray-700 flex items-center gap-2">
                                <Search className="h-4 w-4" />
                                Danh sách món ăn
                            </h3>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4">
                            <GlobalProductSource
                                products={globalProducts}
                                productTypes={productTypes}
                                selectedProductType={selectedProductType}
                                onSelectProductType={setSelectedProductType}
                                isLoading={loadingProducts}
                            />
                        </div>
                    </div>

                    {/* Right Panel: Branch Workspace */}
                    <div className="flex-1 bg-white rounded-xl border-2 border-gray-200 flex flex-col overflow-hidden">
                        {/* Tabs Header */}
                        <div className="flex items-center border-b border-gray-200 bg-gray-50 px-2 pt-2">
                            {activeBranchTabs.map(branchId => {
                                const branch = branches.find(b => b.id === branchId);
                                return (
                                    <div
                                        key={branchId}
                                        onClick={() => setActiveTabId(branchId)}
                                        className={`
                                            group flex items-center gap-2 px-4 py-2 rounded-t-lg cursor-pointer border-t border-x mr-1
                                            ${activeTabId === branchId
                                                ? 'bg-white border-gray-200 border-b-white font-semibold text-[#EC6426]'
                                                : 'bg-gray-100 border-transparent text-gray-500 hover:bg-gray-200'
                                            }
                                        `}
                                    >
                                        <span>{branch?.name}</span>
                                        <button
                                            onClick={(e) => handleCloseTab(e, branchId)}
                                            className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-red-100 hover:text-red-500 rounded-full transition-all"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                );
                            })}

                            {/* Add Tab Dropdown */}
                            <div className="ml-2 mb-1">
                                <select
                                    className="bg-transparent text-sm font-medium text-gray-600 focus:outline-none cursor-pointer hover:text-[#EC6426]"
                                    onChange={(e) => {
                                        if (e.target.value) {
                                            handleOpenBranchTab(parseInt(e.target.value));
                                            e.target.value = '';
                                        }
                                    }}
                                    value=""
                                >
                                    <option value="" disabled>+ Mở chi nhánh</option>
                                    {branches
                                        .filter(b => !activeBranchTabs.includes(b.id))
                                        .map(b => (
                                            <option key={b.id} value={b.id}>{b.name}</option>
                                        ))
                                    }
                                </select>
                            </div>
                        </div>

                        {/* Tab Content */}
                        <div className="flex-1 bg-white p-4 overflow-y-auto">
                            {activeTabId ? (
                                <BranchTabContent
                                    branchId={activeTabId}
                                    products={branchMenus[activeTabId] || []}
                                    onRemove={(productId: number) => {
                                        setBranchMenus(prev => ({
                                            ...prev,
                                            [activeTabId]: prev[activeTabId].filter(p => p.productId !== productId)
                                        }));
                                        setIsDirty(true);
                                    }}
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
