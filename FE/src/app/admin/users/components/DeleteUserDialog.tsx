'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
} from '@/components/ui/dialog';
import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';

interface DeleteUserDialogProps {
    user: {
        id: number;
        fullName: string;
        phone: string;
        role: string;
    };
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function DeleteUserDialog({ user, open, onOpenChange }: DeleteUserDialogProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        setIsDeleting(true);

        // Simulate API call
        setTimeout(() => {
            toast.success(`🗑️ Đã xóa người dùng "${user.fullName}" thành công!`);
            setIsDeleting(false);
            onOpenChange(false);
        }, 1000);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] bg-white rounded-2xl p-0 overflow-hidden border-0 shadow-2xl">
                {/* Header with warning gradient */}
                <div className="bg-gradient-to-r from-red-500 to-red-600 p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                            <AlertTriangle className="text-white animate-pulse" size={32} strokeWidth={2.5} />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-bold text-white mb-1">
                                Xác nhận xóa người dùng
                            </DialogTitle>
                            <DialogDescription className="text-red-100 text-sm">
                                Hành động này không thể hoàn tác
                            </DialogDescription>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Warning message */}
                    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                        <p className="text-sm text-red-800 font-semibold mb-2">
                            ⚠️ Bạn có chắc chắn muốn xóa người dùng này?
                        </p>
                        <p className="text-xs text-red-600">
                            Tất cả dữ liệu liên quan đến người dùng này sẽ bị xóa vĩnh viễn và không thể khôi phục.
                        </p>
                    </div>

                    {/* User info */}
                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                        <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">
                            Thông tin người dùng
                        </h4>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                {user.fullName.charAt(0)}
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">{user.fullName}</p>
                                <p className="text-sm text-gray-600">{user.phone}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                            <span className="text-xs font-semibold text-gray-500">Vai trò:</span>
                            <span className={`px-3 py-1 text-xs font-bold rounded-full ${user.role === 'MANAGER' ? 'bg-blue-100 text-blue-700' :
                                    user.role === 'CUSTOMER' ? 'bg-green-100 text-green-700' :
                                        'bg-gray-100 text-gray-700'
                                }`}>
                                {user.role}
                            </span>
                        </div>
                    </div>

                    {/* Impact warning */}
                    <div className="space-y-2">
                        <p className="text-xs font-semibold text-gray-700">Dữ liệu sẽ bị xóa:</p>
                        <ul className="space-y-1.5 text-xs text-gray-600">
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                                Thông tin tài khoản và hồ sơ cá nhân
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                                Lịch sử đơn hàng và giao dịch
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                                Các quyền truy cập và phân quyền
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Footer */}
                <DialogFooter className="bg-gray-50 px-6 py-4 gap-3 sm:gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isDeleting}
                        className="border-2 border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold rounded-xl transition-all"
                    >
                        Hủy bỏ
                    </Button>
                    <Button
                        type="button"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                    >
                        {isDeleting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Đang xóa...
                            </>
                        ) : (
                            <>
                                <AlertTriangle size={18} className="mr-2" />
                                Xác nhận xóa
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
