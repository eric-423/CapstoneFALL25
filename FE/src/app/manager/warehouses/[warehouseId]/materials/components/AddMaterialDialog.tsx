'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { addMaterialsToWarehouse, type Material } from '@/apis/material.api';
import { getUnits, type Unit } from '@/apis/unit.api';

interface AddMaterialDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    warehouseId: number;
    availableMaterials: Material[];
    existingMaterialIds?: number[];
    onSuccess: () => void;
}

interface MaterialInput {
    materialId: string;
    quantity: string;
    threshold: string;
}

export function AddMaterialDialog({
    open,
    onOpenChange,
    warehouseId,
    availableMaterials,
    existingMaterialIds = [],
    onSuccess
}: AddMaterialDialogProps) {
    const [loading, setLoading] = useState(false);
    const [materials, setMaterials] = useState<MaterialInput[]>([
        { materialId: '', quantity: '', threshold: '' }
    ]);
    const [units, setUnits] = useState<Unit[]>([]);

    // Filter out materials already in warehouse
    const selectableMaterials = availableMaterials.filter(m => !existingMaterialIds.includes(m.id));

    useEffect(() => {
        const fetchUnits = async () => {
            try {
                const data = await getUnits();
                setUnits(data);
            } catch (error) {
                console.error('Failed to fetch units:', error);
            }
        };
        fetchUnits();
    }, []);

    const handleAddRow = () => {
        setMaterials([...materials, { materialId: '', quantity: '', threshold: '' }]);
    };

    const handleRemoveRow = (index: number) => {
        if (materials.length === 1) {
            toast.error('❌ Phải có ít nhất 1 nguyên liệu!');
            return;
        }
        setMaterials(materials.filter((_, i) => i !== index));
    };

    const handleMaterialChange = (index: number, field: keyof MaterialInput, value: string) => {
        const newMaterials = [...materials];
        newMaterials[index][field] = value;
        setMaterials(newMaterials);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate
        for (const material of materials) {
            if (!material.materialId || !material.quantity || !material.threshold) {
                toast.error('❌ Vui lòng điền đầy đủ thông tin!');
                return;
            }

            const quantity = parseFloat(material.quantity);
            if (isNaN(quantity) || quantity <= 0) {
                toast.error('❌ Số lượng phải lớn hơn 0!');
                return;
            }

            const threshold = parseFloat(material.threshold);
            if (isNaN(threshold) || threshold <= 0) {
                toast.error('❌ Ngưỡng cảnh báo phải lớn hơn 0!');
                return;
            }
        }

        // Check duplicates
        const materialIds = materials.map(m => m.materialId);
        if (new Set(materialIds).size !== materialIds.length) {
            toast.error('❌ Không được chọn trùng nguyên liệu!');
            return;
        }

        try {
            setLoading(true);

            await addMaterialsToWarehouse(warehouseId, {
                materials: materials.map(m => ({
                    materialId: parseInt(m.materialId),
                    quantity: parseFloat(m.quantity),
                    threshold: parseFloat(m.threshold),
                }))
            });

            toast.success('✅ Thêm nguyên liệu vào kho thành công!');
            onSuccess();
            onOpenChange(false);
            setMaterials([{ materialId: '', quantity: '', threshold: '' }]);
        } catch (error) {
            console.error('Failed to add materials:', error);
            toast.error('❌ Không thể thêm nguyên liệu vào kho!');
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/15 backdrop-blur-[1px] z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-3xl bg-white shadow-2xl rounded-2xl overflow-hidden max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="bg-[#78A243] p-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-white">
                            Thêm nguyên liệu vào kho
                        </h2>
                        <button
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
                        >
                            <X className="h-6 w-6 text-white" />
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col">
                    <div className="p-6 overflow-y-auto flex-1">
                        <div className="space-y-4">
                            {materials.map((material, index) => (
                                <div key={index} className="border-2 border-[#78A243]/20 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-semibold text-[#2D1E1A]">
                                            Nguyên liệu {index + 1}
                                        </h3>
                                        {materials.length > 1 && (
                                            <Button
                                                type="button"
                                                onClick={() => handleRemoveRow(index)}
                                                size="sm"
                                                variant="outline"
                                                className="text-red-600 border-red-200 hover:bg-red-50"
                                                disabled={loading}
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        {/* Nguyên liệu */}
                                        <div className="col-span-3">
                                            <Label className="text-sm font-semibold text-[#2D1E1A]">
                                                Nguyên liệu <span className="text-red-500">*</span>
                                            </Label>
                                            <Select
                                                value={material.materialId}
                                                onValueChange={(value) => handleMaterialChange(index, 'materialId', value)}
                                                disabled={loading}
                                            >
                                                <SelectTrigger className="mt-2">
                                                    <SelectValue placeholder="Chọn nguyên liệu" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {selectableMaterials.length > 0 ? (
                                                        selectableMaterials.map((m) => (
                                                            <SelectItem key={m.id} value={m.id.toString()}>
                                                                {m.name} ({m.materialTypeName})
                                                            </SelectItem>
                                                        ))
                                                    ) : (
                                                        <div className="p-2 text-sm text-gray-500 text-center">
                                                            Tất cả nguyên liệu đã có trong kho
                                                        </div>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Số lượng */}
                                        <div>
                                            <Label className="text-sm font-semibold text-[#2D1E1A]">
                                                Số lượng <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                type="number"
                                                step="0.1"
                                                min="0"
                                                value={material.quantity}
                                                onChange={(e) => handleMaterialChange(index, 'quantity', e.target.value)}
                                                placeholder="VD: 100"
                                                className="mt-2"
                                                disabled={loading}
                                            />
                                            {material.materialId && (() => {
                                                const selectedMaterial = availableMaterials.find(m => m.id.toString() === material.materialId);
                                                const unitName = selectedMaterial ? units.find(u => u.id === selectedMaterial.unitId)?.name : '';
                                                return unitName ? (
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Đơn vị: {unitName}
                                                    </p>
                                                ) : null;
                                            })()}
                                        </div>

                                        {/* Ngưỡng cảnh báo */}
                                        <div className="col-span-2">
                                            <Label className="text-sm font-semibold text-[#2D1E1A]">
                                                Ngưỡng cảnh báo <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                type="number"
                                                step="0.1"
                                                min="0"
                                                value={material.threshold}
                                                onChange={(e) => handleMaterialChange(index, 'threshold', e.target.value)}
                                                placeholder="VD: 10"
                                                className="mt-2"
                                                disabled={loading}
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                Cảnh báo khi số lượng thấp hơn ngưỡng này
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Button
                            type="button"
                            onClick={handleAddRow}
                            variant="outline"
                            className="w-full mt-4 border-2 border-dashed border-[#78A243]/30 hover:border-[#78A243] hover:bg-[#78A243]/10"
                            disabled={loading}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Thêm nguyên liệu
                        </Button>
                    </div>

                    {/* Footer */}
                    <div className="p-6 bg-gray-50 border-t border-gray-200 flex gap-3 justify-end">
                        <Button
                            type="button"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                            variant="outline"
                            className="px-6"
                        >
                            Hủy bỏ
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="px-6 bg-[#78A243] hover:bg-[#78A243]/90 text-white"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Đang thêm...
                                </>
                            ) : (
                                'Thêm vào kho'
                            )}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}

