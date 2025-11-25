'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createCookingMethod, updateCookingMethod, type CookingMethod } from '@/apis/cooking-method.api';

interface CookingMethodFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    cookingMethod: CookingMethod | null;
    onSuccess: () => void;
}

export function CookingMethodFormDialog({ open, onOpenChange, cookingMethod, onSuccess }: CookingMethodFormDialogProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });

    useEffect(() => {
        if (cookingMethod) {
            setFormData({
                name: cookingMethod.name,
                description: cookingMethod.description || '',
            });
        } else {
            setFormData({
                name: '',
                description: '',
            });
        }
    }, [cookingMethod, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error('❌ Vui lòng nhập tên phương pháp!');
            return;
        }

        try {
            setLoading(true);

            const requestData = {
                name: formData.name.trim(),
                description: formData.description.trim(),
            };

            if (cookingMethod) {
                await updateCookingMethod(cookingMethod.id, requestData);
                toast.success('✅ Cập nhật phương pháp thành công!');
            } else {
                await createCookingMethod(requestData);
                toast.success('✅ Thêm phương pháp thành công!');
            }

            onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error('Failed to save cooking method:', error);
            toast.error('❌ Không thể lưu phương pháp nấu!');
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
                            {cookingMethod ? 'Chỉnh sửa phương pháp' : 'Thêm phương pháp mới'}
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
                        {/* Tên phương pháp */}
                        <div>
                            <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                                Tên phương pháp <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="VD: Chiên, Xào, Hấp..."
                                className="mt-2"
                                disabled={loading}
                            />
                        </div>

                        {/* Mô tả */}
                        <div>
                            <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
                                Mô tả
                            </Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Mô tả chi tiết về phương pháp nấu này..."
                                className="mt-2 min-h-[100px]"
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
                                cookingMethod ? 'Cập nhật' : 'Thêm mới'
                            )}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
