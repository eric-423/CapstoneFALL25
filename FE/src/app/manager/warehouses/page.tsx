'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Package, Plus, AlertTriangle, Warehouse as WarehouseIcon, Tag } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdminPageLayout, AdminPageHeader } from '../components/AdminPageLayout';
import { AdminCard } from '../components/AdminCard';
import { getWarehouseMaterials, getMaterials, type WarehouseMaterial, type Material } from '@/apis/material.api';
import { AddMaterialDialog } from './[warehouseId]/materials/components/AddMaterialDialog';
import { getCookie } from '@/utils/cookies.client';

export default function WarehousesPage() {
    const [branchId, setBranchId] = useState<number | null>(null);
    const [warehouseMaterials, setWarehouseMaterials] = useState<WarehouseMaterial[]>([]);
    const [allMaterials, setAllMaterials] = useState<Material[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddDialog, setShowAddDialog] = useState(false);

    useEffect(() => {
        const branchIdFromCookie = getCookie('branchId');
        if (branchIdFromCookie) {
            setBranchId(parseInt(branchIdFromCookie));
        } else {
            toast.error('❌ Không tìm thấy branchId trong cookie!');
            setLoading(false);
        }
    }, []);

    const fetchWarehouseMaterials = useCallback(async () => {
        if (!branchId) return;

        try {
            setLoading(true);
            const [warehouseData, allMaterialsResponse] = await Promise.all([
                getWarehouseMaterials(branchId),
                getMaterials({ size: 1000 })
            ]);
            setWarehouseMaterials(warehouseData);
            setAllMaterials(allMaterialsResponse.data.content);
        } catch (error) {
            toast.error('❌ Không thể tải danh sách nguyên liệu!');
        } finally {
            setLoading(false);
        }
    }, [branchId]);

    useEffect(() => {
        if (branchId) {
            fetchWarehouseMaterials();
        }
    }, [branchId, fetchWarehouseMaterials]);

    const handleAddMaterials = () => {
        setShowAddDialog(true);
    };

    const handleAddSuccess = () => {
        fetchWarehouseMaterials();
    };

    const totalMaterials = warehouseMaterials.length;
    const lowStockMaterials = warehouseMaterials.filter(m => m.quantity < m.threshold).length;
    const totalQuantity = warehouseMaterials.reduce((sum, m) => sum + m.quantity, 0);

    const warehouseAddress = warehouseMaterials[0]?.warehouseAddress || 'Kho';

    if (loading) {
        return (
            <AdminPageLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="w-8 h-8 border-4 border-[#78A243]/30 border-t-[#78A243] rounded-full animate-spin"></div>
                </div>
            </AdminPageLayout>
        );
    }

    return (
        <AdminPageLayout>
            <AdminPageHeader
                title="Kho & Nguyên liệu"
                description="Quản lý nguyên liệu trong kho"
                icon={WarehouseIcon}
                actions={
                    <Button
                        onClick={handleAddMaterials}
                        className="bg-[#78A243] hover:bg-[#78A243]/90 text-white"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm nguyên liệu
                    </Button>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <AdminCard
                    title="Tổng nguyên liệu"
                    value={totalMaterials}
                    icon={Package}
                />
                <AdminCard
                    title="Sắp hết hàng"
                    value={lowStockMaterials}
                    icon={AlertTriangle}
                />
                <AdminCard
                    title="Tổng số lượng"
                    value={Math.round(totalQuantity)}
                    icon={Package}
                />
            </div>

            <div className="bg-white rounded-xl border-2 border-[#78A243]/20 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-[#78A243]/10 to-[#EBD187]/20 border-b-2 border-[#78A243]/30">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-bold text-[#2D1E1A] uppercase tracking-wider">
                                    Nguyên liệu
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-bold text-[#2D1E1A] uppercase tracking-wider">
                                    Loại
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-bold text-[#2D1E1A] uppercase tracking-wider">
                                    Tồn kho
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-bold text-[#2D1E1A] uppercase tracking-wider">
                                    Ngưỡng
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-bold text-[#2D1E1A] uppercase tracking-wider">
                                    Calo/Đơn vị
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-bold text-[#2D1E1A] uppercase tracking-wider">
                                    Trạng thái
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#78A243]/10">
                            {warehouseMaterials.map((material) => {
                                const isLowStock = material.quantity < material.threshold;
                                const stockPercentage = (material.quantity / material.threshold) * 100;

                                return (
                                    <tr key={material.materialId} className="hover:bg-[#EBD187]/10 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-[#78A243] to-[#DA7339] rounded-lg flex items-center justify-center">
                                                    <Package className="h-5 w-5 text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-[#2D1E1A]">{material.materialName}</p>
                                                    <p className="text-xs text-gray-500">ID: {material.materialId}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge className="bg-[#78A243]/10 text-[#78A243] border-[#78A243]/30">
                                                {material.materialTypeName}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div>
                                                <p className="text-sm font-semibold text-[#2D1E1A]">
                                                    {material.quantity} {material.unit}
                                                </p>
                                                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                                    <div
                                                        className={`h-2 rounded-full ${stockPercentage >= 100 ? 'bg-[#78A243]' :
                                                            stockPercentage >= 50 ? 'bg-[#EBD187]' :
                                                                'bg-[#DA7339]'
                                                            }`}
                                                        style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="text-sm text-[#2D1E1A]">
                                                {material.threshold} {material.unit}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="text-sm text-[#2D1E1A]">
                                                {material.caloriesPerUnit} cal
                                            </p>
                                        </td>
                                        <td className="px-4 py-3">
                                            {isLowStock ? (
                                                <Badge className="bg-[#EBD187]/30 text-[#DA7339] border-[#DA7339]/30">
                                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                                    Sắp hết ({Math.round(stockPercentage)}%)
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-[#78A243]/10 text-[#78A243] border-[#78A243]/30">
                                                    Đủ hàng ({Math.round(stockPercentage)}%)
                                                </Badge>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {warehouseMaterials.length === 0 && (
                    <div className="text-center py-12">
                        <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500">Kho chưa có nguyên liệu nào</p>
                        <Button
                            onClick={handleAddMaterials}
                            variant="outline"
                            className="mt-4 border-2 border-[#78A243]/30 text-[#78A243] hover:bg-[#78A243]/10"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Thêm nguyên liệu đầu tiên
                        </Button>
                    </div>
                )}
            </div>

            {branchId && (
                <AddMaterialDialog
                    open={showAddDialog}
                    onOpenChange={setShowAddDialog}
                    warehouseId={branchId}
                    availableMaterials={allMaterials}
                    onSuccess={handleAddSuccess}
                />
            )}
        </AdminPageLayout>
    );
}
