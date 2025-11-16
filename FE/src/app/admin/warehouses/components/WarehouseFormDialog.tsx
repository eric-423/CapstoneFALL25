'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { createWarehouse, updateWarehouse, type Warehouse } from '@/apis/material.api';
import { getBranches, type Branch } from '@/apis/branch.api';

interface WarehouseFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    warehouse: Warehouse | null;
    onSuccess: () => void;
}

export function WarehouseFormDialog({ open, onOpenChange, warehouse, onSuccess }: WarehouseFormDialogProps) {
    const [loading, setLoading] = useState(false);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [formData, setFormData] = useState({
        address: '',
        branchId: '',
        isActive: true,
    });

    useEffect(() => {
        if (open) {
            loadBranches();
        }
    }, [open]);

    useEffect(() => {
        if (warehouse) {
            setFormData({
                address: warehouse.address,
                branchId: warehouse.branchId.toString(),
                isActive: warehouse.isActive ?? true,
            });
        } else {
            setFormData({
                address: '',
                branchId: '',
                isActive: true,
            });
        }
    }, [warehouse, open]);

    const loadBranches = async () => {
        try {
            const data = await getBranches();
            setBranches(data);
        } catch (error) {
            console.error('Failed to load branches:', error);
            toast.error('❌ Không thể tải danh sách chi nhánh!');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.address.trim() || !formData.branchId) {
            toast.error('❌ Vui lòng điền đầy đủ thông tin!');
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
            <Card className="w-full max-w-2xl bg-white shadow-2xl rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#EC6426] to-[#F8A91F] p-6">
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
                            <Label htmlFor="branchId" className="text-sm font-semibold text-gray-700">
                                Chi nhánh <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={formData.branchId}
                                onValueChange={(value) => setFormData({ ...formData, branchId: value })}
                                disabled={loading}
                            >
                                <SelectTrigger className="mt-2">
                                    <SelectValue placeholder="Chọn chi nhánh" />
                                </SelectTrigger>
                                <SelectContent>
                                    {branches.map((branch) => (
                                        <SelectItem key={branch.id} value={branch.id.toString()}>
                                            {branch.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Địa chỉ */}
                        <div>
                            <Label htmlFor="address" className="text-sm font-semibold text-gray-700">
                                Địa chỉ kho <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="address"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                placeholder="VD: Kho chi nhánh Quận 1"
                                className="mt-2"
                                disabled={loading}
                            />
                        </div>

                        {/* Trạng thái */}
                        <div>
                            <Label htmlFor="isActive" className="text-sm font-semibold text-gray-700">
                                Trạng thái
                            </Label>
                            <Select
                                value={formData.isActive.toString()}
                                onValueChange={(value) => setFormData({ ...formData, isActive: value === 'true' })}
                                disabled={loading}
                            >
                                <SelectTrigger className="mt-2">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="true">Hoạt động</SelectItem>
                                    <SelectItem value="false">Ngừng hoạt động</SelectItem>
                                </SelectContent>
                            </Select>
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
                            className="px-6 bg-gradient-to-r from-[#EC6426] to-[#F8A91F] hover:from-[#EC6426]/90 hover:to-[#F8A91F]/90 text-white"
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
