'use client';

import { ManagerGuard } from '@/components/guards';
import { Card } from '@/components/ui/card';
import { User } from 'lucide-react';

export default function ManagerProfilePage() {
    return (
        <ManagerGuard>
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <User className="h-8 w-8 text-[#EC6426]" />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Hồ sơ</h1>
                        <p className="text-sm text-gray-600">Thông tin cá nhân</p>
                    </div>
                </div>

                <Card className="p-6 bg-white border-0 shadow-sm rounded-xl">
                    <div className="text-center py-12">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">
                            Trang hồ sơ đang được phát triển
                        </h2>
                        <p className="text-gray-500">
                            Tính năng này sẽ sớm có mặt.
                        </p>
                    </div>
                </Card>
            </div>
        </ManagerGuard>
    );
}














