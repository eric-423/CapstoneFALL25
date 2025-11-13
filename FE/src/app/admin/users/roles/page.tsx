'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    Shield,
    Plus,
    Edit2,
    Trash2,
    Users,
    Save,
    X,
    ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AdminPageLayout, AdminPageHeader, AdminStatsCard, AdminStatsGrid } from '../../components/AdminPageLayout';
import { getRoles, createRole, updateRole, deleteRole, type Role } from '@/apis/role.api';
import Link from 'next/link';

const DEFAULT_ROLE_COLORS: Record<string, string> = {
    ADMIN: 'bg-red-100 text-red-800 border-red-300',
    MANAGER: 'bg-blue-100 text-blue-800 border-blue-300',
    CHEF: 'bg-orange-100 text-orange-800 border-orange-300',
    CHEFF: 'bg-orange-100 text-orange-800 border-orange-300',
    WAITER: 'bg-purple-100 text-purple-800 border-purple-300',
    SHIPPER: 'bg-lime-100 text-lime-800 border-lime-300',
    CUSTOMER: 'bg-green-100 text-green-800 border-green-300',
    STAFF: 'bg-gray-100 text-gray-800 border-gray-300',
};

const COLOR_VARIANTS = [
    'bg-red-100 text-red-800 border-red-300',
    'bg-blue-100 text-blue-800 border-blue-300',
    'bg-orange-100 text-orange-800 border-orange-300',
    'bg-purple-100 text-purple-800 border-purple-300',
    'bg-lime-100 text-lime-800 border-lime-300',
    'bg-green-100 text-green-800 border-green-300',
    'bg-yellow-100 text-yellow-800 border-yellow-300',
    'bg-pink-100 text-pink-800 border-pink-300',
    'bg-indigo-100 text-indigo-800 border-indigo-300',
    'bg-teal-100 text-teal-800 border-teal-300',
    'bg-cyan-100 text-cyan-800 border-cyan-300',
    'bg-emerald-100 text-emerald-800 border-emerald-300',
];

