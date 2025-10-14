'use client';

import { AdminGuard } from '@/components/guards';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MOCK_RECIPES } from '@/utils/mocks/data/recipe.mock';
import { Recipe } from '@/utils/types/recipe.type';
import {
    BookOpen,
    Plus,
    Search,
    Edit,
    Trash2,
    Clock,
    Users,
    Flame,
    DollarSign,
    GraduationCap,
    ChefHat,
    Star,
} from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function RecipesPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const filteredRecipes = MOCK_RECIPES.filter((recipe) => {
        const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const totalRecipes = MOCK_RECIPES.length;
    const avgCalories = Math.round(
        MOCK_RECIPES.reduce((sum, r) => sum + r.totalCalories, 0) / MOCK_RECIPES.length
    );
    const withTraining = MOCK_RECIPES.filter((r) => r.hasTrainingCourse).length;

    const categories = [
        { value: 'all', label: 'Tất cả', count: MOCK_RECIPES.length },
        { value: 'main', label: 'Món chính', count: MOCK_RECIPES.filter((r) => r.category === 'main').length },
        {
            value: 'appetizer',
            label: 'Khai vị',
            count: MOCK_RECIPES.filter((r) => r.category === 'appetizer').length,
        },
        { value: 'dessert', label: 'Tráng miệng', count: MOCK_RECIPES.filter((r) => r.category === 'dessert').length },
        { value: 'drink', label: 'Đồ uống', count: MOCK_RECIPES.filter((r) => r.category === 'drink').length },
        { value: 'side', label: 'Món phụ', count: MOCK_RECIPES.filter((r) => r.category === 'side').length },
    ];

    const getDifficultyColor = (difficulty: Recipe['difficulty']) => {
        const colors = {
            easy: 'from-green-500 to-emerald-500',
            medium: 'from-yellow-500 to-orange-500',
            hard: 'from-red-500 to-pink-500',
        };
        return colors[difficulty];
    };

    const getDifficultyText = (difficulty: Recipe['difficulty']) => {
        const text = {
            easy: 'Dễ',
            medium: 'Trung bình',
            hard: 'Khó',
        };
        return text[difficulty];
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
                                        <BookOpen className="text-white" size={28} strokeWidth={2.5} />
                                    </div>
                                    Quản Lý Công Thức
                                </h1>
                                <p className="text-gray-600 text-lg">Tạo và quản lý công thức món ăn</p>
                            </div>
                            <Button className="bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all">
                                <Plus size={18} className="mr-2" strokeWidth={2.5} />
                                Tạo công thức mới
                            </Button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Card className="p-6 bg-white border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                                        Tổng công thức
                                    </p>
                                    <p className="text-4xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                                        {totalRecipes}
                                    </p>
                                </div>
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all">
                                    <BookOpen className="text-white" size={26} strokeWidth={2.5} />
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 bg-white border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                                        Calo trung bình
                                    </p>
                                    <p className="text-4xl font-bold text-orange-600 group-hover:scale-105 transition-transform">
                                        {avgCalories}
                                    </p>
                                </div>
                                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all">
                                    <Flame className="text-white" size={26} strokeWidth={2.5} />
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 bg-white border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                                        Có khóa đào tạo
                                    </p>
                                    <p className="text-4xl font-bold text-green-600 group-hover:scale-105 transition-transform">
                                        {withTraining}
                                    </p>
                                </div>
                                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all">
                                    <GraduationCap className="text-white" size={26} strokeWidth={2.5} />
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
                                placeholder="Tìm kiếm công thức..."
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
                                    <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-white/20">{cat.count}</span>
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Recipes Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredRecipes.map((recipe) => (
                            <Card
                                key={recipe.id}
                                className="bg-white border-0 shadow-sm hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden group"
                            >
                                {/* Difficulty Badge */}
                                <div className={`h-2 bg-gradient-to-r ${getDifficultyColor(recipe.difficulty)}`}></div>

                                {/* Image */}
                                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                                    {recipe.image ? (
                                        <Image src={recipe.image} alt={recipe.name} fill className="object-cover" />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <ChefHat size={48} className="text-gray-400" strokeWidth={1.5} />
                                        </div>
                                    )}
                                    {recipe.hasTrainingCourse && (
                                        <div className="absolute top-3 right-3 px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white text-xs font-bold shadow-lg flex items-center gap-1">
                                            <GraduationCap size={14} strokeWidth={2.5} />
                                            Có đào tạo
                                        </div>
                                    )}
                                </div>

                                <div className="p-6">
                                    {/* Header */}
                                    <div className="mb-4">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                                            {recipe.name}
                                        </h3>
                                        <p className="text-sm text-gray-600 line-clamp-2">{recipe.description}</p>
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div className="p-3 bg-gradient-to-br from-orange-50 to-transparent rounded-xl border border-orange-100">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Flame size={16} className="text-orange-500" strokeWidth={2.5} />
                                                <span className="text-xs font-bold text-gray-500 uppercase">Calo</span>
                                            </div>
                                            <p className="text-lg font-bold text-orange-600">{recipe.totalCalories}</p>
                                        </div>
                                        <div className="p-3 bg-gradient-to-br from-blue-50 to-transparent rounded-xl border border-blue-100">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Clock size={16} className="text-blue-500" strokeWidth={2.5} />
                                                <span className="text-xs font-bold text-gray-500 uppercase">Thời gian</span>
                                            </div>
                                            <p className="text-lg font-bold text-blue-600">{recipe.prepTime}p</p>
                                        </div>
                                        <div className="p-3 bg-gradient-to-br from-green-50 to-transparent rounded-xl border border-green-100">
                                            <div className="flex items-center gap-2 mb-1">
                                                <DollarSign size={16} className="text-green-500" strokeWidth={2.5} />
                                                <span className="text-xs font-bold text-gray-500 uppercase">Giá</span>
                                            </div>
                                            <p className="text-lg font-bold text-green-600">{recipe.price.toLocaleString()}đ</p>
                                        </div>
                                        <div className="p-3 bg-gradient-to-br from-purple-50 to-transparent rounded-xl border border-purple-100">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Users size={16} className="text-purple-500" strokeWidth={2.5} />
                                                <span className="text-xs font-bold text-gray-500 uppercase">Phần ăn</span>
                                            </div>
                                            <p className="text-lg font-bold text-purple-600">{recipe.servingSize}</p>
                                        </div>
                                    </div>

                                    {/* Difficulty Badge */}
                                    <div className="mb-4 flex items-center justify-between">
                                        <span
                                            className={`px-4 py-2 bg-gradient-to-r ${getDifficultyColor(
                                                recipe.difficulty
                                            )} text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5`}
                                        >
                                            <Star size={14} strokeWidth={2.5} />
                                            {getDifficultyText(recipe.difficulty)}
                                        </span>
                                        <span className="text-xs text-gray-500 font-medium">
                                            {recipe.ingredients.length} nguyên liệu
                                        </span>
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
                                        {!recipe.hasTrainingCourse && (
                                            <Button
                                                size="sm"
                                                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                                                onClick={() => router.push(`/admin/training/create?recipeId=${recipe.id}`)}
                                            >
                                                <GraduationCap size={16} className="mr-1" strokeWidth={2.5} />
                                                Tạo khóa học
                                            </Button>
                                        )}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-semibold rounded-xl transition-all"
                                        >
                                            <Trash2 size={16} strokeWidth={2.5} />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </AdminGuard>
    );
}
