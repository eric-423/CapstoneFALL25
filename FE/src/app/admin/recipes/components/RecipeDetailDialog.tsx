'use client';

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    VisuallyHidden,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Recipe } from '@/utils/types/recipe.types';
import {
    ChefHat,
    Clock,
    DollarSign,
    Flame,
    Users,
    Package,
    AlertTriangle,
    History,
    FileText,
    TrendingUp,
    Edit,
    GitBranch,
} from 'lucide-react';

interface RecipeDetailDialogProps {
    recipe: Recipe | null;
    open: boolean;
    onClose: () => void;
}

export function RecipeDetailDialog({ recipe, open, onClose }: RecipeDetailDialogProps) {
    const [activeTab, setActiveTab] = useState('info');

    if (!recipe) return null;

    // Status badge config
    const getStatusBadge = (status: string) => {
        const config: Record<string, { label: string; className: string }> = {
            published: { label: 'Đã xuất bản', className: 'bg-green-100 text-green-800 border-green-300' },
            qa: { label: 'QA', className: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
            draft: { label: 'Nháp', className: 'bg-gray-100 text-gray-800 border-gray-300' },
            archived: { label: 'Lưu trữ', className: 'bg-gray-200 text-gray-600 border-gray-400' },
        };
        return config[status] || config.draft;
    };

    const statusBadge = getStatusBadge(recipe.status);

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="!max-w-[95vw] !w-[900px] !h-[90vh] overflow-hidden flex flex-col p-0">
                <VisuallyHidden>
                    <DialogTitle>{recipe.name}</DialogTitle>
                </VisuallyHidden>
                {/* Header với gradient đẹp */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 pb-4">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                    <ChefHat size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">{recipe.name}</h2>
                                    {recipe.nameEn && (
                                        <p className="text-orange-100 text-sm italic">{recipe.nameEn}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <Badge className={`${statusBadge.className} border`}>
                                    {statusBadge.label}
                                </Badge>
                                <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                                    {recipe.sku}
                                </Badge>
                                <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                                    v{recipe.currentVersion}
                                </Badge>
                                {recipe.isPopular && (
                                    <Badge className="bg-yellow-400 text-yellow-900 border-yellow-500">
                                        <TrendingUp className="w-3 h-3 mr-1" />
                                        Phổ biến
                                    </Badge>
                                )}
                                {recipe.requiresTraining && (
                                    <Badge className="bg-blue-500 text-white border-blue-600">
                                        📚 Đào tạo
                                    </Badge>
                                )}
                            </div>
                        </div>
                        <Button
                            variant="secondary"
                            size="sm"
                            className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm mr-8"
                        >
                            <Edit className="w-4 h-4 mr-2" />
                            Chỉnh sửa
                        </Button>
                    </div>

                    {/* Quick Stats trong header */}
                    <div className="grid grid-cols-4 gap-3">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-white/90" />
                                <div>
                                    <p className="text-xs text-white/70">Thời gian</p>
                                    <p className="text-lg font-bold text-white">{recipe.totalTimeMinutes}p</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                            <div className="flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-white/90" />
                                <div>
                                    <p className="text-xs text-white/70">Chi phí</p>
                                    <p className="text-lg font-bold text-white">{(recipe.totalCostPerUnit / 1000).toFixed(0)}K</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                            <div className="flex items-center gap-2">
                                <Flame className="w-5 h-5 text-white/90" />
                                <div>
                                    <p className="text-xs text-white/70">Calories</p>
                                    <p className="text-lg font-bold text-white">{recipe.nutrition.caloriesPerServing}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                            <div className="flex items-center gap-2">
                                <Users className="w-5 h-5 text-white/90" />
                                <div>
                                    <p className="text-xs text-white/70">Phần ăn</p>
                                    <p className="text-lg font-bold text-white">{recipe.nutrition.servingsPerRecipe}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                    <TabsList className="flex mx-6 mt-4 bg-gray-100 p-0.5 gap-0.5 w-fit">
                        <TabsTrigger
                            value="info"
                            className="data-[state=active]:!bg-white data-[state=active]:!text-blue-700 data-[state=active]:shadow-sm data-[state=active]:font-semibold transition-all text-sm px-3 py-2"
                        >
                            <FileText className="w-3.5 h-3.5 mr-1.5" />
                            <span>Thông tin</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="bom"
                            className="data-[state=active]:!bg-white data-[state=active]:!text-green-700 data-[state=active]:shadow-sm data-[state=active]:font-semibold transition-all text-sm px-3 py-2"
                        >
                            <Package className="w-3.5 h-3.5 mr-1.5" />
                            <span>BOM ({recipe.bom.length})</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="nutrition"
                            className="data-[state=active]:!bg-white data-[state=active]:!text-orange-700 data-[state=active]:shadow-sm data-[state=active]:font-semibold transition-all text-sm px-3 py-2"
                        >
                            <Flame className="w-3.5 h-3.5 mr-1.5" />
                            <span>Dinh dưỡng</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="versions"
                            className="data-[state=active]:!bg-white data-[state=active]:!text-purple-700 data-[state=active]:shadow-sm data-[state=active]:font-semibold transition-all text-sm px-3 py-2"
                        >
                            <GitBranch className="w-3.5 h-3.5 mr-1.5" />
                            <span>Versions</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="history"
                            className="data-[state=active]:!bg-white data-[state=active]:!text-gray-700 data-[state=active]:shadow-sm data-[state=active]:font-semibold transition-all text-sm px-3 py-2"
                        >
                            <History className="w-3.5 h-3.5 mr-1.5" />
                            <span>Lịch sử</span>
                        </TabsTrigger>
                    </TabsList>

                    <div className="flex-1 overflow-y-auto px-6 pb-6">
                        {/* TAB 1: INFO */}
                        <TabsContent value="info" className="mt-4 space-y-4">
                            {/* Description */}
                            <Card className="bg-gradient-to-br from-orange-50 to-white p-5 border-orange-100">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                                        <span className="text-lg">📝</span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 mb-2">Mô tả món ăn</h3>
                                        <p className="text-gray-700 leading-relaxed">{recipe.description}</p>
                                    </div>
                                </div>
                            </Card>

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                {/* Left Column */}
                                <Card className="bg-gradient-to-br from-blue-50 to-white p-5 border-blue-100">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                            <span className="text-base">⚙️</span>
                                        </div>
                                        <h3 className="font-semibold text-gray-900">Chi tiết công thức</h3>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center py-2.5 border-b border-gray-100">
                                            <span className="text-sm text-gray-600 flex items-center gap-2">
                                                <span className="text-xs">🏷️</span> Danh mục
                                            </span>
                                            <span className="text-sm font-semibold text-gray-900">{recipe.category}</span>
                                        </div>

                                        <div className="flex justify-between items-center py-2.5 border-b border-gray-100">
                                            <span className="text-sm text-gray-600 flex items-center gap-2">
                                                <span className="text-xs">📊</span> Độ khó
                                            </span>
                                            <Badge variant="outline" className="bg-white">{recipe.difficulty}</Badge>
                                        </div>

                                        <div className="flex justify-between items-center py-2.5 border-b border-gray-100">
                                            <span className="text-sm text-gray-600 flex items-center gap-2">
                                                <span className="text-xs">⏱️</span> Chuẩn bị
                                            </span>
                                            <span className="text-sm font-semibold text-blue-600">{recipe.prepTimeMinutes}p</span>
                                        </div>

                                        <div className="flex justify-between items-center py-2.5 border-b border-gray-100">
                                            <span className="text-sm text-gray-600 flex items-center gap-2">
                                                <span className="text-xs">🔥</span> Nấu
                                            </span>
                                            <span className="text-sm font-semibold text-orange-600">{recipe.cookTimeMinutes}p</span>
                                        </div>

                                        {recipe.cuisine && (
                                            <div className="flex justify-between items-center py-2.5 border-b border-gray-100">
                                                <span className="text-sm text-gray-600 flex items-center gap-2">
                                                    <span className="text-xs">🌏</span> Ẩm thực
                                                </span>
                                                <span className="text-sm font-semibold text-gray-900">{recipe.cuisine}</span>
                                            </div>
                                        )}

                                        {recipe.popularityScore && (
                                            <div className="flex justify-between items-center py-2.5 border-b border-gray-100">
                                                <span className="text-sm text-gray-600 flex items-center gap-2">
                                                    <span className="text-xs">🔥</span> Phổ biến
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-orange-500 rounded-full"
                                                            style={{ width: `${recipe.popularityScore}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-sm font-semibold text-orange-600">{recipe.popularityScore}%</span>
                                                </div>
                                            </div>
                                        )}

                                        {recipe.customerRating && (
                                            <div className="flex justify-between items-center py-2.5">
                                                <span className="text-sm text-gray-600 flex items-center gap-2">
                                                    <span className="text-xs">⭐</span> Đánh giá
                                                </span>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-sm font-semibold text-yellow-600">{recipe.customerRating}</span>
                                                    <span className="text-xs text-gray-500">/5</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Card>

                                {/* Right Column */}
                                <Card className="bg-gradient-to-br from-purple-50 to-white p-5 border-purple-100">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                                            <span className="text-base">📌</span>
                                        </div>
                                        <h3 className="font-semibold text-gray-900">Thông tin khác</h3>
                                    </div>

                                    <div className="space-y-3">
                                        {recipe.tags && recipe.tags.length > 0 && (
                                            <div className="py-2 border-b border-gray-100">
                                                <span className="text-sm text-gray-600 block mb-2 flex items-center gap-2">
                                                    <span className="text-xs">🏷️</span> Tags
                                                </span>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {recipe.tags.map((tag) => (
                                                        <Badge key={tag} variant="outline" className="text-xs bg-white hover:bg-purple-50">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {recipe.mealType && recipe.mealType.length > 0 && (
                                            <div className="py-2 border-b border-gray-100">
                                                <span className="text-sm text-gray-600 block mb-2 flex items-center gap-2">
                                                    <span className="text-xs">🍽️</span> Bữa ăn
                                                </span>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {recipe.mealType.map((meal) => (
                                                        <Badge key={meal} variant="outline" className="text-xs bg-white hover:bg-purple-50">
                                                            {meal}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex justify-between items-center py-2.5 border-b border-gray-100">
                                            <span className="text-sm text-gray-600 flex items-center gap-2">
                                                <span className="text-xs">📦</span> Đơn hàng
                                            </span>
                                            <span className="text-sm font-semibold text-purple-600">
                                                {recipe.totalOrders?.toLocaleString() || 0}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center py-2.5 border-b border-gray-100">
                                            <span className="text-sm text-gray-600 flex items-center gap-2">
                                                <span className="text-xs">📅</span> Ngày tạo
                                            </span>
                                            <span className="text-sm font-semibold text-gray-900">
                                                {new Date(recipe.createdAt).toLocaleDateString('vi-VN')}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center py-2.5">
                                            <span className="text-sm text-gray-600 flex items-center gap-2">
                                                <span className="text-xs">🔄</span> Cập nhật
                                            </span>
                                            <span className="text-sm font-semibold text-gray-900">
                                                {new Date(recipe.updatedAt).toLocaleDateString('vi-VN')}
                                            </span>
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            {/* Steps */}
                            {recipe.steps && recipe.steps.length > 0 && (
                                <Card className="bg-gradient-to-br from-green-50 to-white p-5 border-green-100">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                                            <span className="text-base">👨‍🍳</span>
                                        </div>
                                        <h3 className="font-semibold text-gray-900">Các bước thực hiện</h3>
                                    </div>
                                    <div className="space-y-3">
                                        {recipe.steps.map((step) => (
                                            <div key={step.stepNumber} className="flex gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-green-200 transition-colors">
                                                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 text-white rounded-lg flex items-center justify-center font-bold text-sm shadow-sm">
                                                    {step.stepNumber}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-gray-900 mb-1">{step.title}</h4>
                                                    <p className="text-sm text-gray-700 mb-2 leading-relaxed">{step.instruction}</p>
                                                    <div className="flex flex-wrap gap-2 text-xs">
                                                        {step.durationMinutes && (
                                                            <span className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-md">
                                                                <Clock className="w-3 h-3" />
                                                                {step.durationMinutes}p
                                                            </span>
                                                        )}
                                                        {step.temperature && (
                                                            <span className="flex items-center gap-1 px-2 py-1 bg-orange-50 text-orange-700 rounded-md">
                                                                🌡️ {step.temperature}°C
                                                            </span>
                                                        )}
                                                        {step.criticalControlPoint && (
                                                            <Badge className="bg-red-100 text-red-800 text-xs border-red-200">
                                                                <AlertTriangle className="w-3 h-3 mr-1" />
                                                                CCP
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            )}
                        </TabsContent>

                        {/* TAB 2: BOM */}
                        <TabsContent value="bom" className="mt-0">
                            {/* Header with Total Cost */}
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 mb-4 rounded-lg border border-green-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                            <span className="text-lg">📋</span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Bill of Materials</h3>
                                            <p className="text-xs text-gray-600">Danh sách nguyên liệu và chi phí</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-gray-600 mb-1">Tổng chi phí nguyên liệu</div>
                                        <div className="text-2xl font-bold text-green-600">
                                            {recipe.totalIngredientCost.toLocaleString()}đ
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* BOM Table */}
                            <Card className="p-0 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-900">#</th>
                                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-900">Nguyên liệu</th>
                                                <th className="px-4 py-3 text-right text-xs font-bold text-gray-900">Số lượng</th>
                                                <th className="px-4 py-3 text-right text-xs font-bold text-gray-900">Đơn giá</th>
                                                <th className="px-4 py-3 text-right text-xs font-bold text-gray-900">Thành tiền</th>
                                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-900">Ghi chú</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {recipe.bom.map((item, index) => (
                                                <tr key={item.id} className="hover:bg-green-50/50 transition-colors">
                                                    <td className="px-4 py-3 text-sm font-semibold text-gray-600">{index + 1}</td>
                                                    <td className="px-4 py-3">
                                                        <div>
                                                            <div className="font-semibold text-gray-900">{item.ingredientName}</div>
                                                            {item.ingredientSku && (
                                                                <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                                                    <span className="text-[10px]">🏷️</span> SKU: {item.ingredientSku}
                                                                </div>
                                                            )}
                                                            {item.preparationMethod && (
                                                                <div className="text-xs text-blue-600 italic flex items-center gap-1 mt-0.5">
                                                                    <span className="text-[10px]">👨‍🍳</span> {item.preparationMethod}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <span className="font-semibold text-gray-900">
                                                            {item.quantity} <span className="text-xs text-gray-600">{item.unit}</span>
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-right text-sm text-gray-700">
                                                        {item.costPerUnit.toLocaleString()}<span className="text-xs">đ</span>
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <span className="font-bold text-green-600">
                                                            {item.totalCost.toLocaleString()}<span className="text-xs">đ</span>
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm">
                                                        <div className="flex flex-col gap-1">
                                                            {item.isOptional && (
                                                                <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200 w-fit">
                                                                    Tùy chọn
                                                                </Badge>
                                                            )}
                                                            {item.notes && (
                                                                <span className="text-xs text-gray-500">{item.notes}</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="bg-gradient-to-r from-green-50 to-emerald-50 border-t-2 border-green-300">
                                            <tr>
                                                <td colSpan={4} className="px-4 py-4 text-right font-bold text-gray-900">
                                                    Tổng cộng:
                                                </td>
                                                <td className="px-4 py-4 text-right font-bold text-green-600 text-lg">
                                                    {recipe.totalIngredientCost.toLocaleString()}đ
                                                </td>
                                                <td></td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </Card>

                            {/* Cost Breakdown */}
                            <div className="mt-4 p-5 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                        <span className="text-base">💰</span>
                                    </div>
                                    <h4 className="font-semibold text-gray-900">Phân tích chi phí</h4>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="flex justify-between items-center py-2.5 px-3 bg-white rounded-lg border border-blue-100">
                                        <span className="text-sm text-gray-700 flex items-center gap-2">
                                            <span className="text-xs">🥘</span> Nguyên liệu
                                        </span>
                                        <span className="font-semibold text-gray-900">
                                            {recipe.totalIngredientCost.toLocaleString()}đ
                                        </span>
                                    </div>
                                    {recipe.laborCostPerUnit && (
                                        <div className="flex justify-between items-center py-2.5 px-3 bg-white rounded-lg border border-blue-100">
                                            <span className="text-sm text-gray-700 flex items-center gap-2">
                                                <span className="text-xs">👨‍🍳</span> Nhân công
                                            </span>
                                            <span className="font-semibold text-gray-900">
                                                {recipe.laborCostPerUnit.toLocaleString()}đ
                                            </span>
                                        </div>
                                    )}
                                    {recipe.overheadCostPerUnit && (
                                        <div className="flex justify-between items-center py-2.5 px-3 bg-white rounded-lg border border-blue-100">
                                            <span className="text-sm text-gray-700 flex items-center gap-2">
                                                <span className="text-xs">🏢</span> Chi phí chung
                                            </span>
                                            <span className="font-semibold text-gray-900">
                                                {recipe.overheadCostPerUnit.toLocaleString()}đ
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center py-2.5 px-3 bg-red-50 rounded-lg border border-red-200 col-span-2">
                                        <span className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                            <span className="text-base">💵</span> Tổng chi phí
                                        </span>
                                        <span className="font-bold text-red-600 text-lg">
                                            {recipe.totalCostPerUnit.toLocaleString()}đ
                                        </span>
                                    </div>
                                    {recipe.suggestedPrice && (
                                        <>
                                            <div className="flex justify-between items-center py-2.5 px-3 bg-white rounded-lg border border-green-200">
                                                <span className="text-sm text-gray-700 flex items-center gap-2">
                                                    <span className="text-xs">💰</span> Giá bán đề xuất
                                                </span>
                                                <span className="font-semibold text-green-600">
                                                    {recipe.suggestedPrice.toLocaleString()}đ
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center py-2.5 px-3 bg-white rounded-lg border border-green-200">
                                                <span className="text-sm text-gray-700 flex items-center gap-2">
                                                    <span className="text-xs">📈</span> Lợi nhuận
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-green-500 rounded-full"
                                                            style={{ width: `${((recipe.suggestedPrice - recipe.totalCostPerUnit) / recipe.suggestedPrice * 100)}%` }}
                                                        />
                                                    </div>
                                                    <span className="font-semibold text-green-600">
                                                        {((recipe.suggestedPrice - recipe.totalCostPerUnit) / recipe.suggestedPrice * 100).toFixed(1)}%
                                                    </span>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </TabsContent>

                        {/* TAB 3: NUTRITION */}
                        <TabsContent value="nutrition" className="mt-0 space-y-4">
                            {/* Serving Info Header */}
                            <div className="grid grid-cols-2 gap-4">
                                <Card className="bg-gradient-to-br from-orange-50 to-amber-50 p-5 border-orange-200">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                                            <span className="text-2xl">🍽️</span>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600 mb-1">Khẩu phần</p>
                                            <p className="text-xl font-bold text-gray-900">{recipe.nutrition.servingSize}</p>
                                        </div>
                                    </div>
                                </Card>
                                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 border-purple-200">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                                            <span className="text-2xl">👥</span>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600 mb-1">Số phần</p>
                                            <p className="text-xl font-bold text-gray-900">{recipe.nutrition.servingsPerRecipe}</p>
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            {/* Macros Per Serving */}
                            <Card className="p-5 bg-gradient-to-br from-gray-50 to-white">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                                        <Flame className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900">Dinh dưỡng mỗi phần</h3>
                                </div>
                                <div className="grid grid-cols-4 gap-3">
                                    <div className="p-4 bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl border border-orange-200">
                                        <div className="text-center">
                                            <Flame className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                                            <p className="text-2xl font-bold text-orange-600">
                                                {recipe.nutrition.caloriesPerServing}
                                            </p>
                                            <p className="text-xs text-gray-600 font-medium mt-1">Calories</p>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-gradient-to-br from-red-100 to-red-50 rounded-xl border border-red-200">
                                        <div className="text-center">
                                            <span className="text-2xl mb-2 block">🥩</span>
                                            <p className="text-2xl font-bold text-red-600">
                                                {recipe.nutrition.proteinPerServing}<span className="text-sm">g</span>
                                            </p>
                                            <p className="text-xs text-gray-600 font-medium mt-1">Protein</p>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-xl border border-yellow-200">
                                        <div className="text-center">
                                            <span className="text-2xl mb-2 block">🍚</span>
                                            <p className="text-2xl font-bold text-yellow-600">
                                                {recipe.nutrition.carbsPerServing}<span className="text-sm">g</span>
                                            </p>
                                            <p className="text-xs text-gray-600 font-medium mt-1">Carbs</p>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl border border-blue-200">
                                        <div className="text-center">
                                            <span className="text-2xl mb-2 block">🥑</span>
                                            <p className="text-2xl font-bold text-blue-600">
                                                {recipe.nutrition.fatPerServing}<span className="text-sm">g</span>
                                            </p>
                                            <p className="text-xs text-gray-600 font-medium mt-1">Fat</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* Allergens & Dietary */}
                            <div className="grid grid-cols-2 gap-4">
                                <Card className="p-5 bg-gradient-to-br from-red-50 to-white border-red-100">
                                    <div className="flex items-center gap-2 mb-3">
                                        <AlertTriangle className="w-5 h-5 text-red-600" />
                                        <h4 className="font-semibold text-gray-900">Chất gây dị ứng</h4>
                                    </div>
                                    {recipe.nutrition.allergens && recipe.nutrition.allergens.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {recipe.nutrition.allergens.map((allergen) => (
                                                <Badge
                                                    key={allergen}
                                                    className="bg-red-100 text-red-800 border-red-300"
                                                >
                                                    <AlertTriangle className="w-3 h-3 mr-1" />
                                                    {allergen}
                                                </Badge>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500 flex items-center gap-2">
                                            <span className="text-green-600">✓</span> Không có chất gây dị ứng
                                        </p>
                                    )}
                                </Card>

                                <Card className="p-5 bg-gradient-to-br from-green-50 to-white border-green-100">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-lg">✨</span>
                                        <h4 className="font-semibold text-gray-900">Phù hợp cho</h4>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {recipe.nutrition.isVegetarian && (
                                            <Badge className="bg-green-100 text-green-800 border-green-200">
                                                🌱 Chay
                                            </Badge>
                                        )}
                                        {recipe.nutrition.isVegan && (
                                            <Badge className="bg-green-100 text-green-800 border-green-200">
                                                🥬 Thuần chay
                                            </Badge>
                                        )}
                                        {recipe.nutrition.isGlutenFree && (
                                            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                                                🌾 Không gluten
                                            </Badge>
                                        )}
                                        {recipe.nutrition.isHalal && (
                                            <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                                                ☪️ Halal
                                            </Badge>
                                        )}
                                        {!recipe.nutrition.isVegetarian && !recipe.nutrition.isVegan &&
                                            !recipe.nutrition.isGlutenFree && !recipe.nutrition.isHalal && (
                                                <p className="text-sm text-gray-500">Chế độ ăn chung</p>
                                            )}
                                    </div>
                                </Card>
                            </div>

                            {/* Total Nutrition */}
                            <Card className="p-5 bg-gradient-to-br from-indigo-50 to-white border-indigo-100">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                                        <span className="text-base">📊</span>
                                    </div>
                                    <h3 className="font-semibold text-gray-900">Tổng dinh dưỡng (toàn bộ công thức)</h3>
                                </div>
                                <div className="grid grid-cols-4 gap-3">
                                    <div className="text-center p-4 bg-white rounded-lg border border-indigo-100">
                                        <p className="text-2xl font-bold text-indigo-600">
                                            {recipe.nutrition.totalCalories}
                                        </p>
                                        <p className="text-xs text-gray-600 mt-1">Calories</p>
                                    </div>
                                    <div className="text-center p-4 bg-white rounded-lg border border-indigo-100">
                                        <p className="text-2xl font-bold text-indigo-600">
                                            {recipe.nutrition.totalProtein}<span className="text-sm">g</span>
                                        </p>
                                        <p className="text-xs text-gray-600 mt-1">Protein</p>
                                    </div>
                                    <div className="text-center p-4 bg-white rounded-lg border border-indigo-100">
                                        <p className="text-2xl font-bold text-indigo-600">
                                            {recipe.nutrition.totalCarbs}<span className="text-sm">g</span>
                                        </p>
                                        <p className="text-xs text-gray-600 mt-1">Carbs</p>
                                    </div>
                                    <div className="text-center p-4 bg-white rounded-lg border border-indigo-100">
                                        <p className="text-2xl font-bold text-indigo-600">
                                            {recipe.nutrition.totalFat}<span className="text-sm">g</span>
                                        </p>
                                        <p className="text-xs text-gray-600 mt-1">Fat</p>
                                    </div>
                                </div>
                            </Card>
                        </TabsContent>

                        {/* TAB 4: VERSIONS */}
                        <TabsContent value="versions" className="mt-0">
                            <Card className="p-4">
                                <h3 className="font-semibold text-gray-900 mb-4">Lịch sử phiên bản</h3>
                                <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <GitBranch className="w-5 h-5 text-blue-600" />
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">
                                            Phiên bản hiện tại: v{recipe.currentVersion}
                                        </p>
                                        <p className="text-xs text-gray-600">
                                            Cập nhật lần cuối: {new Date(recipe.updatedAt).toLocaleString('vi-VN')}
                                        </p>
                                    </div>
                                </div>

                                {recipe.versions && recipe.versions.length > 0 ? (
                                    <div className="mt-4 space-y-3">
                                        {recipe.versions.map((version) => (
                                            <div
                                                key={version.versionNumber}
                                                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-semibold text-gray-900">
                                                        v{version.versionNumber}
                                                    </span>
                                                    <Badge className={getStatusBadge(version.status).className}>
                                                        {getStatusBadge(version.status).label}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-gray-700 mb-2">{version.changeLog}</p>
                                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                                    <span>Tạo bởi: {version.createdBy}</span>
                                                    <span>
                                                        {new Date(version.createdAt).toLocaleDateString('vi-VN')}
                                                    </span>
                                                    {version.publishedAt && (
                                                        <span className="text-green-600 font-medium">
                                                            ✓ Xuất bản {new Date(version.publishedAt).toLocaleDateString('vi-VN')}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-500 py-8">
                                        Chưa có lịch sử phiên bản
                                    </p>
                                )}
                            </Card>
                        </TabsContent>

                        {/* TAB 5: HISTORY */}
                        <TabsContent value="history" className="mt-0">
                            <Card className="p-4">
                                <h3 className="font-semibold text-gray-900 mb-4">Lịch sử thay đổi</h3>
                                <div className="space-y-3">
                                    <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-gray-900">
                                                Cập nhật công thức
                                            </p>
                                            <p className="text-xs text-gray-600">
                                                {recipe.updatedBy} • {new Date(recipe.updatedAt).toLocaleString('vi-VN')}
                                            </p>
                                        </div>
                                    </div>

                                    {recipe.publishedAt && (
                                        <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                                            <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                            <div className="flex-1">
                                                <p className="text-sm font-semibold text-gray-900">
                                                    Xuất bản công thức
                                                </p>
                                                <p className="text-xs text-gray-600">
                                                    {new Date(recipe.publishedAt).toLocaleString('vi-VN')}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="flex-shrink-0 w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-gray-900">
                                                Tạo công thức
                                            </p>
                                            <p className="text-xs text-gray-600">
                                                {recipe.createdBy} • {new Date(recipe.createdAt).toLocaleString('vi-VN')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </TabsContent>
                    </div>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
