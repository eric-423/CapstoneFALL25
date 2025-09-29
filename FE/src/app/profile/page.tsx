'use client';

import ClientAuthGuard from '@/components/common/ClientAuthGuard';
import { useAuth } from '@/hooks';

export default function ProfilePage() {
    const { user } = useAuth();

    return (
        <ClientAuthGuard requireAuth={true}>
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white shadow rounded-lg p-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-6">
                            Hồ sơ cá nhân
                        </h1>

                        {user && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            ID người dùng
                                        </label>
                                        <div className="mt-1 p-3 border border-gray-300 rounded-md bg-gray-50">
                                            {user.id}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Số điện thoại
                                        </label>
                                        <div className="mt-1 p-3 border border-gray-300 rounded-md bg-gray-50">
                                            {user.phoneNumber}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Vai trò
                                        </label>
                                        <div className="mt-1 p-3 border border-gray-300 rounded-md bg-gray-50">
                                            {user.role}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Người dùng mới
                                        </label>
                                        <div className="mt-1 p-3 border border-gray-300 rounded-md bg-gray-50">
                                            {user.isNewUser ? 'Có' : 'Không'}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="button"
                                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        Chỉnh sửa thông tin
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ClientAuthGuard>
    );
}