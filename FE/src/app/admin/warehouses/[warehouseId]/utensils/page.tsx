'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Utensils, Plus, ArrowLeft, Warehouse as WarehouseIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdminPageLayout, AdminPageHeader } from '@/app/admin/components/AdminPageLayout';
import { AdminCard } from '@/app/admin/components/AdminCard';
import { getCookingUtensils, getUtensilTypes, type CookingUtensil, type UtensilType } from '@/apis/utensil.api';
import { AddUtensilDialog } from './components/AddUtensilDialog';
import { UtensilTypesManagerDialog } from './components/UtensilTypesManagerDialog';
import { useRouter } from 'next/navigation';

interface WarehouseUtensilsPageProps {
    params: Promise<{
        warehouseId: string;
    }>;
}

export default function WarehouseUtensilsPage({ params }: WarehouseUtensilsPageProps) {
    const router = useRouter();
    const [warehouseId, setWarehouseId] = useState<number | null>(null);
    const [warehouseUtensils, setWarehouseUtensils] = useState<CookingUtensil[]>([]);
    const [utensilTypes, setUtensilTypes] = useState<UtensilType[]>([]);
    const [loading, setLoading] = useState(true);

    // Dialog states
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showTypeManagerDialog, setShowTypeManagerDialog] = useState(false);

    useEffect(() => {
        params.then(p => {
            setWarehouseId(parseInt(p.warehouseId));
        });
    }, [params]);

    const fetchData = useCallback(async () => {
        if (!warehouseId) return;

        try {
            setLoading(true);
            const [utensilsResponse, types] = await Promise.all([
                getCookingUtensils({ warehouseId, size: 1000 }),
                getUtensilTypes()
            ]);
            setWarehouseUtensils(utensilsResponse.data.content);
            setUtensilTypes(types);
        } catch (error) {
            console.error('Failed to fetch data:', error);
            toast.error('❌ Không thể tải dữ liệu!');
        } finally {
            setLoading(false);
        }
    }, [warehouseId]);

    useEffect(() => {
        if (warehouseId) {
            fetchData();
        }
    }, [warehouseId, fetchData]);

    const handleAddUtensils = () => {
        setShowAddDialog(true);
    };

    const handleManageTypes = () => {
        setShowTypeManagerDialog(true);
    };

    const handleAddSuccess = () => {
        fetchData();
    };

    const handleTypeManagerSuccess = () => {
        fetchData();
    };

    const handleGoBack = () => {
        router.push('/admin/warehouses');
    };

    // Calculate statistics
    const totalUtensils = warehouseUtensils.length;
    const totalQuantity = warehouseUtensils.reduce((sum, u) => sum + u.quantity, 0);
    const warehouseName = warehouseUtensils[0]?.warehouseName || 'Kho';

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
                title={`${warehouseName} - Dụng cụ`}
                description="Quản lý dụng cụ bếp trong kho"
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
                            onClick={handleManageTypes}
                            variant="outline"
                            className="border-2 border-[#78A243]/30 text-[#78A243] hover:bg-[#78A243]/10"
                        >
                            <Utensils className="h-4 w-4 mr-2" />
                            Quản lý loại
                        </Button>
                        <Button
                            onClick={handleAddUtensils}
                            className="bg-[#78A243] hover:bg-[#78A243]/90 text-white"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Thêm dụng cụ
                        </Button>
                    </div>
                }
            />

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <AdminCard
                    title="Tổng loại dụng cụ"
                    value={totalUtensils}
                    icon={Utensils}
                />
                <AdminCard
                    title="Tổng số lượng"
                    value={Math.round(totalQuantity)}
                    icon={Utensils}
                />
            </div>

            {/* Utensils Table */}
            <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-[#78A243]/10 to-[#EBD187]/20 border-b-2 border-[#78A243]/30">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-bold text-[#2D1E1A] uppercase tracking-wider">
                                    Dụng cụ
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-bold text-[#2D1E1A] uppercase tracking-wider">
                                    Loại
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-bold text-[#2D1E1A] uppercase tracking-wider">
                                    Số lượng
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {warehouseUtensils.map((utensil) => (
                                <tr key={utensil.id} className="hover:bg-[#EBD187]/10 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-[#78A243] to-[#DA7339] rounded-lg flex items-center justify-center">
                                                <Utensils className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-[#2D1E1A]">{utensil.name}</p>
                                                <p className="text-xs text-gray-500">ID: {utensil.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge className="bg-[#78A243]/10 text-[#78A243] border-[#78A243]/30">
                                            {utensil.utensilsTypeName}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="text-sm font-semibold text-[#2D1E1A]">
                                            {utensil.quantity}
                                        </p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {warehouseUtensils.length === 0 && (
                    <div className="text-center py-12">
                        <Utensils className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500">Kho chưa có dụng cụ nào</p>
                        <Button
                            onClick={handleAddUtensils}
                            variant="outline"
                            className="mt-4"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Thêm dụng cụ đầu tiên
                        </Button>
                    </div>
                )}
            </div>

            <AddUtensilDialog
                open={showAddDialog}
                onOpenChange={setShowAddDialog}
                warehouseId={warehouseId || 0}
                utensilTypes={utensilTypes}
                onSuccess={handleAddSuccess}
            />

            <UtensilTypesManagerDialog
                open={showTypeManagerDialog}
                onOpenChange={setShowTypeManagerDialog}
                onSuccess={handleTypeManagerSuccess}
            />
        </AdminPageLayout>
    );
}
