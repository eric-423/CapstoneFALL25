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
import { BookOpen, Clock, Users, Plus, X, DollarSign, Flame } from 'lucide-react';
import { toast } from 'react-toastify';

// Mock data - Nguyên liệu từ hệ thống
const AVAILABLE_INGREDIENTS = [
    { id: '1', name: 'Thịt gà', unit: 'g', caloriesPer100g: 165 },
    { id: '2', name: 'Thịt bò', unit: 'g', caloriesPer100g: 250 },
    { id: '3', name: 'Cá hồi', unit: 'g', caloriesPer100g: 206 },
    { id: '4', name: 'Rau cải', unit: 'g', caloriesPer100g: 23 },
    { id: '5', name: 'Cà chua', unit: 'g', caloriesPer100g: 18 },
    { id: '6', name: 'Hành tây', unit: 'g', caloriesPer100g: 40 },
    { id: '7', name: 'Tỏi', unit: 'g', caloriesPer100g: 149 },
    { id: '8', name: 'Gạo', unit: 'g', caloriesPer100g: 130 },
    { id: '9', name: 'Dầu ăn', unit: 'ml', caloriesPer100g: 884 },
    { id: '10', name: 'Nước mắm', unit: 'ml', caloriesPer100g: 35 },
];

interface Ingredient {
    ingredientId: string;
    ingredientName: string;
    quantity: string;
    unit: string;
    caloriesPer100g: number;
    estimatedCalories: number;
}

interface RecipeFormData {
    name: string;
    description: string;
    prepTime: string;
    cookTime: string;
    servings: string;
    difficulty: string;
    price: string;
    caloriesAfterCooking: string;
    ingredients: Ingredient[];
    instructions: string[];
}

const DIFFICULTY_OPTIONS = [
    { value: 'EASY', label: 'Dễ', icon: '😊', color: 'from-green-500 to-green-600' },
    { value: 'MEDIUM', label: 'Trung bình', icon: '😐', color: 'from-yellow-500 to-yellow-600' },
    { value: 'HARD', label: 'Khó', icon: '😰', color: 'from-red-500 to-red-600' },
];

