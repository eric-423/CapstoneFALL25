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
                <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                        <div className="px-6 pt-4">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="info">Thông tin chung</TabsTrigger>
                                <TabsTrigger value="nutrients">Thành phần dinh dưỡng</TabsTrigger>
                            </TabsList>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            <TabsContent value="info" className="mt-0 space-y-6">
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
                                    <div>
                                        <Label htmlFor="unit" className="text-sm font-semibold text-gray-700">
                                            Đơn vị <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="unit"
                                            value={formData.unit}
                                            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                            placeholder="VD: gram, kg..."
                                            className="mt-2"
                                            disabled={loading}
                                        />
                                    </div>

                                    {/* Calo */}
                                    <div>
                                        <Label htmlFor="caloriesPerUnit" className="text-sm font-semibold text-gray-700">
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
                            </TabsContent>

                            <TabsContent value="nutrients" className="mt-0 space-y-4">
                                <div className="flex justify-between items-center mb-2">
                                    <Label className="text-sm font-semibold text-gray-700">
                                        Danh sách dinh dưỡng (trên 100 {formData.unit || 'đơn vị'})
                                    </Label>
                                    <Button
                                        type="button"
                                        onClick={handleAddNutrient}
                                        variant="outline"
                                        size="sm"
                                        className="text-orange-600 border-orange-200 hover:bg-orange-50"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Thêm dinh dưỡng
                                    </Button>
                                </div>

                                {nutrientRows.length === 0 ? (
                                    <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                                        <p className="text-gray-500 text-sm">Chưa có thông tin dinh dưỡng</p>
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
                                                        <SelectTrigger>
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
                        <div className="p-6 bg-gray-50 border-t border-gray-200 flex gap-3 justify-end mt-auto">
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
                    </Tabs>
                </form>
            </Card>
        </div>
    );
}