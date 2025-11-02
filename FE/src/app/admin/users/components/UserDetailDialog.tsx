'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
    User as UserIcon,
    Shield,
    Award,
    FileText,
    MapPin,
    Mail,
    Phone,
    Calendar,
    Clock,
    CheckCircle,
    Lock,
    AlertCircle,
    Edit3,
    Save,
    X as XIcon,
    Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AuditLogEntry, RoleHistory, User, UserTraining } from '@/utils/types/user.types';

export type UserWithUiExtras = User & {
    twoFactorEnabled?: boolean;
    lastLogin?: string;
    certificatesEarned?: number;
};

interface EditableUserFields {
    fullName: string;
    email: string;
    phoneNumber: string;
    address?: string;
    note?: string;
    memberPoint: number;
    memberRank?: number;
    isActive: boolean;
    isBan: boolean;
    twoFactorEnabled: boolean;
}

interface UserDetailDialogProps {
    user: UserWithUiExtras;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onDelete: () => void;
    onSave: (updatedUser: UserWithUiExtras) => void;
}

type UserStatusFilter = 'active' | 'inactive' | 'banned';

const STATUS_CONFIG: Record<UserStatusFilter, { label: string; className: string; icon: string }> = {
    active: { label: 'Hoạt động', className: 'bg-green-100 text-green-800', icon: '✓' },
    inactive: { label: 'Không hoạt động', className: 'bg-gray-100 text-gray-800', icon: '○' },
    banned: { label: 'Đã khóa', className: 'bg-red-100 text-red-800', icon: '🔒' },
};

const mockAuditLogs: AuditLogEntry[] = [
    { id: '1', timestamp: '2024-10-17 09:30:00', action: 'login', performedBy: 'user123', performedByName: 'Nguyễn Văn A', details: 'Đăng nhập thành công', ipAddress: '192.168.1.100' },
    { id: '2', timestamp: '2024-10-16 14:20:00', action: 'update', performedBy: 'admin001', performedByName: 'Admin', details: 'Cập nhật thông tin email', ipAddress: '192.168.1.50' },
    { id: '3', timestamp: '2024-10-15 10:15:00', action: 'role_change', performedBy: 'admin001', performedByName: 'Admin', details: 'Thay đổi vai trò', ipAddress: '192.168.1.50' },
    { id: '4', timestamp: '2024-10-14 16:45:00', action: 'password_change', performedBy: 'user123', performedByName: 'Nguyễn Văn A', details: 'Đổi mật khẩu', ipAddress: '192.168.1.100' },
    { id: '5', timestamp: '2024-10-13 08:00:00', action: 'login', performedBy: 'user123', performedByName: 'Nguyễn Văn A', details: 'Đăng nhập thành công', ipAddress: '192.168.1.105' },
];

const getUserStatus = (user: UserWithUiExtras): UserStatusFilter => {
    if (user.isBan) return 'banned';
    if (!user.isActive) return 'inactive';
    return 'active';
};

const toEditableFields = (user: UserWithUiExtras): EditableUserFields => ({
    fullName: user.fullName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    address: user.address ?? '',
    note: user.note ?? '',
    memberPoint: user.memberPoint,
    memberRank: user.memberRank,
    isActive: user.isActive,
    isBan: user.isBan,
    twoFactorEnabled: Boolean(user.twoFactorEnabled),
});

