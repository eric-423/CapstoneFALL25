'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Ruler, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { getUnits, createUnit, updateUnit, deleteUnit, type Unit } from '@/apis/unit.api';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';

interface UnitsManagerDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function UnitsManagerDialog({ open, onOpenChange }: UnitsManagerDialogProps) {
    const [units, setUnits] = useState<Unit[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    // Inline editing state
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingName, setEditingName] = useState('');
    const [editingSymbols, setEditingSymbols] = useState('');

    // Inline creating state
    const [isCreating, setIsCreating] = useState(false);
    const [newUnitName, setNewUnitName] = useState('');
    const [newUnitSymbols, setNewUnitSymbols] = useState('');

    // Confirm dialog state
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [deletingUnit, setDeletingUnit] = useState<Unit | null>(null);

    const fetchUnits = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getUnits();
            setUnits(data);
        } catch (error) {
            console.error('Failed to fetch units:', error);
            toast.error('❌ Không thể tải danh sách đơn vị!');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (open) {
            fetchUnits();
        }
    }, [open, fetchUnits]);

    const handleCreate = () => {
        setIsCreating(true);
        setNewUnitName('');
        setNewUnitSymbols('');
    };

    const handleCancelCreate = () => {
        setIsCreating(false);
        setNewUnitName('');
        setNewUnitSymbols('');
    };

    const handleSaveNewUnit = async () => {
        if (!newUnitName.trim()) {
            toast.warning('⚠️ Tên đơn vị không được để trống!');
            return;
        }
        if (!newUnitSymbols.trim()) {
            toast.warning('⚠️ Ký hiệu không được để trống!');
            return;
        }
        try {
            setActionLoading(true);
            await createUnit({ name: newUnitName.trim(), symbols: newUnitSymbols.trim() });
            toast.success('✅ Đã thêm đơn vị mới!');
            handleCancelCreate();
            await fetchUnits();
        } catch (error) {
            console.error('Failed to create unit:', error);
            toast.error('❌ Không thể thêm đơn vị!');
        } finally {
            setActionLoading(false);
        }
    };

    const handleEdit = (unit: Unit) => {
        setEditingId(unit.id);
        setEditingName(unit.name);
        setEditingSymbols(unit.symbols);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditingName('');
        setEditingSymbols('');
    };

    const handleSaveUpdate = async (unitId: number) => {
        if (!editingName.trim()) {
            toast.warning('⚠️ Tên đơn vị không được để trống!');
            return;
        }
        if (!editingSymbols.trim()) {
            toast.warning('⚠️ Ký hiệu không được để trống!');
            return;
        }
        try {
            setActionLoading(true);
            await updateUnit(unitId, { name: editingName.trim(), symbols: editingSymbols.trim() });
            toast.success('✅ Cập nhật thành công!');
            handleCancelEdit();
            await fetchUnits();
        } catch (error) {
            console.error('Failed to update unit:', error);
            toast.error('❌ Không thể cập nhật đơn vị!');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteClick = (unit: Unit) => {
        setDeletingUnit(unit);
        setShowConfirmDialog(true);
    };

    const handleConfirmDelete = async () => {
        if (!deletingUnit) return;
        try {
            setActionLoading(true);
            await deleteUnit(deletingUnit.id);
            toast.success(`✅ Đã xóa đơn vị "${deletingUnit.name}"!`);
            await fetchUnits();
            setShowConfirmDialog(false);
            setDeletingUnit(null);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '❌ Không thể xóa đơn vị!';
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
                            <Ruler className="h-6 w-6 text-[#78A243]" />
                            Quản lý đơn vị tính
                        </DialogTitle>
                        <DialogDescription>
                            Thêm, sửa, xóa các đơn vị tính trong hệ thống.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex-grow overflow-y-auto pr-2 -mr-6">
                        {loading ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="w-8 h-8 border-4 border-[#78A243] border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {units.map((unit) => (
                                    <div
                                        key={unit.id}
                                        className="bg-white rounded-lg border border-gray-200 p-3 flex items-center justify-between hover:bg-gray-50 transition-colors min-h-[60px]"
                                    >
                                        {editingId === unit.id ? (
                                            <>
                                                <div className="flex-grow flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={editingName}
                                                        onChange={(e) => setEditingName(e.target.value)}
                                                        className="flex-1 px-2 py-1 border border-[#78A243] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#78A243]/50"
                                                        placeholder="Tên đơn vị"
                                                        autoFocus
                                                        onKeyDown={(e) => e.key === 'Enter' && handleSaveUpdate(unit.id)}
                                                    />
                                                    <input
                                                        type="text"
                                                        value={editingSymbols}
                                                        onChange={(e) => setEditingSymbols(e.target.value)}
                                                        className="w-24 px-2 py-1 border border-[#78A243] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#78A243]/50"
                                                        placeholder="Ký hiệu"
                                                        onKeyDown={(e) => e.key === 'Enter' && handleSaveUpdate(unit.id)}
                                                    />
                                                </div>
                                                <div className="flex gap-2 ml-2">
                                                    <Button onClick={() => handleSaveUpdate(unit.id)} size="sm" className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700" disabled={actionLoading}>
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
                                                    <h3 className="font-semibold text-gray-900 text-sm">{unit.name}</h3>
                                                    <p className="text-xs text-gray-500">Ký hiệu: {unit.symbols}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button onClick={() => handleEdit(unit)} size="sm" variant="outline" className="h-8 w-8 p-0" disabled={actionLoading || editingId !== null}>
                                                        <Edit2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button onClick={() => handleDeleteClick(unit)} size="sm" variant="outline" className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-600" disabled={actionLoading || editingId !== null}>
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                                {units.length === 0 && (
                                    <div className="text-center py-12 text-gray-500">
                                        Chưa có đơn vị tính nào.
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
                                        placeholder="Tên đơn vị (VD: Kilogam)"
                                        value={newUnitName}
                                        onChange={(e) => setNewUnitName(e.target.value)}
                                        className="flex-1 px-3 py-2 border border-[#78A243] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#78A243]/50"
                                        autoFocus
                                        onKeyDown={(e) => e.key === 'Enter' && handleSaveNewUnit()}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Ký hiệu (VD: kg)"
                                        value={newUnitSymbols}
                                        onChange={(e) => setNewUnitSymbols(e.target.value)}
                                        className="w-32 px-3 py-2 border border-[#78A243] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#78A243]/50"
                                        onKeyDown={(e) => e.key === 'Enter' && handleSaveNewUnit()}
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button onClick={handleSaveNewUnit} className="flex-1 bg-green-600 hover:bg-green-700" disabled={actionLoading}> <Save className="h-4 w-4 mr-2" /> Lưu </Button>
                                    <Button onClick={handleCancelCreate} variant="outline" className="flex-1" disabled={actionLoading}> <X className="h-4 w-4 mr-2" /> Hủy </Button>
                                </div>
                            </div>
                        ) : (
                            <Button onClick={handleCreate} className="w-full bg-[#78A243] hover:bg-[#78A243]/90 text-white" disabled={editingId !== null}>
                                <Plus className="h-4 w-4 mr-2" />
                                Thêm đơn vị mới
                            </Button>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            <ConfirmDialog
                open={showConfirmDialog}
                onOpenChange={setShowConfirmDialog}
                onConfirm={handleConfirmDelete}
                title="Xóa đơn vị tính"
                content={`Bạn có chắc chắn muốn xóa đơn vị "${deletingUnit?.name}" không? Hành động này không thể hoàn tác.`}
                variant="destructive"
                loading={actionLoading}
            />
        </>
    );
}
