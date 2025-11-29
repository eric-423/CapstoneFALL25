'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createMaterial, updateMaterial, type Material } from '@/apis/material.api';
import { getMaterialTypes, type MaterialType } from '@/apis/material.api';
import { getNutrients, type Nutrient } from '@/apis/nutrient.api';
import { getUnits, type Unit } from '@/apis/unit.api';
import { useBodyScrollLock } from '../../components/useBodyScrollLock';
import { AdminSelect } from '../../components/AdminSelect';

interface MaterialFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    material: Material | null;
    onSuccess: () => void;
}

interface NutrientRow {
    nutrientId: string;
    amountPer100Unit: string;
}

export function MaterialFormDialog({ open, onOpenChange, material, onSuccess }: MaterialFormDialogProps) {
    const [loading, setLoading] = useState(false);
    useBodyScrollLock(open);
    const [materialTypes, setMaterialTypes] = useState<MaterialType[]>([]);
    const [units, setUnits] = useState<Unit[]>([]);

    const unitOptions = useMemo(() => {
        const mappedUnits = units.map((u) => ({
            value: u.id.toString(),
            label: u.name,
            subLabel: u.symbols,
        }));

        if (!material) return mappedUnits;

        const currentFromUnits = units.find((u) => u.id === material.unitId);
        const currentOption = currentFromUnits
            ? {
                value: currentFromUnits.id.toString(),
                label: currentFromUnits.name,
                subLabel: currentFromUnits.symbols,
            }
            : {
                value: material.unitId.toString(),
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                label: (material as any).unitName || `Đơn vị ID ${material.unitId}`,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                subLabel: (material as any).unitSymbol || '',
            };

        // Deduplicate by value while ensuring current option is first
        const seen = new Set<string>();
        const combined = [currentOption, ...mappedUnits].filter((opt) => {
            if (seen.has(opt.value)) return false;
            seen.add(opt.value);
            return true;
        });

        return combined;
    }, [material, units]);

    // Form Data
    const [formData, setFormData] = useState({
        name: '',
        unitId: '',
        materialTypeId: '',
    });

    useEffect(() => {
        if (open) {
            loadInitialData();
        }
    }, [open]);

    useEffect(() => {
        if (material && open) {
            setFormData({
                name: material.name,
                unitId: material.unitId.toString(),
                materialTypeId: material.materialTypeId.toString(),
            });
        } else if (!material && open) {
            setFormData({
                name: '',
                unitId: '',
                materialTypeId: '',
            });
        }
    }, [material, open]);

    // Ensure unit stays in sync once units list arrives
    useEffect(() => {
        if (!open || !material) return;
        if (formData.unitId) return;
        setFormData((prev) => ({ ...prev, unitId: material.unitId.toString() }));
    }, [open, material, formData.unitId]);

    const loadInitialData = async () => {
        try {
            const [typesData, unitsData] = await Promise.all([
                getMaterialTypes(false),
                getUnits()
            ]);
            setMaterialTypes(typesData);
            setUnits(unitsData);
        } catch (error) {
            console.error('Failed to load initial data:', error);
            toast.error('❌ Không thể tải dữ liệu ban đầu!');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.unitId || !formData.materialTypeId) {
            toast.error('❌ Vui lòng điền đầy đủ thông tin chung!');
            return;
        }

        try {
            setLoading(true);

            const requestData = {
                name: formData.name.trim(),
                unitId: parseInt(formData.unitId),
                materialTypeId: parseInt(formData.materialTypeId),
            };

            let savedMaterialId: number;

            if (material) {
                await updateMaterial(material.id, requestData);
                savedMaterialId = material.id;
                toast.success('✅ Cập nhật thông tin nguyên liệu thành công!');
            } else {
                const newMaterial = await createMaterial(requestData);
                savedMaterialId = newMaterial.id;
                toast.success('✅ Thêm nguyên liệu mới thành công!');
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

    // Helper to get unit name for display
    const getUnitName = (unitIdStr: string) => {
        if (!unitIdStr) return 'đơn vị';
        const unit = units.find(u => u.id.toString() === unitIdStr);
        return unit ? `${unit.name} (${unit.symbols})` : 'đơn vị';
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <Card className="w-full max-w-2xl bg-white shadow-2xl rounded-2xl border-0 overflow-hidden flex flex-col max-h-[90vh] py-0">
                {/* Header */}
                <div className="bg-[#78A243] p-4 flex items-center justify-between z-10 shadow-lg shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">M</span>
                        </div>
                        <h2 className="text-xl font-bold text-white">
                            {material ? 'Chỉnh sửa nguyên liệu' : 'Thêm nguyên liệu mới'}
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
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="grid grid-cols-2 gap-6">
                            {/* Tên nguyên liệu */}
                            <div className="col-span-2 space-y-1.5">
                                <Label htmlFor="name" className="text-xs font-semibold text-[#2D1E1A] flex items-center gap-1">
                                    Tên nguyên liệu <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="VD: Sườn nướng, Thịt bò..."
                                    className="w-full px-3 py-2 border border-[#78A243]/30 rounded-lg text-sm text-[#2D1E1A] focus:border-[#78A243] focus:ring-1 focus:ring-[#78A243]/20 transition-all outline-none"
                                    disabled={loading}
                                />
                            </div>

                            {/* Loại nguyên liệu */}
                            <div className="space-y-1.5">
                                <Label htmlFor="materialTypeId" className="text-xs font-semibold text-[#2D1E1A] flex items-center gap-1">
                                    Loại nguyên liệu <span className="text-red-500">*</span>
                                </Label>
                                <AdminSelect
                                    value={formData.materialTypeId}
                                    onValueChange={(value) => setFormData({ ...formData, materialTypeId: value })}
                                    disabled={loading}
                                    placeholder="Chọn loại"
                                    options={materialTypes.map((type) => ({
                                        value: type.id.toString(),
                                        label: type.name,
                                    }))}
                                />
                            </div>

                            {/* Đơn vị */}
                            <div className="space-y-1.5">
                                <Label htmlFor="unitId" className="text-xs font-semibold text-[#2D1E1A] flex items-center gap-1">
                                    Đơn vị <span className="text-red-500">*</span>
                                </Label>
                                <AdminSelect
                                    value={formData.unitId}
                                    onValueChange={(value) => setFormData({ ...formData, unitId: value })}
                                    disabled={loading}
                                    placeholder="Chọn đơn vị"
                                    options={unitOptions}
                                />
                            </div>
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
                            onClick={handleSubmit}
                            disabled={loading}
                            className="px-4 py-2 text-sm bg-[#78A243] hover:bg-[#78A243]/90 text-white shadow-lg hover:shadow-xl transition-all font-semibold"
                        >
                            {loading ? (
                                <>
                                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin mr-1.5"></div>
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
