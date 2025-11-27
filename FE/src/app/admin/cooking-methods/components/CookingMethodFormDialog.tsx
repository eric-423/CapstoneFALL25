'use client';

import React, { useState, useEffect } from 'react';
import { X, ChefHat } from 'lucide-react';
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <Card className="w-full max-w-lg bg-white shadow-2xl rounded-2xl border-0 overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="bg-[#78A243] p-4 flex items-center justify-between z-10 shadow-lg shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                            <ChefHat className="h-5 w-5 text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-white">
                            {cookingMethod ? 'Chỉnh sửa phương pháp' : 'Thêm phương pháp mới'}
                        </h2>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onOpenChange(false)}
                        className="border-white/30 bg-white/10 hover:bg-white/20 text-white hover:text-white backdrop-blur-sm h-8 w-8 p-0"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                    <div className="p-6 overflow-y-auto flex-1 space-y-6">
                        {/* Tên phương pháp */}
                        <div className="space-y-1.5">
                            <Label htmlFor="name" className="text-xs font-semibold text-[#2D1E1A] flex items-center gap-1">
                                Tên phương pháp <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="VD: Chiên, Xào, Hấp..."
                                className="w-full px-3 py-2 border border-[#78A243]/30 rounded-lg text-sm text-[#2D1E1A] focus:border-[#78A243] focus:ring-1 focus:ring-[#78A243]/20 transition-all outline-none"
                                disabled={loading}
                            />
                        </div>

                        {/* Mô tả */}
                        <div className="space-y-1.5">
                            <Label htmlFor="description" className="text-xs font-semibold text-[#2D1E1A] flex items-center gap-1">
                                Mô tả
                            </Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Mô tả chi tiết về phương pháp nấu này..."
                                className="w-full px-3 py-2 border border-[#78A243]/30 rounded-lg text-sm text-[#2D1E1A] focus:border-[#78A243] focus:ring-1 focus:ring-[#78A243]/20 transition-all outline-none min-h-[120px] resize-none"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-white border-t border-gray-200 p-4 flex gap-2 justify-end shadow-lg shrink-0">
                        <Button
                            type="button"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                            variant="outline"
                            className="px-4 py-2 text-sm border border-[#78A243]/30 hover:bg-[#78A243]/5 font-semibold text-[#2D1E1A]"
                        >
                            Hủy bỏ
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm bg-[#78A243] hover:bg-[#78A243]/90 text-white shadow-lg hover:shadow-xl transition-all font-semibold"
                        >
                            {loading ? (
                                <>
                                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin mr-1.5"></div>
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
