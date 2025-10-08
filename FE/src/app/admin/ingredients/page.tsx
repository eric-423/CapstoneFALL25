'use client';

import { AdminGuard } from '@/components/guards';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MOCK_INGREDIENTS } from '@/mocks/data/ingredient.mock';
import { Ingredient } from '@/types/ingredient.type';
import {
    Package,
    Plus,
    Search,
    Edit,
    Trash2,
    AlertTriangle,
    TrendingDown,
    Download,
    Upload,
    Calendar,
    DollarSign,
    Weight,
    Factory,
} from 'lucide-react';
import { useState } from 'react';

export default function IngredientsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const filteredIngredients = MOCK_INGREDIENTS.filter((ing) => {
        const matchesSearch = ing.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || ing.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const lowStockIngredients = MOCK_INGREDIENTS.filter((ing) => ing.quantity <= ing.threshold);
    const totalValue = MOCK_INGREDIENTS.reduce((sum, ing) => sum + ing.quantity * ing.cost, 0);

    const categories = [
        { value: 'all', label: 'Tất cả', count: MOCK_INGREDIENTS.length },
        { value: 'meat', label: 'Thịt', count: MOCK_INGREDIENTS.filter((i) => i.category === 'meat').length },
        { value: 'seafood', label: 'Hải sản', count: MOCK_INGREDIENTS.filter((i) => i.category === 'seafood').length },
        { value: 'vegetable', label: 'Rau củ', count: MOCK_INGREDIENTS.filter((i) => i.category === 'vegetable').length },
        { value: 'grain', label: 'Ngũ cốc', count: MOCK_INGREDIENTS.filter((i) => i.category === 'grain').length },
        { value: 'dairy', label: 'Sữa', count: MOCK_INGREDIENTS.filter((i) => i.category === 'dairy').length },
        { value: 'spice', label: 'Gia vị', count: MOCK_INGREDIENTS.filter((i) => i.category === 'spice').length },
    ];

    const getCategoryColor = (category: Ingredient['category']) => {
        const colors = {
            meat: 'from-red-500 to-pink-500',
            seafood: 'from-blue-500 to-cyan-500',
            vegetable: 'from-green-500 to-emerald-500',
            grain: 'from-yellow-500 to-orange-500',
            dairy: 'from-purple-500 to-indigo-500',
            spice: 'from-orange-500 to-red-500',
            other: 'from-gray-500 to-slate-500',
        };
        return colors[category];
    };

    return (
        <AdminGuard>
            <div className="min-h-screen bg-[#f9fafb] py-8">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg">
                                        <Package className="text-white" size={28} strokeWidth={2.5} />
                                    </div>
                                    Quản Lý Nguyên Liệu
                                </h1>
                                <p className="text-gray-600 text-lg">Theo dõi và quản lý kho nguyên liệu</p>
                            </div>
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    className="border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white font-semibold rounded-xl transition-all"
                                >
                                    <Download size={18} className="mr-2" strokeWidth={2.5} />
                                    Xuất Excel
                                </Button>
                                <Button
                                    variant="outline"
                                    className="border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-semibold rounded-xl transition-all"
                                >
                                    <Upload size={18} className="mr-2" strokeWidth={2.5} />
                                    Nhập Excel
                                </Button>
                                <Button className="bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all">
                                    <Plus size={18} className="mr-2" strokeWidth={2.5} />
                                    Thêm nguyên liệu
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <Card className="p-6 bg-white border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                                        Tổng nguyên liệu
                                    </p>
                                    <p className="text-4xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                                        {MOCK_INGREDIENTS.length}
                                    </p>
                                </div>
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all">
                                    <Package className="text-white" size={26} strokeWidth={2.5} />
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 bg-white border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                                        Cảnh báo hết hàng
                                    </p>
                                    <p className="text-4xl font-bold text-red-600 group-hover:scale-105 transition-transform">
                                        {lowStockIngredients.length}
                                    </p>
                                </div>
                                <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all">
                                    <AlertTriangle className="text-white" size={26} strokeWidth={2.5} />
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 bg-white border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                                        Tổng giá trị
                                    </p>
                                    <p className="text-3xl font-bold text-green-600 group-hover:scale-105 transition-transform">
                                        {(totalValue / 1000000).toFixed(1)}M
                                    </p>
                                </div>
                                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all">
                                    <DollarSign className="text-white" size={26} strokeWidth={2.5} />
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 bg-white border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                                        Danh mục
                                    </p>
                                    <p className="text-4xl font-bold text-purple-600 group-hover:scale-105 transition-transform">
                                        {categories.length - 1}
                                    </p>
                                </div>
                                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all">
                                    <Package className="text-white" size={26} strokeWidth={2.5} />
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Search and Filter */}
                    <div className="mb-8 flex flex-col lg:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                                size={20}
                                strokeWidth={2.5}
                            />
                            <Input
                                placeholder="Tìm kiếm nguyên liệu..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 py-6 border-2 border-gray-200 rounded-xl focus:border-primary text-base"
                            />
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {categories.map((cat) => (
                                <Button
                                    key={cat.value}
                                    onClick={() => setSelectedCategory(cat.value)}
                                    variant={selectedCategory === cat.value ? 'default' : 'outline'}
                                    className={`rounded-xl font-semibold whitespace-nowrap transition-all ${selectedCategory === cat.value
                                            ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                                            : 'border-2 border-gray-200 text-gray-600 hover:border-primary'
                                        }`}
                                >
                                    {cat.label}
                                    <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-white/20">
                                        {cat.count}
                                    </span>
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Low Stock Alert */}
                    {lowStockIngredients.length > 0 && (
                        <Card className="p-6 mb-8 bg-gradient-to-r from-red-50 to-transparent border-2 border-red-200 rounded-2xl">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                                    <AlertTriangle className="text-white" size={24} strokeWidth={2.5} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-red-900 mb-2">
                                        Cảnh báo: {lowStockIngredients.length} nguyên liệu sắp hết hàng
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {lowStockIngredients.map((ing) => (
                                            <span
                                                key={ing.id}
                                                className="px-3 py-1.5 bg-white rounded-lg text-sm font-semibold text-red-700 border border-red-200"
                                            >
                                                {ing.name}: {ing.quantity} {ing.unit}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Ingredients Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredIngredients.map((ingredient) => {
                            const isLowStock = ingredient.quantity <= ingredient.threshold;
                            const stockPercentage = (ingredient.quantity / (ingredient.threshold * 2)) * 100;

                            return (
                                <Card
                                    key={ingredient.id}
                                    className="bg-white border-0 shadow-sm hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden group"
                                >
                                    {/* Category Badge */}
                                    <div className={`h-2 bg-gradient-to-r ${getCategoryColor(ingredient.category)}`}></div>

                                    <div className="p-6">
                                        {/* Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                                                    {ingredient.name}
                                                </h3>
                                                <p className="text-sm text-gray-500 font-medium flex items-center gap-1">
                                                    <Factory size={14} strokeWidth={2.5} />
                                                    {ingredient.supplier}
                                                </p>
                                            </div>
                                            {isLowStock && (
                                                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center animate-pulse">
                                                    <TrendingDown className="text-white" size={20} strokeWidth={2.5} />
                                                </div>
                                            )}
                                        </div>

                                        {/* Stock Info */}
                                        <div className="mb-4 p-4 bg-gradient-to-br from-gray-50 to-transparent rounded-xl border border-gray-100">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                    Tồn kho
                                                </span>
                                                <span className={`text-2xl font-bold ${isLowStock ? 'text-red-600' : 'text-gray-900'}`}>
                                                    {ingredient.quantity} {ingredient.unit}
                                                </span>
                                            </div>
                                            <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ${isLowStock
                                                            ? 'bg-gradient-to-r from-red-500 to-pink-500'
                                                            : 'bg-gradient-to-r from-green-500 to-emerald-500'
                                                        }`}
                                                    style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                                                />
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1.5">
                                                Ngưỡng tối thiểu: {ingredient.threshold} {ingredient.unit}
                                            </p>
                                        </div>

                                        {/* Details */}
                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600 font-medium flex items-center gap-1">
                                                    <Weight size={14} strokeWidth={2.5} />
                                                    Calo/100g:
                                                </span>
                                                <span className="font-bold text-gray-900">{ingredient.caloriePerUnit} kcal</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600 font-medium flex items-center gap-1">
                                                    <DollarSign size={14} strokeWidth={2.5} />
                                                    Giá/{ingredient.unit}:
                                                </span>
                                                <span className="font-bold text-green-600">
                                                    {ingredient.cost.toLocaleString()}đ
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600 font-medium flex items-center gap-1">
                                                    <Calendar size={14} strokeWidth={2.5} />
                                                    Cập nhật:
                                                </span>
                                                <span className="font-medium text-gray-700">
                                                    {new Date(ingredient.lastUpdated).toLocaleDateString('vi-VN')}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2 pt-4 border-t-2 border-gray-100">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1 border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold rounded-xl transition-all"
                                            >
                                                <Edit size={16} className="mr-1" strokeWidth={2.5} />
                                                Sửa
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-semibold rounded-xl transition-all"
                                            >
                                                <Trash2 size={16} className="mr-1" strokeWidth={2.5} />
                                                Xóa
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </div>
        </AdminGuard>
    );
}
