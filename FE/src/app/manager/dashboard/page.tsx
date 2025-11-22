'use client';

import { ManagerGuard } from '@/components/guards';
import { Card } from '@/components/ui/card';
import { LayoutDashboard } from 'lucide-react';

export default function ManagerDashboardPage() {
    return (
        <ManagerGuard>
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <LayoutDashboard className="h-8 w-8 text-[#EC6426]" />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Dashboard Manager</h1>
                        <p className="text-sm text-gray-600">Tổng quan hệ thống quản lý</p>
                    </div>
                </div>

                <Card className="p-6 bg-white border-0 shadow-sm rounded-xl">
                    <div className="text-center py-12">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                            Chào mừng đến với Dashboard Manager
                        </h2>
                        <p className="text-gray-500">
                            Trang dashboard đang được phát triển. Vui lòng sử dụng menu bên trái để điều hướng.
                        </p>
                    </div>
                </Card>
            </div>
        </ManagerGuard>
    );
}

