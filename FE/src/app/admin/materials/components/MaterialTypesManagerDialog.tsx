'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Tag, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { getMaterialTypes, createMaterialType, updateMaterialType, deleteMaterialType, type MaterialType } from '@/apis/material.api';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useBodyScrollLock } from '../../components/useBodyScrollLock';

interface MaterialTypesManagerDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function MaterialTypesManagerDialog({ open, onOpenChange }: MaterialTypesManagerDialogProps) {
    const [materialTypes, setMaterialTypes] = useState<MaterialType[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    useBodyScrollLock(open);

    // Inline editing state
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingName, setEditingName] = useState('');

    // Inline creating state
    const [isCreating, setIsCreating] = useState(false);
    const [newTypeName, setNewTypeName] = useState('');

    // Confirm dialog state
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
        if (open) {
            fetchMaterialTypes();
        }
    }, [open, fetchMaterialTypes]);

    const handleCreate = () => {
        setIsCreating(true);
        setNewTypeName('');
    };

    const handleCancelCreate = () => {
        setIsCreating(false);
        setNewTypeName('');
    };

    const handleSaveNewType = async () => {
        if (!newTypeName.trim()) {
            toast.warning('⚠️ Tên loại không được để trống!');
            return;
        }
        try {
            setActionLoading(true);
            await createMaterialType({ name: newTypeName.trim() });
            toast.success('✅ Đã thêm loại nguyên liệu mới!');
            handleCancelCreate();
            await fetchMaterialTypes();
        } catch (error) {
            console.error('Failed to create material type:', error);
            toast.error('❌ Không thể thêm loại nguyên liệu!');
        } finally {
            setActionLoading(false);
        }
    };

    const handleEdit = (type: MaterialType) => {
        setEditingId(type.id);
        setEditingName(type.name);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditingName('');
    };

    const handleSaveUpdate = async (typeId: number) => {
        if (!editingName.trim()) {
            toast.warning('⚠️ Tên loại không được để trống!');
            return;
        }
        try {
            setActionLoading(true);
            await updateMaterialType(typeId, { name: editingName.trim() });
            toast.success('✅ Cập nhật thành công!');
            handleCancelEdit();
            await fetchMaterialTypes();
        } catch (error) {
            console.error('Failed to update material type:', error);
            toast.error('❌ Không thể cập nhật loại nguyên liệu!');
        } finally {
            setActionLoading(false);
        }
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
            // console.error('Failed to delete material type:', error);
            const errorMessage = error instanceof Error ? error.message : '❌ Không thể xóa loại nguyên liệu!';
            toast.error(errorMessage);
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <Tag className="h-6 w-6 text-orange-600" />
                            Quản lý loại nguyên liệu
                        </DialogTitle>
                        <DialogDescription>
                            Thêm, sửa, xóa các loại nguyên liệu trong hệ thống.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex-grow overflow-y-auto pr-2 -mr-6">
                        {loading ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {materialTypes.map((type) => (
                                    <div
                                        key={type.id}
                                        className="bg-white rounded-lg border border-gray-200 p-3 flex items-center justify-between hover:bg-gray-50 transition-colors min-h-[60px]"
                                    >
                                        {editingId === type.id ? (
                                            <>
                                                <input
                                                    type="text"
                                                    value={editingName}
                                                    onChange={(e) => setEditingName(e.target.value)}
                                                    className="flex-grow px-2 py-1 border border-orange-400 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                                                    autoFocus
                                                    onKeyDown={(e) => e.key === 'Enter' && handleSaveUpdate(type.id)}
                                                />
                                                <div className="flex gap-2 ml-2">
                                                    <Button onClick={() => handleSaveUpdate(type.id)} size="sm" className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700" disabled={actionLoading}>
                                                        <Save className="h-4 w-4" />
                                                    </Button>
                                                    <Button onClick={handleCancelEdit} size="sm" variant="outline" className="h-8 w-8 p-0" disabled={actionLoading}>
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 text-sm">{type.name}</h3>
                                                    <p className="text-xs text-gray-500">ID: {type.id}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button onClick={() => handleEdit(type)} size="sm" variant="outline" className="h-8 w-8 p-0" disabled={actionLoading || editingId !== null}>
                                                        <Edit2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button onClick={() => handleDeleteClick(type)} size="sm" variant="outline" className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-600" disabled={actionLoading || editingId !== null}>
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                                {materialTypes.length === 0 && (
                                    <div className="text-center py-12 text-gray-500">
                                        Chưa có loại nguyên liệu nào.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="pt-4 border-t mt-auto">
                        {isCreating ? (
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    placeholder="Nhập tên loại nguyên liệu mới..."
                                    value={newTypeName}
                                    onChange={(e) => setNewTypeName(e.target.value)}
                                    className="w-full px-3 py-2 border border-orange-400 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                                    autoFocus
                                    onKeyDown={(e) => e.key === 'Enter' && handleSaveNewType()}
                                />
                                <div className="flex gap-2">
                                    <Button onClick={handleSaveNewType} className="flex-1 bg-green-600 hover:bg-green-700" disabled={actionLoading}> <Save className="h-4 w-4 mr-2" /> Lưu </Button>
                                    <Button onClick={handleCancelCreate} variant="outline" className="flex-1" disabled={actionLoading}> <X className="h-4 w-4 mr-2" /> Hủy </Button>
                                </div>
                            </div>
                        ) : (
                            <Button onClick={handleCreate} className="w-full bg-[#EC6426] hover:bg-[#EC6426]/90 text-white" disabled={editingId !== null}>
                                <Plus className="h-4 w-4 mr-2" />
                                Thêm loại nguyên liệu mới
                            </Button>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            <ConfirmDialog
                open={showConfirmDialog}
                onOpenChange={setShowConfirmDialog}
                onConfirm={handleConfirmDelete}
                title="Xóa loại nguyên liệu"
                content={`Bạn có chắc chắn muốn xóa loại nguyên liệu "${deletingMaterialType?.name}" không? Hành động này không thể hoàn tác.`}
                variant="destructive"
                loading={actionLoading}
            />
        </>
    );
}
