'use client';

import { ManagerGuard } from '@/components/guards';
import { useAuthContext } from '@/utils/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigation } from '@/utils/hooks/useNavigation';

export default function ManagerDashboardContent() {
    const { user } = useAuthContext();
    const { navigate } = useNavigation();

    return (
        <ManagerGuard>
            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white shadow rounded-lg p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Manager Dashboard
                                </h1>
                                <p className="text-gray-600">
                                    Chào mừng {user?.phoneNumber} - Role: {user?.role}
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="bg-orange-50 p-6 rounded-lg">
                                <h3 className="text-lg font-medium text-orange-900">📦 Quản lý đơn hàng</h3>
                                <p className="mt-2 text-orange-700">Xem và xử lý đơn hàng</p>
                                <Button className="mt-4" onClick={() => navigate('/manager/orders')}>
                                    Xem đơn hàng
                                </Button>
                            </div>

                            <div className="bg-teal-50 p-6 rounded-lg">
                                <h3 className="text-lg font-medium text-teal-900">🏪 Quản lý chi nhánh</h3>
                                <p className="mt-2 text-teal-700">Quản lý thông tin chi nhánh</p>
                                <Button className="mt-4" onClick={() => navigate('/manager/branch')}>
                                    Quản lý chi nhánh
                                </Button>
                            </div>

                            <div className="bg-indigo-50 p-6 rounded-lg">
                                <h3 className="text-lg font-medium text-indigo-900">📈 Báo cáo bán hàng</h3>
                                <p className="mt-2 text-indigo-700">Xem báo cáo bán hàng chi nhánh</p>
                                <Button className="mt-4" onClick={() => navigate('/manager/reports')}>
                                    Xem báo cáo
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ManagerGuard>
    );
}