export function AddRecipeDialog() {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<RecipeFormData>({
        name: '',
        description: '',
        prepTime: '',
        cookTime: '',
        servings: '',
        difficulty: 'EASY',
        price: '',
        caloriesAfterCooking: '',
        ingredients: [{
            ingredientId: '',
            ingredientName: '',
            quantity: '',
            unit: 'g',
            caloriesPer100g: 0,
            estimatedCalories: 0,
        }],
        instructions: [''],
    });

    const [errors, setErrors] = useState<any>({});

    const validateForm = () => {
        const newErrors: any = {};

        if (!formData.name.trim()) newErrors.name = 'Vui lòng nhập tên công thức';
        if (!formData.description.trim()) newErrors.description = 'Vui lòng nhập mô tả';
        if (!formData.prepTime) newErrors.prepTime = 'Vui lòng nhập thời gian chuẩn bị';
        if (!formData.cookTime) newErrors.cookTime = 'Vui lòng nhập thời gian nấu';
        if (!formData.servings) newErrors.servings = 'Vui lòng nhập số người ăn';

        if (!formData.caloriesAfterCooking.trim()) {
            newErrors.caloriesAfterCooking = 'Vui lòng nhập calo sau chế biến';
        } else if (isNaN(Number(formData.caloriesAfterCooking)) || Number(formData.caloriesAfterCooking) < 0) {
            newErrors.caloriesAfterCooking = 'Calo phải là số không âm';
        }

        if (!formData.price.trim()) {
            newErrors.price = 'Vui lòng nhập giá bán';
        } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
            newErrors.price = 'Giá phải là số dương';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        setTimeout(() => {
            const recipeName = formData.name;

            toast.success(
                <div>
                    <div className="font-bold mb-2">✅ Thêm công thức "{recipeName}" thành công!</div>
                    <div className="text-sm text-gray-600 mb-3">
                        Bạn có muốn tạo khóa đào tạo cho món này không?
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                toast.dismiss();
                                // TODO: Mở dialog AddTrainingDialog với recipe name prefilled
                                window.location.href = '/admin/training'; // Temporary redirect
                            }}
                            className="px-3 py-1.5 bg-orange-500 text-white rounded-md hover:bg-orange-600 text-sm font-medium"
                        >
                            Tạo khóa đào tạo
                        </button>
                        <button
                            onClick={() => toast.dismiss()}
                            className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm font-medium"
                        >
                            Để sau
                        </button>
                    </div>
                </div>,
                {
                    autoClose: false,
                    closeButton: true,
                }
            );

            setOpen(false);
            resetForm();
            setIsLoading(false);
        }, 1000);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            prepTime: '',
            cookTime: '',
            servings: '',
            difficulty: 'EASY',
            price: '',
            caloriesAfterCooking: '',
            ingredients: [{
                ingredientId: '',
                ingredientName: '',
                quantity: '',
                unit: 'g',
                caloriesPer100g: 0,
                estimatedCalories: 0,
            }],
            instructions: [''],
        });
        setErrors({});
    };

    const addIngredient = () => {
        setFormData(prev => ({
            ...prev,
            ingredients: [...prev.ingredients, {
                ingredientId: '',
                ingredientName: '',
                quantity: '',
                unit: 'g',
                caloriesPer100g: 0,
                estimatedCalories: 0,
            }]
        }));
    };

    const removeIngredient = (index: number) => {
        if (formData.ingredients.length > 1) {
            setFormData(prev => ({
                ...prev,
                ingredients: prev.ingredients.filter((_, i) => i !== index)
            }));
        }
    };

    const updateIngredient = (index: number, field: keyof Ingredient, value: string | number) => {
        setFormData(prev => {
            const newIngredients = prev.ingredients.map((ing, i) => {
                if (i !== index) return ing;

                const updated = { ...ing, [field]: value };

                // Nếu thay đổi ingredientId, cập nhật thông tin nguyên liệu
                if (field === 'ingredientId') {
                    const selectedIngredient = AVAILABLE_INGREDIENTS.find(item => item.id === value);
                    if (selectedIngredient) {
                        updated.ingredientName = selectedIngredient.name;
                        updated.unit = selectedIngredient.unit;
                        updated.caloriesPer100g = selectedIngredient.caloriesPer100g;
                    }
                }

                // Tính toán calo ước tính khi thay đổi số lượng
                if (field === 'quantity' || field === 'ingredientId') {
                    const quantity = field === 'quantity' ? Number(value) : Number(updated.quantity);
                    updated.estimatedCalories = Math.round((quantity * updated.caloriesPer100g) / 100);
                }

                return updated;
            });

            return { ...prev, ingredients: newIngredients };
        });
    };

    // Tính tổng calo của công thức (trước khi chế biến)
    const totalCaloriesBeforeCooking = formData.ingredients.reduce(
        (sum, ing) => sum + (ing.estimatedCalories || 0),
        0
    );

    const addInstruction = () => {
        setFormData(prev => ({
            ...prev,
            instructions: [...prev.instructions, '']
        }));
    };

    const removeInstruction = (index: number) => {
        if (formData.instructions.length > 1) {
            setFormData(prev => ({
                ...prev,
                instructions: prev.instructions.filter((_, i) => i !== index)
            }));
        }
    };

    const updateInstruction = (index: number, value: string) => {
        setFormData(prev => ({
            ...prev,
            instructions: prev.instructions.map((inst, i) =>
                i === index ? value : inst
            )
        }));
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all px-6 py-6 text-base">
                    <Plus size={20} className="mr-2" />
                    Thêm công thức
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] max-h-[95vh] overflow-y-auto bg-white border-0 shadow-2xl">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                            <BookOpen className="text-white" size={24} />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-bold text-gray-900">Thêm công thức mới</DialogTitle>
                            <p className="text-sm text-gray-600 mt-1">Tạo công thức nấu ăn mới</p>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5 mt-4">
                    {/* Recipe Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <BookOpen size={16} className="text-orange-500" />
                            Tên công thức <span className="text-red-500">*</span>
                        </label>
                        <Input
                            placeholder="Phở bò, Bún chả, Cơm tấm..."
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className={`h-11 border-2 ${errors.name ? 'border-red-400' : 'border-gray-200'} focus:border-orange-500 focus:ring-orange-500/20 focus:ring-4 transition-all`}
                        />
                        {errors.name && <p className="text-xs text-red-600 font-medium">{errors.name}</p>}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">
                            Mô tả <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            placeholder="Mô tả ngắn gọn về món ăn..."
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            rows={3}
                            className={`w-full px-3 py-2 rounded-md border-2 ${errors.description ? 'border-red-400' : 'border-gray-200'} focus:border-orange-500 focus:ring-orange-500/20 focus:ring-4 outline-none transition-all`}
                        />
                        {errors.description && <p className="text-xs text-red-600 font-medium">{errors.description}</p>}
                    </div>

                    {/* Time and Servings */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Clock size={16} className="text-orange-500" />
                                Thời gian chuẩn bị (phút)
                            </label>
                            <Input
                                type="number"
                                placeholder="30"
                                value={formData.prepTime}
                                onChange={(e) => setFormData(prev => ({ ...prev, prepTime: e.target.value }))}
                                className="h-11 border-2 border-gray-200 focus:border-orange-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Clock size={16} className="text-orange-500" />
                                Thời gian nấu (phút)
                            </label>
                            <Input
                                type="number"
                                placeholder="45"
                                value={formData.cookTime}
                                onChange={(e) => setFormData(prev => ({ ...prev, cookTime: e.target.value }))}
                                className="h-11 border-2 border-gray-200 focus:border-orange-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Users size={16} className="text-orange-500" />
                                Số người ăn
                            </label>
                            <Input
                                type="number"
                                placeholder="4"
                                value={formData.servings}
                                onChange={(e) => setFormData(prev => ({ ...prev, servings: e.target.value }))}
                                className="h-11 border-2 border-gray-200 focus:border-orange-500"
                            />
                        </div>
                    </div>

                    {/* Difficulty */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Độ khó</label>
                        <div className="grid grid-cols-3 gap-3">
                            {DIFFICULTY_OPTIONS.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, difficulty: option.value }))}
                                    className={`p-3 rounded-xl border-2 transition-all ${formData.difficulty === option.value
                                            ? `bg-gradient-to-br ${option.color} text-white border-transparent shadow-lg`
                                            : 'bg-white border-gray-200 hover:border-orange-300'
                                        }`}
                                >
                                    <div className="text-2xl mb-1">{option.icon}</div>
                                    <div className={`text-sm font-bold ${formData.difficulty === option.value ? 'text-white' : 'text-gray-700'}`}>
                                        {option.label}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Ingredients */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-semibold text-gray-700">Nguyên liệu</label>
                            <Button type="button" size="sm" onClick={addIngredient} variant="outline" className="text-orange-600 border-orange-600">
                                <Plus size={16} className="mr-1" /> Thêm
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {formData.ingredients.map((ingredient, index) => (
                                <div key={index} className="p-3 border-2 border-gray-200 rounded-lg space-y-2">
                                    <div className="flex gap-2">
                                        <select
                                            value={ingredient.ingredientId}
                                            onChange={(e) => updateIngredient(index, 'ingredientId', e.target.value)}
                                            className="flex-1 h-10 px-3 rounded-md border-2 border-gray-200 focus:border-orange-500 outline-none text-gray-900 font-medium"
                                        >
                                            <option value="">-- Chọn nguyên liệu --</option>
                                            {AVAILABLE_INGREDIENTS.map((item) => (
                                                <option key={item.id} value={item.id} className="text-gray-900">
                                                    {item.name} ({item.unit})
                                                </option>
                                            ))}
                                        </select>
                                        <Input
                                            type="number"
                                            placeholder="Số lượng"
                                            value={ingredient.quantity}
                                            onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
                                            className="w-28"
                                        />
                                        {formData.ingredients.length > 1 && (
                                            <Button type="button" size="sm" variant="outline" onClick={() => removeIngredient(index)} className="text-red-600">
                                                <X size={16} />
                                            </Button>
                                        )}
                                    </div>
                                    {ingredient.ingredientId && ingredient.quantity && (
                                        <div className="flex items-center gap-2 text-xs text-gray-600 bg-orange-50 px-3 py-2 rounded-md">
                                            <Flame size={14} className="text-orange-500" />
                                            <span>
                                                <strong>{ingredient.ingredientName}</strong>: {ingredient.quantity}{ingredient.unit} ≈ <strong className="text-orange-600">{ingredient.estimatedCalories} calo</strong>
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Tổng calo trước khi chế biến */}
                        {totalCaloriesBeforeCooking > 0 && (
                            <div className="p-3 bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-200 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Flame size={18} className="text-orange-500" />
                                        <span className="text-sm font-semibold text-gray-700">Tổng calo (trước chế biến):</span>
                                    </div>
                                    <span className="text-lg font-bold text-orange-600">{totalCaloriesBeforeCooking} calo</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Instructions */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-semibold text-gray-700">Các bước thực hiện</label>
                            <Button type="button" size="sm" onClick={addInstruction} variant="outline" className="text-orange-600 border-orange-600">
                                <Plus size={16} className="mr-1" /> Thêm
                            </Button>
                        </div>
                        <div className="space-y-2">
                            {formData.instructions.map((instruction, index) => (
                                <div key={index} className="flex gap-2">
                                    <span className="w-8 h-10 flex items-center justify-center bg-orange-100 text-orange-600 font-bold rounded-md text-sm">
                                        {index + 1}
                                    </span>
                                    <Input
                                        placeholder={`Bước ${index + 1}`}
                                        value={instruction}
                                        onChange={(e) => updateInstruction(index, e.target.value)}
                                        className="flex-1"
                                    />
                                    {formData.instructions.length > 1 && (
                                        <Button type="button" size="sm" variant="outline" onClick={() => removeInstruction(index)} className="text-red-600">
                                            <X size={16} />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Calories After Cooking and Price */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Flame size={16} className="text-orange-500" />
                                Calo sau chế biến <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="number"
                                placeholder="Nhập calo sau chế biến..."
                                value={formData.caloriesAfterCooking}
                                onChange={(e) => setFormData(prev => ({ ...prev, caloriesAfterCooking: e.target.value }))}
                                className={`h-11 border-2 ${errors.caloriesAfterCooking ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-orange-500'} focus:ring-orange-500/20 focus:ring-4 transition-all`}
                            />
                            {errors.caloriesAfterCooking && <p className="text-xs text-red-600 font-medium">{errors.caloriesAfterCooking}</p>}
                            <p className="text-xs text-gray-500">Calo có thể thay đổi sau khi nấu do mất nước, dầu...</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <DollarSign size={16} className="text-orange-500" />
                                Giá bán (VNĐ) <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="number"
                                placeholder="Nhập giá bán..."
                                value={formData.price}
                                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                                className={`h-11 border-2 ${errors.price ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-orange-500'} focus:ring-orange-500/20 focus:ring-4 transition-all`}
                            />
                            {errors.price && <p className="text-xs text-red-600 font-medium">{errors.price}</p>}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setOpen(false);
                                resetForm();
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
                                    Thêm công thức
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
