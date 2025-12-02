// Next.js App Router routes configuration
const routes = {
  // Public routes
  home: "/",
  about: "/about",
  menu: "/menu",

  // Auth routes
  login: "/login",
  register: "/register",
  logout: "/logout",

  // User routes (protected)
  profile: "/profile",
  editProfile: "/profile/edit",
  myOrders: "/my-orders",
  orderDetails: (id: string) => `/my-orders/${id}`,
  availablePromotions: "/promotions",

  // Shopping routes (protected)
  checkout: "/checkout",
  paymentSuccess: "/payment-success",
  paymentFailed: "/payment-failed",

  // Admin routes (admin only)
  admin: "/admin",
  adminDashboard: "/admin/dashboard",
  adminUsers: "/admin/users",
  adminOrders: "/admin/orders",
  adminProducts: "/admin/products",
  adminSettings: "/admin/settings",

  // Manager routes (manager + admin)
  manager: "/manager",
  managerDashboard: "/manager/dashboard",
  managerOrders: "/manager/orders",
  managerStaffs: "/manager/staffs",
  managerFeedbacks: "/manager/feedbacks",

  // Error pages
  notFound: "/404",
  forbidden: "/403",
  serverError: "/500",

  // Dynamic routes helpers
  user: (id: string) => `/user/${id}`,
  blog: "/blog",
  blogDetails: (id: string) => `/blog/${id}`,

  // External routes
  support: "/support",
  terms: "/terms",
  privacy: "/privacy",
} as const;

// Helper function to generate route with query params
export const createRoute = (path: string, params?: Record<string, string>) => {
  if (!params) return path;

  const searchParams = new URLSearchParams(params);
  return `${path}?${searchParams.toString()}`;
};

// Route groups for middleware
export const routeGroups = {
  public: ["/", "/about", "/menu", "/login", "/register"],
  protected: ["/profile", "/my-orders", "/checkout", "/promotions"],
  admin: ["/admin"],
  manager: ["/manager"],
  auth: ["/login", "/register"],
} as const;

export default routes;
