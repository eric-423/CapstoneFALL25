'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    User,
    ArrowLeft,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Shield,
    Building,
    CheckCircle,
    XCircle,
    Clock,
    Award,
    FileText,
    History,
    Edit,
    Ban,
    UserCheck,
    Trash2,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AdminPageLayout, AdminPageHeader } from '../../components/AdminPageLayout';
import { getUserById, getUserRoleHistory, banUser, unbanUser, deleteUser, type UserDetail, type RoleHistory } from '@/apis/admin-user.api';
import { UserFormDialog } from '../components/UserFormDialog';
import { ConfirmDialog } from '../components/ConfirmDialog';
import Link from 'next/link';

export default function UserDetailPage() {
    const params = useParams();
    const router = useRouter();
    const userId = parseInt(params.userId as string);

    const [user, setUser] = useState<UserDetail | null>(null);
    const [roleHistory, setRoleHistory] = useState<RoleHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [activeTab, setActiveTab] = useState<'info' | 'history'>('info');
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; type: 'ban' | 'unban' | 'delete' | null }>({ open: false, type: null });

    const fetchUserDetail = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getUserById(userId);
            setUser(data);
        } catch (error) {
            console.error('Failed to fetch user:', error);
            toast.error('❌ Không thể tải thông tin người dùng!');
        } finally {
            setLoading(false);
        }
    }, [userId]);

    const fetchRoleHistory = useCallback(async () => {
        try {
            setLoadingHistory(true);
            const data = await getUserRoleHistory(userId);
            setRoleHistory(data);
        } catch (error) {
            console.error('Failed to fetch role history:', error);
            toast.error('❌ Không thể tải lịch sử vai trò!');
        } finally {
            setLoadingHistory(false);
        }
    }, [userId]);

    const handleEditSuccess = () => {
        fetchUserDetail(); // Reload user data after edit
        if (activeTab === 'history') {
            fetchRoleHistory(); // Reload history if on history tab
        }
    };

    const handleConfirmAction = async () => {
        try {
            setActionLoading(true);

            if (confirmDialog.type === 'ban') {
                await banUser(userId);
                toast.success('🔒 Đã khóa tài khoản người dùng!');
                fetchUserDetail();
            } else if (confirmDialog.type === 'unban') {
                await unbanUser(userId);
                toast.success('✅ Đã mở khóa tài khoản người dùng!');
                fetchUserDetail();
            } else if (confirmDialog.type === 'delete') {
                await deleteUser(userId);
                toast.success('🗑️ Đã xóa người dùng!');
                router.push('/admin/users');
            }

            setConfirmDialog({ open: false, type: null });
        } catch (error) {
            console.error('Failed to perform action:', error);
            const errorMessages = {
                ban: 'Không thể khóa tài khoản!',
                unban: 'Không thể mở khóa tài khoản!',
                delete: 'Không thể xóa người dùng!',
            };
            toast.error(`❌ ${confirmDialog.type ? errorMessages[confirmDialog.type] : 'Có lỗi xảy ra!'}`);
        } finally {
            setActionLoading(false);
        }
    };

    useEffect(() => {
        fetchUserDetail();
    }, [fetchUserDetail]);

    useEffect(() => {
        if (activeTab === 'history') {
            fetchRoleHistory();
        }
    }, [activeTab, fetchRoleHistory]);

    if (loading) {
        return (
            <AdminPageLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                </div>
            </AdminPageLayout>
        );
    }

    if (!user) {
        return (
            <AdminPageLayout>
                <div className="flex flex-col items-center justify-center h-64">
                    <User className="h-16 w-16 text-gray-300 mb-4" />
                    <p className="text-gray-500">Không tìm thấy người dùng</p>
                    <Link href="/admin/users">
                        <Button className="mt-4">Quay lại danh sách</Button>
                    </Link>
                </div>
            </AdminPageLayout>
        );
    }

    return (
        <AdminPageLayout>
            <AdminPageHeader
                title={user.fullName}
                description={`ID: ${user.id} • ${user.email}`}
                icon={User}
                actions={
                    <div className="flex gap-2">
                        <Button
                            onClick={() => setIsEditDialogOpen(true)}
                            disabled={actionLoading}
                            className="bg-gradient-to-r from-[#EC6426] to-[#F8A91F] hover:from-[#EC6426]/90 hover:to-[#F8A91F]/90 text-white"
                        >
                            <Edit className="h-4 w-4 mr-2" />
                            Chỉnh sửa
                        </Button>
                        {user.isBan ? (
                            <Button
                                onClick={() => setConfirmDialog({ open: true, type: 'unban' })}
                                disabled={actionLoading}
                                variant="outline"
                                className="border-green-300 text-green-700 hover:bg-green-50"
                            >
                                <UserCheck className="h-4 w-4 mr-2" />
                                Mở khóa
                            </Button>
                        ) : (
                            <Button
                                onClick={() => setConfirmDialog({ open: true, type: 'ban' })}
                                disabled={actionLoading}
                                variant="outline"
                                className="border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                            >
                                <Ban className="h-4 w-4 mr-2" />
                                Khóa
                            </Button>
                        )}
                        <Button
                            onClick={() => setConfirmDialog({ open: true, type: 'delete' })}
                            disabled={actionLoading}
                            variant="outline"
                            className="border-red-300 text-red-700 hover:bg-red-50"
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Xóa
                        </Button>
                        <Link href="/admin/users">
                            <Button variant="outline">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Quay lại
                            </Button>
                        </Link>
                    </div>
                }
            />

            {/* Tabs */}
            <div className="flex gap-2 border-b-2 border-gray-200">
                <button
                    onClick={() => setActiveTab('info')}
                    className={`px-6 py-3 font-semibold text-sm transition-all ${activeTab === 'info'
                        ? 'text-orange-600 border-b-2 border-orange-600 -mb-0.5'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    <User className="h-4 w-4 inline-block mr-2" />
                    Thông tin cá nhân
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`px-6 py-3 font-semibold text-sm transition-all ${activeTab === 'history'
                        ? 'text-orange-600 border-b-2 border-orange-600 -mb-0.5'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    <History className="h-4 w-4 inline-block mr-2" />
                    Lịch sử vai trò
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'info' && (
                <div className="space-y-6">
                    {/* Status Badges */}
                    <div className="flex flex-wrap gap-3">
                        <Badge className={`${user.isBan ? 'bg-red-100 text-red-700 border-red-300' : 'bg-green-100 text-green-700 border-green-300'}`}>
                            {user.isBan ? (
                                <>
                                    <XCircle className="h-3 w-3 mr-1" />
                                    Đã khóa
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Hoạt động
                                </>
                            )}
                        </Badge>
                        {user.emailVerified && (
                            <Badge className="bg-blue-100 text-blue-700 border-blue-300">
                                <Mail className="h-3 w-3 mr-1" />
                                Email đã xác thực
                            </Badge>
                        )}
                        {user.phoneVerified && (
                            <Badge className="bg-blue-100 text-blue-700 border-blue-300">
                                <Phone className="h-3 w-3 mr-1" />
                                SĐT đã xác thực
                            </Badge>
                        )}
                        {user.isBusy && (
                            <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">
                                <Clock className="h-3 w-3 mr-1" />
                                Đang bận
                            </Badge>
                        )}
                    </div>

                    {/* User Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Personal Info */}
                        <Card className="p-6 space-y-4">
                            <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Thông tin cá nhân</h3>

                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <User className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-500">Họ và tên</p>
                                        <p className="text-sm font-semibold text-gray-900">{user.fullName}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-500">Ngày sinh</p>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {new Date(user.dateOfBirth).toLocaleDateString('vi-VN')}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-500">Email</p>
                                        <p className="text-sm font-semibold text-gray-900">{user.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-500">Số điện thoại</p>
                                        <p className="text-sm font-semibold text-gray-900">{user.phoneNumber}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-500">Địa chỉ</p>
                                        <p className="text-sm font-semibold text-gray-900">{user.address || 'Chưa cập nhật'}</p>
                                    </div>
                                </div>

                                {user.note && (
                                    <div className="flex items-start gap-3">
                                        <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-500">Ghi chú</p>
                                            <p className="text-sm font-semibold text-gray-900">{user.note}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* Account Info */}
                        <Card className="p-6 space-y-4">
                            <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Thông tin tài khoản</h3>

                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <Shield className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-500">Vai trò hiện tại</p>
                                        <Badge className="bg-blue-100 text-blue-700 border-blue-300 font-semibold mt-1">
                                            {user.role}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Award className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-500">Điểm thành viên</p>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {user.memberPoint.toLocaleString('vi-VN')} điểm
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-500">Ngày tạo</p>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {new Date(user.createdAt).toLocaleString('vi-VN')}
                                        </p>
                                    </div>
                                </div>

                                {user.memberAssociationName && (
                                    <div className="flex items-start gap-3">
                                        <Building className="h-5 w-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-500">Hội viên</p>
                                            <p className="text-sm font-semibold text-gray-900">{user.memberAssociationName}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            )}

            {activeTab === 'history' && (
                <Card className="overflow-hidden">
                    <div className="p-6 border-b bg-gray-50">
                        <h3 className="text-lg font-bold text-gray-900">Lịch sử vai trò</h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Theo dõi các thay đổi vai trò và chi nhánh của người dùng
                        </p>
                    </div>

                    {loadingHistory ? (
                        <div className="p-12 text-center text-gray-500">
                            <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
                            <p>Đang tải lịch sử vai trò...</p>
                        </div>
                    ) : roleHistory.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            <History className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                            <p className="font-semibold">Chưa có lịch sử vai trò</p>
                        </div>
                    ) : (
                        <div className="p-8">
                            {/* Timeline Tree - Bottom to Top */}
                            <div className="relative">
                                {roleHistory.slice().reverse().map((history, index) => {
                                    const isLast = index === roleHistory.length - 1;
                                    const isFirst = index === 0;

                                    return (
                                        <div key={history.id} className="relative">
                                            {/* Vertical Line */}
                                            {!isLast && (
                                                <div className="absolute left-[15px] top-[40px] w-0.5 h-[calc(100%+16px)] bg-gradient-to-b from-orange-400 to-orange-200"></div>
                                            )}

                                            <div className="flex gap-4 pb-8">
                                                {/* Timeline Node */}
                                                <div className="relative flex-shrink-0">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 relative ${history.isActive
                                                            ? 'bg-gradient-to-br from-green-400 to-green-600 ring-4 ring-green-100'
                                                            : 'bg-gradient-to-br from-gray-300 to-gray-400 ring-4 ring-gray-100'
                                                        }`}>
                                                        {history.isActive ? (
                                                            <CheckCircle className="h-4 w-4 text-white" />
                                                        ) : (
                                                            <Clock className="h-4 w-4 text-white" />
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Content Card */}
                                                <div className={`flex-1 rounded-xl p-4 border-2 transition-all ${history.isActive
                                                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 shadow-md'
                                                        : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm'
                                                    }`}>
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <Badge className={`${history.isActive
                                                                    ? 'bg-green-600 text-white border-green-700'
                                                                    : 'bg-blue-100 text-blue-700 border-blue-300'
                                                                } font-semibold`}>
                                                                <Shield className="h-3 w-3 mr-1" />
                                                                {history.roleName}
                                                            </Badge>
                                                            {history.isActive && (
                                                                <Badge className="bg-white text-green-700 border-green-300 animate-pulse">
                                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                                    Hiện tại
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <span className="text-xs text-gray-400 font-mono">#{history.id}</span>
                                                    </div>

                                                    {history.branchName && (
                                                        <div className="flex items-center gap-2 text-sm text-gray-700 mb-2 bg-white/50 rounded-lg p-2 border border-gray-200">
                                                            <Building className="h-4 w-4 text-orange-500" />
                                                            <span className="font-medium">{history.branchName}</span>
                                                        </div>
                                                    )}

                                                    <div className="flex items-center gap-4 text-xs text-gray-600">
                                                        <div className="flex items-center gap-1.5 bg-blue-50 px-2 py-1 rounded-md">
                                                            <Clock className="h-3 w-3 text-blue-600" />
                                                            <span className="font-medium">Bắt đầu:</span>
                                                            <span>{new Date(history.startDate).toLocaleDateString('vi-VN')}</span>
                                                        </div>
                                                        {history.endDate && (
                                                            <div className="flex items-center gap-1.5 bg-red-50 px-2 py-1 rounded-md">
                                                                <Clock className="h-3 w-3 text-red-600" />
                                                                <span className="font-medium">Kết thúc:</span>
                                                                <span>{new Date(history.endDate).toLocaleDateString('vi-VN')}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </Card>
            )}

            {/* Edit Dialog */}
            <UserFormDialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                user={user}
                onSuccess={handleEditSuccess}
            />

            {/* Confirm Dialog */}
            {confirmDialog.type && (
                <ConfirmDialog
                    open={confirmDialog.open}
                    onOpenChange={(open) => setConfirmDialog({ open, type: null })}
                    onConfirm={handleConfirmAction}
                    type={confirmDialog.type}
                    userName={user.fullName}
                    loading={actionLoading}
                />
            )}
        </AdminPageLayout>
    );
}
