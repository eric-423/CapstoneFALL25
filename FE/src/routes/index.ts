import configs from '@/configs';

import { createBrowserRouter } from 'react-router-dom';

const mainLayoutLazy = async () => ({
  Component: (await import('@/layout/MainLayout')).default,
});

const authLayoutLazy = async () => ({
  Component: (await import('@/layout/AuthLayout')).default,
});

const guestGuardLazy = async () => ({
  Component: (await import('@/guards/GuestGuard')).default,
});

const customerGuardLazy = async () => ({
  Component: (await import('@/guards/CustomerGuard')).default,
});

const authGuardLazy = async () => ({
  Component: (await import('@/guards/AuthGuard')).default,
});
const orderGuardLazy = async () => ({
  Component: (await import('@/guards/OrderGuard')).default,
});
const paymentGuardLazy = async () => ({
  Component: (await import('@/guards/PaymentGuard')).default,
});

// const managerGuardLazy = async () => ({
//   Component: (await import('@/guards/ManagerGuard')).default,
// });

// const adminGuardLazy = async () => ({
//   Component: (await import('@/guards/AdminGuard')).default,
// });

const router = createBrowserRouter([
  // Public routes
  {
    lazy: customerGuardLazy,
    children: [
      {
        lazy: mainLayoutLazy,
        children: [
          {
            path: configs.routes.home,
            lazy: async () => ({
              Component: (await import('@/pages/Home')).default,
            }),
          },
          {
            path: configs.routes.about,
            lazy: async () => ({
              Component: (await import('@/pages/About')).default,
            }),
          },
          {
            path: configs.routes.menu,
            lazy: async () => ({
              Component: (await import('@/pages/Menu')).default,
            }),
          },
        ],
      },
    ],
  },
  {
    lazy: guestGuardLazy,
    children: [
      {
        lazy: authLayoutLazy,
        children: [
          {
            path: configs.routes.login,
            lazy: async () => ({
              Component: (await import('@/pages/Login')).default,
            }),
          },
        ],
      },
    ],
  },
  // Authenticated routes
  {
    lazy: authGuardLazy,
    children: [
      {
        lazy: mainLayoutLazy,
        children: [
          {
            path: configs.routes.profile,
            lazy: async () => ({
              Component: (await import('@/pages/Profile')).default,
            }),
          },
        ],
      },
    ],
  },
  {
    lazy: orderGuardLazy,
    children: [
      {
        lazy: mainLayoutLazy,
        children: [
          {
            path: configs.routes.checkout,
            lazy: async () => ({
              Component: (await import('@/pages/Checkout')).default,
            }),
          },
        ],
      },
    ],
  },
  {
    lazy: paymentGuardLazy,
    children: [
      {
        lazy: mainLayoutLazy,
        children: [
          {
            path: configs.routes.paymentFailed,
            lazy: async () => ({
              Component: (await import('@/pages/PaymentResult')).PaymentFailed,
            }),
          },
          {
            path: configs.routes.paymentSuccess,
            lazy: async () => ({
              Component: (await import('@/pages/PaymentResult')).PaymentSuccess,
            }),
          },
        ],
      },
    ],
  },
  // Manager routes (public for UI testing)
  {
    path: '/manager',
    lazy: async () => ({
      Component: (await import('@/components/ui/manager/ManagerSidebar')).default,
    }),
    children: [
      {
        index: true,
        lazy: async () => ({
          Component: (await import('@/components/common/RedirectToDashboard')).default,
        }),
      },
      {
        path: 'dashboard',
        lazy: async () => ({
          Component: (await import('@/pages/manager/ManagerDashboard')).default,
        }),
      },
      {
        path: 'orders',
        lazy: async () => ({
          Component: (await import('@/pages/manager/orders/OrderManagement')).default,
        }),
      },
      // {
      //   path: 'promotions',
      //   lazy: async () => ({
      //     Component: (await import('@/pages/manager/promotions/PromotionManagement')).default,
      //   }),
      // },
      {
        path: 'staffs',
        lazy: async () => ({
          Component: (await import('@/pages/manager/staffs/EmployeeManagement')).default,
        }),
      },
      // {
      //   path: 'feedbacks',
      //   lazy: async () => ({
      //     Component: (await import('@/pages/manager/feedbacks/CustomerFeedbackManagement')).default,
      //   }),
      // },
      {
        path: 'products',
        lazy: async () => ({
          Component: (await import('@/pages/manager/products/ProductManagement')).default,
        }),
      },
      // {
      //   path: 'chat',
      //   lazy: async () => ({
      //     Component: (await import('@/pages/manager/chats/ChatManager')).default,
      //   }),
      // },
      {
        path: 'staffs/detail',
        lazy: async () => ({
          Component: (await import('@/pages/manager/staffs/DetailManageStaff')).default,
        }),
      },
      {
        path: 'profile',
        lazy: async () => ({
          Component: (await import('@/pages/manager/ManagerProfile')).default,
        }),
      },
    ],
  },
  // Admin routes (public for UI testing)
  {
    path: '/admin',
    lazy: async () => ({
      Component: (await import('@/components/ui/admin/AdminSidebar')).default,
    }),
    children: [
      {
        index: true,
        lazy: async () => ({
          Component: (await import('@/components/common/RedirectToAdminDashboard')).default,
        }),
      },
      {
        path: 'dashboard',
        lazy: async () => ({
          Component: (await import('@/pages/admin/ReportManagement')).default,
        }),
      },
      {
        path: 'users',
        lazy: async () => ({
          Component: (await import('@/pages/admin/UserManagement')).default,
        }),
      },
      {
        path: 'system-issues',
        lazy: async () => ({
          Component: (await import('@/pages/admin/SystemIssuesReport')).default,
        }),
      },
      {
        path: 'chat',
        lazy: async () => ({
          Component: (await import('@/pages/admin/ChatAdmin')).default,
        }),
      },
      {
        path: 'settings',
        lazy: async () => ({
          Component: (await import('@/pages/admin/Setting')).default,
        }),
      },
      {
        path: 'profile',
        lazy: async () => ({
          Component: (await import('@/pages/admin/AdminProfile')).default,
        }),
      },
    ],
  },
  // Not found route
  {
    path: configs.routes.notFound,
    lazy: async () => ({
      Component: (await import('@/pages/404')).default,
    }),
  },

  // Error routes
  {
    path: configs.routes.notFound,
    lazy: async () => ({
      Component: (await import('@/pages/404')).default,
    }),
  },
]);

export default router;
