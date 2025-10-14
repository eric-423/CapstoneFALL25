'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Package, Hash, DollarSign, Plus } from 'lucide-react';
import { toast } from 'react-toastify';

interface IngredientFormData {
    name: string;
    unit: string;
    quantity: string;
    caloriesPer100g: string;
    supplier: string;
    minStock: string;
}

const UNIT_OPTIONS = ['kg', 'g', 'lít', 'ml', 'cái', 'gói', 'hộp', 'lon'];

export function AddIngredientDialog() {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<IngredientFormData>({
        name: '',
        unit: 'kg',
        quantity: '',
        caloriesPer100g: '',
        supplier: '',
        minStock: '',
    });

    const [errors, setErrors] = useState<Partial<IngredientFormData>>({});

    const validateForm = () => {
        const newErrors: Partial<IngredientFormData> = {};

        if (!formData.name.trim()) newErrors.name = 'Vui lòng nhập tên nguyên liệu';
        if (!formData.supplier.trim()) newErrors.supplier = 'Vui lòng nhập nguồn cung';
        if (!formData.quantity.trim()) {
            newErrors.quantity = 'Vui lòng nhập số lượng';
        } else if (isNaN(Number(formData.quantity)) || Number(formData.quantity) <= 0) {
            newErrors.quantity = 'Số lượng phải là số dương';
        }
        if (!formData.caloriesPer100g.trim()) {
            newErrors.caloriesPer100g = 'Vui lòng nhập calo/100g';
        } else if (isNaN(Number(formData.caloriesPer100g)) || Number(formData.caloriesPer100g) < 0) {
            newErrors.caloriesPer100g = 'Calo phải là số không âm';
        }
        if (!formData.minStock.trim()) {
            newErrors.minStock = 'Vui lòng nhập mức tồn kho tối thiểu';
        } else if (isNaN(Number(formData.minStock)) || Number(formData.minStock) < 0) {
            newErrors.minStock = 'Mức tồn kho phải là số không âm';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        setTimeout(() => {
            toast.success('✅ Thêm nguyên liệu thành công!');
            setOpen(false);
            setFormData({
                name: '',
                unit: 'kg',
                quantity: '',
                caloriesPer100g: '',
                supplier: '',
                minStock: '',
            });
            setErrors({});
            setIsLoading(false);
        }, 1000);
    };

    const handleInputChange = (field: keyof IngredientFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all px-6 py-6 text-base">
                    <Plus size={20} className="mr-2" />
                    Thêm nguyên liệu
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[95vh] overflow-y-auto bg-white border-0 shadow-2xl">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Package className="text-white" size={24} />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-bold text-gray-900">Thêm nguyên liệu mới</DialogTitle>
                            <p className="text-sm text-gray-600 mt-1">Thêm nguyên liệu vào kho hàng</p>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5 mt-4">
                    {/* Ingredient Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Package size={16} className="text-orange-500" />
                            Tên nguyên liệu <span className="text-red-500">*</span>
                        </label>
                        <Input
                            placeholder="Thịt heo, Rau cải, Dầu ăn..."
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className={`h-11 border-2 ${errors.name ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-orange-500'} focus:ring-orange-500/20 focus:ring-4 transition-all`}
                        />
                        {errors.name && <p className="text-xs text-red-600 font-medium">{errors.name}</p>}
                    </div>

                    {/* Supplier */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Package size={16} className="text-orange-500" />
                            Nguồn cung cấp <span className="text-red-500">*</span>
                        </label>
                        <Input
                            placeholder="Nhà cung cấp ABC, Công ty XYZ..."
                            value={formData.supplier}
                            onChange={(e) => handleInputChange('supplier', e.target.value)}
                            className={`h-11 border-2 ${errors.supplier ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-orange-500'} focus:ring-orange-500/20 focus:ring-4 transition-all`}
                        />
                        {errors.supplier && <p className="text-xs text-red-600 font-medium">{errors.supplier}</p>}
                    </div>

                    {/* Unit and Quantity */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Hash size={16} className="text-orange-500" />
                                Đơn vị <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.unit}
                                onChange={(e) => handleInputChange('unit', e.target.value)}
                                className="w-full h-11 px-3 rounded-md border-2 border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 focus:ring-4 outline-none transition-all bg-white text-gray-900 font-medium"
                            >
                                {UNIT_OPTIONS.map((unit) => (
                                    <option key={unit} value={unit} className="text-gray-900">
                                        {unit}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Hash size={16} className="text-orange-500" />
                                Số lượng <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="number"
                                placeholder="100"
                                value={formData.quantity}
                                onChange={(e) => handleInputChange('quantity', e.target.value)}
                                className={`h-11 border-2 ${errors.quantity ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-orange-500'} focus:ring-orange-500/20 focus:ring-4 transition-all`}
                            />
                            {errors.quantity && <p className="text-xs text-red-600 font-medium">{errors.quantity}</p>}
                        </div>
                    </div>

                    {/* Calories per 100g */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Hash size={16} className="text-orange-500" />
                            Calo/100g <span className="text-red-500">*</span>
                        </label>
                        <Input
                            type="number"
                            placeholder="120"
                            value={formData.caloriesPer100g}
                            onChange={(e) => handleInputChange('caloriesPer100g', e.target.value)}
                            className={`h-11 border-2 ${errors.caloriesPer100g ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-orange-500'} focus:ring-orange-500/20 focus:ring-4 transition-all`}
                        />
                        {errors.caloriesPer100g && <p className="text-xs text-red-600 font-medium">{errors.caloriesPer100g}</p>}
                        <p className="text-xs text-gray-500">Số lượng calo trong 100g nguyên liệu</p>
                    </div>

                    {/* Min Stock */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Package size={16} className="text-orange-500" />
                            Mức tồn kho tối thiểu <span className="text-red-500">*</span>
                        </label>
                        <Input
                            type="number"
                            placeholder="10"
                            value={formData.minStock}
                            onChange={(e) => handleInputChange('minStock', e.target.value)}
                            className={`h-11 border-2 ${errors.minStock ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-orange-500'} focus:ring-orange-500/20 focus:ring-4 transition-all`}
                        />
                        {errors.minStock && <p className="text-xs text-red-600 font-medium">{errors.minStock}</p>}
                        <p className="text-xs text-gray-500">Hệ thống sẽ cảnh báo khi số lượng xuống dưới mức này</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setOpen(false);
                                setFormData({
                                    name: '',
                                    unit: 'kg',
                                    quantity: '',
                                    caloriesPer100g: '',
                                    supplier: '',
                                    minStock: '',
                                });
                                setErrors({});
                            }}
                            disabled={isLoading}
                            className="flex-1 h-11 border-2 border-gray-300 bg-white !text-gray-900 hover:!bg-gray-100 hover:!text-gray-900 font-semibold"
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 h-11 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all font-semibold"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Đang xử lý...
                                </>
                            ) : (
                                <>
                                    <Plus size={18} className="mr-2" />
                                    Thêm nguyên liệu
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
