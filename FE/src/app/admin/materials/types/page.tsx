'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Tag, Plus, Edit2, Trash2, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdminPageLayout, AdminPageHeader } from '../../components/AdminPageLayout';
import { getMaterialTypes, deleteMaterialType, type MaterialType } from '@/apis/material.api';
import { MaterialTypeFormDialog } from './components/MaterialTypeFormDialog';
import { MaterialTypeConfirmDialog } from './components/MaterialTypeConfirmDialog';
import { useRouter } from 'next/navigation';

export default function MaterialTypesPage() {
    const router = useRouter();
    const [materialTypes, setMaterialTypes] = useState<MaterialType[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    // Dialog states
    const [showFormDialog, setShowFormDialog] = useState(false);
    const [editingMaterialType, setEditingMaterialType] = useState<MaterialType | null>(null);

    // Confirm dialog states
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [deletingMaterialType, setDeletingMaterialType] = useState<MaterialType | null>(null);

    const fetchMaterialTypes = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getMaterialTypes(false);
            setMaterialTypes(data);
        } catch (error) {
            console.error('Failed to fetch material types:', error);
            toast.error('❌ Không thể tải danh sách loại nguyên liệu!');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMaterialTypes();
    }, [fetchMaterialTypes]);

    const handleCreate = () => {
        setEditingMaterialType(null);
        setShowFormDialog(true);
    };

    const handleEdit = (materialType: MaterialType) => {
        setEditingMaterialType(materialType);
        setShowFormDialog(true);
    };

    const handleDeleteClick = (materialType: MaterialType) => {
        setDeletingMaterialType(materialType);
        setShowConfirmDialog(true);
    };

    const handleConfirmDelete = async () => {
        if (!deletingMaterialType) return;

        try {
            setActionLoading(true);
            await deleteMaterialType(deletingMaterialType.id);
            toast.success(`✅ Đã xóa loại nguyên liệu "${deletingMaterialType.name}"!`);
            await fetchMaterialTypes();
            setShowConfirmDialog(false);
            setDeletingMaterialType(null);
        } catch (error) {
            console.error('Failed to delete material type:', error);
            toast.error('❌ Không thể xóa loại nguyên liệu!');
        } finally {
            setActionLoading(false);
        }
    };

    const handleFormSuccess = () => {
        fetchMaterialTypes();
    };

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
                title="Quản lý loại nguyên liệu"
                description="Quản lý các loại nguyên liệu trong hệ thống"
                icon={Tag}
                actions={
                    <div className="flex gap-2">
                        <Button
                            onClick={() => router.push('/admin/materials')}
                            variant="outline"
                            className="border-2 border-gray-300"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Quay lại
                        </Button>
                        <Button
                            onClick={handleCreate}
                            className="bg-gradient-to-r from-[#EC6426] to-[#F8A91F] hover:from-[#EC6426]/90 hover:to-[#F8A91F]/90 text-white"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Thêm loại nguyên liệu
                        </Button>
                    </div>
                }
            />

            {/* Material Types Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {materialTypes.map((type) => (
                    <div
                        key={type.id}
                        className="bg-white rounded-xl border-2 border-gray-200 p-5 hover:shadow-lg transition-all duration-200 hover:border-orange-300"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center">
                                <Tag className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => handleEdit(type)}
                                    size="sm"
                                    variant="outline"
                                    className="text-orange-600 border-orange-200 hover:bg-orange-50 h-8 w-8 p-0"
                                    disabled={actionLoading}
                                >
                                    <Edit2 className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                    onClick={() => handleDeleteClick(type)}
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
                            <h3 className="font-bold text-gray-900 text-lg mb-1">{type.name}</h3>
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
                <div className="text-center py-12 bg-white rounded-xl border-2 border-gray-200">
                    <Tag className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">Chưa có loại nguyên liệu nào</p>
                </div>
            )}

            <MaterialTypeFormDialog
                open={showFormDialog}
                onOpenChange={setShowFormDialog}
                materialType={editingMaterialType}
                onSuccess={handleFormSuccess}
            />

            <MaterialTypeConfirmDialog
                open={showConfirmDialog}
                onOpenChange={setShowConfirmDialog}
                onConfirm={handleConfirmDelete}
                materialTypeName={deletingMaterialType?.name || ''}
                loading={actionLoading}
            />
        </AdminPageLayout>
    );
}
