const routes = {
  home: '/',
  login: '/login',
  register: '/register',
  profile: '/profile',
  about: '/about',
  checkout: '/checkout',
  menu: '/menu',
  paymentSuccess: '/payment-success',
  paymentFailed: '/payment-failed',
  blogs: '/blog',
  blogDetails: '/blog/:id',
  editProfile: '/edit-profile',
  myOrders: '/my-orders',
  orderDetails: '/my-orders/:id',
  notFound: '*',
  landing: '/landing',
  user: '/:id',
  setting: '/setting',
  notVerifyEmail: '/not-verify-email',
  logout: '/logout',
};

export default routes;
