'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Package, Plus, ArrowLeft, AlertTriangle, Warehouse as WarehouseIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdminPageLayout, AdminPageHeader } from '@/app/admin/components/AdminPageLayout';
import { AdminCard } from '@/app/admin/components/AdminCard';
import { getWarehouseMaterials, getMaterials, type WarehouseMaterial, type Material } from '@/apis/material.api';
import { AddMaterialDialog } from './components/AddMaterialDialog';
import { useRouter } from 'next/navigation';

interface WarehouseMaterialsPageProps {
    params: Promise<{
        warehouseId: string;
    }>;
}

export default function WarehouseMaterialsPage({ params }: WarehouseMaterialsPageProps) {
    const router = useRouter();
    const [warehouseId, setWarehouseId] = useState<number | null>(null);
    const [warehouseMaterials, setWarehouseMaterials] = useState<WarehouseMaterial[]>([]);
    const [allMaterials, setAllMaterials] = useState<Material[]>([]);
    const [loading, setLoading] = useState(true);

    // Dialog states
    const [showAddDialog, setShowAddDialog] = useState(false);

    useEffect(() => {
        params.then(p => {
            setWarehouseId(parseInt(p.warehouseId));
        });
    }, [params]);

    const fetchWarehouseMaterials = useCallback(async () => {
        if (!warehouseId) return;

        try {
            setLoading(true);
            const [warehouseData, allMaterialsResponse] = await Promise.all([
                getWarehouseMaterials(warehouseId),
                getMaterials({ size: 10000 })
            ]);
            setWarehouseMaterials(warehouseData);
            setAllMaterials(allMaterialsResponse.data.content);
        } catch (error) {
            console.error('Failed to fetch warehouse materials:', error);
            toast.error('❌ Không thể tải danh sách nguyên liệu!');
        } finally {
            setLoading(false);
        }
    }, [warehouseId]);

    useEffect(() => {
        if (warehouseId) {
            fetchWarehouseMaterials();
        }
    }, [warehouseId, fetchWarehouseMaterials]);

    const handleAddMaterials = () => {
        setShowAddDialog(true);
    };

    const handleAddSuccess = () => {
        fetchWarehouseMaterials();
    };

    const handleGoBack = () => {
        router.push('/admin/warehouses');
    };

    // Calculate statistics
    const totalMaterials = warehouseMaterials.length;
    const lowStockMaterials = warehouseMaterials.filter(m => m.quantity < m.threshold).length;
    const totalQuantity = warehouseMaterials.reduce((sum, m) => sum + m.quantity, 0);

    const warehouseAddress = warehouseMaterials[0]?.warehouseAddress || 'Kho';

    if (loading) {
        return (
            <AdminPageLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="w-8 h-8 border-4 border-[#78A243]/30 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </AdminPageLayout>
        );
    }

    return (
        <AdminPageLayout>
            <AdminPageHeader
                title={warehouseAddress}
                description="Quản lý nguyên liệu trong kho"
                icon={WarehouseIcon}
                actions={
                    <div className="flex gap-3">
                        <Button
                            onClick={handleGoBack}
                            variant="outline"
                            className="border-2 border-[#78A243]/30"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Quay lại
                        </Button>
                        <Button
                            onClick={handleAddMaterials}
                            className="bg-[#78A243] hover:bg-[#78A243]/90 text-white"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Thêm nguyên liệu
                        </Button>
                    </div>
                }
            />

            {/* Stats */}
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

            {/* Materials Table */}
            <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
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
                        <tbody className="bg-white divide-y divide-gray-200">
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
                            className="mt-4"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Thêm nguyên liệu đầu tiên
                        </Button>
                    </div>
                )}
            </div>

            <AddMaterialDialog
                open={showAddDialog}
                onOpenChange={setShowAddDialog}
                warehouseId={warehouseId || 0}
                availableMaterials={allMaterials}
                onSuccess={handleAddSuccess}
            />
        </AdminPageLayout>
    );
}
