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
import { UserPlus, Mail, Phone, Calendar, Lock, Building2, Shield } from 'lucide-react';
import { toast } from 'react-toastify';

interface UserFormData {
    fullName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    branch: string;
    role: string;
    password: string;
}

const ROLE_OPTIONS = [
    { value: 'ADMIN', label: 'Admin', icon: '👑', color: 'from-red-500 to-red-600' },
    { value: 'MANAGER', label: 'Manager', icon: '👔', color: 'from-blue-500 to-blue-600' },
    { value: 'CUSTOMER', label: 'Khách hàng', icon: '👥', color: 'from-green-500 to-green-600' },
];

const MOCK_BRANCHES = [
    { id: 1, name: 'Chi nhánh Quận 1' },
    { id: 2, name: 'Chi nhánh Quận 3' },
    { id: 3, name: 'Chi nhánh Quận 5' },
    { id: 4, name: 'Chi nhánh Thủ Đức' },
];

export function AddUserDialog() {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<UserFormData>({
        fullName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        branch: '',
        role: 'CUSTOMER',
        password: '',
    });

    const [errors, setErrors] = useState<Partial<UserFormData>>({});

    const validateForm = () => {
        const newErrors: Partial<UserFormData> = {};

        if (!formData.fullName.trim()) newErrors.fullName = 'Vui lòng nhập họ tên';
        if (!formData.email.trim()) {
            newErrors.email = 'Vui lòng nhập email';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }
        if (!formData.phone.trim()) {
            newErrors.phone = 'Vui lòng nhập số điện thoại';
        } else if (!/^[0-9]{10}$/.test(formData.phone)) {
            newErrors.phone = 'Số điện thoại phải có 10 chữ số';
        }
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Vui lòng chọn ngày sinh';
        if (!formData.password.trim()) {
            newErrors.password = 'Vui lòng nhập mật khẩu';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }
        if (!formData.branch) newErrors.branch = 'Vui lòng chọn chi nhánh';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            toast.success('✅ Thêm người dùng thành công!');
            setOpen(false);
            setFormData({
                fullName: '',
                email: '',
                phone: '',
                dateOfBirth: '',
                branch: '',
                role: 'CUSTOMER',
                password: '',
            });
            setErrors({});
            setIsLoading(false);
        }, 1000);
    };

    const handleInputChange = (field: keyof UserFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all px-6 py-6 text-base">
                    <UserPlus size={20} className="mr-2" />
                    Thêm người dùng
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[95vh] overflow-y-auto bg-white border-0 shadow-2xl">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                            <UserPlus className="text-white" size={24} />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-bold text-gray-900">Thêm người dùng mới</DialogTitle>
                            <p className="text-sm text-gray-600 mt-1">Tạo tài khoản mới cho hệ thống quản lý</p>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5 mt-4">
                    {/* Full Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <UserPlus size={16} className="text-orange-500" />
                            Họ và tên <span className="text-red-500">*</span>
                        </label>
                        <Input
                            placeholder="Nguyễn Văn A"
                            value={formData.fullName}
                            onChange={(e) => handleInputChange('fullName', e.target.value)}
                            className={`h-11 border-2 ${errors.fullName ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-orange-500'} focus:ring-orange-500/20 focus:ring-4 transition-all`}
                        />
                        {errors.fullName && <p className="text-xs text-red-600 font-medium">{errors.fullName}</p>}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Mail size={16} className="text-orange-500" />
                            Email <span className="text-red-500">*</span>
                        </label>
                        <Input
                            type="email"
                            placeholder="example@email.com"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className={`h-11 border-2 ${errors.email ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-orange-500'} focus:ring-orange-500/20 focus:ring-4 transition-all`}
                        />
                        {errors.email && <p className="text-xs text-red-600 font-medium">{errors.email}</p>}
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

                    {/* Date of Birth */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Calendar size={16} className="text-orange-500" />
                            Ngày sinh <span className="text-red-500">*</span>
                        </label>
                        <Input
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                            max={new Date().toISOString().split('T')[0]}
                            className={`h-11 border-2 ${errors.dateOfBirth ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-orange-500'} focus:ring-orange-500/20 focus:ring-4 transition-all`}
                        />
                        {errors.dateOfBirth && <p className="text-xs text-red-600 font-medium">{errors.dateOfBirth}</p>}
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Lock size={16} className="text-orange-500" />
                            Mật khẩu <span className="text-red-500">*</span>
                        </label>
                        <Input
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            className={`h-11 border-2 ${errors.password ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-orange-500'} focus:ring-orange-500/20 focus:ring-4 transition-all`}
                        />
                        {errors.password && <p className="text-xs text-red-600 font-medium">{errors.password}</p>}
                    </div>

                    {/* Role Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Shield size={16} className="text-orange-500" />
                            Vai trò <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {ROLE_OPTIONS.map((role) => (
                                <button
                                    key={role.value}
                                    type="button"
                                    onClick={() => handleInputChange('role', role.value)}
                                    className={`p-4 rounded-xl border-2 transition-all ${formData.role === role.value
                                            ? `bg-gradient-to-br ${role.color} text-white border-transparent shadow-lg scale-105`
                                            : 'bg-white border-gray-200 hover:border-orange-300 hover:shadow-md'
                                        }`}
                                >
                                    <div className="text-3xl mb-2">{role.icon}</div>
                                    <div className={`text-sm font-bold ${formData.role === role.value ? 'text-white' : 'text-gray-700'}`}>
                                        {role.label}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Branch Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Building2 size={16} className="text-orange-500" />
                            Chi nhánh <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.branch}
                            onChange={(e) => handleInputChange('branch', e.target.value)}
                            className={`w-full h-11 px-3 rounded-md border-2 ${errors.branch ? 'border-red-400' : 'border-gray-200'
                                } focus:border-orange-500 focus:ring-orange-500/20 focus:ring-4 outline-none transition-all bg-white text-gray-900 font-medium`}
                        >
                            <option value="" className="text-gray-900">Chọn chi nhánh</option>
                            {MOCK_BRANCHES.map((branch) => (
                                <option key={branch.id} value={branch.name} className="text-gray-900">
                                    {branch.name}
                                </option>
                            ))}
                        </select>
                        {errors.branch && <p className="text-xs text-red-600 font-medium">{errors.branch}</p>}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setOpen(false);
                                setFormData({
                                    fullName: '',
                                    email: '',
                                    phone: '',
                                    dateOfBirth: '',
                                    branch: '',
                                    role: 'CUSTOMER',
                                    password: '',
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
                                    <UserPlus size={18} className="mr-2" />
                                    Thêm người dùng
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
