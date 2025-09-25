'use client';

import { GET_ME_QUERY_KEY, getMe } from '@/apis/user.api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks';
import { useCustomerOrders } from '@/hooks/useCustomerOrders';
import useDocumentTitle from '@/hooks/useDocumentTitle';
import useScrollTop from '@/hooks/useScrollTop';

import { Lock, ShoppingBag, User } from 'lucide-react';
import { useState } from 'react';

import OrderHistorySection from './components/sections/order-history-section';
import PasswordChangeSection from './components/sections/password-change-section';
import ProfileInfoSection from './components/sections/profile-info-section';

import { useQuery } from '@tanstack/react-query';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile');
  const { user } = useAuth();
  useDocumentTitle('Tấm Tắc | Thông tin cá nhân');
  useScrollTop();

  const { orders, isLoadingOrders } = useCustomerOrders();

  const { data: userData, isLoading: isLoadingUserData } = useQuery({
    queryKey: [GET_ME_QUERY_KEY],
    queryFn: () => getMe(user?.id || 0),
    select: (data) => data.data.data,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return (
    <div className='py-8 px-4'>
      <div className='container mx-auto max-w-4xl'>
        <div className='mb-8 text-center'>
          <h1 className='text-3xl font-bold'>Thông tin cá nhân</h1>
          <p className='mt-2'>Quản lý thông tin tài khoản và lịch sử đơn hàng của bạn</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className='space-y-6'>
          <div className='block sm:hidden'>
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger className='w-full border-foreground'>
                <SelectValue>
                  {activeTab === 'profile' && (
                    <div className='flex items-center gap-2'>
                      <User className='h-4 w-4' />
                      Thông tin cá nhân
                    </div>
                  )}
                  {activeTab === 'password' && (
                    <div className='flex items-center gap-2'>
                      <Lock className='h-4 w-4' />
                      Đổi mật khẩu
                    </div>
                  )}
                  {activeTab === 'orders' && (
                    <div className='flex items-center gap-2'>
                      <ShoppingBag className='h-4 w-4' />
                      Lịch sử đơn hàng
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='profile'>
                  <div className='flex items-center gap-2'>
                    <User className='h-4 w-4' />
                    Thông tin cá nhân
                  </div>
                </SelectItem>
                <SelectItem value='password'>
                  <div className='flex items-center gap-2'>
                    <Lock className='h-4 w-4' />
                    Đổi mật khẩu
                  </div>
                </SelectItem>
                <SelectItem value='orders'>
                  <div className='flex items-center gap-2'>
                    <ShoppingBag className='h-4 w-4' />
                    Lịch sử đơn hàng
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <TabsList className='hidden sm:grid w-full grid-cols-3 h-11 bg-secondary/30 rounded-lg p-1'>
            <TabsTrigger
              value='profile'
              className='flex items-center gap-2 data-[state=active]:bg-foreground/80 data-[state=active]:text-white'
            >
              <User className='h-4 w-4' />
              Thông tin cá nhân
            </TabsTrigger>
            <TabsTrigger
              value='password'
              className='flex items-center gap-2 data-[state=active]:bg-foreground/80 data-[state=active]:text-white'
            >
              <Lock className='h-4 w-4' />
              Đổi mật khẩu
            </TabsTrigger>
            <TabsTrigger
              value='orders'
              className='flex items-center gap-2 data-[state=active]:bg-foreground/80 data-[state=active]:text-white'
            >
              <ShoppingBag className='h-4 w-4' />
              Lịch sử đơn hàng
            </TabsTrigger>
          </TabsList>

          {/* Profile Information Tab */}
          <TabsContent value='profile'>
            <ProfileInfoSection isLoading={isLoadingUserData} user={userData} totalOrders={orders.length} />
          </TabsContent>

          {/* Change Password Tab */}
          <TabsContent value='password'>
            <PasswordChangeSection />
          </TabsContent>

          {/* Order History Tab */}
          <TabsContent value='orders'>
            <OrderHistorySection orders={orders} isLoadingOrders={isLoadingOrders} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
