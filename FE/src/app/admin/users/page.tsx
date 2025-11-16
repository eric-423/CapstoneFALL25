'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    Users,
    Plus,
    Edit2,
    Trash2,
    Ban,
    ShieldCheck,
    UserCheck,
    Eye,
    Search,
    Filter,
    X,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AdminPageLayout, AdminPageHeader, AdminStatsCard, AdminStatsGrid } from '../components/AdminPageLayout';
import { getUsers, deleteUser, banUser, unbanUser, type User } from '@/apis/admin-user.api';
import { UserFormDialog } from './components/UserFormDialog';
import { ConfirmDialog } from './components/ConfirmDialog';
import Link from 'next/link';

export default function UsersManagementPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('');

    // Dialog states
    const [showDialog, setShowDialog] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; type: 'ban' | 'unban' | 'delete' | null; userId: number; userName: string }>({
        open: false,
        type: null,
        userId: 0,
        userName: ''
    });
    const [actionLoading, setActionLoading] = useState(false);

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getUsers();
            setUsers(data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            toast.error('❌ Không thể tải danh sách người dùng!');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleCreateUser = () => {
        setEditingUser(null);
        setShowDialog(true);
    };

    const handleEditUser = (user: User) => {
        setEditingUser(user);
        setShowDialog(true);
    };

    const handleConfirmAction = async () => {
        try {
            setActionLoading(true);

            if (confirmDialog.type === 'delete') {
                await deleteUser(confirmDialog.userId);
                toast.success(`🗑️ Đã xóa người dùng "${confirmDialog.userName}" thành công!`);
            } else if (confirmDialog.type === 'ban') {
                await banUser(confirmDialog.userId);
                toast.success(`🔒 Đã khóa tài khoản "${confirmDialog.userName}" thành công!`);
            } else if (confirmDialog.type === 'unban') {
                await unbanUser(confirmDialog.userId);
                toast.success(`✅ Đã mở khóa tài khoản "${confirmDialog.userName}" thành công!`);
            }

            await fetchUsers();
            setConfirmDialog({ open: false, type: null, userId: 0, userName: '' });
        } catch (error) {
            console.error('Failed to perform action:', error);
            const errorMessages = {
                delete: 'Không thể xóa người dùng!',
                ban: 'Không thể khóa tài khoản!',
                unban: 'Không thể mở khóa tài khoản!',
            };
            toast.error(`❌ ${confirmDialog.type ? errorMessages[confirmDialog.type] : 'Có lỗi xảy ra!'}`);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDialogSuccess = () => {
        fetchUsers();
    };

    // Filter users
    const filteredUsers = users.filter(user => {
        const matchesKeyword = !searchKeyword ||
            user.fullName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            user.email.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            user.phoneNumber.includes(searchKeyword);

        const matchesRole = !roleFilter || user.role === roleFilter;
        const matchesStatus = !statusFilter ||
            (statusFilter === 'banned' && user.isBan) ||
            (statusFilter === 'active' && !user.isBan);

        return matchesKeyword && matchesRole && matchesStatus;
    });

    const stats = {
        total: users.length,
        active: users.filter(u => !u.isBan).length,
        banned: users.filter(u => u.isBan).length,
        verified: users.filter(u => u.emailVerified || u.phoneVerified).length,
    };

    const uniqueRoles = Array.from(new Set(users.map(u => u.role)));

    return (
        <AdminPageLayout>
            <AdminPageHeader
                title="Quản lý người dùng"
                description="Quản lý tài khoản và phân quyền người dùng"
                icon={Users}
                actions={
                    <div className="flex gap-2">
                        <Link href="/admin/users/roles">
                            <Button
                                variant="outline"
                                className="border-2 border-blue-300 text-blue-700 hover:bg-blue-50"
                            >
                                <ShieldCheck className="h-4 w-4 mr-2" />
                                Quản lý vai trò
                            </Button>
                        </Link>
                        <Button
                            onClick={handleCreateUser}
                            className="bg-gradient-to-r from-[#EC6426] to-[#F8A91F] hover:from-[#EC6426]/90 hover:to-[#F8A91F]/90 text-white"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Thêm người dùng
                        </Button>
                    </div>
                }
            />

            {/* Stats */}
            <AdminStatsGrid>
                <AdminStatsCard
                    title="Tổng người dùng"
                    value={stats.total}
                    icon={Users}
                />
                <AdminStatsCard
                    title="Hoạt động"
                    value={stats.active}
                    icon={ShieldCheck}
                />
                <AdminStatsCard
                    title="Đã khóa"
                    value={stats.banned}
                    icon={Ban}
                />
                <AdminStatsCard
                    title="Đã xác thực"
                    value={stats.verified}
                    icon={ShieldCheck}
                />
            </AdminStatsGrid>

            {/* Filters */}
            <Card className="p-4 space-y-3">
                <div className="flex flex-wrap gap-3">
                    <div className="flex-1 min-w-[200px]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm theo tên, email, số điện thoại..."
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                            />
                        </div>
                    </div>
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-4 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                    >
                        <option value="">Tất cả vai trò</option>
                        {uniqueRoles.map(role => (
                            <option key={role} value={role}>{role}</option>
                        ))}
                    </select>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="active">Hoạt động</option>
                        <option value="banned">Đã khóa</option>
                    </select>
                    {(searchKeyword || roleFilter || statusFilter) && (
                        <Button
                            onClick={() => {
                                setSearchKeyword('');
                                setRoleFilter('');
                                setStatusFilter('');
                            }}
                            variant="outline"
                            size="sm"
                        >
                            <X className="h-4 w-4 mr-2" />
                            Xóa bộ lọc
                        </Button>
                    )}
                </div>
                <div className="text-sm text-gray-600">
                    Hiển thị <span className="font-bold">{filteredUsers.length}</span> / {users.length} người dùng
                </div>
            </Card>

            {/* Users Table */}
            <Card className="overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-500">
                        <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
                        <p>Đang tải danh sách người dùng...</p>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                        <p className="font-semibold">Không tìm thấy người dùng nào</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b-2 border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">ID</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Họ tên</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Email</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">SĐT</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Vai trò</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Trạng thái</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Điểm</th>
                                    <th className="px-4 py-3 text-right text-xs font-bold text-gray-700">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 text-sm font-semibold text-gray-900">{user.id}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold text-gray-900">{user.fullName}</span>
                                                {user.isBusy && (
                                                    <Badge className="bg-yellow-100 text-yellow-700 text-xs w-fit mt-1">
                                                        Đang bận
                                                    </Badge>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-900">{user.email}</span>
                                                {user.emailVerified && (
                                                    <Badge className="bg-green-100 text-green-700 text-xs">✓</Badge>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-900">{user.phoneNumber}</span>
                                                {user.phoneVerified && (
                                                    <Badge className="bg-green-100 text-green-700 text-xs">✓</Badge>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge className="bg-blue-100 text-blue-700 border-blue-300 font-semibold">
                                                {user.role}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3">
                                            {user.isBan ? (
                                                <Badge className="bg-red-100 text-red-700 border-red-300">
                                                    🔒 Đã khóa
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-green-100 text-green-700 border-green-300">
                                                    ✓ Hoạt động
                                                </Badge>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                                            {user.memberPoint.toLocaleString('vi-VN')}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/admin/users/${user.id}`}>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                                    >
                                                        <Eye className="h-3 w-3" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    onClick={() => handleEditUser(user)}
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-orange-600 border-orange-200 hover:bg-orange-50"
                                                >
                                                    <Edit2 className="h-3 w-3" />
                                                </Button>
                                                {user.isBan ? (
                                                    <Button
                                                        onClick={() => setConfirmDialog({ open: true, type: 'unban', userId: user.id, userName: user.fullName })}
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-green-600 border-green-200 hover:bg-green-50"
                                                        disabled={actionLoading}
                                                    >
                                                        <UserCheck className="h-3 w-3" />
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        onClick={() => setConfirmDialog({ open: true, type: 'ban', userId: user.id, userName: user.fullName })}
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-yellow-600 border-yellow-200 hover:bg-yellow-50"
                                                        disabled={actionLoading}
                                                    >
                                                        <Ban className="h-3 w-3" />
                                                    </Button>
                                                )}
                                                <Button
                                                    onClick={() => setConfirmDialog({ open: true, type: 'delete', userId: user.id, userName: user.fullName })}
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-red-600 border-red-200 hover:bg-red-50"
                                                    disabled={actionLoading}
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            {/* User Form Dialog */}
            <UserFormDialog
                open={showDialog}
                onOpenChange={setShowDialog}
                user={editingUser}
                onSuccess={handleDialogSuccess}
            />

            {/* Confirm Dialog */}
            {confirmDialog.type && (
                <ConfirmDialog
                    open={confirmDialog.open}
                    onOpenChange={(open) => setConfirmDialog({ open, type: null, userId: 0, userName: '' })}
                    onConfirm={handleConfirmAction}
                    type={confirmDialog.type}
                    userName={confirmDialog.userName}
                    loading={actionLoading}
                />
            )}
        </AdminPageLayout>
    );
}
