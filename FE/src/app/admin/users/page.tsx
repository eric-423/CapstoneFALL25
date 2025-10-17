'use client';

import { AdminGuard } from '@/components/guards';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MOCK_USERS } from '@/utils/mocks/data/users.mock';
import { useState } from 'react';
import { Users, Edit, Trash2, Search, Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { AddUserDialog } from './components/AddUserDialog';
import { EditUserDialog } from './components/EditUserDialog';
import { DeleteUserDialog } from './components/DeleteUserDialog';

export default function UsersPage() {
    const [users] = useState(MOCK_USERS);
    const [filter, setFilter] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [editingUser, setEditingUser] = useState<typeof MOCK_USERS[0] | null>(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deletingUser, setDeletingUser] = useState<typeof MOCK_USERS[0] | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const filteredUsers = users
        .filter(u => filter === 'ALL' || u.role === filter)
        .filter(u =>
            u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.phone.includes(searchTerm) ||
            u.email?.toLowerCase().includes(searchTerm.toLowerCase())
        );

    return (
        <AdminGuard>
            <div className="min-h-screen bg-[#f9fafb] py-8">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight flex items-center gap-3">
                                <Users className="text-primary" size={36} />
                                Quản lý người dùng
                            </h1>
                            <p className="text-gray-600 text-lg">Quản lý tài khoản và phân quyền người dùng hệ thống</p>
                        </div>
                        <AddUserDialog />
                    </div>

                    {/* Filters and Search */}
                    <Card className="p-6 mb-6 bg-white border-0 shadow-md hover:shadow-lg transition-all rounded-xl">
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                            <div className="flex gap-2 flex-wrap">
                                {['ALL', 'ADMIN', 'MANAGER', 'CUSTOMER'].map(role => (
                                    <Button
                                        key={role}
                                        variant={filter === role ? 'default' : 'outline'}
                                        onClick={() => setFilter(role)}
                                        className={filter === role
                                            ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0 shadow-md'
                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-orange-50 hover:border-orange-400'}
                                    >
                                        {role === 'ALL' ? 'Tất cả' : role}
                                    </Button>
                                ))}
                            </div>
                            <div className="relative w-full md:w-80">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <Input
                                    placeholder="Tìm kiếm theo tên, SĐT, email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <Card className="p-6 bg-gradient-to-br from-orange-50 to-white border-0 shadow-md hover:shadow-lg transition-all rounded-xl">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 font-medium mb-1">Tổng người dùng</p>
                                    <p className="text-3xl font-bold text-gray-900">{users.length}</p>
                                </div>
                                <Users className="w-12 h-12 text-orange-500 opacity-80" />
                            </div>
                        </Card>
                        <Card className="p-6 bg-gradient-to-br from-red-50 to-white border-0 shadow-md hover:shadow-lg transition-all rounded-xl">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 font-medium mb-1">Admin</p>
                                    <p className="text-3xl font-bold text-red-600">{users.filter(u => u.role === 'ADMIN').length}</p>
                                </div>
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                    <span className="text-2xl">👑</span>
                                </div>
                            </div>
                        </Card>
                        <Card className="p-6 bg-gradient-to-br from-blue-50 to-white border-0 shadow-md hover:shadow-lg transition-all rounded-xl">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 font-medium mb-1">Manager</p>
                                    <p className="text-3xl font-bold text-blue-600">{users.filter(u => u.role === 'MANAGER').length}</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-2xl">👔</span>
                                </div>
                            </div>
                        </Card>
                        <Card className="p-6 bg-gradient-to-br from-green-50 to-white border-0 shadow-md hover:shadow-lg transition-all rounded-xl">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 font-medium mb-1">Khách hàng</p>
                                    <p className="text-3xl font-bold text-green-600">{users.filter(u => u.role === 'CUSTOMER').length}</p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                    <span className="text-2xl">👥</span>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Users Table */}
                    <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all rounded-xl bg-white">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">ID</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Họ Tên</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">SĐT</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Vai Trò</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Trạng Thái</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider">Thao Tác</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                                Không tìm thấy người dùng nào
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredUsers.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">#{user.id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold mr-3 shadow-md">
                                                            {user.fullName.charAt(0)}
                                                        </div>
                                                        <span className="text-sm font-semibold text-gray-900">{user.fullName}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.phone}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email || 'N/A'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-3 py-1.5 text-xs font-bold rounded-full ${user.role === 'ADMIN' ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-700 border border-red-300' :
                                                        user.role === 'MANAGER' ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border border-blue-300' :
                                                            'bg-gradient-to-r from-green-100 to-green-200 text-green-700 border border-green-300'
                                                        }`}>{user.role}</span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-3 py-1.5 text-xs font-bold rounded-full bg-gradient-to-r from-green-100 to-green-200 text-green-700 border border-green-300">
                                                        ✓ Hoạt động
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <div className="flex gap-2 justify-center">
                                                        {user.role === 'ADMIN' ? (
                                                            // Admin: Only show change password button
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setEditingUser(user);
                                                                    setEditDialogOpen(true);
                                                                }}
                                                                className="border-blue-500 text-blue-600 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 hover:text-white transition-all shadow-sm hover:shadow-md"
                                                                title="Đổi mật khẩu"
                                                            >
                                                                <Lock size={16} className="mr-1" />
                                                                Đổi mật khẩu
                                                            </Button>
                                                        ) : (
                                                            // Other roles: Show edit and delete buttons
                                                            <>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        setEditingUser(user);
                                                                        setEditDialogOpen(true);
                                                                    }}
                                                                    className="border-orange-500 text-orange-600 hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-600 hover:text-white transition-all shadow-sm hover:shadow-md"
                                                                >
                                                                    <Edit size={16} />
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        setDeletingUser(user);
                                                                        setDeleteDialogOpen(true);
                                                                    }}
                                                                    className="border-red-500 text-red-600 hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 hover:text-white transition-all shadow-sm hover:shadow-md"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </Button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>

                    {/* Pagination */}
                    <div className="mt-8 flex justify-between items-center">
                        <p className="text-sm text-gray-600">
                            Hiển thị <span className="font-bold text-gray-900">{filteredUsers.length}</span> trên <span className="font-bold text-gray-900">{users.length}</span> người dùng
                        </p>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="bg-white border-gray-300 text-gray-700 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all">Trước</Button>
                            <Button variant="outline" size="sm" className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-md hover:shadow-lg">1</Button>
                            <Button variant="outline" size="sm" className="bg-white border-gray-300 text-gray-700 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all">2</Button>
                            <Button variant="outline" size="sm" className="bg-white border-gray-300 text-gray-700 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all">Sau</Button>
                        </div>
                    </div>

                    {/* Edit User Dialog */}
                    {editingUser && (
                        <EditUserDialog
                            user={editingUser}
                            open={editDialogOpen}
                            onOpenChange={setEditDialogOpen}
                        />
                    )}

                    {/* Delete User Dialog */}
                    {deletingUser && (
                        <DeleteUserDialog
                            user={deletingUser}
                            open={deleteDialogOpen}
                            onOpenChange={setDeleteDialogOpen}
                        />
                    )}
                </div>
            </div>
        </AdminGuard>
    );
}
