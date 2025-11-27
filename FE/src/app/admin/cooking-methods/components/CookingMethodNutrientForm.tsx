'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-toastify';
import { Loader2, Plus, Trash2, Save, X, ChefHat, Edit2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    getAllCookingMethodNutrients,
    createCookingMethodNutrient,
    updateCookingMethodNutrient,
    deleteCookingMethodNutrient,
    type CookingMethodNutrient,
} from '@/apis/cooking-method-nutrient.api';
import { getNutrients, type Nutrient } from '@/apis/nutrient.api';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';

interface CookingMethodNutrientFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    cookingMethodId: number | null;
    cookingMethodName: string;
}

const nutrientSchema = z.object({
    nutrientId: z.string().min(1, 'Vui lòng chọn chất dinh dưỡng'),
    retentionFactor: z.coerce
        .number()
        .min(0, 'Hệ số giữ lại phải >= 0')
        .max(100, 'Hệ số giữ lại phải <= 100'),
});

type NutrientFormData = z.infer<typeof nutrientSchema>;

export function CookingMethodNutrientForm({
    open,
    onOpenChange,
    cookingMethodId,
    cookingMethodName,
}: CookingMethodNutrientFormProps) {
    const [loading, setLoading] = useState(false);
    const [nutrients, setNutrients] = useState<Nutrient[]>([]);
    const [methodNutrients, setMethodNutrients] = useState<CookingMethodNutrient[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);

    const [deleteId, setDeleteId] = useState<number | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<NutrientFormData>({
        resolver: zodResolver(nutrientSchema),
        defaultValues: {
            nutrientId: '',
            retentionFactor: 100,
        },
    });

    const watchedNutrientId = watch('nutrientId');

    const fetchData = useCallback(async () => {
        if (!cookingMethodId) return;

        try {
            setLoading(true);
            const [allNutrientsRes, methodNutrientsRes] = await Promise.all([
                getNutrients({ size: 1000 }), // Fetch all nutrients
                getAllCookingMethodNutrients(),
            ]);

            setNutrients(allNutrientsRes.content);

            // Client-side filtering as per current API limitation
            const filtered = methodNutrientsRes.filter(
                (item) => item.cookingMethodId === cookingMethodId
            );
            setMethodNutrients(filtered);
        } catch (error) {
            console.error('Failed to fetch data:', error);
            toast.error('Không thể tải dữ liệu dinh dưỡng');
        } finally {
            setLoading(false);
        }
    }, [cookingMethodId]);

    useEffect(() => {
        if (open && cookingMethodId) {
            fetchData();
            reset({ nutrientId: '', retentionFactor: 100 });
            setEditingId(null);
        }
    }, [open, cookingMethodId, fetchData, reset]);

    useEffect(() => {
        if (editingId !== null) {
            const item = methodNutrients.find(n => n.nutrientId === editingId);
            if (item) {
                setValue('nutrientId', item.nutrientId.toString(), { shouldValidate: true });
                setValue('retentionFactor', item.retentionFactor, { shouldValidate: true });
            }
        }
    }, [editingId, methodNutrients, setValue]);

    const onSubmit = async (data: NutrientFormData) => {
        if (!cookingMethodId) return;

        try {
            setLoading(true);
            const nutrientId = parseInt(data.nutrientId);

            if (editingId) {
                // Update existing
                await updateCookingMethodNutrient(cookingMethodId, editingId, {
                    cookingMethodId,
                    nutrientId: editingId, // The ID in the path is the nutrientId
                    retentionFactor: data.retentionFactor,
                });
                toast.success('Cập nhật thành công');
                setEditingId(null);
            } else {
                // Create new
                // Check if already exists
                if (methodNutrients.some((n) => n.nutrientId === nutrientId)) {
                    toast.error('Chất dinh dưỡng này đã tồn tại trong phương pháp nấu');
                    setLoading(false);
                    return;
                }

                await createCookingMethodNutrient({
                    cookingMethodId,
                    nutrientId,
                    retentionFactor: data.retentionFactor,
                });
                toast.success('Thêm mới thành công');
            }

            reset({ nutrientId: '', retentionFactor: 100 });
            fetchData();
        } catch (error) {
            console.error('Failed to save nutrient:', error);
            toast.error('Có lỗi xảy ra khi lưu');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item: CookingMethodNutrient) => {
        setEditingId(item.nutrientId);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        reset({ nutrientId: '', retentionFactor: 100 });
    };

    const confirmDelete = (nutrientId: number) => {
        setDeleteId(nutrientId);
    };

    const handleDelete = async () => {
        if (!cookingMethodId || !deleteId) return;

        try {
            setLoading(true);
            await deleteCookingMethodNutrient(cookingMethodId, deleteId);
            toast.success('Xóa thành công');
            setDeleteId(null);
            fetchData();
        } catch (error) {
            console.error('Failed to delete:', error);
            toast.error('Không thể xóa');
        } finally {
            setLoading(false);
        }
    };

    // Filter out nutrients that are already added (unless editing)
    const availableNutrients = nutrients.filter(
        (n) => !methodNutrients.some((mn) => mn.nutrientId === n.id) || n.id === editingId
    );

    const deleteItemName = deleteId
        ? methodNutrients.find(n => n.nutrientId === deleteId)?.nutrientName || 'Chất dinh dưỡng'
        : '';

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col p-0 gap-0 bg-white border-0 shadow-2xl overflow-hidden">
                    <DialogHeader className="bg-[#78A243] p-4 shrink-0">
                        <DialogTitle className="flex items-center gap-3 text-xl text-white">
                            <div className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                <ChefHat className="h-5 w-5 text-white" />
                            </div>
                            Quản lý Dinh dưỡng - {cookingMethodName}
                        </DialogTitle>
                        <DialogDescription className="text-white/90 ml-12">
                            Cấu hình hệ số giữ lại dinh dưỡng cho phương pháp nấu này.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex-grow overflow-y-auto p-6 bg-gray-50/50 space-y-6">
                        {/* Form */}
                        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-5 rounded-xl border border-[#78A243]/20 shadow-sm space-y-4 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-[#78A243]"></div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-[#2D1E1A] flex items-center gap-1">
                                        Chất dinh dưỡng <span className="text-red-500">*</span>
                                    </label>
                                    <Select
                                        onValueChange={(val) => setValue('nutrientId', val, { shouldValidate: true })}
                                        value={watchedNutrientId}
                                        disabled={!!editingId}
                                    >
                                        <SelectTrigger className={`border-[#78A243]/30 focus:ring-[#78A243]/20 ${errors.nutrientId ? 'border-red-500' : ''}`}>
                                            <SelectValue placeholder="Chọn chất dinh dưỡng" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableNutrients.map((n) => (
                                                <SelectItem key={n.id} value={n.id.toString()}>
                                                    {n.name} ({n.unit})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.nutrientId && (
                                        <p className="text-xs text-red-500 font-medium">{errors.nutrientId.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-[#2D1E1A] flex items-center gap-1">
                                        Hệ số giữ lại (%) <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Input
                                            type="number"
                                            step="any"
                                            placeholder="100"
                                            {...register('retentionFactor')}
                                            className={`pr-8 border-[#78A243]/30 focus:border-[#78A243] focus:ring-[#78A243]/20 ${errors.retentionFactor ? 'border-red-500' : ''}`}
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">%</div>
                                    </div>
                                    {errors.retentionFactor && (
                                        <p className="text-xs text-red-500 font-medium">{errors.retentionFactor.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                {editingId && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleCancelEdit}
                                        size="sm"
                                        className="border-[#78A243]/30 text-[#2D1E1A] hover:bg-[#78A243]/10"
                                    >
                                        <X className="h-4 w-4 mr-1" /> Hủy sửa
                                    </Button>
                                )}
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    size="sm"
                                    className="bg-[#78A243] hover:bg-[#78A243]/90 text-white shadow-md"
                                >
                                    {loading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4 mr-1" />
                                            {editingId ? 'Cập nhật' : 'Thêm mới'}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>

                        {/* List */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-[#78A243]/5 border-b border-[#78A243]/10">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-[#78A243] uppercase tracking-wider">
                                                Chất dinh dưỡng
                                            </th>
                                            <th className="px-6 py-4 text-center text-xs font-bold text-[#78A243] uppercase tracking-wider">
                                                Hệ số giữ lại (%)
                                            </th>
                                            <th className="px-6 py-4 text-center text-xs font-bold text-[#78A243] uppercase tracking-wider">
                                                Thao tác
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {methodNutrients.length === 0 ? (
                                            <tr>
                                                <td colSpan={3} className="px-6 py-12 text-center text-gray-400 italic">
                                                    Chưa có dữ liệu dinh dưỡng
                                                </td>
                                            </tr>
                                        ) : (
                                            methodNutrients.map((item) => (
                                                <tr key={item.nutrientId} className="hover:bg-gray-50/80 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#2D1E1A]">
                                                        {item.nutrientName}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                                                        <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold ${item.retentionFactor < 50
                                                            ? 'bg-red-100 text-red-700'
                                                            : item.retentionFactor < 80
                                                                ? 'bg-yellow-100 text-yellow-700'
                                                                : 'bg-green-100 text-green-700'
                                                            }`}>
                                                            {item.retentionFactor}%
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleEdit(item)}
                                                                className="h-8 w-8 p-0 text-[#78A243] hover:text-[#78A243] hover:bg-[#78A243]/10 rounded-full"
                                                            >
                                                                <Edit2 className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => confirmDelete(item.nutrientId)}
                                                                className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <ConfirmDialog
                open={!!deleteId}
                onOpenChange={(open) => !open && setDeleteId(null)}
                onConfirm={handleDelete}
                title="Xóa dữ liệu"
                content={
                    <span>
                        Bạn có chắc chắn muốn xóa <span className="font-bold text-[#2D1E1A]">{deleteItemName}</span>?
                    </span>
                }
                alertMessage="Hành động này không thể hoàn tác. Dữ liệu sẽ bị xóa vĩnh viễn khỏi hệ thống."
                confirmText="Xóa dữ liệu"
                variant="destructive"
                loading={loading}
            />
        </>
    );
}
