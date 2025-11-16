'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    Package,
    Plus,
    Edit2,
    Trash2,
    Search,
    Filter,
    X,
    Calendar,
    DollarSign,
    Store,
    CheckCircle,
    XCircle,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AdminPageLayout, AdminPageHeader, AdminStatsCard, AdminStatsGrid } from '../components/AdminPageLayout';
import { searchCombos, deleteCombo, getComboById, type Combo, type ComboSearchParams, type ComboDetail } from '@/apis/combo.api';
import { useAdminContext } from '@/utils/contexts/AdminContext';
import { ComboFormDialog } from './components/ComboFormDialog';

export default function CombosManagementPage() {
    const { branches } = useAdminContext();
    const [combos, setCombos] = useState<Combo[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useState<ComboSearchParams>({
        page: 0,
        size: 20,
        sortBy: 'name',
        sortDirection: 'ASC',
    });
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [keyword, setKeyword] = useState('');
    const [selectedBranchId, setSelectedBranchId] = useState<number | undefined>();
    const [showFilters, setShowFilters] = useState(false);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [activeFilter, setActiveFilter] = useState<boolean | undefined>();

    // Dialog states
    const [showDialog, setShowDialog] = useState(false);
    const [editingCombo, setEditingCombo] = useState<ComboDetail | null>(null);
    const [loadingComboDetail, setLoadingComboDetail] = useState(false);

    const fetchCombos = useCallback(async () => {
        try {
            setLoading(true);
            const params: ComboSearchParams = {
                ...searchParams,
                keyword: keyword || undefined,
                branchId: selectedBranchId,
                isActive: activeFilter,
                minPrice: minPrice ? parseFloat(minPrice) : undefined,
                maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
            };
            const data = await searchCombos(params);
            setCombos(data.content);
            setTotalElements(data.totalElements);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Failed to fetch combos:', error);
        } finally {
            setLoading(false);
        }
    }, [searchParams, keyword, selectedBranchId, activeFilter, minPrice, maxPrice]);

    useEffect(() => {
        fetchCombos();
    }, [fetchCombos]);

    const handleDelete = async (comboId: number, comboName: string) => {
        if (!confirm(`Bạn có chắc muốn xóa combo "${comboName}"?`)) return;

        try {
            await deleteCombo(comboId);
            toast.success(`Đã xóa combo "${comboName}" thành công!`);
            await fetchCombos();
        } catch (error) {
            console.error('Failed to delete combo:', error);
            toast.error('Không thể xóa combo. Vui lòng thử lại!');
        }
    };

    const handleSearch = () => {
        setSearchParams(prev => ({ ...prev, page: 0 }));
    };

    const handleClearFilters = () => {
        setKeyword('');
        setSelectedBranchId(undefined);
        setActiveFilter(undefined);
        setMinPrice('');
        setMaxPrice('');
        setSearchParams({
            page: 0,
            size: 20,
            sortBy: 'name',
            sortDirection: 'ASC',
        });
    };

    const handleCreateCombo = () => {
        setEditingCombo(null);
        setShowDialog(true);
    };

    const handleEditCombo = async (combo: Combo) => {
        try {
            setLoadingComboDetail(true);
            const comboDetail = await getComboById(combo.comboId);
            setEditingCombo(comboDetail);
            setShowDialog(true);
        } catch (error) {
            console.error('Failed to fetch combo detail:', error);
            toast.error('Không thể tải thông tin combo!');
        } finally {
            setLoadingComboDetail(false);
        }
    };

    const handleDialogSuccess = () => {
        fetchCombos();
    };

    const stats = {
        total: totalElements,
        active: combos.filter(c => c.active).length,
        inactive: combos.filter(c => !c.active).length,
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    return (
        <AdminPageLayout>
            {/* Header */}
            <AdminPageHeader
                title="Quản lý Combo"
                description="Quản lý các combo sản phẩm và ưu đãi"
                icon={Package}
                actions={
                    <Button
                        onClick={handleCreateCombo}
                        className="bg-gradient-to-r from-[#EC6426] to-[#F8A91F] hover:from-[#EC6426]/90 hover:to-[#F8A91F]/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold text-sm sm:text-base"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Tạo combo mới
                    </Button>
                }
            />

            {/* Stats */}
            <AdminStatsGrid>
                <AdminStatsCard
                    title="Tổng combo"
                    value={stats.total}
                    icon={Package}
                />
                <AdminStatsCard
                    title="Đang hoạt động"
                    value={stats.active}
                    icon={CheckCircle}
                    className="border-green-200"
                    iconClassName="from-green-400 to-green-600"
                />
                <AdminStatsCard
                    title="Ngừng hoạt động"
                    value={stats.inactive}
                    icon={XCircle}
                    className="border-red-200"
                    iconClassName="from-red-400 to-red-600"
                />
            </AdminStatsGrid>

            {/* Search & Filters */}
            <Card className="p-4 bg-white">
                <div className="space-y-3">
                    <div className="flex gap-2">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                placeholder="Tìm kiếm theo tên, mô tả..."
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </div>
                        <Button
                            onClick={handleSearch}
                            className="bg-gradient-to-r from-[#EC6426] to-[#F8A91F] text-white"
                        >
                            <Search className="h-4 w-4 mr-2" />
                            Tìm kiếm
                        </Button>
                        <Button
                            onClick={() => setShowFilters(!showFilters)}
                            variant="outline"
                        >
                            <Filter className="h-4 w-4 mr-2" />
                            Bộ lọc
                        </Button>
                    </div>

                    {showFilters && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t">
                            <div>
                                <label className="text-xs font-bold mb-1 block text-gray-700">Chi nhánh</label>
                                <select
                                    value={selectedBranchId || ''}
                                    onChange={(e) => setSelectedBranchId(e.target.value ? parseInt(e.target.value) : undefined)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                >
                                    <option value="">Tất cả</option>
                                    {branches.map(branch => (
                                        <option key={branch.id} value={branch.id}>{branch.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold mb-1 block text-gray-700">Trạng thái</label>
                                <select
                                    value={activeFilter === undefined ? '' : activeFilter.toString()}
                                    onChange={(e) => setActiveFilter(e.target.value === '' ? undefined : e.target.value === 'true')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                >
                                    <option value="">Tất cả</option>
                                    <option value="true">Hoạt động</option>
                                    <option value="false">Ngừng hoạt động</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold mb-1 block text-gray-700">Giá từ</label>
                                <input
                                    type="number"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    placeholder="0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold mb-1 block text-gray-700">Giá đến</label>
                                <input
                                    type="number"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    placeholder="999999999"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                />
                            </div>
                            <div className="md:col-span-2 lg:col-span-4 flex gap-2">
                                <Button
                                    onClick={handleSearch}
                                    size="sm"
                                    className="bg-gradient-to-r from-[#EC6426] to-[#F8A91F] text-white"
                                >
                                    Áp dụng
                                </Button>
                                <Button
                                    onClick={handleClearFilters}
                                    size="sm"
                                    variant="outline"
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Xóa bộ lọc
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </Card>

            {/* Combos List */}
            <div className="space-y-3">
                {loading ? (
                    <Card className="p-6 text-center text-gray-500">
                        Đang tải danh sách combo...
                    </Card>
                ) : combos.length === 0 ? (
                    <Card className="p-6 text-center text-gray-500">
                        Không tìm thấy combo nào
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {combos.map((combo) => (
                            <Card
                                key={combo.comboId}
                                className="p-4 bg-white hover:shadow-lg transition-all duration-300 border-0"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900 text-base mb-1">{combo.name}</h3>
                                            <p className="text-xs text-gray-600 line-clamp-2">{combo.description}</p>
                                        </div>
                                        <Badge className={combo.active ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300'}>
                                            {combo.active ? 'Hoạt động' : 'Tạm ngưng'}
                                        </Badge>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm">
                                            <DollarSign className="h-4 w-4 text-orange-500" />
                                            <span className="font-bold text-orange-600">{formatPrice(combo.price)}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-600">
                                            <Store className="h-3 w-3" />
                                            <span>{combo.branchName}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-600">
                                            <Calendar className="h-3 w-3" />
                                            <span>{formatDate(combo.startDate)} - {formatDate(combo.endDate)}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 pt-2 border-t">
                                        <Button
                                            onClick={() => handleEditCombo(combo)}
                                            size="sm"
                                            variant="outline"
                                            className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                                        >
                                            <Edit2 className="h-3 w-3 mr-1" />
                                            Sửa
                                        </Button>
                                        <Button
                                            onClick={() => handleDelete(combo.comboId, combo.name)}
                                            size="sm"
                                            variant="outline"
                                            className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                                        >
                                            <Trash2 className="h-3 w-3 mr-1" />
                                            Xóa
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <Card className="p-3 bg-white">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            Hiển thị {combos.length} / {totalElements} combo
                        </div>
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                disabled={searchParams.page === 0}
                                onClick={() => setSearchParams(prev => ({ ...prev, page: (prev.page || 0) - 1 }))}
                            >
                                Trước
                            </Button>
                            <div className="flex items-center gap-2 px-3">
                                <span className="text-sm font-semibold">
                                    Trang {(searchParams.page || 0) + 1} / {totalPages}
                                </span>
                            </div>
                            <Button
                                size="sm"
                                variant="outline"
                                disabled={(searchParams.page || 0) >= totalPages - 1}
                                onClick={() => setSearchParams(prev => ({ ...prev, page: (prev.page || 0) + 1 }))}
                            >
                                Sau
                            </Button>
                        </div>
                    </div>
                </Card>
            )}

            {/* Combo Form Dialog */}
            <ComboFormDialog
                open={showDialog}
                onOpenChange={setShowDialog}
                combo={editingCombo}
                onSuccess={handleDialogSuccess}
            />
        </AdminPageLayout>
    );
}
