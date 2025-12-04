'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, User as UserIcon, Mail, Phone, FileText, Shield, Building, CheckCircle, MapPin } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { createUser, updateUser, createRoleHistory, type User, type CreateUserRequest, type UpdateUserRequest } from '@/apis/admin-user.api';
import { getRoles, type Role } from '@/apis/role.api';
import { useAdminContext } from '@/utils/contexts/AdminContext';
import { useBodyScrollLock } from '../../components/useBodyScrollLock';
import { AdminSelect } from '../../components/AdminSelect';
import { AddressAutocomplete } from '@/components/common/address-autocomplete';

interface UserFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user?: User | null;
    onSuccess: () => void;
}

export function UserFormDialog({ open, onOpenChange, user, onSuccess }: UserFormDialogProps) {
    const { branches } = useAdminContext();
    const [loading, setLoading] = useState(false);
    useBodyScrollLock(open);
    const [roles, setRoles] = useState<Role[]>([]);
    const [loadingRoles, setLoadingRoles] = useState(false);

    // Form fields
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [password, setPassword] = useState('');
    const [note, setNote] = useState('');
    const [emailVerified, setEmailVerified] = useState(false);
    const [phoneVerified, setPhoneVerified] = useState(false);
    const [memberAssociationId, setMemberAssociationId] = useState<number | null>(null);

    // Role & Branch
    const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
    const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);

    // For update only
    const [isBan, setIsBan] = useState(false);
    const [isBusy, setIsBusy] = useState(false);
    const [memberPoint, setMemberPoint] = useState(0);

    // Load roles
    useEffect(() => {
        if (open) {
            loadRoles();
        }
    }, [open]);

    const loadRoles = async () => {
        try {
            setLoadingRoles(true);
            const data = await getRoles();
            setRoles(data);
        } catch (error) {
            console.error('Failed to load roles:', error);
            toast.error('Không thể tải danh sách vai trò!');
        } finally {
            setLoadingRoles(false);
        }
    };

    // Initialize form
    useEffect(() => {
        if (!open) return;

        if (user) {
            // Edit mode
            setFullName(user.fullName);
            setEmail(user.email);
            setPhoneNumber(user.phoneNumber);
            setAddress(user.address);
            setDateOfBirth(user.dateOfBirth.split('T')[0]);
            setNote(user.note || '');
            // Keep verification flags internally but don't show in UI
            setEmailVerified(user.emailVerified);
            setPhoneVerified(user.phoneVerified);
            setMemberAssociationId(user.memberAssociationId);
            setIsBan(user.isBan);
            setIsBusy(user.isBusy);
            setMemberPoint(user.memberPoint);
            setPassword(''); // Don't show password
        } else {
            // Create mode
            resetForm();
            setEmailVerified(false);
            setPhoneVerified(false);
        }
    }, [open, user]);

    const resetForm = () => {
        setFullName('');
        setEmail('');
        setPhoneNumber('');
        setAddress('');
        setDateOfBirth('');
        setPassword('');
        setNote('');
        setEmailVerified(false);
        setPhoneVerified(false);
        setMemberAssociationId(null);
        setSelectedRoleId(null);
        setSelectedBranchId(null);
        setIsBan(false);
        setIsBusy(false);
        setMemberPoint(0);
    };

    const selectedRole = roles.find(r => r.id === selectedRoleId);
    const showBranchField = selectedRole?.isInternal === true;

    const handleSubmit = async () => {
        // Validation
        if (!fullName.trim() || !email.trim() || !phoneNumber.trim() || !dateOfBirth) {
            toast.warning('Vui lòng điền đầy đủ thông tin bắt buộc!');
            return;
        }

        // Validate phone number (exactly 10 digits)
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phoneNumber.trim())) {
            toast.warning('Số điện thoại phải có đúng 10 chữ số!');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            toast.warning('Email không hợp lệ!');
            return;
        }

        // Validate date of birth (not in the future)
        const selectedDate = new Date(dateOfBirth);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate > today) {
            toast.warning('Ngày sinh không được sau ngày hôm nay!');
            return;
        }

        // Validate age (at least 16 years old)
        const age = today.getFullYear() - selectedDate.getFullYear();
        if (age < 16 || (age === 16 && today < new Date(selectedDate.setFullYear(selectedDate.getFullYear() + 16)))) {
            toast.warning('Người dùng phải từ 16 tuổi trở lên!');
            return;
        }

        if (!user && !password) {
            toast.warning('Vui lòng nhập mật khẩu!');
            return;
        }

        // Validate password length
        if (password && password.length < 6) {
            toast.warning('Mật khẩu phải có ít nhất 6 ký tự!');
            return;
        }

        if (!selectedRoleId) {
            toast.warning('Vui lòng chọn vai trò!');
            return;
        }

        if (showBranchField && !selectedBranchId) {
            toast.warning('Vui lòng chọn chi nhánh cho vai trò này!');
            return;
        }

        try {
            setLoading(true);

            if (user) {
                // Update user
                const updateData: UpdateUserRequest = {
                    fullName: fullName.trim(),
                    address: address.trim(),
                    phoneNumber: phoneNumber.trim(),
                    email: email.trim(),
                    dateOfBirth: new Date(dateOfBirth).toISOString(),
                    note: note.trim(),
                    isBan,
                    emailVerified,
                    phoneVerified,
                    isBusy,
                    memberPoint,
                    memberAssociationId: memberAssociationId || undefined,
                };

                if (password) {
                    updateData.password = password;
                }

                await updateUser(user.id, updateData);

                // Create new role history if role/branch changed
                if (selectedRoleId) {
                    await createRoleHistory({
                        userId: user.id,
                        roleId: selectedRoleId,
                        branchId: showBranchField ? selectedBranchId! : undefined,
                        startDate: new Date().toISOString(),
                    });
                }

                toast.success('Cập nhật người dùng thành công!');
            } else {
                // Create user
                const createData: CreateUserRequest = {
                    fullName: fullName.trim(),
                    address: address.trim(),
                    phoneNumber: phoneNumber.trim(),
                    email: email.trim(),
                    password: password,
                    dateOfBirth: new Date(dateOfBirth).toISOString(),
                    note: note.trim(),
                    emailVerified,
                    phoneVerified,
                    memberAssociationId: memberAssociationId || undefined,
                };

                const newUser = await createUser(createData);

                // Create role history for new user
                await createRoleHistory({
                    userId: newUser.id,
                    roleId: selectedRoleId,
                    branchId: showBranchField ? selectedBranchId! : undefined,
                    startDate: new Date().toISOString(),
                });

                toast.success('Tạo người dùng mới thành công!');
            }

            onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error('Failed to save user:', error);
            toast.error('Không thể lưu thông tin người dùng. Vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <Card className="w-full max-w-4xl bg-white shadow-2xl rounded-2xl border-0 overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="bg-[#78A243] px-6 py-4 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                            <UserIcon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">
                                {user ? 'Cập nhật thông tin' : 'Thêm người dùng mới'}
                            </h2>
                            <p className="text-xs text-white/80">
                                {user ? 'Chỉnh sửa thông tin chi tiết của người dùng' : 'Điền thông tin để tạo người dùng mới'}
                            </p>
                        </div>
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
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
                        {/* Left Column: Personal Info */}
                        <div className="space-y-5">
                            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
                                <UserIcon className="h-4 w-4 text-[#78A243]" />
                                Thông tin cá nhân
                            </h3>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-700">Họ và tên <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="Nhập họ và tên"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#78A243] focus:ring-2 focus:ring-[#78A243]/20 transition-all outline-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-gray-700">Ngày sinh <span className="text-red-500">*</span></label>
                                        <input
                                            type="date"
                                            value={dateOfBirth}
                                            onChange={(e) => setDateOfBirth(e.target.value)}
                                            max={new Date().toISOString().split('T')[0]}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#78A243] focus:ring-2 focus:ring-[#78A243]/20 transition-all outline-none"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-gray-700">Số điện thoại <span className="text-red-500">*</span></label>
                                        <input
                                            type="tel"
                                            value={phoneNumber}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, '');
                                                if (value.length <= 10) setPhoneNumber(value);
                                            }}
                                            maxLength={10}
                                            placeholder="09xxxxxxxx"
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#78A243] focus:ring-2 focus:ring-[#78A243]/20 transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-700">Email <span className="text-red-500">*</span></label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="example@domain.com"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#78A243] focus:ring-2 focus:ring-[#78A243]/20 transition-all outline-none"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-700">Địa chỉ</label>
                                    <AddressAutocomplete
                                        value={address}
                                        onChange={setAddress}
                                        placeholder="Nhập địa chỉ..."
                                        rows={2}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Account & Role */}
                        <div className="space-y-5">
                            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
                                <Shield className="h-4 w-4 text-[#78A243]" />
                                Tài khoản & Vai trò
                            </h3>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-gray-700">Vai trò <span className="text-red-500">*</span></label>
                                        {loadingRoles ? (
                                            <div className="text-sm text-gray-500 py-2">Đang tải...</div>
                                        ) : (
                                            <AdminSelect
                                                value={selectedRoleId?.toString() || ''}
                                                onValueChange={(value) => {
                                                    setSelectedRoleId(value ? parseInt(value) : null);
                                                    setSelectedBranchId(null);
                                                }}
                                                placeholder="Chọn vai trò"
                                                options={roles
                                                    .filter(role => role.id !== 1)
                                                    .map(role => ({
                                                        value: role.id.toString(),
                                                        label: role.name,
                                                        subLabel: role.isInternal ? 'Nội bộ' : undefined,
                                                    }))}
                                                triggerClassName="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#78A243] focus:ring-2 focus:ring-[#78A243]/20 transition-all outline-none h-auto"
                                            />
                                        )}
                                    </div>

                                    {showBranchField && (
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-semibold text-gray-700">Chi nhánh <span className="text-red-500">*</span></label>
                                            <AdminSelect
                                                value={selectedBranchId?.toString() || ''}
                                                onValueChange={(value) => setSelectedBranchId(value ? parseInt(value) : null)}
                                                placeholder="Chọn chi nhánh"
                                                options={branches.map(branch => ({
                                                    value: branch.id.toString(),
                                                    label: branch.name,
                                                }))}
                                                triggerClassName="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#78A243] focus:ring-2 focus:ring-[#78A243]/20 transition-all outline-none h-auto"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-700">
                                        Mật khẩu {!user && <span className="text-red-500">*</span>}
                                    </label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder={user ? "Để trống nếu không đổi" : "Nhập mật khẩu"}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#78A243] focus:ring-2 focus:ring-[#78A243]/20 transition-all outline-none"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-700">Ghi chú</label>
                                    <textarea
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        placeholder="Ghi chú thêm..."
                                        rows={3}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#78A243] focus:ring-2 focus:ring-[#78A243]/20 transition-all resize-none outline-none"
                                    />
                                </div>

                                {user && (
                                    <div className="pt-2 grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-semibold text-gray-700">Điểm thành viên</label>
                                            <input
                                                type="number"
                                                value={memberPoint}
                                                onChange={(e) => setMemberPoint(parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#78A243] focus:ring-2 focus:ring-[#78A243]/20 transition-all outline-none"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    id="isBusy"
                                                    checked={isBusy}
                                                    onChange={(e) => setIsBusy(e.target.checked)}
                                                    className="w-4 h-4 rounded border-gray-300 text-[#78A243] focus:ring-[#78A243]"
                                                />
                                                <label htmlFor="isBusy" className="text-sm text-gray-700 cursor-pointer">Đang bận</label>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    id="isBan"
                                                    checked={isBan}
                                                    onChange={(e) => setIsBan(e.target.checked)}
                                                    className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                                                />
                                                <label htmlFor="isBan" className="text-sm text-red-600 cursor-pointer">Khóa tài khoản</label>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
                    <Button
                        onClick={() => onOpenChange(false)}
                        variant="outline"
                        className="px-5 py-2.5 border-2 border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold"
                    >
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
                                {user ? 'Cập nhật' : 'Tạo mới'}
                            </>
                        )}
                    </Button>
                </div>
            </Card>
        </div>
    );
}
