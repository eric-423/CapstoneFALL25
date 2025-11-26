'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    Users,
    Plus,
    Edit2,
    Ban,
    ShieldCheck,
    UserCheck,
    Eye,
    Search,
    X,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AdminCard } from '../components/AdminCard';
import { AdminPageLayout, AdminPageHeader } from '../components/AdminPageLayout';
import { getAllUsers, type UserSearchRequest } from '@/apis/user.api';
import { banUser, unbanUser, type User } from '@/apis/admin-user.api';
import { getBranches, type Branch } from '@/apis/branch.api';
import { UserFormDialog } from './components/UserFormDialog';
import { ConfirmDialog } from './components/ConfirmDialog';
import { RolesManagementModal } from './components/RolesManagementModal';
import Link from 'next/link';

export default function UsersManagementPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Filter states
    const [searchInput, setSearchInput] = useState(''); // Temporary input value
    const [searchKeyword, setSearchKeyword] = useState(''); // Applied filter value
    const [roleFilter, setRoleFilter] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sortBy, setSortBy] = useState('id');
    const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('ASC');

    // Dialog states
    const [showDialog, setShowDialog] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [showRolesModal, setShowRolesModal] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; type: 'ban' | 'unban' | null; userId: number; userName: string }>({
        open: false,
        type: null,
        userId: 0,
        userName: ''
    });
    const [actionLoading, setActionLoading] = useState(false);
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        banned: 0,
        verified: 0
    });

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
            if (searchKeyword) searchRequest.keyword = searchKeyword;
            if (roleFilter) searchRequest.role = roleFilter;
            if (statusFilter) searchRequest.status = statusFilter === 'active';

            const response = await getAllUsers(searchRequest);
            setUsers(response.data.content);
            setTotalElements(response.data.totalElements);
            setTotalPages(response.data.totalPages);

            // Calculate stats from ALL filtered results
            // If all results fit in one page, use current data to avoid extra API call
            let allFilteredUsers = response.data.content;

            if (response.data.totalElements > response.data.content.length) {
                // Need to fetch all results for accurate stats
                const statsRequest = { ...searchRequest, page: 0, size: response.data.totalElements };
                const statsResponse = await getAllUsers(statsRequest);
                allFilteredUsers = statsResponse.data.content;
            }

            setStats({
                total: response.data.totalElements,
                active: allFilteredUsers.filter((u: User) => !u.isBan).length,
                banned: allFilteredUsers.filter((u: User) => u.isBan).length,
                verified: allFilteredUsers.filter((u: User) => u.emailVerified || u.phoneVerified).length,
            });
        } catch (error) {
            console.error('Failed to fetch users:', error);
            toast.error('Không thể tải danh sách người dùng!');
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, sortBy, sortDirection, searchKeyword, roleFilter, statusFilter]);

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

            if (confirmDialog.type === 'ban') {
                await banUser(confirmDialog.userId);
                toast.success(`Đã khóa tài khoản "${confirmDialog.userName}" thành công!`);
            } else if (confirmDialog.type === 'unban') {
                await unbanUser(confirmDialog.userId);
                toast.success(`Đã mở khóa tài khoản "${confirmDialog.userName}" thành công!`);
            }

            await fetchUsers();
            setConfirmDialog({ open: false, type: null, userId: 0, userName: '' });
        } catch (error) {
            console.error('Failed to perform action:', error);
            const errorMessages = {
                ban: 'Không thể khóa tài khoản!',
                unban: 'Không thể mở khóa tài khoản!',
            };
            toast.error(`${confirmDialog.type ? errorMessages[confirmDialog.type] : 'Có lỗi xảy ra!'}`);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDialogSuccess = () => {
        fetchUsers();
    };

    // Clear all filters
    const handleClearFilters = () => {
        setSearchInput('');
        setSearchKeyword('');
        setRoleFilter('');
        setStatusFilter('');
        setCurrentPage(0);
    };

    // Handle search - apply filter from input
    const handleSearch = () => {
        setSearchKeyword(searchInput);
        setCurrentPage(0);
    };

    // Handle page change
    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <AdminPageLayout>
            <AdminPageHeader
                title="Quản lý người dùng"
                icon={Users}
                actions={
                    <div className="flex items-center gap-3">
                        <Button
                            onClick={() => setShowRolesModal(true)}
                            variant="outline"
                            className="border-[#78A243] bg-[#78A243]/10 text-[#78A243] hover:bg-[#78A243]/20 font-semibold"
                        >
                            <ShieldCheck className="h-4 w-4 mr-2" />
                            Quản lý vai trò
                        </Button>
                        <Button
                            onClick={handleCreateUser}
                            className="bg-[#78A243] hover:bg-[#78A243]/90 text-white shadow-md hover:shadow-lg transition-all"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Thêm người dùng
                        </Button>
                    </div>
                }
            />

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <AdminCard
                    title="Tổng người dùng"
                    value={stats.total}
                    icon={Users}
                    subtitle={searchKeyword || roleFilter || statusFilter ? "Kết quả tìm kiếm" : "Tài khoản trong hệ thống"}
                />
                <AdminCard
                    title="Đang hoạt động"
                    value={stats.active}
                    icon={UserCheck}
                    subtitle={searchKeyword || roleFilter || statusFilter ? "Trong kết quả" : "Tài khoản có thể đăng nhập"}
                />
                <AdminCard
                    title="Đã khóa"
                    value={stats.banned}
                    icon={Ban}
                    subtitle={searchKeyword || roleFilter || statusFilter ? "Trong kết quả" : "Tài khoản bị vô hiệu hóa"}
                />
                <AdminCard
                    title="Đã xác thực"
                    value={stats.verified}
                    icon={ShieldCheck}
                    subtitle={searchKeyword || roleFilter || statusFilter ? "Trong kết quả" : "Xác thực Email hoặc SĐT"}
                />
            </div>


            {/* Filters Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-gradient-to-r from-[#EBD187]/20 to-[#78A243]/10 backdrop-blur-sm border-[#78A243]/20 border shadow-sm rounded-xl">
                <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[200px]">
                    {/* Main Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#2D1E1A]/60" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm người dùng... (Enter để tìm)"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSearch();
                                }
                            }}
                            className="w-full max-w-[200px] pl-10 pr-4 py-2 border bg-white/80 border-[#78A243]/30 rounded-lg text-sm focus:border-[#78A243] focus:ring-1 focus:ring-[#78A243]/20 outline-none"
                        />
                    </div>
                    <select
                        title="Vai trò"
                        value={roleFilter}
                        onChange={(e) => {
                            setRoleFilter(e.target.value);
                            setCurrentPage(0);
                        }}
                        className="px-3 py-2 border bg-white/80 border-[#78A243]/30 rounded-lg text-sm text-[#2D1E1A] focus:border-[#78A243] outline-none"
                    >
                        <option value="">Ất cả vai trò</option>
                        <option value="ADMIN">ADMIN</option>
                        <option value="MANAGER">MANAGER</option>
                        <option value="WAITER">WAITER</option>
                        <option value="CHEF">CHEF</option>
                        <option value="SHIPPER">SHIPPER</option>
                        <option value="CUSTOMER">CUSTOMER</option>
                    </select>

                    <select
                        title="Trạng thái"
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setCurrentPage(0);
                        }}
                        className="px-3 py-2 border bg-white/80 border-[#78A243]/30 rounded-lg text-sm text-[#2D1E1A] focus:border-[#78A243] outline-none"
                    >
                        <option value="">Ất cả trạng thái</option>
                        <option value="active">Hoạt động</option>
                        <option value="inactive">Đã khóa</option>
                    </select>

                    {(searchInput || searchKeyword || roleFilter || statusFilter) && (
                        <Button
                            onClick={handleClearFilters}
                            variant="ghost"
                            size="sm"
                        >
                            <X className="h-4 w-4 mr-1" />
                            Xóa lọc
                        </Button>
                    )}
                </div>
            </div>

            {/* Users Table */}
            <Card className="overflow-hidden py-0">
                {loading ? (
                    <div className="p-12 text-center text-[#2D1E1A]/70">
                        <div className="w-12 h-12 border-4 border-[#EBD187] border-t-[#78A243] rounded-full animate-spin mx-auto mb-4"></div>
                        <p>Đang tải danh sách người dùng...</p>
                    </div>
                ) : users.length === 0 ? (
                    <div className="p-12 text-center text-[#2D1E1A]/70">
                        <Users className="h-16 w-16 mx-auto mb-4 text-[#78A243]/30" />
                        <p className="font-semibold">Đảng tìm thấy người dùng nào</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-[#78A243]/10 to-[#EBD187]/20 border-b-2 border-[#78A243]/30">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-bold text-[#2D1E1A]">ID</th>
                                        <th className="px-4 py-3 text-left text-sm font-bold text-[#2D1E1A]">Họ tên</th>
                                        <th className="px-4 py-3 text-left text-sm font-bold text-[#2D1E1A]">Email</th>
                                        <th className="px-4 py-3 text-left text-sm font-bold text-[#2D1E1A]">SĐT</th>
                                        <th className="px-4 py-3 text-left text-sm font-bold text-[#2D1E1A]">Vai trò</th>
                                        <th className="px-4 py-3 text-left text-sm font-bold text-[#2D1E1A]">Chi nhánh</th>
                                        <th className="px-4 py-3 text-left text-sm font-bold text-[#2D1E1A]">Trạng thái</th>
                                        <th className="px-4 py-3 text-right text-sm font-bold text-[#2D1E1A]">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#78A243]/10">
                                    {users.map((user) => (
                                        <tr key={user.id} className="hover:bg-[#EBD187]/10 transition-colors">
                                            <td className="px-4 py-3 text-sm font-semibold text-[#2D1E1A]">{user.id}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-[#2D1E1A]">{user.fullName}</span>
                                                    {user.isBusy && (
                                                        <Badge className="bg-[#EBD187]/50 text-[#DA7339] border-[#DA7339]/30 text-xs w-fit mt-1">
                                                            Đang bận
                                                        </Badge>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-[#2D1E1A]">{user.email}</span>
                                                    {user.emailVerified && (
                                                        <Badge className="bg-[#78A243]/20 text-[#78A243] border-[#78A243]/30 text-xs">✓</Badge>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-[#2D1E1A]">{user.phoneNumber}</span>
                                                    {user.phoneVerified && (
                                                        <Badge className="bg-[#78A243]/20 text-[#78A243] border-[#78A243]/30 text-xs">✓</Badge>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge className="bg-[#DA7339]/20 text-[#DA7339] border-[#DA7339]/30 font-semibold">
                                                    {user.role}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-[#2D1E1A]">
                                                {user.memberAssociationName || 'N/A'}
                                            </td>
                                            <td className="px-4 py-3">
                                                {user.isBan ? (
                                                    <Badge className="bg-red-100 text-red-700 border-red-300">
                                                        🔒 Đã khóa
                                                    </Badge>
                                                ) : (
                                                    <Badge className="bg-[#78A243]/20 text-[#78A243] border-[#78A243]/30">
                                                        ✓ Hoạt động
                                                    </Badge>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={`/manager/users/${user.id}`}>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-[#78A243] border-[#78A243]/30 hover:bg-[#78A243]/10"
                                                        >
                                                            <Eye className="h-3 w-3" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        onClick={() => handleEditUser(user)}
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-[#DA7339] border-[#DA7339]/30 hover:bg-[#DA7339]/10"
                                                    >
                                                        <Edit2 className="h-3 w-3" />
                                                    </Button>
                                                    {user.isBan ? (
                                                        <Button
                                                            onClick={() => setConfirmDialog({ open: true, type: 'unban', userId: user.id, userName: user.fullName })}
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-[#78A243] border-[#78A243]/30 hover:bg-[#78A243]/10"
                                                            disabled={actionLoading}
                                                        >
                                                            <UserCheck className="h-3 w-3" />
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            onClick={() => setConfirmDialog({ open: true, type: 'ban', userId: user.id, userName: user.fullName })}
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-[#DA7339] border-[#DA7339]/30 hover:bg-[#DA7339]/10"
                                                            disabled={actionLoading}
                                                        >
                                                            <Ban className="h-3 w-3" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="px-4 py-3 border-t border-[#78A243]/20 bg-gradient-to-r from-[#EBD187]/10 to-[#78A243]/5">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-[#2D1E1A]/80">
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

            {/* Roles Management Modal */}
            <RolesManagementModal
                open={showRolesModal}
                onOpenChange={setShowRolesModal}
                onRoleUpdated={fetchUsers}
            />
        </AdminPageLayout>
    );
}
