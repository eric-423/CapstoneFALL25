'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
import { UseFormRegister, UseFormSetValue, FieldErrors, Control, Controller } from 'react-hook-form';

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

// Define the shape of the form data we're working with
// This should match ProductFormData in ProductForm.tsx
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

    // Helper to get selected material unit
    // We can't easily access the current value without watching, but we can try to find it if passed or just show generic
    // For simplicity, we'll rely on the Select to show the unit in the option, 
    // or we could pass the current value if we wanted to show it outside.
    // Let's just show it in the placeholder or rely on the user knowing.
    // Actually, RecipeStepItem showed it. We can use Controller to get the value.

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
                                            {m.name} ({m.unit})
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

                {/* Quantity */}
                <div className="relative">
                    <Input
                        type="number"
                        step="any"
                        placeholder="Số lượng"
                        {...register(`recipesRequests.${index}.quantity`)}
                        className="pr-12"
                    />
                    {/* We could try to show unit here if we had access to selected material */}
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
                                value={field.value ? field.value.toString() : undefined}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Phương pháp nấu" />
                                </SelectTrigger>
                                <SelectContent>
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