// Hàm tạo màu cho role dựa trên tên
const getRoleColor = (roleName: string): string => {
    // Ưu tiên màu mặc định nếu có
    if (DEFAULT_ROLE_COLORS[roleName]) {
        return DEFAULT_ROLE_COLORS[roleName];
    }

    // Tạo màu dựa trên hash của tên role
    const hash = roleName.split('').reduce((acc, char) => {
        return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);

    const index = Math.abs(hash) % COLOR_VARIANTS.length;
    return COLOR_VARIANTS[index];
};

export default function RolesManagementPage() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingName, setEditingName] = useState('');
    const [newRoleName, setNewRoleName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const fetchRoles = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getRoles();
            setRoles(data);
        } catch (error) {
            console.error('Failed to fetch roles:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRoles();
    }, [fetchRoles]);

    const handleCreate = async () => {
        if (!newRoleName.trim()) return;

        try {
            await createRole({ name: newRoleName.trim().toUpperCase() });
            setNewRoleName('');
            setIsCreating(false);
            await fetchRoles();
        } catch (error) {
            console.error('Failed to create role:', error);
            alert('Không thể tạo role mới');
        }
    };

    const handleUpdate = async (roleId: number) => {
        if (!editingName.trim()) return;

        try {
            await updateRole(roleId, { name: editingName.trim().toUpperCase() });
            setEditingId(null);
            setEditingName('');
            await fetchRoles();
        } catch (error) {
            console.error('Failed to update role:', error);
            alert('Không thể cập nhật role');
        }
    };

    const handleDelete = async (roleId: number, roleName: string) => {
        if (!confirm(`Bạn có chắc muốn xóa role "${roleName}"?`)) return;

        try {
            await deleteRole(roleId);
            await fetchRoles();
        } catch (error) {
            console.error('Failed to delete role:', error);
            alert('Không thể xóa role');
        }
    };

    const startEdit = (role: Role) => {
        setEditingId(role.id);
        setEditingName(role.name);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditingName('');
    };

    return (
        <AdminPageLayout>
            {/* Header */}
            <AdminPageHeader
                title="Quản lý vai trò"
                description="Quản lý các vai trò hệ thống và phân quyền người dùng"
                icon={Shield}
                actions={
                    <div className="flex gap-2">
                        <Link href="/admin/users">
                            <Button
                                variant="outline"
                                className="border-2 border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 shadow-md hover:shadow-lg transition-all duration-300 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold text-sm sm:text-base flex-shrink-0"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Quản lý người dùng
                            </Button>
                        </Link>
                        <Button
                            className="bg-gradient-to-r from-[#EC6426] to-[#F8A91F] hover:from-[#EC6426]/90 hover:to-[#F8A91F]/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold text-sm sm:text-base"
                            onClick={() => setIsCreating(!isCreating)}
                        >
                            {isCreating ? (
                                <>
                                    <X className="h-4 w-4 mr-2" />
                                    Hủy
                                </>
                            ) : (
                                <>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Thêm vai trò
                                </>
                            )}
                        </Button>
                    </div>
                }
            />

            {/* Stats */}
            <div className="w-full max-w-xs">
                <AdminStatsCard
                    title="Tổng vai trò"
                    value={roles.length}
                    icon={Shield}
                />
            </div>

            {/* Create New Role Form */}
            {isCreating && (
                <Card className="p-4 bg-white border-2 border-orange-200">
                    <h3 className="text-sm font-bold mb-3 text-gray-900">Tạo vai trò mới</h3>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newRoleName}
                            onChange={(e) => setNewRoleName(e.target.value)}
                            placeholder="Nhập tên vai trò (VD: STAFF)"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-semibold uppercase"
                            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                        />
                        <Button
                            onClick={handleCreate}
                            disabled={!newRoleName.trim()}
                            className="bg-gradient-to-r from-[#EC6426] to-[#F8A91F] text-white px-4 py-2"
                        >
                            <Save className="h-4 w-4 mr-2" />
                            Lưu
                        </Button>
                    </div>
                </Card>
            )}

            {/* Roles List */}
            <div className="space-y-3">
                {loading ? (
                    <Card className="p-6 text-center text-gray-500">
                        Đang tải danh sách vai trò...
                    </Card>
                ) : roles.length === 0 ? (
                    <Card className="p-6 text-center text-gray-500">
                        Chưa có vai trò nào
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                        {roles.map((role) => (
                            <Card
                                key={role.id}
                                className="p-4 bg-white hover:shadow-lg transition-all duration-300 border-0"
                            >
                                {editingId === role.id ? (
                                    <div className="space-y-3">
                                        <input
                                            type="text"
                                            value={editingName}
                                            onChange={(e) => setEditingName(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-bold uppercase"
                                            onKeyDown={(e) => e.key === 'Enter' && handleUpdate(role.id)}
                                        />
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() => handleUpdate(role.id)}
                                                size="sm"
                                                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                            >
                                                <Save className="h-3 w-3 mr-1" />
                                                Lưu
                                            </Button>
                                            <Button
                                                onClick={cancelEdit}
                                                size="sm"
                                                variant="outline"
                                                className="flex-1"
                                            >
                                                <X className="h-3 w-3 mr-1" />
                                                Hủy
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <Badge
                                                className={`${getRoleColor(role.name)} border font-bold text-sm px-3 py-1`}
                                            >
                                                {role.name}
                                            </Badge>
                                            <span className="text-xs text-gray-500">ID: {role.id}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() => startEdit(role)}
                                                size="sm"
                                                variant="outline"
                                                className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                                            >
                                                <Edit2 className="h-3 w-3 mr-1" />
                                                Sửa
                                            </Button>
                                            <Button
                                                onClick={() => handleDelete(role.id, role.name)}
                                                size="sm"
                                                variant="outline"
                                                className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-3 w-3 mr-1" />
                                                Xóa
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AdminPageLayout>
    );
}
