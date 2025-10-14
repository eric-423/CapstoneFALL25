'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Store, MapPin, Phone, Plus } from 'lucide-react';
import { toast } from 'react-toastify';

interface BranchFormData {
    name: string;
    address: string;
    phone: string;
    isParent: boolean;
    active: boolean;
}

export function AddBranchDialog() {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<BranchFormData>({
        name: '',
        address: '',
        phone: '',
        isParent: false,
        active: true,
    });

    const [errors, setErrors] = useState<Partial<BranchFormData>>({});

    const validateForm = () => {
        const newErrors: Partial<BranchFormData> = {};

        if (!formData.name.trim()) newErrors.name = 'Vui lòng nhập tên chi nhánh';
        if (!formData.address.trim()) newErrors.address = 'Vui lòng nhập địa chỉ';
        if (!formData.phone.trim()) {
            newErrors.phone = 'Vui lòng nhập số điện thoại';
        } else if (!/^[0-9]{10}$/.test(formData.phone)) {
            newErrors.phone = 'Số điện thoại phải có 10 chữ số';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        setTimeout(() => {
            toast.success('✅ Thêm chi nhánh thành công!');
            setOpen(false);
            setFormData({
                name: '',
                address: '',
                phone: '',
                isParent: false,
                active: true,
            });
            setErrors({});
            setIsLoading(false);
        }, 1000);
    };

    const handleInputChange = (field: keyof BranchFormData, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all px-6 py-6 text-base">
                    <Plus size={20} className="mr-2" />
                    Thêm chi nhánh
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[95vh] overflow-y-auto bg-white border-0 shadow-2xl">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Store className="text-white" size={24} />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-bold text-gray-900">Thêm chi nhánh mới</DialogTitle>
                            <p className="text-sm text-gray-600 mt-1">Tạo chi nhánh mới cho hệ thống</p>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5 mt-4">
                    {/* Branch Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Store size={16} className="text-orange-500" />
                            Tên chi nhánh <span className="text-red-500">*</span>
                        </label>
                        <Input
                            placeholder="Chi nhánh Quận 1"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className={`h-11 border-2 ${errors.name ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-orange-500'} focus:ring-orange-500/20 focus:ring-4 transition-all`}
                        />
                        {errors.name && <p className="text-xs text-red-600 font-medium">{errors.name}</p>}
                    </div>

                    {/* Address */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <MapPin size={16} className="text-orange-500" />
                            Địa chỉ <span className="text-red-500">*</span>
                        </label>
                        <Input
                            placeholder="123 Đường ABC, Quận 1, TP.HCM"
                            value={formData.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            className={`h-11 border-2 ${errors.address ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-orange-500'} focus:ring-orange-500/20 focus:ring-4 transition-all`}
                        />
                        {errors.address && <p className="text-xs text-red-600 font-medium">{errors.address}</p>}
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Phone size={16} className="text-orange-500" />
                            Số điện thoại <span className="text-red-500">*</span>
                        </label>
                        <Input
                            placeholder="0123456789"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            maxLength={10}
                            className={`h-11 border-2 ${errors.phone ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-orange-500'} focus:ring-orange-500/20 focus:ring-4 transition-all`}
                        />
                        {errors.phone && <p className="text-xs text-red-600 font-medium">{errors.phone}</p>}
                    </div>

                    {/* Options */}
                    <div className="space-y-3 pt-2">
                        <div className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-orange-300 transition-all">
                            <input
                                type="checkbox"
                                id="isParent"
                                checked={formData.isParent}
                                onChange={(e) => handleInputChange('isParent', e.target.checked)}
                                className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                            />
                            <label htmlFor="isParent" className="text-sm font-medium text-gray-700 cursor-pointer flex-1">
                                Chi nhánh trung tâm
                            </label>
                        </div>

                        <div className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-orange-300 transition-all">
                            <input
                                type="checkbox"
                                id="active"
                                checked={formData.active}
                                onChange={(e) => handleInputChange('active', e.target.checked)}
                                className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                            />
                            <label htmlFor="active" className="text-sm font-medium text-gray-700 cursor-pointer flex-1">
                                Kích hoạt ngay
                            </label>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setOpen(false);
                                setFormData({
                                    name: '',
                                    address: '',
                                    phone: '',
                                    isParent: false,
                                    active: true,
                                });
                                setErrors({});
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
                            ) : (
                                <>
                                    <Plus size={18} className="mr-2" />
                                    Thêm chi nhánh
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
