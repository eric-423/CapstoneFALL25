'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createMaterialType, updateMaterialType, type MaterialType } from '@/apis/material.api';

interface MaterialTypeFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    materialType: MaterialType | null;
    onSuccess: () => void;
}

export function MaterialTypeFormDialog({ open, onOpenChange, materialType, onSuccess }: MaterialTypeFormDialogProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
    });

    useEffect(() => {
        if (materialType) {
            setFormData({
                name: materialType.name,
            });
        } else {
            setFormData({
                name: '',
            });
        }
    }, [materialType, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error('❌ Vui lòng nhập tên loại nguyên liệu!');
            return;
        }

        try {
            setLoading(true);

            if (materialType) {
                await updateMaterialType(materialType.id, formData);
                toast.success('✅ Cập nhật loại nguyên liệu thành công!');
            } else {
                await createMaterialType(formData);
                toast.success('✅ Thêm loại nguyên liệu thành công!');
            }

            onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error('Failed to save material type:', error);
            toast.error('❌ Không thể lưu loại nguyên liệu!');
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-lg bg-white shadow-2xl rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#EC6426] to-[#F8A91F] p-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-white">
                            {materialType ? 'Chỉnh sửa loại nguyên liệu' : 'Thêm loại nguyên liệu mới'}
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
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                                Tên loại nguyên liệu <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="VD: Thịt, Rau, Hải sản..."
                                className="mt-2"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 flex gap-3 justify-end">
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
                                materialType ? 'Cập nhật' : 'Thêm mới'
                            )}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
