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
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AdminPageLayout, AdminPageHeader, AdminStatsCard, AdminStatsGrid } from '../components/AdminPageLayout';
import { getAllUsers, type UserSearchRequest } from '@/apis/user.api';
import { getUsers, deleteUser, banUser, unbanUser, type User } from '@/apis/admin-user.api';
import { getBranches, type Branch } from '@/apis/branch.api';
import { UserFormDialog } from './components/UserFormDialog';
import { ConfirmDialog } from './components/ConfirmDialog';
import Link from 'next/link';

export default function UsersManagementPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Filter states
    const [searchKeyword, setSearchKeyword] = useState('');
    const [phoneFilter, setPhoneFilter] = useState('');
    const [emailFilter, setEmailFilter] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('');
    const [branchFilter, setBranchFilter] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sortBy, setSortBy] = useState('id');
    const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('ASC');

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

    // Fetch branches for filter
    useEffect(() => {
        const loadBranches = async () => {
            try {
                const data = await getBranches();
                setBranches(data);
            } catch (error) {
                console.error('Failed to fetch branches:', error);
            }
        };
        loadBranches();
    }, []);

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);

            const searchRequest: UserSearchRequest = {
                page: currentPage,
                size: pageSize,
                sortBy,
                sortDirection,
            };

            // Add filters if they exist
            if (searchKeyword) searchRequest.name = searchKeyword;
            if (phoneFilter) searchRequest.phone = phoneFilter;
            if (emailFilter) searchRequest.email = emailFilter;
            if (roleFilter) searchRequest.role = roleFilter;
            if (branchFilter) searchRequest.branchId = parseInt(branchFilter);
            if (statusFilter) searchRequest.status = statusFilter === 'active';

            const response = await getAllUsers(searchRequest);
            setUsers(response.data.content);
            setTotalElements(response.data.totalElements);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            toast.error('❌ Không thể tải danh sách người dùng!');
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, sortBy, sortDirection, searchKeyword, phoneFilter, emailFilter, roleFilter, branchFilter, statusFilter]);

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

    // Clear all filters
    const handleClearFilters = () => {
        setSearchKeyword('');
        setPhoneFilter('');
        setEmailFilter('');
        setRoleFilter('');
        setBranchFilter('');
        setStatusFilter('');
        setCurrentPage(0);
    };

    // Handle search with debounce
    const handleSearch = () => {
        setCurrentPage(0);
        fetchUsers();
    };

    // Handle page change
    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };

    const stats = {
        total: totalElements,
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
            <Card className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div>
                        <label className="text-xs font-semibold text-gray-700 mb-1 block">Tìm theo tên</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Nhập tên người dùng..."
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-gray-700 mb-1 block">Số điện thoại</label>
                        <input
                            type="text"
                            placeholder="Nhập số điện thoại..."
                            value={phoneFilter}
                            onChange={(e) => setPhoneFilter(e.target.value)}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-gray-700 mb-1 block">Email</label>
                        <input
                            type="text"
                            placeholder="Nhập email..."
                            value={emailFilter}
                            onChange={(e) => setEmailFilter(e.target.value)}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-gray-700 mb-1 block">Vai trò</label>
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                        >
                            <option value="">Tất cả vai trò</option>
                            <option value="ADMIN">ADMIN</option>
                            <option value="MANAGER">MANAGER</option>
                            <option value="WAITER">WAITER</option>
                            <option value="CHEF">CHEF</option>
                            <option value="SHIPPER">SHIPPER</option>
                            <option value="CUSTOMER">CUSTOMER</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-gray-700 mb-1 block">Chi nhánh</label>
                        <select
                            value={branchFilter}
                            onChange={(e) => setBranchFilter(e.target.value)}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                        >
                            <option value="">Tất cả chi nhánh</option>
                            {branches.map(branch => (
                                <option key={branch.id} value={branch.id}>{branch.address}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-gray-700 mb-1 block">Trạng thái</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                        >
                            <option value="">Tất cả trạng thái</option>
                            <option value="active">Hoạt động</option>
                            <option value="inactive">Đã khóa</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                        <Button
                            onClick={handleSearch}
                            className="bg-gradient-to-r from-[#EC6426] to-[#F8A91F] hover:from-[#EC6426]/90 hover:to-[#F8A91F]/90 text-white"
                        >
                            <Search className="h-4 w-4 mr-2" />
                            Tìm kiếm
                        </Button>
                        {(searchKeyword || phoneFilter || emailFilter || roleFilter || branchFilter || statusFilter) && (
                            <Button
                                onClick={handleClearFilters}
                                variant="outline"
                            >
                                <X className="h-4 w-4 mr-2" />
                                Xóa bộ lọc
                            </Button>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <label className="text-sm text-gray-700 font-medium">Hiển thị:</label>
                        <select
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(parseInt(e.target.value));
                                setCurrentPage(0);
                            }}
                            className="px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-orange-400"
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                        <span className="text-sm text-gray-600">
                            Tổng: <span className="font-bold">{totalElements}</span> người dùng
                        </span>
                    </div>
                </div>
            </Card>

            {/* Users Table */}
            <Card className="overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-500">
                        <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
                        <p>Đang tải danh sách người dùng...</p>
                    </div>
                ) : users.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                        <p className="font-semibold">Không tìm thấy người dùng nào</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b-2 border-gray-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">ID</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Họ tên</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Email</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">SĐT</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Vai trò</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Chi nhánh</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Trạng thái</th>
                                        <th className="px-4 py-3 text-right text-xs font-bold text-gray-700">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {users.map((user) => (
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
                                            <td className="px-4 py-3 text-sm text-gray-900">
                                                {user.memberAssociationName || 'N/A'}
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

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-700">
                                        Trang <span className="font-semibold">{currentPage + 1}</span> / {totalPages}
                                        {' '}(Hiển thị {users.length} / {totalElements} người dùng)
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 0}
                                            variant="outline"
                                            size="sm"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                            Trước
                                        </Button>
                                        <Button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage >= totalPages - 1}
                                            variant="outline"
                                            size="sm"
                                        >
                                            Sau
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
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
