'use client';

import React, { useState, useMemo } from 'react';
import { Users, UserPlus, Shield, Lock, FileText, Award, Clock, CheckCircle } from 'lucide-react';
import { FilterBar, FilterChip, SavedFilter } from '@/components/common/FilterBar';
import { DataTable, Column } from '@/components/common/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { User, UserStatus, UserRole } from '@/utils/types/user.types';
import { MOCK_USERS } from '@/utils/mocks/data/users.mock';

// Mock enhanced users data
const mockEnhancedUsers: User[] = MOCK_USERS.map((u, idx) => ({
    id: String(u.id),
    fullName: u.fullName,
    email: u.email || `user${u.id}@tamtac.com`,
    phone: u.phone,
    primaryRole: u.role as UserRole,
    status: (['active', 'active', 'invited', 'locked', 'active'][idx % 5]) as UserStatus,
    twoFactorEnabled: idx % 3 === 0,
    lastLogin: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
    trainingCompletionRate: Math.floor(Math.random() * 100),
    certificatesEarned: Math.floor(Math.random() * 5),
    branchRoles: idx % 2 === 0 ? [
        {
            branchId: '1',
            branchName: 'Chi nhánh Quận 1',
            role: u.role as UserRole,
            assignedAt: new Date().toISOString(),
        },
    ] : undefined,
}));

