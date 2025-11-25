'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
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
import { RecipeStep } from './RecipeBuilder';

interface RecipeStepItemProps {
    step: RecipeStep;
    index: number;
    materials: Material[];
    cookingMethods: CookingMethod[];
    onUpdate: (id: string, field: keyof RecipeStep, value: string) => void;
    onRemove: (id: string) => void;
}

export function RecipeStepItem({ step, index, materials, cookingMethods, onUpdate, onRemove }: RecipeStepItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: step.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.5 : 1,
    };

    const selectedMaterial = materials.find(m => m.id.toString() === step.materialId);

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-start gap-3 group hover:border-orange-200 transition-colors"
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
            <div className="mt-1 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-700 font-bold text-sm shrink-0">
                {index + 1}
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Material */}
                <div>
                    <Select
                        value={step.materialId}
                        onValueChange={(value) => onUpdate(step.id, 'materialId', value)}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Chọn nguyên liệu" />
                        </SelectTrigger>
                        <SelectContent>
                            {materials.map((material) => (
                                <SelectItem key={material.id} value={material.id.toString()}>
                                    {material.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Quantity */}
                <div className="relative">
                    <Input
                        type="number"
                        placeholder="Số lượng"
                        value={step.quantity}
                        onChange={(e) => onUpdate(step.id, 'quantity', e.target.value)}
                        className="pr-12"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none">
                        {selectedMaterial?.unit || 'đơn vị'}
                    </div>
                </div>

                {/* Cooking Method */}
                <div>
                    <Select
                        value={step.cookingMethodId}
                        onValueChange={(value) => onUpdate(step.id, 'cookingMethodId', value)}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Phương pháp nấu" />
                        </SelectTrigger>
                        <SelectContent>
                            {cookingMethods.map((method) => (
                                <SelectItem key={method.id} value={method.id.toString()}>
                                    {method.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Remove Button */}
            <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemove(step.id)}
                className="text-gray-400 hover:text-red-500 hover:bg-red-50"
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );
}
