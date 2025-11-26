'use client';

import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';

interface ConfirmDeleteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    itemName: string;
    loading?: boolean;
}

export function ConfirmDeleteDialog({ open, onOpenChange, onConfirm, itemName, loading = false }: ConfirmDeleteDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md border-2 border-red-200">
                <DialogHeader>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Trash2 className="h-6 w-6 text-red-600" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold text-gray-900">
                                Xóa dữ liệu
                            </DialogTitle>
                            <DialogDescription className="mt-1">
                                Bạn có chắc chắn muốn xóa <span className="font-bold text-gray-900">{itemName}</span>?
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="py-4">
                    <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                        <div className="flex items-start gap-2">
                            <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5 text-gray-600" />
                            <p className="text-sm text-gray-700">
                                Hành động này không thể hoàn tác. Dữ liệu sẽ bị xóa vĩnh viễn khỏi hệ thống.
                            </p>
                        </div>
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                        variant="outline"
                        className="border-2 border-gray-300 hover:bg-gray-100 font-semibold"
                    >
                        Hủy bỏ
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={loading}
                        className="bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all font-semibold"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Đang xử lý...
                            </>
                        ) : (
                            <>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Xóa dữ liệu
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
