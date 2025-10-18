'use client';

import React, { useState, useMemo } from 'react';
import {
    Package,
    Plus,
    AlertTriangle,
    DollarSign,
    TrendingDown,
    Factory,
    Barcode,
    FileText,
} from 'lucide-react';
import { FilterBar, FilterChip, SavedFilter } from '@/components/common/FilterBar';
import { DataTable, Column } from '@/components/common/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Ingredient } from '@/utils/types/ingredient.types';
import { MOCK_INGREDIENTS_ENHANCED } from '@/utils/mocks/data/ingredients-enhanced.mock';
import { IngredientDetailDialog } from './components/IngredientDetailDialog';

export default function IngredientsPage() {
    const [searchValue, setSearchValue] = useState('');
    const [filters, setFilters] = useState<FilterChip[]>([]);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
    const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);

    // Saved filters
    const savedFilters: SavedFilter[] = [
        {
            id: '1',
            name: 'Low Stock Items',
            filters: [{ id: 'status', label: 'Trạng thái', value: 'low_stock' }],
        },
        {
            id: '2',
            name: 'Frozen Items',
            filters: [{ id: 'storage', label: 'Bảo quản', value: 'frozen' }],
        },
    ];

    // Filter data
    const filteredIngredients = useMemo(() => {
        return MOCK_INGREDIENTS_ENHANCED.filter((ingredient) => {
            const matchesSearch =
                searchValue === '' ||
                ingredient.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                ingredient.sku?.toLowerCase().includes(searchValue.toLowerCase()) ||
                ingredient.barcode?.includes(searchValue);

            const matchesFilters = filters.every((filter) => {
                if (filter.id === 'category') return ingredient.category === filter.value;
                if (filter.id === 'status') return ingredient.status === filter.value;
                if (filter.id === 'storage') return ingredient.storageCondition === filter.value;
                return true;
            });

            return matchesSearch && matchesFilters;
        });
    }, [searchValue, filters]);

    // Stats
    const stats = useMemo(() => ({
        total: MOCK_INGREDIENTS_ENHANCED.length,
        active: MOCK_INGREDIENTS_ENHANCED.filter((i) => i.status === 'active').length,
        lowStock: MOCK_INGREDIENTS_ENHANCED.filter((i) => i.status === 'low_stock').length,
        totalValue: MOCK_INGREDIENTS_ENHANCED.reduce((sum, i) => sum + i.costPerUnit, 0),
    }), []);

    // Define columns
    const columns: Column<Ingredient>[] = [
        {
            id: 'name',
            header: 'Nguyên liệu',
            accessor: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold">
                        {row.name.charAt(0)}
                    </div>
                    <div>
                        <div className="font-semibold text-gray-900">{row.name}</div>
                        {row.sku && <div className="text-xs text-gray-500">SKU: {row.sku}</div>}
                    </div>
                </div>
            ),
            sortable: true,
            minWidth: 250,
        },
        {
            id: 'category',
            header: 'Danh mục',
            accessor: (row) => {
                const categoryConfig: Record<string, { label: string; className: string }> = {
                    meat: { label: 'Thịt', className: 'bg-red-100 text-red-800 border-red-300' },
                    seafood: { label: 'Hải sản', className: 'bg-blue-100 text-blue-800 border-blue-300' },
                    vegetable: { label: 'Rau củ', className: 'bg-green-100 text-green-800 border-green-300' },
                    dairy: { label: 'Sữa', className: 'bg-purple-100 text-purple-800 border-purple-300' },
                    grain: { label: 'Ngũ cốc', className: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
                    spice: { label: 'Gia vị', className: 'bg-orange-100 text-orange-800 border-orange-300' },
                    sauce: { label: 'Nước sốt', className: 'bg-pink-100 text-pink-800 border-pink-300' },
                };
                const config = categoryConfig[row.category] || {
                    label: row.category,
                    className: 'bg-gray-100 text-gray-800',
                };
                return (
                    <Badge className={`${config.className} border font-semibold`}>{config.label}</Badge>
                );
            },
            sortable: true,
        },
        {
            id: 'baseUnit',
            header: 'Đơn vị',
            accessor: 'baseUnit',
            sortable: true,
        },
        {
            id: 'storageCondition',
            header: 'Bảo quản',
            accessor: (row) => {
                const storageIcons: Record<string, string> = {
                    frozen: '❄️ Đông lạnh',
                    refrigerated: '🧊 Làm lạnh',
                    cool: '🌡️ Mát',
                    room_temp: '📦 Nhiệt độ phòng',
                    dry: '🌾 Khô ráo',
                };
                return (
                    <span className="text-sm text-gray-700">
                        {storageIcons[row.storageCondition] || row.storageCondition}
                    </span>
                );
            },
        },
        {
            id: 'costPerUnit',
            header: 'Giá/Đơn vị',
            accessor: (row) => (
                <div className="text-right">
                    <span className="font-semibold text-green-600">
                        {row.costPerUnit.toLocaleString()}đ
                    </span>
                    <div className="text-xs text-gray-500">/{row.baseUnit}</div>
                </div>
            ),
            sortable: true,
        },
        {
            id: 'supplier',
            header: 'Nhà cung cấp',
            accessor: (row) => (
                <div className="text-sm">
                    {row.primarySupplier ? (
                        <span className="text-gray-700 flex items-center gap-1">
                            <Factory className="w-3 h-3" />
                            {row.primarySupplier.name.split(' ').slice(0, 3).join(' ')}
                        </span>
                    ) : (
                        <span className="text-gray-400 italic">Chưa có</span>
                    )}
                </div>
            ),
        },
        {
            id: 'status',
            header: 'Trạng thái',
            accessor: (row) => {
                const statusConfig: Record<string, { label: string; className: string; icon: string }> = {
                    active: { label: 'Hoạt động', className: 'bg-green-100 text-green-800', icon: '✓' },
                    low_stock: { label: 'Sắp hết', className: 'bg-yellow-100 text-yellow-800', icon: '⚠️' },
                    out_of_stock: { label: 'Hết hàng', className: 'bg-red-100 text-red-800', icon: '✕' },
                    discontinued: { label: 'Ngừng', className: 'bg-gray-100 text-gray-800', icon: '○' },
                };
                const config = statusConfig[row.status];
                return (
                    <Badge className={config.className}>
                        <span className="mr-1">{config.icon}</span>
                        {config.label}
                    </Badge>
                );
            },
            sortable: true,
        },
        {
            id: 'actions',
            header: 'Thao tác',
            accessor: (row) => (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        setSelectedIngredient(row);
                        setDetailDialogOpen(true);
                    }}
                    className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                    style={{ color: '#ea580c', fontWeight: '600' }}
                >
                    <FileText className="h-4 w-4 mr-1" />
                    Chi tiết
                </Button>
            ),
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
        console.log('Export ingredients:', filteredIngredients);
    };

    const handleBulkDelete = (ids: string[]) => {
        console.log('Delete ingredients:', ids);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Package className="text-orange-600" size={32} />
                        Quản lý nguyên liệu
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Theo dõi tồn kho, nhà cung cấp và lô hàng nguyên liệu
                    </p>
                </div>
                <Button className="bg-gradient-to-r from-orange-500 to-orange-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm nguyên liệu
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4 bg-gradient-to-br from-orange-50 to-white border-orange-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 font-medium">Tổng nguyên liệu</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                        </div>
                        <Package className="w-10 h-10 text-orange-500 opacity-80" />
                    </div>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-green-50 to-white border-green-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 font-medium">Đang hoạt động</p>
                            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                        </div>
                        <TrendingDown className="w-10 h-10 text-green-500 opacity-80" />
                    </div>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-yellow-50 to-white border-yellow-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 font-medium">Cảnh báo sắp hết</p>
                            <p className="text-2xl font-bold text-yellow-600">{stats.lowStock}</p>
                        </div>
                        <AlertTriangle className="w-10 h-10 text-yellow-500 opacity-80" />
                    </div>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-blue-50 to-white border-blue-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 font-medium">Tổng giá trị</p>
                            <p className="text-2xl font-bold text-blue-600">
                                {(stats.totalValue / 1000000).toFixed(1)}M
                            </p>
                        </div>
                        <DollarSign className="w-10 h-10 text-blue-500 opacity-80" />
                    </div>
                </Card>
            </div>

            {/* FilterBar */}
            <FilterBar
                searchPlaceholder="Tìm kiếm theo tên, SKU, barcode..."
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
                            <Barcode className="h-4 w-4 mr-2" />
                            Quét mã
                        </Button>
                        <Button variant="outline" size="sm" style={{ color: '#000000', fontWeight: '600' }}>
                            <FileText className="h-4 w-4 mr-2" />
                            Báo cáo
                        </Button>
                    </>
                }
            />

            {/* Advanced Filters */}
            {showAdvanced && (
                <Card className="p-4 bg-white">
                    <h3 className="font-semibold mb-4 text-gray-900">Bộ lọc nâng cao</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="text-sm font-bold mb-2 block text-gray-950">Danh mục</label>
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
                                <option value="meat">Thịt</option>
                                <option value="seafood">Hải sản</option>
                                <option value="vegetable">Rau củ</option>
                                <option value="dairy">Sữa</option>
                                <option value="grain">Ngũ cốc</option>
                                <option value="spice">Gia vị</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-bold mb-2 block text-gray-950">Trạng thái</label>
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
                                <option value="active">Hoạt động</option>
                                <option value="low_stock">Sắp hết</option>
                                <option value="out_of_stock">Hết hàng</option>
                                <option value="discontinued">Ngừng</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-bold mb-2 block text-gray-950">Bảo quản</label>
                            <select
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-950 font-semibold bg-white"
                                onChange={(e) => {
                                    if (e.target.value) {
                                        setFilters([
                                            ...filters.filter((f) => f.id !== 'storage'),
                                            { id: 'storage', label: 'Bảo quản', value: e.target.value },
                                        ]);
                                    }
                                }}
                            >
                                <option value="">Tất cả</option>
                                <option value="frozen">Đông lạnh</option>
                                <option value="refrigerated">Làm lạnh</option>
                                <option value="cool">Mát</option>
                                <option value="room_temp">Nhiệt độ phòng</option>
                                <option value="dry">Khô ráo</option>
                            </select>
                        </div>
                    </div>
                </Card>
            )}

            {/* DataTable */}
            <DataTable
                data={filteredIngredients}
                columns={columns}
                selectable
                onSelectionChange={setSelectedIngredients}
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
                    title: 'Không tìm thấy nguyên liệu',
                    description: 'Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác',
                    icon: <Package className="h-16 w-16 text-gray-400" />,
                    action: (
                        <Button className="bg-gradient-to-r from-orange-500 to-orange-600">
                            <Plus className="h-4 w-4 mr-2" />
                            Thêm nguyên liệu mới
                        </Button>
                    ),
                }}
                stickyHeader
            />

            {/* Detail Dialog */}
            <IngredientDetailDialog
                ingredient={selectedIngredient}
                open={detailDialogOpen}
                onClose={() => {
                    setDetailDialogOpen(false);
                    setSelectedIngredient(null);
                }}
            />
        </div>
    );
}
