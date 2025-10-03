import type { MenuProps } from 'antd';
import { Avatar, Button, Dropdown, Layout, Menu, message } from 'antd';
import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';

import logo from '../../../assets/full-logo-white.svg';

import {
  BellOutlined,
  DownOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';

import { removeAccessToken, removeRefreshToken } from '@/utils/cookies';

const { Header, Sider, Content } = Layout;

const AdminSidebarGreenStyles = () => (
  <style>{`
    /* Nút menu đóng/mở sidebar */
    .admin-sidebar-toggle-btn {
      color: #4CAF50 !important;
    }
    .admin-sidebar-toggle-btn:hover {
      color: #2e7d32 !important;
    }
    /* Placeholder input tìm kiếm */
    input[placeholder="Tìm kiếm..."] {
      color: #2e7d32 !important;
    }
    input[placeholder="Tìm kiếm..."]::placeholder {
      color: #2e7d32 !important;
      opacity: 1;
    }
       .admin-bell-btn {
      color:rgb(26, 96, 28) !important;
      transition: color 0.2s;
    }
    .admin-bell-btn:hover {
      color: #2e7d32 !important;
      transition: color 0.2s;
    }
  `}</style>
);

const AdminSidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  // const { user: authUser, logout } = useAuthStore();

  const siderWidth = 250;
  const siderCollapsedWidth = 80;

  const menuItems = [
    // {
    //   key: '/admin/dashboard',
    //   icon: <DashboardOutlined />,
    //   label: 'Tổng quan',
    // },
    {
      key: '/admin/users',
      icon: <UserOutlined />,
      label: 'Tài khoản',
    },
    // {
    //   key: "stores",
    //   icon: <ShopOutlined />,
    //   label: "Quản lý cửa hàng",
    //   children: [
    //     {
    //       key: "/admin/stores",
    //       icon: <EyeOutlined />,
    //       label: "Danh sách cửa hàng",
    //     },
    //     {
    //       key: "/admin/stores/verify",
    //       icon: <CheckCircleOutlined />,
    //       label: "Xác nhận cửa hàng",
    //     }
    //   ],
    // },
    // {
    //   key: "/admin/users",
    //   icon: <TeamOutlined />,
    //   label: "Quản lý người dùng",
    // },
    // {
    //   key: "/admin/system-issues",
    //   icon: <AuditOutlined />,
    //   label: "Báo cáo hệ thống",
    // },
    // {
    //   key: "/admin/chat",
    //   icon: <MessageOutlined />,
    //   label: "Chat",
    // },
    {
      key: '/admin/settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt',
    },
  ];

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: 'Thông tin cá nhân',
      icon: <UserOutlined />,
      onClick: () => {
        router.push('/admin/profile');
      },
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
        localStorage.removeItem('access_token');
        removeAccessToken();
        removeRefreshToken();
        message.success('Đăng xuất thành công');
        router.push('/login');
      },
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AdminSidebarGreenStyles />
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width={siderWidth}
        collapsedWidth={siderCollapsedWidth}
        trigger={null}
        style={{
          backgroundColor: '#2E7D32',
          boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)',
          position: 'fixed',
          height: '100vh',
          left: 0,
          top: 0,
          zIndex: 1000,
          overflowY: 'auto',
        }}
        className='admin-sidebar'
      >
        <div
          className='logo'
          style={{
            padding: '24px 16px',
            textAlign: 'center',
            borderBottom: '1px solid #4CAF50',
            marginBottom: '8px',
            background: '#2E7D32',
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
                maxWidth: collapsed ? '100px' : '250px',
                objectFit: 'contain',
                transition: 'all 0.3s',
              }}
            />
          </h2>
        </div>
        <Menu
          className='admin-menu'
          mode='inline'
          selectedKeys={pathname ? [pathname] : []}
          defaultOpenKeys={['stores']}
          onClick={({ key }) => router.push(key)}
          items={menuItems}
          style={{
            borderRight: 0,
            backgroundColor: '#2E7D32',
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
            background: '#E8F5E9',
            display: 'flex',
            alignItems: 'center',
            padding: '0 24px',
            borderBottom: '1px solid #4CAF50',
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
            className='admin-sidebar-toggle-btn'
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
              outline: 'none',
              border: 'none',
              background: 'transparent',
              position: 'absolute',
              left: collapsed ? '-10px' : '10px',
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
              icon={<BellOutlined className='admin-bell-btn' />}
              style={{
                fontSize: '18px',
                color: '#2E7D32',
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
                  e.currentTarget.style.backgroundColor = '#4CAF50';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Avatar
                  icon={<UserOutlined />}
                  style={{
                    backgroundColor: '#1B5E20',
                    color: '#fff',
                  }}
                />
                <span style={{ color: '#1B5E20', fontWeight: 600 }}>{/* {authUser?.fullName} */}Admin</span>
                <DownOutlined style={{ color: '#1B5E20' }} />
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content
          style={{
            background: '#E8F5E9',
            minHeight: 280,
          }}
        >
          {/* Content will be rendered by Next.js pages */}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminSidebar;
