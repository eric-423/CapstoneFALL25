'use client';

import React, { useState } from 'react';
import { X, Building, MapPin, Phone, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AddressAutocomplete } from '@/components/common/address-autocomplete';
import { createBranch, updateBranch, getBranches, type BranchDetail, type CreateBranchRequest, type UpdateBranchRequest, type Branch } from '@/apis/branch.api';
import { getWarehouses, type Warehouse } from '@/apis/material.api';
import { useBodyScrollLock } from '../../components/useBodyScrollLock';

interface BranchFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    branch?: BranchDetail | null;
    onSuccess: () => void;
}

export function BranchFormDialog({ open, onOpenChange, branch, onSuccess }: BranchFormDialogProps) {
    const [loading, setLoading] = useState(false);
    useBodyScrollLock(open);
    const [name, setName] = useState(branch?.name || '');
    const [address, setAddress] = useState(branch?.address || '');
    const [phoneNumber, setPhoneNumber] = useState(branch?.phoneNumber || '');

    // Data for validation
    const [existingBranches, setExistingBranches] = useState<Branch[]>([]);
    const [existingWarehouses, setExistingWarehouses] = useState<Warehouse[]>([]);

    React.useEffect(() => {
        if (open) {
            if (branch) {
                setName(branch.name);
                setAddress(branch.address);
                setPhoneNumber(branch.phoneNumber);
            } else {
                setName('');
                setAddress('');
                setPhoneNumber('');
            }

            // Fetch data for validation
            const fetchData = async () => {
                try {
                    const [branchesData, warehousesData] = await Promise.all([
                        getBranches(),
                        getWarehouses()
                    ]);
                    setExistingBranches(branchesData);
                    setExistingWarehouses(warehousesData);
                } catch (error) {
                    console.error('Failed to fetch data for validation:', error);
                }
            };
            fetchData();
        }
    }, [open, branch]);

    const handleSubmit = async () => {
        if (!name.trim() || !address.trim() || !phoneNumber.trim()) {
            toast.warning('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        // Validate phone number (must be exactly 10 digits)
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phoneNumber.trim())) {
            toast.error('Số điện thoại phải có đúng 10 chữ số!');
            return;
        }

        const normalizedAddress = address.trim().toLowerCase();

        // Check for duplicate address in other branches
        const duplicateBranch = existingBranches.find(b =>
            b.address.trim().toLowerCase() === normalizedAddress &&
            (!branch || b.id !== branch.id)
        );

        if (duplicateBranch) {
            toast.error(`Địa chỉ này đã được sử dụng bởi chi nhánh khác (ID: ${duplicateBranch.id})!`);
            return;
        }

        // Check for duplicate address in warehouses
        const duplicateWarehouse = existingWarehouses.find(w =>
            w.address.trim().toLowerCase() === normalizedAddress
        );

        if (duplicateWarehouse) {
            toast.error(`Địa chỉ này đã được sử dụng bởi kho (ID: ${duplicateWarehouse.id})!`);
            return;
        }

        try {
            setLoading(true);

            if (branch) {
                const updateData: UpdateBranchRequest = {
                    name: name.trim(),
                    address: address.trim(),
                    phoneNumber: phoneNumber.trim(),
                };
                await updateBranch(branch.id, updateData);
                toast.success('Cập nhật chi nhánh thành công!');
            } else {
                const createData: CreateBranchRequest = {
                    name: name.trim(),
                    address: address.trim(),
                    phoneNumber: phoneNumber.trim(),
                };
                await createBranch(createData);
                toast.success('Tạo chi nhánh mới thành công!');
            }

            onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error('Failed to save branch:', error);
            toast.error('Không thể lưu thông tin chi nhánh!');
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <Card className="w-full max-w-2xl bg-white shadow-2xl rounded-2xl border-0 overflow-hidden py-0">
                {/* Header */}
                <div className="bg-[#78A243] p-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                            <Building className="h-5 w-5 text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-white">
                            {branch ? 'Chỉnh sửa chi nhánh' : 'Thêm chi nhánh mới'}
                        </h2>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onOpenChange(false)}
                        className="border-white/30 bg-white/10 hover:bg-white/20 text-white hover:text-white h-8 w-8 p-0"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                            <Building className="h-4 w-4" />
                            Tên chi nhánh <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Chi nhánh Quận 1"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#78A243] focus:ring-2 focus:ring-[#78A243]/20 transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            Địa chỉ <span className="text-red-500">*</span>
                        </label>
                        <AddressAutocomplete
                            value={address}
                            onChange={setAddress}
                            placeholder="123 Nguyễn Huệ, Phường Bến Thành, Quận 1, TP.HCM"
                            rows={3}
                            disabled={loading}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            Số điện thoại <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => {
                                // Only allow digits
                                const value = e.target.value.replace(/\D/g, '');
                                setPhoneNumber(value);
                            }}
                            placeholder="0900000000"
                            maxLength={10}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#78A243] focus:ring-2 focus:ring-[#78A243]/20 transition-all"
                        />
                        {phoneNumber && phoneNumber.length !== 10 && (
                            <p className="text-xs text-red-500">Số điện thoại phải có đúng 10 chữ số</p>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 border-t border-gray-200 p-4 flex gap-3 justify-end">
                    <Button
                        onClick={() => onOpenChange(false)}
                        variant="outline"
                        className="px-5 py-2.5 border-2 border-gray-300 hover:bg-gray-100 font-semibold"
                    >
                        <X className="h-4 w-4 mr-2" />
                        Hủy
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-5 py-2.5 bg-[#78A243] hover:bg-[#78A243]/90 text-white shadow-lg hover:shadow-xl transition-all font-semibold"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Đang lưu...
                            </>
                        ) : (
                            <>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                {branch ? 'Cập nhật' : 'Tạo mới'}
                            </>
                        )}
                    </Button>
                </div>
            </Card>
        </div>
    );
}
