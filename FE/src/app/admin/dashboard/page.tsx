'use client';

import { DollarSign, ShoppingCart, Store, Users, TrendingUp, Package, BookOpen, GraduationCap, AlertTriangle, Activity } from 'lucide-react';
import { DashboardCard } from './components/DashboardCard';
import { RevenueChart } from './components/RevenueChart';
import { TopDishesChart } from './components/TopDishesChart';
import { RecentOrdersTable } from './components/RecentOrdersTable';
import { IngredientUsageChart } from './components/IngredientUsageChart';
import { SupplierDistributionChart } from './components/SupplierDistributionChart';
import { RecentRecipesCards } from './components/RecentRecipesCards';
import { TrainingStatusCard } from './components/TrainingStatusCard';
import { AlertsPanel } from './components/AlertsPanel';
import { ActivitiesTimeline } from './components/ActivitiesTimeline';
import {
    kpiData,
    revenueData,
    topDishesData,
    recentOrders,
    ingredientUsageData,
    supplierDistributionData,
    recentRecipesData,
    trainingStatsData,
    recentActivitiesData,
    lowStockAlertsData,
} from './mockData';

export default function DashboardPage() {
    const lowStockCount = lowStockAlertsData.length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
            <div className="max-w-[1600px] mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#EC6426] to-[#F8A91F] bg-clip-text text-transparent mb-2">
                            Tổng quan hệ thống
                        </h1>
                        <p className="text-gray-600 text-lg">Dashboard quản trị & phân tích dữ liệu</p>
                    </div>
                    <div className="text-sm text-gray-500">
                        Cập nhật: {new Date().toLocaleString('vi-VN')}
                    </div>
                </div>

                {/* ROW 1: KPI Overview (6 cards - 2 rows of 3) */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="w-5 h-5 text-[#EC6426]" />
                        <h2 className="text-xl font-semibold text-gray-800">Chỉ số hoạt động</h2>
                    </div>
                    {/* First row - 3 cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        <DashboardCard
                            title="Doanh thu hôm nay"
                            value={kpiData.revenueToday.value}
                            icon={DollarSign}
                            trend={kpiData.revenueToday.trend}
                            subtitle={kpiData.revenueToday.subtitle}
                        />
                        <DashboardCard
                            title="Tổng đơn hàng"
                            value={kpiData.totalOrders.value}
                            icon={ShoppingCart}
                            trend={kpiData.totalOrders.trend}
                            subtitle={kpiData.totalOrders.subtitle}
                        />
                        <DashboardCard
                            title="Chi nhánh hoạt động"
                            value={kpiData.activeBranches.value}
                            icon={Store}
                        />
                    </div>
                    {/* Second row - 3 cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <DashboardCard
                            title="Khách hàng mới"
                            value={kpiData.newCustomers.value}
                            icon={Users}
                            trend={kpiData.newCustomers.trend}
                            subtitle={kpiData.newCustomers.subtitle}
                        />
                        <DashboardCard
                            title="Nguyên liệu sắp hết"
                            value={lowStockCount}
                            icon={AlertTriangle}
                            subtitle="Cần nhập hàng"
                        />
                        <DashboardCard
                            title="Tỷ lệ hoàn thành"
                            value={`${trainingStatsData.completionRate}%`}
                            icon={GraduationCap}
                            subtitle="Đào tạo nhân viên"
                        />
                    </div>
                </div>

                {/* ROW 2: Analytics Charts */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <Package className="w-5 h-5 text-[#EC6426]" />
                        <h2 className="text-xl font-semibold text-gray-800">Phân tích bếp & Doanh thu</h2>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <RevenueChart data={revenueData} />
                        <IngredientUsageChart data={ingredientUsageData} />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <TopDishesChart data={topDishesData} />
                        <SupplierDistributionChart data={supplierDistributionData} />
                    </div>
                </div>

                {/* ROW 3: Recipe & Training Overview */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <BookOpen className="w-5 h-5 text-[#EC6426]" />
                        <h2 className="text-xl font-semibold text-gray-800">Công thức & Đào tạo</h2>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <RecentRecipesCards data={recentRecipesData} />
                        </div>
                        <div>
                            <TrainingStatusCard data={trainingStatsData} />
                        </div>
                    </div>
                </div>

                {/* ROW 4: Alerts + Recent Activities */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <Activity className="w-5 h-5 text-[#EC6426]" />
                        <h2 className="text-xl font-semibold text-gray-800">Cảnh báo & Hoạt động</h2>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <AlertsPanel alerts={lowStockAlertsData} />
                        <ActivitiesTimeline activities={recentActivitiesData} />
                    </div>
                </div>

                {/* Recent Orders Table */}
                <div>
                    <RecentOrdersTable orders={recentOrders} />
                </div>
            </div>
        </div>
    );
}
