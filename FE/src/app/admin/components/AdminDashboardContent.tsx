'use client';

import { AdminGuard } from '@/components/guards';
import { useAuthContext } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigation } from '@/hooks/useNavigation';

export default function AdminDashboardContent() {
    const { user } = useAuthContext();
    const { navigate } = useNavigation();

    return (
        <AdminGuard>
            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white shadow rounded-lg p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Admin Dashboard
                                </h1>
                                <p className="text-gray-600">
                                    Chào mừng {user?.phoneNumber} - Role: {user?.role}
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="bg-blue-50 p-6 rounded-lg">
                                <h3 className="text-lg font-medium text-blue-900">👥 Quản lý người dùng</h3>
                                <p className="mt-2 text-blue-700">Xem và quản lý tất cả người dùng</p>
                                <Button className="mt-4" onClick={() => navigate('/admin/users')}>
                                    Xem danh sách
                                </Button>
                            </div>

                            <div className="bg-green-50 p-6 rounded-lg">
                                <h3 className="text-lg font-medium text-green-900">🍽️ Quản lý sản phẩm</h3>
                                <p className="mt-2 text-green-700">Thêm, sửa, xóa sản phẩm</p>
                                <Button className="mt-4" onClick={() => navigate('/admin/products')}>
                                    Quản lý sản phẩm
                                </Button>
                            </div>

                            <div className="bg-purple-50 p-6 rounded-lg">
                                <h3 className="text-lg font-medium text-purple-900">📊 Báo cáo thống kê</h3>
                                <p className="mt-2 text-purple-700">Xem báo cáo doanh thu và thống kê</p>
                                <Button className="mt-4" onClick={() => navigate('/admin/reports')}>
                                    Xem báo cáo
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminGuard>
    );
}