'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Package, Plus, Edit2, Trash2, Search, AlertTriangle, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { AdminPageLayout, AdminPageHeader, AdminStatsCard, AdminStatsGrid } from '../components/AdminPageLayout';
import { getMaterials, deleteMaterial, type Material, type MaterialSearchRequest } from '@/apis/material.api';
import { MaterialFormDialog } from './components/MaterialFormDialog';
import { MaterialConfirmDialog } from './components/MaterialConfirmDialog';
import Link from 'next/link';

export default function MaterialsPage() {
    const [materials, setMaterials] = useState<Material[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Filter states
    const [searchKeyword, setSearchKeyword] = useState('');
    const [typeFilter, setTypeFilter] = useState<string>('');
    const [includeDeleted, setIncludeDeleted] = useState(false);
    const [sortBy, setSortBy] = useState('name');
    const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('ASC');

    // Dialog states
    const [showFormDialog, setShowFormDialog] = useState(false);
    const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);

    // Confirm dialog states
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [deletingMaterial, setDeletingMaterial] = useState<Material | null>(null);

    const fetchMaterials = useCallback(async () => {
        try {
            setLoading(true);

            const searchRequest: MaterialSearchRequest = {
                includeDeleted,
                page: currentPage,
                size: pageSize,
                sortBy,
                sortDirection,
            };

            const response = await getMaterials(searchRequest);
            setMaterials(response.data.content);
            setTotalElements(response.data.totalElements);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Failed to fetch materials:', error);
            toast.error('❌ Không thể tải danh sách nguyên liệu!');
        } finally {
            setLoading(false);
        }
    }, [includeDeleted, currentPage, pageSize, sortBy, sortDirection]);

    useEffect(() => {
        fetchMaterials();
    }, [fetchMaterials]);

    const handleCreate = () => {
        setEditingMaterial(null);
        setShowFormDialog(true);
    };

    const handleEdit = (material: Material) => {
        setEditingMaterial(material);
        setShowFormDialog(true);
    };

    const handleDeleteClick = (material: Material) => {
        setDeletingMaterial(material);
        setShowConfirmDialog(true);
    };

    const handleConfirmDelete = async () => {
        if (!deletingMaterial) return;

        try {
            setActionLoading(true);
            await deleteMaterial(deletingMaterial.id);
            toast.success(`✅ Đã xóa nguyên liệu "${deletingMaterial.name}"!`);
            await fetchMaterials();
            setShowConfirmDialog(false);
            setDeletingMaterial(null);
        } catch (error) {
            console.error('Failed to delete material:', error);
            toast.error('❌ Không thể xóa nguyên liệu!');
        } finally {
            setActionLoading(false);
        }
    };

    const handleFormSuccess = () => {
        fetchMaterials();
    };

    // Handle page change
    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };

    // Calculate statistics (from current page only as we don't have total stats from API)
    const totalMaterialsCount = totalElements;
    const lowStockMaterials = materials.filter(m => m.quantity < m.threshold).length;
    const materialTypes = new Set(materials.map(m => m.materialTypeName)).size;

    // Filter materials (client-side filter for search and type)
    const filteredMaterials = materials.filter(material => {
        const matchesKeyword = !searchKeyword ||
            material.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            material.materialTypeName.toLowerCase().includes(searchKeyword.toLowerCase());

        const matchesType = !typeFilter || material.materialTypeName === typeFilter;

        return matchesKeyword && matchesType;
    });

    // Get unique material types for filter
    const uniqueTypes = Array.from(new Set(materials.map(m => m.materialTypeName))).sort();

    if (loading) {
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
                title="Quản lý nguyên liệu"
                description="Quản lý tổng quan nguyên liệu của tất cả các kho"
                icon={Package}
                actions={
                    <div className="flex gap-2">
                        <Link href="/admin/materials/types">
                            <Button
                                variant="outline"
                                className="border-2 border-blue-300 text-blue-700 hover:bg-blue-50"
                            >
                                <Tag className="h-4 w-4 mr-2" />
                                Quản lý loại nguyên liệu
                            </Button>
                        </Link>
                        <Button
                            onClick={handleCreate}
                            className="bg-gradient-to-r from-[#EC6426] to-[#F8A91F] hover:from-[#EC6426]/90 hover:to-[#F8A91F]/90 text-white"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Thêm nguyên liệu
                        </Button>
                    </div>
                }
            />

            {/* Stats */}
            <AdminStatsGrid>
                <AdminStatsCard
                    title="Tổng nguyên liệu"
                    value={totalMaterialsCount}
                    icon={Package}
                />
                <AdminStatsCard
                    title="Sắp hết hàng"
                    value={lowStockMaterials}
                    icon={AlertTriangle}
                />
                <AdminStatsCard
                    title="Loại nguyên liệu"
                    value={materialTypes}
                    icon={Package}
                />
            </AdminStatsGrid>

            {/* Filters */}
            <div className="bg-white rounded-xl border-2 border-gray-200 p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                            placeholder="Tìm kiếm nguyên liệu..."
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* Type Filter */}
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                        <option value="">Tất cả loại nguyên liệu</option>
                        {uniqueTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>

                    {/* Page Size */}
                    <div className="flex items-center gap-3">
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

            {/* Materials Table */}
            <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Nguyên liệu
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Loại
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Tổng tồn kho
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Ngưỡng
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Calo/Đơn vị
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Trạng thái
                                </th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredMaterials.map((material) => {
                                const isLowStock = material.quantity < material.threshold;
                                return (
                                    <tr key={material.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                                                    <Package className="h-5 w-5 text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">{material.name}</p>
                                                    <p className="text-xs text-gray-500">ID: {material.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge className="bg-blue-100 text-blue-700 border-blue-300">
                                                {material.materialTypeName}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-semibold text-gray-900">
                                                {material.quantity} {material.unit}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-700">
                                                {material.threshold} {material.unit}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-700">
                                                {material.caloriesPerUnit} cal
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            {isLowStock ? (
                                                <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">
                                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                                    Sắp hết
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-green-100 text-green-700 border-green-300">
                                                    Đủ hàng
                                                </Badge>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <Button
                                                    onClick={() => handleEdit(material)}
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-orange-600 border-orange-200 hover:bg-orange-50"
                                                    disabled={actionLoading}
                                                >
                                                    <Edit2 className="h-3 w-3" />
                                                </Button>
                                                <Button
                                                    onClick={() => handleDeleteClick(material)}
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
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {filteredMaterials.length === 0 && (
                    <div className="text-center py-12">
                        <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500">Không tìm thấy nguyên liệu nào</p>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Trang <span className="font-semibold">{currentPage + 1}</span> / {totalPages}
                                {' '}(Hiển thị {filteredMaterials.length} / {totalElements} nguyên liệu)
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

            <MaterialFormDialog
                open={showFormDialog}
                onOpenChange={setShowFormDialog}
                material={editingMaterial}
                onSuccess={handleFormSuccess}
            />

            <MaterialConfirmDialog
                open={showConfirmDialog}
                onOpenChange={setShowConfirmDialog}
                onConfirm={handleConfirmDelete}
                materialName={deletingMaterial?.name || ''}
                loading={actionLoading}
            />
        </AdminPageLayout>
    );
}
