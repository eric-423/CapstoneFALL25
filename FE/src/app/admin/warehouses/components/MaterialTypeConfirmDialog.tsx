'use client';

import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface MaterialTypeConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    materialTypeName: string;
    loading?: boolean;
}

export function MaterialTypeConfirmDialog({
    open,
    onOpenChange,
    onConfirm,
    materialTypeName,
    loading = false
}: MaterialTypeConfirmDialogProps) {
    if (!open) return null;

    const config = {
        icon: Trash2,
        title: 'Xóa loại nguyên liệu',
        message: 'Bạn có chắc chắn muốn xóa loại nguyên liệu',
        description: '⚠️ Lưu ý: Loại nguyên liệu sẽ bị xóa khỏi hệ thống. Hành động này có thể ảnh hưởng đến các nguyên liệu đang sử dụng loại này.',
        confirmText: 'Xóa loại nguyên liệu',
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
        confirmBg: 'bg-red-600 hover:bg-red-700',
        borderColor: 'border-red-200',
    };

    const Icon = config.icon;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <Card className={`w-full max-w-md bg-white shadow-2xl rounded-2xl border-2 ${config.borderColor} overflow-hidden animate-in zoom-in-95 duration-200`}>
                {/* Header */}
                <div className="p-6 border-b-2 border-gray-100">
                    <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 ${config.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                            <Icon className={`h-6 w-6 ${config.iconColor}`} />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-bold text-[#2D1E1A]">
                                {config.title}
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
                    <p className="text-[#2D1E1A]">
                        {config.message}{' '}
                        <span className="font-bold text-[#2D1E1A]">{materialTypeName}</span>?
                    </p>

                    <div className="p-4 rounded-lg bg-red-50 border-2 border-red-200">
                        <div className="flex items-start gap-2">
                            <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5 text-red-600" />
                            <p className="text-sm text-red-800 font-semibold">
                                {config.description}
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
                        className={`px-5 py-2.5 ${config.confirmBg} text-white shadow-lg hover:shadow-xl transition-all font-semibold`}
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Đang xử lý...
                            </>
                        ) : (
                            <>
                                <Icon className="h-4 w-4 mr-2" />
                                {config.confirmText}
                            </>
                        )}
                    </Button>
                </div>
            </Card>
        </div>
    );
}
