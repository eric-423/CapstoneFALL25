'use client';

import React, { useState } from 'react';
import { X, User as UserIcon, Shield, Award, FileText, MapPin, Mail, Phone, Calendar, Clock, CheckCircle, Lock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { User, BranchRole, TrainingProgress, AuditLogEntry } from '@/utils/types/user.types';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface UserDetailDialogProps {
    user: User;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

// Mock data
const mockBranchRoles: BranchRole[] = [
    { branchId: '1', branchName: 'Chi nhánh Quận 1', role: 'MANAGER', assignedAt: '2024-01-15', assignedBy: 'Admin' },
    { branchId: '3', branchName: 'Chi nhánh Thủ Đức', role: 'STAFF', assignedAt: '2024-02-20', assignedBy: 'Admin' },
];

const mockTraining: TrainingProgress[] = [
    { programId: '1', programName: 'Food Safety Training', completedLessons: 8, totalLessons: 10, completionPercentage: 80, status: 'in_progress', lastAccessed: '2024-10-15', certificateIssued: false },
    { programId: '2', programName: 'Customer Service Excellence', completedLessons: 12, totalLessons: 12, completionPercentage: 100, status: 'completed', lastAccessed: '2024-09-20', certificateIssued: true },
    { programId: '3', programName: 'Kitchen Operations', completedLessons: 0, totalLessons: 15, completionPercentage: 0, status: 'not_started' },
];

const mockAuditLogs: AuditLogEntry[] = [
    { id: '1', timestamp: '2024-10-17 09:30:00', action: 'login', performedBy: 'user123', performedByName: 'Nguyễn Văn A', details: 'Đăng nhập thành công', ipAddress: '192.168.1.100' },
    { id: '2', timestamp: '2024-10-16 14:20:00', action: 'update', performedBy: 'admin001', performedByName: 'Admin', details: 'Cập nhật thông tin email', ipAddress: '192.168.1.50' },
    { id: '3', timestamp: '2024-10-15 10:15:00', action: 'role_change', performedBy: 'admin001', performedByName: 'Admin', details: 'Thay đổi vai trò từ STAFF sang MANAGER', ipAddress: '192.168.1.50' },
    { id: '4', timestamp: '2024-10-14 16:45:00', action: 'password_change', performedBy: 'user123', performedByName: 'Nguyễn Văn A', details: 'Đổi mật khẩu', ipAddress: '192.168.1.100' },
    { id: '5', timestamp: '2024-10-13 08:00:00', action: 'login', performedBy: 'user123', performedByName: 'Nguyễn Văn A', details: 'Đăng nhập thành công', ipAddress: '192.168.1.105' },
];

export function UserDetailDialog({ user, open, onOpenChange }: UserDetailDialogProps) {
    const [activeTab, setActiveTab] = useState('info');

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
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3 text-2xl">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                            {user.fullName.charAt(0)}
                        </div>
                        <div>
                            <div>{user.fullName}</div>
                            <div className="text-sm text-gray-500 font-normal">{user.email}</div>
                        </div>
                    </DialogTitle>
                    <DialogDescription>
                        Chi tiết thông tin người dùng, phân quyền, đào tạo và lịch sử hoạt động
                    </DialogDescription>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="info" className="flex items-center gap-2">
                            <UserIcon className="h-4 w-4" />
                            Thông tin
                        </TabsTrigger>
                        <TabsTrigger value="branches" className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Chi nhánh
                        </TabsTrigger>
                        <TabsTrigger value="training" className="flex items-center gap-2">
                            <Award className="h-4 w-4" />
                            Đào tạo
                        </TabsTrigger>
                        <TabsTrigger value="audit" className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Audit Log
                        </TabsTrigger>
                    </TabsList>

                    {/* Info Tab */}
                    <TabsContent value="info" className="space-y-4 mt-4">
                        <Card className="p-4">
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <UserIcon className="h-5 w-5 text-orange-600" />
                                Thông tin cá nhân
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-gray-600">Họ tên</label>
                                    <p className="font-semibold text-gray-900">{user.fullName}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-600">Vai trò chính</label>
                                    <p className="font-semibold text-gray-900">{user.primaryRole}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-600">Email</label>
                                    <p className="font-semibold text-gray-900 flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-gray-400" />
                                        {user.email}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-600">Số điện thoại</label>
                                    <p className="font-semibold text-gray-900 flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-gray-400" />
                                        {user.phone}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-600">Trạng thái</label>
                                    <div className="mt-1">
                                        <Badge className={
                                            user.status === 'active' ? 'bg-green-100 text-green-800' :
                                                user.status === 'locked' ? 'bg-red-100 text-red-800' :
                                                    'bg-gray-100 text-gray-800'
                                        }>
                                            {user.status}
                                        </Badge>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-600">Bảo mật 2FA</label>
                                    <div className="mt-1">
                                        {user.twoFactorEnabled ? (
                                            <Badge className="bg-green-100 text-green-800">
                                                <Shield className="w-3 h-3 mr-1" />
                                                Đã bật
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-gray-600">
                                                <Shield className="w-3 h-3 mr-1" />
                                                Chưa bật
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-4">
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <Clock className="h-5 w-5 text-orange-600" />
                                Hoạt động
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-gray-600">Đăng nhập gần nhất</label>
                                    <p className="font-semibold text-gray-900">
                                        {user.lastLogin ? new Date(user.lastLogin).toLocaleString('vi-VN') : 'Chưa đăng nhập'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-600">Ngày tạo</label>
                                    <p className="font-semibold text-gray-900 flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-gray-400" />
                                        {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </TabsContent>

                    {/* Branch Roles Tab */}
                    <TabsContent value="branches" className="space-y-4 mt-4">
                        <Card className="p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-orange-600" />
                                    Phân quyền theo chi nhánh
                                </h3>
                                <Button size="sm" variant="outline">
                                    + Thêm chi nhánh
                                </Button>
                            </div>
                            <div className="space-y-3">
                                {mockBranchRoles.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <MapPin className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                                        <p>Chưa được gán chi nhánh nào</p>
                                    </div>
                                ) : (
                                    mockBranchRoles.map((br) => (
                                        <Card key={br.branchId} className="p-4 bg-gray-50">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <MapPin className="h-5 w-5 text-orange-600" />
                                                        <span className="font-semibold text-gray-900">{br.branchName}</span>
                                                        <Badge className="bg-blue-100 text-blue-800">{br.role}</Badge>
                                                    </div>
                                                    <div className="text-sm text-gray-600 ml-8">
                                                        Gán bởi <span className="font-medium">{br.assignedBy}</span> vào{' '}
                                                        {new Date(br.assignedAt).toLocaleDateString('vi-VN')}
                                                    </div>
                                                </div>
                                                <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                                                    Xóa
                                                </Button>
                                            </div>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </Card>
                    </TabsContent>

                    {/* Training Tab */}
                    <TabsContent value="training" className="space-y-4 mt-4">
                        <Card className="p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <Award className="h-5 w-5 text-orange-600" />
                                    Tiến độ đào tạo
                                </h3>
                                <div className="text-sm text-gray-600">
                                    Hoàn thành: <span className="font-bold text-orange-600">{user.trainingCompletionRate}%</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {mockTraining.map((training) => (
                                    <Card key={training.programId} className="p-4 bg-gray-50">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900">{training.programName}</h4>
                                                <div className="text-sm text-gray-600 mt-1">
                                                    {training.completedLessons} / {training.totalLessons} bài học
                                                </div>
                                            </div>
                                            <Badge className={
                                                training.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                    training.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-gray-100 text-gray-800'
                                            }>
                                                {training.status === 'completed' ? 'Hoàn thành' :
                                                    training.status === 'in_progress' ? 'Đang học' : 'Chưa bắt đầu'}
                                            </Badge>
                                        </div>

                                        {/* Progress bar */}
                                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                            <div
                                                className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all"
                                                style={{ width: `${training.completionPercentage}%` }}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between text-xs text-gray-600">
                                            <span>{training.completionPercentage}% hoàn thành</span>
                                            {training.lastAccessed && (
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    Truy cập: {new Date(training.lastAccessed).toLocaleDateString('vi-VN')}
                                                </span>
                                            )}
                                        </div>

                                        {training.certificateIssued && (
                                            <div className="mt-2 pt-2 border-t border-gray-200">
                                                <Badge className="bg-yellow-100 text-yellow-800">
                                                    <Award className="w-3 h-3 mr-1" />
                                                    Chứng chỉ đã cấp
                                                </Badge>
                                            </div>
                                        )}
                                    </Card>
                                ))}
                            </div>
                        </Card>
                    </TabsContent>

                    {/* Audit Log Tab */}
                    <TabsContent value="audit" className="space-y-4 mt-4">
                        <Card className="p-4">
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <FileText className="h-5 w-5 text-orange-600" />
                                Lịch sử hoạt động
                            </h3>
                            <div className="space-y-2">
                                {mockAuditLogs.map((log) => (
                                    <div key={log.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <div className="mt-0.5">
                                            {getActionIcon(log.action)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-semibold text-gray-900 text-sm">{log.details}</span>
                                                <Badge variant="outline" className="text-xs">
                                                    {log.action}
                                                </Badge>
                                            </div>
                                            <div className="text-xs text-gray-600 space-y-0.5">
                                                <div>Thực hiện bởi: <span className="font-medium">{log.performedByName}</span></div>
                                                <div className="flex items-center gap-3">
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {log.timestamp}
                                                    </span>
                                                    {log.ipAddress && (
                                                        <span className="text-gray-500">IP: {log.ipAddress}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Đóng
                    </Button>
                    <Button className="bg-gradient-to-r from-orange-500 to-orange-600">
                        Chỉnh sửa
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
