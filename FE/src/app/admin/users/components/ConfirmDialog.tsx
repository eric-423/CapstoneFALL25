'use client';

import React from 'react';
import { AlertTriangle, Ban, UserCheck, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    type: 'ban' | 'unban' | 'delete';
    userName: string;
    loading?: boolean;
}

export function ConfirmDialog({ open, onOpenChange, onConfirm, type, userName, loading = false }: ConfirmDialogProps) {
    if (!open) return null;

    const config = {
        ban: {
            icon: Ban,
            title: 'Khóa tài khoản người dùng',
            message: 'Bạn có chắc chắn muốn khóa tài khoản của',
            description: 'Người dùng sẽ không thể đăng nhập vào hệ thống sau khi bị khóa. Bạn có thể mở khóa lại bất cứ lúc nào.',
            confirmText: 'Khóa tài khoản',
            iconBg: 'bg-yellow-100',
            iconColor: 'text-yellow-600',
            confirmBg: 'bg-yellow-600 hover:bg-yellow-700',
            borderColor: 'border-yellow-200',
        },
        unban: {
            icon: UserCheck,
            title: 'Mở khóa tài khoản người dùng',
            message: 'Bạn có chắc chắn muốn mở khóa tài khoản của',
            description: 'Người dùng sẽ có thể đăng nhập và sử dụng hệ thống trở lại.',
            confirmText: 'Mở khóa tài khoản',
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
            confirmBg: 'bg-green-600 hover:bg-green-700',
            borderColor: 'border-green-200',
        },
        delete: {
            icon: Trash2,
            title: 'Xóa dữ liệu',
            message: 'Bạn có chắc chắn muốn xóa',
            description: 'Hành động này không thể hoàn tác. Dữ liệu sẽ bị xóa vĩnh viễn khỏi hệ thống.',
            confirmText: 'Xóa dữ liệu',
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
            confirmBg: 'bg-red-600 hover:bg-red-700',
            borderColor: 'border-red-200',
        },
    };

    const currentConfig = config[type];
    const Icon = currentConfig.icon;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <Card className={`w-full max-w-md bg-white shadow-2xl rounded-2xl border-2 ${currentConfig.borderColor} overflow-hidden animate-in zoom-in-95 duration-200 py-0`}>
                {/* Header */}
                <div className="p-6 border-b-2 border-gray-100">
                    <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 ${currentConfig.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                            <Icon className={`h-6 w-6 ${currentConfig.iconColor}`} />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-bold text-gray-900">
                                {currentConfig.title}
                            </h2>
                            <button
                                onClick={() => onOpenChange(false)}
                                disabled={loading}
                                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                            >
                                <X className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                    <p className="text-gray-700">
                        {currentConfig.message}{' '}
                        <span className="font-bold text-gray-900">{userName}</span>?
                    </p>

                    <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                        <div className="flex items-start gap-2">
                            <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5 text-gray-600" />
                            <p className="text-sm text-gray-700">
                                {currentConfig.description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-gray-50 border-t border-gray-200 flex gap-3 justify-end">
                    <Button
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                        variant="outline"
                        className="px-5 py-2.5 border-2 border-gray-300 hover:bg-gray-100 font-semibold"
                    >
                        Hủy bỏ
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={loading}
                        className={`px-5 py-2.5 ${currentConfig.confirmBg} text-white shadow-lg hover:shadow-xl transition-all font-semibold`}
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Đang xử lý...
                            </>
                        ) : (
                            <>
                                <Icon className="h-4 w-4 mr-2" />
                                {currentConfig.confirmText}
                            </>
                        )}
                    </Button>
                </div>
            </Card>
        </div>
    );
}
