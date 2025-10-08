export const MOCK_DASHBOARD_STATS = {
  revenue: {
    daily: 15000000,
    weekly: 95000000,
    monthly: 380000000,
    growth: { daily: 12, weekly: 8, monthly: 15 },
  },
  orders: {
    total: 1250,
    pending: 45,
    completed: 1180,
    cancelled: 25,
    averageValue: 304000,
  },
  topBranches: [
    { id: 1, name: "Chi nhánh Quận 1", revenue: 120000000, orders: 450 },
    { id: 2, name: "Chi nhánh Quận 3", revenue: 95000000, orders: 380 },
  ],
  revenueChart: [
    { date: "2024-01-01", revenue: 12000000 },
    { date: "2024-01-02", revenue: 15000000 },
    { date: "2024-01-03", revenue: 13500000 },
    { date: "2024-01-04", revenue: 18000000 },
    { date: "2024-01-05", revenue: 16500000 },
  ],
};
