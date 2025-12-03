'use client';

import React, { useState } from 'react';
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
import { createCookingUtensil, UtensilType } from '@/apis/utensil.api';

interface AddUtensilDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    warehouseId: number;
    utensilTypes: UtensilType[];
    onSuccess: () => void;
}

interface UtensilInput {
    name: string;
    utensilsTypeId: string;
    quantity: string;
}

export function AddUtensilDialog({
    open,
    onOpenChange,
    warehouseId,
    utensilTypes,
    onSuccess
}: AddUtensilDialogProps) {
    const [loading, setLoading] = useState(false);
    const [utensils, setUtensils] = useState<UtensilInput[]>([
        { name: '', utensilsTypeId: '', quantity: '' }
    ]);

    const handleAddRow = () => {
        setUtensils([...utensils, { name: '', utensilsTypeId: '', quantity: '' }]);
    };

    const handleRemoveRow = (index: number) => {
        if (utensils.length === 1) {
            toast.error('Phải có ít nhất 1 dụng cụ!');
            return;
        }
        setUtensils(utensils.filter((_, i) => i !== index));
    };

    const handleUtensilChange = (index: number, field: keyof UtensilInput, value: string) => {
        const newUtensils = [...utensils];
        newUtensils[index][field] = value;
        setUtensils(newUtensils);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate
        for (const utensil of utensils) {
            if (!utensil.name || !utensil.utensilsTypeId || !utensil.quantity) {
                toast.error('Vui lòng điền đầy đủ thông tin!');
                return;
            }

            const quantity = parseInt(utensil.quantity);
            if (isNaN(quantity) || quantity <= 0) {
                toast.error('Số lượng phải lớn hơn 0!');
                return;
            }
        }

        try {
            setLoading(true);

            // Create utensils sequentially (or parallel if API supports it, but here we do loop)
            // Ideally backend should support bulk create, but we only have createCookingUtensil
            await Promise.all(utensils.map(u =>
                createCookingUtensil({
                    name: u.name,
                    quantity: parseInt(u.quantity),
                    utensilsTypeId: parseInt(u.utensilsTypeId),
                    warehouseId: warehouseId
                })
            ));

            toast.success('Thêm dụng cụ vào kho thành công!');
            onSuccess();
            onOpenChange(false);
            setUtensils([{ name: '', utensilsTypeId: '', quantity: '' }]);
        } catch (error) {
            console.error('Failed to add utensils:', error);
            toast.error('Không thể thêm dụng cụ vào kho!');
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-3xl bg-white shadow-2xl rounded-2xl overflow-hidden max-h-[90vh] flex flex-col py-0">
                {/* Header */}
                <div className="bg-[#78A243] p-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-white">
                            Thêm dụng cụ mới
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
                            {utensils.map((utensil, index) => (
                                <div key={index} className="border-2 border-[#78A243]/20 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-semibold text-[#2D1E1A]">
                                            Dụng cụ {index + 1}
                                        </h3>
                                        {utensils.length > 1 && (
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

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {/* Tên dụng cụ */}
                                        <div>
                                            <Label className="text-sm font-semibold text-[#2D1E1A]">
                                                Tên dụng cụ <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                value={utensil.name}
                                                onChange={(e) => handleUtensilChange(index, 'name', e.target.value)}
                                                placeholder="Nhập tên dụng cụ"
                                                className="mt-2"
                                                disabled={loading}
                                            />
                                        </div>

                                        {/* Loại dụng cụ */}
                                        <div>
                                            <Label className="text-sm font-semibold text-[#2D1E1A]">
                                                Loại dụng cụ <span className="text-red-500">*</span>
                                            </Label>
                                            <Select
                                                value={utensil.utensilsTypeId}
                                                onValueChange={(value) => handleUtensilChange(index, 'utensilsTypeId', value)}
                                                disabled={loading}
                                            >
                                                <SelectTrigger className="mt-2">
                                                    <SelectValue placeholder="Chọn loại" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {utensilTypes.map((type) => (
                                                        <SelectItem key={type.id} value={type.id.toString()}>
                                                            {type.name}
                                                        </SelectItem>
                                                    ))}
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
                                                step="1"
                                                min="1"
                                                value={utensil.quantity}
                                                onChange={(e) => handleUtensilChange(index, 'quantity', e.target.value)}
                                                placeholder="VD: 10"
                                                className="mt-2"
                                                disabled={loading}
                                            />
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
                            Thêm dụng cụ khác
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
                                    Đang lưu...
                                </>
                            ) : (
                                'Lưu dụng cụ'
                            )}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
