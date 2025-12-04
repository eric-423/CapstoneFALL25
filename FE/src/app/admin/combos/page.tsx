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
import { AdminPageLayout, AdminPageHeader } from '../components/AdminPageLayout';
import { AdminCard } from '../components/AdminCard';
import { searchCombos, deleteCombo, getComboById, type Combo, type ComboSearchParams, type ComboDetail } from '@/apis/combo.api';
import { useAdminContext } from '@/utils/contexts/AdminContext';
import { ComboFormDialog } from './components/ComboFormDialog';
import { FilterDropdown } from '@/components/common/FilterDropdown';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';

export default function CombosManagementPage() {
    const { branches } = useAdminContext();
    const [combos, setCombos] = useState<Combo[]>([]);
    const [loading, setLoading] = useState(true);

    // API filter params - only these trigger API calls
    const [apiParams, setApiParams] = useState<ComboSearchParams>({
        page: 0,
        size: 20,
        sortBy: 'name',
        sortDirection: 'ASC',
    });

    // Local input states - for user input without triggering API
    const [keyword, setKeyword] = useState('');
    const [selectedBranchId, setSelectedBranchId] = useState<number | undefined>();
    const [showFilters, setShowFilters] = useState(false);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [activeFilter, setActiveFilter] = useState<boolean | undefined>();

    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Dialog states
    const [showDialog, setShowDialog] = useState(false);
    const [editingCombo, setEditingCombo] = useState<ComboDetail | null>(null);
    // const [loadingComboDetail, setLoadingComboDetail] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState<{
        open: boolean;
        comboId: number;
        comboName: string;
    }>({
        open: false,
        comboId: 0,
        comboName: ''
    });
    const [deleteLoading, setDeleteLoading] = useState(false);

    const fetchCombos = useCallback(async () => {
        try {
            setLoading(true);
            const data = await searchCombos(apiParams);
            setCombos(data.content);
            setTotalElements(data.totalElements);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Failed to fetch combos:', error);
        } finally {
            setLoading(false);
        }
    }, [apiParams]);

    useEffect(() => {
        fetchCombos();
    }, [fetchCombos]);

    const handleDelete = async (comboId: number, comboName: string) => {
        setConfirmDialog({
            open: true,
            comboId,
            comboName
        });
    };

    const handleConfirmDelete = async () => {
        try {
            setDeleteLoading(true);
            await deleteCombo(confirmDialog.comboId);
            toast.success(`Đã xóa combo "${confirmDialog.comboName}" thành công!`);
            setConfirmDialog({ open: false, comboId: 0, comboName: '' });
            await fetchCombos();
        } catch (error) {
            console.error('Failed to delete combo:', error);
            toast.error('Không thể xóa combo. Vui lòng thử lại!');
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleSearch = () => {
        // Update API params to trigger search with current input values
        setApiParams({
            ...apiParams,
            page: 0,
            keyword: keyword || undefined,
            branchId: selectedBranchId,
            isActive: activeFilter,
            minPrice: minPrice ? parseFloat(minPrice) : undefined,
            maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        });
    };

    const handleClearFilters = () => {
        // Clear all input states
        setKeyword('');
        setSelectedBranchId(undefined);
        setActiveFilter(undefined);
        setMinPrice('');
        setMaxPrice('');
        // Reset API params to default
        setApiParams({
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
            const comboDetail = await getComboById(combo.comboId);
            setEditingCombo(comboDetail);
            setShowDialog(true);
        } catch (error) {
            console.error('Failed to fetch combo detail:', error);
            toast.error('Không thể tải thông tin combo!');
        } finally {
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

    const handleBranchChange = (value: string) => {
        const branchId = value ? parseInt(value) : undefined;
        setSelectedBranchId(branchId);
        setApiParams({
            ...apiParams,
            page: 0,
            branchId,
            keyword: keyword || undefined,
            isActive: activeFilter,
            minPrice: minPrice ? parseFloat(minPrice) : undefined,
            maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        });
    };

    const handleStatusChange = (value: string) => {
        const nextStatus = value === '' ? undefined : value === 'true';
        setActiveFilter(nextStatus);
        setApiParams({
            ...apiParams,
            page: 0,
            branchId: selectedBranchId,
            keyword: keyword || undefined,
            isActive: nextStatus,
            minPrice: minPrice ? parseFloat(minPrice) : undefined,
            maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        });
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
                        className="bg-[#78A243] hover:bg-[#78A243]/90 text-white shadow-md hover:shadow-lg transition-all"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Tạo combo mới
                    </Button>
                }
            />

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <AdminCard
                    title="Tổng combo"
                    value={stats.total}
                    icon={Package}
                />
                <AdminCard
                    title="Đang hoạt động"
                    value={stats.active}
                    icon={CheckCircle}
                />
                <AdminCard
                    title="Ngừng hoạt động"
                    value={stats.inactive}
                    icon={XCircle}
                />
            </div>

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
                            className="bg-[#78A243] hover:bg-[#78A243]/90 text-white"
                        >
                            <Search className="h-4 w-4 mr-2" />
                            Tìm kiếm
                        </Button>
                        <Button
                            onClick={() => setShowFilters(!showFilters)}
                            variant="outline"
                            className="border-[#78A243]/30 text-[#78A243] hover:bg-[#78A243]/10"
                        >
                            <Filter className="h-4 w-4 mr-2" />
                            Bộ lọc
                        </Button>
                    </div>

                    {showFilters && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-[#2D1E1A]">Chi nhánh</label>
                                <FilterDropdown
                                    label="Tất cả"
                                    value={selectedBranchId?.toString() || ''}
                                    onChange={handleBranchChange}
                                    items={branches.map(branch => ({
                                        value: branch.id.toString(),
                                        label: branch.name
                                    }))}
                                    className="w-full"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-[#2D1E1A]">Trạng thái</label>
                                <FilterDropdown
                                    label="Tất cả"
                                    value={activeFilter === undefined ? '' : activeFilter.toString()}
                                    onChange={handleStatusChange}
                                    items={[
                                        { value: 'true', label: 'Hoạt động' },
                                        { value: 'false', label: 'Ngừng hoạt động' }
                                    ]}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold mb-1 block text-[#2D1E1A]">Giá từ</label>
                                <input
                                    type="number"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    placeholder="0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold mb-1 block text-[#2D1E1A]">Giá đến</label>
                                <input
                                    type="number"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    placeholder="999999999"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                />
                            </div>
                            <div className="md:col-span-2 lg:col-span-4 flex gap-2">
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
                                className="p-4 bg-white hover:shadow-lg transition-all duration-300 border-2 border-[#78A243]/20 hover:border-[#78A243]"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-bold text-[#2D1E1A] text-base mb-1">{combo.name}</h3>
                                            <p className="text-xs text-gray-600 line-clamp-2">{combo.description}</p>
                                        </div>
                                        <Badge className={combo.active ? 'bg-[#78A243]/10 text-[#78A243] border-[#78A243]/30' : 'bg-red-100 text-red-800 border-red-300'}>
                                            {combo.active ? 'Hoạt động' : 'Tạm ngưng'}
                                        </Badge>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm">
                                            <DollarSign className="h-4 w-4 text-[#78A243]" />
                                            <span className="font-bold text-[#78A243]">{formatPrice(combo.price)}</span>
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
                                            className="flex-1 text-[#78A243] border-[#78A243]/30 hover:bg-[#78A243]/10"
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
                                disabled={apiParams.page === 0}
                                onClick={() => setApiParams(prev => ({ ...prev, page: (prev.page || 0) - 1 }))}
                            >
                                Trước
                            </Button>
                            <div className="flex items-center gap-2 px-3">
                                <span className="text-sm font-semibold">
                                    Trang {(apiParams.page || 0) + 1} / {totalPages}
                                </span>
                            </div>
                            <Button
                                size="sm"
                                variant="outline"
                                disabled={(apiParams.page || 0) >= totalPages - 1}
                                onClick={() => setApiParams(prev => ({ ...prev, page: (prev.page || 0) + 1 }))}
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

            {/* Confirm Delete Dialog */}
            <ConfirmDialog
                open={confirmDialog.open}
                onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
                onConfirm={handleConfirmDelete}
                title="Xóa combo"
                content={
                    <span>
                        Bạn có chắc chắn muốn xóa combo <span className="font-bold text-gray-900">&quot;{confirmDialog.comboName}&quot;</span>?
                    </span>
                }
                alertMessage="Combo đã xóa sẽ không thể khôi phục. Các đơn hàng liên quan có thể bị ảnh hưởng."
                confirmText="Xóa combo"
                variant="destructive"
                loading={deleteLoading}
            />
        </AdminPageLayout>
    );
}
