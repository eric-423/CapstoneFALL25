'use client';

import { LoadingSpinner } from '@/components/common/loading-spinner';
import { Card, CardContent } from '@/components/ui/card';
import { User } from '@/types/user.type';

import { Calendar, CircleUserRound, LucideUser, Mail, Phone, ShoppingBag } from 'lucide-react';

interface ProfileInfoSectionProps {
  user: User;
  totalOrders?: number;
  isLoading?: boolean;
}

export default function ProfileInfoSection({ user, totalOrders, isLoading }: ProfileInfoSectionProps) {
  return (
    <div className='space-y-6'>
      <Card>
        {isLoading ? (
          <div className='p-4 text-center'>
            <LoadingSpinner />
          </div>
        ) : (
          <CardContent className='space-y-6'>
            {/* User Avatar and Basic Info */}
            <div className='space-y-2 items-center justify-items-center text-center'>
              <CircleUserRound className='h-20 w-20' />
              <h3 className='text-xl font-semibold'>{user?.fullName}</h3>
              <div className='flex items-center gap-1'>
                <Phone className='h-4 w-4' />
                {user?.phone}
              </div>
              <div className='flex items-center gap-1'>
                {user?.email ? (
                  <>
                    <Mail className='h-4 w-4' /> {user?.email}
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>

            {/* Statistics */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='bg-blue-50 p-4 rounded-lg'>
                <div className='flex items-center gap-2'>
                  <ShoppingBag className='h-5 w-5 text-blue-600' />
                  <span className='text-sm font-medium text-blue-600'>Tổng đơn hàng</span>
                </div>
                <p className='text-2xl font-bold text-blue-900 mt-1'>{totalOrders}</p>
              </div>
              <div className='bg-green-50 p-4 rounded-lg'>
                <div className='flex items-center gap-2'>
                  <Calendar className='h-5 w-5 text-green-600' />
                  <span className='text-sm font-medium text-green-600'>Ngày tham gia</span>
                </div>
                <p className='text-lg font-semibold text-green-900 mt-1'>{user?.createdAt}</p>
              </div>
              <div className='bg-purple-50 p-4 rounded-lg'>
                <div className='flex items-center gap-2'>
                  <LucideUser className='h-5 w-5 text-purple-600' />
                  <span className='text-sm font-medium text-purple-600'>Trạng thái</span>
                </div>
                <p className='text-lg font-semibold text-purple-900 mt-1'>{user?.memberRank}</p>
              </div>
            </div>

            {/* Edit Profile Form */}
            {/* <ProfileForm user={{ name: user.fullName, phone: user.phone, email: user.email || '' }} /> */}
          </CardContent>
        )}
      </Card>
    </div>
  );
}
