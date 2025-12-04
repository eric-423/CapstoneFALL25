'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
import { UseFormRegister, UseFormSetValue, FieldErrors, Control, Controller, useWatch } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Material } from '@/apis/material.api';
import { CookingMethod } from '@/apis/cooking-method.api';
import { Unit } from '@/apis/unit.api';

interface RecipeRequest {
    materialId: number;
    quantity: number;
    orderStep?: number;
    cookingMethodId: number;
}

interface ProductFormData {
    name: string;
    description: string;
    price: number;
    imageUrl?: string;
    typeId: number;
    recipesRequests?: RecipeRequest[];
}

interface ProductRecipeStepItemProps {
    id: string; // Unique ID for dnd-kit
    index: number;
    control: Control<ProductFormData>;
    register: UseFormRegister<ProductFormData>;
    setValue: UseFormSetValue<ProductFormData>;
    remove: (index: number) => void;
    materials: Material[];
    cookingMethods: CookingMethod[];
    units: Unit[];
    errors: FieldErrors<ProductFormData>;
}

export function ProductRecipeStepItem({
    id,
    index,
    control,
    register,
    remove,
    materials,
    cookingMethods,
    units,
    errors,
}: ProductRecipeStepItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.5 : 1,
    };

    // Watch current materialId to get its unit
    const currentMaterialId = useWatch({
        control,
        name: `recipesRequests.${index}.materialId`,
    });

    // Helper to get unit name
    const getUnitName = (unitId: number) => {
        const unit = units.find(u => u.id === unitId);
        return unit ? unit.symbols : '';
    };

    // Get current material to display unit
    const currentMaterial = materials.find(m => m.id === currentMaterialId);
    const currentUnit = currentMaterial ? getUnitName(currentMaterial.unitId) : '';

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-start gap-3 group hover:border-[#78A243]/30 transition-colors"
        >
            {/* Drag Handle */}
            <div
                {...attributes}
                {...listeners}
                className="mt-2 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
            >
                <GripVertical className="h-5 w-5" />
            </div>

            {/* Step Number */}
            <div className="mt-1 w-8 h-8 bg-[#78A243]/20 rounded-full flex items-center justify-center text-[#78A243] font-bold text-sm shrink-0">
                {index + 1}
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Material */}
                <div>
                    <Controller
                        control={control}
                        name={`recipesRequests.${index}.materialId`}
                        render={({ field }) => (
                            <Select
                                onValueChange={(val) => field.onChange(parseInt(val))}
                                value={field.value ? field.value.toString() : undefined}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Chọn nguyên liệu" />
                                </SelectTrigger>
                                <SelectContent>
                                    {materials.map((m) => (
                                        <SelectItem key={m.id} value={m.id.toString()}>
                                            {m.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.recipesRequests?.[index]?.materialId && (
                        <p className="text-[10px] text-red-500 mt-1">{errors.recipesRequests[index]?.materialId?.message}</p>
                    )}
                </div>

                {/* Quantity with Unit */}
                <div className="relative">
                    <Input
                        type="number"
                        step="any"
                        placeholder="Số lượng"
                        {...register(`recipesRequests.${index}.quantity`)}
                        className="pr-12"
                    />
                    {currentUnit && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium">
                            {currentUnit}
                        </div>
                    )}
                    {errors.recipesRequests?.[index]?.quantity && (
                        <p className="text-[10px] text-red-500 mt-1">{errors.recipesRequests[index]?.quantity?.message}</p>
                    )}
                </div>

                {/* Cooking Method */}
                <div>
                    <Controller
                        control={control}
                        name={`recipesRequests.${index}.cookingMethodId`}
                        render={({ field }) => (
                            <Select
                                onValueChange={(val) => field.onChange(parseInt(val))}
                                value={field.value !== undefined ? field.value.toString() : undefined}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Phương pháp nấu" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0">Không</SelectItem>
                                    {cookingMethods.map((cm) => (
                                        <SelectItem key={cm.id} value={cm.id.toString()}>
                                            {cm.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.recipesRequests?.[index]?.cookingMethodId && (
                        <p className="text-[10px] text-red-500 mt-1">{errors.recipesRequests[index]?.cookingMethodId?.message}</p>
                    )}
                </div>
            </div>

            {/* Remove Button */}
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
                className="text-gray-400 hover:text-red-500 hover:bg-red-50"
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );
}
