'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Package, Plus, ArrowLeft, AlertTriangle, Warehouse as WarehouseIcon, Pencil, Search, X, FileSpreadsheet } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdminPageLayout, AdminPageHeader } from '@/app/admin/components/AdminPageLayout';
import { FilterDropdown } from '@/app/admin/components/FilterDropdown';
import { AdminCard } from '@/app/admin/components/AdminCard';
import { getWarehouseMaterials, getMaterials, type WarehouseMaterial, type Material } from '@/apis/material.api';
import { AddMaterialDialog } from './components/AddMaterialDialog';
import { EditMaterialDialog } from './components/EditMaterialDialog';
import { ImportMaterialDialog } from './components/ImportMaterialDialog';
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
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showImportDialog, setShowImportDialog] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState<WarehouseMaterial | null>(null);

    // Filter states
    const [searchKeyword, setSearchKeyword] = useState('');
    const [typeFilter, setTypeFilter] = useState('');

    // Hide main page scrollbar when any dialog is open
    useEffect(() => {
        const isAnyDialogOpen = showAddDialog || showEditDialog || showImportDialog;
        if (isAnyDialogOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [showAddDialog, showEditDialog, showImportDialog]);

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

    const handleImportMaterials = () => {
        setShowImportDialog(true);
    };

    const handleAddSuccess = () => {
        fetchWarehouseMaterials();
    };

    const handleImportSuccess = () => {
        fetchWarehouseMaterials();
    };

    const handleEditMaterial = (material: WarehouseMaterial) => {
        setSelectedMaterial(material);
        setShowEditDialog(true);
    };

    const handleEditSuccess = () => {
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

    // Get unique material types for filter dropdown
    const materialTypes = useMemo(() => {
        const types = [...new Set(warehouseMaterials.map(m => m.materialTypeName))];
        return types.map(type => ({ value: type, label: type }));
    }, [warehouseMaterials]);

    // Filter materials
    const filteredMaterials = useMemo(() => {
        return warehouseMaterials.filter(material => {
            const matchesKeyword = !searchKeyword ||
                material.materialName.toLowerCase().includes(searchKeyword.toLowerCase());
            const matchesType = !typeFilter || material.materialTypeName === typeFilter;
            return matchesKeyword && matchesType;
        });
    }, [warehouseMaterials, searchKeyword, typeFilter]);

    const handleClearFilters = () => {
        setSearchKeyword('');
        setTypeFilter('');
    };

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
                            onClick={handleImportMaterials}
                            variant="outline"
                            className="border-2 border-[#DA7339]/30 text-[#DA7339] hover:bg-[#DA7339]/10 hover:border-[#DA7339]"
                        >
                            <FileSpreadsheet className="h-4 w-4 mr-2" />
                            Import Excel
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

            {/* Filters */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-gradient-to-r from-[#EBD187]/20 to-[#78A243]/10 backdrop-blur-sm border-[#78A243]/20 border shadow-sm rounded-xl mb-4">
                <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[200px]">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#2D1E1A]/60" />
                        <input
                            type="text"
                            placeholder="Tìm theo tên nguyên liệu..."
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            className="w-full max-w-[280px] pl-10 pr-4 py-2 border bg-white/80 border-[#78A243]/30 rounded-lg text-sm focus:border-[#78A243] focus:ring-1 focus:ring-[#78A243]/20 outline-none"
                        />
                    </div>
                    <FilterDropdown
                        label="Tất cả loại"
                        title="Lọc theo loại nguyên liệu"
                        value={typeFilter}
                        onChange={(value) => setTypeFilter(value)}
                        items={materialTypes}
                        className="w-[180px]"
                    />

                    {(searchKeyword || typeFilter) && (
                        <Button
                            onClick={handleClearFilters}
                            variant="ghost"
                            size="sm"
                        >
                            <X className="h-4 w-4 mr-1" />
                            Xóa lọc
                        </Button>
                    )}
                </div>
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
                                    Trạng thái
                                </th>
                                <th className="px-4 py-3 text-center text-sm font-bold text-[#2D1E1A] uppercase tracking-wider">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredMaterials.map((material) => {
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
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleEditMaterial(material)}
                                                    className="border-[#78A243]/30 hover:bg-[#78A243]/10 hover:border-[#78A243]"
                                                    title="Sửa nguyên liệu"
                                                >
                                                    <Pencil className="h-4 w-4 text-[#78A243]" />
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
                        <p className="text-gray-500">
                            {warehouseMaterials.length === 0
                                ? 'Kho chưa có nguyên liệu nào'
                                : 'Không tìm thấy nguyên liệu phù hợp'}
                        </p>
                        {warehouseMaterials.length === 0 && (
                            <Button
                                onClick={handleAddMaterials}
                                variant="outline"
                                className="mt-4"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Thêm nguyên liệu đầu tiên
                            </Button>
                        )}
                    </div>
                )}
            </div>

            <AddMaterialDialog
                open={showAddDialog}
                onOpenChange={setShowAddDialog}
                warehouseId={warehouseId || 0}
                availableMaterials={allMaterials}
                existingMaterialIds={warehouseMaterials.map(m => m.materialId)}
                onSuccess={handleAddSuccess}
            />

            <EditMaterialDialog
                open={showEditDialog}
                onOpenChange={setShowEditDialog}
                warehouseId={warehouseId || 0}
                material={selectedMaterial}
                onSuccess={handleEditSuccess}
            />

            <ImportMaterialDialog
                open={showImportDialog}
                onOpenChange={setShowImportDialog}
                warehouseId={warehouseId || 0}
                availableMaterials={allMaterials}
                existingMaterialIds={warehouseMaterials.map(m => m.materialId)}
                onSuccess={handleImportSuccess}
            />
        </AdminPageLayout>
    );
}
