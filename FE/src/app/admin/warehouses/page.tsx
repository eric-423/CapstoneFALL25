'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Warehouse as WarehouseIcon, Plus, Edit2, MapPin, Building, CheckCircle, XCircle, Tag, Trash2, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdminPageLayout, AdminPageHeader } from '../components/AdminPageLayout';
import { AdminCard } from '../components/AdminCard';
import { getWarehouses, getMaterialTypes, deleteMaterialType, type Warehouse, type MaterialType } from '@/apis/material.api';
import { WarehouseFormDialog } from './components/WarehouseFormDialog';
import { MaterialTypeFormDialog } from './components/MaterialTypeFormDialog';
import { MaterialTypeConfirmDialog } from './components/MaterialTypeConfirmDialog';
import { useRouter } from 'next/navigation';

export default function WarehousesPage() {
    const router = useRouter();
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [materialTypes, setMaterialTypes] = useState<MaterialType[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    // Warehouse Dialog states
    const [showFormDialog, setShowFormDialog] = useState(false);
    const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);

    // Material Type Dialog states
    const [showTypeFormDialog, setShowTypeFormDialog] = useState(false);
    const [editingMaterialType, setEditingMaterialType] = useState<MaterialType | null>(null);
    const [showTypeConfirmDialog, setShowTypeConfirmDialog] = useState(false);
    const [deletingMaterialType, setDeletingMaterialType] = useState<MaterialType | null>(null);
    const [showTypesManagement, setShowTypesManagement] = useState(false);

    const fetchWarehouses = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getWarehouses();
            setWarehouses(data);
        } catch (error) {
            console.error('Failed to fetch warehouses:', error);
            toast.error('❌ Không thể tải danh sách kho!');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchMaterialTypes = useCallback(async () => {
        try {
            const data = await getMaterialTypes(false);
            setMaterialTypes(data);
        } catch (error) {
            console.error('Failed to fetch material types:', error);
            toast.error('❌ Không thể tải danh sách loại nguyên liệu!');
        }
    }, []);

    useEffect(() => {
        fetchWarehouses();
    }, [fetchWarehouses]);

    useEffect(() => {
        if (showTypesManagement && materialTypes.length === 0) {
            fetchMaterialTypes();
        }
    }, [showTypesManagement, materialTypes.length, fetchMaterialTypes]);

    const handleCreate = () => {
        setEditingWarehouse(null);
        setShowFormDialog(true);
    };

    const handleEdit = (warehouse: Warehouse) => {
        setEditingWarehouse(warehouse);
        setShowFormDialog(true);
    };

    const handleViewMaterials = (warehouseId: number) => {
        router.push(`/admin/warehouses/${warehouseId}/materials`);
    };

    const handleFormSuccess = () => {
        fetchWarehouses();
    };

    const handleCreateType = () => {
        setEditingMaterialType(null);
        setShowTypeFormDialog(true);
    };

    const handleEditType = (materialType: MaterialType) => {
        setEditingMaterialType(materialType);
        setShowTypeFormDialog(true);
    };

    const handleDeleteTypeClick = (materialType: MaterialType) => {
        setDeletingMaterialType(materialType);
        setShowTypeConfirmDialog(true);
    };

    const handleConfirmDeleteType = async () => {
        if (!deletingMaterialType) return;

        try {
            setActionLoading(true);
            await deleteMaterialType(deletingMaterialType.id);
            toast.success(`✅ Đã xóa loại nguyên liệu "${deletingMaterialType.name}"!`);
            await fetchMaterialTypes();
            setShowTypeConfirmDialog(false);
            setDeletingMaterialType(null);
        } catch (error) {
            console.error('Failed to delete material type:', error);
            toast.error('❌ Không thể xóa loại nguyên liệu!');
        } finally {
            setActionLoading(false);
        }
    };

    const handleTypeFormSuccess = () => {
        fetchMaterialTypes();
    };

    // Calculate statistics
    const totalWarehouses = warehouses.length;
    const activeWarehouses = warehouses.filter(w => w.isActive === true).length;
    const inactiveWarehouses = warehouses.filter(w => w.isActive === false).length;

    return (
        <AdminPageLayout>
            <AdminPageHeader
                title="Quản lý kho"
                description="Quản lý thông tin các kho và nguyên liệu"
                icon={WarehouseIcon}
                actions={
                    <div className="flex gap-2">
                        <Button
                            onClick={() => setShowTypesManagement(true)}
                            variant="outline"
                            className="border-2 border-[#78A243]/30 text-[#78A243] hover:bg-[#78A243]/10"
                        >
                            <Tag className="h-4 w-4 mr-2" />
                            Quản lý loại nguyên liệu
                        </Button>
                        <Button
                            onClick={handleCreate}
                            className="bg-[#78A243] hover:bg-[#78A243]/90 text-white"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Thêm kho
                        </Button>
                    </div>
                }
            />

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <AdminCard
                    title="Tổng số kho"
                    value={totalWarehouses}
                    icon={WarehouseIcon}
                />
                <AdminCard
                    title="Đang hoạt động"
                    value={activeWarehouses}
                    icon={CheckCircle}
                />
                <AdminCard
                    title="Ngừng hoạt động"
                    value={inactiveWarehouses}
                    icon={XCircle}
                />
            </div>

            {/* Warehouses Table */}
            <div className="bg-white rounded-xl border-2 border-[#78A243]/20 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="w-8 h-8 border-4 border-[#78A243]/30 border-t-[#78A243] rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-[#78A243]/10 to-[#EBD187]/20 border-b-2 border-[#78A243]/30">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-bold text-[#2D1E1A]">
                                        Kho
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-bold text-[#2D1E1A]">
                                        Chi nhánh
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-bold text-[#2D1E1A]">
                                        Trạng thái
                                    </th>
                                    <th className="px-4 py-3 text-right text-sm font-bold text-[#2D1E1A]">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#78A243]/10">
                                {warehouses.map((warehouse) => (
                                    <tr key={warehouse.id} className="hover:bg-[#EBD187]/10 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-[#78A243] to-[#DA7339] rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <WarehouseIcon className="h-5 w-5 text-white" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="h-4 w-4 text-gray-400" />
                                                        <p className="font-semibold text-[#2D1E1A]">{warehouse.address}</p>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1">ID: {warehouse.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <Building className="h-4 w-4 text-gray-400" />
                                                    <p className="font-semibold text-[#2D1E1A]">{warehouse.branchName}</p>
                                                </div>
                                                <p className="text-sm text-[#2D1E1A]/70 line-clamp-2">
                                                    {warehouse.branchAddress}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            {warehouse.isActive === true ? (
                                                <Badge className="bg-green-100 text-green-700 border-green-300">
                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                    Hoạt động
                                                </Badge>
                                            ) : warehouse.isActive === false ? (
                                                <Badge className="bg-red-100 text-red-700 border-red-300">
                                                    <XCircle className="h-3 w-3 mr-1" />
                                                    Ngừng
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-gray-100 text-gray-700 border-gray-300">
                                                    Không rõ
                                                </Badge>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    onClick={() => handleViewMaterials(warehouse.id)}
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-[#78A243] border-[#78A243]/30 hover:bg-[#78A243]/10"
                                                >
                                                    Xem nguyên liệu
                                                </Button>
                                                <Button
                                                    onClick={() => handleEdit(warehouse)}
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-[#78A243] border-[#78A243]/30 hover:bg-[#78A243]/10"
                                                >
                                                    <Edit2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {warehouses.length === 0 && (
                            <div className="text-center py-12">
                                <WarehouseIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-500">Chưa có kho nào</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Material Types Management Modal */}
            {showTypesManagement && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="w-full max-w-6xl bg-white shadow-2xl rounded-2xl overflow-hidden max-h-[90vh] flex flex-col">
                        {/* Header */}
                        <div className="bg-[#78A243] p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Tag className="h-8 w-8 text-white" />
                                    <h2 className="text-2xl font-bold text-white">Quản lý loại nguyên liệu</h2>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        onClick={handleCreateType}
                                        className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/50"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Thêm loại nguyên liệu
                                    </Button>
                                    <button
                                        onClick={() => setShowTypesManagement(false)}
                                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                    >
                                        <X className="h-6 w-6 text-white" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {materialTypes.map((type) => (
                                    <div
                                        key={type.id}
                                        className="bg-white rounded-xl border-2 border-[#78A243]/20 p-5 hover:shadow-lg transition-all duration-200 hover:border-[#78A243]"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-[#78A243] to-[#DA7339] rounded-xl flex items-center justify-center">
                                                <Tag className="h-6 w-6 text-white" />
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={() => handleEditType(type)}
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-[#78A243] border-[#78A243]/30 hover:bg-[#78A243]/10 h-8 w-8 p-0"
                                                    disabled={actionLoading}
                                                >
                                                    <Edit2 className="h-3.5 w-3.5" />
                                                </Button>
                                                <Button
                                                    onClick={() => handleDeleteTypeClick(type)}
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-red-600 border-red-200 hover:bg-red-50 h-8 w-8 p-0"
                                                    disabled={actionLoading}
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="font-bold text-[#2D1E1A] text-lg mb-1">{type.name}</h3>
                                            <p className="text-xs text-gray-500">ID: {type.id}</p>
                                        </div>

                                        {type.isDeleted && (
                                            <Badge className="mt-3 bg-red-100 text-red-700 border-red-300">
                                                Đã xóa
                                            </Badge>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {materialTypes.length === 0 && (
                                <div className="text-center py-12">
                                    <Tag className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                    <p className="text-gray-500">Chưa có loại nguyên liệu nào</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <WarehouseFormDialog
                open={showFormDialog}
                onOpenChange={setShowFormDialog}
                warehouse={editingWarehouse}
                onSuccess={handleFormSuccess}
            />

            <MaterialTypeFormDialog
                open={showTypeFormDialog}
                onOpenChange={setShowTypeFormDialog}
                materialType={editingMaterialType}
                onSuccess={handleTypeFormSuccess}
            />

            <MaterialTypeConfirmDialog
                open={showTypeConfirmDialog}
                onOpenChange={setShowTypeConfirmDialog}
                onConfirm={handleConfirmDeleteType}
                materialTypeName={deletingMaterialType?.name || ''}
                loading={actionLoading}
            />
        </AdminPageLayout>
    );
}
