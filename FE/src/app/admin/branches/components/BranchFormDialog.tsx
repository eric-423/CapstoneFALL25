'use client';

import React, { useState } from 'react';
import { X, Building, MapPin, Phone, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { createBranch, updateBranch, type BranchDetail, type CreateBranchRequest, type UpdateBranchRequest } from '@/apis/branch.api';

interface BranchFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    branch?: BranchDetail | null;
    onSuccess: () => void;
}

export function BranchFormDialog({ open, onOpenChange, branch, onSuccess }: BranchFormDialogProps) {
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(branch?.name || '');
    const [address, setAddress] = useState(branch?.address || '');
    const [phoneNumber, setPhoneNumber] = useState(branch?.phoneNumber || '');

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
        }
    }, [open, branch]);

    const handleSubmit = async () => {
        if (!name.trim() || !address.trim() || !phoneNumber.trim()) {
            toast.warning('Vui lòng điền đầy đủ thông tin!');
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
            <Card className="w-full max-w-2xl bg-white shadow-2xl rounded-2xl border-0 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#EC6426] to-[#F8A91F] p-5 flex items-center justify-between">
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
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            Địa chỉ <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="123 Nguyễn Huệ, Phường Bến Thành, Quận 1, TP.HCM"
                            rows={3}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all resize-none"
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
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="0900000000"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                        />
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
                        className="px-5 py-2.5 bg-gradient-to-r from-[#EC6426] to-[#F8A91F] hover:from-[#EC6426]/90 hover:to-[#F8A91F]/90 text-white shadow-lg hover:shadow-xl transition-all font-semibold"
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
