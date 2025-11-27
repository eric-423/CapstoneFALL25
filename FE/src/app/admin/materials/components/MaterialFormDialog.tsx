'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { createMaterial, updateMaterial, type Material } from '@/apis/material.api';
import { getMaterialTypes, type MaterialType } from '@/apis/material.api';
import { getNutrients, type Nutrient } from '@/apis/nutrient.api';
import { getMaterialNutrients, updateManyMaterialNutrients, type MaterialNutrientRequest } from '@/apis/material-nutrient.api';

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
    const [activeTab, setActiveTab] = useState('info');
    const [materialTypes, setMaterialTypes] = useState<MaterialType[]>([]);
    const [availableNutrients, setAvailableNutrients] = useState<Nutrient[]>([]);

    // Form Data
    const [formData, setFormData] = useState({
        name: '',
        caloriesPerUnit: '',
        unit: '',
        threshold: '',
        materialTypeId: '',
    });

    // Nutrient Data
    const [nutrientRows, setNutrientRows] = useState<NutrientRow[]>([]);

    useEffect(() => {
        if (open) {
            loadInitialData();
            setActiveTab('info');
        }
    }, [open]);

    useEffect(() => {
        if (material && open) {
            setFormData({
                name: material.name,
                caloriesPerUnit: material.caloriesPerUnit.toString(),
                unit: material.unit,
                threshold: material.threshold.toString(),
                materialTypeId: material.materialTypeId.toString(),
            });
            loadMaterialNutrients(material.id);
        } else if (!material && open) {
            setFormData({
                name: '',
                caloriesPerUnit: '',
                unit: '',
                threshold: '',
                materialTypeId: '',
            });
            setNutrientRows([]);
        }
    }, [material, open]);

    const loadInitialData = async () => {
        try {
            const [typesData, nutrientsData] = await Promise.all([
                getMaterialTypes(false),
                getNutrients({ size: 100 }) // Fetch all nutrients (limit 100 for now)
            ]);
            setMaterialTypes(typesData);
            setAvailableNutrients(nutrientsData.content);
        } catch (error) {
            console.error('Failed to load initial data:', error);
            toast.error('❌ Không thể tải dữ liệu ban đầu!');
        }
    };

    const loadMaterialNutrients = async (materialId: number) => {
        try {
            const data = await getMaterialNutrients({ materialId, size: 100 });
            const rows = data.content.map(mn => ({
                nutrientId: mn.nutrientId.toString(),
                amountPer100Unit: mn.amountPer100Unit.toString()
            }));
            setNutrientRows(rows);
        } catch (error) {
            console.error('Failed to load material nutrients:', error);
            // Don't block UI, just log error
        }
    };

    const handleAddNutrient = () => {
        setNutrientRows([...nutrientRows, { nutrientId: '', amountPer100Unit: '' }]);
    };

    const handleRemoveNutrient = (index: number) => {
        const newRows = [...nutrientRows];
        newRows.splice(index, 1);
        setNutrientRows(newRows);
    };

    const handleNutrientChange = (index: number, field: keyof NutrientRow, value: string) => {
        const newRows = [...nutrientRows];
        newRows[index] = { ...newRows[index], [field]: value };
        setNutrientRows(newRows);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.unit.trim() || !formData.materialTypeId) {
            toast.error('❌ Vui lòng điền đầy đủ thông tin chung!');
            setActiveTab('info');
            return;
        }

        const caloriesPerUnit = parseFloat(formData.caloriesPerUnit);
        const threshold = parseFloat(formData.threshold);

        if (isNaN(caloriesPerUnit) || caloriesPerUnit < 0) {
            toast.error('❌ Calo không hợp lệ!');
            setActiveTab('info');
            return;
        }

        if (isNaN(threshold) || threshold < 0) {
            toast.error('❌ Ngưỡng tồn kho không hợp lệ!');
            setActiveTab('info');
            return;
        }

        // Validate Nutrients
        const validNutrients: MaterialNutrientRequest[] = [];
        for (const row of nutrientRows) {
            if (!row.nutrientId) continue; // Skip empty rows
            const amount = parseFloat(row.amountPer100Unit);
            if (isNaN(amount) || amount < 0) {
                toast.error('❌ Hàm lượng dinh dưỡng không hợp lệ!');
                setActiveTab('nutrients');
                return;
            }
            validNutrients.push({
                nutrientId: parseInt(row.nutrientId),
                amountPer100Unit: amount,
                state: 'NEW' // Backend might ignore this or use it
            });
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

            // Save Nutrients
            if (validNutrients.length > 0 || (material && nutrientRows.length === 0)) {
                await updateManyMaterialNutrients(savedMaterialId, validNutrients);
                // toast.success('✅ Cập nhật dinh dưỡng thành công!');
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
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                        <div className="px-6 pt-4 border-b border-[#78A243]/10">
                            <TabsList className="grid w-full grid-cols-2 bg-[#78A243]/10 p-1">
                                <TabsTrigger
                                    value="info"
                                    className="data-[state=active]:bg-white data-[state=active]:text-[#78A243] data-[state=active]:shadow-sm text-[#2D1E1A]/70"
                                >
                                    Thông tin chung
                                </TabsTrigger>
                                <TabsTrigger
                                    value="nutrients"
                                    className="data-[state=active]:bg-white data-[state=active]:text-[#78A243] data-[state=active]:shadow-sm text-[#2D1E1A]/70"
                                >
                                    Thành phần dinh dưỡng
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            <TabsContent value="info" className="mt-0 space-y-6">
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
                                        <Select
                                            value={formData.materialTypeId}
                                            onValueChange={(value) => setFormData({ ...formData, materialTypeId: value })}
                                            disabled={loading}
                                        >
                                            <SelectTrigger className="w-full px-3 py-2 border border-[#78A243]/30 rounded-lg text-sm text-[#2D1E1A] focus:border-[#78A243] focus:ring-1 focus:ring-[#78A243]/20 transition-all outline-none bg-white">
                                                <SelectValue placeholder="Chọn loại" />
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
                                    <div className="space-y-1.5">
                                        <Label htmlFor="unit" className="text-xs font-semibold text-[#2D1E1A] flex items-center gap-1">
                                            Đơn vị <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="unit"
                                            value={formData.unit}
                                            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                            placeholder="VD: gram, kg..."
                                            className="w-full px-3 py-2 border border-[#78A243]/30 rounded-lg text-sm text-[#2D1E1A] focus:border-[#78A243] focus:ring-1 focus:ring-[#78A243]/20 transition-all outline-none"
                                            disabled={loading}
                                        />
                                    </div>

                                    {/* Calo */}
                                    <div className="space-y-1.5">
                                        <Label htmlFor="caloriesPerUnit" className="text-xs font-semibold text-[#2D1E1A] flex items-center gap-1">
                                            Calo / Đơn vị <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="caloriesPerUnit"
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            value={formData.caloriesPerUnit}
                                            onChange={(e) => setFormData({ ...formData, caloriesPerUnit: e.target.value })}
                                            placeholder="VD: 250"
                                            className="w-full px-3 py-2 border border-[#78A243]/30 rounded-lg text-sm text-[#2D1E1A] focus:border-[#78A243] focus:ring-1 focus:ring-[#78A243]/20 transition-all outline-none"
                                            disabled={loading}
                                        />
                                    </div>

                                    {/* Ngưỡng tồn kho */}
                                    <div className="space-y-1.5">
                                        <Label htmlFor="threshold" className="text-xs font-semibold text-[#2D1E1A] flex items-center gap-1">
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
                                            className="w-full px-3 py-2 border border-[#78A243]/30 rounded-lg text-sm text-[#2D1E1A] focus:border-[#78A243] focus:ring-1 focus:ring-[#78A243]/20 transition-all outline-none"
                                            disabled={loading}
                                        />
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="nutrients" className="mt-0 space-y-4">
                                <div className="flex justify-between items-center mb-2">
                                    <Label className="text-sm font-semibold text-[#2D1E1A]">
                                        Danh sách dinh dưỡng (trên 100 {formData.unit || 'đơn vị'})
                                    </Label>
                                    <Button
                                        type="button"
                                        onClick={handleAddNutrient}
                                        variant="outline"
                                        size="sm"
                                        className="text-[#78A243] border-[#78A243]/30 hover:bg-[#78A243]/10"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Thêm dinh dưỡng
                                    </Button>
                                </div>

                                {nutrientRows.length === 0 ? (
                                    <div className="text-center py-8 border-2 border-dashed border-[#78A243]/20 rounded-lg bg-[#78A243]/5">
                                        <p className="text-[#2D1E1A]/60 text-sm">Chưa có thông tin dinh dưỡng</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {nutrientRows.map((row, index) => (
                                            <div key={index} className="flex gap-3 items-start">
                                                <div className="flex-1">
                                                    <Select
                                                        value={row.nutrientId}
                                                        onValueChange={(value) => handleNutrientChange(index, 'nutrientId', value)}
                                                        disabled={loading}
                                                    >
                                                        <SelectTrigger className="w-full px-3 py-2 border border-[#78A243]/30 rounded-lg text-sm text-[#2D1E1A] focus:border-[#78A243] focus:ring-1 focus:ring-[#78A243]/20 transition-all outline-none bg-white">
                                                            <SelectValue placeholder="Chọn chất dinh dưỡng" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {availableNutrients.map((nutrient) => (
                                                                <SelectItem key={nutrient.id} value={nutrient.id.toString()}>
                                                                    {nutrient.name} ({nutrient.unit})
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="w-32">
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        placeholder="Hàm lượng"
                                                        value={row.amountPer100Unit}
                                                        onChange={(e) => handleNutrientChange(index, 'amountPer100Unit', e.target.value)}
                                                        className="w-full px-3 py-2 border border-[#78A243]/30 rounded-lg text-sm text-[#2D1E1A] focus:border-[#78A243] focus:ring-1 focus:ring-[#78A243]/20 transition-all outline-none"
                                                        disabled={loading}
                                                    />
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleRemoveNutrient(index)}
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </TabsContent>
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
                    </Tabs>
                </form>
            </Card>
        </div>
    );
}
