'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Leaf, Plus, Edit2, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AdminPageLayout, AdminPageHeader } from '../components/AdminPageLayout';
import { getNutrients, deleteNutrient, type Nutrient, type NutrientSearchParams } from '@/apis/nutrient.api';
import { NutrientFormDialog } from './components/NutrientFormDialog';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { FilterDropdown } from '../components/FilterDropdown';

export default function NutrientsPage() {
    const [nutrients, setNutrients] = useState<Nutrient[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Filter states
    const [searchKeyword, setSearchKeyword] = useState('');
    const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('ASC');

    // Dialog states
    const [showFormDialog, setShowFormDialog] = useState(false);
    const [editingNutrient, setEditingNutrient] = useState<Nutrient | null>(null);

    // Confirm dialog states
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [deletingNutrient, setDeletingNutrient] = useState<Nutrient | null>(null);

    const fetchNutrients = useCallback(async () => {
        try {
            setLoading(true);

            const searchRequest: NutrientSearchParams = {
                keyword: searchKeyword,
                page: currentPage,
                size: pageSize,
                sortDirection,
            };

            const response = await getNutrients(searchRequest);
            // Assuming response structure matches what we defined in api
            setNutrients(response.content);
            setTotalElements(response.totalElements);
            setTotalPages(response.totalPages);
        } catch (error) {
            console.error('Failed to fetch nutrients:', error);
            toast.error('Không thể tải danh sách dinh dưỡng!');
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, searchKeyword, sortDirection]);

    useEffect(() => {
        fetchNutrients();
    }, [fetchNutrients]);

    const handleCreate = () => {
        setEditingNutrient(null);
        setShowFormDialog(true);
    };

    const handleEdit = (nutrient: Nutrient) => {
        setEditingNutrient(nutrient);
        setShowFormDialog(true);
    };

    const handleDeleteClick = (nutrient: Nutrient) => {
        setDeletingNutrient(nutrient);
        setShowConfirmDialog(true);
    };

    const handleConfirmDelete = async () => {
        if (!deletingNutrient) return;

        try {
            setActionLoading(true);
            await deleteNutrient(deletingNutrient.id);
            toast.success(`Đã xóa dinh dưỡng "${deletingNutrient.name}"!`);
            await fetchNutrients();
            setShowConfirmDialog(false);
            setDeletingNutrient(null);
        } catch (error) {
            console.error('Failed to delete nutrient:', error);
            toast.error('Không thể xóa dinh dưỡng!');
        } finally {
            setActionLoading(false);
        }
    };

    const handleFormSuccess = () => {
        fetchNutrients();
    };

    // Handle page change
    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };

    if (loading && nutrients.length === 0) {
        return (
            <AdminPageLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="w-8 h-8 border-4 border-[#78A243] border-t-transparent rounded-full animate-spin"></div>
                </div>
            </AdminPageLayout>
        );
    }

    return (
        <AdminPageLayout>
            <AdminPageHeader
                title="Quản lý Dinh dưỡng"
                description="Danh mục các chất dinh dưỡng và năng lượng"
                icon={Leaf}
                actions={
                    <Button
                        onClick={handleCreate}
                        className="bg-[#78A243] hover:bg-[#78A243]/90 text-white shadow-md hover:shadow-lg transition-all"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm dinh dưỡng
                    </Button>
                }
            />

            {/* Filters Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-gradient-to-r from-[#EBD187]/20 to-[#78A243]/10 backdrop-blur-sm border-[#78A243]/20 border shadow-sm rounded-xl mb-6">
                <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[200px]">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#2D1E1A]/60" />
                        <Input
                            placeholder="Tìm kiếm dinh dưỡng..."
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            className="w-full max-w-[250px] pl-10 pr-4 py-2 border bg-white/80 border-[#78A243]/30 rounded-lg text-sm focus:border-[#78A243] focus:ring-1 focus:ring-[#78A243]/20 outline-none"
                        />
                    </div>
                </div>

                {/* Page Size */}
                <div className="flex items-center gap-3">
                    <label className="text-sm text-[#2D1E1A] font-medium whitespace-nowrap">Hiển thị:</label>
                    <FilterDropdown
                        label="Hiển thị"
                        title="Số lượng hiển thị"
                        value={pageSize.toString()}
                        onChange={(value) => {
                            setPageSize(parseInt(value));
                            setCurrentPage(0);
                        }}
                        items={[
                            { value: "5", label: "5" },
                            { value: "10", label: "10" },
                            { value: "20", label: "20" },
                            { value: "50", label: "50" }
                        ]}
                        showAllOption={false}
                        className="w-[80px]"
                    />
                    <span className="text-sm text-[#2D1E1A]/80 whitespace-nowrap">
                        Tổng: <span className="font-bold text-[#78A243]">{totalElements}</span>
                    </span>
                </div>
            </div>

            {/* Nutrients Table */}
            <div className="bg-white rounded-xl border border-[#78A243]/20 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-[#78A243]/10 to-[#EBD187]/20 border-b-2 border-[#78A243]/30">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-bold text-[#2D1E1A]">
                                    Tên dinh dưỡng
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-[#2D1E1A]">
                                    Mã
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-[#2D1E1A]">
                                    Đơn vị
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-[#2D1E1A]">
                                    Năng lượng / Đơn vị
                                </th>
                                <th className="px-6 py-4 text-center text-sm font-bold text-[#2D1E1A]">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#78A243]/10">
                            {nutrients.map((nutrient) => (
                                <tr key={nutrient.id} className="hover:bg-[#EBD187]/10 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-[#78A243]/20 rounded-full flex items-center justify-center">
                                                <Leaf className="h-4 w-4 text-[#78A243]" />
                                            </div>
                                            <span className="font-semibold text-[#2D1E1A]">{nutrient.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-mono text-[#2D1E1A]/80 bg-[#EBD187]/20 px-2 py-1 rounded border border-[#EBD187]/50">
                                            {nutrient.code}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-[#2D1E1A]">{nutrient.unit}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-[#2D1E1A] font-medium">
                                            {nutrient.energyPerUnit} kcal
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <Button
                                                onClick={() => handleEdit(nutrient)}
                                                size="sm"
                                                variant="outline"
                                                className="text-[#78A243] border-[#78A243]/30 hover:bg-[#78A243]/10"
                                                disabled={actionLoading}
                                            >
                                                <Edit2 className="h-3 w-3" />
                                            </Button>
                                            <Button
                                                onClick={() => handleDeleteClick(nutrient)}
                                                size="sm"
                                                variant="outline"
                                                className="text-red-600 border-red-200 hover:bg-red-50"
                                                disabled={actionLoading}
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {nutrients.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <Leaf className="h-12 w-12 text-[#78A243]/30 mx-auto mb-3" />
                        <p className="text-[#2D1E1A]/70">Không tìm thấy dữ liệu dinh dưỡng</p>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-4 py-3 border-t border-[#78A243]/20 bg-gradient-to-r from-[#EBD187]/10 to-[#78A243]/5">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-[#2D1E1A]/80">
                                Trang <span className="font-semibold">{currentPage + 1}</span> / {totalPages}
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 0}
                                    variant="outline"
                                    size="sm"
                                    className="border-[#78A243]/30 text-[#2D1E1A] hover:bg-[#78A243]/10"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    Trước
                                </Button>
                                <Button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage >= totalPages - 1}
                                    variant="outline"
                                    size="sm"
                                    className="border-[#78A243]/30 text-[#2D1E1A] hover:bg-[#78A243]/10"
                                >
                                    Sau
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <NutrientFormDialog
                open={showFormDialog}
                onOpenChange={setShowFormDialog}
                nutrient={editingNutrient}
                onSuccess={handleFormSuccess}
            />

            <ConfirmDialog
                open={showConfirmDialog}
                onOpenChange={setShowConfirmDialog}
                onConfirm={handleConfirmDelete}
                title="Xóa dinh dưỡng"
                content={
                    <span>
                        Bạn có chắc chắn muốn xóa dinh dưỡng <span className="font-bold text-gray-900">{deletingNutrient?.name}</span>?
                    </span>
                }
                alertMessage="Hành động này không thể hoàn tác. Dữ liệu sẽ bị xóa vĩnh viễn khỏi hệ thống."
                confirmText="Xóa dinh dưỡng"
                variant="destructive"
                loading={actionLoading}
            />
        </AdminPageLayout>
    );
}
