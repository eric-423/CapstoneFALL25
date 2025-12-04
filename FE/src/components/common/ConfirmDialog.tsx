'use client';

import React from 'react';
import { AlertTriangle, CheckCircle2, Info, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export type ConfirmDialogVariant = 'destructive' | 'success' | 'warning' | 'info';

interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    title: string;
    content: React.ReactNode;
    alertMessage?: string;
    confirmText?: string;
    cancelText?: string;
    variant?: ConfirmDialogVariant;
    loading?: boolean;
    icon?: React.ElementType;
}

const variantConfig = {
    destructive: {
        icon: Trash2,
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
        borderColor: 'border-red-200',
        confirmBg: 'bg-red-600 hover:bg-red-700',
        alertBg: 'bg-red-50',
        alertBorder: 'border-red-200',
        alertText: 'text-red-800',
        alertIconColor: 'text-red-600',
    },
    success: {
        icon: CheckCircle2,
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600',
        borderColor: 'border-green-200',
        confirmBg: 'bg-green-600 hover:bg-green-700',
        alertBg: 'bg-green-50',
        alertBorder: 'border-green-200',
        alertText: 'text-green-800',
        alertIconColor: 'text-green-600',
    },
    warning: {
        icon: AlertTriangle,
        iconBg: 'bg-yellow-100',
        iconColor: 'text-yellow-600',
        borderColor: 'border-yellow-200',
        confirmBg: 'bg-yellow-600 hover:bg-yellow-700',
        alertBg: 'bg-yellow-50',
        alertBorder: 'border-yellow-200',
        alertText: 'text-yellow-800',
        alertIconColor: 'text-yellow-600',
    },
    info: {
        icon: Info,
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        borderColor: 'border-blue-200',
        confirmBg: 'bg-blue-600 hover:bg-blue-700',
        alertBg: 'bg-blue-50',
        alertBorder: 'border-blue-200',
        alertText: 'text-blue-800',
        alertIconColor: 'text-blue-600',
    },
};

export function ConfirmDialog({
    open,
    onOpenChange,
    onConfirm,
    title,
    content,
    alertMessage,
    confirmText = 'Xác nhận',
    cancelText = 'Hủy bỏ',
    variant = 'destructive',
    loading = false,
    icon,
}: ConfirmDialogProps) {
    const config = variantConfig[variant];
    const Icon = icon || config.icon;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={cn("sm:max-w-md border-2", config.borderColor)}>
                <DialogHeader>
                    <div className="flex items-center gap-4">
                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0", config.iconBg)}>
                            <Icon className={cn("h-6 w-6", config.iconColor)} />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold text-gray-900">
                                {title}
                            </DialogTitle>
                            <DialogDescription className="mt-1 text-base text-gray-600">
                                {content}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {alertMessage && (
                    <div className="py-4">
                        <div className={cn("p-4 rounded-lg border", config.alertBg, config.alertBorder)}>
                            <div className="flex items-start gap-2">
                                <AlertTriangle className={cn("h-5 w-5 flex-shrink-0 mt-0.5", config.alertIconColor)} />
                                <p className={cn("text-sm font-medium", config.alertText)}>
                                    {alertMessage}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                        variant="outline"
                        className="border-2 border-gray-300 hover:bg-gray-100 font-semibold"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={loading}
                        className={cn("text-white shadow-lg hover:shadow-xl transition-all font-semibold", config.confirmBg)}
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Đang xử lý...
                            </>
                        ) : (
                            <>
                                <Icon className="h-4 w-4 mr-2" />
                                {confirmText}
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
