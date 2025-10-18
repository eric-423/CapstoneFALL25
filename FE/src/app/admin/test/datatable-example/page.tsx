'use client';

import React, { useState } from 'react';
import { FilterBar, FilterChip, SavedFilter } from '@/components/common/FilterBar';
import { DataTable, Column } from '@/components/common/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, FileText } from 'lucide-react';

// Example data type
interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    status: 'active' | 'inactive' | 'pending';
    joinDate: string;
}

// Mock data
const mockUsers: User[] = [
    { id: '1', name: 'Nguyễn Văn A', email: 'a@example.com', role: 'Admin', status: 'active', joinDate: '2024-01-15' },
    { id: '2', name: 'Trần Thị B', email: 'b@example.com', role: 'Manager', status: 'active', joinDate: '2024-02-20' },
    { id: '3', name: 'Lê Văn C', email: 'c@example.com', role: 'Staff', status: 'inactive', joinDate: '2024-03-10' },
    { id: '4', name: 'Phạm Thị D', email: 'd@example.com', role: 'Staff', status: 'pending', joinDate: '2024-04-05' },
    { id: '5', name: 'Hoàng Văn E', email: 'e@example.com', role: 'Manager', status: 'active', joinDate: '2024-05-12' },
];

export default function DataTableExamplePage() {
    const [searchValue, setSearchValue] = useState('');
    const [filters, setFilters] = useState<FilterChip[]>([]);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [savedFilters] = useState<SavedFilter[]>([
        {
            id: '1',
            name: 'Active Managers',
            filters: [
                { id: 'role', label: 'Vai trò', value: 'Manager' },
                { id: 'status', label: 'Trạng thái', value: 'Active' },
            ],
        },
    ]);

    // Filter data based on search and filters
    const filteredData = mockUsers.filter((user) => {
        const matchesSearch = searchValue === '' ||
            user.name.toLowerCase().includes(searchValue.toLowerCase()) ||
            user.email.toLowerCase().includes(searchValue.toLowerCase());

        const matchesFilters = filters.every((filter) => {
            if (filter.id === 'role') return user.role === filter.value;
            if (filter.id === 'status') return user.status === filter.value;
            return true;
        });

        return matchesSearch && matchesFilters;
    });

    // Define columns
    const columns: Column<User>[] = [
        {
            id: 'name',
            header: 'Tên',
            accessor: 'name',
            sortable: true,
            minWidth: 200,
        },
        {
            id: 'email',
            header: 'Email',
            accessor: 'email',
            sortable: true,
            minWidth: 250,
        },
        {
            id: 'role',
            header: 'Vai trò',
            accessor: 'role',
            sortable: true,
        },
        {
            id: 'status',
            header: 'Trạng thái',
            accessor: (row) => {
                const statusConfig = {
                    active: { label: 'Hoạt động', className: 'bg-green-100 text-green-800' },
                    inactive: { label: 'Không hoạt động', className: 'bg-gray-100 text-gray-800' },
                    pending: { label: 'Chờ duyệt', className: 'bg-yellow-100 text-yellow-800' },
                };
                const config = statusConfig[row.status];
                return (
                    <Badge className={config.className}>
                        {config.label}
                    </Badge>
                );
            },
            sortable: true,
        },
        {
            id: 'joinDate',
            header: 'Ngày tham gia',
            accessor: (row) => new Date(row.joinDate).toLocaleDateString('vi-VN'),
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
        // In real app, save to API/localStorage
    };

    const handleExport = () => {
        console.log('Export data:', filteredData);
        // In real app, export to CSV/Excel
    };

    const handleDelete = (ids: string[]) => {
        console.log('Delete users:', ids);
        // In real app, call delete API
    };

    const handleSelectionChange = (selectedIds: string[]) => {
        console.log('Selected IDs:', selectedIds);
    };

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">DataTable & FilterBar Example</h1>
                    <p className="text-gray-600 mt-2">Demo của FilterBar và DataTable components</p>
                </div>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm người dùng
                </Button>
            </div>

            {/* FilterBar */}
            <FilterBar
                searchPlaceholder="Tìm kiếm theo tên, email..."
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
                    <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        Báo cáo
                    </Button>
                }
            />

            {/* Advanced Filters Panel */}
            {showAdvanced && (
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <h3 className="font-semibold mb-3">Bộ lọc nâng cao</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="text-sm font-medium mb-2 block">Vai trò</label>
                            <select
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
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
                                <option value="Admin">Admin</option>
                                <option value="Manager">Manager</option>
                                <option value="Staff">Staff</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-2 block">Trạng thái</label>
                            <select
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
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
                                <option value="pending">Chờ duyệt</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* DataTable */}
            <DataTable
                data={filteredData}
                columns={columns}
                selectable
                onSelectionChange={handleSelectionChange}
                getRowId={(row) => row.id}
                defaultSort={{ columnId: 'name', direction: 'asc' }}
                pagination={{
                    pageSize: 10,
                    pageSizeOptions: [5, 10, 25, 50],
                }}
                actions={{
                    onExport: handleExport,
                    onDelete: handleDelete,
                }}
                emptyState={{
                    title: 'Không tìm thấy người dùng',
                    description: 'Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác',
                    icon: <Users className="h-16 w-16 text-gray-400" />,
                    action: (
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Thêm người dùng mới
                        </Button>
                    ),
                }}
                stickyHeader
            />
        </div>
    );
}
