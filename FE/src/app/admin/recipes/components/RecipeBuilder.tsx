'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, Save, ChefHat } from 'lucide-react';
import { toast } from 'react-toastify';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Product } from '@/apis/product.api';
import { getMaterials, type Material } from '@/apis/material.api';
import { getCookingMethods, type CookingMethod } from '@/apis/cooking-method.api';
import { getRecipesByProductId, updateManyRecipes, type ProductRecipesRequestForMany, type ProductRecipes } from '@/apis/recipe.api';
import { RecipeStepItem } from './RecipeStepItem';

interface RecipeBuilderProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product: Product;
}

export interface RecipeStep {
    id: string; // Unique ID for dnd-kit (can be temp ID for new items)
    materialId: string;
    cookingMethodId: string;
    quantity: string;
    orderStep: number;
}

export function RecipeBuilder({ open, onOpenChange, product }: RecipeBuilderProps) {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [steps, setSteps] = useState<RecipeStep[]>([]);

    // Master Data
    const [materials, setMaterials] = useState<Material[]>([]);
    const [cookingMethods, setCookingMethods] = useState<CookingMethod[]>([]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const loadInitialData = React.useCallback(async () => {
        try {
            setLoading(true);
            const [materialsData, methodsData, recipesData] = await Promise.all([
                getMaterials({ size: 100 }), // Fetch all materials
                getCookingMethods({ size: 100 }), // Fetch all methods
                getRecipesByProductId(product.productId)
            ]);

            setMaterials(materialsData.data.content);
            setCookingMethods(methodsData.content);

            // Map existing recipes to steps
            const existingSteps = recipesData.sort((a: ProductRecipes, b: ProductRecipes) => a.orderStep - b.orderStep).map((recipe: ProductRecipes) => ({
                id: `existing-${recipe.id}`,
                materialId: recipe.material.id.toString(),
                cookingMethodId: recipe.cookingMethod.id.toString(),
                quantity: recipe.quantity.toString(),
                orderStep: recipe.orderStep
            }));
            setSteps(existingSteps);

        } catch (error) {
            console.error('Failed to load recipe data:', error);
            toast.error('❌ Không thể tải dữ liệu công thức!');
        } finally {
            setLoading(false);
        }
    }, [product.productId]);

    useEffect(() => {
        if (open) {
            loadInitialData();
        }
    }, [open, loadInitialData]);

    const handleAddStep = () => {
        const newStep: RecipeStep = {
            id: `new-${Date.now()}`,
            materialId: '',
            cookingMethodId: '',
            quantity: '',
            orderStep: steps.length + 1
        };
        setSteps([...steps, newStep]);
    };

    const handleRemoveStep = (id: string) => {
        setSteps(steps.filter(step => step.id !== id));
    };

    const handleUpdateStep = (id: string, field: keyof RecipeStep, value: string) => {
        setSteps(steps.map(step =>
            step.id === id ? { ...step, [field]: value } : step
        ));
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setSteps((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const handleSave = async () => {
        // Validate
        for (const step of steps) {
            if (!step.materialId || !step.cookingMethodId || !step.quantity) {
                toast.error('❌ Vui lòng điền đầy đủ thông tin cho tất cả các bước!');
                return;
            }
            if (parseFloat(step.quantity) <= 0) {
                toast.error('❌ Số lượng phải lớn hơn 0!');
                return;
            }
        }

        try {
            setSaving(true);

            const requestData: ProductRecipesRequestForMany[] = steps.map((step, index) => ({
                materialId: parseInt(step.materialId),
                cookingMethodId: parseInt(step.cookingMethodId),
                quantity: parseFloat(step.quantity),
                orderStep: index + 1 // Re-assign order based on current list position
            }));

            await updateManyRecipes(product.productId, requestData);
            toast.success('✅ Lưu công thức thành công!');
            onOpenChange(false);
        } catch (error) {
            console.error('Failed to save recipe:', error);
            toast.error('❌ Không thể lưu công thức!');
        } finally {
            setSaving(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-4xl bg-white shadow-2xl rounded-2xl overflow-hidden max-h-[95vh] flex flex-col py-0">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#EC6426] to-[#F8A91F] p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-lg">
                                <ChefHat className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Xây dựng công thức</h2>
                                <p className="text-orange-100 text-sm">{product.productName}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => onOpenChange(false)}
                            disabled={saving}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
                        >
                            <X className="h-6 w-6 text-white" />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    {loading ? (
                        <div className="flex items-center justify-center h-40">
                            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-gray-800">Các bước thực hiện</h3>
                                <Button
                                    onClick={handleAddStep}
                                    className="bg-white text-orange-600 border border-orange-200 hover:bg-orange-50"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Thêm bước
                                </Button>
                            </div>

                            {steps.length === 0 ? (
                                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl bg-white">
                                    <ChefHat className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500">Chưa có bước nào trong công thức</p>
                                    <Button onClick={handleAddStep} variant="link" className="text-orange-600">
                                        Thêm bước đầu tiên
                                    </Button>
                                </div>
                            ) : (
                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragEnd={handleDragEnd}
                                >
                                    <SortableContext
                                        items={steps.map(s => s.id)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        <div className="space-y-3">
                                            {steps.map((step, index) => (
                                                <RecipeStepItem
                                                    key={step.id}
                                                    step={step}
                                                    index={index}
                                                    materials={materials}
                                                    cookingMethods={cookingMethods}
                                                    onUpdate={handleUpdateStep}
                                                    onRemove={handleRemoveStep}
                                                />
                                            ))}
                                        </div>
                                    </SortableContext>
                                </DndContext>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 bg-white border-t border-gray-200 flex justify-end gap-3">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={saving}
                        className="px-6"
                    >
                        Hủy bỏ
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={saving || loading}
                        className="px-6 bg-gradient-to-r from-[#EC6426] to-[#F8A91F] hover:from-[#EC6426]/90 hover:to-[#F8A91F]/90 text-white"
                    >
                        {saving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Đang lưu...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4 mr-2" />
                                Lưu công thức
                            </>
                        )}
                    </Button>
                </div>
            </Card>
        </div>
    );
}
