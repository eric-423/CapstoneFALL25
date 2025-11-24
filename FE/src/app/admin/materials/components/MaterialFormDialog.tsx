'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
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
import { createMaterial, updateMaterial, type Material } from '@/apis/material.api';
import { getMaterialTypes, type MaterialType } from '@/apis/material.api';

interface MaterialFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    material: Material | null;
    onSuccess: () => void;
}

export function MaterialFormDialog({ open, onOpenChange, material, onSuccess }: MaterialFormDialogProps) {
    const [loading, setLoading] = useState(false);
    const [materialTypes, setMaterialTypes] = useState<MaterialType[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        caloriesPerUnit: '',
        unit: '',
        threshold: '',
        materialTypeId: '',
    });

    useEffect(() => {
        if (open) {
            loadMaterialTypes();
        }
    }, [open]);

    useEffect(() => {
        if (material) {
            setFormData({
                name: material.name,
                caloriesPerUnit: material.caloriesPerUnit.toString(),
                unit: material.unit,
                threshold: material.threshold.toString(),
                materialTypeId: material.materialTypeId.toString(),
            });
        } else {
            setFormData({
                name: '',
                caloriesPerUnit: '',
                unit: '',
                threshold: '',
                materialTypeId: '',
            });
        }
    }, [material, open]);

    const loadMaterialTypes = async () => {
        try {
            const data = await getMaterialTypes(false);
            setMaterialTypes(data);
        } catch (error) {
            console.error('Failed to load material types:', error);
            toast.error('❌ Không thể tải danh sách loại nguyên liệu!');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.unit.trim() || !formData.materialTypeId) {
            toast.error('❌ Vui lòng điền đầy đủ thông tin!');
            return;
        }

        const caloriesPerUnit = parseFloat(formData.caloriesPerUnit);
        const threshold = parseFloat(formData.threshold);

        if (isNaN(caloriesPerUnit) || caloriesPerUnit < 0) {
            toast.error('❌ Calo không hợp lệ!');
            return;
        }

        if (isNaN(threshold) || threshold < 0) {
            toast.error('❌ Ngưỡng tồn kho không hợp lệ!');
            return;
        }

        try {
            setLoading(true);

            const requestData = {
                name: formData.name.trim(),
                caloriesPerUnit,
                unit: formData.unit.trim(),
                threshold,
                materialTypeId: parseInt(formData.materialTypeId),
            };

            if (material) {
                await updateMaterial(material.id, requestData);
                toast.success('✅ Cập nhật nguyên liệu thành công!');
            } else {
                await createMaterial(requestData);
                toast.success('✅ Thêm nguyên liệu thành công!');
            }

            onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error('Failed to save material:', error);
            toast.error('❌ Không thể lưu nguyên liệu!');
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl bg-white shadow-2xl rounded-2xl overflow-hidden max-h-[95vh] flex flex-col py-0">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#EC6426] to-[#F8A91F] p-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-white">
                            {material ? 'Chỉnh sửa nguyên liệu' : 'Thêm nguyên liệu mới'}
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
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1">
                    <div className="grid grid-cols-2 gap-6">
                        {/* Tên nguyên liệu */}
                        <div className="col-span-2">
                            <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                                Tên nguyên liệu <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="VD: Sườn nướng, Thịt bò..."
                                className="mt-2"
                                disabled={loading}
                            />
                        </div>

                        {/* Loại nguyên liệu */}
                        <div>
                            <Label htmlFor="materialTypeId" className="text-sm font-semibold text-gray-700">
                                Loại nguyên liệu <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={formData.materialTypeId}
                                onValueChange={(value) => setFormData({ ...formData, materialTypeId: value })}
                                disabled={loading}
                            >
                                <SelectTrigger className="mt-2">
                                    <SelectValue placeholder="Chọn loại nguyên liệu" />
                                </SelectTrigger>
                                <SelectContent>
                                    {materialTypes.map((type) => (
                                        <SelectItem key={type.id} value={type.id.toString()}>
                                            {type.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Đơn vị */}
                        <div>
                            <Label htmlFor="unit" className="text-sm font-semibold text-gray-700">
                                Đơn vị <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="unit"
                                value={formData.unit}
                                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                placeholder="VD: gram, kg, lít..."
                                className="mt-2"
                                disabled={loading}
                            />
                        </div>

                        {/* Calo */}
                        <div>
                            <Label htmlFor="caloriesPerUnit" className="text-sm font-semibold text-gray-700">
                                Calo mỗi đơn vị <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="caloriesPerUnit"
                                type="number"
                                step="0.1"
                                min="0"
                                value={formData.caloriesPerUnit}
                                onChange={(e) => setFormData({ ...formData, caloriesPerUnit: e.target.value })}
                                placeholder="VD: 250"
                                className="mt-2"
                                disabled={loading}
                            />
                        </div>

                        {/* Ngưỡng tồn kho */}
                        <div>
                            <Label htmlFor="threshold" className="text-sm font-semibold text-gray-700">
                                Ngưỡng tồn kho <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="threshold"
                                type="number"
                                step="0.1"
                                min="0"
                                value={formData.threshold}
                                onChange={(e) => setFormData({ ...formData, threshold: e.target.value })}
                                placeholder="VD: 2000"
                                className="mt-2"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 flex gap-3 justify-end border-t pt-6">
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
                            className="px-6 bg-gradient-to-r from-[#EC6426] to-[#F8A91F] hover:from-[#EC6426]/90 hover:to-[#F8A91F]/90 text-white"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Đang lưu...
                                </>
                            ) : (
                                material ? 'Cập nhật' : 'Thêm mới'
                            )}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}