export default function UsersManagementPage() {
    const [users] = useState<User[]>(mockEnhancedUsers);
    const [searchValue, setSearchValue] = useState('');
    const [filters, setFilters] = useState<FilterChip[]>([]);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

    // Saved filters
    const savedFilters: SavedFilter[] = [
        {
            id: '1',
            name: 'Active Admins',
            filters: [
                { id: 'role', label: 'Vai trò', value: 'ADMIN' },
                { id: 'status', label: 'Trạng thái', value: 'active' },
            ],
        },
        {
            id: '2',
            name: 'Locked Users',
            filters: [{ id: 'status', label: 'Trạng thái', value: 'locked' }],
        },
    ];

    // Filter data
    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const matchesSearch = searchValue === '' ||
                user.fullName.toLowerCase().includes(searchValue.toLowerCase()) ||
                user.email.toLowerCase().includes(searchValue.toLowerCase()) ||
                user.phone.includes(searchValue);

            const matchesFilters = filters.every((filter) => {
                if (filter.id === 'role') return user.primaryRole === filter.value;
                if (filter.id === 'status') return user.status === filter.value;
                if (filter.id === '2fa') return filter.value === 'enabled' ? user.twoFactorEnabled : !user.twoFactorEnabled;
                if (filter.id === 'branch' && user.branchRoles) {
                    return user.branchRoles.some(br => br.branchId === filter.value);
                }
                return true;
            });

            return matchesSearch && matchesFilters;
        });
    }, [users, searchValue, filters]);

    // Stats
    const stats = useMemo(() => ({
        total: users.length,
        active: users.filter(u => u.status === 'active').length,
        admins: users.filter(u => u.primaryRole === 'ADMIN').length,
        managers: users.filter(u => u.primaryRole === 'MANAGER').length,
        with2FA: users.filter(u => u.twoFactorEnabled).length,
        locked: users.filter(u => u.status === 'locked').length,
    }), [users]);

    // Define columns
    const columns: Column<User>[] = [
        {
            id: 'fullName',
            header: 'Người dùng',
            accessor: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                        {row.fullName.charAt(0)}
                    </div>
                    <div>
                        <div className="font-semibold text-gray-900">{row.fullName}</div>
                        <div className="text-xs text-gray-500">{row.email}</div>
                    </div>
                </div>
            ),
            sortable: true,
            minWidth: 250,
        },
        {
            id: 'phone',
            header: 'Số điện thoại',
            accessor: 'phone',
            sortable: true,
        },
        {
            id: 'primaryRole',
            header: 'Vai trò',
            accessor: (row) => {
                const roleConfig: Record<UserRole, { label: string; className: string }> = {
                    ADMIN: { label: 'Admin', className: 'bg-red-100 text-red-800 border-red-300' },
                    MANAGER: { label: 'Manager', className: 'bg-blue-100 text-blue-800 border-blue-300' },
                    STAFF: { label: 'Staff', className: 'bg-purple-100 text-purple-800 border-purple-300' },
                    CUSTOMER: { label: 'Customer', className: 'bg-green-100 text-green-800 border-green-300' },
                };
                const config = roleConfig[row.primaryRole];
                return (
                    <Badge className={`${config.className} border font-semibold`}>
                        {config.label}
                    </Badge>
                );
            },
            sortable: true,
        },
        {
            id: 'status',
            header: 'Trạng thái',
            accessor: (row) => {
                const statusConfig: Record<UserStatus, { label: string; className: string; icon: string }> = {
                    active: { label: 'Hoạt động', className: 'bg-green-100 text-green-800', icon: '✓' },
                    inactive: { label: 'Không hoạt động', className: 'bg-gray-100 text-gray-800', icon: '○' },
                    locked: { label: 'Đã khóa', className: 'bg-red-100 text-red-800', icon: '🔒' },
                    invited: { label: 'Chờ mời', className: 'bg-yellow-100 text-yellow-800', icon: '📧' },
                    pending: { label: 'Chờ duyệt', className: 'bg-blue-100 text-blue-800', icon: '⏳' },
                };
                const config = statusConfig[row.status];
                return (
                    <Badge className={config.className}>
                        <span className="mr-1">{config.icon}</span>
                        {config.label}
                    </Badge>
                );
            },
            sortable: true,
        },
        {
            id: 'branchRoles',
            header: 'Chi nhánh',
            accessor: (row) => (
                <div className="text-sm">
                    {row.branchRoles && row.branchRoles.length > 0 ? (
                        <span className="text-gray-700">{row.branchRoles[0].branchName}</span>
                    ) : (
                        <span className="text-gray-400 italic">Chưa gán</span>
                    )}
                </div>
            ),
        },
        {
            id: 'security',
            header: 'Bảo mật',
            accessor: (row) => (
                <div className="flex items-center gap-2">
                    {row.twoFactorEnabled ? (
                        <Badge className="bg-green-100 text-green-800">
                            <Shield className="w-3 h-3 mr-1" />
                            2FA
                        </Badge>
                    ) : (
                        <Badge variant="outline" className="text-gray-500">
                            <Shield className="w-3 h-3 mr-1" />
                            No 2FA
                        </Badge>
                    )}
                </div>
            ),
        },
        {
            id: 'training',
            header: 'Đào tạo',
            accessor: (row) => (
                <div className="flex items-center gap-2">
                    <div className="text-sm">
                        <span className="font-semibold text-gray-900">{row.trainingCompletionRate}%</span>
                    </div>
                    {row.certificatesEarned && row.certificatesEarned > 0 && (
                        <Badge variant="outline" className="text-orange-700">
                            <Award className="w-3 h-3 mr-1" />
                            {row.certificatesEarned}
                        </Badge>
                    )}
                </div>
            ),
        },
        {
            id: 'lastLogin',
            header: 'Truy cập',
            accessor: (row) => (
                <div className="text-sm text-gray-600">
                    {row.lastLogin ? new Date(row.lastLogin).toLocaleDateString('vi-VN') : 'Chưa đăng nhập'}
                </div>
            ),
            sortable: true,
        },
    ];

    const handleRemoveFilter = (filterId: string) => {
        setFilters(filters.filter((f) => f.id !== filterId));
    };

    const handleClearAll = () => {
        setSearchValue('');
        setFilters([]);
    };

    const handleApplySavedFilter = (filter: SavedFilter) => {
        setFilters(filter.filters);
    };

    const handleSaveFilter = (name: string) => {
        console.log('Save filter:', name, filters);
        // TODO: Save to API/localStorage
    };

    const handleExport = () => {
        console.log('Export users:', filteredUsers);
        // TODO: Export to Excel
    };

    const handleBulkDelete = (ids: string[]) => {
        console.log('Delete users:', ids);
        // TODO: Call delete API
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Users className="text-orange-600" size={32} />
                        Quản lý người dùng
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Quản lý tài khoản, phân quyền và theo dõi tiến độ đào tạo
                    </p>
                </div>
                <Button className="bg-gradient-to-r from-orange-500 to-orange-600">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Thêm người dùng
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4 bg-gradient-to-br from-orange-50 to-white border-orange-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 font-medium">Tổng người dùng</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                        </div>
                        <Users className="w-10 h-10 text-orange-500 opacity-80" />
                    </div>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-green-50 to-white border-green-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 font-medium">Đang hoạt động</p>
                            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                        </div>
                        <CheckCircle className="w-10 h-10 text-green-500 opacity-80" />
                    </div>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-blue-50 to-white border-blue-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 font-medium">Bật 2FA</p>
                            <p className="text-2xl font-bold text-blue-600">{stats.with2FA}</p>
                        </div>
                        <Shield className="w-10 h-10 text-blue-500 opacity-80" />
                    </div>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-red-50 to-white border-red-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 font-medium">Đã khóa</p>
                            <p className="text-2xl font-bold text-red-600">{stats.locked}</p>
                        </div>
                        <Lock className="w-10 h-10 text-red-500 opacity-80" />
                    </div>
                </Card>
            </div>

            {/* FilterBar */}
            <FilterBar
                searchPlaceholder="Tìm kiếm theo tên, email, số điện thoại..."
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                filters={filters}
                onRemoveFilter={handleRemoveFilter}
                onClearAll={handleClearAll}
                savedFilters={savedFilters}
                onApplySavedFilter={handleApplySavedFilter}
                onSaveCurrentFilter={handleSaveFilter}
                showAdvancedFilters={showAdvanced}
                onToggleAdvancedFilters={() => setShowAdvanced(!showAdvanced)}
                customActions={
                    <Button variant="outline" size="sm" style={{ color: '#000000', fontWeight: '600' }}>
                        <FileText className="h-4 w-4 mr-2" />
                        Báo cáo
                    </Button>
                }
            />

            {/* Advanced Filters */}
            {showAdvanced && (
                <Card className="p-4 bg-white">
                    <h3 className="font-bold mb-4 text-gray-950">Bộ lọc nâng cao</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="text-sm font-bold mb-2 block text-gray-950">Vai trò</label>
                            <select
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-950 font-semibold bg-white"
                                onChange={(e) => {
                                    if (e.target.value) {
                                        setFilters([
                                            ...filters.filter((f) => f.id !== 'role'),
                                            { id: 'role', label: 'Vai trò', value: e.target.value },
                                        ]);
                                    }
                                }}
                            >
                                <option value="">Tất cả</option>
                                <option value="ADMIN">Admin</option>
                                <option value="MANAGER">Manager</option>
                                <option value="STAFF">Staff</option>
                                <option value="CUSTOMER">Customer</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-bold mb-2 block text-gray-950">Trạng thái</label>
                            <select
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-950 font-semibold bg-white"
                                onChange={(e) => {
                                    if (e.target.value) {
                                        setFilters([
                                            ...filters.filter((f) => f.id !== 'status'),
                                            { id: 'status', label: 'Trạng thái', value: e.target.value },
                                        ]);
                                    }
                                }}
                            >
                                <option value="">Tất cả</option>
                                <option value="active">Hoạt động</option>
                                <option value="inactive">Không hoạt động</option>
                                <option value="locked">Đã khóa</option>
                                <option value="invited">Chờ mời</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-bold mb-2 block text-gray-950">Bảo mật 2FA</label>
                            <select
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-950 font-semibold bg-white"
                                onChange={(e) => {
                                    if (e.target.value) {
                                        setFilters([
                                            ...filters.filter((f) => f.id !== '2fa'),
                                            { id: '2fa', label: '2FA', value: e.target.value },
                                        ]);
                                    }
                                }}
                            >
                                <option value="">Tất cả</option>
                                <option value="enabled">Đã bật</option>
                                <option value="disabled">Chưa bật</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-bold mb-2 block text-gray-950">Chi nhánh</label>
                            <select
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-950 font-semibold bg-white"
                                onChange={(e) => {
                                    if (e.target.value) {
                                        setFilters([
                                            ...filters.filter((f) => f.id !== 'branch'),
                                            { id: 'branch', label: 'Chi nhánh', value: e.target.value },
                                        ]);
                                    }
                                }}
                            >
                                <option value="">Tất cả</option>
                                <option value="1">Quận 1</option>
                                <option value="2">Quận 3</option>
                                <option value="3">Thủ Đức</option>
                            </select>
                        </div>
                    </div>
                </Card>
            )}

            {/* DataTable */}
            <DataTable
                data={filteredUsers}
                columns={columns}
                selectable
                onSelectionChange={setSelectedUsers}
                getRowId={(row) => row.id}
                defaultSort={{ columnId: 'fullName', direction: 'asc' }}
                pagination={{
                    pageSize: 10,
                    pageSizeOptions: [10, 25, 50, 100],
                }}
                actions={{
                    onExport: handleExport,
                    onDelete: handleBulkDelete,
                    customActions: (
                        <>
                            <Button variant="outline" size="sm" style={{ color: '#000000', fontWeight: '600' }}>
                                <Lock className="h-4 w-4 mr-2" />
                                Khóa tài khoản
                            </Button>
                        </>
                    ),
                }}
                emptyState={{
                    title: 'Không tìm thấy người dùng',
                    description: 'Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác',
                    icon: <Users className="h-16 w-16 text-gray-400" />,
                    action: (
                        <Button className="bg-gradient-to-r from-orange-500 to-orange-600">
                            <UserPlus className="h-4 w-4 mr-2" />
                            Thêm người dùng mới
                        </Button>
                    ),
                }}
                stickyHeader
                rowClassName={(row) => (row.status === 'locked' ? 'opacity-60' : '')}
            />
        </div>
    );
}
