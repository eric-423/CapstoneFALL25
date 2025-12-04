'use client';

import React, { useState, useEffect } from 'react';
import { X, Package } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateWarehouseMaterials, type WarehouseMaterial } from '@/apis/material.api';

interface EditMaterialDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    warehouseId: number;
    material: WarehouseMaterial | null;
    onSuccess: () => void;
}

export function EditMaterialDialog({
    open,
    onOpenChange,
    warehouseId,
    material,
    onSuccess
}: EditMaterialDialogProps) {
    const [loading, setLoading] = useState(false);
    const [quantity, setQuantity] = useState('');
    const [threshold, setThreshold] = useState('');

    useEffect(() => {
        if (material) {
            setQuantity(material.quantity.toString());
            setThreshold(material.threshold.toString());
        }
    }, [material]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!material) return;

        // Validate
        const quantityNum = parseFloat(quantity);
        if (isNaN(quantityNum) || quantityNum < 0) {
            toast.error('Số lượng phải lớn hơn hoặc bằng 0!');
            return;
        }

        const thresholdNum = parseFloat(threshold);
        if (isNaN(thresholdNum) || thresholdNum <= 0) {
            toast.error('Ngưỡng cảnh báo phải lớn hơn 0!');
            return;
        }

        try {
            setLoading(true);

            await updateWarehouseMaterials(warehouseId, {
                materials: [{
                    materialId: material.materialId,
                    quantity: quantityNum,
                    threshold: thresholdNum,
                }]
            });

            toast.success('Cập nhật nguyên liệu thành công!');
            onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error('Failed to update material:', error);
            toast.error('Không thể cập nhật nguyên liệu!');
        } finally {
            setLoading(false);
        }
    };

    if (!open || !material) return null;

    const stockPercentage = (parseFloat(quantity) / parseFloat(threshold)) * 100;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-white shadow-2xl rounded-2xl overflow-hidden py-0">
                {/* Header */}
                <div className="bg-[#78A243] p-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white">
                            Sửa nguyên liệu
                        </h2>
                        <button
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
                        >
                            <X className="h-5 w-5 text-white" />
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-5">
                        {/* Material Info */}
                        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-[#78A243]/10 to-[#EBD187]/10 rounded-xl">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#78A243] to-[#DA7339] rounded-lg flex items-center justify-center">
                                <Package className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <p className="font-bold text-[#2D1E1A]">{material.materialName}</p>
                                <p className="text-sm text-[#2D1E1A]/60">{material.materialTypeName}</p>
                            </div>
                        </div>

                        {/* Số lượng */}
                        <div>
                            <Label className="text-sm font-semibold text-[#2D1E1A]">
                                Số lượng tồn kho <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative mt-2">
                                <Input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    placeholder="VD: 100"
                                    className="pr-16"
                                    disabled={loading}
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                                    {material.unit}
                                </span>
                            </div>
                        </div>

                        {/* Ngưỡng cảnh báo */}
                        <div>
                            <Label className="text-sm font-semibold text-[#2D1E1A]">
                                Ngưỡng cảnh báo <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative mt-2">
                                <Input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    value={threshold}
                                    onChange={(e) => setThreshold(e.target.value)}
                                    placeholder="VD: 10"
                                    className="pr-16"
                                    disabled={loading}
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                                    {material.unit}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Cảnh báo khi số lượng thấp hơn ngưỡng này
                            </p>
                        </div>

                        {/* Preview */}
                        {quantity && threshold && !isNaN(stockPercentage) && (
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-600">Tình trạng tồn kho:</span>
                                    <span className={`text-sm font-semibold ${stockPercentage >= 100 ? 'text-[#78A243]' :
                                        stockPercentage >= 50 ? 'text-[#EBD187]' :
                                            'text-[#DA7339]'
                                        }`}>
                                        {Math.round(stockPercentage)}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full transition-all ${stockPercentage >= 100 ? 'bg-[#78A243]' :
                                            stockPercentage >= 50 ? 'bg-[#EBD187]' :
                                                'bg-[#DA7339]'
                                            }`}
                                        style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}
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
                                    Đang lưu...
                                </>
                            ) : (
                                'Lưu thay đổi'
                            )}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
