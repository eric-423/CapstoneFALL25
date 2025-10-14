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
import { Gift, Percent, Calendar, Tag, Plus } from 'lucide-react';
import { toast } from 'react-toastify';

interface PromotionFormData {
    name: string;
    code: string;
    description: string;
    discountType: string;
    discountValue: string;
    minOrderValue: string;
    maxDiscount: string;
    startDate: string;
    endDate: string;
    usageLimit: string;
    active: boolean;
}

const DISCOUNT_TYPES = [
    { value: 'PERCENTAGE', label: 'Phần trăm', icon: '%', color: 'from-blue-500 to-blue-600' },
    { value: 'FIXED', label: 'Số tiền cố định', icon: '₫', color: 'from-green-500 to-green-600' },
];

export function AddPromotionDialog() {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<PromotionFormData>({
        name: '',
        code: '',
        description: '',
        discountType: 'PERCENTAGE',
        discountValue: '',
        minOrderValue: '',
        maxDiscount: '',
        startDate: '',
        endDate: '',
        usageLimit: '',
        active: true,
    });

    const [errors, setErrors] = useState<Partial<PromotionFormData>>({});

    const validateForm = () => {
        const newErrors: Partial<PromotionFormData> = {};

        if (!formData.name.trim()) newErrors.name = 'Vui lòng nhập tên khuyến mãi';
        if (!formData.code.trim()) newErrors.code = 'Vui lòng nhập mã khuyến mãi';
        if (!formData.description.trim()) newErrors.description = 'Vui lòng nhập mô tả';
        if (!formData.discountValue) {
            newErrors.discountValue = 'Vui lòng nhập giá trị giảm giá';
        } else if (formData.discountType === 'PERCENTAGE' && (Number(formData.discountValue) <= 0 || Number(formData.discountValue) > 100)) {
            newErrors.discountValue = 'Giá trị phải từ 1-100%';
        }
        if (!formData.startDate) newErrors.startDate = 'Vui lòng chọn ngày bắt đầu';
        if (!formData.endDate) newErrors.endDate = 'Vui lòng chọn ngày kết thúc';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        setTimeout(() => {
            toast.success('✅ Thêm khuyến mãi thành công!');
            setOpen(false);
            resetForm();
            setIsLoading(false);
        }, 1000);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            code: '',
            description: '',
            discountType: 'PERCENTAGE',
            discountValue: '',
            minOrderValue: '',
            maxDiscount: '',
            startDate: '',
            endDate: '',
            usageLimit: '',
            active: true,
        });
        setErrors({});
    };

    const handleInputChange = (field: keyof PromotionFormData, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const generateCode = () => {
        const code = 'PROMO' + Math.random().toString(36).substring(2, 8).toUpperCase();
        handleInputChange('code', code);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all px-6 py-6 text-base">
                    <Plus size={20} className="mr-2" />
                    Thêm khuyến mãi
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[95vh] overflow-y-auto bg-white border-0 shadow-2xl">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Gift className="text-white" size={24} />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-bold text-gray-900">Thêm khuyến mãi mới</DialogTitle>
                            <p className="text-sm text-gray-600 mt-1">Tạo chương trình khuyến mãi cho khách hàng</p>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5 mt-4">
                    {/* Promotion Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Gift size={16} className="text-orange-500" />
                            Tên khuyến mãi <span className="text-red-500">*</span>
                        </label>
                        <Input
                            placeholder="Giảm giá mùa hè, Khuyến mãi cuối năm..."
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className={`h-11 border-2 ${errors.name ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-orange-500'} focus:ring-orange-500/20 focus:ring-4 transition-all`}
                        />
                        {errors.name && <p className="text-xs text-red-600 font-medium">{errors.name}</p>}
                    </div>

                    {/* Promotion Code */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Tag size={16} className="text-orange-500" />
                            Mã khuyến mãi <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-2">
                            <Input
                                placeholder="SUMMER2025"
                                value={formData.code}
                                onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
                                className={`flex-1 h-11 border-2 ${errors.code ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-orange-500'} focus:ring-orange-500/20 focus:ring-4 transition-all`}
                            />
                            <Button type="button" onClick={generateCode} variant="outline" className="border-orange-500 text-orange-600 hover:bg-orange-50">
                                Tạo mã
                            </Button>
                        </div>
                        {errors.code && <p className="text-xs text-red-600 font-medium">{errors.code}</p>}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">
                            Mô tả <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            placeholder="Mô tả chi tiết về chương trình khuyến mãi..."
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            rows={3}
                            className={`w-full px-3 py-2 rounded-md border-2 ${errors.description ? 'border-red-400' : 'border-gray-200'} focus:border-orange-500 focus:ring-orange-500/20 focus:ring-4 outline-none transition-all`}
                        />
                        {errors.description && <p className="text-xs text-red-600 font-medium">{errors.description}</p>}
                    </div>

                    {/* Discount Type */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Loại giảm giá</label>
                        <div className="grid grid-cols-2 gap-3">
                            {DISCOUNT_TYPES.map((type) => (
                                <button
                                    key={type.value}
                                    type="button"
                                    onClick={() => handleInputChange('discountType', type.value)}
                                    className={`p-4 rounded-xl border-2 transition-all ${formData.discountType === type.value
                                            ? `bg-gradient-to-br ${type.color} text-white border-transparent shadow-lg`
                                            : 'bg-white border-gray-200 hover:border-orange-300'
                                        }`}
                                >
                                    <div className="text-3xl mb-2">{type.icon}</div>
                                    <div className={`text-sm font-bold ${formData.discountType === type.value ? 'text-white' : 'text-gray-700'}`}>
                                        {type.label}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Discount Value and Min Order */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Percent size={16} className="text-orange-500" />
                                Giá trị giảm {formData.discountType === 'PERCENTAGE' ? '(%)' : '(VNĐ)'} <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="number"
                                placeholder={formData.discountType === 'PERCENTAGE' ? '10' : '50000'}
                                value={formData.discountValue}
                                onChange={(e) => handleInputChange('discountValue', e.target.value)}
                                className={`h-11 border-2 ${errors.discountValue ? 'border-red-400' : 'border-gray-200'} focus:border-orange-500`}
                            />
                            {errors.discountValue && <p className="text-xs text-red-600 font-medium">{errors.discountValue}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">
                                Đơn hàng tối thiểu (VNĐ)
                            </label>
                            <Input
                                type="number"
                                placeholder="100000"
                                value={formData.minOrderValue}
                                onChange={(e) => handleInputChange('minOrderValue', e.target.value)}
                                className="h-11 border-2 border-gray-200 focus:border-orange-500"
                            />
                        </div>
                    </div>

                    {/* Max Discount and Usage Limit */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">
                                Giảm tối đa (VNĐ)
                            </label>
                            <Input
                                type="number"
                                placeholder="200000"
                                value={formData.maxDiscount}
                                onChange={(e) => handleInputChange('maxDiscount', e.target.value)}
                                className="h-11 border-2 border-gray-200 focus:border-orange-500"
                            />
                            <p className="text-xs text-gray-500">Chỉ áp dụng cho giảm phần trăm</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">
                                Giới hạn sử dụng
                            </label>
                            <Input
                                type="number"
                                placeholder="100"
                                value={formData.usageLimit}
                                onChange={(e) => handleInputChange('usageLimit', e.target.value)}
                                className="h-11 border-2 border-gray-200 focus:border-orange-500"
                            />
                        </div>
                    </div>

                    {/* Start and End Date */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Calendar size={16} className="text-orange-500" />
                                Ngày bắt đầu <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => handleInputChange('startDate', e.target.value)}
                                className={`h-11 border-2 ${errors.startDate ? 'border-red-400' : 'border-gray-200'} focus:border-orange-500`}
                            />
                            {errors.startDate && <p className="text-xs text-red-600 font-medium">{errors.startDate}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Calendar size={16} className="text-orange-500" />
                                Ngày kết thúc <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => handleInputChange('endDate', e.target.value)}
                                className={`h-11 border-2 ${errors.endDate ? 'border-red-400' : 'border-gray-200'} focus:border-orange-500`}
                            />
                            {errors.endDate && <p className="text-xs text-red-600 font-medium">{errors.endDate}</p>}
                        </div>
                    </div>

                    {/* Active Status */}
                    <div className="space-y-3 pt-2">
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
                            ) : (
                                <>
                                    <Plus size={18} className="mr-2" />
                                    Thêm khuyến mãi
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
