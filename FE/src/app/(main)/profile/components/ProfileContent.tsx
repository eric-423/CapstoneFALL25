'use client';

import { ProtectedLayout } from '@/components/layouts/ProtectedLayout';
import { useAuthContext } from '@/utils/contexts/AuthContext';
import { useMemo } from 'react';
import { useCustomerOrders } from '@/utils/hooks/useCustomerOrders';

export default function ProfileContent() {
   const { user } = useAuthContext();
   const { orders, isLoadingOrders } = useCustomerOrders({ realtime: false, initialStatus: 'ALL' });

   const { totalEarnedPoints, totalUsedPoints } = useMemo(() => {
      return orders.reduce(
         (acc, order) => {
            const earned = typeof order.pointEarned === 'number' ? order.pointEarned : 0;
            const used = typeof order.pointUsed === 'number' ? order.pointUsed : 0;
            acc.totalEarnedPoints += earned;
            acc.totalUsedPoints += used;
            return acc;
         },
         { totalEarnedPoints: 0, totalUsedPoints: 0 },
      );
   }, [orders]);

   const formatPoints = (value: number) => `${value.toLocaleString()} điểm`;

   return (
      <ProtectedLayout>
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
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           <div className="border border-orange-100 bg-orange-50 rounded-xl p-4 shadow-sm">
                              <p className="text-sm font-semibold text-[#C04A00] uppercase tracking-wide">
                                 Tổng điểm đã kiếm
                              </p>
                              <p className="mt-2 text-3xl font-bold text-[#EC6426]">
                                 {isLoadingOrders ? '...' : formatPoints(totalEarnedPoints)}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                 Tích từ tất cả các đơn hàng đã hoàn tất
                              </p>
                           </div>
                           <div className="border border-orange-100 bg-white rounded-xl p-4 shadow-sm">
                              <p className="text-sm font-semibold text-[#8A3D00] uppercase tracking-wide">
                                 Tổng điểm đã dùng
                              </p>
                              <p className="mt-2 text-3xl font-bold text-[#C04A00]">
                                 {isLoadingOrders ? '...' : formatPoints(totalUsedPoints)}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                 Các điểm đã quy đổi ưu đãi/giảm giá
                              </p>
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
      </ProtectedLayout>
   );
}