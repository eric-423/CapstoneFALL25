'use client';

import React, { useCallback, useMemo, useState } from 'react';
import {
    Users,
    UserPlus,
    Shield,
    Lock,
    FileText,
    Award,
    Clock,
    CheckCircle,
    Eye,
    Trash2,
} from 'lucide-react';
import { FilterBar, FilterChip, SavedFilter } from '@/components/common/FilterBar';
import { DataTable, Column } from '@/components/common/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { RoleHistory, TrainingStats, UserRole, UserTraining } from '@/utils/types/user.types';
import { MOCK_USERS } from '@/utils/mocks/data/users.mock';
import type { UserWithUiExtras } from './components/UserDetailDialog';
import { UserDetailDialog } from './components/UserDetailDialog';

type UserStatusFilter = 'active' | 'inactive' | 'banned';

const BRANCH_LABELS: Record<number, string> = {
    1: 'Chi nhánh Quận 1',
    2: 'Chi nhánh Quận 3',
    3: 'Chi nhánh Thủ Đức',
};

const STATUS_CONFIG: Record<UserStatusFilter, { label: string; className: string; icon: string }> = {
    active: { label: 'Hoạt động', className: 'bg-green-100 text-green-800', icon: '✓' },
    inactive: { label: 'Không hoạt động', className: 'bg-gray-100 text-gray-800', icon: '○' },
    banned: { label: 'Đã khóa', className: 'bg-red-100 text-red-800', icon: '🔒' },
};

const ROLE_CONFIG: Record<UserRole, { label: string; className: string }> = {
    ADMIN: { label: 'Admin', className: 'bg-red-100 text-red-800 border-red-300' },
    MANAGER: { label: 'Manager', className: 'bg-blue-100 text-blue-800 border-blue-300' },
    CHEF: { label: 'Chef', className: 'bg-orange-100 text-orange-800 border-orange-300' },
    WAITER: { label: 'Waiter', className: 'bg-purple-100 text-purple-800 border-purple-300' },
    SHIPPER: { label: 'Shipper', className: 'bg-lime-100 text-lime-800 border-lime-300' },
    CUSTOMER: { label: 'Customer', className: 'bg-green-100 text-green-800 border-green-300' },
};

const getRandomDateIso = (rangeInDays: number) =>
    new Date(Date.now() - Math.random() * rangeInDays * 24 * 60 * 60 * 1000).toISOString();

const buildMockUsers = (): UserWithUiExtras[] =>
    MOCK_USERS.map((mock, idx) => {
        const normalizedRole = (mock.role ?? 'CUSTOMER').toUpperCase() as UserRole;
        const branchId = mock.branchId ?? ((idx % 3) + 1);
        const isBanned = idx % 6 === 4;
        const isActive = !isBanned && idx % 5 !== 2;

        const roleHistory: RoleHistory = {
            id: idx + 1,
            roleId: idx + 101,
            roleName: normalizedRole,
            userId: mock.id,
            branchId,
            branchName: BRANCH_LABELS[branchId],
            startDate: getRandomDateIso(240),
            endDate: undefined,
            isActive: true,
        };

        const totalTrainings = 3;
        const completedTrainings = Math.max(0, Math.min(totalTrainings, (idx % (totalTrainings + 1))));

        const trainingStats: TrainingStats = {
            totalEnrolled: totalTrainings,
            totalCompleted: completedTrainings,
            totalPoints: 150 + idx * 10,
            completionRate: Math.round((completedTrainings / totalTrainings) * 100),
            inProgressCount: totalTrainings - completedTrainings,
        };

        const trainings: UserTraining[] = [
            {
                id: idx * 3 + 1,
                userId: mock.id,
                trainingId: 1,
                trainingName: 'An toàn thực phẩm',
                enrollDate: getRandomDateIso(120),
                point: 85,
                isPassed: completedTrainings > 1,
                lessonsProgress: [
                    {
                        id: idx * 5 + 1,
                        userTrainingId: idx * 3 + 1,
                        lessonId: 1,
                        lessonTitle: 'Kiểm soát vệ sinh',
                        point: 40,
                        isPassed: true,
                        startDate: getRandomDateIso(90),
                    },
                ],
            },
            {
                id: idx * 3 + 2,
                userId: mock.id,
                trainingId: 2,
                trainingName: 'Dịch vụ khách hàng',
                enrollDate: getRandomDateIso(200),
                point: 70,
                isPassed: completedTrainings > 2,
            },
        ];

        return {
            id: mock.id,
            fullName: mock.fullName,
            email: mock.email ?? `user${mock.id}@tamtac.com`,
            phoneNumber: mock.phoneNumber ?? mock.phone ?? '0900000000',
            password: undefined,
            dateOfBirth: undefined,
            address: BRANCH_LABELS[branchId] ?? 'Chưa cập nhật',
            note: undefined,
            isActive,
            isBan: isBanned,
            emailVerified: idx % 2 === 0,
            phoneVerified: idx % 3 !== 0,
            memberPoint: 200 + idx * 25,
            memberRank: (idx % 5) + 1,
            createdAt: getRandomDateIso(300),
            roleHistories: [roleHistory],
            currentRole: roleHistory,
            trainings,
            trainingStats,
            twoFactorEnabled: idx % 3 === 0,
            lastLogin: getRandomDateIso(15),
            certificatesEarned: completedTrainings,
        } as UserWithUiExtras;
    });

