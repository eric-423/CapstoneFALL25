'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Clock, Loader2, AlertCircle, Plus, X, Pencil } from 'lucide-react';
import { getShifts, createShift, updateShift, type Shift, type CreateShiftData, type UpdateShiftData } from '@/apis/schedule.api';
import { getCookie } from '@/utils/cookies.client';
import { toast } from 'react-toastify';
import { usePathname } from 'next/navigation';
import { useContext } from 'react';
import { AdminContext } from '@/utils/contexts/AdminContext';

interface ShiftManagementDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

function useAdminContextSafe() {
    return useContext(AdminContext);
}

export function ShiftManagementDialog({
    open,
    onOpenChange,
}: ShiftManagementDialogProps) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin') || false;
    
    const adminContext = useAdminContextSafe();
    const branches = isAdmin && adminContext ? adminContext.branches : [];
    const selectedBranch = isAdmin && adminContext ? adminContext.selectedBranch : null;
    
    const [shifts, setShifts] = useState<Shift[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [editingShiftId, setEditingShiftId] = useState<number | null>(null);
    const [formData, setFormData] = useState<CreateShiftData>({
        name: '',
        description: '',
        startTime: '',
        endTime: '',
        branchId: 0,
        isActive: true,
    });

    const branchIdValue = useMemo(() => {
        if (isAdmin) {
            if (selectedBranch) {
                return selectedBranch.id;
            } else if (branches.length > 0) {
                return branches[0].id;
            }
        } else {
            const branchId = getCookie('branchId');
            if (branchId) {
                const parsed = parseInt(branchId, 10);
                if (!isNaN(parsed) && parsed > 0) {
                    return parsed;
                }
            }
        }
        return 0;
    }, [isAdmin, selectedBranch?.id, branches.length, branches[0]?.id]);

    const fetchShifts = useCallback(async () => {
        try {
            setError(null);

            const branchId = getCookie('branchId');
            let branchIdNum: number | undefined;
            
            if (branchId) {
                const parsed = parseInt(branchId, 10);
                if (!isNaN(parsed) && parsed > 0) {
                    branchIdNum = parsed;
                }
            }

            const response = await getShifts(branchIdNum);
            
            if (response.status === 0 && response.data) {
                setShifts(Array.isArray(response.data) ? response.data : []);
            } else {
                setError(response.desc || 'Không thể tải danh sách ca làm việc');
            }
        } catch (err) {
            console.error('Failed to fetch shifts:', err);
            const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải danh sách ca làm việc';
            setError(errorMessage);
            toast.error(errorMessage);
        }
    }, []);

    useEffect(() => {
        if (open) {
            fetchShifts();
        }
    }, [open, fetchShifts]);

    useEffect(() => {
        if (open && branchIdValue > 0) {
            setFormData(prev => {
                if (prev.branchId === branchIdValue) {
                    return prev;
                }
                return {
                    ...prev,
                    branchId: branchIdValue,
                };
            });
        }
    }, [open, branchIdValue]);

    useEffect(() => {
        if (!open) {
            setShifts([]);
            setError(null);
            setShowForm(false);
            setEditingShiftId(null);
            setFormData({
                name: '',
                description: '',
                startTime: '',
                endTime: '',
                branchId: 0,
                isActive: true,
            });
        }
    }, [open]);

    const formatTime = (time: string) => {
        if (!time) return 'N/A';
        return time.length >= 5 ? time.slice(0, 5) : time;
    };

    const handleEdit = (shift: Shift) => {
        setEditingShiftId(shift.id);
        setShowForm(false);
        const startTime = shift.startTime.length >= 5 ? shift.startTime.slice(0, 5) : shift.startTime;
        const endTime = shift.endTime.length >= 5 ? shift.endTime.slice(0, 5) : shift.endTime;
        setFormData({
            name: shift.name,
            description: shift.description || '',
            startTime: startTime,
            endTime: endTime,
            branchId: shift.branchId,
            isActive: shift.isActive ?? true,
        });
    };

    const handleCancelEdit = () => {
        setEditingShiftId(null);
        setFormData({
            name: '',
            description: '',
            startTime: '',
            endTime: '',
            branchId: formData.branchId,
            isActive: true,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.name.trim()) {
            toast.error('Vui lòng nhập tên ca làm việc');
            return;
        }

        if (!formData.startTime || !formData.endTime) {
            toast.error('Vui lòng nhập đầy đủ thời gian bắt đầu và kết thúc');
            return;
        }

        if (formData.branchId === 0) {
            if (isAdmin) {
                toast.error('Vui lòng chọn chi nhánh');
            } else {
                toast.error('Không tìm thấy thông tin chi nhánh');
            }
            return;
        }

        try {
            setSubmitting(true);
            
            const startTime = formData.startTime.length === 5 ? `${formData.startTime}:00` : formData.startTime;
            const endTime = formData.endTime.length === 5 ? `${formData.endTime}:00` : formData.endTime;

            if (editingShiftId) {
                const updatePayload: UpdateShiftData = {
                    name: formData.name,
                    description: formData.description || undefined,
                    startTime,
                    endTime,
                    isActive: formData.isActive,
                };

                const response = await updateShift(editingShiftId, updatePayload);

                if (response.status === 0) {
                    toast.success('Cập nhật ca làm việc thành công!');
                    setEditingShiftId(null);
                    setFormData({
                        name: '',
                        description: '',
                        startTime: '',
                        endTime: '',
                        branchId: formData.branchId,
                        isActive: true,
                    });
                    // Fetch lại danh sách ca
                    await fetchShifts();
                } else {
                    toast.error(response.desc || 'Không thể cập nhật ca làm việc');
                }
            } else {
                const payload: CreateShiftData = {
                    ...formData,
                    startTime,
                    endTime,
                };

                const response = await createShift(payload);

                if (response.status === 0) {
                    toast.success('Tạo ca làm việc thành công!');
                    setShowForm(false);
                    setFormData({
                        name: '',
                        description: '',
                        startTime: '',
                        endTime: '',
                        branchId: formData.branchId,
                        isActive: true,
                    });
                    // Fetch lại danh sách ca
                    await fetchShifts();
                } else {
                    toast.error(response.desc || 'Không thể tạo ca làm việc');
                }
            }
        } catch (err) {
            console.error('Failed to save shift:', err);
            const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi lưu ca làm việc';
            toast.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-[#78A243]" />
                        Quản lý ca làm việc
                    </DialogTitle>
                    <DialogDescription>
                        Danh sách tất cả các ca làm việc trong chi nhánh
                    </DialogDescription>
                </DialogHeader>

                <div className="flex justify-end mt-4">
                    <Button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-[#78A243] hover:bg-[#78A243]/90"
                        size="sm"
                    >
                        {showForm ? (
                            <>
                                <X className="w-4 h-4 mr-2" />
                                Hủy
                            </>
                        ) : (
                            <>
                                <Plus className="w-4 h-4 mr-2" />
                                Thêm ca làm
                            </>
                        )}
                    </Button>
                </div>

                {showForm && (
                    <div className="mt-4 p-4 border border-[#78A243]/30 rounded-lg bg-[#78A243]/5">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {isAdmin && branches.length > 0 && (
                                <div className="space-y-2">
                                    <Label htmlFor="branchId">Chi nhánh *</Label>
                                    <Select
                                        value={formData.branchId > 0 ? formData.branchId.toString() : ''}
                                        onValueChange={(value) =>
                                            setFormData(prev => ({ ...prev, branchId: parseInt(value, 10) || 0 }))
                                        }
                                        required
                                    >
                                        <SelectTrigger className="w-full">
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
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Tên ca làm việc *</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="Ví dụ: Ca sáng"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Mô tả</Label>
                                    <Input
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        placeholder="Mô tả ca làm việc"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="startTime">Thời gian bắt đầu *</Label>
                                    <Input
                                        id="startTime"
                                        type="time"
                                        value={formData.startTime}
                                        onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="endTime">Thời gian kết thúc *</Label>
                                    <Input
                                        id="endTime"
                                        type="time"
                                        value={formData.endTime}
                                        onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                                    className="w-4 h-4 text-[#78A243] border-gray-300 rounded focus:ring-[#78A243]"
                                    aria-label="Ca làm việc đang hoạt động"
                                />
                                <Label htmlFor="isActive" className="cursor-pointer">
                                    Ca làm việc đang hoạt động
                                </Label>
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setShowForm(false);
                                        setFormData({
                                            name: '',
                                            description: '',
                                            startTime: '',
                                            endTime: '',
                                            branchId: formData.branchId,
                                            isActive: true,
                                        });
                                    }}
                                    disabled={submitting}
                                >
                                    Hủy
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-[#78A243] hover:bg-[#78A243]/90"
                                    disabled={submitting}
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Đang tạo...
                                        </>
                                    ) : (
                                        'Tạo ca làm việc'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="mt-4">
                    {error ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <AlertCircle className="w-8 h-8 text-red-500 mb-4" />
                            <p className="text-gray-700 font-medium mb-2">Có lỗi xảy ra</p>
                            <p className="text-gray-500 text-sm text-center">{error}</p>
                            <Button
                                onClick={fetchShifts}
                                variant="outline"
                                size="sm"
                                className="mt-4"
                            >
                                Thử lại
                            </Button>
                        </div>
                    ) : shifts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Clock className="w-8 h-8 text-gray-400 mb-4" />
                            <p className="text-gray-500">Chưa có ca làm việc nào</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {shifts.map((shift) => (
                                <div key={shift.id}>
                                    <div
                                        className="p-4 border border-gray-200 rounded-lg hover:border-[#78A243]/50 hover:shadow-sm transition-all"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900 mb-1">
                                                    {shift.name}
                                                </h3>
                                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4" />
                                                        <span>
                                                            {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
                                                        </span>
                                                    </div>
                                                    {shift.isActive !== false && (
                                                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                                                            Đang hoạt động
                                                        </span>
                                                    )}
                                                </div>
                                                {shift.description && (
                                                    <p className="text-sm text-gray-500 mt-2">
                                                        {shift.description}
                                                    </p>
                                                )}
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEdit(shift)}
                                                className="text-[#78A243] hover:text-[#78A243]/80 hover:bg-[#78A243]/10"
                                                disabled={editingShiftId === shift.id}
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    {editingShiftId === shift.id && (
                                        <div className="mt-3 p-4 border border-[#78A243]/30 rounded-lg bg-[#78A243]/5">
                                            <form onSubmit={handleSubmit} className="space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="edit-name">Tên ca làm việc *</Label>
                                                        <Input
                                                            id="edit-name"
                                                            value={formData.name}
                                                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                                            placeholder="Ví dụ: Ca sáng"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="edit-description">Mô tả</Label>
                                                        <Input
                                                            id="edit-description"
                                                            value={formData.description}
                                                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                                            placeholder="Mô tả ca làm việc"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="edit-startTime">Thời gian bắt đầu *</Label>
                                                        <Input
                                                            id="edit-startTime"
                                                            type="time"
                                                            value={formData.startTime}
                                                            onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="edit-endTime">Thời gian kết thúc *</Label>
                                                        <Input
                                                            id="edit-endTime"
                                                            type="time"
                                                            value={formData.endTime}
                                                            onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        id="edit-isActive"
                                                        checked={formData.isActive}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                                                        className="w-4 h-4 text-[#78A243] border-gray-300 rounded focus:ring-[#78A243]"
                                                        aria-label="Ca làm việc đang hoạt động"
                                                    />
                                                    <Label htmlFor="edit-isActive" className="cursor-pointer">
                                                        Ca làm việc đang hoạt động
                                                    </Label>
                                                </div>
                                                <div className="flex justify-end gap-2 pt-2">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={handleCancelEdit}
                                                        disabled={submitting}
                                                    >
                                                        Hủy
                                                    </Button>
                                                    <Button
                                                        type="submit"
                                                        className="bg-[#78A243] hover:bg-[#78A243]/90"
                                                        disabled={submitting}
                                                    >
                                                        {submitting ? (
                                                            <>
                                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                                Đang cập nhật...
                                                            </>
                                                        ) : (
                                                            'Cập nhật'
                                                        )}
                                                    </Button>
                                                </div>
                                            </form>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Đóng
                    </Button>
                    {!error && (
                        <Button
                            onClick={fetchShifts}
                            variant="outline"
                            className="border-[#78A243] text-[#78A243] hover:bg-[#78A243]/10"
                        >
                            Làm mới
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

