'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    Shield,
    Plus,
    Edit2,
    Save,
    X,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getRoles, createRole, updateRole, type Role } from '@/apis/role.api';

const DEFAULT_ROLE_COLORS: Record<string, string> = {
    ADMIN: 'bg-red-100 text-red-800 border-red-300',
    MANAGER: 'bg-[#78A243]/10 text-blue-800 border-blue-300',
    CHEF: 'bg-orange-100 text-orange-800 border-orange-300',
    CHEFF: 'bg-orange-100 text-orange-800 border-orange-300',
    WAITER: 'bg-purple-100 text-purple-800 border-purple-300',
    SHIPPER: 'bg-lime-100 text-lime-800 border-lime-300',
    CUSTOMER: 'bg-green-100 text-green-800 border-green-300',
    STAFF: 'bg-gray-100 text-gray-800 border-[#78A243]/30',
};

const COLOR_VARIANTS = [
    'bg-red-100 text-red-800 border-red-300',
    'bg-[#78A243]/10 text-blue-800 border-blue-300',
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

const getRoleColor = (roleName: string): string => {
    if (DEFAULT_ROLE_COLORS[roleName]) {
        return DEFAULT_ROLE_COLORS[roleName];
    }
    const hash = roleName.split('').reduce((acc, char) => {
        return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    const index = Math.abs(hash) % COLOR_VARIANTS.length;
    return COLOR_VARIANTS[index];
};

interface RolesManagementModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onRoleUpdated?: () => void;
}

export function RolesManagementModal({ open, onOpenChange, onRoleUpdated }: RolesManagementModalProps) {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingName, setEditingName] = useState('');
    const [editingIsInternal, setEditingIsInternal] = useState(false);
    const [newRoleName, setNewRoleName] = useState('');
    const [newRoleIsInternal, setNewRoleIsInternal] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    const fetchRoles = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getRoles();
            setRoles(data);
        } catch (error) {
            console.error('Failed to fetch roles:', error);
            toast.error('Không thể tải danh sách vai trò!');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (open) {
            fetchRoles();
        }
    }, [open, fetchRoles]);

    const handleCreate = async () => {
        if (!newRoleName.trim()) {
            toast.warning('Vui lòng nhập tên vai trò!');
            return;
        }

        try {
            await createRole({
                name: newRoleName.trim().toUpperCase(),
                internal: newRoleIsInternal
            });
            toast.success('Tạo vai trò thành công!');
            setNewRoleName('');
            setNewRoleIsInternal(false);
            setIsCreating(false);
            await fetchRoles();
            onRoleUpdated?.();
        } catch (error) {
            console.error('Failed to create role:', error);
            toast.error('Không thể tạo vai trò!');
        }
    };

    const handleUpdate = async (roleId: number) => {
        if (!editingName.trim()) {
            toast.warning('Vui lòng nhập tên vai trò!');
            return;
        }

        try {
            await updateRole(roleId, {
                name: editingName.trim().toUpperCase(),
                internal: editingIsInternal
            });
            toast.success('Cập nhật vai trò thành công!');
            setEditingId(null);
            setEditingName('');
            setEditingIsInternal(false);
            await fetchRoles();
            onRoleUpdated?.();
        } catch (error) {
            console.error('Failed to update role:', error);
            toast.error('Không thể cập nhật vai trò!');
        }
    };

    const startEdit = (role: Role) => {
        setEditingId(role.id);
        setEditingName(role.name);
        setEditingIsInternal(role.isInternal);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditingName('');
        setEditingIsInternal(false);
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/15 backdrop-blur-[1px] z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-6xl bg-white shadow-2xl rounded-2xl overflow-hidden max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#78A243] to-[#DA7339] p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Shield className="h-8 w-8 text-white" />
                            <div>
                                <h2 className="text-2xl font-bold text-white">Quản lý vai trò</h2>
                                <p className="text-white/80 text-sm">Quản lý các vai trò hệ thống và phân quyền</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                onClick={() => setIsCreating(!isCreating)}
                                className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/50"
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
                            <button
                                onClick={() => onOpenChange(false)}
                                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <X className="h-6 w-6 text-white" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {/* Create Form */}
                    {isCreating && (
                        <Card className="p-4 bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200">
                            <h3 className="text-sm font-bold mb-3 text-gray-800">Tạo vai trò mới</h3>
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    value={newRoleName}
                                    onChange={(e) => setNewRoleName(e.target.value)}
                                    placeholder="Nhập tên vai trò (VD: STAFF)"
                                    className="w-full px-3 py-2 border-2 border-orange-300 rounded-lg text-sm font-semibold uppercase focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                                    onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                                />
                                <div className="flex items-center gap-2 p-3 bg-white rounded-lg border-2 border-orange-200">
                                    <input
                                        type="checkbox"
                                        id="newRoleInternal"
                                        checked={newRoleIsInternal}
                                        onChange={(e) => setNewRoleIsInternal(e.target.checked)}
                                        className="w-4 h-4 rounded border-2 border-orange-400 text-orange-500 focus:ring-2 focus:ring-orange-300"
                                    />
                                    <label htmlFor="newRoleInternal" className="text-sm font-semibold text-gray-700 cursor-pointer">
                                        Vai trò hệ thống (Internal)
                                    </label>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        onClick={handleCreate}
                                        disabled={!newRoleName.trim()}
                                        className="flex-1 bg-gradient-to-r from-[#78A243] to-[#DA7339] text-white"
                                    >
                                        <Save className="h-4 w-4 mr-2" />
                                        Lưu
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setIsCreating(false);
                                            setNewRoleName('');
                                            setNewRoleIsInternal(false);
                                        }}
                                        variant="outline"
                                        className="border-2 border-gray-300"
                                    >
                                        <X className="h-4 w-4 mr-2" />
                                        Hủy
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Roles Grid */}
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                            <p className="text-gray-500 mt-3">Đang tải...</p>
                        </div>
                    ) : roles.length === 0 ? (
                        <div className="text-center py-12">
                            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-500">Chưa có vai trò nào</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {roles.map((role) => (
                                <Card
                                    key={role.id}
                                    className="p-4 bg-white hover:shadow-lg transition-all duration-200 border-2 border-gray-200 hover:border-orange-300"
                                >
                                    {editingId === role.id ? (
                                        <div className="flex flex-col gap-3">
                                            <input
                                                type="text"
                                                value={editingName}
                                                onChange={(e) => setEditingName(e.target.value)}
                                                className="w-full px-3 py-2 border-2 border-orange-300 rounded-lg text-sm font-bold uppercase focus:ring-2 focus:ring-orange-400"
                                                onKeyDown={(e) => e.key === 'Enter' && handleUpdate(role.id)}
                                            />
                                            <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg border-2 border-orange-200">
                                                <input
                                                    type="checkbox"
                                                    id={`editInternal-${role.id}`}
                                                    checked={editingIsInternal}
                                                    onChange={(e) => setEditingIsInternal(e.target.checked)}
                                                    className="w-4 h-4 rounded border-2 border-orange-400 text-orange-500 focus:ring-2 focus:ring-orange-300"
                                                />
                                                <label htmlFor={`editInternal-${role.id}`} className="text-xs font-semibold text-gray-700 cursor-pointer">
                                                    Internal
                                                </label>
                                            </div>
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
                                                    className="flex-1 border-2 border-gray-300"
                                                >
                                                    <X className="h-3 w-3 mr-1" />
                                                    Hủy
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-3">
                                            <div className="flex items-center justify-between">
                                                <Badge
                                                    className={`${getRoleColor(role.name)} border font-bold text-sm px-3 py-1`}
                                                >
                                                    {role.name}
                                                </Badge>
                                                <span className="text-xs text-gray-500">ID: {role.id}</span>
                                            </div>
                                            {role.isInternal && (
                                                <Badge className="bg-[#78A243]/10 text-[#78A243] border-[#78A243]/30 text-xs w-fit">
                                                    🔒 Hệ thống
                                                </Badge>
                                            )}
                                            <Button
                                                onClick={() => startEdit(role)}
                                                size="sm"
                                                variant="outline"
                                                className="w-full text-orange-600 border-orange-200 hover:bg-orange-50"
                                            >
                                                <Edit2 className="h-3 w-3 mr-1" />
                                                Sửa
                                            </Button>
                                        </div>
                                    )}
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
