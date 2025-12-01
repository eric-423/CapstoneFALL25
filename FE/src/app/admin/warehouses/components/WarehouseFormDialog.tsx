'use client';

import React, { useState, useEffect } from 'react';
import { X, MapPin } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { AddressAutocomplete } from '@/components/common/address-autocomplete';
import { createWarehouse, updateWarehouse, type Warehouse } from '@/apis/material.api';
import { type Branch } from '@/apis/branch.api';
import { useBodyScrollLock } from '../../components/useBodyScrollLock';
import { AdminSelect } from '../../components/AdminSelect';

interface WarehouseFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    warehouse: Warehouse | null;
    onSuccess: () => void;
    initialBranchId?: number;
    initialAddress?: string;
    existingBranchIds?: number[];
    branches: Branch[];
    warehouses: Warehouse[];
}

export function WarehouseFormDialog({
    open,
    onOpenChange,
    warehouse,
    onSuccess,
    initialBranchId,
    initialAddress,
    existingBranchIds = [],
    branches,
    warehouses
}: WarehouseFormDialogProps) {
    const [loading, setLoading] = useState(false);
    useBodyScrollLock(open);
    const [formData, setFormData] = useState(() => {
        if (warehouse) {
            return {
                address: warehouse.address,
                branchId: warehouse.branchId.toString(),
                isActive: warehouse.isActive ?? true,
            };
        }
        return {
            address: initialAddress || '',
            branchId: initialBranchId?.toString() || '',
            isActive: true,
        };
    });

    useEffect(() => {
        if (!open) return;

        // If editing an existing warehouse, use its values
        if (warehouse) {
            setFormData({
                address: warehouse.address,
                branchId: warehouse.branchId.toString(),
                isActive: warehouse.isActive ?? true,
            });
            return;
        }

        // For create mode: prefer initialBranchId/initialAddress but only set branchId
        // when the corresponding branch is present in `branches` so the Select can display it.
        const branchExists = typeof initialBranchId === 'number' && branches.some(b => b.id === initialBranchId);

        setFormData({
            address: initialAddress || (branchExists ? (branches.find(b => b.id === initialBranchId)?.address ?? '') : ''),
            branchId: branchExists ? String(initialBranchId) : '',
            isActive: true,
        });
    }, [open, warehouse, initialBranchId, initialAddress, branches]);

    // When opening in edit mode, ensure the warehouse's branch is preselected even if the form state was reset
    useEffect(() => {
        if (!open || !warehouse) return;
        if (formData.branchId) return;

        setFormData(prev => ({
            ...prev,
            branchId: warehouse.branchId?.toString() || '',
            address: prev.address || warehouse.address || '',
            isActive: warehouse.isActive ?? true,
        }));
    }, [open, warehouse, formData.branchId]);

    // If branches arrive after the dialog opened (quick-create flow), set the branchId
    // when we detect the branch exists in the loaded `branches` list.
    useEffect(() => {
        if (!open || warehouse) return;
        if (!initialBranchId) return;

        const branchExists = branches.some(b => b.id === initialBranchId);
        if (branchExists && formData.branchId !== String(initialBranchId)) {
            setFormData(prev => ({ ...prev, branchId: String(initialBranchId), address: prev.address || (branches.find(b => b.id === initialBranchId)?.address ?? '') }));
        }
    }, [open, warehouse, initialBranchId, branches, formData.branchId]);

    // Filter branches: show only branches that don't have a warehouse yet, 
    // OR the branch of the current warehouse being edited
    let availableBranches = branches.filter(branch => {
        // If editing, always keep the current warehouse's branch
        if (warehouse && String(warehouse.branchId) === String(branch.id)) return true;
        // If initialBranchId is provided (quick-create), keep that branch even if it's in existingBranchIds
        if (initialBranchId && String(branch.id) === String(initialBranchId)) return true;
        // Otherwise, exclude branches that already have a warehouse
        return !existingBranchIds.map(String).includes(String(branch.id));
    });

    // For editing mode: ensure the current warehouse's branch is always included
    // even if it's not in the branches array (handles stale data scenarios)
    if (warehouse && warehouse.branchId) {
        const currentBranchId = warehouse.branchId.toString();
        const hasCurrentBranch = availableBranches.some(b => String(b.id) === currentBranchId);

        if (!hasCurrentBranch) {
            // Add the current branch as a fallback with warehouse data
            const fallbackBranch = {
                id: warehouse.branchId,
                name: `${warehouse.branchName || `Chi nhánh ID ${warehouse.branchId}`} [Không có trong danh sách]`,
                address: warehouse.branchAddress || '',
                phone: '',
                active: true,
                parent: false,
                _isFallback: true // Internal flag to identify fallback branches
            };
            availableBranches = [fallbackBranch, ...availableBranches];
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.address.trim() || !formData.branchId) {
            toast.error('❌ Vui lòng điền đầy đủ thông tin!');
            return;
        }

        const normalizedAddress = formData.address.trim().toLowerCase();

        // Check for duplicate address in other warehouses
        const duplicateWarehouse = warehouses.find(w =>
            w.address.trim().toLowerCase() === normalizedAddress &&
            (!warehouse || w.id !== warehouse.id)
        );

        if (duplicateWarehouse) {
            toast.error(`❌ Địa chỉ này đã được sử dụng bởi kho khác (ID: ${duplicateWarehouse.id})!`);
            return;
        }

        // Check for duplicate address in branches
        const duplicateBranch = branches.find(b =>
            b.address.trim().toLowerCase() === normalizedAddress
        );

        // Note: It's acceptable if the warehouse address matches its OWN branch address
        // But we should warn if it matches ANOTHER branch's address
        if (duplicateBranch && String(duplicateBranch.id) !== formData.branchId) {
            toast.error(`❌ Địa chỉ này đã được sử dụng bởi chi nhánh "${duplicateBranch.name}"!`);
            return;
        }

        try {
            setLoading(true);

            const requestData = {
                address: formData.address.trim(),
                branchId: parseInt(formData.branchId),
                isActive: formData.isActive,
            };

            if (warehouse) {
                await updateWarehouse(warehouse.id, requestData);
                toast.success('✅ Cập nhật kho thành công!');
            } else {
                await createWarehouse(requestData);
                toast.success('✅ Thêm kho thành công!');
            }

            onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error('Failed to save warehouse:', error);
            toast.error('❌ Không thể lưu kho!');
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl bg-white shadow-2xl rounded-2xl overflow-hidden py-0">
                {/* Header */}
                <div className="bg-[#78A243] p-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-white">
                            {warehouse ? 'Chỉnh sửa kho' : 'Thêm kho mới'}
                        </h2>
                        <button
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
                        >
                            <X className="h-6 w-6 text-white" />
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-6">
                        {/* Chi nhánh */}
                        <div>
                            <Label htmlFor="branchId" className="text-sm font-semibold text-[#2D1E1A]">
                                Chi nhánh <span className="text-red-500">*</span>
                            </Label>
                            <AdminSelect
                                value={formData.branchId}
                                onValueChange={(value) => setFormData({ ...formData, branchId: value })}
                                disabled={loading}
                                placeholder={warehouse?.branchName || "Chọn chi nhánh"}
                                className="mt-2"
                                options={availableBranches.map((branch) => ({
                                    value: branch.id.toString(),
                                    label: branch.name,
                                    subLabel: branch.address || undefined
                                }))}
                            />
                        </div>

                        {/* Địa chỉ */}
                        <div>
                            <Label htmlFor="address" className="text-sm font-semibold text-[#2D1E1A]">
                                Địa chỉ kho <span className="text-red-500">*</span>
                            </Label>
                            <div className="mt-2 space-y-2">
                                <AddressAutocomplete
                                    value={formData.address}
                                    onChange={(value) => setFormData({ ...formData, address: value })}
                                    placeholder="VD: 123 Nguyễn Huệ, Phường Bến Thành, Quận 1, TP.HCM"
                                    rows={3}
                                    disabled={loading}
                                />
                                {formData.branchId && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            const selectedBranch = branches.find(b => b.id.toString() === formData.branchId);
                                            if (selectedBranch) {
                                                setFormData({ ...formData, address: selectedBranch.address });
                                                toast.success('✅ Đã sử dụng địa chỉ chi nhánh');
                                            }
                                        }}
                                        disabled={loading}
                                        className="text-[#78A243] border-[#78A243]/30 hover:bg-[#78A243]/10"
                                    >
                                        <MapPin className="h-3 w-3 mr-1" />
                                        Sử dụng địa chỉ chi nhánh
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Trạng thái */}
                        <div>
                            <Label htmlFor="isActive" className="text-sm font-semibold text-[#2D1E1A]">
                                Trạng thái
                            </Label>
                            <AdminSelect
                                value={formData.isActive.toString()}
                                onValueChange={(value) => setFormData({ ...formData, isActive: value === 'true' })}
                                disabled={loading}
                                placeholder="Chọn trạng thái"
                                className="mt-2"
                                options={[
                                    { value: 'true', label: 'Hoạt động' },
                                    { value: 'false', label: 'Ngừng hoạt động' },
                                ]}
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 flex gap-3 justify-end border-t pt-6">
                        <Button
                            type="button"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                            variant="outline"
                            className="px-6"
                        >
                            Hủy bỏ
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="px-6 bg-[#78A243] hover:bg-[#78A243]/90 text-white"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Đang lưu...
                                </>
                            ) : (
                                warehouse ? 'Cập nhật' : 'Thêm mới'
                            )}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
