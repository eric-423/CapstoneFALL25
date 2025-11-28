'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Utensils, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { getUtensilTypes, createUtensilType, updateUtensilType, deleteUtensilType, type UtensilType } from '@/apis/utensil.api';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';

interface UtensilTypesManagerDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export function UtensilTypesManagerDialog({ open, onOpenChange, onSuccess }: UtensilTypesManagerDialogProps) {
    const [types, setTypes] = useState<UtensilType[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    // Inline editing state
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingName, setEditingName] = useState('');
    const [editingDescription, setEditingDescription] = useState('');

    // Inline creating state
    const [isCreating, setIsCreating] = useState(false);
    const [newTypeName, setNewTypeName] = useState('');
    const [newTypeDescription, setNewTypeDescription] = useState('');

    // Confirm dialog state
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [deletingType, setDeletingType] = useState<UtensilType | null>(null);

    const fetchTypes = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getUtensilTypes();
            setTypes(data);
        } catch (error) {
            console.error('Failed to fetch utensil types:', error);
            toast.error('❌ Không thể tải danh sách loại dụng cụ!');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (open) {
            fetchTypes();
        }
    }, [open, fetchTypes]);

    const handleCreate = () => {
        setIsCreating(true);
        setNewTypeName('');
        setNewTypeDescription('');
    };

    const handleCancelCreate = () => {
        setIsCreating(false);
        setNewTypeName('');
        setNewTypeDescription('');
    };

    const handleSaveNewType = async () => {
        if (!newTypeName.trim()) {
            toast.warning('⚠️ Tên loại không được để trống!');
            return;
        }
        try {
            setActionLoading(true);
            await createUtensilType({
                name: newTypeName.trim(),
                description: newTypeDescription.trim()
            });
            toast.success('✅ Đã thêm loại dụng cụ mới!');
            handleCancelCreate();
            await fetchTypes();
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Failed to create utensil type:', error);
            toast.error('❌ Không thể thêm loại dụng cụ!');
        } finally {
            setActionLoading(false);
        }
    };

    const handleEdit = (type: UtensilType) => {
        setEditingId(type.id);
        setEditingName(type.name);
        setEditingDescription(type.description || '');
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditingName('');
        setEditingDescription('');
    };

    const handleSaveUpdate = async (typeId: number) => {
        if (!editingName.trim()) {
            toast.warning('⚠️ Tên loại không được để trống!');
            return;
        }
        try {
            setActionLoading(true);
            await updateUtensilType(typeId, {
                name: editingName.trim(),
                description: editingDescription.trim()
            });
            toast.success('✅ Cập nhật thành công!');
            handleCancelEdit();
            await fetchTypes();
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Failed to update utensil type:', error);
            toast.error('❌ Không thể cập nhật loại dụng cụ!');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteClick = (type: UtensilType) => {
        setDeletingType(type);
        setShowConfirmDialog(true);
    };

    const handleConfirmDelete = async () => {
        if (!deletingType) return;
        try {
            setActionLoading(true);
            await deleteUtensilType(deletingType.id);
            toast.success(`✅ Đã xóa loại "${deletingType.name}"!`);
            await fetchTypes();
            setShowConfirmDialog(false);
            setDeletingType(null);
            if (onSuccess) onSuccess();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '❌ Không thể xóa loại dụng cụ!';
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
                            <Utensils className="h-6 w-6 text-[#78A243]" />
                            Quản lý loại dụng cụ
                        </DialogTitle>
                        <DialogDescription>
                            Thêm, sửa, xóa các loại dụng cụ trong hệ thống.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex-grow overflow-y-auto pr-2 -mr-6">
                        {loading ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="w-8 h-8 border-4 border-[#78A243] border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {types.map((type) => (
                                    <div
                                        key={type.id}
                                        className="bg-white rounded-lg border border-gray-200 p-3 flex items-center justify-between hover:bg-gray-50 transition-colors min-h-[60px]"
                                    >
                                        {editingId === type.id ? (
                                            <>
                                                <div className="flex-grow flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={editingName}
                                                        onChange={(e) => setEditingName(e.target.value)}
                                                        className="flex-1 px-2 py-1 border border-[#78A243] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#78A243]/50"
                                                        placeholder="Tên loại"
                                                        autoFocus
                                                        onKeyDown={(e) => e.key === 'Enter' && handleSaveUpdate(type.id)}
                                                    />
                                                    <input
                                                        type="text"
                                                        value={editingDescription}
                                                        onChange={(e) => setEditingDescription(e.target.value)}
                                                        className="flex-1 px-2 py-1 border border-[#78A243] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#78A243]/50"
                                                        placeholder="Mô tả"
                                                        onKeyDown={(e) => e.key === 'Enter' && handleSaveUpdate(type.id)}
                                                    />
                                                </div>
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
                                                    {type.description && (
                                                        <p className="text-xs text-gray-500">{type.description}</p>
                                                    )}
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
                                {types.length === 0 && (
                                    <div className="text-center py-12 text-gray-500">
                                        Chưa có loại dụng cụ nào.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="pt-4 border-t mt-auto">
                        {isCreating ? (
                            <div className="space-y-2">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Tên loại (VD: Dao)"
                                        value={newTypeName}
                                        onChange={(e) => setNewTypeName(e.target.value)}
                                        className="flex-1 px-3 py-2 border border-[#78A243] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#78A243]/50"
                                        autoFocus
                                        onKeyDown={(e) => e.key === 'Enter' && handleSaveNewType()}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Mô tả (VD: Các loại dao bếp)"
                                        value={newTypeDescription}
                                        onChange={(e) => setNewTypeDescription(e.target.value)}
                                        className="flex-1 px-3 py-2 border border-[#78A243] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#78A243]/50"
                                        onKeyDown={(e) => e.key === 'Enter' && handleSaveNewType()}
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button onClick={handleSaveNewType} className="flex-1 bg-green-600 hover:bg-green-700" disabled={actionLoading}> <Save className="h-4 w-4 mr-2" /> Lưu </Button>
                                    <Button onClick={handleCancelCreate} variant="outline" className="flex-1" disabled={actionLoading}> <X className="h-4 w-4 mr-2" /> Hủy </Button>
                                </div>
                            </div>
                        ) : (
                            <Button onClick={handleCreate} className="w-full bg-[#78A243] hover:bg-[#78A243]/90 text-white" disabled={editingId !== null}>
                                <Plus className="h-4 w-4 mr-2" />
                                Thêm loại mới
                            </Button>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            <ConfirmDialog
                open={showConfirmDialog}
                onOpenChange={setShowConfirmDialog}
                onConfirm={handleConfirmDelete}
                title="Xóa loại dụng cụ"
                content={`Bạn có chắc chắn muốn xóa loại "${deletingType?.name}" không? Hành động này không thể hoàn tác.`}
                variant="destructive"
                loading={actionLoading}
            />
        </>
    );
}
