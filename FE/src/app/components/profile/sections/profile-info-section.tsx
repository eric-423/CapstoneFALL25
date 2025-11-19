'use client';

import { LoadingSpinner } from '@/components/common/loading-spinner';
import { Card, CardContent } from '@/components/ui/card';
import { UserAuthData } from '@/utils/types/user.type';
import AddressManagementSection from './address-management-section';

import { Calendar, CircleUserRound, LucideUser, Mail, Phone, ShoppingBag } from 'lucide-react';

interface ProfileInfoSectionProps {
    user: UserAuthData;
    totalOrders?: number;
    totalEarnedPoints?: number;
    totalUsedPoints?: number;
    isLoading?: boolean;
}

export default function ProfileInfoSection({
    user,
    totalOrders,
    totalEarnedPoints = 0,
    totalUsedPoints = 0,
    isLoading,
}: ProfileInfoSectionProps) {
    return (
        <div className='space-y-6'>
            <Card className='bg-transparent shadow-none border-0'>
                {isLoading ? (
                    <div className='p-4 text-center'>
                        <LoadingSpinner />
                    </div>
                ) : (
                    <CardContent className='space-y-6'>
                        {/* User Avatar and Basic Info */}
                        <div className='space-y-2 items-center justify-items-center text-center'>
                            <CircleUserRound className='h-20 w-20' />
                            <h3 className='text-xl font-semibold'>{user?.fullName || 'Khách hàng'}</h3>
                            <div className='flex items-center gap-1'>
                                <Phone className='h-4 w-4' />
                                {user?.phoneNumber}
                            </div>
                        </div>

                        {/* Statistics */}
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                            <div className='bg-blue-50 p-4 rounded-lg'>
                                <div className='flex items-center gap-2'>
                                    <ShoppingBag className='h-5 w-5 text-blue-600' />
                                    <span className='text-sm font-medium text-blue-600'>Tổng đơn hàng</span>
                                </div>
                                <p className='text-2xl font-bold text-blue-900 mt-1'>{totalOrders || 0}</p>
                            </div>
                            <div className='bg-orange-50 p-4 rounded-lg'>
                                <div className='flex items-center gap-2'>
                                    <LucideUser className='h-5 w-5 text-[#C04A00]' />
                                    <span className='text-sm font-medium text-[#C04A00]'>Điểm đã kiếm</span>
                                </div>
                                <p className='text-2xl font-bold text-[#EC6426] mt-1'>
                                    {totalEarnedPoints.toLocaleString()} điểm
                                </p>
                            </div>
                            <div className='bg-rose-50 p-4 rounded-lg'>
                                <div className='flex items-center gap-2'>
                                    <LucideUser className='h-5 w-5 text-rose-600' />
                                    <span className='text-sm font-medium text-rose-600'>Điểm đã dùng</span>
                                </div>
                                <p className='text-2xl font-bold text-rose-800 mt-1'>
                                    {totalUsedPoints.toLocaleString()} điểm
                                </p>
                            </div>
                        </div>

                        {/* Edit Profile Form */}
                        {/* <ProfileForm user={{ name: user.fullName, phone: user.phoneNumber, email: '' }} /> */}
                    </CardContent>
                )}
            </Card>

            {/* Address Management Section */}
            {user?.id && <AddressManagementSection userId={user.id} />}
        </div>
    );
}