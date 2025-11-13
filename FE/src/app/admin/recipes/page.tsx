'use client';

import React, { useState, useMemo } from 'react';
import {
    ChefHat,
    Plus,
    FileText,
    BookOpen,
    DollarSign
} from 'lucide-react';
import { FilterBar, FilterChip, SavedFilter } from '@/components/common/FilterBar';
import { DataTable, Column } from '@/components/common/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Recipe } from '@/utils/types/recipe.types';
import { RecipeDetailDialog } from './components/RecipeDetailDialog';
import { AdminPageLayout, AdminPageHeader, AdminStatsCard, AdminStatsGrid } from '../components/AdminPageLayout';

// Temporary empty array until API is implemented
const MOCK_RECIPES: Recipe[] = [];

export default function RecipesPage() {
    const [searchValue, setSearchValue] = useState('');
    const [filters, setFilters] = useState<FilterChip[]>([]);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [selectedRecipes, setSelectedRecipes] = useState<string[]>([]);
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);

    // Debug: Log state changes
    React.useEffect(() => {
        console.log('selectedRecipe:', selectedRecipe);
        console.log('detailDialogOpen:', detailDialogOpen);
    }, [selectedRecipe, detailDialogOpen]);

    // Saved filters
    const savedFilters: SavedFilter[] = [
        {
            id: '1',
            name: 'Popular Main Dishes',
            filters: [
                { id: 'category', label: 'Danh mục', value: 'main' },
                { id: 'status', label: 'Trạng thái', value: 'published' },
            ],
        },
        {
            id: '2',
            name: 'Draft Recipes',
            filters: [{ id: 'status', label: 'Trạng thái', value: 'draft' }],
        },
    ];

    // Filter data
    const filteredRecipes = useMemo(() => {
        return MOCK_RECIPES.filter((recipe) => {
            const matchesSearch =
                searchValue === '' ||
                recipe.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                recipe.sku?.toLowerCase().includes(searchValue.toLowerCase()) ||
                recipe.nameEn?.toLowerCase().includes(searchValue.toLowerCase());

            const matchesFilters = filters.every((filter) => {
                if (filter.id === 'category') return recipe.category === filter.value;
                if (filter.id === 'status') return recipe.status === filter.value;
                if (filter.id === 'difficulty') return recipe.difficulty === filter.value;
                return true;
            });

            return matchesSearch && matchesFilters;
        });
    }, [searchValue, filters]);

    // Stats
    const stats = useMemo(
        () => ({
            total: MOCK_RECIPES.length,
            published: MOCK_RECIPES.filter((r) => r.status === 'published').length,
            draft: MOCK_RECIPES.filter((r) => r.status === 'draft').length,
            avgCost: Math.round(
                MOCK_RECIPES.reduce((sum, r) => sum + r.totalCostPerUnit, 0) / MOCK_RECIPES.length
            ),
        }),
        []
    );

    // Define columns - Tối ưu cho màn hình
    const columns: Column<Recipe>[] = [
        {
            id: 'name',
            header: 'Công thức',
            accessor: (row) => (
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        {row.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                        <div style={{ color: '#000000', fontWeight: '600' }} className="truncate">
                            {row.name}
                        </div>
                        <div className="text-xs text-gray-500">SKU: {row.sku}</div>
                    </div>
                </div>
            ),
            sortable: true,
            minWidth: 200,
        },
        {
            id: 'category',
            header: 'Danh mục',
            accessor: (row) => {
                const categoryConfig: Record<string, { label: string; className: string }> = {
                    main: { label: 'Món chính', className: 'bg-blue-100 text-blue-800' },
                    appetizer: { label: 'Khai vị', className: 'bg-green-100 text-green-800' },
                    side: { label: 'Món phụ', className: 'bg-purple-100 text-purple-800' },
                    dessert: { label: 'Tráng miệng', className: 'bg-pink-100 text-pink-800' },
                    beverage: { label: 'Đồ uống', className: 'bg-yellow-100 text-yellow-800' },
                    sauce: { label: 'Nước sốt', className: 'bg-orange-100 text-orange-800' },
                    combo: { label: 'Combo', className: 'bg-red-100 text-red-800' },
                };
                const config = categoryConfig[row.category] || { label: row.category, className: 'bg-gray-100 text-gray-800' };
                return <Badge className={`${config.className} text-xs`}>{config.label}</Badge>;
            },
            sortable: true,
            minWidth: 100,
        },
        {
            id: 'bom',
            header: 'BOM',
            accessor: (row) => (
                <div className="text-sm text-center">
                    <span style={{ color: '#1a1a1a', fontWeight: '600' }}>
                        {row.bom.length}
                    </span>
                    <div className="text-xs text-gray-500">nguyên liệu</div>
                </div>
            ),
            minWidth: 80,
        },
        {
            id: 'cost',
            header: 'Chi phí',
            accessor: (row) => (
                <div className="text-right">
                    <div style={{ color: '#1a1a1a', fontWeight: '600' }} className="text-sm">
                        {row.totalCostPerUnit.toLocaleString()}đ
                    </div>
                    {row.suggestedPrice && (
                        <div className="text-xs text-gray-500">
                            Bán: {row.suggestedPrice.toLocaleString()}đ
                        </div>
                    )}
                </div>
            ),
            sortable: true,
            minWidth: 120,
        },
        {
            id: 'status',
            header: 'Trạng thái',
            accessor: (row) => {
                const statusConfig: Record<string, { label: string; className: string; icon: string }> = {
                    published: { label: 'Xuất bản', className: 'bg-green-100 text-green-800', icon: '✓' },
                    qa: { label: 'QA', className: 'bg-yellow-100 text-yellow-800', icon: '⏱' },
                    draft: { label: 'Nháp', className: 'bg-gray-100 text-gray-800', icon: '○' },
                    archived: { label: 'Lưu trữ', className: 'bg-gray-200 text-gray-600', icon: '■' },
                };
                const config = statusConfig[row.status];
                return (
                    <Badge className={`${config.className} text-xs`}>
                        <span className="mr-1">{config.icon}</span>
                        {config.label}
                    </Badge>
                );
            },
            sortable: true,
            minWidth: 90,
        },
        {
            id: 'actions',
            header: 'Thao tác',
            accessor: (row) => (
                <div onClick={(e) => e.stopPropagation()}>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('Button clicked, recipe:', row.name);
                            setSelectedRecipe(row);
                            setDetailDialogOpen(true);
                        }}
                        className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                        style={{ color: '#ea580c', fontWeight: '600' }}
                    >
                        <FileText className="h-3 w-3 mr-1" />
                        Xem
                    </Button>
                </div>
            ),
            minWidth: 80,
        },
    ];

    const handleRemoveFilter = (filterId: string) => {
        setFilters(filters.filter((f) => f.id !== filterId));
    };

    const handleClearAll = () => {
        setSearchValue('');
        setFilters([]);
    };

    const handleApplySavedFilter = (filter: SavedFilter) => {
        setFilters(filter.filters);
    };

    const handleSaveFilter = (name: string) => {
        console.log('Save filter:', name, filters);
    };

    const handleExport = () => {
        console.log('Export recipes:', filteredRecipes);
    };

    const handleBulkDelete = (ids: string[]) => {
        console.log('Delete recipes:', ids);
    };

    return (
        <AdminPageLayout>
            {/* Header */}
            <AdminPageHeader
                title="Quản lý công thức món ăn"
                description="Quản lý BOM, chi phí, dinh dưỡng và versioning"
                icon={ChefHat}
                actions={
                    <Button className="bg-gradient-to-r from-[#EC6426] to-[#F8A91F] hover:from-[#EC6426]/90 hover:to-[#F8A91F]/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold text-sm sm:text-base">
                        <Plus className="h-4 w-4 mr-2" />
                        Tạo công thức mới
                    </Button>
                }
            />

            {/* Stats Cards */}
            <AdminStatsGrid>
                <AdminStatsCard
                    title="Tổng công thức"
                    value={stats.total}
                    icon={ChefHat}
                />
                <AdminStatsCard
                    title="Đã xuất bản"
                    value={stats.published}
                    icon={BookOpen}
                    className="border-green-200"
                    iconClassName="from-green-400 to-green-600"
                />
                <AdminStatsCard
                    title="Đang soạn thảo"
                    value={stats.draft}
                    icon={FileText}
                    className="border-yellow-200"
                    iconClassName="from-yellow-400 to-yellow-600"
                />
                <AdminStatsCard
                    title="Chi phí TB"
                    value={`${(stats.avgCost / 1000).toFixed(0)}K`}
                    icon={DollarSign}
                    className="border-blue-200"
                    iconClassName="from-blue-400 to-blue-600"
                />
            </AdminStatsGrid>

            {/* FilterBar */}
            <div className="w-full">
                <FilterBar
                searchPlaceholder="Tìm kiếm theo tên, SKU..."
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                filters={filters}
                onRemoveFilter={handleRemoveFilter}
                onClearAll={handleClearAll}
                savedFilters={savedFilters}
                onApplySavedFilter={handleApplySavedFilter}
                onSaveCurrentFilter={handleSaveFilter}
                showAdvancedFilters={showAdvanced}
                onToggleAdvancedFilters={() => setShowAdvanced(!showAdvanced)}
                customActions={
                    <>
                        <Button variant="outline" size="sm" style={{ color: '#000000', fontWeight: '600' }}>
                            <BookOpen className="h-4 w-4 mr-2" />
                            Import
                        </Button>
                        <Button variant="outline" size="sm" style={{ color: '#000000', fontWeight: '600' }}>
                            <FileText className="h-4 w-4 mr-2" />
                            Báo cáo chi phí
                        </Button>
                    </>
                }
                />
            </div>

            {/* Advanced Filters */}
            {showAdvanced && (
                <Card className="p-4 bg-white">
                    <h3 className="font-semibold mb-4 text-gray-900">Bộ lọc nâng cao</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="text-sm font-bold mb-2 block text-gray-950">
                                Danh mục
                            </label>
                            <select
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-950 font-semibold bg-white"
                                onChange={(e) => {
                                    if (e.target.value) {
                                        setFilters([
                                            ...filters.filter((f) => f.id !== 'category'),
                                            { id: 'category', label: 'Danh mục', value: e.target.value },
                                        ]);
                                    }
                                }}
                            >
                                <option value="">Tất cả</option>
                                <option value="main">Món chính</option>
                                <option value="appetizer">Khai vị</option>
                                <option value="side">Món phụ</option>
                                <option value="dessert">Tráng miệng</option>
                                <option value="beverage">Đồ uống</option>
                                <option value="sauce">Nước sốt</option>
                                <option value="combo">Combo</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-bold mb-2 block text-gray-950">
                                Trạng thái
                            </label>
                            <select
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-950 font-semibold bg-white"
                                onChange={(e) => {
                                    if (e.target.value) {
                                        setFilters([
                                            ...filters.filter((f) => f.id !== 'status'),
                                            { id: 'status', label: 'Trạng thái', value: e.target.value },
                                        ]);
                                    }
                                }}
                            >
                                <option value="">Tất cả</option>
                                <option value="published">Đã xuất bản</option>
                                <option value="qa">QA</option>
                                <option value="draft">Nháp</option>
                                <option value="archived">Lưu trữ</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-bold mb-2 block text-gray-950">
                                Độ khó
                            </label>
                            <select
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-950 font-semibold bg-white"
                                onChange={(e) => {
                                    if (e.target.value) {
                                        setFilters([
                                            ...filters.filter((f) => f.id !== 'difficulty'),
                                            { id: 'difficulty', label: 'Độ khó', value: e.target.value },
                                        ]);
                                    }
                                }}
                            >
                                <option value="">Tất cả</option>
                                <option value="easy">Dễ</option>
                                <option value="medium">Trung bình</option>
                                <option value="hard">Khó</option>
                            </select>
                        </div>
                    </div>
                </Card>
            )}

            {/* DataTable */}
            <DataTable
                data={filteredRecipes}
                columns={columns}
                selectable
                onSelectionChange={setSelectedRecipes}
                getRowId={(row) => row.id}
                defaultSort={{ columnId: 'name', direction: 'asc' }}
                pagination={{
                    pageSize: 10,
                    pageSizeOptions: [10, 25, 50, 100],
                }}
                actions={{
                    onExport: handleExport,
                    onDelete: handleBulkDelete,
                }}
                emptyState={{
                    title: 'Không tìm thấy công thức',
                    description: 'Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác',
                    icon: <ChefHat className="h-16 w-16 text-gray-400" />,
                    action: (
                        <Button className="bg-gradient-to-r from-orange-500 to-orange-600">
                            <Plus className="h-4 w-4 mr-2" />
                            Tạo công thức mới
                        </Button>
                    ),
                }}
                stickyHeader
            />

            {/* Detail Dialog */}
            <RecipeDetailDialog
                recipe={selectedRecipe}
                open={detailDialogOpen}
                onClose={() => {
                    setDetailDialogOpen(false);
                    setSelectedRecipe(null);
                }}
            />
        </AdminPageLayout>
    );
}
