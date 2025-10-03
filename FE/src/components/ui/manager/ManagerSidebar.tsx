import type { MenuProps } from 'antd';
import { Avatar, Button, Dropdown, Layout, Menu, message } from 'antd';
import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';

import logo from '../../../assets/full-logo-white.svg';

import {
  BarChartOutlined,
  BellOutlined,
  DownOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  ShoppingFilled,
  ShoppingOutlined,
  UserOutlined,
} from '@ant-design/icons';

import { removeAccessToken, removeRefreshToken } from '@/utils/cookies';

const { Header, Sider, Content } = Layout;

const ManagerSidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const siderWidth = 240;
  const siderCollapsedWidth = 80;

  const menuItems = [
    {
      key: '/manager/dashboard',
      icon: <BarChartOutlined />,
      label: 'Tổng quan',
    },
    {
      key: '/manager/orders',
      icon: <ShoppingFilled />,
      label: 'Quản lý đơn hàng',
    },
    {
      key: '/manager/products',
      icon: <ShoppingOutlined />,
      label: 'Quản lý sản phẩm',
    },
    // {
    //   key: "/manager/promotions",
    //   icon: <TagOutlined />,
    //   label: "Quản lý khuyến mãi",
    // },
    // {
    //   key: "/manager/feedbacks",
    //   icon: <MessageOutlined />,
    //   label: "Quản lý phản hồi",
    // },
    {
      key: '/manager/staffs',
      icon: <UserOutlined />,
      label: 'Quản lý nhân viên',
    },
    // {
    //   key: '/manager/chat',
    //   icon: <MessageOutlined />,
    //   label: 'Chat',
    // },
  ];

  const userMenuItems: MenuProps['items'] = [
    {
      key: '/manager/profile',
      label: 'Thông tin cá nhân',
      icon: <UserOutlined />,
    },
    {
      key: 'settingsMenu',
      label: 'Cài đặt',
      icon: <SettingOutlined />,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Đăng xuất',
      icon: <LogoutOutlined />,
      onClick: () => {
        // Xóa token ở localStorage và cookie
        localStorage.removeItem('access_token');
        // Import các hàm xóa token ở cookie
        // (nếu chưa import, thêm dòng sau ở đầu file)
        // import { removeAccessToken, removeRefreshToken } from '@/utils/cookies';
        removeAccessToken();
        removeRefreshToken();
        message.success('Đăng xuất thành công');
        router.push('/login');
      },
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width={siderWidth}
        collapsedWidth={siderCollapsedWidth}
        trigger={null}
        style={{
          backgroundColor: '#D97B41',
          boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)',
          position: 'fixed',
          height: '100vh',
          left: 0,
          top: 0,
          zIndex: 1000,
          overflowY: 'auto',
        }}
        className='aside-sidebar'
      >
        <div
          className='logo'
          style={{
            padding: '24px 16px',
            textAlign: 'center',
            borderBottom: '1px solid #E9C97B',
            marginBottom: '8px',
            background: '#D97B41',
            width: '100%',
          }}
        >
          <h2
            style={{
              color: '#fff',
              margin: 0,
              fontSize: collapsed ? '20px' : '24px',
              fontWeight: 'bold',
              transition: 'all 0.3s',
              letterSpacing: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '60px',
            }}
          >
            <Image
              src={logo}
              alt='logo'
              style={{
                maxWidth: collapsed ? '100px' : '230px',
                objectFit: 'contain',
                transition: 'all 0.3s',
              }}
            />
          </h2>
        </div>
        <Menu
          className='manager-menu'
          mode='inline'
          selectedKeys={pathname ? [pathname] : []}
          defaultOpenKeys={['orders', 'revenue']}
          onClick={({ key }) => router.push(key)}
          items={menuItems}
          style={{
            borderRight: 0,
            backgroundColor: '#D97B41',
          }}
        />
      </Sider>

      <Layout
        style={{
          marginLeft: collapsed ? siderCollapsedWidth : siderWidth,
          transition: 'margin-left 0.2s',
          minHeight: '100vh',
        }}
      >
        <Header
          style={{
            background: '#FFF3D6',
            display: 'flex',
            alignItems: 'center',
            padding: '0 24px',
            borderBottom: '1px solid #E9C97B',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            position: 'sticky',
            top: 0,
            zIndex: 999,
            height: '70px',
          }}
        >
          <Button
            type='text'
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
              color: '#D97B41',
              outline: 'none',
              border: 'none',
              background: 'transparent',
              position: 'absolute',
              left: collapsed ? '-10px' : '15px',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          />

          <div
            style={{
              marginLeft: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: 24,
            }}
          >
            <Button
              type='text'
              icon={<BellOutlined />}
              style={{
                fontSize: '18px',
                color: '#D97B41',
                width: 40,
                height: 40,
                outline: 'none',
                boxShadow: 'none',
                border: 'none',
                background: 'transparent',
              }}
            />

            <Dropdown menu={{ items: userMenuItems }} placement='bottomRight' arrow>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  transition: 'all 0.3s',
                  backgroundColor: 'transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#E9C97B';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Avatar
                  icon={<UserOutlined />}
                  style={{
                    backgroundColor: '#A05A2C',
                    color: '#fff',
                  }}
                />
                <span style={{ color: '#A05A2C', fontWeight: 600 }}>Quản trị viên</span>
                <DownOutlined style={{ color: '#A05A2C' }} />
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content
          style={{
            background: '#FFF3D6',
            minHeight: 280,
          }}
        >
          {/* Content will be rendered by Next.js pages */}
        </Content>
      </Layout>
    </Layout>
  );
};

export default ManagerSidebar;
