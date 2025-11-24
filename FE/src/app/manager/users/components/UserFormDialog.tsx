'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, User as UserIcon, Mail, Phone, MapPin, FileText, Shield, Building, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { createUser, updateUser, createRoleHistory, type User, type CreateUserRequest, type UpdateUserRequest } from '@/apis/admin-user.api';
import { getRoles, type Role } from '@/apis/role.api';
import { useAdminContext } from '@/utils/contexts/AdminContext';

interface UserFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user?: User | null;
    onSuccess: () => void;
}

export function UserFormDialog({ open, onOpenChange, user, onSuccess }: UserFormDialogProps) {
    const { branches } = useAdminContext();
    const [loading, setLoading] = useState(false);
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
            toast.error('❌ Không thể tải danh sách vai trò!');
        } finally {
            setLoadingRoles(false);
        }
    };

    // Initialize form
    useEffect(() => {
        if (open) {
            if (user) {
                // Edit mode
                setFullName(user.fullName);
                setEmail(user.email);
                setPhoneNumber(user.phoneNumber);
                setAddress(user.address);
                setDateOfBirth(user.dateOfBirth.split('T')[0]);
                setNote(user.note || '');
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
            }
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
            toast.warning('⚠️ Vui lòng điền đầy đủ thông tin bắt buộc!');
            return;
        }

        // Validate phone number (exactly 10 digits)
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phoneNumber.trim())) {
            toast.warning('⚠️ Số điện thoại phải có đúng 10 chữ số!');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            toast.warning('⚠️ Email không hợp lệ!');
            return;
        }

        // Validate date of birth (not in the future)
        const selectedDate = new Date(dateOfBirth);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate > today) {
            toast.warning('⚠️ Ngày sinh không được sau ngày hôm nay!');
            return;
        }

        // Validate age (at least 16 years old)
        const age = today.getFullYear() - selectedDate.getFullYear();
        if (age < 16 || (age === 16 && today < new Date(selectedDate.setFullYear(selectedDate.getFullYear() + 16)))) {
            toast.warning('⚠️ Người dùng phải từ 16 tuổi trở lên!');
            return;
        }

        if (!user && !password) {
            toast.warning('⚠️ Vui lòng nhập mật khẩu!');
            return;
        }

        // Validate password length
        if (password && password.length < 6) {
            toast.warning('⚠️ Mật khẩu phải có ít nhất 6 ký tự!');
            return;
        }

        if (!selectedRoleId) {
            toast.warning('⚠️ Vui lòng chọn vai trò!');
            return;
        }

        if (showBranchField && !selectedBranchId) {
            toast.warning('⚠️ Vui lòng chọn chi nhánh cho vai trò này!');
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

                toast.success('✅ Cập nhật người dùng thành công!');
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

                toast.success('✅ Tạo người dùng mới thành công!');
            }

            onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error('Failed to save user:', error);
            toast.error('❌ Không thể lưu thông tin người dùng. Vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <Card className="w-full max-w-6xl max-h-[98vh] overflow-hidden bg-white shadow-2xl rounded-2xl border-0 py-0">
                {/* Compact Header */}
                <div className="sticky top-0 bg-[#78A243] p-4 flex items-center justify-between z-10 shadow-lg">
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                            <UserIcon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">
                                {user ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
                            </h2>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onOpenChange(false)}
                        className="border-white/30 bg-white/10 hover:bg-white/20 text-white hover:text-white backdrop-blur-sm h-8 w-8 p-0"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* Body - Compact Layout */}
                <div className="overflow-y-auto max-h-[calc(98vh-120px)]">
                    <div className="p-5 space-y-5">
                        {/* 3-Column Layout */}
                        <div className="grid grid-cols-3 gap-5">
                            {/* Column 1: Personal Info */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 pb-2 border-b border-[#78A243]/30">
                                    <div className="w-6 h-6 bg-[#78A243] rounded-md flex items-center justify-center">
                                        <span className="text-white font-bold text-xs">1</span>
                                    </div>
                                    <h3 className="text-sm font-bold text-[#2D1E1A]">Thông tin cá nhân</h3>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-[#2D1E1A] flex items-center gap-1">
                                        <UserIcon className="h-3 w-3" />
                                        Họ và tên <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="Nguyễn Văn A"
                                        className="w-full px-3 py-2 border border-[#78A243]/30 rounded-lg text-sm text-[#2D1E1A] focus:border-[#78A243] focus:ring-1 focus:ring-[#78A243]/20 transition-all outline-none"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-[#2D1E1A] flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        Ngày sinh <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={dateOfBirth}
                                        onChange={(e) => setDateOfBirth(e.target.value)}
                                        max={new Date().toISOString().split('T')[0]}
                                        className="w-full px-3 py-2 border border-[#78A243]/30 rounded-lg text-sm text-[#2D1E1A] focus:border-[#78A243] focus:ring-1 focus:ring-[#78A243]/20 transition-all outline-none"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-[#2D1E1A] flex items-center gap-1">
                                        <Mail className="h-3 w-3" />
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="example@comtam.com"
                                        className="w-full px-3 py-2 border border-[#78A243]/30 rounded-lg text-sm focus:border-[#78A243] focus:ring-1 focus:ring-[#78A243]/20 transition-all"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-[#2D1E1A] flex items-center gap-1">
                                        <Phone className="h-3 w-3" />
                                        Số điện thoại <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        placeholder="0900000000"
                                        className="w-full px-3 py-2 border border-[#78A243]/30 rounded-lg text-sm focus:border-[#78A243] focus:ring-1 focus:ring-[#78A243]/20 transition-all"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-[#2D1E1A] flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        Địa chỉ
                                    </label>
                                    <input
                                        type="text"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        placeholder="123 Nguyễn Huệ, Q1"
                                        className="w-full px-3 py-2 border border-[#78A243]/30 rounded-lg text-sm focus:border-[#78A243] focus:ring-1 focus:ring-[#78A243]/20 transition-all"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-[#2D1E1A] flex items-center gap-1">
                                        <FileText className="h-3 w-3" />
                                        Ghi chú
                                    </label>
                                    <textarea
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        placeholder="Ghi chú..."
                                        rows={2}
                                        className="w-full px-3 py-2 border border-[#78A243]/30 rounded-lg text-sm focus:border-[#78A243] focus:ring-1 focus:ring-[#78A243]/20 transition-all resize-none"
                                    />
                                </div>
                            </div>

                            {/* Column 2: Account Info */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 pb-2 border-b border-[#78A243]/30">
                                    <div className="w-6 h-6 bg-[#78A243] rounded-md flex items-center justify-center">
                                        <span className="text-white font-bold text-xs">2</span>
                                    </div>
                                    <h3 className="text-sm font-bold text-[#2D1E1A]">Thông tin tài khoản</h3>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-[#2D1E1A]">
                                        Mật khẩu {!user && <span className="text-red-500">*</span>}
                                    </label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder={user ? "Để trống nếu không đổi" : "Nhập mật khẩu"}
                                        className="w-full px-3 py-2 border border-[#78A243]/30 rounded-lg text-sm focus:border-[#78A243] focus:ring-1 focus:ring-[#78A243]/20 transition-all"
                                    />
                                </div>

                                {user && (
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-[#2D1E1A]">
                                            Điểm thành viên
                                        </label>
                                        <input
                                            type="number"
                                            value={memberPoint}
                                            onChange={(e) => setMemberPoint(parseInt(e.target.value) || 0)}
                                            className="w-full px-3 py-2 border border-[#78A243]/30 rounded-lg text-sm focus:border-[#78A243] focus:ring-1 focus:ring-[#78A243]/20 transition-all"
                                        />
                                    </div>
                                )}

                                <div className="space-y-2 pt-2">
                                    <div className="flex items-center gap-2 p-2 bg-[#78A243]/10 rounded border border-[#78A243]/30">
                                        <input
                                            type="checkbox"
                                            id="emailVerified"
                                            checked={emailVerified}
                                            onChange={(e) => setEmailVerified(e.target.checked)}
                                            className="w-3.5 h-3.5 rounded border-[#78A243]/50 text-[#78A243]"
                                        />
                                        <label htmlFor="emailVerified" className="text-xs font-semibold text-[#2D1E1A] cursor-pointer">
                                            Email đã xác thực
                                        </label>
                                    </div>

                                    <div className="flex items-center gap-2 p-2 bg-[#78A243]/10 rounded border border-[#78A243]/30">
                                        <input
                                            type="checkbox"
                                            id="phoneVerified"
                                            checked={phoneVerified}
                                            onChange={(e) => setPhoneVerified(e.target.checked)}
                                            className="w-3.5 h-3.5 rounded border-[#78A243]/50 text-[#78A243]"
                                        />
                                        <label htmlFor="phoneVerified" className="text-xs font-semibold text-[#2D1E1A] cursor-pointer">
                                            SĐT đã xác thực
                                        </label>
                                    </div>

                                    {user && (
                                        <>
                                            <div className="flex items-center gap-2 p-2 bg-[#EBD187]/30 rounded border border-[#DA7339]/30">
                                                <input
                                                    type="checkbox"
                                                    id="isBusy"
                                                    checked={isBusy}
                                                    onChange={(e) => setIsBusy(e.target.checked)}
                                                    className="w-3.5 h-3.5 rounded border-yellow-400 text-yellow-600"
                                                />
                                                <label htmlFor="isBusy" className="text-xs font-semibold text-[#2D1E1A] cursor-pointer">
                                                    Đang bận
                                                </label>
                                            </div>

                                            <div className="flex items-center gap-2 p-2 bg-red-50 rounded border border-red-200">
                                                <input
                                                    type="checkbox"
                                                    id="isBan"
                                                    checked={isBan}
                                                    onChange={(e) => setIsBan(e.target.checked)}
                                                    className="w-3.5 h-3.5 rounded border-red-400 text-red-600"
                                                />
                                                <label htmlFor="isBan" className="text-xs font-semibold text-[#2D1E1A] cursor-pointer">
                                                    Khóa tài khoản
                                                </label>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Column 3: Role & Branch */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 pb-2 border-b border-[#78A243]/30">
                                    <div className="w-6 h-6 bg-[#78A243] rounded-md flex items-center justify-center">
                                        <span className="text-white font-bold text-xs">3</span>
                                    </div>
                                    <h3 className="text-sm font-bold text-[#2D1E1A]">Vai trò & Chi nhánh</h3>
                                </div>

                                {loadingRoles ? (
                                    <div className="text-center py-8 text-sm text-gray-500">
                                        Đang tải...
                                    </div>
                                ) : (
                                    <>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-[#2D1E1A] flex items-center gap-1">
                                                <Shield className="h-3 w-3" />
                                                Vai trò <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={selectedRoleId || ''}
                                                onChange={(e) => {
                                                    setSelectedRoleId(parseInt(e.target.value) || null);
                                                    setSelectedBranchId(null);
                                                }}
                                                className="w-full px-3 py-2 border border-[#78A243]/30 rounded-lg text-sm focus:border-[#78A243] focus:ring-1 focus:ring-[#78A243]/20 transition-all bg-white"
                                            >
                                                <option value="">Chọn vai trò</option>
                                                {roles.map(role => (
                                                    <option key={role.id} value={role.id}>
                                                        {role.name} {role.isInternal ? '🔒' : ''}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {showBranchField && (
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-semibold text-[#2D1E1A] flex items-center gap-1">
                                                    <Building className="h-3 w-3" />
                                                    Chi nhánh <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    value={selectedBranchId || ''}
                                                    onChange={(e) => setSelectedBranchId(parseInt(e.target.value) || null)}
                                                    className="w-full px-3 py-2 border border-[#78A243]/30 rounded-lg text-sm focus:border-[#78A243] focus:ring-1 focus:ring-[#78A243]/20 transition-all bg-white"
                                                >
                                                    <option value="">Chọn chi nhánh</option>
                                                    {branches.map(branch => (
                                                        <option key={branch.id} value={branch.id}>
                                                            {branch.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}

                                        {selectedRole?.isInternal && (
                                            <div className="p-2 bg-[#78A243]/10 border border-[#78A243]/30 rounded-lg">
                                                <p className="text-xs text-blue-700">
                                                    ℹ️ Vai trò hệ thống yêu cầu chọn chi nhánh
                                                </p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Compact Footer */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-3 flex gap-2 justify-end shadow-lg">
                    <Button
                        onClick={() => onOpenChange(false)}
                        variant="outline"
                        className="px-4 py-2 text-sm border border-[#78A243]/30 hover:bg-[#78A243]/5 font-semibold"
                    >
                        <X className="h-3.5 w-3.5 mr-1.5" />
                        Hủy
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-4 py-2 text-sm bg-[#78A243] hover:bg-[#78A243]/90 text-white shadow-lg hover:shadow-xl transition-all font-semibold"
                    >
                        {loading ? (
                            <>
                                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin mr-1.5"></div>
                                Đang lưu...
                            </>
                        ) : (
                            <>
                                <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                                {user ? 'Cập nhật' : 'Tạo mới'}
                            </>
                        )}
                    </Button>
                </div>
            </Card>
        </div>
    );
}
