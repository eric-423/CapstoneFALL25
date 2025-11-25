'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createNutrient, updateNutrient, type Nutrient } from '@/apis/nutrient.api';

interface NutrientFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    nutrient: Nutrient | null;
    onSuccess: () => void;
}

export function NutrientFormDialog({ open, onOpenChange, nutrient, onSuccess }: NutrientFormDialogProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        unit: '',
        energyPerUnit: '',
    });

    useEffect(() => {
        if (nutrient) {
            setFormData({
                name: nutrient.name,
                code: nutrient.code,
                unit: nutrient.unit,
                energyPerUnit: nutrient.energyPerUnit.toString(),
            });
        } else {
            setFormData({
                name: '',
                code: '',
                unit: '',
                energyPerUnit: '',
            });
        }
    }, [nutrient, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.code.trim() || !formData.unit.trim()) {
            toast.error('❌ Vui lòng điền đầy đủ thông tin!');
            return;
        }

        const energyPerUnit = parseFloat(formData.energyPerUnit);

        if (isNaN(energyPerUnit) || energyPerUnit < 0) {
            toast.error('❌ Năng lượng không hợp lệ!');
            return;
        }

        try {
            setLoading(true);

            const requestData = {
                name: formData.name.trim(),
                code: formData.code.trim(),
                unit: formData.unit.trim(),
                energyPerUnit,
            };

            if (nutrient) {
                await updateNutrient(nutrient.id, requestData);
                toast.success('✅ Cập nhật dinh dưỡng thành công!');
            } else {
                await createNutrient(requestData);
                toast.success('✅ Thêm dinh dưỡng thành công!');
            }

            onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error('Failed to save nutrient:', error);
            toast.error('❌ Không thể lưu dinh dưỡng!');
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-lg bg-white shadow-2xl rounded-2xl overflow-hidden max-h-[95vh] flex flex-col py-0">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#EC6426] to-[#F8A91F] p-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-white">
                            {nutrient ? 'Chỉnh sửa dinh dưỡng' : 'Thêm dinh dưỡng mới'}
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
                    <div className="space-y-4">
                        {/* Tên dinh dưỡng */}
                        <div>
                            <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                                Tên dinh dưỡng <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="VD: Protein, Fat..."
                                className="mt-2"
                                disabled={loading}
                            />
                        </div>

                        {/* Mã dinh dưỡng */}
                        <div>
                            <Label htmlFor="code" className="text-sm font-semibold text-gray-700">
                                Mã dinh dưỡng <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="code"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                placeholder="VD: PRO, FAT..."
                                className="mt-2"
                                disabled={loading}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Đơn vị */}
                            <div>
                                <Label htmlFor="unit" className="text-sm font-semibold text-gray-700">
                                    Đơn vị <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="unit"
                                    value={formData.unit}
                                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                    placeholder="VD: g, mg..."
                                    className="mt-2"
                                    disabled={loading}
                                />
                            </div>

                            {/* Năng lượng */}
                            <div>
                                <Label htmlFor="energyPerUnit" className="text-sm font-semibold text-gray-700">
                                    Năng lượng (kcal) <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="energyPerUnit"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.energyPerUnit}
                                    onChange={(e) => setFormData({ ...formData, energyPerUnit: e.target.value })}
                                    placeholder="VD: 4"
                                    className="mt-2"
                                    disabled={loading}
                                />
                            </div>
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
                                nutrient ? 'Cập nhật' : 'Thêm mới'
                            )}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
