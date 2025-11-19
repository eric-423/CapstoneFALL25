'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Warehouse as WarehouseIcon, Plus, Edit2, MapPin, Building, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdminPageLayout, AdminPageHeader, AdminStatsCard, AdminStatsGrid } from '../components/AdminPageLayout';
import { getWarehouses, type Warehouse } from '@/apis/material.api';
import { WarehouseFormDialog } from './components/WarehouseFormDialog';
import { useRouter } from 'next/navigation';

export default function WarehousesPage() {
    const router = useRouter();
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [loading, setLoading] = useState(true);

    // Dialog states
    const [showFormDialog, setShowFormDialog] = useState(false);
    const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);

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

    useEffect(() => {
        fetchWarehouses();
    }, [fetchWarehouses]);

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

    // Calculate statistics
    const totalWarehouses = warehouses.length;
    const activeWarehouses = warehouses.filter(w => w.isActive === true).length;
    const inactiveWarehouses = warehouses.filter(w => w.isActive === false).length;

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
                title="Quản lý kho"
                description="Quản lý thông tin các kho và nguyên liệu"
                icon={WarehouseIcon}
                actions={
                    <Button
                        onClick={handleCreate}
                        className="bg-gradient-to-r from-[#EC6426] to-[#F8A91F] hover:from-[#EC6426]/90 hover:to-[#F8A91F]/90 text-white"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm kho
                    </Button>
                }
            />

            {/* Stats */}
            <AdminStatsGrid>
                <AdminStatsCard
                    title="Tổng số kho"
                    value={totalWarehouses}
                    icon={WarehouseIcon}
                />
                <AdminStatsCard
                    title="Đang hoạt động"
                    value={activeWarehouses}
                    icon={CheckCircle}
                />
                <AdminStatsCard
                    title="Ngừng hoạt động"
                    value={inactiveWarehouses}
                    icon={XCircle}
                />
            </AdminStatsGrid>

            {/* Warehouses Table */}
            <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Kho
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Chi nhánh
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
                            {warehouses.map((warehouse) => (
                                <tr key={warehouse.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <WarehouseIcon className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4 text-gray-400" />
                                                    <p className="font-semibold text-gray-900">{warehouse.address}</p>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">ID: {warehouse.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Building className="h-4 w-4 text-gray-400" />
                                                <p className="font-semibold text-gray-900">{warehouse.branchName}</p>
                                            </div>
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {warehouse.branchAddress}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
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
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <Button
                                                onClick={() => handleViewMaterials(warehouse.id)}
                                                size="sm"
                                                variant="outline"
                                                className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                            >
                                                Xem nguyên liệu
                                            </Button>
                                            <Button
                                                onClick={() => handleEdit(warehouse)}
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

                {warehouses.length === 0 && (
                    <div className="text-center py-12">
                        <WarehouseIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500">Chưa có kho nào</p>
                    </div>
                )}
            </div>

            <WarehouseFormDialog
                open={showFormDialog}
                onOpenChange={setShowFormDialog}
                warehouse={editingWarehouse}
                onSuccess={handleFormSuccess}
            />
        </AdminPageLayout>
    );
}
