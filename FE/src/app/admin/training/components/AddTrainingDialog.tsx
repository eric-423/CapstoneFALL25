'use client';

import { ReactNode, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { GraduationCap, Plus, Users } from 'lucide-react';

import { createTraining, CreateTrainingPayload, updateTraining } from '@/apis/trainning.api';
import { Role, getRoles } from '@/apis/role.api';
import { TrainingCourse } from '@/utils/types/training.type';

interface TrainingFormData {
    name: string;
    note: string;
    point: string;
    isActive: boolean;
    roleId: number | '';
}

interface AddTrainingDialogProps {
    onSuccess?: () => void;
    trigger?: ReactNode;
    mode?: 'create' | 'edit';
    training?: TrainingCourse | null;
}

const INITIAL_FORM: TrainingFormData = {
    name: '',
    note: '',
    point: '',
    isActive: true,
    roleId: '',
};

export function AddTrainingDialog({
    onSuccess,
    trigger,
    mode = 'create',
    training = null,
}: AddTrainingDialogProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [roles, setRoles] = useState<Role[]>([]);
    const [isLoadingRoles, setIsLoadingRoles] = useState(false);
    const [formData, setFormData] = useState<TrainingFormData>(INITIAL_FORM);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                setIsLoadingRoles(true);
                const data = await getRoles();
                setRoles(data);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoadingRoles(false);
            }
        };

        fetchRoles();
    }, []);

    const isEditMode = mode === 'edit' && Boolean(training);

    useEffect(() => {
        if (open && isEditMode && training) {
            setFormData({
                name: training.name ?? '',
                note: training.note ?? training.description ?? '',
                point:
                    training.point !== undefined && training.point !== null ? String(training.point) : '',
                isActive: training.isActive ?? true,
                roleId: training.roleId ?? '',
            });
        }

        if (!open && !isEditMode) {
            resetForm();
        }
    }, [open, isEditMode, training]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = 'Vui lòng nhập tên khóa đào tạo';
        if (!formData.note.trim()) newErrors.note = 'Vui lòng nhập mô tả';
        if (!formData.point.trim()) {
            newErrors.point = 'Vui lòng nhập điểm khóa';
        } else if (Number.isNaN(Number(formData.point)) || Number(formData.point) <= 0) {
            newErrors.point = 'Điểm khóa phải là số lớn hơn 0';
        }
        if (formData.roleId === '') newErrors.roleId = 'Vui lòng chọn vai trò';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        const payload: CreateTrainingPayload = {
            name: formData.name.trim(),
            note: formData.note.trim(),
            point: Number(formData.point),
            isActive: formData.isActive,
            roleId: Number(formData.roleId),
        };

        try {
            setIsLoading(true);

            if (isEditMode && training) {
                await updateTraining(training.id, payload);
            } else {
                await createTraining(payload);
            }

            setOpen(false);
            resetForm();
            onSuccess?.();
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setFormData(INITIAL_FORM);
        setErrors({});
    };

    const dialogTitle = isEditMode ? 'Cập nhật Khóa Đào Tạo' : 'Tạo Khóa Đào Tạo Mới';
    const submitLabel = isEditMode ? 'Cập nhật Khóa Đào Tạo' : 'Tạo Khóa Đào Tạo';

    const dialogTrigger = trigger ?? (
        <Button className="h-11 px-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all font-semibold">
            <Plus size={22} className="mr-2" strokeWidth={2.5} />
            Tạo Khóa Đào Tạo
        </Button>
    );

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{dialogTrigger}</DialogTrigger>
            <DialogContent className="w-[96vw] max-w-[96vw] sm:!max-w-[90vw] lg:!max-w-[70vw] xl:!max-w-[60vw] max-h-[95vh] overflow-y-auto bg-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                        <GraduationCap size={28} className="text-orange-500" />
                        {dialogTitle}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <GraduationCap size={16} className="text-orange-500" />
                            Tên khóa đào tạo <span className="text-red-500">*</span>
                        </label>
                        <Input
                            placeholder="VD: Cách làm món Phở, Quy trình phục vụ bàn..."
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className={`h-11 border-2 ${errors.name ? 'border-red-400' : 'border-gray-200'} focus:border-orange-500 focus:ring-orange-500/20 focus:ring-4 transition-all`}
                        />
                        {errors.name && <p className="text-xs text-red-600 font-medium">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">
                            Mô tả <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            placeholder="Mô tả chi tiết về nội dung và mục tiêu khóa đào tạo..."
                            value={formData.note}
                            onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
                            rows={3}
                            className={`w-full px-3 py-2 rounded-md border-2 ${errors.note ? 'border-red-400' : 'border-gray-200'} focus:border-orange-500 focus:ring-orange-500/20 focus:ring-4 outline-none transition-all`}
                        />
                        {errors.note && <p className="text-xs text-red-600 font-medium">{errors.note}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">
                            Điểm khóa học <span className="text-red-500">*</span>
                        </label>
                        <Input
                            placeholder="Nhập điểm khóa học (ví dụ: 100)"
                            type="number"
                            min={1}
                            value={formData.point}
                            onChange={(e) => setFormData(prev => ({ ...prev, point: e.target.value }))}
                            className={`h-11 border-2 ${errors.point ? 'border-red-400' : 'border-gray-200'} focus:border-orange-500 focus:ring-orange-500/20 focus:ring-4 transition-all`}
                        />
                        {errors.point && <p className="text-xs text-red-600 font-medium">{errors.point}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Users size={16} className="text-orange-500" />
                            Vai trò áp dụng <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="training-role"
                            aria-label="Chọn vai trò áp dụng"
                            value={formData.roleId === '' ? '' : String(formData.roleId)}
                            onChange={(e) =>
                                setFormData(prev => ({
                                    ...prev,
                                    roleId: e.target.value ? Number(e.target.value) : '',
                                }))
                            }
                            disabled={isLoadingRoles}
                            className={`w-full h-11 border-2 rounded-md px-3 bg-white ${errors.roleId ? 'border-red-400' : 'border-gray-200'} focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all`}
                        >
                            <option value="">
                                {isLoadingRoles ? 'Đang tải vai trò...' : 'Chọn vai trò'}
                            </option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                        {errors.roleId && <p className="text-xs text-red-600 font-medium">{errors.roleId}</p>}
                        <p className="text-xs text-gray-500">Chọn vai trò mà khóa đào tạo này áp dụng</p>
                    </div>

                    <div className="flex items-center justify-between border border-gray-200 rounded-xl px-4 py-3">
                        <div>
                            <p className="text-sm font-semibold text-gray-700">Kích hoạt khóa học</p>
                            <p className="text-xs text-gray-500">Cho phép nhân viên thấy khóa này sau khi tạo</p>
                        </div>
                        <button
                            type="button"
                            aria-label={formData.isActive ? 'Tắt khóa học' : 'Kích hoạt khóa học'}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.isActive ? 'bg-orange-500' : 'bg-gray-300'}`}
                            onClick={() => setFormData((prev) => ({ ...prev, isActive: !prev.isActive }))}
                        >
                            <span
                                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${formData.isActive ? 'translate-x-5' : 'translate-x-1'}`}
                            />
                        </button>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setOpen(false);
                                resetForm();
                            }}
                            disabled={isLoading}
                            className="flex-1 h-11 border-2 border-gray-300 bg-white !text-gray-900 hover:!bg-gray-100 hover:!text-gray-900 font-semibold"
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 h-11 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all font-semibold"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Đang xử lý...
                                </>
                            ) : isEditMode ? (
                                submitLabel
                            ) : (
                                <>
                                    <Plus size={18} className="mr-2" />
                                    {submitLabel}
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