export function UserDetailDialog({ user, open, onOpenChange, onDelete, onSave }: UserDetailDialogProps) {
    const [activeTab, setActiveTab] = useState('info');
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState<EditableUserFields>(toEditableFields(user));

    useEffect(() => {
        setFormData(toEditableFields(user));
        setIsEditMode(false);
        setActiveTab('info');
    }, [user]);

    const status = useMemo(() => getUserStatus(user), [user]);

    const handleSubmit = () => {
        const updatedUser: UserWithUiExtras = {
            ...user,
            ...formData,
        };
        onSave(updatedUser);
        setFormData(toEditableFields(updatedUser));
        setIsEditMode(false);
    };

    const handleInputChange = <K extends keyof EditableUserFields>(key: K, value: EditableUserFields[K]) => {
        setFormData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleOpenChange = (next: boolean) => {
        if (!next) {
            setIsEditMode(false);
            setFormData(toEditableFields(user));
        }
        onOpenChange(next);
    };

    const userBranchRoles: RoleHistory[] = user.roleHistories ?? [];
    const userTrainings: UserTraining[] = user.trainings ?? [];

    const getActionIcon = (action: AuditLogEntry['action']) => {
        switch (action) {
            case 'login': return <CheckCircle className="h-4 w-4 text-green-600" />;
            case 'logout': return <Clock className="h-4 w-4 text-gray-600" />;
            case 'update': return <FileText className="h-4 w-4 text-blue-600" />;
            case 'password_change': return <Lock className="h-4 w-4 text-orange-600" />;
            case 'role_change': return <Shield className="h-4 w-4 text-purple-600" />;
            case 'delete': return <AlertCircle className="h-4 w-4 text-red-600" />;
            default: return <FileText className="h-4 w-4 text-gray-600" />;
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="w-screen max-w-[95vw] lg:max-w-5xl max-h-[95vh] p-0 overflow-hidden">
                <div className="flex h-full flex-col overflow-hidden max-h-[95vh]">
                    <DialogHeader className="px-6 pt-5 pb-3 bg-gradient-to-r from-orange-50 to-white border-b border-orange-100 flex-shrink-0">
                        <DialogTitle className="flex items-center gap-4 text-xl">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0">
                                {user.fullName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div className="font-bold text-gray-900">{user.fullName}</div>
                                <div className="text-sm text-gray-500 font-normal flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                    {user.email}
                                </div>
                            </div>
                        </DialogTitle>
                        <DialogDescription className="mt-2 text-gray-600 text-sm">
                            Chi tiết thông tin người dùng, phân quyền, đào tạo và lịch sử hoạt động
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-4 space-y-4">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="flex w-full flex-wrap gap-2 overflow-x-auto md:grid md:grid-cols-4 mb-4 flex-shrink-0">
                                <TabsTrigger value="info" className="flex items-center gap-2 whitespace-nowrap">
                                    <UserIcon className="h-4 w-4" />
                                    Thông tin
                                </TabsTrigger>
                                <TabsTrigger value="branches" className="flex items-center gap-2 whitespace-nowrap">
                                    <MapPin className="h-4 w-4" />
                                    Chi nhánh
                                </TabsTrigger>
                                <TabsTrigger value="training" className="flex items-center gap-2 whitespace-nowrap">
                                    <Award className="h-4 w-4" />
                                    Đào tạo
                                </TabsTrigger>
                                <TabsTrigger value="logs" className="flex items-center gap-2 whitespace-nowrap">
                                    <FileText className="h-4 w-4" />
                                    Lịch sử
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="info" className="space-y-3">
                                <Card className="p-4">
                                    <h3 className="font-semibold mb-3 text-gray-900">Thông tin cá nhân</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-sm text-gray-600">Họ và tên</label>
                                            {isEditMode ? (
                                                <Input
                                                    value={formData.fullName}
                                                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                                                    className="mt-2"
                                                />
                                            ) : (
                                                <p className="font-semibold text-gray-900 mt-2">{user.fullName}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-600 flex items-center gap-2">
                                                <Mail className="h-4 w-4 text-gray-400" />
                                                Email
                                            </label>
                                            {isEditMode ? (
                                                <Input
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                                    className="mt-2"
                                                />
                                            ) : (
                                                <p className="font-semibold text-gray-900 mt-2">{user.email}</p>
                                            )}
                                            <Badge className={`mt-3 ${user.emailVerified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {user.emailVerified ? 'Đã xác thực' : 'Chưa xác thực'}
                                            </Badge>
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-600 flex items-center gap-2">
                                                <Phone className="h-4 w-4 text-gray-400" />
                                                Số điện thoại
                                            </label>
                                            {isEditMode ? (
                                                <Input
                                                    value={formData.phoneNumber}
                                                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                                    className="mt-2"
                                                />
                                            ) : (
                                                <p className="font-semibold text-gray-900 mt-2">{user.phoneNumber}</p>
                                            )}
                                            <Badge className={`mt-3 ${user.phoneVerified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {user.phoneVerified ? 'Đã xác thực' : 'Chưa xác thực'}
                                            </Badge>
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-600 flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-gray-400" />
                                                Ngày tạo
                                            </label>
                                            <p className="font-semibold text-gray-900 mt-2">
                                                {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                                            </p>
                                        </div>
                                    </div>
                                </Card>

                                <Card className="p-4">
                                    <h3 className="font-semibold mb-3 text-gray-900">Trạng thái & điểm thưởng</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                        <div>
                                            <label className="text-sm text-gray-600 flex items-center gap-2">
                                                <Shield className="h-4 w-4 text-gray-400" />
                                                Trạng thái
                                            </label>
                                            <div className="mt-2">
                                                <Badge className={STATUS_CONFIG[status].className}>
                                                    {STATUS_CONFIG[status].label}
                                                </Badge>
                                                <div className="flex items-center gap-3 mt-2">
                                                    <div className="flex items-center gap-2">
                                                        <Checkbox
                                                            checked={formData.isActive}
                                                            disabled={!isEditMode}
                                                            onCheckedChange={(checked) =>
                                                                handleInputChange('isActive', checked === true)
                                                            }
                                                        />
                                                        <span className="text-sm text-gray-700">Hoạt động</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Checkbox
                                                            checked={formData.isBan}
                                                            disabled={!isEditMode}
                                                            onCheckedChange={(checked) =>
                                                                handleInputChange('isBan', checked === true)
                                                            }
                                                        />
                                                        <span className="text-sm text-gray-700">Khóa</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-600">Điểm thành viên</label>
                                            {isEditMode ? (
                                                <Input
                                                    type="number"
                                                    value={formData.memberPoint}
                                                    onChange={(e) =>
                                                        handleInputChange('memberPoint', Number(e.target.value) || 0)
                                                    }
                                                    className="mt-2"
                                                />
                                            ) : (
                                                <p className="font-semibold text-gray-900 mt-2">{user.memberPoint}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-600">Hạng thành viên</label>
                                            {isEditMode ? (
                                                <Input
                                                    type="number"
                                                    min={1}
                                                    value={formData.memberRank ?? ''}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            'memberRank',
                                                            e.target.value ? Number(e.target.value) : undefined,
                                                        )
                                                    }
                                                    className="mt-2"
                                                />
                                            ) : (
                                                <p className="font-semibold text-gray-900 mt-2">{user.memberRank ?? '-'}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-600 flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-gray-400" />
                                                Đăng nhập gần nhất
                                            </label>
                                            <p className="font-semibold text-gray-900 mt-2">
                                                {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('vi-VN') : 'Chưa có'}
                                            </p>
                                        </div>
                                    </div>
                                </Card>

                                <Card className="p-4">
                                    <h3 className="font-semibold mb-3 text-gray-900">Địa chỉ & ghi chú</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-sm text-gray-600">Địa chỉ</label>
                                            {isEditMode ? (
                                                <Input
                                                    value={formData.address ?? ''}
                                                    onChange={(e) => handleInputChange('address', e.target.value)}
                                                    className="mt-2"
                                                />
                                            ) : (
                                                <p className="font-semibold text-gray-900 mt-2">
                                                    {user.address ?? 'Chưa cập nhật'}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-600">Ghi chú</label>
                                            {isEditMode ? (
                                                <Textarea
                                                    value={formData.note ?? ''}
                                                    onChange={(e) => handleInputChange('note', e.target.value)}
                                                    className="mt-2"
                                                    rows={4}
                                                />
                                            ) : (
                                                <p className="font-semibold text-gray-900 mt-2">
                                                    {user.note ? user.note : 'Không có ghi chú'}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            </TabsContent>

                            <TabsContent value="branches" className="space-y-3">
                                <Card className="p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-semibold flex items-center gap-2 text-gray-900">
                                            <MapPin className="h-5 w-5 text-orange-600" />
                                            Phân quyền theo chi nhánh
                                        </h3>
                                        <Button size="sm" variant="outline" disabled>
                                            + Thêm chi nhánh
                                        </Button>
                                    </div>
                                    <div className="space-y-3">
                                        {userBranchRoles.length === 0 ? (
                                            <div className="text-center py-8 text-gray-500">
                                                <MapPin className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                                                <p>Chưa được gán chi nhánh nào</p>
                                            </div>
                                        ) : (
                                            userBranchRoles.map((br) => (
                                                <div
                                                    key={br.id}
                                                    className="border border-gray-200 rounded-lg p-4 flex items-center justify-between"
                                                >
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{br.branchName ?? 'Chi nhánh không xác định'}</p>
                                                        <p className="text-sm text-gray-600">Vai trò: {br.roleName}</p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            Bắt đầu: {new Date(br.startDate).toLocaleDateString('vi-VN')}
                                                            {br.endDate && (
                                                                <> • Kết thúc: {new Date(br.endDate).toLocaleDateString('vi-VN')}</>
                                                            )}
                                                        </p>
                                                    </div>
                                                    <Badge className={br.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}>
                                                        {br.isActive ? 'Đang hoạt động' : 'Không hoạt động'}
                                                    </Badge>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </Card>
                            </TabsContent>

                            <TabsContent value="training" className="space-y-3">
                                <Card className="p-4">
                                    <h3 className="font-semibold mb-3 text-gray-900">Tổng quan đào tạo</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        <div className="p-3 rounded-lg border border-orange-200 bg-orange-50">
                                            <p className="text-xs text-orange-600 font-semibold uppercase">Tham gia</p>
                                            <p className="text-2xl font-bold text-orange-700 mt-2">
                                                {user.trainingStats?.totalEnrolled ?? 0}
                                            </p>
                                        </div>
                                        <div className="p-3 rounded-lg border border-green-200 bg-green-50">
                                            <p className="text-xs text-green-600 font-semibold uppercase">Hoàn thành</p>
                                            <p className="text-2xl font-bold text-green-700 mt-2">
                                                {user.trainingStats?.totalCompleted ?? 0}
                                            </p>
                                        </div>
                                        <div className="p-3 rounded-lg border border-blue-200 bg-blue-50">
                                            <p className="text-xs text-blue-600 font-semibold uppercase">Điểm số</p>
                                            <p className="text-2xl font-bold text-blue-700 mt-2">
                                                {user.trainingStats?.totalPoints ?? 0}
                                            </p>
                                        </div>
                                        <div className="p-3 rounded-lg border border-purple-200 bg-purple-50">
                                            <p className="text-xs text-purple-600 font-semibold uppercase">Tiến độ</p>
                                            <p className="text-2xl font-bold text-purple-700 mt-2">
                                                {user.trainingStats?.completionRate ?? 0}%
                                            </p>
                                        </div>
                                    </div>
                                </Card>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                                    {userTrainings.length === 0 ? (
                                        <Card className="p-5 text-center text-gray-500">
                                            <Award className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                                            <p>Chưa ghi nhận chương trình đào tạo nào</p>
                                        </Card>
                                    ) : (
                                        userTrainings.map((training) => (
                                            <Card key={training.id} className="p-4">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900">{training.trainingName}</h4>
                                                        <p className="text-sm text-gray-600">
                                                            Tham gia: {new Date(training.enrollDate).toLocaleDateString('vi-VN')}
                                                        </p>
                                                    </div>
                                                    <Badge className={training.isPassed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                                                        {training.isPassed ? 'Đạt' : 'Đang học'}
                                                    </Badge>
                                                </div>
                                                <div className="mt-4 space-y-2 text-sm text-gray-600">
                                                    <p>Điểm số: <span className="font-semibold text-gray-900">{training.point}</span></p>
                                                    {training.lessonsProgress && training.lessonsProgress.length > 0 && (
                                                        <div>
                                                            <p className="font-semibold text-gray-900">Tiến độ bài học</p>
                                                            <ul className="mt-2 space-y-1">
                                                                {training.lessonsProgress.map((lesson) => (
                                                                    <li key={lesson.id} className="flex items-center justify-between text-xs bg-gray-50 px-3 py-2 rounded-md">
                                                                        <span>{lesson.lessonTitle}</span>
                                                                        <span className="font-semibold text-gray-900">{lesson.point} điểm</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            </Card>
                                        ))
                                    )}
                                </div>
                            </TabsContent>

                            <TabsContent value="logs" className="space-y-3">
                                <Card className="p-4">
                                    <h3 className="font-semibold mb-3 text-gray-900">Lịch sử hoạt động mới nhất</h3>
                                    <div className="space-y-2">
                                        {mockAuditLogs.map((log) => (
                                            <div
                                                key={log.id}
                                                className="border border-gray-200 rounded-lg p-3 flex items-start gap-3"
                                            >
                                                <div className="pt-1">{getActionIcon(log.action)}</div>
                                                <div className="flex-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="font-semibold text-gray-900">{log.performedByName}</span>
                                                        <Badge variant="outline" className="text-gray-600">
                                                            {log.action}
                                                        </Badge>
                                                        <span className="text-xs text-gray-500">
                                                            {log.timestamp}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-700 mt-1">{log.details}</p>
                                                    {log.ipAddress && (
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            IP: {log.ipAddress} {log.userAgent && `• ${log.userAgent}`}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>

                    <div className="px-6 py-3 border-t border-gray-200 bg-white flex items-center justify-between flex-shrink-0">
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={onDelete}
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Xóa người dùng
                        </Button>
                        <div className="flex items-center gap-2">
                            {isEditMode && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setFormData(toEditableFields(user));
                                        setIsEditMode(false);
                                    }}
                                >
                                    <XIcon className="h-4 w-4 mr-2" />
                                    Hủy
                                </Button>
                            )}
                            <Button
                                size="sm"
                                className="bg-gradient-to-r from-orange-500 to-orange-600"
                                onClick={() => {
                                    if (isEditMode) {
                                        handleSubmit();
                                    } else {
                                        setIsEditMode(true);
                                    }
                                }}
                            >
                                {isEditMode ? (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        Lưu thay đổi
                                    </>
                                ) : (
                                    <>
                                        <Edit3 className="h-4 w-4 mr-2" />
                                        Chỉnh sửa
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