const getUserStatus = (user: UserWithUiExtras): UserStatusFilter => {
    if (user.isBan) return 'banned';
    if (!user.isActive) return 'inactive';
    return 'active';
};

export default function UsersManagementPage() {
    const [users, setUsers] = useState<UserWithUiExtras[]>(buildMockUsers);
    const [searchValue, setSearchValue] = useState('');
    const [filters, setFilters] = useState<FilterChip[]>([]);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    const [detailUser, setDetailUser] = useState<UserWithUiExtras | null>(null);

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
            name: 'Người dùng bị khóa',
            filters: [{ id: 'status', label: 'Trạng thái', value: 'banned' }],
        },
    ];

    const filteredUsers = useMemo(() => {
        const normalizedSearch = searchValue.trim().toLowerCase();

        return users.filter((user) => {
            const matchesSearch =
                normalizedSearch.length === 0 ||
                user.fullName.toLowerCase().includes(normalizedSearch) ||
                user.email.toLowerCase().includes(normalizedSearch) ||
                user.phoneNumber.includes(searchValue.trim());

            const matchesFilters = filters.every((filter) => {
                switch (filter.id) {
                    case 'role':
                        return user.currentRole?.roleName === filter.value;
                    case 'status':
                        return getUserStatus(user) === filter.value;
                    case '2fa':
                        return filter.value === 'enabled' ? user.twoFactorEnabled : !user.twoFactorEnabled;
                    case 'branch':
                        return filter.value === String(user.currentRole?.branchId ?? '');
                    default:
                        return true;
                }
            });

            return matchesSearch && matchesFilters;
        });
    }, [users, searchValue, filters]);

    const stats = useMemo(() => {
        const getCountByRole = (role: UserRole) =>
            users.filter((user) => user.currentRole?.roleName === role).length;

        return {
            total: users.length,
            active: users.filter((user) => getUserStatus(user) === 'active').length,
            admins: getCountByRole('ADMIN'),
            managers: getCountByRole('MANAGER'),
            with2FA: users.filter((user) => user.twoFactorEnabled).length,
            banned: users.filter((user) => getUserStatus(user) === 'banned').length,
        };
    }, [users]);

    const handleRemoveFilter = (filterId: string) => {
        setFilters((prev) => prev.filter((f) => f.id !== filterId));
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
    };

    const handleExport = () => {
        console.log('Export users:', filteredUsers);
    };

    const handleBulkDelete = useCallback(
        (ids: string[]) => {
            if (ids.length === 0) return;

            setUsers((prev) => prev.filter((user) => !ids.includes(String(user.id))));
            setSelectedUserIds([]);
            setDetailUser((prev) => (prev && ids.includes(String(prev.id)) ? null : prev));
        },
        [],
    );

    const handleDeleteUser = useCallback((userId: number) => {
        setUsers((prev) => prev.filter((user) => user.id !== userId));
        setSelectedUserIds((prev) => prev.filter((id) => id !== String(userId)));
        setDetailUser((prev) => (prev?.id === userId ? null : prev));
    }, []);

    const handleViewUser = useCallback((user: UserWithUiExtras) => {
        setDetailUser(user);
    }, []);

    const handleUpdateUser = useCallback((updatedUser: UserWithUiExtras) => {
        setUsers((prev) => prev.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
        setDetailUser(updatedUser);
    }, []);

    const columns: Column<UserWithUiExtras>[] = useMemo(
        () => [
            {
                id: 'fullName',
                header: 'Người dùng',
                accessor: (row) => (
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                            {row.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="font-semibold text-gray-900 truncate">{row.fullName}</div>
                            <div className="text-xs text-gray-500 truncate">{row.email}</div>
                        </div>
                    </div>
                ),
                sortable: true,
                minWidth: 200,
            },
            {
                id: 'phoneNumber',
                header: 'Số điện thoại',
                accessor: 'phoneNumber',
                sortable: true,
            },
            {
                id: 'role',
                header: 'Vai trò',
                accessor: (row) => {
                    const role = (row.currentRole?.roleName ?? 'CUSTOMER') as UserRole;
                    const config = ROLE_CONFIG[role] ?? ROLE_CONFIG.CUSTOMER;
                    return (
                        <Badge className={`${config.className} border font-semibold`}>
                            {config.label}
                        </Badge>
                    );
                },
            },
            {
                id: 'status',
                header: 'Trạng thái',
                accessor: (row) => {
                    const status = getUserStatus(row);
                    const config = STATUS_CONFIG[status];
                    return (
                        <Badge className={config.className}>
                            <span className="mr-1">{config.icon}</span>
                            {config.label}
                        </Badge>
                    );
                },
            },
            {
                id: 'branch',
                header: 'Chi nhánh',
                accessor: (row) => (
                    <div className="text-sm">
                        {row.currentRole?.branchName ? (
                            <span className="text-gray-700">{row.currentRole.branchName}</span>
                        ) : (
                            <span className="text-gray-400 italic">Chưa gán</span>
                        )}
                    </div>
                ),
            },
            {
                id: 'training',
                header: 'Đào tạo',
                accessor: (row) => (
                    <div className="flex items-center gap-2 text-sm">
                        <span className="font-semibold text-gray-900">
                            {row.trainingStats?.completionRate ?? 0}%
                        </span>
                        <Badge variant="outline" className="text-orange-700">
                            <Award className="w-3 h-3 mr-1" />
                            {row.certificatesEarned ?? 0}
                        </Badge>
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
            {
                id: 'actions',
                header: 'Thao tác',
                accessor: (row) => (
                    <div className="flex items-center gap-2 justify-end flex-shrink-0">
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-gray-700 border-gray-300"
                            onClick={() => handleViewUser(row)}
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => handleDeleteUser(row.id)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ),
                minWidth: 120,
            },
        ],
        [handleDeleteUser, handleViewUser],
    );

    return (
        <div className="space-y-6 w-full max-w-full overflow-x-hidden">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Users className="text-orange-600" size={32} />
                        Quản lý người dùng
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Quản lý tài khoản, phân quyền và theo dõi tiến độ đào tạo
                    </p>
                </div>
                <Button className="bg-gradient-to-r from-orange-500 to-orange-600 flex-shrink-0">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Thêm người dùng
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                <Card className="p-4 bg-gradient-to-br from-orange-50 to-white border-orange-200 min-w-0">
                    <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                            <p className="text-sm text-gray-600 font-medium truncate">Tổng người dùng</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                        </div>
                        <Users className="w-10 h-10 text-orange-500 opacity-80 flex-shrink-0" />
                    </div>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-green-50 to-white border-green-200 min-w-0">
                    <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                            <p className="text-sm text-gray-600 font-medium truncate">Đang hoạt động</p>
                            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                        </div>
                        <CheckCircle className="w-10 h-10 text-green-500 opacity-80 flex-shrink-0" />
                    </div>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-blue-50 to-white border-blue-200 min-w-0">
                    <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                            <p className="text-sm text-gray-600 font-medium truncate">Bật 2FA</p>
                            <p className="text-2xl font-bold text-blue-600">{stats.with2FA}</p>
                        </div>
                        <Shield className="w-10 h-10 text-blue-500 opacity-80 flex-shrink-0" />
                    </div>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-red-50 to-white border-red-200 min-w-0">
                    <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                            <p className="text-sm text-gray-600 font-medium truncate">Đã khóa</p>
                            <p className="text-2xl font-bold text-red-600">{stats.banned}</p>
                        </div>
                        <Lock className="w-10 h-10 text-red-500 opacity-80 flex-shrink-0" />
                    </div>
                </Card>
            </div>

            <div className="w-full">
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
                    onToggleAdvancedFilters={() => setShowAdvanced((prev) => !prev)}
                    customActions={
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                style={{ color: '#000000', fontWeight: '600' }}
                                onClick={handleExport}
                            >
                                <FileText className="h-4 w-4 mr-2" />
                                Xuất báo cáo
                            </Button>
                        </div>
                    }
                />
            </div>

            {showAdvanced && (
                <Card className="p-4 bg-white w-full">
                    <h3 className="font-bold mb-4 text-gray-950">Bộ lọc nâng cao</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
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
                                <option value="CHEF">Chef</option>
                                <option value="WAITER">Waiter</option>
                                <option value="SHIPPER">Shipper</option>
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
                                <option value="banned">Đã khóa</option>
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

            <div className="w-full overflow-x-auto">
                <DataTable
                    data={filteredUsers}
                    columns={columns}
                    selectable
                    onSelectionChange={setSelectedUserIds}
                    getRowId={(row) => String(row.id)}
                    defaultSort={{ columnId: 'fullName', direction: 'asc' }}
                    pagination={{
                        pageSize: 10,
                        pageSizeOptions: [10, 25, 50, 100],
                    }}
                    actions={{
                        onExport: handleExport,
                        onDelete: handleBulkDelete,
                        customActions: (
                            <Button
                                variant="outline"
                                size="sm"
                                style={{ color: '#000000', fontWeight: '600' }}
                                disabled={selectedUserIds.length === 0}
                            >
                                <Lock className="h-4 w-4 mr-2" />
                                Khóa tài khoản
                            </Button>
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
                    rowClassName={(row) =>
                        getUserStatus(row) === 'banned' || getUserStatus(row) === 'inactive' ? 'opacity-60' : ''
                    }
                    className="w-full"
                />
            </div>

            {detailUser && (
                <UserDetailDialog
                    user={detailUser}
                    open={Boolean(detailUser)}
                    onOpenChange={(open) => {
                        if (!open) {
                            setDetailUser(null);
                        }
                    }}
                    onDelete={() => handleDeleteUser(detailUser.id)}
                    onSave={handleUpdateUser}
                />
            )}
        </div>
    );
}
