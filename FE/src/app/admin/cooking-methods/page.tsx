'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Flame, Plus, Edit2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AdminPageLayout, AdminPageHeader } from '../components/AdminPageLayout';
import { getCookingMethods, type CookingMethod, type CookingMethodSearchParams } from '@/apis/cooking-method.api';
import { CookingMethodFormDialog } from './components/CookingMethodFormDialog';

export default function CookingMethodsPage() {
    const [cookingMethods, setCookingMethods] = useState<CookingMethod[]>([]);
    const [loading, setLoading] = useState(true);

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
    const [editingMethod, setEditingMethod] = useState<CookingMethod | null>(null);

    const fetchCookingMethods = useCallback(async () => {
        try {
            setLoading(true);

            const searchRequest: CookingMethodSearchParams = {
                keyword: searchKeyword,
                page: currentPage,
                size: pageSize,
                sortDirection,
            };

            const response = await getCookingMethods(searchRequest);
            setCookingMethods(response.content);
            setTotalElements(response.totalElements);
            setTotalPages(response.totalPages);
        } catch (error) {
            console.error('Failed to fetch cooking methods:', error);
            toast.error('❌ Không thể tải danh sách phương pháp nấu!');
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, searchKeyword, sortDirection]);

    useEffect(() => {
        fetchCookingMethods();
    }, [fetchCookingMethods]);

    const handleCreate = () => {
        setEditingMethod(null);
        setShowFormDialog(true);
    };

    const handleEdit = (method: CookingMethod) => {
        setEditingMethod(method);
        setShowFormDialog(true);
    };

    const handleFormSuccess = () => {
        fetchCookingMethods();
    };

    // Handle page change
    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };

    if (loading && cookingMethods.length === 0) {
        return (
            <AdminPageLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </AdminPageLayout>
        );
    }

    return (
        <AdminPageLayout>
            <AdminPageHeader
                title="Quản lý Phương pháp nấu"
                description="Danh mục các phương pháp chế biến món ăn"
                icon={Flame}
                actions={
                    <Button
                        onClick={handleCreate}
                        className="bg-[#EC6426] hover:bg-[#EC6426]/90 text-white"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm phương pháp
                    </Button>
                }
            />

            {/* Filters */}
            <div className="bg-white rounded-xl border-2 border-gray-200 p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                            placeholder="Tìm kiếm phương pháp..."
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* Page Size */}
                    <div className="flex items-center gap-3 justify-end">
                        <label className="text-sm text-gray-700 font-medium whitespace-nowrap">Hiển thị:</label>
                        <select
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(parseInt(e.target.value));
                                setCurrentPage(0);
                            }}
                            className="px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                        </select>
                        <span className="text-sm text-gray-600 whitespace-nowrap">
                            Tổng: <span className="font-bold">{totalElements}</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* Cooking Methods Table */}
            <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Tên phương pháp
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Mô tả
                                </th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {cookingMethods.map((method) => (
                                <tr key={method.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                                <Flame className="h-4 w-4 text-orange-600" />
                                            </div>
                                            <span className="font-semibold text-gray-900">{method.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-700">{method.description}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <Button
                                                onClick={() => handleEdit(method)}
                                                size="sm"
                                                variant="outline"
                                                className="text-orange-600 border-orange-200 hover:bg-orange-50"
                                            >
                                                <Edit2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {cookingMethods.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <Flame className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500">Không tìm thấy dữ liệu phương pháp nấu</p>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Trang <span className="font-semibold">{currentPage + 1}</span> / {totalPages}
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 0}
                                    variant="outline"
                                    size="sm"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    Trước
                                </Button>
                                <Button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage >= totalPages - 1}
                                    variant="outline"
                                    size="sm"
                                >
                                    Sau
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <CookingMethodFormDialog
                open={showFormDialog}
                onOpenChange={setShowFormDialog}
                cookingMethod={editingMethod}
                onSuccess={handleFormSuccess}
            />
        </AdminPageLayout>
    );
}
